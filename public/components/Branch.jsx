import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import { MAP_CONSTANTS } from  '../shared/mapping.utils';
import Navbar from './Navbar';
import PageContent from './PageContent';

let createHandlers = (ctx) => {
  let onProfileFetched = (obj) => {
    // console.log('profile fetched!');

    let profile = obj;

/*
    ctx.setState({
      branches: profile.branches
    });
*/
  };

  return {
    onProfileFetched
  };
};

class Branch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      branches: []
    };
    this.handlers = createHandlers(this);
  }

  componentDidMount() {
    this.props.dispatch(actionCreators.getProfile(this.handlers.onProfileFetched));
  }

  render () {
    const { action, id } = this.props.match.params;
    const actionType = (typeof this.props.match.params.action !== 'undefined') ? 'branch-' + action : 'branch';

    const profile = (this.props.profile) ? this.props.profile : {};

    const branchRoot = (profile.branches && profile.branches.length > 0) ? profile.branches.find(branch => {
      return branch.HasHeadquarters == 1;
    }) : null;

    if (branchRoot) {
      branchRoot.mainContact = (branchRoot.contacts && branchRoot.contacts.length > 0) ? branchRoot.contacts.find(contact => {
        return contact.IsAdmin == 1;
      }) : null;
    }

    // console.log(branchRoot);

    const currentBranch = (profile.branches && profile.branches.length > 0) ? profile.branches.find(branch => {
      return parseInt(branch.BranchID, 10) === parseInt(id, 10);
    }) : null;

    const menus = (currentBranch && currentBranch.menus && currentBranch.menus.length > 0) ? currentBranch.menus : [];

    const company = {
      name: profile.Name,
      description: profile.Description,
      logo: {
        imgPath: profile.LogoPath,
        altDesc: profile.LogoAltDesc
      },
      website: profile.Website,
      tel: profile.Tel,
      email: profile.Email,
      social: {
        twitter: profile.Twitter,
        facebook: profile.Facebook,
        instagram: profile.Instagram,
        youtube: profile.Youtube
      },
      branchRoot: branchRoot
    };

    const sections = [{
        type: actionType,
        title: "Branch " + id,
        articles: [{
          type: "branches",
          title: "Branch " + id,
          component: {
            id: id,
            type: "Branches",
            title: "",
            props: profile
          }
        }, {
          type: "menus",
          title: "Branch Menus",
          component: {
            type: "Menus",
            title: "",
            props: {
              menus: menus,
              currency: {
                id: 2,
                name: "Sterling Pound",
                nameShort: "GBP",
                symbol: MAP_CONSTANTS.DEFAULT_LANGUAGE_SYMBOL
              }
            }
          }
        }]
    }];

    const asideType = 'plan';


    return (
      <div>
        <Navbar logo={company.logo} />
        <PageContent sections={sections} asideType={asideType} company={company} />
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  // console.log(state);
  return {
    profile: state._profile.profile
  }
};

export default connect(mapStateToProps)(Branch);
