const path = require("path");
const { spawnSync } = require("child_process");

const timeout = 10000;

test("base case", () => {
  const results = runSlsCommand("tests/base");
  expect(results).toBeDefined();
});

test("nested lambda", () => {
  const results = runSlsCommand("tests/nested-lambda");
  expect(results).toBeDefined();
});

test("nested service", () => {
  const results = runSlsCommand("tests/nested-service/services/main");
  expect(results).toBeDefined();
});

test("babel transform", () => {
  const results = runSlsCommand("tests/babel-transform");
  expect(results).toContain("Babel output: 42");
});

test("failed eslint", () => {
  const results = runSlsCommand("tests/failed-eslint");
  expect(results).toContain('Error ------------------------------------------');
});

test("override eslint", () => {
  const results = runSlsCommand("tests/override-eslint");
  expect(results).toBeDefined();
});

test("disable eslint", () => {
  const results = runSlsCommand("tests/disable-eslint");
  expect(results).toBeDefined();
});

test("with eslintignore", () => {
  const results = runSlsCommand("tests/with-eslintignore");
  expect(results).toBeDefined();
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
