import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Dropdown } from "semantic-ui-react";

class SubsriptionsEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allMenus: []
    };
 
  }

  componentDidMount() {}

  render() {
    return (
      <div>
        <p className="menu--title">Subscription Package</p> 

        <div id="menu-branch-add" className="language--add">
          <label>Add a menu for this branch:</label>
          <div id="branch-picker" className="language--picker">
            <div>
              <Dropdown text="Choose a Menu..">
                <Dropdown.Menu>
                  <Dropdown.Item text="Menu du jour" />
                  <Dropdown.Item text="Degustation" />
                  <Dropdown.Item text="A la carte" />
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <br />
          </div>
        </div>
      </div>
    );
  }
}

SubsriptionsEdit.propTypes = {
  menus: PropTypes.array,
  onChange: PropTypes.func
};

const mapStateToProps = state => {
  // console.log(state);
  return {
    profile: state._profile.profile,
    subscriptions: state._subscriptions.list
  };
};

export default connect(mapStateToProps)(SubsriptionsEdit);
