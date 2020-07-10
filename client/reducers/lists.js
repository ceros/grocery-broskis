import { SHOW_LIST, UPDATED_LIST_ITEM } from '../actions/lists.js';

export default function lists(state = { lists: { current: {} } }, action) {
    switch (action.type) {
		case SHOW_LIST:
			return {
                ...state,
                current: action.list
            }
        case UPDATED_LIST_ITEM:

			const list = JSON.parse(JSON.stringify(state.current));

			if ( list.items && list.items.length > 0 ) {
				const {item} = action;

				list.items.map(i => {
					if ( i.id == item.id ) {
						i.status = item.status;
					}
				});
			}

			return {
                ...state,
                current: list
            }
		
		default:
            return state;
    }
}

export const getCurrentList = function(state) { return state.lists.current };
