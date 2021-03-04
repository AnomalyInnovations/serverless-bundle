import { hi } from "@my-org/some-lib/index";
import { merhaba } from "./tsx/import";

export const hello = async (event: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v1.0! ${hi("Sandy")} ${merhaba(
        "Andy"
      )} Your function executed successfully!`,
      input: event,
    }),
  };
};
