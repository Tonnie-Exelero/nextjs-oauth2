import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Create a server-side Apollo client for use in Server Components
export function getClient() {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.GRAPHQL_URL || "http://localhost:3000/api/graphql",
      // Server-side requests don't need credentials
      credentials: "same-origin",
    }),
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache",
      },
    },
  });
}
