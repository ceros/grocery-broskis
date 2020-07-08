import React from "react";

import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import Logo from "./Logo";

export default props => {
  return (
    <div className="login">
      <h1>Groceros</h1>
      <main>
        <div>
          Keeping our community safe by helping shop for the people in need
        </div>
        <Logo backgroundColor="#402BE9" />
        <div>How does it work?</div>
        <Button variant="outlined" component={Link} to="/login">Login</Button>
        <Button variant="outlined" component={Link} to="/signup">Register</Button>
      </main>
    </div>
  );
};
