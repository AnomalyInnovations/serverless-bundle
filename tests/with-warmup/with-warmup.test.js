const { runSlsCommand, clearNpmCache, errorRegex } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("ignore warmup plugin", async () => {
  const result = await runSlsCommand(__dirname, "package");

  expect(result).not.toMatch(errorRegex);
});
