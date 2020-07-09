import React from 'react';

class ShowListScreen extends React.Component { 

    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

	componentDidMount() {
		const { match: { params } } = this.props;
        this.props.showList(params.id);
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
					return <li key={item.id}>{item.description}</li>
				})}
			</ul>)
		} else {
			return "No items"
		}
       
	}
}

export default ShowListScreen;
