const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const timeout = 10000;
const errorString = "Error ------------------------------------------";

const packageCmd = ["package"];
const invokeCmd = ["invoke", "local", "-f", "hello"];

beforeEach(clearNpmCache);
afterAll(clearNpmCache);

test("base case", () => {
  const results = runSlsCommand("base");
  expect(results).not.toContain(errorString);
});

test("class properties", () => {
  const results = runSlsCommand("base");
  expect(results).not.toContain(errorString);
});

test("exclude externals", () => {
  const results = runSlsCommand("externals");
  expect(results).not.toContain(errorString);
});

test("nested lambda", () => {
  const results = runSlsCommand("nested-lambda");
  expect(results).not.toContain(errorString);
});

test("nested service", () => {
  const results = runSlsCommand("nested-service/services/main");
  expect(results).not.toContain(errorString);
});

test("check eslint", () => {
  const results = runSlsCommand("failed-eslint/service");
  expect(results).toContain(errorString);
});

test("override eslint", () => {
  const results = runSlsCommand("override-eslint");
  expect(results).not.toContain(errorString);
});

test("disable eslint", () => {
  const results = runSlsCommand("disable-eslint");
  expect(results).not.toContain(errorString);
});

test("test eslintignore", () => {
  const results = runSlsCommand("with-eslintignore");
  expect(results).not.toContain(errorString);
});

test("ignore warmup plugin", () => {
  const results = runSlsCommand("with-warmup", packageCmd);
  expect(results).not.toContain(errorString);
});

test("copy files", () => {
  const results = runSlsCommand("copy-files");
  expect(results).not.toContain(errorString);
  expect(
    fs.existsSync("tests/copy-files/.webpack/service/public/test.txt")
  ).toBe(true);
});

function clearNodeModules(cwd) {
  const { stdout, error } = spawnSync("rm", ["-rf", "node_modules/"], {
    cwd,
    timeout
  });

  if (error) {
    throw error;
  }
}

function doNpmInstall(cwd) {
  cwd = path.resolve(__dirname, cwd);
  const hasPackageJson = fs.existsSync(cwd + "/package.json");

  if (hasPackageJson) {
    clearNodeModules(cwd);

    const { stdout, error } = spawnSync("npm", ["install"], {
      cwd,
      timeout: 30000
    });

    if (error) {
      throw error;
    }
  }
}

function runSlsCommand(cwd, cmd) {
  doNpmInstall(cwd);

  cwd = path.resolve(__dirname, cwd);
  const { stdout, error } = spawnSync("serverless", cmd || invokeCmd, {
    cwd,
    timeout
  });

  if (error) {
    throw error;
  }

  const results = stdout.toString("utf8");
  console.log(results);

  return results;
}

function clearNpmCache() {
  const { stdout, error } = spawnSync("rm", ["-rf", "node_modules/.cache/"], {
    __dirname,
    timeout
  });

  if (error) {
    throw error;
  }

  return;
}
