const { runSlsCommand, clearNpmCache } = require("../../helpers");

beforeEach(async () => {
  await clearNpmCache(__dirname);
});

afterAll(async () => {
  await clearNpmCache(__dirname);
});

test("check eslint", async () => {
  expect.assertions(1);

  const eslintErrorString = "no-unused-vars";

  try {
    await runSlsCommand(__dirname);
  } catch (err) {
    expect(err.stdout).toContain(eslintErrorString);
  }
});
