const { runSlsCommand, clearNpmCache } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("aliases-false", async () => {
  expect.assertions(1);

  const webpackErrorRegex = /"TypeError: is_sorted(.*)is not a function"/;

  try {
    await runSlsCommand(__dirname);
  } catch (err) {
    expect(err.stdout).toMatch(webpackErrorRegex);
  }
});
