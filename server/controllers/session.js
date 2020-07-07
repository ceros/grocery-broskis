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
		this.config = config.session;
        this.database = database;
        this.auth = new AuthenticationService();
    }

	async checkSession(request, response, next) {
		
		let user;

		if ( request.user ) {
			const result = await this.database.query('SELECT * from users where id = ?', [request.user.id]);
			user = result[0];
		}

		if ( ! user ) {
			response.status(401).json({ message: 'user not found, not verified or not enabled' });
			return;
		}

		request.user = user;
		next();
	}

	async authenticate(request,response) {

		let user;
	
		const { email, password } = request.body;

		if ( email && password ) { 
			const result = await this.database.query('SELECT * from users where email = ?', [email]);
			user = result[0];
		}

		if ( ! user || ! this.auth.checkPassword(password, user.password) ) {
			response.status(403).json({ message: 'invalid credentials' });
			return;
		}

		const token = jwt.sign({ id: user.id }, this.config.secret, { expiresIn: this.config.expiresIn });
		response.status(200).json({ message: 'success', token: token, user: { id: user.id }});
	}
}
