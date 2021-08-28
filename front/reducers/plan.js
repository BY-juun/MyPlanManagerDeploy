import produce from '../util/produce';
export const initialState = {
    checkplan: null,
    submitPlanLoading: false,
    submitPlanDone: false,
    submitPlanError: null,
    submitTimeLoading: false,
    submitTimeDone: false,
    submitTimeError: null,
}


export const SUBMIT_PLAN_REQUEST = 'SUBMIT_PLAN_REQUEST';
export const SUBMIT_PLAN_SUCCESS = 'SUBMIT_PLAN_SUCCESS';
export const SUBMIT_PLAN_FAILURE = 'SUBMIT_PLAN_FAILURE';

export const SUBMIT_TIME_REQUEST = 'SUBMIT_TIME_REQUEST';
export const SUBMIT_TIME_SUCCESS = 'SUBMIT_TIME_SUCCESS';
export const SUBMIT_TIME_FAILURE = 'SUBMIT_TIME_FAILURE';


const reducer = (state = initialState, action) =>
    produce(state, (draft) => {
        switch (action.type) {
            case SUBMIT_PLAN_REQUEST:
                draft.submitPlanLoading = true;
                draft.submitPlanError = null;
                draft.submitPlanDone = false;
                break;
            case SUBMIT_PLAN_SUCCESS:
                draft.submitPlanLoading = false;
                draft.submitPlanDone = true;
                draft.checkplan = action.data;
                break;
            case SUBMIT_PLAN_FAILURE:
                draft.submitPlanLoading = false;
                draft.submitPlanError = action.error;
                break;
            case SUBMIT_TIME_REQUEST:
                draft.submitTimeLoading = true;
                draft.submitTimeError = null;
                draft.submitTimeDone = false;
                break;
            case SUBMIT_TIME_SUCCESS:
                draft.submitTimeLoading = false;
                draft.submitTimeDone = true;
                break;
            case SUBMIT_TIME_FAILURE:
                draft.submitTimeLoading = false;
                draft.submitTimeError = action.error;
                break;
            default:
                break;
        }
    });

export default reducer;