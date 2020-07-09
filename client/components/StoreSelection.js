import React, {useState} from "react";
import {geocodeByAddress} from 'react-places-autocomplete';
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Spinner from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';

export class StoreSelection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: undefined,
      userCoordinates: undefined,
      selectedStores: {}
    }
  }

  async componentDidMount() {
    await this.fetchZip();
    await this.fetchOptions();
  }

  async fetchZip() {
    if (this.state.userCoordinates) {
      return;
    }

    const mapData = await geocodeByAddress(this.props.userAddress);
    this.setState({
      userCoordinates: {
        latitude: mapData[0] && mapData[0].geometry.location.lat(),
        longitude: mapData[0] && mapData[0].geometry.location.lng(),
      }
    });
  }

  async fetchOptions() {
    if (this.state.options || !this.state.userCoordinates) {
      return;
    }

    const storeResponse = await fetch(`/api/0.0.0/nearby-stores?location=${this.state.userCoordinates.latitude},${this.state.userCoordinates.longitude}`);
    this.setState({ options: await storeResponse.json() });
  }

  onStoreSelect(index) {
    return (e, isChecked) => {
      const newSelections = {
        ...this.state.selectedStores
      };

      if (!isChecked) {
        delete newSelections[this.state.options[index].place_id];
      } else {
        newSelections[this.state.options[index].place_id] = true;
      }

      this.setState({
        selectedStores: newSelections
      })
    }
  }

  onComplete() {
    const selectedStores = Object.keys(this.state.selectedStores).length
      ? Object.keys(this.state.selectedStores)
      : null;

    this.props.onComplete(selectedStores)
  }

  render() {
    if (!this.state.options) {
      return <Spinner />
    }

    const hasSelectedStore = !!Object.keys(this.state.selectedStores).length;
    return (
      <div>
        <Button onClick={this.onComplete.bind(this)} variant="contained" color={hasSelectedStore ? 'secondary' : 'primary'}>{hasSelectedStore ? 'I am done selecting stores' : 'Any old place will do'}</Button>
        <FormGroup>
          {this.state.options.map((option, i) => (
            <FormControlLabel control={<Checkbox onChange={this.onStoreSelect(i).bind(this)} name={option.place_id} />} label={`${option.name}: ${option.vicinity}`} />
          ))}
        </FormGroup>
      </div>
    );
  }
}
