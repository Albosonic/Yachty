export const EDIT_NEW_RACE_FIELD_ACT = 'EDIT_NEW_RACE_FIELD_ACT';
export const CLEAR_NEW_RACE_FIELDS_ACT = 'CLEAR_NEW_RACE_FIELDS_ACT';
export const HYDRATE_WORKING_RACE_ACT = 'HYDRATE_WORKING_RACE_ACT';
export const CLEAR_WORKING_RACE_IMAGES_ACT = 'CLEAR_WORKING_RACE_IMAGES_ACT';
export const TOGGLE_RACE_IN_REVIEW_ACT = 'TOGGLE_RACE_IN_REVIEW_ACT';

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

export const hydrateWorkingRace = (race) => {
  return {
    type: HYDRATE_WORKING_RACE_ACT,
    payload: race,
  }
}

export const toggleInReview = (inReview) => {
  console.log('inReview ======', inReview)
  return {
    type: TOGGLE_RACE_IN_REVIEW_ACT,
    payload: inReview
  }
}

export const clearNewRaceFieldsAct = () => {
  return {
    type: CLEAR_NEW_RACE_FIELDS_ACT,
  }
}

export const clearWorkingRaceImagesAct = () => {
  return {
    type: CLEAR_WORKING_RACE_IMAGES_ACT,
  }
}