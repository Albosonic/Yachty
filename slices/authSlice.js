import { MEMBER_OBJECT, NON_MEMBER_OBJECT } from "./actions/authActions"

const initialState = {
  email: '',
  firstName: '',
  id: '',
  lastName: '',
  name: '',
  userIsCommodore: false,
  ycId: '',
  logo: '',
  nonMemberObject: {

  },
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
    case NON_MEMBER_OBJECT: {
      console.log('payload :', payload)
      return {...state, nonMemberObject: {...payload}}
    }
    default:
      return state
  }
}