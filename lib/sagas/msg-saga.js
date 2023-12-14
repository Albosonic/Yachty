import { MEMBER_OBJECT, USER_LOGGED_IN_ACT } from '@/slices/actions/authActions';
import { call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import client from '../clients/apollo-client';
import { GET_ALL_USER_ROOMS_BY_ID } from '../gqlQueries/dmgql';
import { dmRoomsAct } from '@/slices/actions/msgActions';


// worker Saga: will be fired on USER_FETCH_REQUESTED actions
// function* fetchUser(action) {
//   try {
//     const user = yield call(Api.fetchUser, action.payload.userId)
//     yield put({ type: 'USER_FETCH_SUCCEEDED', user: user })
//   } catch (e) {
//     yield put({ type: 'USER_FETCH_FAILED', message: e.message })
//   }
// }
const getUserRooms = () => {
  // const memberId = action.payload.member.id;
  const tempMemId = '9fa6f32d-7284-415a-a576-36aaca82c400'
  const resp = client.query({
    query: GET_ALL_USER_ROOMS_BY_ID,
    variables: {memberId: tempMemId},
    fetchPolicy: 'no-cache',
  });
  return resp;
}

function* getAllUserRoomsAndMessaged(action) {

  // console.log('saga fired!!!!!!!!!!!!!!!! ===============', action.payload.member.id)
  while(true) {
    const resp = yield call(getUserRooms);
    const { error, loading, data } = resp;
    const dmRooms = data?.user_rooms;
    const currentRooms = yield select(state => state.msgs.dmRooms);

    if (currentRooms.length === 0) {
      yield put(dmRoomsAct(dmRooms));
    }

    // dmRooms.forEach(room => {
    //   if (room) {

    //   }
    // })

    // console.log('current rooms =======', currentRooms)
    // yield delay(3000)
  }


}

function* msgSaga() {
  yield takeLatest(USER_LOGGED_IN_ACT, getAllUserRoomsAndMessaged)
}

export default msgSaga