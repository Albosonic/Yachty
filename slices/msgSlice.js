import { DM_ROOMS_ACT } from "./actions/msgActions";

const initialState = {
  dmRooms: []
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
    default:
      return state
  }
}