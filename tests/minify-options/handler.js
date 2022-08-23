function namedFunction() {
  return null;
}

class NamedClass {}

export const hello = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      functionName: namedFunction.name,
      className: NamedClass.name,
    }),
  };
};
