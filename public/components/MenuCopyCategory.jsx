import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import { uniqBy, map } from 'lodash';
import * as actionCreators from '../action-creators';
import { Ajax } from "../shared/ajax.utils";
import { Toast } from "./Toast";
import { StorageManagerInstance } from "../shared/storage.utils";

class MenuCopyCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenu: null,
      showRemoveConfirm: false,
      isOpen: false,
      loading: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleCopyClick = this.handleCopyClick.bind(this);
    this.handleConfirmCopy = this.handleConfirmCopy.bind(this);
    this.renderConfirm = this.renderConfirm.bind(this);
    this.renderToast = this.renderToast.bind(this);
  }
  handleClick(x) {
    const { selectedMenu } = this.state;
    if (x && selectedMenu && selectedMenu.MenuID === x.MenuID) {
      this.setState({ selectedMenu: null });
    } else {
      this.setState({ selectedMenu: x });
    }
  }
  handleCopyClick() {
    this.setState({ isOpen: false, showRemoveConfirm: true });
  }
  async handleConfirmCopy() {
    this.setState({ loading: true });
    if (this.state.selectedMenu.MenuID === -1) { // TODO Clone to the current menu. Need to be refactored
      this.props.onClone({
        category: this.props.category,
        menu: {
          MenuID: this.state.selectedMenu.MenuID || this.state.selectedMenu.id
        }
      });
    } else {
      try {
        await Ajax().post("/menu-clone-category", {
          body: JSON.stringify({
            category: this.props.category,
            menu: {
              MenuID: this.state.selectedMenu.MenuID || this.state.selectedMenu.id
            }
          }),
          headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "x-access-token": StorageManagerInstance.read("token")
          }
        });
      } catch (e) {
        console.error(e);
      }
    }

    this.setState({
      loading: false,
      showRemoveConfirm: false,
      isSuccess: true
    });
    this.props.dispatch(actionCreators.getProfile());
  }
  renderConfirm() {
    const { loading } = this.state;
    return (
      this.state.selectedMenu && (
        <Modal ariaHideApp={false} isOpen={this.state.showRemoveConfirm}>
          <h2>Confirm Copy</h2>
          <p>
            Are you sure you want to copy category "
            <strong>{this.props.category.title}</strong>"
            <br />
            to menu "<strong>{this.state.selectedMenu.Title}</strong>" ?
          </p>
          <footer className="group-buttons">
            <button
              disabled={loading}
              onClick={this.handleConfirmCopy}
              className="button--action button--action-filled"
            >
              {loading ? "Copying..." : "Yes"}
            </button>
            <button
              disabled={loading}
              className="button--action button--action-outline"
              onClick={() => this.setState({ showRemoveConfirm: false })}
            >
              Cancel
            </button>
          </footer>
        </Modal>
      )
    );
  }
  renderToast() {
    const { selectedMenu, isSuccess } = this.state;
    const { category, menu } = this.props;
    return (
      <Toast onDismiss={e => this.setState({ isSuccess: false })}>
        <p>
          Category n°{category.id}  has been copied to{" "}
          "{selectedMenu.Title}"
        </p>
      </Toast>
    );
  }
  render() {
    const { menus, category } = this.props;
    const { selectedMenu, isOpen, isSuccess } = this.state;
    // console.log('menus', menus, uniqBy(menus, i => i.MenuID))
    return (
      <div className="menu--copy">
        <button onClick={() => this.setState({ isOpen: !isOpen })}>
          <img src="/assets/images/icon-copy.svg" />
        </button>
        {this.renderConfirm()}
        {category && selectedMenu && isSuccess && this.renderToast()}
        {isOpen && (
          <div className="menu--copy__menu">
            <header>
              Copy category to
              <button onClick={() => this.setState({ isOpen: false })}>
                <img src="/assets/images/icon-close.svg" />
              </button>
            </header>
            <ul>
              {map(uniqBy(menus, i => i.MenuID), (x, index) => {
                return (
                  <li
                    onClick={e => this.handleClick(x)}
                    className={
                      selectedMenu && selectedMenu.MenuID === x.MenuID
                        ? "menu--copy__selected"
                        : null
                    }
                    key={x.MenuID}
                  >
                    {x.Title}
                  </li>
                );
              })}
            </ul>
            <footer>
              <button
                onClick={e => this.handleCopyClick()}
                disabled={!selectedMenu}
                className="button--action"
              >
                Copy
              </button>
            </footer>
          </div>
        )}
      </div>
    );
  }
}

MenuCopyCategory.propTypes = {
  menus: PropTypes.array,
  category: PropTypes.object,
  menu: PropTypes.object
};

const mapStateToProps = state => {
  // console.log(state);
  return {
    menus:
      state._profile.profile && state._profile.profile.branches
        ? state._profile.profile.branches.reduce((arr, x) => {
            return [...arr, ...x.menus.map(m => m)];
          }, [])
        : []
  };
};

export default connect(mapStateToProps)(MenuCopyCategory);
