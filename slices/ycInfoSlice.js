import { SET_YC_REGION } from "./actions/ycInfoActions";


export default function ycInfoReducer(state = {}, action) {
  const {payload, type} = action;
  switch (type) {
    case SET_YC_REGION: {
      return {...state, selectedYCRegion: {...payload}}
    }
    default:
      return state
  }
}