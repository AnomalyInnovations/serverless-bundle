const { runSlsCommand, clearNpmCache, errorRegex } = require("../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("force-exclude", async () => {
  const result = await runSlsCommand(__dirname);

  expect(result).not.toMatch(errorRegex);
});

test("force-exclude package", async () => {
  const result = await runSlsCommand(__dirname, "package -c serverless.yml");

  expect(result).not.toMatch(errorRegex);

  /*
    Ensure that is-sorted and aws-sdk is excluded
  */
  expect(result).toMatch(
    /Excluding external modules: is-sorted@\^[\d\\.]+, aws-sdk@\^[\d\\.]+\n/
  );
});

test("force-exclude package (node18)", async () => {
  const result = await runSlsCommand(
    __dirname,
    "package -c serverless.node18.yml"
  );

  expect(result).not.toMatch(errorRegex);

  /*
    Ensure that is-sorted is excluded
  */
  expect(result).toMatch(/Excluding external modules: is-sorted@\^[\d\\.]+\n/);
});
