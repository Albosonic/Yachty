import { call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import client from '../clients/apollo-client';
import { GET_ALL_USER_ROOMS_BY_ID } from '../gqlQueries/dmgql';
import { POLL_USER_ROOMS, dmRoomsAct, globalNewMsg } from '@/slices/actions/msgActions';
import { gql } from '@apollo/client';

// worker Saga: will be fired on USER_FETCH_REQUESTED actions
// function* fetchUser(action) {
//   try {
//     const user = yield call(Api.fetchUser, action.payload.userId)
//     yield put({ type: 'USER_FETCH_SUCCEEDED', user: user })
//   } catch (e) {
//     yield put({ type: 'USER_FETCH_FAILED', message: e.message })
//   }
// }

const getUserRoomsFacade = async (myId) => {
  let newMsg = false;
  const resp = await client.query({
    query: GET_ALL_USER_ROOMS_BY_ID,
    variables: {memberId: myId},
    fetchPolicy: 'no-cache',
  });

  const dmRooms = resp?.data?.user_rooms.map(room => {
    const { id, lastSeen, memberId, recipientId, newMessage } = room;    
    if (newMessage === memberId) newMsg = true;
    return {
      id,
      lastSeen,
      memberId,
      recipientId,
      convoPartnerId: myId !== memberId ? memberId : recipientId,
      newMessage,
    }
  });
  return { dmRooms, newMsg };
}

function* getAllUserRoomsAndMessaged() {  
  const myId = yield select(state => state.auth.member.id);
  while(true) {
    if (!myId) return;
    const data = yield call(getUserRoomsFacade, myId);
    const {dmRooms, newMsg} = data;
    if (newMsg) {
      yield put(globalNewMsg(true));
    } else {
      yield put(globalNewMsg(false));
    }
    yield put(dmRoomsAct(dmRooms));
    yield delay(3000)
  }
}

function* msgSaga() {
  yield takeLatest(POLL_USER_ROOMS, getAllUserRoomsAndMessaged)
}

export default msgSaga