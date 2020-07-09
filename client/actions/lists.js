export const SUBMIT_LIST = 'SUBMIT_LIST';
export const submitList = (items, budget, deliveryAddress, preferredStorePlaceIds, latitude, longitude) => (dispatch, getState) => {
    const { users } = getState();
    return fetch(`/api/0.0.0/users/${users.current.id}/lists`, {
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
    return fetch('/api/0.0.0/lists', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latitude, longitude })
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