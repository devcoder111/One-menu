import React, { Component, PropTypes } from 'react';

import { connect } from 'react-redux';
import * as actionCreators from '../action-creators';

import Navbar from './Navbar';
import PageContent from './PageContent';

let createHandlers = (ctx) => {
  let onMenusFetched = (obj) => {
    // console.log('menus fetched!');

    let menus = obj;


    ctx.setState({
      component: {
        type: 'menu',
        menus: menus
      }
    });
  };

  let onProfileFetched = (obj) => {
    // console.log('profile fetched!');

    let profile = obj;

    /*
    ctx.setState({
      branches: profile.branches
    });
*/
  };

  let setMenu = (data) => {
    ctx.props.dispatch(actionCreators.setMenu(data));
  };

  return {
    onMenusFetched,
    onProfileFetched,
    setMenu,
  };
};

class MenuPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      component: {},
      branches: []
    };
    this.handlers = createHandlers(this);
    this.getFilteredMenusById = this.getFilteredMenusById.bind(this);
  }

  getCurrentBranch(profile, currentBranchMenuId) {
    return (profile.branches && profile.branches.length > 0) ? profile.branches.find(branch => {
      return branch.BranchID === currentBranchMenuId;
    }) : null;
  }

  getMenus(profile) {
    // console.log(profile)
    return (profile.branches && profile.branches.length > 0) ? profile.branches.reduce((acc, branch) => {
      return acc.concat(branch.menus);
    }, []) : [];
  }

  getFilteredMenusById(menus, id) {

    const items = (menus && menus.length > 0) ? menus.filter(menu => {
      return parseInt(menu.MenuID, 10) === parseInt(id, 10);
    }) : [];
    const branches = items.map(menu => menu.BranchID) || [];
    const res = items && items[0] || null;

    if (res) { // TODO remove this code
      // res.branchesIds = branches;
      //
      // if (branches && this.props.profile && this.props.profile.branches) {
      //   res.branches = branches.map(branchID => {
      //     let branch = this.props.profile.branches.find(branch => branch.BranchID === branchID) || {}
      //     return branch
      //       ? {
      //       Address: branch.Address,
      //       BranchID: branch.BranchID,
      //       City: branch.City,
      //       CompanyID: branch.CompanyID,
      //       Country: branch.Country,
      //       Date: branch.Date,
      //       Email: branch.Email,
      //       Name: branch.Name,
      //       Tel: branch.Tel,
      //       languages: branch.languages,
      //       cuisines: branch.cuisines,
      //       currencies: branch.currencies,
      //       images: branch.images,
      //     } : {}
      //   })
      // } else {
      //   res.branches = [];
      // }
    }
    // console.log('menu branches', branches, this.props.profile.branches, res)
    return  res ? [res] : null;
    // return  items;
  }

  getCurrentMenu(menus) {
    return (menus && menus.length > 0) ? menus[0] : {};
  }

  getCurrencies(currentBranch) {
    return (currentBranch && currentBranch.currencies && currentBranch.currencies.length > 0) ? currentBranch.currencies : [];
  }

  getLanguages(currentBranch) {
    return (currentBranch && currentBranch.languages && currentBranch.languages.length > 0) ? currentBranch.languages : [];
  }

  componentDidMount() {
    const profile = (this.props.profile) ? this.props.profile : {};
    //this.props.dispatch(actionCreators.getMenus(this.handlers.onMenusFetched));
    // console.log(this.getCurrentMenu(this.getFilteredMenusById(this.getMenus(profile), this.props.match.params.id)));
    if (this.props.match.params.action === 'add') {
      this.props.dispatch(actionCreators.setMenu({}));
    } else {
      // this.props.dispatch(actionCreators.setMenu(this.getCurrentMenu(this.getFilteredMenusById(this.getMenus(profile), this.props.match.params.id))));
    }

    this.props.dispatch(actionCreators.getProfile(this.handlers.onProfileFetched));
  }

  render () {
    const { action, id } = this.props.match.params;

    const profile = (this.props.profile) ? {...this.props.profile} : {};

    const branchRoot = (profile.branches && profile.branches.length > 0) ? profile.branches.find(branch => {
      return branch.HasHeadquarters == 1;
    }) : null;

    if (branchRoot) {
      branchRoot.mainContact = (branchRoot.contacts && branchRoot.contacts.length > 0) ? branchRoot.contacts.find(contact => {
        return contact.IsAdmin == 1;
      }) : null;
    }

    const actionType = (typeof this.props.match.params.action !== 'undefined') ? 'menu-' + action : 'menu';

    // const menus = this.getMenus(profile);
    const menus = profile && profile.menus;
    const currentBranchMenu = this.getFilteredMenusById(menus, id);
    const currentBranchMenuId = (currentBranchMenu && currentBranchMenu.length > 0) ? currentBranchMenu[0].BranchID : 0;
    const currentBranch = this.getCurrentBranch(profile, currentBranchMenuId);
    const currencies = this.getCurrencies(currentBranch);

    const filteredMenus = this.getFilteredMenusById(menus, id);
    const currentMenu = this.getCurrentMenu(filteredMenus);
    const menuTitle = (currentMenu && currentMenu.Title) ? currentMenu.Title : ("Menu " + id);
    const originalLanguages = currentMenu && currentMenu.originalLanguages;
    const languages = currentMenu && currentMenu.languages;

    // console.log('currentMenu', currentMenu)
    // console.log('menus', menus)
    // console.log("currentBranchMenuId " + currentBranchMenuId)
    // console.log(currentBranchMenu)
    // console.log(currentBranch)
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
        title: menuTitle,
        articles: [{
          type: "menus-detail",
          title: "Menu",
          component: {
            type: "menus-detail",
            title: "",
            props: {
              menus: filteredMenus,
              currencies: currencies,
              languages: languages,
              originalLanguages: originalLanguages
            }
          }
        }]
    }];

    const asideType = 'preview-menu-' + action;


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
    menu: state._menu.menu,
    profile: state._profile.profile
  }
};

export default connect(mapStateToProps)(MenuPage);
