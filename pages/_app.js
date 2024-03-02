import { ApolloProvider } from '@apollo/client';
import client from '@/lib/clients/apollo-client';
import { SessionProvider } from "next-auth/react"
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import '@/styles/globals.css';
import { ThemeProvider } from '@emotion/react';
import { theme } from '@/lib/theme/mui-theme';
import store from '@/lib/store';

let persistor = persistStore(store);
const App = ({ Component, pageProps: { session, ...pageProps } }) => {
  
  return (
    <ApolloProvider client={client} >
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <SessionProvider session={session}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ThemeProvider theme={theme}>
                <Component {...pageProps} />
              </ThemeProvider>
            </LocalizationProvider>
          </SessionProvider>
        </PersistGate>
      </Provider>
    </ApolloProvider>
  );
}

export default App;