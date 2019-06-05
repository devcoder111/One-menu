"use strict";

const MenuBranch = require('../models/menu-branch.model');

class MenuBranchController {

}

MenuBranchController.get = (req, res) => {
    let promise = null;
    if(req.query.menuId){
        promise = MenuBranch.getAllByMenu(req.params.menuId);
    }else{
        promise = MenuBranch.getAll();
    }
    res.setHeader('Content-Type', 'application/json');

    promise.then(output => {
        // console.log(output);
        res.status(200).json({ success: true, message: 'Menu Branch successfully fetched', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Menu Branch get failed', obj: err });
    });
};


MenuBranchController.post = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    MenuBranch.create(req.body.obj).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'Menu Branch successfully created', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Menu Branch creation failed', obj: err });
    });
};

MenuBranchController.addMenuToBranches = (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  MenuBranch.updateBulk(req.body.branches, req.body.menus).then(output => {
      // console.log(output);
      res.status(201).json({ success: true, message: 'Menu added to Branches successfully created', obj: output });
  }).catch(err => {
      console.error(err);
      res.status(204).send({ success: false, message: 'Menu adding to Branches failed', obj: err });
  });
};

MenuBranchController.remove = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    MenuBranch.remove(req.body.obj).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'Menu Branch successfully remomved', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Menu Branch deletiong failed', obj: err });
    });
};

MenuBranchController.removeByMenuId = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    MenuBranch.removeByMenuId(req.body.id).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'Menu Branches successfully remomved', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Menu Branches deletiong failed', obj: err });
    });
};

MenuBranchController.putIds = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    MenuBranch.updateIds(req.body.id, req.body.branchesIds).then(output => {
        // console.log(output);
        res.status(201).json({ success: true, message: 'Menu Branches successfully remomved', obj: output });
    }).catch(err => {
        console.error(err);
        res.status(204).send({ success: false, message: 'Menu Branches deletiong failed', obj: err });
    });
};

module.exports = MenuBranchController;