export const MEMBER_OBJECT = 'MEMBER_OBJECT';
export const NEW_MEMBER_APPLICATION = 'NEW_MEMBER_APPLICATION';
export const NON_MEMBER_OBJECT = 'NON_MEMBER_OBJECT';
export const UPDATE_LOGO = 'UPDATE_LOGO';
export const YC_EVENT = 'YC_EVENT';
export const CLEAR_STATE = 'CLEAR_STATE';
export const UPDATE_VESSEL_IMAGE = 'UPDATE_VESSEL_IMAGE';
export const UPDATE_PROFILE_PICTURE = 'UPDATE_PROFILE_PICTURE';

export const clearState = () => {
 return {
  type: CLEAR_STATE,
 }
}

export const addMember = (userData) => {
  return {
    type: MEMBER_OBJECT,
    payload: userData,
  }
}

export const addNewMemberApplication = (newMemberApplications) => ({
  type: NEW_MEMBER_APPLICATION,
  payload: newMemberApplications,
});

export const addNonMember = (nonMember) => ({
  type: NON_MEMBER_OBJECT,
  payload: nonMember,
});

export const updateLogo = (logo) => {
  return {
    type: UPDATE_LOGO,
    payload: logo
  }
}