import React from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {showList} from '../actions/lists.js';
import {getCurrentList} from '../reducers/lists.js';
import ListItem from "./ListItem";

class ShowListScreen extends React.Component { 

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

	componentDidMount() {
        this.props.showList();
    }

    onSubmit(event) {
        event.preventDefault();
        this.props.onSubmit(this.state);
    }

    render() {
		const {list} = this.props;

		if ( list.items && list.items.length > 0 ) {
			return (<ul className="items">
				{list.items.map(item => {
					return <ListItem key={item.id} item={item} />
				})}
			</ul>)
		} else {
			return "No items"
		}
       
	}
}

function mapStateToProps(state) {
	return {
    	list: getCurrentList(state)
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({showList: showList}, dispatch);
}

const showListScreen = connect(mapStateToProps,mapDispatchToProps)(ShowListScreen);

export default showListScreen;
