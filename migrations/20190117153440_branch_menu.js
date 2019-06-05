
exports.up = function (knex, Promise) {

  return knex.raw(`
      ALTER TABLE "BranchMenu" RENAME TO "MenuBranch";
    `)
    .then(() => knex.raw(`
      ALTER TABLE "MenuBranch"
      RENAME CONSTRAINT "FKBranchMenuMenu" TO "FKMenuBranchMenu"
    `))
    .then(() => knex.raw(`
      ALTER TABLE "MenuBranch"
      RENAME CONSTRAINT "FKBranchMenuBranch" TO "FKMenuBranchBranch"
    `))
    
};

exports.down = function (knex, Promise) {

};
