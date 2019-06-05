
exports.up = function (knex, Promise) {

  return knex.raw(`
      ALTER TABLE "Company" 
        ADD PRIMARY KEY ("CompanyID");
    `)
    // Analytics--------------------------------
    .then(() => knex.raw(`
      DELETE FROM "Analytics" 
        WHERE "CompanyID" not in (SELECT "CompanyID" FROM "Company");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "Analytics" 
        ALTER COLUMN  "CompanyID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "Analytics" 
        ADD CONSTRAINT "FKAnalytics" FOREIGN KEY ("CompanyID") 
        REFERENCES "Company" ("CompanyID") ON DELETE CASCADE;
    `))
    // Branch--------------------------------
    .then(() => knex.raw(`
      DELETE FROM "Branch" 
        WHERE "CompanyID" not in (SELECT "CompanyID" FROM "Company");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "Branch" 
        ALTER COLUMN  "CompanyID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "Branch" 
        ADD CONSTRAINT "FKBranch" FOREIGN KEY ("CompanyID") 
        REFERENCES "Company" ("CompanyID") ON DELETE CASCADE;
    `))
    // Menu--------------------------------
    // #1.4 Design "many to many" DB strategy for Menus & branches.
    .then(() => knex.raw(`
      ALTER TABLE "Menu" 
        ADD COLUMN  "CompanyID" BIGINT;
    `))
    .then(() => knex.raw(`
      UPDATE "Menu" SET "CompanyID" = (
        SELECT "CompanyID" FROM "Branch"
          WHERE "BranchID" = "Menu"."BranchID"
      )
    `))
    .then(() => knex.raw(`
      DELETE FROM "Menu" 
        WHERE "CompanyID" not in (SELECT "CompanyID" FROM "Company");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "Menu" 
        ADD CONSTRAINT "FKMenu" FOREIGN KEY ("CompanyID") 
        REFERENCES "Company" ("CompanyID") ON DELETE CASCADE;
    `))
    // Menu--------------------------------
    // #1.4 Design "many to many" DB strategy for Menus & branches.
    .then(() => knex.raw(`
      ALTER TABLE "Branch" 
        ADD PRIMARY KEY ("BranchID");
    `))
    .then(() => knex.raw(`
      CREATE TABLE "BranchMenu" (
        "BranchID" BIGINT,
        "MenuID" BIGINT,
        "Date" timestamp with time zone,
        "DateUpdated" timestamp with time zone,
        PRIMARY KEY ("BranchID", "MenuID")
      );
    `))
    .then(() => knex.raw(`
      ALTER TABLE "BranchMenu" 
        ADD CONSTRAINT "FKBranchMenuMenu" FOREIGN KEY ("MenuID") 
        REFERENCES "Menu" ("MenuID") ON DELETE CASCADE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "BranchMenu" 
        ADD CONSTRAINT "FKBranchMenuBranch" FOREIGN KEY ("BranchID") 
        REFERENCES "Branch" ("BranchID") ON DELETE CASCADE;
    `))
    .then(() => knex.raw(`
      INSERT INTO "BranchMenu"  ("BranchID", "MenuID", "Date", "DateUpdated")
      SELECT "Branch"."BranchID", "MenuID", now(), now() FROM "Menu"
        INNER JOIN "Branch" ON "Branch"."BranchID" = "Menu"."BranchID"
    `))
    .then(() => knex.raw(`
        ALTER TABLE "Menu" DROP COLUMN "BranchID"
    `))
    
};

exports.down = function (knex, Promise) {

};
