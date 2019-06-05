import React, { Component, PropTypes } from "react";
import { Link } from "react-router-dom";

import { connect } from "react-redux";
import * as actionCreators from "../action-creators";

import MenuCategoriesEdit from "./MenuCategoriesEdit";
import BranchLanguagesEdit from "./BranchLanguagesEdit";
import MenuBranchesEdit from "./MenuBranchesEdit";

let createHandlers = ctx => {
  let onSaveMenu = () => {};

  let onChanges = (type, obj) => {
    // console.log(type, obj)
    // console.log('changing', ctx.props.menu);
    let dataToUpdate = {};
    switch (type) {
      case "main":
        dataToUpdate[obj.key] = obj.target.target.value;

        ctx.props.dispatch(
          actionCreators.setMenu(ctx.props.menu, dataToUpdate)
        );
      default:
        dataToUpdate[type] = obj.data;

        // console.log(obj);
        // console.log(dataToUpdate);
        ctx.props.dispatch(
          actionCreators.setMenu(ctx.props.menu, dataToUpdate)
        );
    }
  };

  return {
    onSaveMenu,
    onChanges
  };
};

class SectionArticleAddMenu extends Component {
  constructor(props) {
    super(props);
    this.handlers = createHandlers(this);
  }

  componentDidMount() {
    this.props.dispatch(actionCreators.getLanguages());
  }

  render() {
    const { title, component } = this.props;

    let categories = [];
    let originalLanguages = [];
    let languages = [];
    let branches = [];

    // console.log(this.props, 'this.props this.props');

    const profileBranches =
      this.props.profile &&
      this.props.profile.branches &&
      this.props.profile.branches.length > 0
        ? this.props.profile.branches
        : [];

    const menuBranches = (
      <MenuBranchesEdit
        branches={branches}
        onChange={this.handlers.onChanges}
      />
    );

    const menuOriginalLanguages =
      this.props.menu ? (
        <BranchLanguagesEdit
          single
          className="style-7"
          languages={originalLanguages}
          label="Original Language"
          name="originalLanguages"
          onChange={this.handlers.onChanges}
        />
      ) : null;

    const menuLanguages =
      this.props.menu ? (
        <BranchLanguagesEdit
          className="style-7"
          languages={languages}
          name="languages"
          onChange={this.handlers.onChanges}
        />
      ) : null;

    const menuCategories =
      this.props.menu ? (
        <MenuCategoriesEdit
          categories={categories}
          onChange={this.handlers.onChanges}
        />
      ) : null;

    const addMenuComponent =
      profileBranches && profileBranches.length > 0 || true ? (
        <div className="content--container global-padding-wrapper no-border-top">
          <form id="form-menu-content" className="content--edit">
            <div className="edit--block">
              <label className="label--edit">Enter new Menu Name:</label>
              <input
                className="input--edit"
                // required
                type="text"
                name="menu--price"
                id="menu-title"
                placeholder={"New Menu title..."}
                onChange={e =>
                  this.handlers.onChanges("main", { target: e, key: "title" })
                }
              />
            </div>
            <div className="edit--block">
              <label className="label--edit">Enter new Menu Description:</label>
              <input
                className="input--edit"
                required
                type="text"
                name="menu--description"
                id="menu-description"
                placeholder={"New Menu description..."}
                onChange={e =>
                  this.handlers.onChanges("main", {
                    target: e,
                    key: "description"
                  })
                }
              />
            </div>
            <div className="edit--block">
              <label className="label--edit">Enter new Menu Price:</label>
              <input
                className="input--edit"
                // required
                type="number"
                step="0.01"
                name="menu--price"
                id="menu-price"
                placeholder={"New Menu price..."}
                onChange={e =>
                  this.handlers.onChanges("main", { target: e, key: "price" })
                }
              />
            </div>
          </form>

          <div className="menu--languages">{menuBranches}</div>

          <div className="menu--languages">{menuOriginalLanguages}</div>

          <div className="menu--languages" style={{paddingBottom: 40}}>{menuLanguages}</div>

          <div className="menu--categories">{menuCategories}</div>
        </div>
      ) : (
        <div className="global-padding-wrapper branches-container">
          <h2 className="no-items--headline">
            It looks like you have not entered any branches yet. You must add a
            branch first before entering any menus.
          </h2>
          <div className="branch--add">
            <Link to="/branch/add/1">
              <div className="add-item dashed">
                <span>
                  Add a Branch <strong>+</strong>
                </span>
              </div>
            </Link>
          </div>
        </div>
      );

    return (
      <div>
        <div className="content--container global-padding-wrapper">
          <h2 className="asset--title">Content</h2>
        </div>

        {addMenuComponent}
      </div>
    );
  }
}

SectionArticleAddMenu.propTypes = {
  title: PropTypes.string,
  dateUpdate: PropTypes.object,
  component: PropTypes.object
};

const mapStateToProps = state => {
  // console.log(state);
  return {
    profile: state._profile.profile,
    menu: state._menu.menu
  };
};

export default connect(mapStateToProps)(SectionArticleAddMenu);
