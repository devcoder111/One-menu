import React, { Component, PropTypes } from "react";

class LoadingSpinner extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return this.props.loading ? (
      <div style={{position: 'fixed', width: '100%', height: '100%', background: 'rgba(0,0,0,0.7)', zIndex: 2000}}>
        <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <img src="assets/images/loading.png" alt="" className="loadingSpinner"/></div>
      </div>
    ) : null;
  }
};

export default LoadingSpinner;

