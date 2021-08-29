import { all, fork, put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';


import {
    SUBMIT_PLAN_FAILURE,
    SUBMIT_PLAN_REQUEST,
    SUBMIT_PLAN_SUCCESS,
    DELETE_PLAN_FAILURE,
    DELETE_PLAN_REQUEST,
    DELETE_PLAN_SUCCESS,
    SUBMIT_TIME_FAILURE,
    SUBMIT_TIME_REQUEST,
    SUBMIT_TIME_SUCCESS,
} from '../reducers/plan';


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

function deletePlanAPI(data) {
    return axios.delete(`/plan/${data}`); //data.dateInfo
}

function* deletePlan(action) {
    try {
        const result = yield call(deletePlanAPI, action.data);
        yield put({
            type: DELETE_PLAN_SUCCESS,
            data : result.data,
        });
    } catch (err) {
        console.error(err);
        yield put({
            type: DELETE_PLAN_FAILURE,
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


function* watchDeletePlan() {
    yield takeLatest(DELETE_PLAN_REQUEST, deletePlan);
}

function* watchSubmitTIme() {
    yield takeLatest(SUBMIT_TIME_REQUEST, submitTime);
}

export default function* planSaga() {
    yield all([
        fork(watchSubmitPlan),
        fork(watchSubmitTIme),
        fork(watchDeletePlan),
    ])
}