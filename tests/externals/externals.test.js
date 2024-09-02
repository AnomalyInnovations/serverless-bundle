const { runSlsCommand, clearNpmCache, errorRegex } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("externals with forceInclude", async () => {
  const result = await runSlsCommand(__dirname, "package", true);

  expect(result).not.toMatch(errorRegex);

  /*
    Ensure that knex is packaged as an external by default
    And mysql is packaged because of forceInclude
  */
  expect(result).toContain("Packing external modules: knex@^3.1.0, mysql");
});
