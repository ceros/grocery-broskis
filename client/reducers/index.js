import users from './users.js'
import lists from './lists.js'

const initialState = {
    users: { current: {} },
    lists: []
};

export default function rootReducer(state = initialState, action) {
    return {
        users: users(state.users, action),
        lists: lists(state.lists, action)
    };
}
