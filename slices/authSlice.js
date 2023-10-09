import { CLEAR_STATE, MEMBER_OBJECT, NON_MEMBER_OBJECT, UPDATE_LOGO } from "./actions/authActions"

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

export default function authReducer(state = initialState, action) {
  const {payload, type} = action;
  switch (type) {
    case CLEAR_STATE: {
      return {...initialState}
    }
    case MEMBER_OBJECT: {
      payload.userIsCommodore = payload?.member?.id === payload?.member?.yachtClubByYachtClub?.commodore?.member_id;
      payload.ycId = payload?.member?.yachtClubByYachtClub?.id;
      // payload.logo = payload?.member?.yachtClubByYachtClub?.logo;
      return {...state, ...payload};
    }
    case NON_MEMBER_OBJECT: {
      console.log('payload :', payload)
      return {...state, nonMemberObject: {...payload}}
    }
    case UPDATE_LOGO: {
      console.log('payload :', payload);
      return {
        ...state,
        member: {
          ...state.member,
          yachtClubByYachtClub: {
            ...state.member.yachtClubByYachtClub,
            logo: payload
          }
        }
      }
    }
    default:
      return state
  }
}