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

const desktopBuildEnv = {
  ...process.env,
  BUILD_TARGET: 'desktop',
  CSC_IDENTITY_AUTO_DISCOVERY: 'false',
};

// Desktop releases are intentionally unsigned. Remove explicit certificate
// variables too, so a developer's shell environment cannot make
// electron-builder invoke Windows signing helpers such as winCodeSign.
delete desktopBuildEnv.CSC_LINK;
delete desktopBuildEnv.CSC_KEY_PASSWORD;
delete desktopBuildEnv.WIN_CSC_LINK;
delete desktopBuildEnv.WIN_CSC_KEY_PASSWORD;

run(npmCommand, ['run', 'build'], desktopBuildEnv);

const builderTargets = process.argv.includes('--dir') ? ['dir'] : ['nsis', 'portable'];

run(electronBuilderBin, ['--win', ...builderTargets], desktopBuildEnv);
