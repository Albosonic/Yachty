import { CLEAR_NEW_RACE_FIELDS_ACT, CLEAR_WORKING_RACE_IMAGES_ACT, EDIT_NEW_RACE_FIELD_ACT, HYDRATE_WORKING_RACE_ACT, TOGGLE_RACE_INREVIEW_ACT, TOGGLE_RACE_IN_REVIEW_ACT } from "./actions/workingRaceActions";

const initialState = {
  inReview: false,
  raceId: '',
  course: null,
  raceName: '',
  image: {
    src: null,
    fileDatum: null,
    imgKey: null
  },
  raceNameSet: false,
  startDate: null,
  endDate: null,
  newRaceId: null,
  series: null,
  release: null,
  raceTicketsForPurchase: {
    id: null,
    cost: 0
  },
  existingImg: '',
  existingRace: false,
};

export default function workingRaceReducer(state = initialState, action) {
  const {payload, type} = action;
  switch (type) {
    case EDIT_NEW_RACE_FIELD_ACT:
      let key = Object.keys(payload)[0]
      return { ...state, [key]: payload[key] }
    case HYDRATE_WORKING_RACE_ACT: {      
      const {
        id,
        race_course: course,
        raceName,
        // raceTicketId,
        race_series: series,
        startDate,
        endDate,
        startTime,
        endTime,
        img,
        race_release_form: release,
        race_tickets_for_purchase: raceTicketsForPurchase,
      } = payload;
      console.log('course ========', payload)
      return {
        ...state,
        raceId: id,
        course,
        raceName,
        existingImg: img,
        startDate,
        endDate,
        startTime,
        endTime,
        series,
        release,
        raceTicketsForPurchase,
        existingRace: true,
      }
    }
    case TOGGLE_RACE_IN_REVIEW_ACT:
      return {
        ...state,
        inReview: payload
      }
    case CLEAR_NEW_RACE_FIELDS_ACT:
      return { ...initialState }
    case CLEAR_WORKING_RACE_IMAGES_ACT:
      return {
        ...state,
        inReview: false,
        existingImg: '',
        image: {
          src: null,
          fileDatum: null,
          imgKey: null
        }
      }
    default:
      return state
  }
}

// Understand or develop Requirements, think about architecture, research other instances of similar type features, and architecture, discuss with team if applicable, map out architecture, create data schema and populate mock data (if building full-stack). Structure basic Routes and Views, on the front end, query mock data from DB, review and refactor data from schema if needed, finally write business logic and draft Ui, check for ui/ux bugs, fix bugs, polish UI.

// A strong efficient and healthy work culture where the focus is on solving problems and building product features based on priority level. It's important to remain calm and focus on the next step, even when things seem rather ambiguous or unclear.