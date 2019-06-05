"use strict";

const rp = require('request-promise-native');

const constants = require('../constants');
const DBLayer = require('../DBLayer');
const db = DBLayer.connection;
const dateUtils = require('../shared/date-utils');

///////////////////
// TODO: Menu
// Add a menu should only be accessible from OM admins
///////////////////

// Create new menu in the database
// Returns a resolved Promise containing its id
let MenuTranslation = class {

};

MenuTranslation.create = (obj) => {
  let menu = {
    title: obj.title,
    sl: obj.sl,
    tl: obj.tl,
    payload: obj.payload
  };

  if (constants.STRAKER_CALLBACK_URL) {
    menu.callback_uri = constants.STRAKER_CALLBACK_URL + '?type=menu';
  }

  // console.log(menu);

  // Send a req to the Staker server to translate
  const options = {
    method: 'POST',
    uri: constants.STRAKER_TRANSLATION_URL + '/text',
    body: menu,
    json: true,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Authorization": "Bearer " + constants.STRAKER_TOKEN
    }
  };

  return rp(options).then((res) => {
    // console.log(res);

    if (!res || !res.success) {
      return Promise.reject(res);
    }

    // get translation
    const options = {
      method: 'GET',
      uri: constants.STRAKER_TRANSLATION_URL + '?job_key=' + res.job_key,
      json: true,
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
        "Authorization": "Bearer " + constants.STRAKER_TOKEN
      }
    };

    return rp(options).then((res) => {
      const data = res && res.job && res.job[0]
      if (data) {
        // console.log('JOB INFO', data.job_key, data.status, data.wordcount);

        // update DB
        // If successful, update the db entry with the translation PENDING
        let dbObj = {
          MenuID: obj.menuId,
          PropKey: obj.key,
          Title: menu.title,
          JobNumber: data.job_key,
          WordCount: parseInt(data.wordcount, 10),
          BranchLanguageName: menu.tl,
          BranchLanguageID: obj.branchLanguageId,
          Status: data.status,
          OriginalText: menu.payload,
          Date: dateUtils.toMysqlDate(new Date())
        };

        return db('MenuTranslation').insert(dbObj).returning('MenuTranslationID');
      }

    });

  }).catch((err) => {
    console.error(err);
  });
};


// Update new menu in the database
// Returns a resolved Promise containing the new language
MenuTranslation.update = (id, obj) => {
  let menu = obj;
  menu.DateUpdated = dateUtils.toMysqlDate(new Date());

  return MenuTranslation.getById(id).update(menu).then(res => {
    return MenuTranslation.getById(id);
  });
};

// Remove menu in the database
// Returns a resolved Promise containing the number of rows affected
MenuTranslation.remove = (id) => {
  return db('MenuTranslation').where({
    MenuTranslationID: id
  }).first('*').del();
};

// Get a menu by id
// Returns a Promise
MenuTranslation.getById = (id) => {
  return db('MenuTranslation').where({
    MenuTranslationID: id
  }).first('*');
};


// Get a menu by conditions object:
// {
//    key: value
// }
// Returns a Promise
MenuTranslation.get = (conditions) => {
  return db('MenuTranslation').where(conditions).select('*');
};

// Get all menus
// Returns a Promise
MenuTranslation.getAll = () => {
  return db.select('*').from('MenuTranslation');
};

// Update new meal in the database by job_key
// Returns a resolved Promise containing the new language
MenuTranslation.updateByJobKey = (id, obj) => {
    let menu = obj;
    menu.DateUpdated = dateUtils.toMysqlDate(new Date());

    db('MenuTranslation').where({
        JobNumber: id
    }).first('*').update(menu).then(res => {
        // console.log('menu updated', id);
    });
};

module.exports = MenuTranslation;
