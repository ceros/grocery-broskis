import {authHeader} from '../helpers/auth-header.js';

const backend = '/api/0.0.0';

export const SUBMIT_LIST = 'SUBMIT_LIST';
export const submitList = (items, budget, deliveryAddress) => (dispatch, getState) => {
    const { users } = getState();
    return fetch(`${backend}/users/${users.current.id}/lists`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items, budget, address: deliveryAddress })
    }).then((res) => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }

        dispatch({
            type: SUBMIT_LIST,
            items,
            address: deliveryAddress
        });
    });
};

export const SHOW_LIST = 'SHOW_LIST';
export const showList = (id) => (dispatch) => {
    return fetch(`${backend}/lists/${id}`, {
        method: 'GET',
        headers: authHeader()
    }).then((res) => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }
		return res.json();
	}).then(list => {
        dispatch({
            type: SHOW_LIST,
            list: list
        });
	});
};
