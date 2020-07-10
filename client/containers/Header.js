import React from 'react';
import {connect} from 'react-redux';
import { logoutUser } from '../actions/users.js';
import Header from '../components/Header.js';

const mapDispatchToProps = function(dispatch) {
    return {
        onSubmit: function() {
            dispatch(logoutUser());
        }
    };
};

export default connect(
    null,
    mapDispatchToProps
)(Header);
