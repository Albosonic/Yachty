import dayjs from "dayjs";

export const WORKING_RACE_DATE_ACT = 'WORKING_RACE_DATE_ACT';
export const WORKING_EVENT_DATE_ACT = 'WORKING_EVENT_DATE_ACT';

export const workingRaceDateAct = (workingDate) => {    
  return {
    type: WORKING_RACE_DATE_ACT,
    payload: workingDate
  }
}

export const workingEventDateAct = (workingDate) => {    
  return {
    type: WORKING_EVENT_DATE_ACT,
    payload: workingDate
  }
}
