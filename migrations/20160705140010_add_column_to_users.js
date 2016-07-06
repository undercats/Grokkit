"use strict";
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.string('user_image');
  });
};;

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function (table) {
    table.dropColumn('user_image');
  });
};
