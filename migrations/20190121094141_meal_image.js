
exports.up = function(knex, Promise) {
  return  knex.raw(`
    ALTER TABLE "MealImage" 
      RENAME "mealimageid" TO "MealImageID";
  `)
  .then(() =>  knex.raw(`
    ALTER TABLE "MealImage" 
      RENAME "path" TO "Path";
  `))
  .then(() =>  knex.raw(`
    ALTER TABLE "MealImage" 
      RENAME "caption" TO "Caption";
  `))
  .then(() =>  knex.raw(`
    ALTER TABLE "MealImage" 
      RENAME "altdesc" TO "AltDesc";
  `))
  .then(() =>  knex.raw(`
    ALTER TABLE "MealImage" 
      RENAME "date" TO "Date";
  `))
  .then(() =>  knex.raw(`
    ALTER TABLE "MealImage" 
      RENAME "dateupdated" TO "DateUpdated";
  `));
};

exports.down = function(knex, Promise) {
  
};
