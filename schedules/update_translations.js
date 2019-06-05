"use strict";

const _ = require('lodash');
const rp = require('request-promise-native');

const constants = require('../constants');
const DBLayer = require('../DBLayer');
const db = DBLayer.connection;
const dateUtils = require('../shared/date-utils');
const MenuTranslation = require('../models/menu-translation.model');

console.log('Scheduler translation start');

const checkTranslation = (obj) => {
    const options = {
        method: 'GET',
        uri: constants.STRAKER_TRANSLATION_URL + '?job_key=' + obj.JobNumber,
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
                WordCount: parseInt(data.wordcount, 10),
                Status: data.status,
                Date: dateUtils.toMysqlDate(new Date())
            };

            console.log('checkTranslation', data.job_key, dbObj)
            return MenuTranslation.updateByJobKey(data.job_key, dbObj);
        }

    });
};

const translations = MenuTranslation.getAll().then((res) => {
    _.forEach(res, (obj, index) => {
            // console.log('MenuTranslationID', obj.MenuTranslationID);
            checkTranslation(obj);
        })
        // process.exit();
}).catch((err) => { console.log('err', err); });