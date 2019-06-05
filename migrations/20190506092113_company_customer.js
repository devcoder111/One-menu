
exports.up = function(knex, Promise) {
  return knex.raw(`
    ALTER TABLE "Company"
    ADD COLUMN "CustomerID" VARCHAR(50);
  `)
};

exports.down = function(knex, Promise) {
  
};
