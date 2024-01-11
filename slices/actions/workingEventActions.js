export const EDIT_NEW_EVENT_FIELD_ACT = 'EDIT_NEW_EVENT_FIELD_ACT';
export const CLEAR_NEW_EVENT_FIELDS_ACT = 'CLEAR_NEW_EVENT_FIELDS_ACT';

export const EVENT_FIELDS = {  
  EVENT_NAME: 'EVENT_NAME',
  LOCATION: 'LOCATION',
  START_DATE: 'START_DATE',
  END_DATE: 'END_DATE',  
  SPECIAL_NOTES: 'SPECIAL_NOTES',
  IMAGE: 'IMAGE',
}

export const makeNewEventFieldAct = (payload) => {
  return {
    type: EDIT_NEW_EVENT_FIELD_ACT,
    payload,
  }
}

export const clearNewEventFieldsAct = () => {
  return {
    type: CLEAR_NEW_EVENT_FIELDS_ACT,
  }
}