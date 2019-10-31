exports.up = function(knex) {
  return knex.schema
    .createTable('weather_data', tbl => {
      tbl.increments('id').primary();
      tbl.string('zip_code').index().unique();
      tbl.jsonb('data');
      tbl.timestamps(true, true);
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
    .dropTable('weather_data')
};
