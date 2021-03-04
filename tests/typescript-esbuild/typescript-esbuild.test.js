const { runSlsCommand, clearNpmCache } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("typescript-esbuild", async () => {
  const result = await runSlsCommand(__dirname);

  expect(result).toContain("Imported successfully");
  expect(result).toContain("Merhaba");
});
