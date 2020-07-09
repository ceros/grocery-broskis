import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import { postUser } from '../actions/users.js';
import RegistrationForm from '../components/RegistrationForm.js';

const mapStateToProps = state => ({
    user: state.users.user
});

const mapDispatchToProps = function(dispatch) {
    return {
        onSubmit: function(state) {
            if (state.password != state.confirmPassword) {
                // TODO Give some sort of error.
                return;
            }

            const user = {
                name: state.name,
                email: state.email,
                password: state.password
            };
            dispatch(postUser(user));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(RegistrationForm));
