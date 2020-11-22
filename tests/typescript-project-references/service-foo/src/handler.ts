import { getMeaningOfLife } from "lib-bar";

export const hello = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: getMeaningOfLife(),
      input: event
    })
  };
};
