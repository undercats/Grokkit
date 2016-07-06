"use strict";
exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(table){
    table.string('display_name');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(table){
    table.dropColumn('display_name');
  });
};
