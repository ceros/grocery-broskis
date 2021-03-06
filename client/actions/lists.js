import {authHeader} from '../helpers/auth-header.js';

const backend = '/api/0.0.0';

export const SUBMIT_LIST = 'SUBMIT_LIST';
export const submitList = (items, budget, deliveryAddress, preferredStorePlaceIds, latitude, longitude) => (dispatch, getState) => {
    const { users } = getState();
    return fetch(`${backend}/users/${users.current.id}/lists`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items, budget, address: deliveryAddress, preferredStores: preferredStorePlaceIds, latitude, longitude })
    }).then((res) => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }

        dispatch({
            type: SUBMIT_LIST,
            items,
            address: deliveryAddress,
            latitude,
            longitude
        });
    });
};


export const SHOW_AVAILABLE_LISTS = 'SHOW_AVAILABLE_LISTS';
export const fetchLists = (latitude, longitude) => (dispatch, getState) => {
    return fetch(`/api/0.0.0/lists/${latitude}/${longitude}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        if (!res.ok) {
            throw new Error(res.statusText);
        }

        return res.json();
    }).then((results) => {
        dispatch({
            type: SHOW_AVAILABLE_LISTS,
            results
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

export const UPDATED_LIST_ITEM = 'UPDATED_LIST_ITEM';

export const updateListItemStatus = (id, status) => (dispatch) => {
	return fetch(`${backend}/users/me/acclaimed_list/item`, {
        method: 'PUT',
        headers: Object.assign({}, authHeader(), { 'Content-type': 'application/json' }),
        body: JSON.stringify({ item: { id, status } })
    }).then((res) => {
        if (!res.ok) {
            throw new Error(res.statusText);
       	}
		dispatch({
            type: UPDATED_LIST_ITEM,
            item: { id, status }
        });
	});
};
