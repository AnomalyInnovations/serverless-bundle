const { runSlsCommand, clearNpmCache, errorRegex } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("externals all option", async () => {
  const result = await runSlsCommand(__dirname, "package");

  expect(result).not.toMatch(errorRegex);

  /*
    Ensure that array-first is packaged as a part of the "all" externals option
  */
  expect(result).toMatch(/Packing external modules: source-map-support, array-first@\^[\d\\.]+/);
});
