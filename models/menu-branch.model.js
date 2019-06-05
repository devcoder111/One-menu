"use strict";

const rp = require('request-promise-native');

const constants = require('../constants');
const DBLayer = require('../DBLayer');
const db = DBLayer.connection;
const dateUtils = require('../shared/date-utils');

let MenuBranch = class {

};

MenuBranch.get = (conditions) => {
  return db('MenuBranch').where(conditions).select('*');
};

/**
 * @description Insert/Create Menu Branch 
 * @param {obj.MenuId} number Linked to Menu.MenuID
 * @param {obj.BranchID} number Linked to Menu.MenuID
 * @return {QueryBuilder}
 */
MenuBranch.create = (obj) => {
  let menu = obj;
  menu.Date = dateUtils.toMysqlDate(new Date());

  // console.log(menu);
  return db('MenuBranch').insert(menu).returning('MenuID');
};

MenuBranch.createAll = (menus) => {
  if (!menus || menus.length <= 0) {
    console.error('No menus specified');
    return Promise.resolve([]);
  }

  return Promise.all(menus.map(menu => {
    return MenuBranch.create({
      BranchID: menu.BranchID,
      MenuID: menu.MenuID
    });
  }));
};

MenuBranch.updateAll = (menus, branch) => {
  // console.log('MenuBranch.updateAll', menus, branch)
  if (!branch || !branch.BranchID) {
    console.error('No branch specified');
    return Promise.resolve([]);
  }
  return MenuBranch.remove({
    BranchID: branch.BranchID,
    // MenuID: branchMenu.MenuID
  }).then(() => {
    return Promise.all(menus.map(menu => {
      return MenuBranch.create({
        BranchID: menu.BranchID,
        MenuID: menu.MenuID
      });
    }));
  });
}

// Update all branches for menu
MenuBranch.updateIds = (id, ids) => {
  // console.log('updateIds', id, ids)
  return new Promise((resolve, reject) => {
    MenuBranch.removeByMenuId(id).then(() => {
      Promise.all(ids.map(branchID => {
        MenuBranch.create({MenuID: id, BranchID: branchID}).then((res) => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      }));
    })
  });
};
MenuBranch.updateBulk = (branches, menus) => {
  if (!menus || menus.length <= 0 || !branches || branches.length <= 0) {
    console.error('No menus specified');
    return Promise.resolve([]);
  }

  return Promise.all(branches.map(branchID => {
    //
    // If the item is not already is in the db check if
    // the same values are already somewhere

    return Promise.all(menus.map(menuID => {
      return MenuBranch.get({
        MenuID: menuID,
        BranchID: branchID
      }).then(branchMenus => {
        if (!branchMenus || branchMenus.length <= 0) {
          return MenuBranch.create({
            BranchID: branchID,
            MenuID: menuID
          });
        }
      });
    }));
  }));
}

/**
 * @description Remove Menu Branch 
 * @param {obj.MenuId} number Linked to Menu.MenuID
 * @param {obj.BranchID} number Linked to Menu.MenuID
 * @return {QueryBuilder|Promise<any>}
 */
MenuBranch.remove = (obj) => {
  let data = {}

  if (obj && obj.MenuID) {
    data.MenuID = obj.MenuID
  }
  if (obj && obj.BranchID) {
    data.BranchID = obj.BranchID
  }

  return db('MenuBranch').where(data).first('*').del();
};

/**
 * @description Remove Menu Branch
 * @param {obj.MenuId} number Linked to Menu.MenuID
 * @param {obj.BranchID} number Linked to Menu.MenuID
 * @return {QueryBuilder|Promise<any>}
 */
MenuBranch.removeByMenuId = (id) => {
  return db('MenuBranch').where({
    MenuID: id,
  }).del();
};

/**
 * @description Get All
 * @return {QueryBuilder|Promise<any>}
 */
MenuBranch.getAll = () => {
  return db.select('*').from('MenuBranch');
};

/**
 * @description Get All by BranchId
 * @param {id} Number BranchID
 * @return {QueryBuilder|Promise<any>}
 */
MenuBranch.getAllByBranch = (id) => {
  return db('MenuBranch').where({
    BranchID: id
  });
};

/**
 * @description Get All by MenuID
 * @param {id} Number MenuID
 * @return {QueryBuilder|Promise<any>}
 */
MenuBranch.getAllByMenu = (id) => {
  return db('MenuBranch').where({
      MenuID: id
  });
};
module.exports = MenuBranch;
