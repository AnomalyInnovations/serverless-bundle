const { runSlsCommand, clearNpmCache } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("typescript-no-baseUrl", async () => {
  const result = await runSlsCommand(__dirname, "package", true);

  expect(result).not.toMatch(/Failed to load/);
  expect(result).not.toMatch(/Found no baseUrl/);
});
