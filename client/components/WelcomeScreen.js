import React from "react";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import Logo from "./Logo";
import { ButtonGroup } from "@material-ui/core";

export default props => {
  return (
    <div className="login">
      <h1 className="main-header">Groceros</h1>
      <main>
        <Logo backgroundColor="#402BE9" />
        <div className="headers">
          Keeping our community safe by helping shop for the people in need
        </div>
        <div className="about-link">
          <Button variant="text" color="inherit" component={Link} to="/about">How does it work?</Button>
        </div>
        <ButtonGroup orientation="vertical" className="buttons" color="inherit" aria-label="vertical outlined primary button group">
        <Button variant="outlined" size="large" component={Link} to="/login">Login</Button>
        <Button variant="outlined"  size="large" component={Link} to="/signup">Register</Button>
        </ButtonGroup>
      </main>
    </div>

  );
};
