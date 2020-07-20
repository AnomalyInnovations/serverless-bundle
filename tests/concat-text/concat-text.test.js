const fs = require("fs");
const { runSlsCommand, clearNpmCache, errorRegex } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("concat-text", async () => {
  const result = await runSlsCommand(__dirname);

  expect(result).not.toMatch(errorRegex);
  expect(
    fs.existsSync("tests/concat-text/.webpack/service/static/test-concat.txt")
  ).toBe(true);
});
