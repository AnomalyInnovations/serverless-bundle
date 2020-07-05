const { runSlsCommand, clearNpmCache, errorRegex } = require("../helpers");
const { existsSync } = require("fs");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("copy files", async () => {
  const result = await runSlsCommand(__dirname);

  expect(result).not.toMatch(errorRegex);
  expect(existsSync("tests/copy-files/.webpack/service/public/test.txt")).toBe(
    true
  );
});
