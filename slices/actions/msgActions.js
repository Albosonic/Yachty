export const DM_ROOMS_ACT = 'DM_ROOMS_ACT';

export const dmRoomsAct = (rooms) => {
  return {
    type: DM_ROOMS_ACT,
    payload: rooms
  }
}