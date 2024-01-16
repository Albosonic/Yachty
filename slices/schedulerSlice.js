import { WORKING_EVENT_DATE_ACT, WORKING_RACE_DATE_ACT } from "./actions/schedulerActions";

const initialState = {
  workingRaceDate: null,
  workingEventDate: null,
}

export default function schedulerReducer(state = initialState, action) {
  const {payload, type} = action;
  
  switch (type) {
    case WORKING_RACE_DATE_ACT: {      
      return {
        ...state,
        workingRaceDate: payload
      }
    }
    case WORKING_EVENT_DATE_ACT: {
      return {
        ...state,
        workingEventDate: payload
      }
    }    
    default:
      return state
  }
}