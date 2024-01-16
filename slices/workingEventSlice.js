import { CLEAR_NEW_EVENT_FIELDS_ACT, EDIT_NEW_EVENT_FIELD_ACT } from "./actions/workingEventActions";

const initialState = { 
  image: { src: null, fileDatum: null, imgKey: null },
  name: '',
  location: '',
  entertainment: '',
  startDate: null,
  endDate: null,
  specialNotes: '',
};

export default function workingEventReducer(state = initialState, action) {
  const {payload, type} = action;
  switch (type) {
    case EDIT_NEW_EVENT_FIELD_ACT:
      let key = Object.keys(payload)[0]
      return {...state, [key]: payload[key] }
    case CLEAR_NEW_EVENT_FIELDS_ACT:
      return {...initialState}
    default:
      return state
  }
}