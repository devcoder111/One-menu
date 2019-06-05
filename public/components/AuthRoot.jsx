import React, {Component, PropTypes} from 'react';

import {Redirect, Route} from 'react-router';
import {connect} from 'react-redux';

class AuthRoot extends Component {
  render() {
    const {dispatch} = this.props;

    // console.log(this.props.isAuthenticated);
    // console.log("*********************************************")
    // console.log(window.location.href.substr(window.location.href.indexOf("code")+5, window.location.href.length))

    if (
      this.props.isAuthenticated &&
      !window.location.href.includes('invoice')
    ) {
      return (
        <Redirect
          to={{
            pathname: '/dashboard',
            state: {from: this.props.location},
          }}
        />
      );
    } else if (window.location.href.indexOf('reset/') > -1) {
      return (
        <Redirect
          to={{
            pathname:
              '/reset/' +
              window.location.href.substr(
                window.location.href.indexOf('reset/') + 6,
                window.location.href.length
              ),
            state: {from: this.props.location},
          }}
        />
      );
    } else if ( this.props.isAuthenticated && window.location.href.indexOf('invoice') > -1) {
      return (<div></div>);
    } else {
      return (
        <Redirect
          to={{
            pathname: '/home',
            state: {from: this.props.location},
          }}
        />
      );
    }
  }
}

AuthRoot.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  return {
    isAuthenticated: state._auth.authenticated,
    token: state._auth.token,
  };
};

export default connect(mapStateToProps)(AuthRoot);
