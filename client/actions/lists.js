export const SUBMIT_LIST = 'SUBMIT_LIST';
export const submitList = (items, budget, deliveryAddress, preferredStorePlaceIds) => (dispatch, getState) => {
    const { users } = getState();
    return fetch(`/api/0.0.0/users/${users.user.id}/lists`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items, budget, address: deliveryAddress, preferredStores: preferredStorePlaceIds })
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
