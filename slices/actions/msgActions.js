export const DM_ROOMS_ACT = 'DM_ROOMS_ACT';
export const POLL_USER_ROOMS = 'POLL_USER_ROOMS';
export const GLOBAL_NEW_MSG = 'GLOBAL_NEW_MSG';

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

export const globalNewMsg = (on) => {
  return {
    type: GLOBAL_NEW_MSG,
    payload: on,
  }
}