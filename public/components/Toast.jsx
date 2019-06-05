import React, { Component, PropTypes } from "react";

export const Toast = ({ onDismiss, children }) => {
  return (
    <div className="toast--container">
      <div>{children}</div>
      <div>
        <button onClick={onDismiss}>
          <img src="/assets/images/icon-cross-white.svg" />
        </button>
      </div>
    </div>
  );
};
