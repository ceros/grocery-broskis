/******************************************************************************
 *      SessionController
 *
 * Restful routes for manipulating session.
 *
 ******************************************************************************/

const jwt = require("jsonwebtoken");
const AuthenticationService = require('../services/authentication');

module.exports = class SessionController {

    constructor(config, database) {
		this.secret = config.secret;
        this.database = database;
        this.auth = new AuthenticationService();
    }

	async checkSession(request, response, next) {

		let user;

		if ( req.user ) {
			result = await database.query('SELECT * from users where id = ?', [request.user.id]);
			user = result[0];
		}

		if ( ! user ) return response.status(401).json({ message: 'user not found, not verified or not enabled' });
		request.user = user;
		next();
	}

	async authenticate(request,response) {

		let user;
	
		const { email, password } = request.body;

		if ( email ) { 
			result = await database.query('SELECT * from users where email = ?', [email]);
			user = result[0];
		}

		if ( ! user || ! this.auth.checkPassword.isValidPassword(password, user.password) ) {
			return response.status(403).json({ message: 'invalid credentials' });
		}

		const token = jwt.sign({ id: user.id }, this.secret, { expiresIn: '5h' });
		response.status(200).json({ message: 'success', token: token, user: { id: user.id }});
	}
}
