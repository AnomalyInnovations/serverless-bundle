const { runSlsCommand, clearNpmCache } = require("../helpers");
const { join } = require("path");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("typescript-project-references", async () => {
  const result = await runSlsCommand(join(__dirname, "service-foo"));

  expect(result).toContain("42, so they tell me");
});
