const { spawn } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const isWindows = process.platform === 'win32';
const host = '127.0.0.1';
const port = 5173;
const startUrl = `http://${host}:${port}`;
const npmCommand = isWindows ? 'npm.cmd' : 'npm';
const viteArgs = ['run', 'dev', '--', '--host', host, '--port', String(port), '--strictPort'];

let electronProcess;
let shuttingDown = false;

function getElectronCommand() {
  if (isWindows) {
    const electronExe = path.join(projectRoot, 'node_modules', 'electron', 'dist', 'electron.exe');

    if (fs.existsSync(electronExe)) {
      return {
        command: electronExe,
        args: ['.'],
        shell: false,
      };
    }

    return {
      command: 'cmd.exe',
      args: ['/d', '/s', '/c', path.join(projectRoot, 'node_modules', '.bin', 'electron.cmd'), '.'],
      shell: false,
    };
  }

  return {
    command: path.join(projectRoot, 'node_modules', '.bin', 'electron'),
    args: ['.'],
    shell: false,
  };
}

function spawnDevServer() {
  if (isWindows) {
    return spawn('cmd.exe', ['/d', '/s', '/c', npmCommand, ...viteArgs], {
      cwd: projectRoot,
      stdio: 'inherit',
      windowsHide: false,
    });
  }

  return spawn(npmCommand, viteArgs, {
    cwd: projectRoot,
    stdio: 'inherit',
    shell: false,
  });
}

const vite = spawnDevServer();

function stopAll(exitCode = 0) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  if (electronProcess && !electronProcess.killed) {
    electronProcess.kill();
  }

  if (!vite.killed) {
    vite.kill();
  }

  process.exit(exitCode);
}

function waitForServer(retries = 80) {
  return new Promise((resolve, reject) => {
    const attempt = (remaining) => {
      const request = http.get(startUrl, (response) => {
        response.resume();
        resolve();
      });

      request.on('error', () => {
        if (remaining <= 0) {
          reject(new Error(`Vite dev server did not start at ${startUrl}`));
          return;
        }

        setTimeout(() => attempt(remaining - 1), 250);
      });

      request.setTimeout(1000, () => {
        request.destroy();
      });
    };

    attempt(retries);
  });
}

vite.on('error', (error) => {
  console.error(`Failed to run ${npmCommand}. Please make sure Node.js and npm are installed.`);
  console.error(error.message);
  stopAll(1);
});

vite.on('exit', (code) => {
  if (!shuttingDown && !electronProcess) {
    stopAll(code || 1);
  }
});

waitForServer()
  .then(() => {
    const electronCommand = getElectronCommand();

    electronProcess = spawn(electronCommand.command, electronCommand.args, {
      cwd: projectRoot,
      stdio: 'inherit',
      shell: electronCommand.shell,
      env: {
        ...process.env,
        ELECTRON_START_URL: startUrl,
      },
    });

    electronProcess.on('error', (error) => {
      console.error(`Failed to run ${electronCommand.command}. Please run npm install before starting the desktop app.`);
      console.error(error.message);
      stopAll(1);
    });

    electronProcess.on('exit', (code) => {
      stopAll(code || 0);
    });
  })
  .catch((error) => {
    console.error(error.message);
    stopAll(1);
  });

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));