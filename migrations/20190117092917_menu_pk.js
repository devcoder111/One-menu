
exports.up = function (knex, Promise) {

  return knex.raw(`
      ALTER TABLE "Menu" 
        ADD PRIMARY KEY ("MenuID");
    `)
    .then(() => knex.raw(`
      DELETE FROM "MenuCategory" 
        WHERE "MenuID" not in (SELECT "MenuID" FROM "Menu");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MenuCategory" 
        ALTER COLUMN  "MenuID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MenuCategory" 
        ADD CONSTRAINT "FKMenuCategory" FOREIGN KEY ("MenuID") 
        REFERENCES "Menu" ("MenuID") ON DELETE CASCADE;
    `))
    .then(() => knex.raw(`
      DELETE FROM "MenuLanguage" 
        WHERE "MenuID" not in (SELECT "MenuID" FROM "Menu");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MenuLanguage" 
        ALTER COLUMN  "MenuID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MenuLanguage" 
        ADD CONSTRAINT "FKMenuTranslation" FOREIGN KEY ("MenuID") 
        REFERENCES "Menu" ("MenuID") ON DELETE CASCADE;
    `))
    .then(() => knex.raw(`
      DELETE FROM "MenuTranslation" 
        WHERE "MenuID" not in (SELECT "MenuID" FROM "Menu");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MenuTranslation" 
        ALTER COLUMN  "MenuID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MenuTranslation" 
        ADD CONSTRAINT "FKMenuTranslation" FOREIGN KEY ("MenuID") 
        REFERENCES "Menu" ("MenuID") ON DELETE CASCADE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MenuCategory" 
        ADD PRIMARY KEY ("MenuCategoryID");
    `))
    .then(() => knex.raw(`
      DELETE FROM "MenuCategoryTranslation" 
        WHERE "MenuCategoryID" not in (SELECT "MenuCategoryID" FROM "MenuCategory");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MenuCategoryTranslation" 
        ALTER COLUMN  "MenuCategoryID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MenuCategoryTranslation" 
        ADD CONSTRAINT "FKMenuCategoryTranslation" FOREIGN KEY ("MenuCategoryID") 
        REFERENCES "MenuCategory" ("MenuCategoryID") ON DELETE CASCADE;
    `))
    .then(() => knex.raw(`
      DELETE FROM "Meal" 
        WHERE "MenuCategoryID" not in (SELECT "MenuCategoryID" FROM "MenuCategory");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "Meal" 
        ALTER COLUMN  "MenuCategoryID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "Meal" 
        ADD CONSTRAINT "FKMeal" FOREIGN KEY ("MenuCategoryID") 
        REFERENCES "MenuCategory" ("MenuCategoryID") ON DELETE CASCADE;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "Meal" 
        ADD PRIMARY KEY ("MealID");
    `))
    .then(() => knex.raw(`
      DELETE FROM "MealExtra" 
        WHERE "MealID" not in (SELECT "MealID" FROM "Meal");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MealExtra" 
        ALTER COLUMN  "MealID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MealExtra" 
        ADD CONSTRAINT "FKMealExtra" FOREIGN KEY ("MealID") 
        REFERENCES "Meal" ("MealID") ON DELETE CASCADE;
    
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MealImage" 
        RENAME "mealid" TO "MealID";
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MealImage" 
        ALTER COLUMN "MealID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      DELETE FROM "MealImage" 
        WHERE "MealID" not in (SELECT "MealID" FROM "Meal");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MealImage" 
        ADD CONSTRAINT "FKMealImage" FOREIGN KEY ("MealID") 
        REFERENCES "Meal" ("MealID") ON DELETE CASCADE;
    `))
    .then(() => knex.raw(`
      DELETE FROM "MealTranslation" 
        WHERE "MealID" not in (SELECT "MealID" FROM "Meal");
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MealTranslation" 
        ALTER COLUMN  "MealID" Type BIGINT;
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MealTranslation" 
        ADD CONSTRAINT "FKMealTranslation" FOREIGN KEY ("MealID") 
        REFERENCES "Meal" ("MealID") ON DELETE CASCADE;
    `))
    ;

};

exports.down = function (knex, Promise) {

};
