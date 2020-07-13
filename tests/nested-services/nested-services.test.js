const { runSlsCommand, clearNpmCache, errorRegex } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("nested services", async () => {
  const pathToNestedService = `${__dirname}/services/service1`;

  const result = await runSlsCommand(pathToNestedService, "package");

  expect(result).not.toMatch(errorRegex);
});
