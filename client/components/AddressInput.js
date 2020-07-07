import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';

export class AddressInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { address: '' };
    }

    handleChange(address) {
        this.setState({ address });
    }

    handleSelect(address) {
        this.props.onSelect(address);
    }

    render() {
        return (
            <PlacesAutocomplete
                value={this.state.address}
                onChange={this.handleChange.bind(this)}
                onSelect={this.handleSelect.bind(this)}
                debounce={200}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input
                            {...getInputProps({
                                placeholder: 'Where would you like the items delivered?',
                                className: 'location-search-input',
                            })}
                        />
                        <div className="autocomplete-dropdown-container">
                            {loading && <div>Loading...</div>}
                            {suggestions.map(suggestion => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style,
                                        })}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
        );
    }
}
