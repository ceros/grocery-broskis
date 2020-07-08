import React from "react";

export const Circle = props => {
  const style = {
    borderRadius: '50%',
    width: props.radius || 100,
    height: props.radius || 100,
    borderColor: props.borderColor || 'white',
    borderWidth: props.borderWidth || 0,
    borderStyle: 'solid',
    backgroundColor: props.backgroundColor || 'transparent',
    ...props.styleOverrides
  };

  return <div style={style}></div>
};
