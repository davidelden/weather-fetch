const util = require('util'),
      db = require('../../db/connection.js'),
      writeStream = require('../../streams/actions/writeStream.js'),
      eventMessages = require('../../streams/events/eventMessages.js'),
      streamName = 'WeatherFetch';

const saveWeatherData = async (dbTbl, zipCode, data) => {
  const insert = db(dbTbl)
    .insert({ zip_code: zipCode, data: JSON.stringify(data) })
    .toString()

  const update = db(dbTbl)
    .update({ data: JSON.stringify(data), updated_at: db.fn.now() })
    .whereRaw(`${dbTbl}.zip_code = ?`, [zipCode])

  const query = util.format(
    '%s ON CONFLICT (zip_code) DO UPDATE SET %s',
    insert.toString(),
    update.toString().replace(/^update\s.*\sset\s/i, '')
  )

  db.raw(query)
    .then(() => {
      writeStream(streamName, eventMessages['data'](zipCode));
      console.log(`${dbTbl} updated with ${zipCode} weather data`);
    })
    .catch(err => {
      writeStream(streamName, eventMessages['error'](err));
      console.error('error:', err);
    })
}

module.exports = saveWeatherData;
