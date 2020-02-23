export const exampleResolver = {
  Query: {
    examples: (parent, params, context) => [
      {
        id: '1',
        name: 'This a test example'
      },
      {
        id: '2',
        name: 'This another test example'
      }
    ],

    getExample: (parent, params, context) => ({
      id: '1',
      name: 'This a test example'
    })
  }
}
