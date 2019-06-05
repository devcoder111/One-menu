
exports.up = function(knex, Promise) {
  return Promise.resolve(true)
    // BranchContact -----------------------------
    .then(() => knex.raw(`
      DELETE FROM "BranchContact" 
        WHERE "BranchID" not in (SELECT "BranchID" FROM "Branch");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "BranchContact" 
        ALTER COLUMN  "BranchID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "BranchContact" 
        ADD CONSTRAINT "FKBranchContact" FOREIGN KEY ("BranchID") 
        REFERENCES "Branch" ("BranchID") ON DELETE CASCADE;
    `))
    // BranchCuisine -----------------------------
    .then(() => knex.raw(`
      DELETE FROM "BranchCuisine" 
        WHERE "BranchID" not in (SELECT "BranchID" FROM "Branch");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "BranchCuisine" 
        ALTER COLUMN  "BranchID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "BranchCuisine" 
        ADD CONSTRAINT "FKBranchCuisine" FOREIGN KEY ("BranchID") 
        REFERENCES "Branch" ("BranchID") ON DELETE CASCADE;
    `))
    // BranchCurrency -----------------------------
    .then(() => knex.raw(`
      DELETE FROM "BranchCurrency" 
        WHERE "BranchID" not in (SELECT "BranchID" FROM "Branch");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "BranchCurrency" 
        ALTER COLUMN  "BranchID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "BranchCurrency" 
        ADD CONSTRAINT "FKBranchCurrency" FOREIGN KEY ("BranchID") 
        REFERENCES "Branch" ("BranchID") ON DELETE CASCADE;
    `))
    // BranchImage -----------------------------
    .then(() => knex.raw(`
      DELETE FROM "BranchImage" 
        WHERE "BranchID" not in (SELECT "BranchID" FROM "Branch");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "BranchImage" 
        ALTER COLUMN  "BranchID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "BranchImage" 
        ADD CONSTRAINT "FKBranchImage" FOREIGN KEY ("BranchID") 
        REFERENCES "Branch" ("BranchID") ON DELETE CASCADE;
    `))
    // BranchLanguage -----------------------------
    .then(() => knex.raw(`
      DELETE FROM "BranchLanguage" 
        WHERE "BranchID" not in (SELECT "BranchID" FROM "Branch");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "BranchLanguage" 
        ALTER COLUMN  "BranchID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "BranchLanguage" 
        ADD CONSTRAINT "FKBranchLanguage" FOREIGN KEY ("BranchID") 
        REFERENCES "Branch" ("BranchID") ON DELETE CASCADE;
    `))
    // CategoryCustom -----------------------------
    .then(() => knex.raw(`
      DELETE FROM "CategoryCustom" 
        WHERE "BranchID" not in (SELECT "BranchID" FROM "Branch");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "CategoryCustom" 
        ALTER COLUMN  "BranchID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "CategoryCustom" 
        ADD CONSTRAINT "FKCategoryCustom" FOREIGN KEY ("BranchID") 
        REFERENCES "Branch" ("BranchID") ON DELETE CASCADE;
    `))
};

exports.down = function(knex, Promise) {
  
};
