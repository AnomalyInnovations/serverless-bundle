export const hello = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'NODE_ENV=' + process.env.NODE_ENV,
      input: event,
    }),
  };
};
