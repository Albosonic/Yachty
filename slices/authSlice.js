import { MEMBER_OBJECT, NON_MEMBER_OBJECT, UPDATE_LOGO } from "./actions/authActions"

const initialState = {
  email: '',
  firstName: '',
  id: '',
  lastName: '',
  name: '',
  userIsCommodore: false,
  ycId: '',
  logo: '',
  yachtClubByYachtClub: {
    id: '',
    logo: '',
    name: '',
    region: '',
    commodore: {
      id: '',
      member_id: '',
      name: '',
    }
  }
}

export default function authReducer(state = {}, action) {
  const {payload, type} = action;
  switch (type) {
    case MEMBER_OBJECT:
      payload.userIsCommodore = payload?.member?.id === payload?.member?.yachtClubByYachtClub?.commodore?.member_id;
      payload.ycId = payload?.member?.yachtClubByYachtClub?.id;
      payload.logo = payload?.member?.yachtClubByYachtClub?.logo;
      return {...state, ...payload};
    default:
      return state
  }
}