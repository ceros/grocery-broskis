import React from 'react';

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
		this.props.logout();
    }

    render() {
		const {user} = this.props;

		if(!user.name) {
			return <h1>Grocery</h1>;
		}

        return (
            <form onSubmit={this.onSubmit} className="logout-form">
				<h1>Grocery</h1>
				<div className="user">
					<p>Welcome <strong>{user.name}</strong> | <input type="submit" name="logout" value="Logout" /></p>
				</div>
            </form>
        );
    }
}

export default Header;
