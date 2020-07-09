import React from 'react';
import {connect} from 'react-redux';
import ShowListScreen from '../components/ShowListScreen.js';

const mapDispatchToProps = function(dispatch) {
    return {
        onSubmit: function() {
            //dispatch(logoutUser());
        }
    };
};

export default connect(
    null,
    mapDispatchToProps
)(ShowListScreen);
