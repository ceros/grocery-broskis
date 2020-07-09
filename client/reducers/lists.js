import { SHOW_LIST } from '../actions/lists.js';

export default function lists(state = { lists: { current: {} } }, action) {
    switch (action.type) {
		case SHOW_LIST:
			return {
                ...state,
                current: action.list
            }
        default:
            return state;
    }
}

export const getCurrentList = function(state) { return state.lists.current };
