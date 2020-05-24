import { doSomething } from "@my-org/some-lib";

export const hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: doSomething(),
      input: event
    })
  };
};
