import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';


import {
    SUBMIT_PLAN_FAILURE,
    SUBMIT_PLAN_REQUEST,
    SUBMIT_PLAN_SUCCESS,
    SUBMIT_TIME_FAILURE,
    SUBMIT_TIME_REQUEST,
    SUBMIT_TIME_SUCCESS,
} from '../reducers/plan';

import {
    SUBMIT_TODAY_PLAN_SUCCESS
} from '../reducers/day';


function submitPlanAPI(data) {
    return axios.post('/plan', data); //data.dateInfo
}

function* submitPlan(action) {
    try {
        const result = yield call(submitPlanAPI, action.data);
        yield put({
            type: SUBMIT_PLAN_SUCCESS,
            data : result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: SUBMIT_PLAN_FAILURE,
            error: err.response.data,
        });
    }
}

function submitTimeAPI(data) {
    return axios.post('/plan/time', data); //data.dateInfo
}

function* submitTime(action) {
    try {
        yield call(submitTimeAPI, action.data);
        yield put({
            type: SUBMIT_TIME_SUCCESS,
        });

    } catch (err) {
        console.error(err);
        yield put({
            type: SUBMIT_TIME_FAILURE,
            error: err.response.data,
        });
    }
}

function* watchSubmitPlan() {
    yield takeLatest(SUBMIT_PLAN_REQUEST, submitPlan);
}

function* watchSubmitTIme() {
    yield takeLatest(SUBMIT_TIME_REQUEST, submitTime);
}

export default function* planSaga() {
    yield all([
        fork(watchSubmitPlan),
        fork(watchSubmitTIme),
    ])
}