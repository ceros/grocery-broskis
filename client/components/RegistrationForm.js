import React from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {withRouter} from 'react-router';

class RegistrationForm extends React.Component { 

    constructor(props) {
        super(props);

      this.onSubmit = this.onSubmit.bind(this);

      this.state = {
          user: props.user
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.props.user) {
        this.props.history.push('/');
      }
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
            <form onSubmit={this.onSubmit} className="registration-form">
                <TextField className="input" type="text" name="name" label="Name" />
                <TextField className="input" type="text" name="email" label="Email" />
                <TextField className="input" type="password" name="password" label="Password" />
                <TextField className="input" type="password" name="confirmPassword" label="Confirm Password" />
                <Button type="submit" color="primary" variant="contained">Register</Button>
            </form>
        );
    }
}

export default withRouter(RegistrationForm);
