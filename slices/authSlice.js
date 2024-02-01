import { BETA_USER_IS_COMMODORE, CLEAR_STATE, INTRO_SEEN, MEMBER_OBJECT, NON_MEMBER_OBJECT, UPDATE_HULL_MATERIAL_ACT, UPDATE_IS_RACER, UPDATE_LOGO, UPDATE_MEMBER_BIO_ACT, UPDATE_MEMBER_NAME_ACT, UPDATE_NEW_VESSEL_ACT, UPDATE_PROFILE_PICTURE, UPDATE_VESSEL_IMAGE, UPDATE_VESSEL_SPECS_ACT, UPDATE_VESSEL_TYPE_ACT } from "./actions/authActions"

const initialState = {
  introSeen: false,
  member: {
    email: '',
    firstName: '',
    lastName: '',
    id: '',
    name: '',
    profilePic: '',
    isRacer: false,
    bio: '',
    vessels: [{
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
      make: '',
      model: '',
      sailNumber: '',
      marina: '',
      slip: '',
      __typename: '',
      insuranceInfo: {
        no: '',
        company: '',
        expires: ''
      },
    }],
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
    userIsCommodore: false,
    userIsRaceChair: false,
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
      let userIsCommodore = (payload?.member?.id === payload?.member?.yachtClubByYachtClub?.commodore?.member_id && payload?.member?.id !== undefined)
      let userIsRaceChair = (payload?.member?.id === payload?.member?.yachtClubByYachtClub?.race_chairs[0]?.memberId && payload?.member?.id !== undefined)      
      payload.ycId = payload?.member?.yachtClubByYachtClub?.id;
      return {
        ...state,
        user: {
          ...payload.user,
          userIsCommodore: userIsCommodore,
          userIsRaceChair: userIsRaceChair
        },
        member: {
          ...payload.member,
          profilePic: payload.member?.profilePic || payload.user?.picture,
        },
      };
    }
    case UPDATE_MEMBER_BIO_ACT: {
      return {
        ...state,
        member: {
          ...state.member,
          bio: payload,
        }
      }
    }
    case UPDATE_MEMBER_NAME_ACT: {
      return {
        ...state,
        member: {
          ...state.member,
          firstName: payload.firstName,
          lastName: payload.lastName,
          name: payload.userName,
        }
      }
    }
    case UPDATE_NEW_VESSEL_ACT: {
      const {img, id, ownerId} = payload;
      return {
        ...state,
        member: {
          ...state.member,
          vessels: [{
            ...initialState.member.vessels[0],
            img: img,
            id: id,
            ownerId: ownerId,
          }]
        }
      }
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
      const {vesselName, draft, length, beam, model, sailNumber, marina, slip, make} = payload;
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
            model,
            sailNumber,
            marina,
            slip,
            make,
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
    case BETA_USER_IS_COMMODORE: {
      return {
        ...state,
        user: {
          ...state.user,
          userIsCommodore: payload,
        }
      }
    }
    case INTRO_SEEN: {
      return {
        ...state,
        introSeen: true,
      }
    }
    default:
      return state
  }
}
