export const hello = async (event: any) => {
  const unsed = "I should be flagged as an unused variable"
  const thing = { a: 1, b: 2 }

  // Package with `transpileOnly: true` should ignore TypeScript errors.
  void thing.c
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v1.0! Your function executed successfully!`,
      input: event,
    }),
  };
};
