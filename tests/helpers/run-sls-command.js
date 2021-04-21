const { promisify } = require("util");
const { exec } = require("child_process");
const npmInstall = require("./npm-install");

const execPromise = promisify(exec);
const TIMEOUT = 30000;
const INVOKE_CMD = "invoke local -f hello -l --data {}";

async function runSlsCommand(cwd, cmd = INVOKE_CMD) {
  await npmInstall(cwd);

  const { stdout } = await execPromise(`serverless ${cmd}`, {
    cwd,
    TIMEOUT
  });

  return stdout.toString("utf8");
}

module.exports = runSlsCommand;
