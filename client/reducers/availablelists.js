import { SHOW_AVAILABLE_LISTS } from '../actions/lists.js';

export default function lists(state = {}, action) {
    switch (action.type) {
        case SHOW_AVAILABLE_LISTS:
            return action.results;
        default:
            return state;
    }
}
