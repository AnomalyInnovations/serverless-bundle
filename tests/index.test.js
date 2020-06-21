const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const timeout = 30000;
const errorString = "Error ------";
const errorRegex = /(Error|Exception) ---/;
const eslintErrorString = "no-unused-vars";

const packageCmd = ["package"];
const invokeCmd = ["invoke", "local", "-f", "hello"];

beforeEach(clearNpmCache);
afterAll(clearNpmCache);

test("base case", () => {
  const results = runSlsCommand("base");
  expect(results).not.toMatch(errorRegex);
});

test("aliases", () => {
  const results = runSlsCommand("aliases");
  expect(results).not.toMatch(errorRegex);
});

test("class properties", () => {
  const results = runSlsCommand("class-properties");
  expect(results).not.toMatch(errorRegex);
});

test("externals with forceInclude", () => {
  const results = runSlsCommand("externals", packageCmd);
  expect(results).not.toMatch(errorRegex);
  // Ensure that knex is packaged as an external by default
  // And mysql is packaged because of forceInclude
  expect(results).toMatch(/Packing external modules: knex@\^[\d\.]+, mysql/);
});

test("forceExclude", () => {
  const results = runSlsCommand("force-exclude", packageCmd);
  expect(results).toContain("Excluding external modules: is-sorted");
});

test("ignore packages", () => {
  const results = runSlsCommand("ignore-packages");
  expect(results).not.toMatch(errorRegex);
});

test("nested lambda", () => {
  const results = runSlsCommand("nested-lambda");
  expect(results).not.toMatch(errorRegex);
});

test("nested service", () => {
  const results = runSlsCommand("nested-service/services/main");
  expect(results).not.toMatch(errorRegex);
});

test("nested services", () => {
  const results = runSlsCommand(
    "nested-services/services/service1",
    packageCmd
  );
  expect(results).not.toMatch(errorRegex);
});

test("check eslint", () => {
  const results = runSlsCommand("failed-eslint/service");
  expect(results).toContain(eslintErrorString);
});

test("override eslint", () => {
  const results = runSlsCommand("override-eslint");
  expect(results).not.toMatch(errorRegex);
});

test("disable eslint", () => {
  const results = runSlsCommand("disable-eslint");
  expect(results).not.toMatch(errorRegex);
});

test("test eslintignore", () => {
  const results = runSlsCommand("with-eslintignore");
  expect(results).not.toMatch(errorRegex);
});

test("ignore warmup plugin", () => {
  const results = runSlsCommand("with-warmup", packageCmd);
  expect(results).not.toMatch(errorRegex);
});

test("node 12", () => {
  const results = runSlsCommand("with-node12");
  expect(results).not.toMatch(errorRegex);
});

test("invalid runtime", () => {
  const results = runSlsCommand("invalid-runtime");
  expect(results).not.toMatch(errorRegex);
});

test("copy files", () => {
  const results = runSlsCommand("copy-files");
  expect(results).not.toMatch(errorRegex);
  expect(
    fs.existsSync("tests/copy-files/.webpack/service/public/test.txt")
  ).toBe(true);
});

test("fixpackages formidable@1.x", () => {
  const results = runSlsCommand("fixpackages-formidable");
  expect(results).not.toMatch(errorRegex);
});

test("isomorphic loaders", () => {
  const results = runSlsCommand("isomorphic-loaders");
  expect(results).not.toMatch(errorRegex);
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
      timeout
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
