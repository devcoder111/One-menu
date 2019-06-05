"use strict";

const MenuOriginalLanguage = require('../models/menu-original-language.model');

class MenuOriginalLanguageController {

}

MenuOriginalLanguageController.get = (req, res) => {
    //console.log(req.body);
    res.setHeader('Content-Type', 'application/json');

    MenuOriginalLanguage.getAll().then(output => {
        // console.log(output);
        res.status(200).json({ success: true, message: 'MenuOriginalLanguage successfully fetched', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'MenuOriginalLanguage get failed', obj: err });
    });
};

MenuOriginalLanguageController.post = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    MenuOriginalLanguage.create(req.body.obj).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'MenuOriginalLanguage successfully created', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'MenuOriginalLanguage creation failed', obj: err });
    });
};

MenuOriginalLanguageController.putIds = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  MenuOriginalLanguage.updateIds(req.body.id, req.body.languagesIds).then(output => {
    // console.log(output);
    res.status(201).json({ success: true, message: 'MenuOriginalLanguage successfully updated', obj: output });
  }).catch(err => {
    console.error(err);
    res.status(204).send({ success: false, message: 'MenuOriginalLanguage update failed', obj: err });
  });
};

MenuOriginalLanguageController.put = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    MenuOriginalLanguage.update(req.body.id, req.body.updates).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'MenuOriginalLanguage successfully updated', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'MenuOriginalLanguage update failed', obj: err });
    });
};

MenuOriginalLanguageController.remove = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    MenuOriginalLanguage.remove(req.body.id).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'MenuOriginalLanguage successfully removed', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'MenuOriginalLanguage remove failed', obj: err });
    });
};

module.exports = MenuOriginalLanguageController;