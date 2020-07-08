import React from 'react';
import {connect} from 'react-redux';
import {history} from '../helpers/history.js';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class LoginForm extends React.Component { 

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event) {
        event.preventDefault();

		const formData = {};
        for (const input of event.target) {
          if (input.name) {
            formData[input.name] = input.value;
          }
        }
        this.props.onSubmit(formData);
    }

    render() {
        return (
            <form onSubmit={this.onSubmit} className="login-form">
                <TextField className="input" type="text" name="email" label="Email" />
                <TextField className="input" type="password" name="password" label="Password" />
                <Button type="submit" color="primary" variant="contained">Login</Button>
				<Button type="button" onClick={() => history.push('/register')}>Register</Button>
            </form>
        );
    }
}

export default LoginForm;
