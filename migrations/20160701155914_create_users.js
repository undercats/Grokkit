"use strict";
exports.up = function(knex, Promise) {
    return knex.schema.createTable("users", function(table) {
        table.increments();
        table.string("username");
        table.string("email");
        table.string("first_name");
        table.string("last_name");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("users");
};
