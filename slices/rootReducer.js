import { combineReducers } from 'redux'

import authReducer from './authSlice'
import ycInfoReducer from './ycInfoSlice'
import uxReducer from './uxSlice'
import msgReducer from './msgSlice'

export const rootReducer = combineReducers({
  msgs: msgReducer,
  auth: authReducer,
  ux: uxReducer,
  ycInfo: ycInfoReducer
})