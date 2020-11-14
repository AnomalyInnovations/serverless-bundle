const { runSlsCommand, clearNpmCache } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("typescript invalid module", async () => {
  const result = await runSlsCommand(__dirname);

  expect(result).toContain("CommonJS, ES3, or ES5 are not supported");
});
