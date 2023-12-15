export const DM_ROOMS_ACT = 'DM_ROOMS_ACT';
export const POLL_USER_ROOMS = 'POLL_USER_ROOMS';

export const dmRoomsAct = (rooms) => {
  return {
    type: DM_ROOMS_ACT,
    payload: rooms
  }
}

export const pollUserRooms = () => {
  return {
    type: POLL_USER_ROOMS,    
  }
}