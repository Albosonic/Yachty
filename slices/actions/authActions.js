export const MEMBER_OBJECT = 'MEMBER_OBJECT';
export const NEW_MEMBER_APPLICATION = 'NEW_MEMBER_APPLICATION';
export const NON_MEMBER_OBJECT = 'NON_MEMBER_OBJECT';
export const UPDATE_LOGO = 'UPDATE_LOGO';
export const YC_EVENT = 'YC_EVENT';
export const CLEAR_STATE = 'CLEAR_STATE';

export const clearState = () => {
 return {
  type: CLEAR_STATE,
 }
}

export const addMember = (member) => {
  return {
    type: MEMBER_OBJECT,
    payload: { member },
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