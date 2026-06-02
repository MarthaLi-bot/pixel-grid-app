const { spawn } = require('node:child_process');
const http = require('node:http');
const path = require('node:path');

const host = '127.0.0.1';
const port = 5173;
const startUrl = `http://${host}:${port}`;
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const electronBin = process.platform === 'win32'
  ? path.join('node_modules', '.bin', 'electron.cmd')
  : path.join('node_modules', '.bin', 'electron');

const vite = spawn(npmCommand, ['run', 'dev', '--', '--host', host, '--port', String(port), '--strictPort'], {
  stdio: 'inherit',
  shell: false,
});

let electronProcess;
let shuttingDown = false;

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

vite.on('exit', (code) => {
  if (!shuttingDown && !electronProcess) {
    stopAll(code || 1);
  }
});

waitForServer()
  .then(() => {
    electronProcess = spawn(electronBin, ['.'], {
      stdio: 'inherit',
      shell: false,
      env: {
        ...process.env,
        ELECTRON_START_URL: startUrl,
      },
    });

    electronProcess.on('error', (error) => {
      console.error(`Failed to run ${electronBin}. Please run npm install before starting the desktop app.`);
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
