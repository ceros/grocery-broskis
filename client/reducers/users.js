import { RECIEVE_USER, RECIEVE_CURRENT_USER } from '../actions/users.js';

export default function users(state = {}, action) {
    switch (action.type) {
        case RECIEVE_USER:
            return Object.assign({}, state, { [action.user.id]: action.user });
		case RECIEVE_CURRENT_USER:
			return {
                ...state,
                current: action.user
            }
        default:
            return state;
    }
}

export const getCurrentUser = function(state) { return state.users.current };
