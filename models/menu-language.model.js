"use strict";

const DBLayer = require('../DBLayer');
const db = DBLayer.connection;
const dateUtils = require('../shared/date-utils');

const Language = require('./language.model');

// Create new language in the database
// Returns a resolved Promise containing its id
let MenuLanguage = class {

};

MenuLanguage.create = (obj) => {
  let language = obj;
  language.Date = dateUtils.toMysqlDate(new Date());
    console.log('MenuLanguage.post', language);
  // console.log(language);
  return db('MenuLanguage').insert(language).returning('MenuLanguageID');
};


// Update new language in the database
// Returns a resolved Promise containing the new language
MenuLanguage.update = (id, obj) => {
  let language = obj;
  language.DateUpdated = dateUtils.toMysqlDate(new Date());

  return MenuLanguage.getById(id).update(language).then(res => {
    return MenuLanguage.getById(id);
  });
};

// Update all languages for menu
// Returns a resolved Promise containing the new language
MenuLanguage.updateIds = (id, ids) => {
  return new Promise((resolve, reject) => {
    MenuLanguage.removeAll(id).then(() => {
      Promise.all(ids.map(langID => {
        MenuLanguage.create({MenuID: id, BranchLanguageID: langID}).then((res) => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      }));
    })
  });
};

// Remove language in the database
// Returns a resolved Promise containing the number of rows affected
MenuLanguage.remove = (id) => {
  return db('MenuLanguage').where({
    MenuLanguageID: id
  }).first('*').del();
};

// Remove all languages for menu
// Returns a resolved Promise containing the number of rows affected
MenuLanguage.removeAll = (id) => {
  return db('MenuLanguage').where({
    MenuID: id
  }).del();
};

// Get a language by id
// Returns a Promise
MenuLanguage.getById = (id) => {
  return db('MenuLanguage').where({
    MenuLanguageID: id
  }).first('*');
};


// Get a language by conditions object:
// {
//    key: value
// }
// Returns a Promise
MenuLanguage.get = (conditions) => {
  return db('MenuLanguage').where(conditions).select('*');
};

MenuLanguage.getWithDetails = (conditions) => {
  return db('MenuLanguage').where(conditions).select('*').then(menuLanguages => {
    if (!menuLanguages || menuLanguages.length <= 0) {
      return Promise.resolve(menuLanguages);
    }

    return Promise.all(menuLanguages.map(menuLanguage => {
      return createMenuLanguage(menuLanguage);
    }));
  });
};

// Get all languages
// Returns a Promise
MenuLanguage.getAll = () => {
  return db.select('*').from('MenuLanguage');
};

// Get all languages per branchID
// Returns a Promise
MenuLanguage.getAllByBranch = (id) => {
  return db('MenuLanguage').where({
    MenuLanguageID: id
  });
};

function createMenuLanguage (menuLanguage) {
  // console.log('createMenuLanguage', menuLanguage)
  return new Promise((resolve, reject) => {
    if (menuLanguage.BranchLanguageID) {
        Promise.all([
            Language.getWithDetails({LanguageID: menuLanguage.BranchLanguageID})
        ]).then(res => {
            // console.log(res);
            let obj = menuLanguage;
            obj.Language = res[0];
            resolve(obj);
        }).catch(err => {
            reject(err);
        });
    } else {
        resolve();
    }
  });
}


module.exports = MenuLanguage;
