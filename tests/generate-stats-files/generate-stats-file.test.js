const { existsSync } = require("fs");
const path = require("path");
const { runSlsCommand, clearNpmCache, errorRegex } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("generate-stats-files", async () => {
  const result = await runSlsCommand(__dirname);
  const statsFilePath = path.join(
    __dirname,
    ".webpack",
    "service",
    "bundle_stats.json"
  );

  const htmlStatsFilePath = path.join(
    __dirname,
    ".webpack",
    "service",
    "bundle_stats.html"
  );

  expect(result).not.toMatch(errorRegex);

  // Check if stats files have been generated
  expect(existsSync(statsFilePath)).toBe(true);
  expect(existsSync(htmlStatsFilePath)).toBe(true);
});
