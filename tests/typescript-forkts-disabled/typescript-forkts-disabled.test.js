const { runSlsCommand, clearNpmCache } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

// Test that we are running eslint even though ForkTsCheckerWebpackPlugin is disabled
// Similar to the failed-eslint test
test("typescript-forkts-disabled", async () => {
  expect.assertions(1);

  const eslintErrorString = "no-unused-vars";

  try {
    await runSlsCommand(__dirname);
  } catch (err) {
    expect(err.stdout).toContain(eslintErrorString);
  }
});
