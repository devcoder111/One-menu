"use strict";

const DBLayer = require('../DBLayer');
const db = DBLayer.connection;

const ImageUploadUtils = require('../shared/image-upload-utils');


let ImageUpload = class {

};

ImageUpload.create = (obj) => {
    return new Promise((resolve, reject) => {
        ImageUploadUtils.upload(obj, (res) => {
            if (res) {
                resolve(res);
            } else {
                reject('Error occurred while getting the response from Cloudinary');
            }
        });
    });
};

ImageUpload.tag = (obj) => {
    return new Promise((resolve, reject) => {
        ImageUploadUtils.tag(obj, (res) => {
            if (res) {
                resolve(res);
            } else {
                reject('Error occurred while getting the response from Cloudinary');
            }
        });
    });
};


// Update new menu in the database
// Returns a resolved Promise containing the new language
ImageUpload.update = (id, obj) => {
    /*
  let menu = obj;
  menu.DateUpdated = dateUtils.toMysqlDate(new Date());

  return MenuTranslation.getById(id).update(menu).then(res => {
    return MenuTranslation.getById(id);
  });
*/
};

/**
 * @description remove image from cloud
 * @param {string} id id from cloud  
 * @note Forcing cache invalidation is done by setting the invalidate parameter to true 
 *         either when deleting an image or uploading a new one. Note that it 
 *         sually takes up to one hour for the CDN invalidation to take effect.
 */
ImageUpload.remove = (id) => {
    return new Promise((resolve, reject) => {
        ImageUploadUtils.remove(id, (res) => {
            if (res) {
                resolve(res);
            } else {
                reject('Error occurred while getting the response from Cloudinary');
            }
        });
    });
};

module.exports = ImageUpload;