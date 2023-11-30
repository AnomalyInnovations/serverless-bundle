import sorted from "is-sorted";
import AWS from "aws-sdk";

export const hello = async (event) => {
  // Include a dummy AWS SDK call to ensure webpack attempts to bundle it
  AWS.config.update({
    region: "us-east-1",
  });
  sorted([1, 2, 3]);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event
    })
  };
};
