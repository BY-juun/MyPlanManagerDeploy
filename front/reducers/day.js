import produce from '../util/produce';
export const initialState = {
    todayPlan: null,
    pastPlan : null,
    addDayLoading: false,
    addDayDone: false,
    addDayError: null,
    loadTodayLoading: false,
    loadTodayDone: false,
    loadTodayError: null,
    loadPastLoading: false,
    loadPastDone: false,
    loadPastError: null,
}


export const ADD_DAY_REQUEST = 'ADD_DAY_REQUEST';
export const ADD_DAY_SUCCESS = 'ADD_DAY_SUCCESS';
export const ADD_DAY_FAILURE = 'ADD_DAY_FAILURE';

export const LOAD_TODAY_REQUEST = 'LOAD_TODAY_REQUEST';
export const LOAD_TODAY_SUCCESS = 'LOAD_TODAY_SUCCESS';
export const LOAD_TODAY_FAILURE = 'LOAD_TODAY_FAILURE';

export const LOAD_PAST_REQUEST = 'LOAD_PAST_REQUEST';
export const LOAD_PAST_SUCCESS = 'LOAD_PAST_SUCCESS';
export const LOAD_PAST_FAILURE = 'LOAD_PAST_FAILURE';

export const SUBMIT_TODAY_PLAN_SUCCESS = 'SUBMIT_TODAY_PLAN_SUCCESS';

const reducer = (state = initialState, action) =>
    produce(state, (draft) => {
        switch (action.type) {
            case ADD_DAY_REQUEST:
                draft.addDayLoading = true;
                draft.addDayError = null;
                draft.addDayDone = false;
                break;
            case ADD_DAY_SUCCESS:
                draft.addDayLoading = false;
                draft.addDayDone = true;
                break;
            case ADD_DAY_FAILURE:
                draft.addDayLoading = false;
                draft.addDayError = action.error;
                break;

            case LOAD_TODAY_REQUEST:
                draft.loadTodayLoading = true;
                draft.loadTodayError = null;
                draft.loadTodayDone = false;
                break;
            case LOAD_TODAY_SUCCESS:
                draft.loadTodayLoading = false;
                draft.loadTodayDone = true;
                draft.todayPlan = action.data;
                break;
            case LOAD_TODAY_FAILURE:
                draft.loadTodayLoading = false;
                draft.loadTodayError = action.error;
                break;

            case LOAD_PAST_REQUEST:
                draft.loadPastLoading = true;
                draft.loadPastError = null;
                draft.loadPastDone = false;
                break;
            case LOAD_PAST_SUCCESS:
                draft.loadPastLoading = false;
                draft.loadPastDone = true;
                draft.pastPlan = action.data;
                break;
            case LOAD_PAST_FAILURE:
                draft.loadPastLoading = false;
                draft.loadPastError = action.error;
                break;

            default:
                break;
        }
    });

export default reducer;