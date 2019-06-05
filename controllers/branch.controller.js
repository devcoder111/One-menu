"use strict";

const Branch = require('../models/branch.model');
const BranchImage = require('../models/branch-image.model');
const ImageUpload = require('../models/image-upload.model');

class BranchController {

}

BranchController.get = (req, res) => {
    //console.log(req.body);
    res.setHeader('Content-Type', 'application/json');

    Branch.getAll().then(output => {
        // console.log(output);
        res.status(200).json({ success: true, message: 'Branch successfully fetched', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Branch get failed', obj: err });
    });
};

BranchController.post = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // console.log('BranchController.post');
    Branch.createWithDetails(req.body.obj).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'Branch successfully created', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Branch creation failed', obj: err });
    });
};

BranchController.put = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // console.log('BranchController.put');
    Branch.updateWithDetails(req.body.id, req.body.updates).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'Branch successfully updated', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Branch update failed', obj: err });
    });
};

BranchController.remove = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    // console.log('BranchController.remove');
    try {
        // console.log(output);
        const images = await BranchImage.get({ BranchID: req.body.id });
        const output = await Branch.remove(req.body.id);

        images.map(result => {
            // Just remove in background, no need to wait since it also invalidate cache in an hour
            const idIndex = result.Path.indexOf('/company');
            const publicId = idIndex > -1 ? result.Path.substr(idIndex + 1, result.Path.length - idIndex) : '';
            ImageUpload.remove(publicId.split('.')[0]);
        });

        res.status(201).json({
            success: true,
            message: 'Branch successfully removed', obj: Object.assign(output, { images })
        });
    } catch (err) {
        console.error(err);
        res.status(204).send({ success: false, message: 'Branch remove failed', obj: err });
    }
};

module.exports = BranchController;