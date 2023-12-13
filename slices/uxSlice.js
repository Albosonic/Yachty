import { DEMO_EDIT_PROFILE_OPTION_ACT } from "./actions/uxActions";

const initialState = {  
  demo: {
    editPofileOption: false,
  }
}

export default function uxReducer(state = initialState, action) {
  const {payload, type} = action;
  switch (type) {
    case DEMO_EDIT_PROFILE_OPTION_ACT: {
      return {
        ...state, 
        demo: {
          editPofileOption: payload          
        }
      }
    }
    default:
      return state
  }
}