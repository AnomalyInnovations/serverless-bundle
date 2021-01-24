import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import "./assets/style.css";
import "./assets/style.scss";
import "./assets/react.png";

import imageUrl from "./assets/sst.svg"; //TODO: ReactComponent as Image,

const reactComponent = () => (
  <div>
    {/* <Image /> */}
    <h1>Go Serverless v1.0!</h1>
    <p>Your function executed successfully!</p>
    <img src={imageUrl} alt="Serverless Stack" />
  </div>
);

export const hello = async (event, context) => {
  const reactElement = createElement(reactComponent, {});
  const content = renderToStaticMarkup(reactElement);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: content,
      input: event,
      context: context
    })
  };
};
