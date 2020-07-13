const { promisify } = require("util");
const { exec } = require("child_process");
const npmInstall = require("./npm-install");

const execPromise = promisify(exec);
const TIMEOUT = 30000;

async function runJestCommand(cwd) {
  await npmInstall(cwd);

  const { stdout } = await execPromise("npm test", {
    cwd,
    TIMEOUT
  });

  return stdout.toString("utf8");
}

module.exports = runJestCommand;
