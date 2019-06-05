"use strict";

const rp = require('request-promise-native');

const constants = require('../constants');
const DBLayer = require('../DBLayer');
const db = DBLayer.connection;
const dateUtils = require('../shared/date-utils');

// Create new meal in the database
// Returns a resolved Promise containing its id
let MealTranslation = class {

};

MealTranslation.create = (obj) => {
  let meal = {
    title: obj.title,
    sl: obj.sl,
    tl: obj.tl,
    payload: obj.payload,
  };

  if (constants.STRAKER_CALLBACK_URL) {
    meal.callback_uri = constants.STRAKER_CALLBACK_URL + '?type=meal';
  }

  // console.log(meal);

  // Send a req to the Staker server to translate
  const options = {
    method: 'POST',
    uri: constants.STRAKER_TRANSLATION_URL + '/text',
    body: meal,
    json: true,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-cache",
      "Authorization": "Bearer " + constants.STRAKER_TOKEN
    }
  };

  return rp(options).then((res) => {
    // console.log('translate result', res);

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
        let dbObj = {
          MealID: obj.mealId,
          PropKey: obj.key,
          Title: meal.title,
          JobNumber: data.job_key,
          WordCount: parseInt(data.wordcount, 10),
          BranchLanguageName: meal.tl,
          Status: data.status,
          OriginalText: meal.payload,
          Date: dateUtils.toMysqlDate(new Date())
        };

        return db('MealTranslation').insert(dbObj).returning('MealTranslationID');
      }

    });

      // If successful, update the db entry with the translation PENDING

  }).catch((err) => {
    console.error('MealTranslation.create', options, err);
  });
};


// Update new meal in the database
// Returns a resolved Promise containing the new language
MealTranslation.update = (id, obj) => {
  let meal = obj;
  meal.DateUpdated = dateUtils.toMysqlDate(new Date());

  return MealTranslation.getById(id).update(meal).then(res => {
    return MealTranslation.getById(id);
  });
};

// Update new meal in the database by job_key
// Returns a resolved Promise containing the new language
MealTranslation.updateByJobKey = (id, obj) => {
  let meal = obj;
  meal.DateUpdated = dateUtils.toMysqlDate(new Date());

  db('MealTranslation').where({
    JobNumber: id
  }).first('*').update(meal).then(res => {
    console.log('meal updated', id);
  });
};

// Remove meal in the database
// Returns a resolved Promise containing the number of rows affected
MealTranslation.remove = (id) => {
  return db('MealTranslation').where({
    MealTranslationID: id
  }).first('*').del();
};

// Get a meal by id
// Returns a Promise
MealTranslation.getById = (id) => {
  return db('MealTranslation').where({
    MealTranslationID: id
  }).first('*');
};


// Get a menu by conditions object:
// {
//    key: value
// }
// Returns a Promise
MealTranslation.get = (conditions) => {
  return db('MealTranslation').where(conditions).select('*');
};

// Get all meals
// Returns a Promise
MealTranslation.getAll = () => {
  return db.select('*').from('MealTranslation');
};

// Get all meals per MenuCategory
// Returns a Promise
MealTranslation.getAllByBranch = (id) => {
  return db('MealTranslation').where({
    MealTranslationID: id
  });
};


module.exports = MealTranslation;
