import { call, put, takeLatest } from 'redux-saga/effects';
import { FETCH_DATA_REQUEST, fetchDataSuccess, fetchDataFailure } from '../actions';

function fetchDataApi() {
  // จำลองการดึงข้อมูลจาก API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("นี่คือข้อมูลที่ดึงมา");
    }, 1000);
  });
}

function* fetchDataSaga() {
  try {
    const data = yield call(fetchDataApi);
    yield put(fetchDataSuccess(data));
  } catch (error) {
    yield put(fetchDataFailure(error.message));
  }
}

export default function* dataSaga() {
  yield takeLatest(FETCH_DATA_REQUEST, fetchDataSaga);
}
