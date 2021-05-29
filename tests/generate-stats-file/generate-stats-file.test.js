const { existsSync } = require("fs");
const path = require("path");
const { runSlsCommand, clearNpmCache, errorRegex } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("generate-stats-file", async () => {
  const result = await runSlsCommand(__dirname);
  const statsFilePath = path.join(
    __dirname,
    ".webpack",
    "service",
    "stats.json"
  );

  expect(result).not.toMatch(errorRegex);

  // Check if `stats.json` file was generated
  expect(existsSync(statsFilePath)).toBe(true);
});
