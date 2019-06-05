import { SELECT_PLAN, SET_CURRENT_PLAN } from '../actions/subscriptions';

const initialSubscriptionsState = {
  list: [
      {
          id: 1,
          title: 'Degustation',
          icon: '',
          price: 90,
          words: 1000,
          languages: 2,
      },
      {
          id: 2,
          title: 'Menu du jour',
          icon: '',
          price: 119,
          words: 1500,
          languages: 2,
      },
      {
          id: 3,
          title: 'A la carte',
          icon: '',
          price: 144,
          words: 2000,
          languages: 2,
      },
  ],
  selected: null,
  current: 2,
  digitalMenuPlan: null,
  digitalMenuPlanCompleted: false,
};

export function _subscriptions(state = initialSubscriptionsState, action) {
    switch (action.type) {
        case SELECT_PLAN:
            return {
                ...state,
                selected: action.payload
            }
        case SET_CURRENT_PLAN:
            return {
                ...state,
                current: action.payload
            }
        case 'GET_DIGITAL_MENU_PLAN_REQUEST':
            return {
                ...state,
                digitalMenuPlanCompleted: false,
                digitalMenuPlan: null
            }
        case 'GET_DIGITAL_MENU_PLAN_FAILURE':
            return {
                digitalMenuPlanCompleted: true,
                digitalMenuPlan: null
            }
        case 'GET_DIGITAL_MENU_PLAN_SUCCESS':
            return {
                ...state,
                digitalMenuPlanCompleted: true,
                digitalMenuPlan: action.result
            }
        default:
        return state
    }
}