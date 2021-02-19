const { runSlsCommand, clearNpmCache, errorRegex } = require("../helpers");
const { existsSync, statSync } = require("fs");

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

  const fromStat = statSync("tests/copy-files/bin/echo.sh");
  const toStat = statSync("tests/copy-files/.webpack/service/bin/echo.sh");
  expect(toStat.mode).toBe(fromStat.mode);
});
