const { runSlsCommand, clearNpmCache, errorRegex } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("typescript-exclude-files", async () => {
  const result = await runSlsCommand(__dirname);

  expect(result).not.toMatch(
    "WARNING: More than one matching handlers found for 'handler'. Using 'handler.ts'."
  );
  expect(result).not.toMatch(errorRegex);
});
