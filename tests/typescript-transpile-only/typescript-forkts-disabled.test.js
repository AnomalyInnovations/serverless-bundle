const { runSlsCommand, clearNpmCache } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

// Test that we are running eslint even with `transpileOnly: true` and that the
// package gets built even with TS errors.
test("typescript-transpile-only", async () => {
  expect.assertions(1);

  const eslintErrorString = "no-unused-vars";

  try {
    await runSlsCommand(__dirname);
  } catch (err) {
    expect(err.stdout).toContain(eslintErrorString);
  }
});
