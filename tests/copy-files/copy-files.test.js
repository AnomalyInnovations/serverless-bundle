const { runSlsCommand, clearNpmCache, errorRegex } = require("../helpers");
const { existsSync, statSync } = require("fs");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

const TEST_DIR = "tests/copy-files";
const WEBPACK_DIR = `${TEST_DIR}/.webpack`;

test("copy files - hello", async () => {
  const result = await runSlsCommand(__dirname);

  expect(result).not.toMatch(errorRegex);
  expect(existsSync(`${WEBPACK_DIR}/service/public/test.txt`)).toBe(true);
  expect(existsSync(`${WEBPACK_DIR}/service/bin/echo.sh`)).toBe(true);

  let fromStat = statSync(`${TEST_DIR}/public/test.txt`);
  let toStat = statSync(`${WEBPACK_DIR}/service/public/test.txt`);
  expect(toStat.mode).toBe(fromStat.mode);

  fromStat = statSync(`${TEST_DIR}/bin/echo.sh`);
  toStat = statSync(`${WEBPACK_DIR}/service/bin/echo.sh`);
  expect(toStat.mode).toBe(fromStat.mode);
});

test("copy files - world", async () => {
  const cmd = "invoke local -f world -l --data {}";
  const result = await runSlsCommand(__dirname, cmd);

  expect(result).not.toMatch(errorRegex);
  expect(existsSync(`${WEBPACK_DIR}/service/public/test.txt`)).toBe(true);
  expect(existsSync(`${WEBPACK_DIR}/service/bin/echo.sh`)).toBe(true);

  let fromStat = statSync(`${TEST_DIR}/public/test.txt`);
  let toStat = statSync(`${WEBPACK_DIR}/service/public/test.txt`);
  expect(toStat.mode).toBe(fromStat.mode);

  fromStat = statSync(`${TEST_DIR}/bin/echo.sh`);
  toStat = statSync(`${WEBPACK_DIR}/service/bin/echo.sh`);
  expect(toStat.mode).toBe(fromStat.mode);
});
