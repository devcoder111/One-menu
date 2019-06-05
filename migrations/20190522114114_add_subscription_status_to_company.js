exports.up = function(knex, Promise) {
    return knex.raw(`
    ALTER TABLE "Company"
    ADD COLUMN "SubscriptionStat" VARCHAR(50),
    ADD COLUMN "SubscriptionDate" timestamptz;
  `)
};

exports.down = function(knex, Promise) {

};