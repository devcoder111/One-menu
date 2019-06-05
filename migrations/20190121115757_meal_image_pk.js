
exports.up = function(knex, Promise) {
  return  knex.raw(`
    CREATE SEQUENCE seq_meal_image;
  `)
  .then(() =>  knex.raw(`
    ALTER TABLE "MealImage" ALTER "MealImageID" SET DEFAULT nextval('seq_meal_image');
  `))
  
};

exports.down = function(knex, Promise) {
  
};
