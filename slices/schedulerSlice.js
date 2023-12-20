import { WORKING_RACE_DATE_ACT } from "./actions/schedulerActions";

const initialState = {
  workingRaceDate: null,
  workingEventDate: null,
}

export default function schedulerReducer(state = initialState, action) {
  const {payload, type} = action;
  
  switch (type) {
    case WORKING_RACE_DATE_ACT: {
      console.log('payload ==========', payload)
      return {
        ...state,
        workingRaceDate: payload
      }
    }    
    default:
      return state
  }
}