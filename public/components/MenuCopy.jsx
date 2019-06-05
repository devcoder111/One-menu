import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import * as actionCreators from '../action-creators';
import { Ajax } from "../shared/ajax.utils";
import { Toast } from "./Toast";
import { StorageManagerInstance } from "../shared/storage.utils";

class MenuCopy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedMenu: null,
      isOpen: false,
      loading: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleCopyClick = this.handleCopyClick.bind(this);
    this.handleConfirmCopy = this.handleConfirmCopy.bind(this);
    this.renderConfirm = this.renderConfirm.bind(this);
    this.renderToast = this.renderToast.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
    this.setState({ isOpen: false});
  }
  handleClose() {
    this.setState({ isOpen: false, loading: false, isSuccess: true });
  }
  handleConfirmCopy() {
    this.setState({ loading: true });
    try {
      Ajax().post("/menu-clone", {
        body: JSON.stringify({
          menu: {
            MenuID: this.props && this.props.menu && this.props.menu.id
          }
        }),
        headers: {
          "content-type": "application/json",
          "cache-control": "no-cache",
          "x-access-token": StorageManagerInstance.read("token")
        }
      }).then(res => {
          if (!res || !res.success) {
              return Promise.reject(res);
          }

          console.log('res', res);
          this.handleClose();
          this.props.dispatch(actionCreators.getProfile());
      });
    } catch (e) {
      console.error(e);
    }



  }

  renderConfirm() {
    const { loading, isOpen } = this.state;
    const { menu = {} } = this.props;
    return (<Modal ariaHideApp={false} isOpen={isOpen}>
      <h2>Confirm Copy</h2>
      <p>
        Are you sure you want to clone "<strong>{menu.title}</strong>" menu?
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
            onClick={() => this.setState({ isOpen: false })}
        >
          Cancel
        </button>
      </footer>
    </Modal>)
  }

  renderToast() {
    const { selectedMenu, isSuccess } = this.state;
    const { category, menu } = this.props;
    return (
      <Toast onDismiss={e => this.setState({ isSuccess: false })}>
        <p>
          Menu {menu.title}  has been cloned.
        </p>
      </Toast>
    );
  }

  handleClick(e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    const { menus, category } = this.props;
    const { selectedMenu, isOpen, isSuccess } = this.state;
    return (
      <div className="menu--copy menu--clone">
        <button onClick={this.handleClick}>
          <img src="/assets/images/icon-copy.svg" />
        </button>
        {this.renderConfirm()}
        {category && selectedMenu && isSuccess && this.renderToast()}
      </div>
    );
  }
}

MenuCopy.propTypes = {
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

export default connect(mapStateToProps)(MenuCopy);
