const { runJestCommand, clearNpmCache } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("aliases-jest", async () => {
  const result = await runJestCommand(__dirname);

  // Ensure Jest ran the included tests successfully
  expect(result).not.toMatch(/failed/);
});
