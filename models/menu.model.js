"use strict";
const size = require('lodash/size');
const forEach = require('lodash/forEach');
const map = require('lodash/map');
const md5 = require('md5');
const DBLayer = require('../DBLayer');
const db = DBLayer.connection;
const dateUtils = require('../shared/date-utils');

const MenuBranch = require('./menu-branch.model');
const MenuCategory = require('./menu-category.model');
const MenuOriginalLanguage = require('./menu-original-language.model');
const MenuLanguage = require('./menu-language.model');
const MenuTranslation = require('./menu-translation.model');
const Meal = require('./meal.model');
const MealImage = require('./meal-image.model');
const ImageUpload = require('./image-upload.model');

///////////////////
// TODO: Menu
// Add a menu should only be accessible from OM admins
///////////////////

// Create new menu in the database
// Returns a resolved Promise containing its id
let Menu = class {

};

Menu.create = (obj) => {
  let menu = obj;
  menu.Date = dateUtils.toMysqlDate(new Date());

  // console.log(menu);
  return db('Menu').insert(menu).returning('MenuID');
};


// Update new menu in the database
// Returns a resolved Promise containing the new language
Menu.update = (id, obj) => {
  let menu = obj;
  menu.DateUpdated = dateUtils.toMysqlDate(new Date());

  const data = {
    MenuID: menu.MenuID,
    Title: menu.Title,
    Description: menu.Description,
    Price: menu.Price || null,
    DateUpdated: menu.DateUpdated
  }
  return Menu.getById(id).update(data).then(res => {
    return Menu.getById(id);
  });
};

// Remove menu in the database
// Returns a resolved Promise containing the number of rows affected
Menu.remove = (id) => {
  return db('Menu').where({
    MenuID: id
  }).first('*').del();
};

// Get a menu by id
// Returns a Promise
Menu.getById = (id) => {
  return db('Menu').where({
    MenuID: id
  }).first('*');
};


// Get a menu by conditions object:
// {
//    key: value
// }
// Returns a Promise
Menu.get = (conditions) => {
  return db('Menu').where(conditions).select('*');
};

Menu.getExtended = (conditions) => {
  return db('Menu').where(conditions).select('*').then(menus => {
    return Promise.all(menus.map(menu => {
      return createMenuContainer(menu, {});
    }));
  });;
};

Menu.getWithDetails = (conditions) => {
  return db('Menu')
    .innerJoin('MenuBranch', 'Menu.MenuID', 'MenuBranch.MenuID')
    .where(conditions).select('*').then(menus => {
      return Promise.all(menus.map(menu => {
        return createMenuContainer(menu);
      }));
    });
};

Menu.getLanguages = (menus) => {
  // console.log('Menu.getLanguages menus', menus);
  //   return Promise.all(menus.map(menu => {
  //     return MenuLanguage.getWithDetails({MenuID: menu.MenuID});
  //   })).then((res) => {
  //     resolve
  //     // console.log('languages res', res)
  //   });

  return new Promise((resolve, reject) => {
    Promise.all(map(menus, menu => {
      return MenuLanguage.getWithDetails({MenuID: menu.MenuID});
    })).then(res => {
      let data = [];
      forEach(res, item => {
        if (item && size(item) > 0) {
          data = [...data, ...item];
        }
      })
      // console.log(res);
      // console.log('MenuOriginalLanguage res', res[1])
      // console.log('MenuLanguage res', res[2])

      resolve(data);
    }).catch(err => {
      reject(err);
    });
  });
};


function createMenuContainer (menu, hidden = {}) {

  return new Promise((resolve, reject) => {
    Promise.all([
      MenuCategory.getWithDetails({MenuID: menu.MenuID}),
      MenuOriginalLanguage.getWithDetails({MenuID: menu.MenuID}),
      MenuLanguage.getWithDetails({MenuID: menu.MenuID}),
      MenuTranslation.get({MenuID: menu.MenuID}),
      MenuBranch.get({MenuID: menu.MenuID}),
    ]).then(res => {
      // console.log(res);
      // console.log('MenuOriginalLanguage res', res[1])
      // console.log('MenuLanguage res', res[2])
      let obj = menu;
      if (!hidden.category) {
        obj.categories = res[0];
      }
      if (!hidden.language) {
        obj.originalLanguages = res[1];
      }
      if (!hidden.language) {
        obj.languages = res[2];
      }
      if (!hidden.translation) {
        obj.translations = res[3];
      }
      if (!hidden.branch) {
        obj.branches = res[4];
      }

      resolve(obj);
    }).catch(err => {
      reject(err);
    });
  });
}

// Get all menus
// Returns a Promise
Menu.getAll = () => {
  return db.select('*').from('Menu');
};

// // Get all menus per branchID
// // Returns a Promise
// Menu.getAllByBranch = (id) => {
//   return db('Menu').where({
//     BranchID: id
//   });
// };

/**
 * @description clone a category to an existing menu
 * @param {object} category
 * @param {object} toMenu
 */
Menu.clone = async(menu) => {
  // const menu = await Menu.getById(toMenu.MenuID || toMenu.id);
  if(!menu) return false;
  // console.log('menu: ', menu);
  const cc = { MenuID: menu.MenuID };
  let menuData = await Menu.get({MenuID: menu.MenuID});
  const categories = await MenuCategory.getWithDetails(cc);
  // console.log('categories', categories);
  // const menuData = await Menu.getWithDetails({MenuID: menu.MenuID, BranchID: menu.BranchID});
  menuData = menuData && menuData[0];
  if (!menuData) return false;
  const { MenuID, ...data } = menuData;
  // console.log('data', data);
  let newMenuId = await Menu.create({ ...data, Title: `Copy of ${data.Title}` });
  newMenuId = newMenuId && newMenuId[0];
  // console.log('newMenuId', newMenuId);
  const branches = await MenuBranch.get({MenuID: menu.MenuID});
  forEach(branches, async (branch) => {
    await MenuBranch.create({MenuID: newMenuId, BranchID: branch.BranchID});
  });
  // console.log('branches', branches);
  const originalLanguages = await MenuOriginalLanguage.get({MenuID: menu.MenuID});
  const languages = await MenuLanguage.get({MenuID: menu.MenuID});
  forEach(originalLanguages, async (language) => {
    await MenuOriginalLanguage.create({MenuID: newMenuId, BranchLanguageID: language.BranchLanguageID});
  });
  forEach(languages, async (language) => {
    await MenuLanguage.create({MenuID: newMenuId, BranchLanguageID: language.BranchLanguageID});
  });
  // console.log('originalLanguages', originalLanguages, languages);
  forEach(categories, async (category) => {
    await Menu.cloneCategory(category, {MenuID: newMenuId});
  });
  // console.log(' done: ');
  return true;
}

/**
 * @description clone a category to an existing menu
 * @param {object} category
 * @param {object} toMenu
 */
Menu.cloneCategory = async(fromCategory, toMenu) => {
  const menu = await Menu.getById(toMenu.MenuID || toMenu.id);
  if(!menu) return;
  // console.log('menu: ', menu.MenuID);
  const cc = {MenuID: menu.MenuID, CategoryID: fromCategory.CategoryID || fromCategory.id };
  let [category] = await MenuCategory.get(cc);
  if(!category) {
    await MenuCategory.create(cc);
    [category] = await MenuCategory.get(cc);
  }
  const meals = fromCategory.meals;
  const MenuCategoryID = category.MenuCategoryID;
  // console.log('category: ', category.MenuCategoryID);
  if (meals && meals.length > 0) {
    for(let i =0; i < meals.length; i+=1){
      const meal = meals[i];
      await Menu.cloneMeal(meal, category, menu);
    }
  }

  console.log(' done: ');
  return true;
}

Menu.cloneMeal = async(fromMeal, toCategory, toMenu) => {
  const menu = await Menu.getById(toMenu.MenuID || toMenu.id);
  if(!menu) return;
  const category = await MenuCategory.getById(toCategory.MenuCategoryID || toCategory.id);
  if(!category) return;
  const MenuCategoryID = category.MenuCategoryID;
  
  const meal = fromMeal;
  console.log('meal: ', meal.Title);
  const [MealID] = await Meal.create({
    MenuCategoryID,
    Title: (meal.Title || meal.title),
    MealDetailID: (meal.MealDetailID || meal.mealDetailID),
    Description: (meal.Description || meal.description),
    Price: (meal.Price || meal.price || 0),
    EnableDetails: (meal.EnableDetails || meal.enableDetails),
    FoodTypes: (meal.FoodTypes || meal.foodTypes || []).map(x => x.Name).join(','),
  });
  console.log('MealID: ', MealID);
  const images = meal.images;
  for(let k = 0; k < images.length; k+=1){
    const image = images[k];
    console.log('image: ', image.Path);
    const cloudFile = await ImageUpload.create({
      url: image.imgPath || image.Path,
      file: {
        folder: `company/${menu.CompanyID}/meal/${MealID}/category/${MenuCategoryID}`,
        name: md5(String(image.MealImageId || image.id)),
      }
    });
    console.log('cloudFile: ', cloudFile.secure_url);
    await MealImage.create({
      Path: cloudFile.secure_url || cloudFile.url,
      Caption: "",
      AltDesc: "",
      MealID,
    });
    console.log('MealImage done: ', i );
  }
}

module.exports = Menu;
