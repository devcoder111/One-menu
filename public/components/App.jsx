import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';

import {
  HashRouter as Router,
  Route
} from 'react-router-dom';

import * as actionCreators from '../action-creators';
import * as AuthService from './Auth/auth.service';

import AuthRoot from './AuthRoot';
import Dashboard from './Dashboard';
import Home from './Home';
import Profile from './Profile';
import Branches from './Branches';
import Branch from './Branch';
import MenusPage from './MenusPage';
import MenuPage from './MenuPage';
import TranslatePage from './TranslatePage';
import TranslationsPage from './TranslationsPage';
import TranslationPage from './TranslationPage';
import Signup from './Signup'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'
import Terms from './Terms'
import Page from './Page';
import Plans from './Plans/Plans';
import MySubscriptions from './Subscriptions/MySubscriptions';
import PrivateRoute from './PrivateRoute';
import LoadingSpinner from "./LoadingSpinner";
import PlansStepOne from "./Plans/PlansStepOne";
import PlansStepTwo from "./Plans/PlansStepTwo";
import PlansStepOneLanguage from './Plans/PlansStepOneLanguage'
import PlansStepOneModify from './Plans/PlansStepOneModify';
import Billing from './Billing/Billing';
import Invoice from './Billing/Invoice'

let createHandlers = (dispatcher) => {
  let checkAuth = () => {
    dispatcher(actionCreators.getAuth());
  };

  return {
    checkAuth
  };
};

class App extends Component {
  constructor(props) {
    super(props);
    this.handlers = createHandlers(this.props.dispatch);
  }

  componentDidMount() {
    this.handlers.checkAuth();
  }

  render () {
    const { dispatch, loading } = this.props;

    const AuthRootRenderer = () => {
      return (
        <AuthRoot dispatch={dispatch} />
      );
    };

    const HomeRenderer = () => {
      return (
        <Home dispatch={dispatch} />
      );
    };
    const SignupRenderer = () => {
      return (
        <Signup dispatch={dispatch} />
      );
    };
    const ForgotPasswordRenderer = () => {
      return (
        <ForgotPassword dispatch={dispatch} />
      );
    };
    const ResetPasswordRenderer = () => {
      return (
        <ResetPassword dispatch={dispatch} />
      );
    };

    const InvoiceRenderer = () => {
      return (
        <Invoice dispatch={dispatch} />
      );
    };

    return (this.props.isAuthenticated !== undefined) ? (
      <Router>
        <div style={{position: 'relative'}}>
          <LoadingSpinner loading={loading} />
          <Route path="/" render={AuthRootRenderer} />
          <Route path="/invoice" component={InvoiceRenderer} />
          <Route path="/home" render={HomeRenderer} />
          <Route path="/signup" render={SignupRenderer} />
          <Route path="/forgot" render={ForgotPasswordRenderer} />
          <Route path="/reset/:code" render={ResetPasswordRenderer} />
          <Route path="/terms" component={Terms} />
        
          <Page>
            <PrivateRoute path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/profile/:action" component={Profile} />
            <PrivateRoute path="/branch/:action/:id" component={Branch} />
            <PrivateRoute path="/branches" component={Branches} />
            <PrivateRoute path="/subscriptions/plans" component={Plans} />
            <PrivateRoute path="/subscriptions/billing" component={Billing} />
            <PrivateRoute path="/subscriptions/my-subscriptions" component={MySubscriptions} />
            <PrivateRoute path="/subscriptions/step-1" component={PlansStepOne} />
            <PrivateRoute path="/subscriptions/step-1-language" component={PlansStepOneLanguage} />
            <PrivateRoute path="/subscriptions/step-1-modify" component={PlansStepOneModify} />
            <PrivateRoute path="/subscriptions/step-2" component={PlansStepTwo} />
            <PrivateRoute path="/translations" component={TranslationsPage} />
            <PrivateRoute path="/translation/:id" component={TranslationPage} />
            <PrivateRoute path="/translate/:component" component={TranslatePage} />
            <PrivateRoute path="/menus" component={MenusPage} />
            <PrivateRoute path="/menu/:action/:id" component={MenuPage} />
          </Page>
        </div>
      </Router>
    ) : ( <div>Placeholder div to replace by Loading component</div>)
  }
};

App.propTypes = {
  dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state._auth.authenticated,
    loading: state._profile.loading,
    token: state._auth.token
  };
};

export default connect(mapStateToProps)(App);

