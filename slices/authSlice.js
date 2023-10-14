import { CLEAR_STATE, MEMBER_OBJECT, NON_MEMBER_OBJECT, UPDATE_LOGO, UPDATE_PROFILE_PICTURE } from "./actions/authActions"

const initialState = {
  member: {
    yachtClubByYachtClub: {
      id: '',
      name: '',
      region: '',
      logo: '',
      commodore: {
        member_id: '',
        name: '',
        id: '',
      },
    },
    email: '',
    firstName: '',
    lastName: '',
    id: '',
    name: '',
    profilePic: '',
  },
  user: {
    given_name: '',
    family_name: '',
    nickname: '',
    name: '',
    picture: '',
    locale: '',
    updated_at: '',
    email: '',
    email_verified: false,
    sub: '',
    sid: ''
  }
};

export default function authReducer(state = initialState, action) {
  const {payload, type} = action;
  switch (type) {
    case CLEAR_STATE: {
      return initialState;
    }
    case MEMBER_OBJECT: {
      payload.userIsCommodore = (payload?.member?.id === payload?.member?.yachtClubByYachtClub?.commodore?.member_id && payload?.member?.id !== undefined);
      payload.ycId = payload?.member?.yachtClubByYachtClub?.id;
      return {
        ...state, 
        user: {...payload.user},
        member: {
          ...payload.member,
          profilePic: payload.member?.profilePic || payload.user?.picture,
        }, 
      };
    }
    case NON_MEMBER_OBJECT: {
      return {...state, ...payload}
    }
    case UPDATE_LOGO: {
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
    case UPDATE_PROFILE_PICTURE: {
      console.log('payload here :', payload.pic);
      console.log('payload :', payload);
      return {
        ...state,
        member: {
          ...state.member,
          profilePic: payload,
        }
      }
    }
    default:
      return state
  }
}