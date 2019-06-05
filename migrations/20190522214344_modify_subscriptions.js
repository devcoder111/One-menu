exports.up = function(knex, Promise) {
    return knex.raw(`
    ALTER TABLE "Subscription"
    Add Column "CompanyID" int8,
    ADD COLUMN "SubscriptionStripeID" VARCHAR(50),
    ADD COLUMN "OriginalLanguageID" int8,
    ADD COLUMN "Language1" int8,
    ADD COLUMN "Language2" int8,
    ADD COLUMN "Language3" int8,
    ADD COLUMN "Language4" int8,
    ADD COLUMN "Language5" int8,
    ADD COLUMN "SubscriptionAdditionalLanguageStripeID1" VARCHAR(50),
    ADD COLUMN "SubscriptionAdditionalLanguageStripeID2" VARCHAR(50),
    ADD COLUMN "SubscriptionAdditionalLanguageStripeID3" VARCHAR(50),
    ADD COLUMN "SubscriptionAdditionalLanguageAmount1" float8,
    ADD COLUMN "SubscriptionAdditionalLanguageAmount2" float8,
    ADD COLUMN "SubscriptionAdditionalLanguageAmount3" float8,
    ADD COLUMN "OriginalLanguageLabel" VARCHAR(100),
    Add Column "MenuID" int8;

  `)
};

exports.down = function(knex, Promise) {
    return knex.raw('')
};