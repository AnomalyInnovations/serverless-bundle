import Users from "./modules/users.gql";
import Messages from "./modules/messages.graphql";

export const hello = async (event, context) => {
  const statusCode =
    typeof Users !== "undefined" && typeof Messages !== "undefined" ? 200 : 500;
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      message:
        statusCode === 200
          ? "Go Serverless v1.0! Your function executed successfully!"
          : "Error importing graphql",
      input: event
    })
  };
};
