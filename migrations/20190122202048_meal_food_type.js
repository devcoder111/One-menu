
exports.up = function(knex, Promise) {
  return  knex.raw(`
    ALTER TABLE "Meal" 
    ADD COLUMN "FoodTypes" VARCHAR NOT NULL DEFAULT '';
  `)  
};

exports.down = function(knex, Promise) {
  
};
