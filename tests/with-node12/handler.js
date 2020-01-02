class User {
	#counter = 0;

	increment() {
		this.#counter++;
	}

	get count() {
		return this.#counter;
	}
}

const user = new User();

export const hello = async (event, context) => {
  user.increment();
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v1.0! Your function executed successfully! Count is ${user.count}`,
      input: event,
    }),
  };
};
