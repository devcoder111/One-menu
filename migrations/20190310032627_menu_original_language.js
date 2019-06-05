
exports.up = function(knex, Promise) {
  return  knex.raw(`
      CREATE TABLE "MenuOriginalLanguage" (
      "MenuLanguageID" bigint NOT NULL,
      "BranchLanguageID" integer,
      "MenuID" bigint,
      "Date" timestamp with time zone,
      "DateUpdated" timestamp with time zone);
    `)
    .then(() => knex.raw(`
      CREATE SEQUENCE "MenuOriginalLanguage_MenuLanguageID_seq"
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
    `))
    .then(() => knex.raw(`
      ALTER TABLE ONLY "MenuOriginalLanguage" ALTER COLUMN "MenuLanguageID" SET DEFAULT nextval('"MenuOriginalLanguage_MenuLanguageID_seq"'::regclass);
    `))
    .then(() => knex.raw(`
          SELECT pg_catalog.setval('"MenuOriginalLanguage_MenuLanguageID_seq"', 1, true);
    `)).then(() => knex.raw(`
      ALTER TABLE ONLY "MenuOriginalLanguage"
        ADD CONSTRAINT "FKMenuTranslation" FOREIGN KEY ("MenuID") 
        REFERENCES "Menu"("MenuID") ON DELETE CASCADE;
    `))
};

exports.down = function(knex, Promise) {
  
};
