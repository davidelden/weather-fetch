exports.up = function(knex) {
  return knex.schema
    .createTable('weather_data', tbl => {
      tbl.increments('id').primary();
      tbl.string('zip_code').index().unique();
      tbl.jsonb('data');
      tbl.timestamps(true, true);
    })
    .createTable('us_eastern', tbl => {
      tbl.inherits('weather_data');
      tbl.unique('zip_code');
    })
    .createTable('us_central', tbl => {
      tbl.inherits('weather_data');
      tbl.unique('zip_code');
    })
    .createTable('us_mountain', tbl => {
      tbl.inherits('weather_data');
      tbl.unique('zip_code');
    })
    .createTable('us_arizona', tbl => {
      tbl.inherits('weather_data');
      tbl.unique('zip_code');
    })
    .createTable('us_pacific', tbl => {
      tbl.inherits('weather_data');
      tbl.unique('zip_code');
    })
    .createTable('us_alaska', tbl => {
      tbl.inherits('weather_data');
      tbl.unique('zip_code');
    })
    .createTable('us_hawaii', tbl => {
      tbl.inherits('weather_data');
      tbl.unique('zip_code');
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
