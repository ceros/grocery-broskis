import {history} from '../helpers/history.js';
import {authHeader} from '../helpers/auth-header.js';

const backend = '/api/0.0.0';

/**
 * An action and action creator to revieve a user from the backend and update
 * the store.  Assumes we're getting the user from the backend, so the user
 * must have an `id` property.
 */
export const RECEIVE_USER = 'RECEIVE_USER';
export const receiveUser = function(user) { 
    return {
        type: RECEIVE_USER,
        user: user
    };
};

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';
export const receiveCurrentUser = function(user) {
    return {
        type: RECEIVE_CURRENT_USER,
        user: user
    }
}

export const LOGOUT_CURRENT_USER = 'LOGOUT_CURRENT_USER';
export const logoutCurrentUser = function() {
    return {
        type: LOGOUT_CURRENT_USER,
    }
}
/**
 * A thunk action creator to post a user to the backend and retrieve the
 * complete user (with ID) in response.  It then calls receiveUser() to add the
 * user to our store.
 */
 export const postUser = function(user) { 
    return function(dispatch) {
        return fetch(backend + '/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(function(response) {
                return response.json()
        })
        .then(function(user) {
            dispatch(receiveUser(user));
        });
    };
};

/**
 * Authenticate the user on the backend
 */
export const loginUser = function(user) {
    return function(dispatch) {
        return fetch(backend + '/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
		.then(handleResponse)
        .then(function(session) {
			if (session.token) {
                localStorage.setItem('user', JSON.stringify({ token: session.token, id: session.user.id }));
            }

            return session;
        })
        .then(function(session) {
			history.push('/');
			dispatch(getMe());
        }).catch(function(err) {
			console.log(err);
  		});
    };

}

const logoutUser = function() {
	localStorage.removeItem('user');
	history.push('/login');
}

export const logout = function() {
	return function(dispatch) {
		logoutUser();
		if ( dispatch ) {
			dispatch(logoutCurrentUser());
		}
	}
}

export const getMe = function() {

	return function(dispatch) {
    	const requestOptions = {
        	method: 'GET',
        	headers: authHeader()
    	};

   		return fetch(backend + '/users/me', requestOptions)
			.then(handleResponse)
			.then(function(user) {
				dispatch(receiveCurrentUser(user));
				return user;
			}).catch(function(err) {
				console.log(err);
  			});
;
	}
}

/**
 * Handle response and errors
 */

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                logoutUser();
            }

            const message = (data && data.message) || response.statusText;
            return Promise.reject({ code: response.status, message: message });
        }

        return data;
    });
}
