import stripePackage from "stripe";

export const hello = async (event, context) => {
  const stripe = stripePackage("ABC"); // eslint-disable-line
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event
    })
  };
};
