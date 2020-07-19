import { hello } from "../handler";

test("hello returns sum equal 6 in body", () => {
  const expected = 6;
  const actual = JSON.parse(hello().body).sum;

  expect(actual).toBe(expected);
});
