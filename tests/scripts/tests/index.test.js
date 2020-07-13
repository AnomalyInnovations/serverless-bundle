/**
 * Test to make sure overriding Jest config works.
 * ./setupTests.js is set as `setupFilesAfterEnv` in
 * the package.json. It should be included before a
 * test is run.
 */
import asyncSum from "../asyncSum";

it("dotenv set", () => {
  expect(process.env.TEST_VALUE).toEqual("123");
});

it("sums numbers", async () => {
  const results = await asyncSum(1, 2);
  expect(results).toEqual(3);
});
