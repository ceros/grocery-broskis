import React from 'react';
import {connect} from 'react-redux';
import { loginUser } from '../actions/users.js';
import LoginForm from '../components/LoginForm.js';

const mapDispatchToProps = function(dispatch) {
    return {
        onSubmit: function(state) {
            if (!state.email || !state.password ) {
                // TODO Give some sort of error.
                return;
            }

            const user = {
                email: state.email,
                password: state.password
            };
            dispatch(loginUser(user));
        }
    };
};

export default connect(
    null,
    mapDispatchToProps
)(LoginForm);
