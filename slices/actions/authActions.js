export const MEMBER_OBJECT = 'MEMBER_OBJECT';

export const addMember = (member) => {
  return {
    type: MEMBER_OBJECT,
    payload: { member },
  }
}
