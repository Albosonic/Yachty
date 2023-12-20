import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga'
import storage from 'redux-persist/lib/storage';
import { rootReducer } from '@/slices/rootReducer';

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import msgSaga from './sagas/msg-saga';

const sagaMiddleware = createSagaMiddleware()

const persistConfig = {
  key: 'auth',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return (
      getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(sagaMiddleware)
    );
  },
});

sagaMiddleware.run(msgSaga)

export default store