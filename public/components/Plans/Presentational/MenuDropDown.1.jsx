import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Dropdown } from "semantic-ui-react";

class MenuDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = { }
    this.handleChange=this.handleChange.bind(this);
  }
 
  
  handleChange(e, { value }) {
    this.setState({ value});
  }
  render() {
    
    let elements = [];
    for (var i = 0; i < this.props.elements.length; i++) {
      elements.push({
        key: this.props.elements[i],
        text: this.props.elements[i],
        value: this.props.elements[i]
      });
    }
    let { value } = this.state;
    let defaultValue;
    //console.log(value);
    if(this.props.selectedIndex)
    {
    
      defaultValue=this.props.elements[this.props.selectedIndex-1];
      console.log(defaultValue);
    }
    return (
      <div>
        <p className="menu--title">{this.props.title}</p>

        <div id="menu-branch-add" className="language--add">
          <label>{this.props.label}</label>
          <div id="branch-picker" className="language--picker">
            <div>
              <Dropdown
                onChange={this.handleChange}
                placeholder={this.props.text}
                selection
                options={elements}
                value={value}
                defaultValue={defaultValue}
              />
            </div>
            <br />
          </div>
        </div>
      </div>
    );
  }
}

export default MenuDropDown;
