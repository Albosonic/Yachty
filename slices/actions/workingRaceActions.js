export const EDIT_NEW_RACE_FIELD_ACT = 'EDIT_NEW_RACE_FIELD_ACT';
export const CLEAR_NEW_RACE_FIELDS_ACT = 'CLEAR_NEW_RACE_FIELDS_ACT';

export const RACE_FIELDS = {
  SERIES: 'SERIES',
  RACE_NAME: 'RACE_NAME',
  COURSE: 'COURSE',
  START_DATE: 'START_DATE',
  END_DATE: 'END_DATE',
  RELEASE: 'RELEASE',
  IMAGE: 'IMAGE',
}

export const makeNewRaceFieldAct = (payload) => {
  return {
    type: EDIT_NEW_RACE_FIELD_ACT,
    payload,
  }
}

export const clearNewRaceFieldsAct = () => {
  return {
    type: CLEAR_NEW_RACE_FIELDS_ACT,
  }
}