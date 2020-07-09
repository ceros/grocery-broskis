/**************************************************************************************************
 *         API Router v0 
 *
 * This is the RESTful API router.  It contains all of our backend API routes.
 * For now, all of the routes and their implementations are defined in this
 * file.  
 *
 * NOTE: This file is versioned and loaded on ``/api/0.0.0/``.  So ``/users`` is
 * really ``/api/0.0.0/users``.  This is so that we can load multiple versions
 * of the api as we make changes and leave past versions still accessible.
 **************************************************************************************************/
const express = require('express');
const jwt = require('express-jwt');

module.exports = function(database, config) {
	const authMiddleware = jwt({secret: config.session.secret, algorithms: ['HS256']});
    const router = express.Router();


    /******************************************************************************
     *          User REST Routes
     ******************************************************************************/
    const UserController = require('./controllers/users');
    const userController = new UserController(database);
    const SessionController = require('./controllers/session');
	const sessionController = new SessionController(config, database);

	const checkSession = async function(request, response, next) {
		await authMiddleware(request, response, async function() {
			await sessionController.checkSession(request, response, next);
		});
	};
	
	router.get('/users/me', checkSession, function(request, response) {
		userController.currentUser(request, response);
	});

	// Get a list of all users.
    router.get('/users', function(request, response) {
        userController.getUsers(request, response);
    });

    // Create a new user 
    router.post('/users', function(request, response) {
        userController.postUsers(request, response);
    });

    // Get the details of a single user 
    router.get('/user/:id', function(request, response) {
        userController.getUser(request, response);
    });

    // Replace a user wholesale.
    router.put('/users/:id', function(request, response) {
        userController.putUser(request, response);
    });
        
    // Edit an existing user with partial data.
    router.patch('/users/:id', function(request, response) {
        userController.patchUser(request, response);
    });

    // Delete an existing user.
    router.delete('/users/:id', function(request, response) {
        userController.deleteUser(request, response);
    });

	// Authenticate an user.
	router.post('/authenticate', function(request, response) {
		sessionController.authenticate(request, response);
	});

    const ListController = require('./controllers/lists');
    const listController = new ListController(database);

    router.post('/users/:user/lists', listController.createList.bind(listController));

    router.post('/lists', function(request, response){
        listController.getListsNearCoordinates(request, response);
    });

    
    const StoreController = require('./controllers/stores');
    const storeController = new StoreController(database);

    router.get('/nearby-stores', storeController.listNearbyStores.bind(storeController));

    return router;
};
