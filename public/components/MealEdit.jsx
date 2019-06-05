import React, { Component, PropTypes } from "react";

import MealDetail from "./MealDetail";
import ImageUpload from "./ImageUpload";
import MealFoodTypes from "./MealFoodTypes";
import MenuCopyMeal from "./MenuCopyMeal";
let createHandlers = ctx => {
  let onRemove = (obj, fn) => {
    ctx.setState({
      removed: true
    });
    // actually remove that thing from the global store
    if (typeof fn === "function") {
      fn(obj);
    }
  };

  let onChange = (obj, fn) => {
    console.log("meaEdit", obj);
    if (obj.key === "foodTypes") {
      let tmp = {
        catId: ctx.props.catId,
        id: ctx.props.id,
        title: ctx.props.title,
        description: ctx.props.description,
        images: ctx.props.images,
        price: ctx.props.price,
        foodTypes: obj.foodTypes
      };
      if (typeof fn === "function") {
        fn(tmp);
      }
      return;
    }
    if (obj.key === "images") {
      let tmp = {
        catId: ctx.props.catId,
        id: ctx.props.id,
        title: ctx.props.title,
        description: ctx.props.description,
        images: obj.images,
        price: ctx.props.price,
        foodTypes: ctx.props.foodTypes
      };
      if (typeof fn === "function") {
        fn(tmp);
      }
      return;
    }
    if (obj.target && obj.key) {
      // actually remove that thing from the global store
      if (typeof fn === "function") {
        let title = document.querySelector(
          "#meal-id-" + ctx.props.catId + "-" + ctx.props.id + " #meal-title"
        ).value;
        let desc = document.querySelector(
          "#meal-id-" +
            ctx.props.catId +
            "-" +
            ctx.props.id +
            " #meal-description"
        ).value;
        let price = document.querySelector(
          "#meal-id-" + ctx.props.catId + "-" + ctx.props.id + " #meal-price"
        ).value;
        let tmp = {
          catId: ctx.props.catId,
          id: ctx.props.id,
          title: title,
          description: desc,
          images: ctx.props.images,
          price: parseFloat(price) || null,
          foodTypes: ctx.props.foodTypes
        };

        console.log('tmp', tmp);

        tmp[obj.key] = obj.target.target.value;
        // console.log(tmp);
        fn(tmp);
      }
    }
  };
  let onImageUpload = (e, fn) => {};
  return {
    onRemove,
    onImageUpload,
    onChange
  };
};

class MealEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      removed: false
    };
    this.handlers = createHandlers(this);
  }

  render() {
    const {
      id,
      catId,
      foodTypes,
      title,
      description,
      price,
      images,
      enableDetails,
      detail,
      onRemove,
      onCloneMeal,
      menuCategories,
      onChange
    } = this.props;
    let detailComponents = "";

    const allImagesComponent = (
      <ImageUpload
        onChanges={(key, obj) =>
          this.handlers.onChange({ key, images: obj.data }, onChange)
        }
        onUploadSubmit={this.handlers.onImageUpload}
        images={images.map(x => ({
          ...x,
          id: x.id || x.MealImageID,
          imgPath: x.imgPath || x.Path
        }))}
      />
    );

    if (
      detail &&
      Object.keys(detail) &&
      Object.keys(detail).length > 0 &&
      enableDetails
    ) {
      detailComponents = (
        <MealDetail
          id={detail.id}
          title={detail.title}
          description={detail.description}
          medias={detail.medias}
        />
      );
    }

    return (
      <div id={"meal-id-" + catId + "-" + id}>
        <h4 className="meal--edit--title">
          Meal n°{id}
          <span
            className="status status--issue remove"
            onClick={e => this.handlers.onRemove({ id }, onRemove)}
          />
          {this.props.id && (
            <MenuCopyMeal
              onClone={onCloneMeal}
              catId={catId}
              menuCategories={menuCategories}
              meal={{
                id: this.props.id,
                title: this.props.title,
                description: this.props.description,
                price: this.props.price,
                detail: this.props.detail,
                images: this.props.images,
                foodTypes: this.props.foodTypes,
                enableDetails: this.props.enableDetails
              }}
            />
          )}
        </h4>
        <div className="content--edit">
          <div className="edit--block">
            <label className="label--edit">Enter new Title:</label>
            <input
              className="input--edit"
              type="text"
              name="meal--title"
              id="meal-title"
              value={title || ""}
              onChange={e =>
                this.handlers.onChange({ target: e, key: "title" }, onChange)
              }
            />
          </div>
          <div className="edit--block">
            <label className="label--edit">Enter new Description:</label>
            <input
              className="input--edit"
              type="text"
              name="meal--description"
              id="meal-description"
              value={description || ""}
              onChange={e =>
                this.handlers.onChange(
                  { target: e, key: "description" },
                  onChange
                )
              }
            />
          </div>
          <div className="edit--block">
            <MealFoodTypes
              foodTypes={foodTypes}
              onChange={(key, { data }) =>
                this.handlers.onChange({ key, foodTypes: data }, onChange)
              }
            />
          </div>
          <div className="edit--block">
            <label className="label--edit">Enter new Price:</label>
            <input
              className="input--edit"
              type="text"
              name="meal--price"
              id="meal-price"
              value={price > 0 ? price : ""}
              onChange={e =>
                this.handlers.onChange({ target: e, key: "price" }, onChange)
              }
            />
          </div>
          <div className="branch--images">
            <p className="menu--title">Upload Meal Images</p>
            {allImagesComponent}
          </div>
          {detailComponents}
        </div>
      </div>
    );
  }
}

MealEdit.propTypes = {
  id: PropTypes.number,
  catId: PropTypes.number,
  title: PropTypes.string,
  description: PropTypes.string,
  price: PropTypes.number,
  images: PropTypes.array,
  foodTypes: PropTypes.array,
  enableDetails: PropTypes.bool,
  detail: PropTypes.object,
  onRemove: PropTypes.func,
  onChange: PropTypes.func
};

export default MealEdit;
