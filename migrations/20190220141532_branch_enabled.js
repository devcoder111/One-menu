
exports.up = function(knex, Promise) {
  return  knex.raw(`
    ALTER TABLE "Branch" 
    ADD COLUMN "IsEnabled" BOOLEAN NOT NULL DEFAULT true;
  `)
};

exports.down = function(knex, Promise) {
  return  knex.raw(`
    ALTER TABLE "Branch" 
    DROP COLUMN "IsEnabled";
  `)
};
