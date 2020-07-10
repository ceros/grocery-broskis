import users from './users.js'
import lists from './lists.js'
import availablelists from './availablelists.js'

const initialState = {
	users: { current: {} },
    lists: { current: {} },
    availablelists: []
};

export default function rootReducer(state = initialState, action) {
    return {
        users: users(state.users, action),
        lists: lists(state.lists, action),
        availablelists: availablelists(state.availablelists, action)
    };
}
