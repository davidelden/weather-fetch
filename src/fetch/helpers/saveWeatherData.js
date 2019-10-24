const db = require('../../db/connection.js'),
      writeStream = require('../../streams/actions/writeStream.js'),
      eventMessages = require('../../streams/events/eventMessages.js'),
      streamName = 'WeatherFetch';

const saveWeatherData = (dbTbl, zipCode, data) => {
  db(dbTbl)
    .where({ zip_code: zipCode })
    .update({ data: data, updated_at: db.fn.now() })
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
