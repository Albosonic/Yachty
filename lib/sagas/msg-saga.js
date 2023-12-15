import { MEMBER_OBJECT, USER_LOGGED_IN_ACT } from '@/slices/actions/authActions';
import { call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import client from '../clients/apollo-client';
import { GET_ALL_USER_ROOMS_BY_ID } from '../gqlQueries/dmgql';
import { dmRoomsAct } from '@/slices/actions/msgActions';
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
  const tempMemId = '9fa6f32d-7284-415a-a576-36aaca82c400';
  const resp = await  client.query({
    query: GET_ALL_USER_ROOMS_BY_ID,
    variables: {memberId: tempMemId},
    fetchPolicy: 'no-cache',
  });  
  const dmRooms = resp?.data?.user_rooms.map(room => {
    const { id, lastSeen, memberId, recipientId } = room;
    return {
      id,
      lastSeen,
      memberId,
      recipientId,
      convoPartnerId: myId !== memberId ? memberId : recipientId, 
    }
  });
  return dmRooms;
}

function* getAllUserRoomsAndMessaged(action) {  
  const myId = yield select(state => state.auth.member.id);
  while(true) {
    const dmRooms = yield call(getUserRoomsFacade, myId );    
    console.log('dmRooms ===', dmRooms);
    const currentRooms = yield select(state => state.msgs.dmRooms);
    if (currentRooms.length === 0 || currentRooms.length < dmRooms.length) {
      yield put(dmRoomsAct(dmRooms));
    }
    
    yield delay(3000)
  }


}

function* msgSaga() {
  yield takeLatest(USER_LOGGED_IN_ACT, getAllUserRoomsAndMessaged)
}

export default msgSaga