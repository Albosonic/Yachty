export const EDIT_NEW_EVENT_FIELD_ACT = 'EDIT_NEW_EVENT_FIELD_ACT'
export const CLEAR_NEW_EVENT_FIELDS_ACT = 'CLEAR_NEW_EVENT_FIELDS_ACT'
export const HYDRATE_WORKING_EVENT_ACT = 'HYDRATE_WORKING_EVENT_ACT'
export const TOGGLE_EVENT_IN_REVIEW_ACT = 'TOGGLE_EVENT_IN_REVIEW_ACT'
export const CLEAR_WORKING_EVENT_IMAGES_ACT = 'CLEAR_WORKING_EVENT_IMAGES_ACT';

export const EVENT_FIELDS = {  
  EVENT_NAME: 'EVENT_NAME',
  LOCATION: 'LOCATION',
  ENTERTAINMENT: 'ENTERTAINMENT',
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

export const clearWorkingEventImagesAct = () => {
  return {
    type: CLEAR_WORKING_EVENT_IMAGES_ACT,
  }
}

export const hydrateWorkingEventAct = (payload) => {
  return {
    type: HYDRATE_WORKING_EVENT_ACT,
    payload,
  }
}

export const toggleEventInReviewAct = (inReview) => {
  return {
    type: TOGGLE_EVENT_IN_REVIEW_ACT,
    payload: inReview,
  }
}