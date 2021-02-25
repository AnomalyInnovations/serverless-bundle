const { runSlsCommand, clearNpmCache, errorRegex } = require("../helpers");
const { existsSync, statSync } = require("fs");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("copy files - hello", async () => {
  const result = await runSlsCommand(__dirname);

  expect(result).not.toMatch(errorRegex);
  expect(existsSync("tests/copy-files/.webpack/hello/public/test.txt")).toBe(
    true
  );
  expect(existsSync("tests/copy-files/.webpack/hello/bin/echo.sh")).toBe(true);

  let fromStat = statSync("tests/copy-files/public/test.txt");
  let toStat = statSync("tests/copy-files/.webpack/hello/public/test.txt");
  expect(toStat.mode).toBe(fromStat.mode);

  fromStat = statSync("tests/copy-files/bin/echo.sh");
  toStat = statSync("tests/copy-files/.webpack/hello/bin/echo.sh");
  expect(toStat.mode).toBe(fromStat.mode);
});

test("copy files - world", async () => {
  const cmd = "invoke local -f world -l --data {}";
  const result = await runSlsCommand(__dirname, cmd);

  expect(result).not.toMatch(errorRegex);
  expect(existsSync("tests/copy-files/.webpack/world/public/test.txt")).toBe(
    true
  );
  expect(existsSync("tests/copy-files/.webpack/world/bin/echo.sh")).toBe(true);

  let fromStat = statSync("tests/copy-files/public/test.txt");
  let toStat = statSync("tests/copy-files/.webpack/world/public/test.txt");
  expect(toStat.mode).toBe(fromStat.mode);

  fromStat = statSync("tests/copy-files/bin/echo.sh");
  toStat = statSync("tests/copy-files/.webpack/world/bin/echo.sh");
  expect(toStat.mode).toBe(fromStat.mode);
});
