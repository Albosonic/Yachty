export const MEMBER_OBJECT = 'MEMBER_OBJECT';
export const UPDATE_LOGO = 'UPDATE_LOGO';

export const addMember = (member) => {
  return {
    type: MEMBER_OBJECT,
    payload: { member },
  }
}

export const updateLogo = (logo) => {
  return {
    type: UPDATE_LOGO,
    payload: logo
  }
}