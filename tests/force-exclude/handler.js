import sorted from "is-sorted";

export const hello = async (event, context) => {
  sorted([1, 2, 3]);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event
    })
  };
};
