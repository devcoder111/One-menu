"use strict";

const DBLayer = require('../DBLayer');
const db = DBLayer.connection;
const dateUtils = require('../shared/date-utils');

const allFoodTypes = [
  {
    Name: 'Vegan',
    Group: 'Wellness',
  },
  {
    Name: 'Vegetarian',
    Group: 'Wellness',
  },
  {
    Name: 'Low Calorie',
    Group: 'Wellness',
  },
  {
    Name: 'Kosher',
    Group: 'Religion',
  },
  {
    Name: 'Muslim',
    Group: 'Religion',
  },
  {
    Name: 'Lactose Free',
    Group: 'Intollerance',
  },
  {
    Name: 'Peanuts Free',
    Group: 'Intollerance',
  },
  {
    Name: 'Gluten Free',
    Group: 'Intollerance',
  },
];

// Create new analytic entry in the database
// Returns a resolved Promise containing its id
let FoodTypes = class {

};

FoodTypes.getAll = () => {
  return [...allFoodTypes];
};

module.exports = FoodTypes;
