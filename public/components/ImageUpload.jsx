import React, { Component, PropTypes } from "react";
import { Link } from "react-router-dom";
import imageCompression from "browser-image-compression";

import BranchImageEdit from "./BranchImageEdit";

let createHandlers = ctx => {
  let handleSubmit = (e, props) => {
    if (props.onUploadSubmit) {
      props.onUploadSubmit({
        file: ctx.state.file,
        url: ctx.state.imagePreviewUrl
      });
    }

    if (props.onChanges) {
      props.onChanges("images", { data: ctx.state.allImages });
    }
  };

  let handleImageChange = async (e, props) => {
    e.preventDefault();
    const file = e.target.files[0];
    const maxSizeMB = 1;
    const maxWidthOrHeight = 1024; // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight

    try {
      const compressedFile = await imageCompression(
        file,
        maxSizeMB,
        maxWidthOrHeight
      );
      console.log(
        "compressedFile instanceof Blob",
        compressedFile instanceof Blob
      ); // true
      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
      ); // smaller than maxSizeMB
      let reader = new FileReader();
      await new Promise(resolve => {
        reader.onloadend = () => {
          ctx.setState(prevState => {
            let nextID = Math.floor(
              new Date().getTime() * 1000 + Math.random() * 10000
            );

            let images = prevState.allImages;
            images.push({
              id: nextID,
              imgPath: reader.result,
              newlyAdded: true,
              file: file,
              caption: ""
            });

            return {
              file: file,
              imagePreviewUrl: reader.result,
              allImages: images
            };
          });

          handleSubmit(e, props);
          resolve();
        };
        reader.readAsDataURL(compressedFile);
      });

      handleSubmit(e, props);
    } catch (error) {
      console.log(error);
    }
  };

  let onImageRemove = obj => {
    ctx.setState(prevState => {
      let images = prevState.allImages.reduce((acc, current) => {
        return current.id !== obj.id ? acc.concat([current]) : acc;
      }, []);

      // console.log(prevState.allImages);

      // console.log(images);
      ctx.props.onChanges("images", { data: images });
      return {
        allImages: images
      };
    });
  };

  let confirmRemove = obj => {};

  return {
    handleSubmit,
    handleImageChange,
    confirmRemove,
    onImageRemove
  };
};

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      showRemoveConfirm: true,
      imagePreviewUrl: "",
      allImages: props.images
    };
    this.handlers = createHandlers(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.state.allImages.length !== nextState.allImages.length ||
      this.state.imagePreviewUrl !== nextState.imagePreviewUrl ||
      this.state.showRemoveConfirm !== nextState.showRemoveConfirm
    );
  }

  render() {
    const imageComponents =
      this.state.allImages.length > 0
        ? this.state.allImages.map((image, index) => {
            return (
              <BranchImageEdit
                id={image.id}
                newlyAdded={image.newlyAdded}
                imgPath={image.imgPath}
                altDesc={image.altDesc}
                onRemove={this.handlers.onImageRemove}
                key={index}
              />
            );
          })
        : "";

    return (
      <div>
        <ul>{imageComponents}</ul>
        <div id="image-add" className="image--add">
          <div className="add-item dashed">
            <input
              className="input--edit-file"
              type="file"
              onChange={e => this.handlers.handleImageChange(e, this.props)}
              name="branch-upload-image"
            />
          </div>
        </div>
      </div>
    );
  }
}

ImageUpload.propTypes = {
  onUploadSubmit: PropTypes.func,
  onChange: PropTypes.func,
  images: PropTypes.array
};

export default ImageUpload;
