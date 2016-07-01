"use strict";
exports.up = function(knex, Promise) {
    return knex.schema.createTable("groups", function(table) {
        table.increments();
        table.string("title");
        table.string("description");
        table.boolean("leader_editable_only");
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("groups");
};
