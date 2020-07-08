import {connect} from 'react-redux';
import {ListCreationForm} from "../components/ListCreationForm";
import {submitList} from "../actions/lists";

const mapDispatchToProps = (dispatch) => {
    return {
        async onSubmit(listItems, budget, address, preferredStorePlaceIds) {
            if (listItems && listItems.length) {
                await dispatch(submitList(listItems, budget, address, preferredStorePlaceIds));
            }
        }
    }
}

export default connect(null, mapDispatchToProps)(ListCreationForm);
