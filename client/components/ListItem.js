import React from 'react';

export const ListItem = (props) => {
    return (
        <tr>
            <td><textarea onChange={props.onDescriptionChange}></textarea></td>
            <td><input type="number" min="1" onChange={props.onQuantityChange}/></td>
            <td><input type="checkbox" onChange={props.onToggleReplaceable} /></td>
            <td><button onClick={props.onRemove}>-</button></td>
        </tr>
    )
};
