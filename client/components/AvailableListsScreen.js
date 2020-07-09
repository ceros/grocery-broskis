import React from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import {withRouter} from 'react-router';
import {Link} from "react-router-dom";
import {AddressInput} from "./AddressInput";
import {getCoordinatesForAddress} from "../utils/geocoding";

export const AvailableListsScreen = withRouter(class extends React.Component {
    constructor() {
        super();

        this.state = {
            address: null,
            latitude: null,
            longitude: null
        };
    }

    async onSubmit() {
        try {
            await this.props.onSubmit(this.state.items, this.state.budget, this.state.address, this.state.latitude, this.state.longitude);
            this.props.history.push('/');
        } catch (e) {
            console.error(e);
        }
    }

    async onSelectAddress(address) {
        let lat, lng;
        const coordinates = await getCoordinatesForAddress(address);
        if (coordinates){
            lat = coordinates.lat;
            lng = coordinates.lng;
        }
        this.setState({ 
            address : address,
            latitude : lat,
            longitude : lng
        });

        await this.props.getLists(lat, lng);
    }

    render() {
        if (!this.state.address) {
            return (
                <AddressInput onSelect={this.onSelectAddress.bind(this)}></AddressInput>
            );
        }

        if (!this.props.lists || this.props.lists.length === 0){
            return (
                <div>No lists available in your area right now! Check back next time!</div>
            )
        }

        return (
            <div>
                {this.props.lists.map((list) => 
                    <Button component={Link} to={"/shop-list/" + list.id} onClick={this.onSubmit.bind(this)} key={list.id.toString()} variant="contained" color="primary" className="pronounced">
                        <Typography>{list.address}</Typography>
                        <Typography>Budget: ${list.budget}</Typography>
                        <Typography>Number of items: {list.items.length}</Typography>
                    </Button>

                )}
            </div>
        );
    }
});
