import React from 'react';
import {Link} from "react-router-dom";

export default () => (
    <div>
        <Link to="/new-list" className="button">Create new list</Link>
        <Link to="/lists" className="button">Shop for a Neighbor</Link>
    </div>
);
