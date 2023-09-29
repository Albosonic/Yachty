import { UserProvider } from '@auth0/nextjs-auth0/client';
import { ApolloProvider } from '@apollo/client';
import client from './apollo-client';
import store from '@/store';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import '@/styles/globals.css';

let persistor = persistStore(store);

const App = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client} >
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <UserProvider>
            <Component {...pageProps} />
          </UserProvider>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
}

export default App;