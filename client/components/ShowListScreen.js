import React from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {showList} from '../actions/lists.js';
import {getCurrentList} from '../reducers/lists.js';
import ListItem from "./ListItem";


class ShowListScreen extends React.Component { 

    constructor(props) {
        super(props);
    }

	componentDidMount() {
		const { match: { params } } = this.props;
		this.props.showList(params.id);
    }

    render() {
		const {list} = this.props;
		const { match: { url } } = this.props;
		const isAcclaimedList = true;
		
		if ( list.items && list.items.length > 0 ) {
			return (
			<div className="items">
				<span>Total items: {list.items.length}</span>
				<ul>
					{list.items.map(item => {
						return <ListItem key={item.id} item={item} isAcclaimedList={isAcclaimedList} />
					})}
				</ul>
				<span>Budget: {list.budget ? list.budget.toFixed(2): 'Not defined'}</span>
			</div>)
		} else {
			return "No items"
		}
       
	}
}

export default ShowListScreen;
