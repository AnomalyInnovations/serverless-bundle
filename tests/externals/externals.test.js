const { runSlsCommand, clearNpmCache, errorRegex } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("externals with forceInclude", async () => {
  const result = await runSlsCommand(__dirname, "package");

  expect(result).not.toMatch(errorRegex);

  /*
    Ensure that knex is packaged as an external by default
    And mysql is packaged because of forceInclude
  */
  expect(result).toMatch(/Packing external modules: knex@\^[\d\\.]+, mysql/);
});
