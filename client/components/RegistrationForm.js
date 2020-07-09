import React from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
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

        console.log(formData);
        
        if (formData.password != formData.confirmPassword) {
          // TODO make this better
          window.alert('pass dont match');
        return;
        }
        
        this.props.onSubmit(formData);
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
                <TextField type="text" name="name" label="Name" />
                </Grid>
              </div>
              <div className="grid-item">
                <Grid item md>
                <TextField type="text" name="email" label="Email" />
                </Grid>
              </div>
                <div className="grid-item">
                <Grid item md>
                <TextField type="password" name="password" label="Password" />
                </Grid>
              </div>
              <div className="grid-item">
                <Grid item md>
                <TextField type="password" name="confirmPassword" label="Confirm" />
                </Grid>
              </div>
              <div className="grid-item">
                <Grid item md>
                <Button type="submit" variant="outlined" color="inherit" className="buttons" size="large">Submit</Button>
                </Grid>
              </div>
            </form>
          </Grid>
        </div>
        );
    }
}

export default withRouter(RegistrationForm);
