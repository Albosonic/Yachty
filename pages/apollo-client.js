import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache, split } from '@apollo/client';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_HASURA_LINK,
});

const wsLink = new GraphQLWsLink(createClient({url: process.env.NEXT_PUBLIC_HASURA_WSS_LINK}));

const hasuralink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      "Content-Type": "application/json",
      "X-Hasura-Admin-Secret": process.env.NEXT_PUBLIC_HASURA_SECRET,
    },
  }
});

const splitLink = ApolloLink.split(({ query }) => {
    const definition = getMainDefinition(query);  
    return (definition.kind === 'OperationDefinition' && definition.operation === 'subscription');
  },
  hasuralink.concat(wsLink),
  hasuralink.concat(httpLink),
);



const cache = new InMemoryCache();

const client = new ApolloClient({
  // Provide required constructor fields
  cache: cache,
  link: splitLink,
  name: 'yachty-apollo-client',
  queryDeduplication: true,
});

export default client;
