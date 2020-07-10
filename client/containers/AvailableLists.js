import {connect} from 'react-redux';
import {AvailableListsScreen} from "../components/AvailableListsScreen";
import {fetchLists} from "../actions/lists";

const mapStateToProps = state => ({
    lists: state.availablelists
});

const mapDispatchToProps = (dispatch) => {
    return {
        async getLists(latitude, longitude) {
            await dispatch(fetchLists(latitude, longitude));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AvailableListsScreen);
