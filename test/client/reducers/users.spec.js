import users from '../../../client/reducers/users.js';
import { RECEIVE_USER, RECEIVE_CURRENT_USER, LOGOUT_CURRENT_USER } from '../../../client/actions/users.js';
import { expect } from 'chai';


describe('reducers', function() {

	describe('RECIEVE_USER', function() {

  	  it('RECIEVE_USER should update state when receiving first user', function() {
    	    let user = {
        	    id: 1,
            	name: 'John Doe',
            	email: 'john.doe@email.com'
        	};

       		let action = {
            	type: RECEIVE_USER,
           		user: user
        	};

        	let initialState = {};
        	let expectedState = {
            	user
        	};

        	expect(users(initialState, action)).to.eql(expectedState);
    	});

	});

	describe('RECEIVE_CURRENT_USER', function() {

		it('Should update state when receiving user', function() {
    	    let user = {
        	    id: 1,
            	name: 'John Doe',
            	email: 'john.doe@email.com'
        	};

       		let action = {
            	type: RECEIVE_CURRENT_USER,
           		user: user
        	};

        	let initialState = { current: {}};
        	let expectedState = {
            	current: user
        	};

        	expect(users(initialState, action)).to.eql(expectedState);
    	});
	});

	describe('LOGOUT_CURRENT_USER', function() {

		it('Should update state when logout user', function() {
    	    let user = {
        	    id: 1,
            	name: 'John Doe',
            	email: 'john.doe@email.com'
        	};

       		let action = {
            	type: LOGOUT_CURRENT_USER,
        	};

        	let initialState = { current: user };
        	let expectedState = {
            	current: {}
        	};

        	expect(users(initialState, action)).to.eql(expectedState);
    	});
	});
});

