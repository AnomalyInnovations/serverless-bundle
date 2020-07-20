import sum from "libs/sum";

const res = (body = {}) => ({
  statusCode: 200,
  body: JSON.stringify(body, null, 2)
});

export const hello = () =>
  res({
    sum: sum(1, 2, 3)
  });
