import React from 'react';
import ReactDOM from 'react-dom';

import MaterialTable from "material-table";
import Button from '@material-ui/core/Button';
import NumberFormat from 'react-number-format';
import {withRouter} from 'react-router';
import {AddressInput} from "./AddressInput";
import {getCoordinatesForAddress} from "../utils/geocoding";

export const ListCreationForm = withRouter(class extends React.Component {
    constructor() {
        super();

        this.state = {
            items: [],
            budget: 0,
            address: '',
            latitude: null,
            longitude: null
        };
    }

    async onItemAdd(row,  metadata) {
        this.setState({
            items: this.state.items.concat({
              ...row,
            })
        });
    }

    async onItemRemove(metadata) {
        this.setState({
            items: this.state.items.slice(0, metadata.tableData.id).concat(this.state.items.slice(metadata.tableData.id + 1))
        });
    }

    async onItemUpdate(row, metadata) {
        const newItems = this.state.items.slice();
        newItems[metadata.tableData.id] = {
          ...row,
          replaceable: String(row.replaceable).toLowerCase() === 'true'
        };

        this.setState({
            items: newItems
        })
    }

    onBudgetChange(newBudget) {
        this.setState({
            budget: newBudget.floatValue
        })
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
    }

    render() {
        if (!this.state.address) {
            return (
                <AddressInput onSelect={this.onSelectAddress.bind(this)}></AddressInput>
            );
        }

        return (
            <div>
                <MaterialTable
                  title="Create new shopping list"
                  data={this.state.items}
                  columns={[
                    { title: 'Requested Item', field: 'description' },
                    { title: 'Quantity', field: 'quantity' },
                    { title: 'Permission to Improvise?', field: 'replaceable', initialEditValue: true, lookup: { true: 'Yes', false: 'No' } }
                  ]}
                  editable={{
                    isEditable: () => true,
                    isEditHidden: () => false,
                    isDeletable: () => true,
                    isDeleteHidden: () => false,
                    onRowAdd: this.onItemAdd.bind(this),
                    onRowDelete: this.onItemRemove.bind(this),
                    onRowUpdate: this.onItemUpdate.bind(this)
                  }}/>
                <label>What is the maximum you are willing to spend for these items?
                    <NumberFormat onValueChange={this.onBudgetChange.bind(this)} allowNegative={false} prefix="$" decimalScale="2" fixedDecimalScale={true} />
                </label>
                <Button onClick={this.onSubmit.bind(this)} variant="contained" color="primary" className="pronounced">Submit</Button>
            </div>
        );
    }
});
