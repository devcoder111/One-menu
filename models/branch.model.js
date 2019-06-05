"use strict";
const _ = require('lodash');
const DBLayer = require('../DBLayer');
const db = DBLayer.connection;
const dateUtils = require('../shared/date-utils');
const geoUtils = require('../shared/geo-utils');

const BranchContact = require('./branch-contact.model');
const BranchCuisine = require('./branch-cuisine.model');
const BranchCurrency = require('./branch-currency.model');
const BranchLanguage = require('./branch-language.model');
const BranchImage = require('./branch-image.model');
const MenuBranch = require('./menu-branch.model');
const Menu = require('./menu.model');

// Create new branch in the database
// Returns a resolved Promise containing its id
let Branch = class {

};

Branch.create = (obj) => {
  let branch = obj;
  branch.Date = dateUtils.toMysqlDate(new Date());

  // console.log('branch create');
  // console.log(branch);

  if (branch.Address) {
    let address = branch.Address +
      (branch.Country ? ' ' + branch.Country : '') +
      (branch.City ? ' ' + branch.City : '');

    if (!address) {
      return db('Branch').insert(branch).returning('BranchID');
    }

    return geoUtils.convertToLatLong(address).then(({ latitude, longitude }) => {
      // console.log(latitude, longitude);
      if (latitude && longitude) {
        branch.Latitude = latitude;
        branch.Longitude = longitude;
      }

      // console.log(branch);
      return db('Branch').insert(branch).returning('BranchID');
    }).catch(err => {
      // console.log(err);
      return db('Branch').insert(branch).returning('BranchID');
    });
  }

  // console.log(branch);
  return db('Branch').insert(branch).returning('BranchID');
};

Branch.createWithDetails = async (obj) => {
  let insertNewId = (id, arr) => {
    if (!id) {
      return arr;
    }

    let newObject = arr.map(item => {
      if (!item.BranchID) {
        let newItem = item;
        newItem.BranchID = id;
        return newItem;
      }

      return item;
    });

    // console.log('insertNewId');
    // console.log(newObject);

    return newObject;
  };

  let branch = obj;

  return Branch.create({
    Address: branch.Address,
    City: branch.City,
    CompanyID: branch.CompanyID,
    Country: branch.Country,
    Email: branch.Email,
    Tel: branch.Tel,
    Name: branch.Name,
    HasHeadquarters: branch.HasHeadquarters,
    IsEnabled: branch.IsEnabled
  }).then(async (res) => {
    // console.log(res);
    let id = res[0];

    // const languages = Menu.getLanguages(branch.menus)
    const menuLanguages  = await Menu.getLanguages(branch.menus) || []
    const languages = _.map(menuLanguages, item => {
      return {...item, BranchID: id, LanguageID: item && item.Language && item.Language.LanguageID}
    })

    return Promise.all([
      BranchContact.createAll(insertNewId(id, branch.contacts)),
      BranchCuisine.createAll(insertNewId(id, branch.cuisines)),
      BranchCurrency.createAll(insertNewId(id, branch.currencies)),
      BranchLanguage.createAll(insertNewId(id, languages)),
      MenuBranch.createAll(insertNewId(id, branch.menus)),
      BranchImage.createAll(insertNewId(id, branch.images))
    ]).then(res => {
      // console.log(res);

      let tmp = branch;
      tmp.contacts = res[0][0];
      tmp.cuisines = res[0][1];
      tmp.currencies = res[0][2];
      tmp.languages = res[0][3];
      tmp.images = res[0][4];

      // console.log('finalobj created');
      // console.log(tmp);

      //return Promise.resolve(tmp);
      return Branch.getById(id);
    });
  }).catch(err => {
    return Promise.reject(err);
  });
};


// Update branch in the database
// Returns a resolved Promise containing the new branch
Branch.update = (id, obj) => {
  let branch = obj;
  branch.DateUpdated = dateUtils.toMysqlDate(new Date());

  return Branch.getById(id).update(branch).then(res => {
    return Branch.getById(id);
  });
};

// Returns a resolved Promise containing the new branch
Branch.updateWithDetails = async (id, obj) => {
  let insertNewId = (id, arr) => {
    if (!id) {
      return arr;
    }

    let newObject = arr.map(item => {
      if (!item.BranchID) {
        let newItem = item;
        newItem.BranchID = id;
        return newItem;
      }

      return item;
    });

    // console.log('insertNewId');
    // console.log(newObject);

    return newObject;
  };

  // console.log('BRANCH UPDATE WITH DETAILS');
  // console.log(id, obj);

  let branch = obj;
  branch.DateUpdated = dateUtils.toMysqlDate(new Date());

  const promises = [];
  // console.log('branch.menu', branch.menus);
  const menuLanguages  = await Menu.getLanguages(branch.menus) || []
  const languages = _.map(menuLanguages, item => {
      return {...item, BranchID: branch && branch.BranchID, LanguageID: item && item.Language && item.Language.LanguageID}
    })
  // console.log('branch languages', languages);
  if (branch.contacts) {
    promises.push(BranchContact.updateAll(branch.contacts));
  }
  if (branch.cuisines) {
    promises.push(BranchCuisine.updateAll(insertNewId(id, branch.cuisines)));
  }
  if (branch.currencies) {
    promises.push(BranchCurrency.updateAll(insertNewId(id, branch.currencies)));
  }
  if (branch.languages) {
    promises.push(BranchLanguage.updateAll(id, insertNewId(id, languages)));
  }
  if (branch.menus) {
    promises.push(MenuBranch.updateAll(insertNewId(id, branch.menus), branch));
  }
  if (branch.images) {
    promises.push(BranchImage.removeSelected(branch.images, branch));
    promises.push(BranchImage.updateAll(branch.images));
  }
  if (languages) {
    promises.push();
  }

  return Promise.all(promises).then(res => {
    let tmp = branch;
    if (branch.contacts && res.size > 0) {
      tmp.contacts = res[0].shift();
    }
    if (branch.cuisines && res.size > 0) {
      tmp.cuisines = res[0].shift();
    }
    if (branch.currencies && res.size > 0) {
      tmp.currencies = res[0].shift();
    }
    // if (branch.languages && res.size > 0) {
    //   tmp.languages = res[0].shift();
    // }
    if (branch.images && res.size > 1) {
      tmp.images = res[0][1];
    }

    // console.log('finalobj');
    // console.log(tmp);

    const data = {}

    if (_.has(branch, 'Address')) {
      data.Address = branch.Address;
    }
    if (_.has(branch, 'City')) {
      data.City = branch.City;
    }
    if (_.has(branch, 'Country')) {
      data.Country = branch.Country;
    }
    if (_.has(branch, 'Email')) {
      data.Email = branch.Email;
    }
    if (_.has(branch, 'HasHeadquarters')) {
      data.HasHeadquarters = branch.HasHeadquarters;
    }
    if (_.has(branch, 'IsEnabled')) {
      data.IsEnabled = branch.IsEnabled;
    }
    if (_.has(branch, 'Name')) {
      data.Name = branch.Name;
    }
    if (_.has(branch, 'Tel')) {
      data.Tel = branch.Tel;
    }

    return Branch.getById(id).update(data).then(res => {
      //return Branch.getById(id);
      return Promise.resolve(tmp);
    });
  }).catch(err => {
      return Promise.reject(err);
  });
};



// Remove branch in the database
// Returns a resolved Promise containing the number of rows affected
Branch.remove = (id) => {
  return db('Branch').where({
    BranchID: id
  }).first('*').del();
};

// Get a branch by id
// Returns a Promise
Branch.getById = (id) => {
  return db('Branch').where({
    BranchID: id
  }).first('*');
};


// Get a branch by conditions object:
// {
//    key: value
// }
// Returns a Promise
Branch.get = (conditions) => {
  return db('Branch').where(conditions).select('*');
};

Branch.getWithEntities = (conditions) => {
  return db('Branch').where(conditions).select('*').then(branches => {
    return Promise.all(branches.map(branch => {
      return createBranchContainer(branch);
    }));
  });
};

function createBranchContainer (branch) {
  return new Promise((resolve, reject) => {
    Promise.all([
      BranchContact.get({BranchID: branch.BranchID}),
      BranchCuisine.getWithDetails({BranchID: branch.BranchID}),
      BranchCurrency.getWithDetails({BranchID: branch.BranchID}),
      BranchLanguage.getWithDetails({BranchID: branch.BranchID}),
      BranchImage.get({BranchID: branch.BranchID}),
      Menu.getWithDetails({BranchID: branch.BranchID})
    ]).then(res => {
      // console.log(res);
      let obj = branch;
      obj.contacts = res[0];
      obj.cuisines = res[1];
      obj.currencies = res[2];
      obj.languages = res[3];
      obj.images = res[4];
      obj.menus = res[5];

      resolve(obj);
    }).catch(err => {
      reject(err);
    });
  });
}

// Get all branches
// Returns a Promise
Branch.getAll = () => {
  return db.select('*').from('Branch');
};


module.exports = Branch;
