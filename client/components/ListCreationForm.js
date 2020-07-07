import React from 'react';
import {ListItem} from "./ListItem";
import {withRouter} from 'react-router';
import {AddressInput} from "./AddressInput";

export const ListCreationForm = withRouter(class extends React.Component {
    constructor() {
        super();

        this.state = {
            items: [],
            budget: 0,
            address: ''
        };
    }

    onItemAdd() {
        this.setState({
            items: this.state.items.concat({})
        });
    }

    onItemRemove(rowIndex) {
        return (() => {
            this.setState({
                items: this.state.items.slice(0, rowIndex).concat(this.state.items.slice(rowIndex + 1))
            });
        }).bind(this)
    }

    onDescriptionChange(rowIndex) {
        return ((e) => {
            const oldItem = this.state.items[rowIndex];
            this.updateItem(rowIndex, e.target.value, oldItem.quantity, oldItem.replaceable);
        }).bind(this)
    }

    onQuantityChange(rowIndex) {
        return ((e) => {
            const oldItem = this.state.items[rowIndex];
            this.updateItem(rowIndex, oldItem.description, e.target.value, oldItem.replaceable);
        }).bind(this)
    }

    onToggleReplaceable(rowIndex) {
        return ((e) => {
            const oldItem = this.state.items[rowIndex];
            this.updateItem(rowIndex, oldItem.description, oldItem.quantity, !oldItem.replaceable);
        }).bind(this);
    }

    updateItem(index, description, quantity, replaceable) {
        const newItems = this.state.items.slice();
        newItems[index] = {
            quantity,
            description,
            replaceable
        };

        this.setState({
            items: newItems
        })
    }

    onBudgetChange(newBudget) {
        this.setState({
            budget: Number.parseFloat(newBudget)
        })
    }

    async onSubmit() {
        try {
            await this.props.onSubmit(this.state.items, this.state.budget, this.state.address);
            this.props.history.push('/');
        } catch (e) {
            console.error(e);
        }
    }

    renderItems() {
        const items = [];
        for (let i = 0; i < this.state.items.length; ++i) {
            const item = this.state.items[i];
            items.push(
                <ListItem
                    description={item.description || ''}
                    quantity={item.quantity || 1}
                    onDescriptionChange={this.onDescriptionChange(i)}
                    onQuantityChange={this.onQuantityChange(i)}
                    onRemove={this.onItemRemove(i)}
                    onToggleReplaceable={this.onToggleReplaceable(i)}
                    key={i} />
            );
        }

        return items;
    }

    render() {
        if (!this.state.address) {
            return (
                <AddressInput onSelect={(address) => this.setState({ address })}></AddressInput>
            );
        }

        return (
            <div>
                <table>
                    <thead>
                        <tr><th>Requested Item</th><th>Quantity</th><th>Permission to Improvise?</th><th></th></tr>
                    </thead>
                    <tbody>
                        {this.renderItems()}
                    </tbody>
                </table>
                <button onClick={this.onItemAdd.bind(this)}>+</button>
                <label>What is the maximum you are willing to spend for these items?
                    $<input type="number" step="0.01" min="0" onChange={this.onBudgetChange.bind(this)} />
                </label>
                <button onClick={this.onSubmit.bind(this)}>Submit</button>
            </div>
        );
    }
});
