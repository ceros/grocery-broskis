import React from 'react';
import {history} from '../helpers/history.js';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import {withRouter} from 'react-router';
import {Link} from "react-router-dom";


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
      <div className="main">
      <Grid container direction="column" justify="space-around" alignItems="center">
        <form onSubmit={this.onSubmit} className="form">
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
            <Button type="submit" variant="outlined" color="inherit" size="large">Submit</Button>
            </Grid>
          </div>
        </form>
        <div className="grid-item text-link">
            <Grid item md>
            <Button variant="text" color="inherit"  size="large" component={Link} to="/login">I already Have An Account</Button>
            </Grid>
        </div>
      </Grid>
      </div>
    );
  }
}


export default RegistrationForm;
