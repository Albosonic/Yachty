import { combineReducers } from 'redux'
import authReducer from './authSlice'
import ycInfoReducer from './ycInfoSlice'
import uxReducer from './uxSlice'
import msgReducer from './msgSlice'
import schedulerReducer from './schedulerSlice'
import workingRaceReducer from './workingRaceSlice'
import workingEventReducer from './workingEventSlice'

export const rootReducer = combineReducers({
  msgs: msgReducer,
  auth: authReducer,
  ux: uxReducer,
  scheduler: schedulerReducer,
  ycInfo: ycInfoReducer,
  workingRace: workingRaceReducer,
  workingEvent: workingEventReducer,
})