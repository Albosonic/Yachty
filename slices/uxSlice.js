import { DEMO_EDIT_PROFILE_OPTION } from "./actions/uxActions";

const initialState = {  
  demo: {
    editPofileOption: false,
  }
}

export default function uxReducer(state = initialState, action) {
  const {payload, type} = action;
  switch (type) {
    case DEMO_EDIT_PROFILE_OPTION: {
      return {...state, demo: payload}
    }
    default:
      return state
  }
}