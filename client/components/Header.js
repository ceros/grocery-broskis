import React from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {getMe} from '../actions/users.js';
import {getCurrentUser} from '../reducers/users.js';

class Header extends React.Component { 

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

	componentDidMount() {
        this.props.getMe();
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.state);
    }

    render() {
		const {user} = this.props;

		if(!user.name) {
			return <h1 className="main-header">Groceros</h1>;
		}

        return (
            <form onSubmit={this.onSubmit} className="logout-form">
				<h1 className="main-header">Groceros</h1>
				<div className="user">
					<p>Welcome <strong>{user.name}</strong> | <input type="submit" name="logout" value="Logout" /></p>
				</div>
            </form>
        );
    }
}

function mapStateToProps(state) {
	return {
    	user: getCurrentUser(state)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({getMe: getMe}, dispatch);
}

const header = connect(mapStateToProps,mapDispatchToProps)(Header);

export default header;
