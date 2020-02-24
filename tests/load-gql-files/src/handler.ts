import { ApolloServer } from 'apollo-server-lambda'
import schema from './schema'
import resolvers from './resolvers'

const server = new ApolloServer({
  typeDefs: schema,
  resolvers: resolvers,

  // By default, the GraphQL Playground interface and GraphQL introspection
  // is disabled in "production" (i.e. when `process.env.NODE_ENV` is `production`).
  //
  // If you'd like to have GraphQL Playground and introspection enabled in production,
  // the `playground` and `introspection` options must be set explicitly to `true`.
  playground: true,
  introspection: true
})

export const graphqlHandler = server.createHandler({
  cors: {
    origin: '*'
  }
})
