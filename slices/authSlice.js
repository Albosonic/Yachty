import { CLEAR_STATE, MEMBER_OBJECT, NON_MEMBER_OBJECT, UPDATE_HULL_MATERIAL_ACT, UPDATE_IS_RACER, UPDATE_LOGO, UPDATE_PROFILE_PICTURE, UPDATE_VESSEL_IMAGE, UPDATE_VESSEL_SPECS_ACT, UPDATE_VESSEL_TYPE_ACT } from "./actions/authActions"

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
    vessels: [],
    isRacer: false,
    bio: '',
  },
  vessels: [
    {
      beam: null,
      draft: null,
      hullMaterial: '',
      id: '',
      img: null,
      length: null,
      ownerId: '',
      specialNotes: '',
      type: '',
      unafilliatedVesselId: null,
      vesselName: '',
      __typename: '',
      insuranceInfo: {
        no: '',
        company: '',
        expires: ''
      },
    }
  ],
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
      console.log('payload =====', payload)
      let userIsCommodore = (payload?.member?.id === payload?.member?.yachtClubByYachtClub?.commodore?.member_id && payload?.member?.id !== undefined);
      payload.ycId = payload?.member?.yachtClubByYachtClub?.id;
      return {
        ...state,
        user: {...payload.user, userIsCommodore: userIsCommodore },
        member: {
          ...payload.member,
          profilePic: payload.member?.profilePic || payload.user?.picture,
        },
      };
    }
    case UPDATE_VESSEL_IMAGE: {
      return {
        ...state,
        member: {
          ...state.member,
          vessels: [{
            ...state.member.vessels[0],
            img: payload,
          }]
        }
      }
    }
    case UPDATE_HULL_MATERIAL_ACT: {
      return {
        ...state,
        member: {
          ...state.member,
          vessels: [{
            ...state.member.vessels[0],
            hullMaterial: payload,
          }]
        }
      }
    }
    case UPDATE_VESSEL_SPECS_ACT: {
      const {vesselName, draft, length, beam} = payload;
      return {
        ...state,
        member: {
          ...state.member,
          vessels: [{
            ...state.member.vessels[0],
            vesselName,
            draft,
            length,
            beam,
          }]
        }
      }
    }
    case UPDATE_VESSEL_TYPE_ACT: {
      return {
        ...state,
        member: {
          ...state.member,
          vessels: [{
            ...state.member.vessels[0],
            type: payload,
          }]
        }
      }
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
      return {
        ...state,
        member: {
          ...state.member,
          profilePic: payload,
        }
      }
    }
    case UPDATE_IS_RACER: {
      return {
        ...state,
        member: {
          ...state.member,
          isRacer: payload,
        }
      }
    }
    default:
      return state
  }
}