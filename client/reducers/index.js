import users from './users.js'

const initialState = {
	users: { current: {} }
};

export default function rootReducer(state = initialState, action) {
    return {
        users: users(state.users, action)
    };
}
