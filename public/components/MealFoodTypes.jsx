import React, { Component, PropTypes } from "react";

import { connect } from "react-redux";
import * as actionCreators from "../action-creators";

import * as DomUtils from "../shared/dom.utils";

import MealFoodTypeEdit from "./MealFoodTypeEdit";
import LanguagePicker from "./LanguagePicker";
import { ToolTip } from "./ToolTip";

let createHandlers = ctx => {
  let onAdd = obj => {
    let foodTypes;
    ctx.setState(prevState => {
      foodTypes = prevState.allFoodTypes;
      if (obj.name && !foodTypes.find(x => x.Name === obj.name)) {
        foodTypes.push({
          Name: obj.name
        });
      }

      if (ctx.props.onChange && typeof ctx.props.onChange === "function") {
        ctx.props.onChange("foodTypes", { data: foodTypes });
      }

      return {
        allFoodTypes: foodTypes
      };
    });
  };

  let onPickerBlur = e => {
    let select = e.target.parentNode.parentNode.querySelector(
      ".select--styled.active"
    );
    if (select) {
      setTimeout(() => {
        DomUtils.removeClass(select, "active");
      }, 100);
    }
  };

  let onRemove = obj => {
    // console.log(obj);
    let foodTypes;
    ctx.setState(prevState => {
      foodTypes = prevState.allFoodTypes.filter(x => {
				return x.Name !== obj.name
			});
      ctx.props.onChange("foodTypes", { data: foodTypes });

      return {
        allFoodTypes: foodTypes
      };
    });
  };

  let onPickerClick = e => {
    DomUtils.toggleClass(e.target.parentNode, "active");
    // DomUtils.toggleClass(e.target, "active");
  };

  let onPickerItemClick = e => {
    // Change UI
    let rel = e.target.getAttribute("rel");
    let text = e.target.textContent;
    let id = parseInt(e.target.getAttribute("data-id"), 10);
    // let target =
    //   e.target.parentNode.parentNode.parentNode.previousElementSibling;
    // target.setAttribute("data-rel", rel);
    // target.textContent = text;

    // DomUtils.toggleClass(target, "active");

    // Then add the new branch
    onAdd({
      id,
      rel,
      name: text
    });
  };

  let onKeyPress = e => {
    if (e.key == "Enter") {
      onAdd({
        id: null,
        rel: e.target.value,
        name: e.target.value
      });
      e.target.value = "";
    }
  };

  return {
    onAdd,
    onPickerBlur,
    onRemove,
    onKeyPress,
    onPickerClick,
    onPickerItemClick
  };
};

class MealFoodTypes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allFoodTypes: props.foodTypes || []
    };
    this.handlers = createHandlers(this);
  }

  componentDidMount() {}

  render() {
    const { foodTypes, onChange } = this.props;

    const availableFoodTypes =
      this.props.profile && this.props.profile.foodTypes
        ? this.props.profile.foodTypes
        : [];
    const groups = availableFoodTypes.reduce((ar, x) => {
      if (!ar.find(y => y.Group === x.Group)) {
        ar.push({
          Group: x.Group,
          Items: availableFoodTypes.filter(z => z.Group === x.Group)
        });
      }
      return ar;
    }, []);
    const obj = {
      type: "foodTypes",
      items: groups
    };

    // console.log('allFoodTypes', this.state.allFoodTypes)
    const foodTypesComponent =
      this.state.allFoodTypes && this.state.allFoodTypes.length > 0
        ? this.state.allFoodTypes.map((foodType, index) => {
          if (foodType.Name !== '') {
            return index < this.state.allFoodTypes.length - 1 ? (
              <span key={foodType.Name}>
                <MealFoodTypeEdit
                  id={foodType.Name}
                  name={foodType.Name}
                  onRemove={this.handlers.onRemove}
                  key={foodType.Name}
                />
                ,&nbsp;
              </span>
            ) : (
              <span key={foodType.Name}>
                <MealFoodTypeEdit
                  id={foodType.Name}
                  name={foodType.Name}
                  onRemove={this.handlers.onRemove}
                  key={foodType.Name}
                />
              </span>
            );
          }
          })
        : null;

    return (
      <div>
        <p className="menu--title">Food Types</p>
        {foodTypesComponent}

        <div id="meal-food-type-add" className="language--add">
          <label>Add a Food Type for this meal:</label>
          <div id="food-type-picker" className="language--picker">
            <LanguagePicker
              data={obj}
              allowEdit={true}
              onKeyPress={this.handlers.onKeyPress}
              onAdd={this.handlers.onAdd}
              onPickerBlur={this.handlers.onPickerBlur}
              onPickerClick={this.handlers.onPickerClick}
              onPickerItemClick={this.handlers.onPickerItemClick}
            />
            <ToolTip title="Type your custom tags and press enter to add them, or just select several from the dropdown" />
          </div>
        </div>
      </div>
    );
  }
}

MealFoodTypes.propTypes = {
  foodTypes: PropTypes.array,
  onChange: PropTypes.func
};

const mapStateToProps = state => {
  // console.log(state);
  return {
    profile: state._profile.profile
  };
};

export default connect(mapStateToProps)(MealFoodTypes);
