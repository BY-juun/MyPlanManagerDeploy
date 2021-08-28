import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';


import {
    ADD_DAY_FAILURE,
    ADD_DAY_REQUEST,
    ADD_DAY_SUCCESS,
    LOAD_TODAY_FAILURE,
    LOAD_TODAY_REQUEST,
    LOAD_TODAY_SUCCESS,
    LOAD_PAST_FAILURE,
    LOAD_PAST_REQUEST,
    LOAD_PAST_SUCCESS,

} from '../reducers/day';


function adddayAPI(data) {
    return axios.post('/day', data); //data.dateInfo
}

function* addday(action) {
    try {
        yield call(adddayAPI, action.data);
        yield put({
            type: ADD_DAY_SUCCESS,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: ADD_DAY_FAILURE,
            error: err.response.data,
        });
    }
}

function loadTodayAPI(data) {
    return axios.get('/day/today'); //data.dateInfo
}

function* loadToday(action) {
    try {
        const result = yield call(loadTodayAPI, action.data);
        yield put({
            type: LOAD_TODAY_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: LOAD_TODAY_FAILURE,
            error: err.response.data,
        });
    }
}

function loadPastAPI(data) {
    return axios.post('/day/past',data); 
}

function* loadPast(action) {
    try {
        const result = yield call(loadPastAPI, action.data);
        yield put({
            type: LOAD_PAST_SUCCESS,
            data: result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: LOAD_PAST_FAILURE,
            error: err.response.data,
        });
    }
}


function* watchAddDay() {
    yield takeLatest(ADD_DAY_REQUEST, addday);
}

function* watchLoadToday() {
    yield takeLatest(LOAD_TODAY_REQUEST, loadToday);
}

function* watchLoadPast() {
    yield takeLatest(LOAD_PAST_REQUEST, loadPast);
}

export default function* daySaga() {
    yield all([
        fork(watchAddDay),
        fork(watchLoadToday),
        fork(watchLoadPast),
    ]);
}