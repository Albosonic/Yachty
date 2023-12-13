import { combineReducers } from 'redux'

import authReducer from './authSlice'
import ycInfoReducer from './ycInfoSlice'
import uxReducer from './uxSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  ux: uxReducer,
  ycInfo: ycInfoReducer
})