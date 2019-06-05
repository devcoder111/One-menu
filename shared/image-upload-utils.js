"use strict";

const cloudinary = require('cloudinary');
const constants = require('../constants');

cloudinary.config({
    cloud_name: constants.CLOUDINARY_NAME,
    api_key: constants.CLOUDINARY_API_KEY,
    api_secret: constants.CLOUDINARY_SECRET
});

let ImageUploadUtils = {
    upload: function(data, cb) {
        const {url, ...other} = data
      console.log('cloudinary upload', other);
        cloudinary.v2.uploader.upload(data.url, {
            resource_type: "image",
            chunk_size: 50000000,
            folder: data.file.folder,
            public_id: data.file.name,
            tags: data.id ? `${data.id}` : '',
            context: `caption=${data.Caption}`
            // eager: { quality: "jpegmini", crop: "scale", width: 1024, height: 768 }
        }, function(err, res) {
            // console.error(err)
            // console.error(res)
            if (typeof cb === 'function') {
                cb(res);
            }
        });
    },

    tag: function(data, cb) {
      console.log('cloudinary tag', data);
        cloudinary.v2.uploader.add_tag(data.tag, data.ids, {}, function(err, res) {
            // console.error(err)
            // console.error(res)
            if (typeof cb === 'function') {
                cb(res);
            }
        });
    },
    /**
     *
     * @description remove image from cloud
     * @param {string} id id from cloud
     * @param {Function} cb
     * @return {void}
     */
    remove: function(id, cb) {
        console.log('cloudinary destroy', id);
        cloudinary.v2.uploader.destroy(id, { invalidate: true }, function(err, res) {
            console.log('remove error = ', err)
            console.log('remove res = ', id, res)
            if (typeof cb === 'function') {
                cb(res);
            }
        });
    },
};

module.exports = ImageUploadUtils;