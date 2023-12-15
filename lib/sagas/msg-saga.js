import { MEMBER_OBJECT, USER_LOGGED_IN_ACT } from '@/slices/actions/authActions';
import { call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import client from '../clients/apollo-client';
import { GET_ALL_USER_ROOMS_BY_ID } from '../gqlQueries/dmgql';
import { POLL_USER_ROOMS, dmRoomsAct } from '@/slices/actions/msgActions';
import { gql } from '@apollo/client';
import { useSelector } from 'react-redux';


// worker Saga: will be fired on USER_FETCH_REQUESTED actions
// function* fetchUser(action) {
//   try {
//     const user = yield call(Api.fetchUser, action.payload.userId)
//     yield put({ type: 'USER_FETCH_SUCCEEDED', user: user })
//   } catch (e) {
//     yield put({ type: 'USER_FETCH_FAILED', message: e.message })
//   }
// }

const GET_USER_ROOMS = gql`
  query getAlluserRooms($memberId: uuid!) {
  user_rooms(where: {_or: [{memberId: {_eq: $memberId}}, {recipientId: {_eq: $memberId}}]}) {
    id
    lastSeen
    memberId
    recipientId      
  }
}`;


const getUserRoomsFacade = async (myId) => {
  const resp = await  client.query({
    query: GET_ALL_USER_ROOMS_BY_ID,
    variables: {memberId: myId},
    fetchPolicy: 'no-cache',
  });
  console.log('resp ===========', resp)
  const dmRooms = resp?.data?.user_rooms.map(room => {
    const { id, lastSeen, memberId, recipientId, newMessage } = room;
    return {
      id,
      lastSeen,
      memberId,
      recipientId,
      convoPartnerId: myId !== memberId ? memberId : recipientId,
      newMessage,
    }
  });
  return dmRooms;
}

function* getAllUserRoomsAndMessaged() {  
  const myId = yield select(state => state.auth.member.id);
  
  while(true) {
    const dmRooms = yield call(getUserRoomsFacade, myId );   
    console.log('========dmr', dmRooms)
    yield put(dmRoomsAct(dmRooms));
    yield delay(3000)
  }
}

function* msgSaga() {
  yield takeLatest(POLL_USER_ROOMS, getAllUserRoomsAndMessaged)
}

export default msgSaga