const { runSlsCommand, clearNpmCache, errorRegex } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("override-eslint", async () => {
  const result = await runSlsCommand(__dirname);

  expect(result).not.toMatch(errorRegex);
});
