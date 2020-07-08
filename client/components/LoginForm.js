import React from 'react';
import {connect} from 'react-redux';
import {history} from '../helpers/history.js';

class LoginForm extends React.Component { 

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleInputChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        this.setState({
            [name]:  value
        });
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.state);
    }

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <label htmlFor="email">Email:</label>
                <input type="text" 
                    name="email" 
                    value={this.state.email}
                    onChange={this.handleInputChange} />
                <label htmlFor="password">Password:</label>
                <input type="password" 
                    name="password" 
                    value={this.state.password}
                    onChange={this.handleInputChange} />
				<input type="submit" name="signin" value="Sign in" />
				<button
					type="button"
    				onClick={() => history.push('/register')}>
    				Register
  				</button>
            </form>
        );
    }
}

export default LoginForm;
