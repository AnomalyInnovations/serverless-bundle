class TestClass {
  attribute1;

  constructor(data) {
    this.attribute1 = data.attribute1 ?? "default";
    this.attribute2 = data.attribute2 ?? "default";
  }
}

export const hello = async (event, context) => {
  const a = new TestClass({ attribute1: "test" });

  console.log(a); // eslint-disable-line

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! Your function executed successfully!",
      input: event
    })
  };
};
