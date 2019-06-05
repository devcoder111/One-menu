export const SELECT_PLAN = 'SELECT_PLAN';
export const SET_CURRENT_PLAN = 'SET_CURRENT_PLAN';

export function selectPlan(id) {
    return {
        type: SELECT_PLAN,
        payload: id
    }
}

export function setCurrentPlan(id) {
    return {
        type: SET_CURRENT_PLAN,
        payload: id
    }
}