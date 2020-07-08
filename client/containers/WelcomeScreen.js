import React from 'react';
import {connect} from 'react-redux';
import WelcomeScreen from '../components/WelcomeScreen';

const mapStateToProps = state => ({
  user: state.users.user
});

export default connect(mapStateToProps, null)(WelcomeScreen);
