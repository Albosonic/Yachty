import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ApolloProvider } from '@apollo/client';
import '@/styles/globals.css'
import client from './apollo-client';
import store from '@/store';
import { Provider } from 'react-redux';

const App = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client} >
      <Provider store={store}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </Provider>
    </ApolloProvider>
  );
}

export default App;