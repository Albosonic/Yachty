import { CLEAR_NEW_RACE_FIELDS_ACT, EDIT_NEW_RACE_FIELD_ACT } from "./actions/workingRaceActions";

const initialState = { 
  courseId: null,
  raceCourseId: null,
  course: null,
  raceName: '',
  image: { src: null, fileDatum: null, imgKey: null },
  raceNameSet: false, 
  startDate: null,
  endDate: null,
  review: false,
  newRaceId: null,
  series: null,
  release: null,
};

export default function workingRaceReducer(state = initialState, action) {
  const {payload, type} = action;
  switch (type) {
    case EDIT_NEW_RACE_FIELD_ACT:
      let key = Object.keys(payload)[0]
      return {...state, [key]: payload[key] }
    case CLEAR_NEW_RACE_FIELDS_ACT:
      return {...initialState}
    default:
      return state
  }
}