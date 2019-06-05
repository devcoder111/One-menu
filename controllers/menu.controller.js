"use strict";

const Menu = require('../models/menu.model');
const Profile = require('../models/profile.model');

class MenuController {

}

MenuController.get = (req, res) => {
    //console.log(req.body);
    res.setHeader('Content-Type', 'application/json');

    Menu.getAll().then(output => {
        // console.log(output);
        res.status(200).json({ success: true, message: 'Menu successfully fetched', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Menu get failed', obj: err });
    });
};

MenuController.getMenyById = (req, res) => {
    //console.log(req.body);
    let MenuID = req.body.MenuID;
    res.setHeader('Content-Type', 'application/json');

    Menu.get({ MenuID: MenuID }).then(output => {
        // console.log(output);
        res.status(200).json({ success: true, message: 'Menu successfully fetched', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Menu get failed', obj: err });
    });
};

MenuController.post = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    Profile.getByEmail(req.decoded).then(result => {
        const obj = Object.assign({}, req.body.obj, { CompanyID: result.CompanyID });
        Menu.create(obj).then(output => {
            res.status(201).json({ success: true, message: 'Menu successfully created', obj: output });
        }).catch(err => {
            console.error(err);
            res.status(204).send({ success: false, message: 'Menu creation failed', obj: err });
        });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Profile get failed', obj: err });
    });
};

MenuController.put = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    var MenuID = req.body.id || req.body.MenuID
    Menu.update(MenuID, req.body.updates).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'Menu successfully updated', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Menu update failed', obj: err });
    });
};

MenuController.remove = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Menu.remove(req.body.id).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'Menu successfully removed', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Menu remove failed', obj: err });
    });
};

MenuController.clone = async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { menu } = req.body;
        await Menu.clone(menu);
        res.status(201).json({ success: true, message: 'Menu successfully cloned' });
    } catch (err) {
        console.error(err);
        res.status(204).send({ success: false, message: 'Category clone failed', obj: err });
    }
};

MenuController.cloneCategory = async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { menu, category } = req.body;
        await Menu.cloneCategory(category, menu);
        res.status(201).json({ success: true, message: 'Menu successfully removed' });
    } catch (err) {
        console.error(err);
        res.status(204).send({ success: false, message: 'Category clone failed', obj: err });
    }
};

MenuController.cloneMeal = async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { menu, category, meal } = req.body;
        await Menu.cloneMeal(meal, category, menu);
        res.status(201).json({ success: true, message: 'Menu successfully removed' });
    } catch (err) {
        console.error(err);
        res.status(204).send({ success: false, message: 'Category clone failed', obj: err });
    }
};

module.exports = MenuController;