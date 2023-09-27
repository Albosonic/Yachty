import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_LINK,
});

const hasuralink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "Content-Type": "application/json",
      "X-Hasura-Admin-Secret": process.env.NEXT_PUBLIC_HASURA_SECRET,
    },
  }
});


const cache = new InMemoryCache();

const client = new ApolloClient({
  // Provide required constructor fields
  cache: cache,
  link: hasuralink.concat(httpLink),
  // Provide some optional constructor fields
  name: 'yachty-apollo-client',
  queryDeduplication: true,
});

export default client;