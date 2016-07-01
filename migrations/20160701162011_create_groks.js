"use strict";
exports.up = function(knex, Promise) {
    return knex.schema.createTable("groks", function(table) {
        table.increments();
        table.integer("user_id");
        table.integer("topic_id");
        table.integer("rating");
        table.text("comment");
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable("groks");
};
