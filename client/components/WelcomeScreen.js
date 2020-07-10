import React, {useState} from 'react';
import {withRouter, useHistory} from 'react-router';
import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';

export default withRouter((props) => {
    console.log("Welcome got called");
    return (
        <div>
            <Button className="pronounced" component={Link} to="/new-list"
                    variant="contained" color="primary">Create new list</Button>
            <Button className="pronounced" component={Link} to="/lists"
                    variant="contained" color="secondary">Shop for a Neighbor</Button>
        </div>
    );
});