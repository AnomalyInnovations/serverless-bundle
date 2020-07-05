const { promisify } = require("util");
const { exec } = require("child_process");

const execPromise = promisify(exec);
const TIMEOUT = 30000;

async function clearNpmCache(cwd) {
  await execPromise("rm -rf node_modules/.cache/", {
    cwd,
    TIMEOUT
  });
}

module.exports = clearNpmCache;
