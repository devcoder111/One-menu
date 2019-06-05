import React, { Component, PropTypes } from "react";

import { connect } from "react-redux";
import * as actionCreators from "../action-creators";

import MenuCategoryEdit from "./MenuCategoryEdit";

let createHandlers = ctx => {
  let lastSelectedCategory = 1;
  let totalCategories =
    ctx.props && ctx.props.availableCategories
      ? ctx.props.availableCategories
      : [];
  let onCategoryRemove = obj => {
    // console.log(obj);
    let categories;
    ctx.setState(prevState => {
      // console.log(prevState.allCategories, 'prevState.allCategories')
      categories = prevState.allCategories.reduce((acc, current) => {
        if (
          current.Category &&
          (current.Category.CategoryStandardID || current.Category.id)
        ) {
          return (current.Category.CategoryStandardID ||
            current.Category.id) !== obj.id
            ? acc.concat([current])
            : acc;
        }

        if (current.CategoryID) {
          return current.CategoryID !== obj.id ? acc.concat([current]) : acc;
        }

        return current.id !== obj.id ? acc.concat([current]) : acc;
      }, []);

      ctx.props.onChange("categories", { data: categories });

      return {
        allCategories: categories
      };
    });
  };

  let onCategoryChange = cat => {
    let categories;
    ctx.setState(prevState => {
      // console.log(prevState.allCategories);

      categories = prevState.allCategories.map((prevCategory, index) => {
        // console.log(prevCategory, cat);

        if (
          prevCategory.CategoryID === cat.id ||
          (prevCategory.id === 1 ||
            prevCategory.CategoryID ===
              1) /*&& prevState.allCategories.length === 1*/ ||
          (cat.oldId && prevCategory.CategoryID === cat.oldId)
        ) {
          let obj = prevCategory;
          obj.CategoryID = cat.CategoryID || cat.id;
          obj.id = cat.CategoryID || cat.id;
          if (obj.Category) {
            obj.Category.Title =
              cat.Category && cat.Category.Title
                ? cat.Category.Title
                : cat.title;
            obj.Category.CategoryStandardID = cat.CategoryID || cat.id;
          } else {
            obj.Category = {};
            obj.Category.Title =
              cat.Category && cat.Category.Title
                ? cat.Category.Title
                : cat.title;
            obj.Category.CategoryStandardID = cat.CategoryID || cat.id;
          }

          obj.meals = cat.meals ? cat.meals : prevCategory.meals;

          return obj;
        }

        return prevCategory;
      });

      lastSelectedCategory = cat.CategoryID || cat.id;

      // console.log(categories);
      ctx.props.onChange("categories", { data: categories });

      return {
        allCategories: categories
      };
    });
  };

  let onCloneMeal = data => {
    let categories;
    let newCategoryID = data && data.category && data.category.CategoryID
    ctx.setState(prevState => {
      // console.log('onCloneMeal cat', data)
      // console.log('onCloneMeal allCategories', prevState.allCategories)
      categories = prevState.allCategories.map((prevCategory, index) => {
        // console.log('prevCategory', newCategoryID, prevCategory);

        if (
          prevCategory.CategoryID === newCategoryID
        ) {
          let obj = prevCategory;

          let lastIndex = 0;
          obj.meals && obj.meals.forEach(item => {
            if (item.id > lastIndex) {
              lastIndex = item.id
            }
          })
          if (data && data.meal) {
            let mealData = data.meal
            mealData.Description = mealData.description
            mealData.Title = mealData.title
            mealData.Price = mealData.price
            mealData.Images = mealData.images
            delete mealData.MealID
            delete mealData.description
            delete mealData.title
            delete mealData.price
            delete mealData.images
            mealData.id = lastIndex + 1
            obj.meals.push(mealData);
          }

          // console.log('new obj', data.meal, obj)
          return obj;
        }

        return prevCategory;
      });
      // console.log('new categories', categories)
      return {
        allCategories: categories
      };
    });
  }

  let onCategoryAdd = obj => {
    // console.log('onCategoryAdd', obj);
    let categories;
    ctx.setState(prevState => {
      categories = prevState.allCategories;
      lastSelectedCategory = 1;

      /*
			if (prevState.allCategories.length > 0) {
				nextID = parseInt(prevState.allCategories[prevState.allCategories.length - 1].id, 10) + 1;
			}
			*/

      let finalObj = obj && obj.menu && obj.menu.MenuID === -1
        ? {
          id: obj.category && obj.category.id,
          CategoryID: obj.category && obj.category.id,
          Category: {
            Title: obj.category && obj.category.title,
            CategoryStandardID: obj.category && obj.category.id,
          },
          isCustom: obj.category && obj.category.isCustom,
          title: obj.category && obj.category.title,
          description: obj.category && obj.category.description,
          meals: [],
          totalCategories: totalCategories,
          onCategoryRemove: onCategoryRemove,
          onChange: ctx.props.onChange
        }
        : {
        id: lastSelectedCategory,
        CategoryID: lastSelectedCategory,
        Category: {
          Title: ""
        },
        isCustom: false,
        title: "",
        description: "",
        meals: [],
        totalCategories: totalCategories,
        onCategoryRemove: onCategoryRemove,
        onChange: ctx.props.onChange
      };

      // console.log('finalObj', finalObj);

      categories.push(finalObj);
      // console.log(categories, 'teststt.categories');
      ctx.props.onChange("categories", { data: categories });

      return {
        allCategories: categories
      };
    });
  };

  let getAvailableCategories = type => {
    ctx.props.dispatch(actionCreators.getCategories(type));
  };

  return {
    onCloneMeal,
    onCategoryRemove,
    onCategoryAdd,
    onCategoryChange,
    getAvailableCategories
  };
};

class MenuCategoriesEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allCategories: props.categories
    };
    this.handlers = createHandlers(this);
  }

  componentDidMount() {
    this.handlers.getAvailableCategories("standard");
  }

  componentWillReceiveProps(nextProps, prevProps) {
    if (nextProps.categories !== prevProps.categories) {
    }
  }

  render() {
    const { categories, onChange } = this.props;

    const totalCategories =
      this.props && this.props.availableCategories
        ? this.props.availableCategories
        : [];
    const stateCategories = this.state.allCategories;

    // console.log(totalCategories);
    // console.log('stateCategories', stateCategories);

    const categoriesAll =
      stateCategories && stateCategories.length > 0
        ? stateCategories.map((category, index) => {
            const finalCategory = category.Category
              ? category.Category
              : category;
            return finalCategory;
          })
        : [];

    const categoriesComponent =
      stateCategories && stateCategories.length > 0
        ? stateCategories.map((category, index) => {
            const finalCategory = category.Category
              ? category.Category
              : category;
            return (
              <MenuCategoryEdit
                id={finalCategory.CategoryStandardID}
                categoriesAll={categoriesAll}
                menuCategories={categories}
                totalCategories={totalCategories}
                isCustom={false}
                title={finalCategory.Title}
                description={finalCategory.Description}
                meals={category.meals || []}
                onChange={this.handlers.onCategoryChange}
                onCategoryRemove={this.handlers.onCategoryRemove}
                onAddCategory={this.handlers.onCategoryAdd}
                onCloneMeal={this.handlers.onCloneMeal}
								key={index}
              />
            );
          })
        : null;

    // console.log(categoriesComponent, 'categoriesComponent')
    return (
      <div>
        <h3 className="asset--title">Categories</h3>

        {categoriesComponent}
        <div className="branch--add category--add">
          <div onClick={e => this.handlers.onCategoryAdd()}>
            <div className="add-item dashed">
              <span>
                Choose a Category <strong>+</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MenuCategoriesEdit.propTypes = {
  categories: PropTypes.array,
  onChange: PropTypes.func
};

const mapStateToProps = state => {
  // console.log(state);
  return {
    availableCategories: state._categories.categories
  };
};

export default connect(mapStateToProps)(MenuCategoriesEdit);
