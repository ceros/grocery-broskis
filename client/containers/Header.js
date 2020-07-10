import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getCurrentUser} from '../reducers/users.js';
import {logout,getMe} from '../actions/users.js';
import Header from '../components/Header.js';

function mapStateToProps(state) {
	return {
    	user: getCurrentUser(state)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({getMe: getMe, logout: logout}, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
