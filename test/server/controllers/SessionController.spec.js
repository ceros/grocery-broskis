import sinon from 'sinon';
import { expect } from 'chai';

const jwt = require("jsonwebtoken");
const query = require('../../../server/helpers/query.js');
const SessionController = require('../../../server/controllers/session.js');
const AuthenticationService = require('../../../server/services/authentication.js');

describe('SessionController', function() {

	let statusSpy;
	let jsonSpy;
	let sessionController;
	let request;
	let response;
	let database;
	let queryResponse;

	const config = { session: { secret : 'secret', expiresIn: '1h' } };

	beforeEach(function() {

		queryResponse = [];
		
		database = { query : function(database, query, callback) { callback(false, queryResponse) } };
		
		request = {};
	
		response = {
			status: { }
		}

		jsonSpy = sinon.spy();
		
		response.status = function() {
			return { json: jsonSpy }
		}
		
		statusSpy = sinon.spy(response, 'status');
        sessionController = new SessionController(config, database);
	});

	afterEach(function() {
		statusSpy.restore();
	});

    describe('.checkSession()', function() {

        describe('Should send message user not found, not verified or not enabled with 401 status', function() {
		
			it('When there is no user on request', function() {

            	sessionController.checkSession(request, response);

            	expect(statusSpy.calledWith(401)).to.equal(true);
            	expect(jsonSpy.calledWith({ message: 'user not found, not verified or not enabled' })).to.equal(true);
        	});

			it('When user is defined on request but does not exists on database', async function() {

				request.user = { id: 1 }
            	await sessionController.checkSession(request, response);

            	expect(statusSpy.calledWith(401)).to.equal(true);
            	expect(jsonSpy.calledWith({ message: 'user not found, not verified or not enabled' })).to.equal(true);
        	});
		});

		
    });
	
	it('Should verify user on database', async function () { 
		request.user = { id: 12 }
		const databaseSpy = sinon.spy(database, 'query');
        await sessionController.checkSession(request, response);

        expect(databaseSpy.calledWith('SELECT * from users where id = ?',[ request.user.id ])).to.equal(true);
	});

	it('When is a valid user should update request and call next function', async function () {

		const user = { id: '12', name: 'user' };
		const nextSpy = sinon.spy();

		request.user = { id: 12 }
		queryResponse.push(user);
        await sessionController.checkSession(request, response, nextSpy);
        
		expect(request.user).to.equal(user);
		expect(nextSpy.called).to.equal(true);
	});

	describe('.authenticate()', function() {

		let user;

		beforeEach(function() {
			request.body = {
				email:'email@domain.com',
				password: 'secret'
			};

			user = { id: 11, password: 'anothersecret' }
			queryResponse.push(user);
		});
		
		describe('Should send message invalid credentials with 403 status', function() {
		
			it('When there is no email or password on request', function() {

            	request.body = {};
				sessionController.authenticate(request, response);

            	expect(statusSpy.calledWith(403)).to.equal(true);
            	expect(jsonSpy.calledWith({ message: 'invalid credentials' })).to.equal(true);
        	});
			

			it('When email and password are on request but user does not exist', async function() {

				queryResponse.length = 0;
            	await sessionController.authenticate(request, response);

            	expect(statusSpy.calledWith(403)).to.equal(true);
            	expect(jsonSpy.calledWith({ message: 'invalid credentials' })).to.equal(true);
        	});
			
			it('When password is not valid', async function() {

				sessionController.auth.checkPassword = sinon.fake.returns(false);
            	await sessionController.authenticate(request, response);

            	expect(statusSpy.calledWith(403)).to.equal(true);
            	expect(jsonSpy.calledWith({ message: 'invalid credentials' })).to.equal(true);
        	});
		});

		it('Should verify user on database', async function () { 
			
			const databaseSpy = sinon.spy(database, 'query');
			await sessionController.authenticate(request, response);

			expect(databaseSpy.calledWith('SELECT * from users where email = ?',[ request.body.email ])).to.equal(true);
		});


		it('Should check password', async function() { 
			
			const checkPasswordSpy = sinon.spy(sessionController.auth, 'checkPassword');
			
			await sessionController.authenticate(request, response);
            expect(checkPasswordSpy.calledWith(request.body.password, user.password)).to.equal(true);
		});

		describe('When all good', function() {

			beforeEach(function() {
				sessionController.auth.checkPassword = sinon.fake.returns(true);
			});

			it('Should generate a token', async function() { 
			
				const jwtSpy = sinon.spy(jwt, 'sign');
				await sessionController.authenticate(request, response);

            	expect(jwtSpy.calledWith({ id: user.id }, config.session.secret, { expiresIn: config.session.expiresIn })).to.equal(true);
			});

			it('Should send a token with 200 status code' , async function() { 

				const token = 'eyJzdWIiOiJkZGU5N2Y0ZC0wNmQyLTQwZjEtYWJkNi0xZWRhODM1YzExM2UiLCJhdWQiOiI3c2Jzamh -TRUNCATED- hbnRfaWQiOiJ4cGVwcGVycy5jb20iLCJleHAiOjE1N jY4MzQwMDgsImlhdCI6MTU2NjgzMDQwOH0';
				jwt.sign = sinon.fake.returns(token);
				await sessionController.authenticate(request, response);

				expect(statusSpy.calledWith(200)).to.equal(true);
            	expect(jsonSpy.calledWith({ message: 'success', token: token, user: { id: user.id }})).to.equal(true);
			});
		});
	});
});
