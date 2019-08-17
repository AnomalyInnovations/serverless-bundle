/**
 * Test to make sure overriding Jest config works.
 * ./setupTests.js is set as `setupFilesAfterEnv` in
 * the package.json. It should be included before a
 * test is run.
 */
import asyncSum from './asyncSum';

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

it('sums numbers', async () => {
  const results = await asyncSum(1, 2);
  expect(results).toEqual(3);
});
