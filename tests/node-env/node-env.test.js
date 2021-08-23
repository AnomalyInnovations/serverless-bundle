const { runSlsCommand, clearNpmCache } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("node-env - production", async () => {
  const cmd = "invoke local -f hello -l --data {} --env NODE_ENV=production";
  const result = await runSlsCommand(__dirname, cmd);

  expect(result).toContain("NODE_ENV=production");
});

test("node-env - development", async () => {
  const cmd = "invoke local -f hello -l --data {} --env NODE_ENV=development";
  const result = await runSlsCommand(__dirname, cmd);

  expect(result).toContain("NODE_ENV=development");
});
