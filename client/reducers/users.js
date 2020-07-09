import { RECEIVE_USER, RECEIVE_CURRENT_USER, LOGOUT_CURRENT_USER } from '../actions/users.js';

export default function users(state = {}, action) {
    switch (action.type) {
        case RECEIVE_USER:
			return Object.assign({}, state, { [action.user.id]: action.user });
		case RECEIVE_CURRENT_USER:
			return {
                ...state,
                current: action.user
            }
		case LOGOUT_CURRENT_USER:
			return {
                ...state,
                current: {}
            }
        default:
            return state;
    }
}

export const getCurrentUser = function(state) { return state.users.current };
