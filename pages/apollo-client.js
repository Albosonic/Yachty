import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: "https://native-puma-79.hasura.app/v1/graphql",
});

const hasuralink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "Content-Type": "application/json",
      "X-Hasura-Admin-Secret": "CCZX4iiKN1DvpFG3lk0AO8saVa986B4JYfRUJS7mqVoHob7SdDkE3r9JcczdWsuW",
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