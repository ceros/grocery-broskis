import { RECIEVE_USER } from '../actions/users.js';

export default function users(state = {}, action) {
    switch (action.type) {
        case RECIEVE_USER:
            return Object.assign({}, state, { user: action.user });
        default:
            return state;
    }
}
