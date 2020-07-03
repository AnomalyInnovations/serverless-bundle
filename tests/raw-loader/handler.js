import "./assets/text.txt";
import "./assets/pem.pem";
import "./assets/html.html";

export const hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event
    })
  };
};
