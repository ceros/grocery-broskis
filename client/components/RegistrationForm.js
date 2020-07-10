import React from 'react';
import {history} from '../helpers/history.js';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.user) {
      this.props.history.push('/');
    }
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} className="registration-form">
        <TextField className="input" type="text" name="name" label="Name" onChange={this.handleInputChange}/>
        <TextField className="input" type="text" name="email" label="Email" onChange={this.handleInputChange}/>
        <TextField className="input" type="password" name="password" label="Password" onChange={this.handleInputChange}/>
        <TextField className="input" type="password" name="confirmPassword" label="Confirm Password" onChange={this.handleInputChange}/>
        <Button type="submit" color="primary" variant="contained">Register</Button>
        <Button type="button" onClick={() => history.push('/login')}>Login</Button>
      </form>
    );
  }
}

export default RegistrationForm;
