import React from "react";
import { connect } from "react-redux";
import cx from "classnames";
import { updateListItemStatus } from "../actions/lists";

const icons = {
	0: " ",
	1: "✔",
	2: "🚫"
}

const classNames = {
	0: " ",
	1: "completed",
	2: "out-of-stock"
}

const statusMapping = {
	0: 1,
	1: 2,
	2: 0
}

const ListItem = ({ item, isAcclaimedList, updateListItemStatus }) => {

	if ( ! isAcclaimedList ) {
		return <li className="show-list-item">{item.description}</li>
	}
  	return (
		<li className={cx("list-item", classNames[item.status||0])} onClick={() => updateListItemStatus(item.id, statusMapping[item.status])}>
    		<span className='icon'>{icons[item.status||0]}</span>
    		<span>
      			{item.description}
    		</span>
  		</li>
	)
};

// export default Todo;
export default connect(
  null,
  { updateListItemStatus }
)(ListItem);
