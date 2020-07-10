import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {showList} from '../actions/lists.js';
import {getCurrentList} from '../reducers/lists.js';
import ShowListScreen from '../components/ShowListScreen.js';


function mapStateToProps(state) {
	const list = getCurrentList(state);
	return { list }
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({showList: showList}, dispatch);
}


export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ShowListScreen);
