import { DM_ROOMS_ACT, GLOBAL_NEW_MSG } from "./actions/msgActions";

const initialState = {
  dmRooms: [],
  globalNewMsg: false,
}

export default function msgReducer(state = initialState, action) {
  const {payload, type} = action;
  switch (type) {
    case DM_ROOMS_ACT: {
      return {
        ...state,
        dmRooms: [...payload]
      }
    }
    case GLOBAL_NEW_MSG: {
      return {
        ...state,
        globalNewMsg: payload,
      }
    }
    default:
      return state
  }
}