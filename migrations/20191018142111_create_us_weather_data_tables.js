exports.up = function(knex) {
  return knex.schema
    .createTable('us_eastern', tbl => {
      tbl.increments('id').primary();
      tbl.string('zip_code').index().unique();
      tbl.jsonb('data');
      tbl.timestamps();
    })
    .createTable('us_central', tbl => {
      tbl.increments('id').primary();
      tbl.string('zip_code').index().unique();
      tbl.jsonb('data');
      tbl.timestamps();
    })
    .createTable('us_mountain', tbl => {
      tbl.increments('id').primary();
      tbl.string('zip_code').index().unique();
      tbl.jsonb('data');
      tbl.timestamps();
    })
    .createTable('us_arizona', tbl => {
      tbl.increments('id').primary();
      tbl.string('zip_code').index().unique();
      tbl.jsonb('data');
      tbl.timestamps();
    })
    .createTable('us_pacific', tbl => {
      tbl.increments('id').primary();
      tbl.string('zip_code').index().unique();
      tbl.jsonb('data');
      tbl.timestamps();
    })
    .createTable('us_alaska', tbl => {
      tbl.increments('id').primary();
      tbl.string('zip_code').index().unique();
      tbl.jsonb('data');
      tbl.timestamps();
    })
    .createTable('us_hawaii', tbl => {
      tbl.increments('id').primary();
      tbl.string('zip_code').index().unique();
      tbl.jsonb('data');
      tbl.timestamps();
    })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('us_eastern')
    .dropTable('us_central')
    .dropTable('us_mountain')
    .dropTable('us_arizona')
    .dropTable('us_pacific')
    .dropTable('us_alaska')
    .dropTable('us_hawaii')
};
