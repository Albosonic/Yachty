import { MEMBER_OBJECT, NON_MEMBER_OBJECT } from "./actions/authActions"

export default function authReducer(state = {}, action) {
  const {payload, type} = action;
  switch (type) {
    case MEMBER_OBJECT: {
      return {...state, ...payload}
    }
    default:
      return state
  }
}