import React, { Component, PropTypes } from "react";

export const ToolTip = props => {
  return (
    <span className="tooltip-icon">
      <img src="/assets/images/icon-faq-grey.svg" />
      <span style={{width:props.width}}>
        {props.title}
      </span>
    </span>
  );
};
