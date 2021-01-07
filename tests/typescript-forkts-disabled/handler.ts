export const hello = async (event: any) => {
  const a = 1;
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v1.0! Your function executed successfully!`,
      input: event,
    }),
  };
};
