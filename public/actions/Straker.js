"use strict";
const _ = require('lodash');
const constants = require('../constants');
//const rp = require('request-promise-native');

console.log('Scheduler translation start');

export async function GetStrakerLanguages(obj) {
    const options = {
        method: 'GET',
        uri: constants.STRAKER_TRANSLATION_URL + '/v3/languages',
        json: true,
        headers: {
            "content-type": "application/json",
            "cache-control": "no-cache",
            "Authorization": "Bearer " + constants.STRAKER_TOKEN
        }
    };
    //var res = await rp(options);
    return res;

}