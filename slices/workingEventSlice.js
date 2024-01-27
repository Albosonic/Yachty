import { CLEAR_NEW_EVENT_FIELDS_ACT, EDIT_NEW_EVENT_FIELD_ACT, HYDRATE_WORKING_EVENT_ACT, TOGGLE_EVENT_IN_REVIEW_ACT } from "./actions/workingEventActions";

const initialState = {
  inReview: false,
  existingEvent: false,
  image: { src: null, fileDatum: null, imgKey: null },
  existingImage: '',
  name: '',
  location: '',
  startDate: null,
  endDate: null,
  entertainment: '',
  specialNotes: '',
};

export default function workingEventReducer(state = initialState, action) {
  const {payload, type} = action;
  switch (type) {
    case EDIT_NEW_EVENT_FIELD_ACT:
      let key = Object.keys(payload)[0]
      return { ...state, [key]: payload[key] }
    case HYDRATE_WORKING_EVENT_ACT:      
      const {
        image,
        event_name: name,        
        location,
        entertainment,
        startDate,
        endDate,
        specialNotes,
        id,
      } = payload
      
      return {
        ...state,
        existingEvent: true,
        existingImage: image,
        name,
        location,
        entertainment,
        startDate,
        endDate,
        specialNotes,
        eventId: id,
      }
    case TOGGLE_EVENT_IN_REVIEW_ACT:
      return {
        ...state,
        inReview: payload,
      }
    case CLEAR_NEW_EVENT_FIELDS_ACT:
      return { ...initialState }
    default:
      return state
  }
}