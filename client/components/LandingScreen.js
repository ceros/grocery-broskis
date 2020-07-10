import React from "react";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import Logo from "./Logo";

export default () => {
  return (
    <div className="main">
      <main>
        <Logo backgroundColor="#402BE9" />
        <div className="headers">
          Keeping our community safe by helping shop for the people in need
        </div>
        <div className="text-link">
          <Button variant="text" color="inherit" component={Link} to="/about">How does it work?</Button>
        </div>
        <div className="grid-item">
          <Button variant="outlined" color="inherit" size="large" component={Link} to="/login">Login</Button>
        </div>
        <div className="grid-item">
          <Button variant="outlined" color="inherit" size="large" component={Link} to="/signup">Register</Button>
        </div>
      </main>
    </div>

  );
};
