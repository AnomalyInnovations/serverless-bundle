const path = require("path");
const { spawnSync } = require("child_process");

const timeout = 10000;
const errorString = 'Error ------------------------------------------';

beforeEach(clearNpmCache);
afterAll(clearNpmCache);

test("base case", () => {
  const results = runSlsCommand("tests/base");
  expect(results).not.toContain(errorString);
});

test("nested lambda", () => {
  const results = runSlsCommand("tests/nested-lambda");
  expect(results).not.toContain(errorString);
});

test("nested service", () => {
  const results = runSlsCommand("tests/nested-service/services/main");
  expect(results).not.toContain(errorString);
});

test("babel transform", () => {
  const results = runSlsCommand("tests/babel-transform");
  expect(results).toContain("Babel output: 42");
});

test("check eslint", () => {
  const results = runSlsCommand("tests/failed-eslint/service");
  expect(results).toContain(errorString);
});

test("override eslint", () => {
  const results = runSlsCommand("tests/override-eslint");
  expect(results).not.toContain(errorString);
});

test("disable eslint", () => {
  const results = runSlsCommand("tests/disable-eslint");
  expect(results).not.toContain(errorString);
});

test("test eslintignore", () => {
  const results = runSlsCommand("tests/with-eslintignore");
  expect(results).not.toContain(errorString);
});

test("ignore warmup plugin", () => {
  const results = runSlsCommand("tests/with-warmup");
  expect(results).not.toContain(errorString);
});

function runSlsCommand(cwd) {
  cwd = path.resolve(__dirname, cwd);
  const { stdout, error } = spawnSync(
    "serverless",
    ["invoke", "local", "-f", "hello"],
    { cwd, timeout }
  );

  if (error) {
    throw error;
  }

  const results = stdout.toString('utf8');
  console.log(results);

  return results;
}

function clearNpmCache() {
  const { stdout, error } = spawnSync(
    "rm",
    ["-rf", "node_modules/.cache/"],
    { __dirname, timeout }
  );

  if (error) {
    throw error;
  }

  return;
}
