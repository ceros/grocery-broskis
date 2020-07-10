import React from 'react';
import {connect} from 'react-redux';
import {history} from '../helpers/history.js';
import { postUser } from '../actions/users.js';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import {withRouter} from 'react-router';

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
          <div className="login">
          <h1 className="main-header">Groceros</h1>
          <Grid
              container
              direction="column"
              justify="space-around"
              alignItems="center"
          >
            <form onSubmit={this.onSubmit} className="registration-form">
              <div className="grid-item">
                <Grid item md>
                <TextField type="text" name="name" label="Name" onChange={this.handleInputChange}/>
                </Grid>
              </div>
              <div className="grid-item">
                <Grid item md>
                <TextField type="text" name="email" label="Email" onChange={this.handleInputChange}/>
                </Grid>
              </div>
                <div className="grid-item">
                <Grid item md>
                <TextField type="password" name="password" label="Password" onChange={this.handleInputChange}/>
                </Grid>
              </div>
              <div className="grid-item">
                <Grid item md>
                <TextField type="password" name="confirmPassword" label="Confirm" onChange={this.handleInputChange}/>
                </Grid>
              </div>
              <div className="grid-item">
                <Grid item md>
                <Button type="submit" variant="outlined" color="inherit" className="buttons" size="large">Submit</Button>
                </Grid>
              </div>
              <div className="grid-item">
                <Grid item md>
                <Button type="button" variant="outlined" color="inherit" className="buttons" size="large" onClick={() => history.push('/login')}>Login</Button>
                </Grid>
              </div>
            </form>
          </Grid>
        </div>
        );
    }
}

export default withRouter(RegistrationForm);
