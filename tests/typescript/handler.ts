import { hi } from "@my-org/some-lib/index";
import { merhaba } from "./tsx/import";
import { Greeter, Rocket } from './decorated-class'

/* eslint-disable no-unused-vars */
export const typescript4Inject = <A extends []>(
  fn: (str: string, ...args: A) => any
) => (...a: A) => fn("test", ...a);
/* eslint-enable no-unused-vars */

export const hello = async (event: any) => {
  new Greeter("world");
  new Rocket().launch();

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
