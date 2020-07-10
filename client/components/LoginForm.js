import React from 'react';
import {connect} from 'react-redux';
import {history} from '../helpers/history.js';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import Grid from '@material-ui/core/Grid';


class LoginForm extends React.Component { 

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    async onSubmit(event) {
        event.preventDefault();

		const formData = {};
        for (const input of event.target) {
          if (input.name) {
            formData[input.name] = input.value;
          }
        }
       await this.props.onSubmit(formData);
       this.props.history.push("/welcome");
    }

    render() {
        console.log("Login called");
        return (
            <div className="main">
            <Grid container direction="column" justify="space-around" alignItems="center">               
                <form onSubmit={this.onSubmit} className="form">
                    <div className="grid-item"> 
                        <Grid item md>
                        <TextField className="input" type="text" name="email" label="Email" />
                        </Grid>
                    </div>
                    <div className="grid-item"> 
                        <Grid item md>
                        <TextField className="input" type="password" name="password" label="Password" />
                        </Grid>
                    </div>
                    <div className="grid-item"> 
                        <Grid item md>
                        <Button type="submit" variant="outlined" color="inherit" className="buttons" size="large">Login</Button> 
                        </Grid>
                    </div>
                </form>
                <div className="grid-item text-link"> 
                    <Grid item md>
                    <Button variant="text" color="inherit" className="buttons" size="large" component={Link} to="/signup">I Need to Create An Account</Button>
                    </Grid>
                </div>
            </Grid>
            </div>
        );
    }
}

export default LoginForm;
