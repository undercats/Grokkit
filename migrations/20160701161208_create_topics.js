"use strict";
exports.up = function(knex, Promise) {
    return knex.schema.createTable("topics", function(table) {
        table.increments();
        table.integer("group_id");
        table.string("title");
        table.string("description");
        table.boolean("is_old");
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("topics");
};
