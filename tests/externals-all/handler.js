const first = require("array-first");

export const hello = async event => {
  const item = first(["a", "b", "c", "d", "e", "f"]);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v1.0! Your function executed successfully! ${item}`,
      input: event
    })
  };
};
