import { combineReducers } from 'redux'

import authReducer from './authSlice'
import ycInfoReducer from './ycInfoSlice'

export const rootReducer = combineReducers({
  auth: authReducer,
  ycInfo: ycInfoReducer
})