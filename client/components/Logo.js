import React from "react";
import {Circle} from "./Circle";

export default (props) => {
  return (
    <div className="logo-container">
      <div className="logo">
        <Circle radius={90} borderWidth={1} backgroundColor={props.backgroundColor} styleOverrides={{ zIndex: 1, position: 'relative', left: 53 }} />
        <Circle radius={196} borderWidth={1} backgroundColor={props.backgroundColor} styleOverrides={{ marginTop: '-30px', marginBottom: '-30px' }} />
        <Circle radius={90} borderWidth={1} backgroundColor={props.backgroundColor} styleOverrides={{ zIndex: 1, position: 'relative', left: 53 }} />
      </div>
    </div>
  );
};
