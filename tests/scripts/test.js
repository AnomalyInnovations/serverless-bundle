import asyncSum from './asyncSum';

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

it('sums numbers', async () => {
  const results = await asyncSum(1, 2);
  expect(results).toEqual(3);
});
