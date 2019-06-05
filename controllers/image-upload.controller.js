"use strict";

const ImageUpload = require('../models/image-upload.model');
const BranchImage = require('../models/branch-image.model');
const Company = require('../models/company.model');
const md5 = require('md5');

class ImageUploadController {

}

ImageUploadController.post = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const {id, catid} = req.body.obj;
        const obj = req.body.obj;
        // console.log('ImageUploadController.post', obj.file)
        const result = await Company.getByEmail(req.decoded);
        const name = obj.file.name;
        obj.file = obj.file || {};
        if(obj.file.folder === 'meal'){
            obj.file.folder = `company/${result.CompanyID}/meal`;
        }else{
            obj.file.folder = `company/${result.CompanyID}/${obj.file.folder || obj.folder || 'branch'}`;
        }
        obj.file.name = `${md5(obj.file.name)}${Date.now()}`;
        const output = await ImageUpload.create(obj);
        output.name = name;
        res.status(201).json({ success: true, message: 'ImageUpload successfully created', obj: output });
    } catch (err) {
        console.error(err);
        res.status(203).send({ success: false, message: 'ImageUpload get failed', obj: err });
    }
};

ImageUploadController.tag = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const obj = req.body.obj;
        const output = await ImageUpload.tag(obj);
        res.status(201).json({ success: true, message: 'ImageUpload successfully tagged', obj: output });
    } catch (err) {
        console.error(err);
        res.status(203).send({ success: false, message: 'ImageUpload tag failed', obj: err });
    }
};

ImageUploadController.put = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    ImageUpload.update(req.body.email, req.body.updates).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'ImageUpload successfully updated', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'ImageUpload update failed', obj: err });
    });
};

ImageUploadController.remove = async (req, res) => {
    // console.log('ImageUploadController.remove', req.body)
    res.setHeader('Content-Type', 'application/json');
    try {
        let result = null
        let path = ''

        if (req.body.type === 'company') {
            result = await Company.getByEmail(req.body.email);
            path = result.LogoPath
            // console.log('LogoPath', path)
        } else {
            result = await BranchImage.getById(req.query.id);
            path = result && result.Path
        }
        // console.log('LogoPath', path)
        // console.log(result);
        if (path) {
            const idIndex = path.indexOf('/company');
            const publicId = idIndex > -1 ? path.substr(idIndex + 1, path.length - idIndex) : '';
            var paths = path.split('/');
            var id = paths.length > 0 ? paths[paths.length - 1] : null;
            const output = await ImageUpload.remove(publicId.split('.')[0])
            // console.log(output);
            if (output.result == "not found") {
                res.status(204).send({ success: false, message: 'Image delete failed', obj: output });
            } else {
                if (req.body.type === 'company') {
                    // TODO
                } else {
                    await BranchImage.remove(req.query.id);
                }

                res.status(201).json({
                    success: true, message: 'Image successfully deleted',
                    obj: Object.assign(result, output)
                });
            }
        }

    } catch (err) {
        console.error(err);
        res.status(204).send({ success: false, message: 'ImageUpload update failed', obj: err });
    };
};

module.exports = ImageUploadController;