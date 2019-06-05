import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { Dropdown, Visibility } from "semantic-ui-react";

class GenericDropDown extends Component {
  constructor(props) {
    super(props);
    this.state = { value: "", selectedItemList: [], action:'' };
    this.handleChange = this.handleChange.bind(this);
    this.valueExists = this.valueExists.bind(this);
    this.GenerateItems = this.GenerateItems.bind(this);
    this.onItemClick = this.onRemoveItemClick.bind(this);
    this.addValue=this.addValue.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if(this.props.englishAdded==nextProps.englishAdded)
    {
      return;
    }
    if(nextProps.englishAdded){
    if(this.state.selectedItemList.length==0 || !this.valueExists(23, this.state.selectedItemList))
      {
        
        let state = { ...this.state };
        if(state.selectedItemList.length>=5)
        {
          state.selectedItemList.pop();
        }
        state.selectedItemList.push(23);
        this.setState(state);
      }
      
    }
    if (nextProps.defaultValues) {
      let state = { ...this.state };
      for(let i=0;i<nextProps.defaultValues.length;i++)
      {
        var currentItem = nextProps.defaultValues[i];
        if(currentItem[0])
        {
          state.selectedItemList.push(currentItem[0].key);
        }
       
      }
    
      this.props.onChange(nextProps.id, state);
      this.setState(state);
    }
  }
  valueExists(selectedValue, dataList) {
    let size = dataList.length;
    for (let i = 0; i < size; i++) {
      if (selectedValue == dataList[i]) {
        return true;
      }
    }

    return false;
  }
  componentDidMount() {
    if (this.props.defaultValue) {
      let state = { ...this.state };
      state.value = +this.props.defaultValue;
      var result = this.props.elements.filter(obj => {
        return obj.key == +this.props.defaultValue;
      });
      state.selectedItemList = [];
      state.selectedItemList.push(result[0].key);
      this.props.onChange(this.props.id, state);
      this.setState(state);
    }
    if (this.props.defaultValues) {
      let state = { ...this.state };
      for(let i=0;i<this.props.defaultValues.length;i++)
      {
        var currentItem = this.props.defaultValues[i];
        if(currentItem[0])
        {
          state.selectedItemList.push(currentItem[0].key);
        }
       
      }
    
      this.props.onChange(this.props.id, state);
      this.setState(state);
    }
  }

  handleChange(e, { value }) {
    // console.log(this.props);
    let state = { ...this.state };
    state.value = value;
    let valueExists = this.valueExists(state.value, state.selectedItemList);

    if (!this.props.multiple && state.selectedItemList.length ==1 && !valueExists) {
      state.selectedItemList=[];
    }
    if (!this.props.multiple && state.selectedItemList.length > 1) {
      return;
    }

    if (!valueExists ) {
      state.action ="add";
      state.selectedItemList.push(value);
    }

    if (state.selectedItemList.length>this.props.maxSelectedItems) {
      return;
    }
    this.props.onChange(this.props.id, state,this.addValue,this.props.SubscriptionStripeID);
    this.setState(state);
 
  }
  addValue(value){
    let state = { ...this.state };
    let valueExists = this.valueExists(state.value, state.selectedItemList);    
    if (!valueExists ) {
      state.action ="add";
      state.selectedItemList.push(value);
    }
    this.setState(state);
  }
  onRemoveItemClick(event) {
    if(this.props.disabled)
    {
      return;
    }
    const id = event.target.id;
    //If id is 23 and english is added then we cannot remove it
    if (id == 23 && this.props.englishAdded){
      {
        return;
      }

    }
    let elementList = [];
    //console.log( this.state.selectedItemList)
    this.state.selectedItemList.forEach(element => {
      if (+element != +id) {
        //console.log('found')
        elementList.push(element);
      }
    });
    let state = { ...this.state };
    state.action ="remove"
    state.removedItem=id;
    state.selectedItemList = elementList;
    this.props.onChange(this.props.id, state,this.addValue,this.props.SubscriptionStripeID);
    this.setState(state);
  }

  selectedItem(element) {
    let removeItemClass="status status--issue remove";
    if(element && element.key ==23 && this.props.englishAdded)
    {
      removeItemClass="status status--issue DisabledRemoveButton";
    }
    return (
      <div>
        <div id="branch-language-4" className="content--label">
          <h3 className="label--key" />
          <span className="label--value">{element.text}</span>
          <span
            className={removeItemClass}
            id={element.key}
            onClick={this.onRemoveItemClick.bind(this)}
          />
        </div>
      </div>
    );
  }
  render() {
    let visibleClassName = this.props.elementsSelectorVisible ?'':'hidden-element';
    return (
      <div>
        <p className="menu--title">{this.props.title}</p>
        <div id="elements" className={visibleClassName}>
        {this.GenerateItems()}
        </div>
        <div id="menu-branch-add" className="language--add" style={this.props.hideDropDown?{display:'none'}:{}}>
          <label>{this.props.label}</label>
          <div id="branch-picker" className="language--picker">
            <div >
              <Dropdown
                onChange={this.handleChange}
                placeholder={this.props.text}
                selection
                options={this.props.elements}
                defaultValue={this.GetDefaultValue()}
                disabled={this.props.disabled}
              />
            </div>
            <br />
          </div>
        </div>
      </div>
    );
  }

  GetDefaultValue() {
    if(this.state.selectedValue)
    {
      return this.state.selectedValue;
    }
    return +this.props.defaultValue;
  }

  GenerateItems() {
    let elementList = [];

    this.state.selectedItemList.forEach(element => {
      let selectedElementRes;
      this.props.elements.forEach(selectedElement => {
        if (selectedElement.key == +element) {

          selectedElementRes = selectedElement;
        }
      });

      elementList.push(this.selectedItem(selectedElementRes));
    });
    return elementList;
  }
}

export default GenericDropDown;
