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
  const result = await runSlsCommand(
    __dirname,
    "package -c serverless.yml",
    true
  );

  console.log(result);

  expect(result).not.toMatch(errorRegex);

  /*
    Ensure that is-sorted and aws-sdk is excluded
  */
  expect(result).toContain("Excluding external modules: is-sorted@");
});

test("force-exclude package (node18)", async () => {
  const result = await runSlsCommand(
    __dirname,
    "package -c serverless.node18.yml",
    true
  );

  expect(result).not.toMatch(errorRegex);

  /*
    Ensure that is-sorted is excluded
  */
  expect(result).toContain("Excluding external modules: is-sorted@");
});
