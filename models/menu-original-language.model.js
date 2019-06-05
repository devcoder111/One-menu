"use strict";

const DBLayer = require('../DBLayer');
const db = DBLayer.connection;
const dateUtils = require('../shared/date-utils');

const Language = require('./language.model');

// Create new language in the database
// Returns a resolved Promise containing its id
let MenuOriginalLanguage = class {

};

MenuOriginalLanguage.create = (obj) => {
  let language = obj;
  language.Date = dateUtils.toMysqlDate(new Date());

  console.log('MenuOriginalLanguage.post', language);
  return db('MenuOriginalLanguage').insert(language).returning('MenuLanguageID');
};


// Update new language in the database
// Returns a resolved Promise containing the new language
MenuOriginalLanguage.update = (id, obj) => {
  let language = obj;
  language.DateUpdated = dateUtils.toMysqlDate(new Date());

  return MenuOriginalLanguage.getById(id).update(language).then(res => {
    return MenuOriginalLanguage.getById(id);
  });
};

// Update all languages for menu
// Returns a resolved Promise containing the new language
MenuOriginalLanguage.updateIds = (id, ids) => {
  return new Promise((resolve, reject) => {
    MenuOriginalLanguage.removeAll(id).then(() => {
      Promise.all(ids.map(langID => {
        MenuOriginalLanguage.create({MenuID: id, BranchLanguageID: langID}).then((res) => {
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
MenuOriginalLanguage.remove = (id) => {
  return db('MenuOriginalLanguage').where({
    MenuLanguageID: id
  }).first('*').del();
};

// Remove all languages for menu
// Returns a resolved Promise containing the number of rows affected
MenuOriginalLanguage.removeAll = (id) => {
  return db('MenuOriginalLanguage').where({
    MenuID: id
  }).del();
};

// Get a language by id
// Returns a Promise
MenuOriginalLanguage.getById = (id) => {
  return db('MenuOriginalLanguage').where({
    MenuLanguageID: id
  }).first('*');
};


// Get a language by conditions object:
// {
//    key: value
// }
// Returns a Promise
MenuOriginalLanguage.get = (conditions) => {
  return db('MenuOriginalLanguage').where(conditions).select('*');
};

MenuOriginalLanguage.getWithDetails = (conditions) => {
  return db('MenuOriginalLanguage').where(conditions).select('*').then(menuLanguages => {
    if (!menuLanguages || menuLanguages.length <= 0) {
      return Promise.resolve(menuLanguages);
    }

    return Promise.all(menuLanguages.map(MenuOriginalLanguage => {
      return createMenuLanguage(MenuOriginalLanguage);
    }));
  });
};

// Get all languages
// Returns a Promise
MenuOriginalLanguage.getAll = () => {
  return db.select('*').from('MenuOriginalLanguage');
};

// Get all languages per branchID
// Returns a Promise
MenuOriginalLanguage.getAllByBranch = (id) => {
  return db('MenuOriginalLanguage').where({
    MenuLanguageID: id
  });
};

function createMenuLanguage (MenuOriginalLanguage) {
  return new Promise((resolve, reject) => {
    Promise.all([
      Language.getWithDetails({LanguageID: MenuOriginalLanguage.BranchLanguageID})
    ]).then(res => {
      // console.log(res);
      let obj = MenuOriginalLanguage;
      obj.Language = res[0];
      resolve(obj);
    }).catch(err => {
      reject(err);
    });
  });
}


module.exports = MenuOriginalLanguage;
