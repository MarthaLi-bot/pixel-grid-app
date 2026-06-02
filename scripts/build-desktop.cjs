const { spawnSync } = require('node:child_process');

function run(command, args, env = process.env) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
  });

  if (result.error) {
    console.error(`Failed to run ${command}. Please run npm install before building the desktop app.`);
    console.error(result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const path = require('node:path');
const electronBuilderBin = process.platform === 'win32'
  ? path.join('node_modules', '.bin', 'electron-builder.cmd')
  : path.join('node_modules', '.bin', 'electron-builder');

run(npmCommand, ['run', 'build'], {
  ...process.env,
  BUILD_TARGET: 'desktop',
});

run(electronBuilderBin, ['--win', 'nsis', 'portable']);
