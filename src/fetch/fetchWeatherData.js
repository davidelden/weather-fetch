const writeStream = require('../streams/actions/writeStream.js'),
      eventMessages = require('../streams/events/eventMessages.js'),
      db = require('../db/connection.js'),
      streamName = 'WeatherFetch';

const fetchMsgTimeZones = {
  FetchUSEasternWeather: 'us_eastern',
  FetchUSCentralWeather: 'us_central',
  FetchUSMountainWeather: 'us_mountain',
  FetchUSArizonaWeather: 'us_arizona',
  FetchUSPacificWeather: 'us_pacific',
  FetchUSAlaskaWeather: 'us_alaska',
  FetchUSHawaiiWeather: 'us_hawaii'
}

const fetchWeatherData = async msg => {
  // Publish start message to Redis stream
  writeStream(streamName, eventMessages['start']);

  const dbTable = fetchMsgTimeZones[msg],
        zipCodes = await fetchZipCodes(dbTable);

  // Begin fetching weather data
  // Emit success/error message to stream
  console.log('[fetchWeatherData]', zipCodes);

  // Publish end message to Redis stream
  writeStream(streamName, eventMessages['end']);
}

const fetchZipCodes = tbl => (
  db.select('zip_code')
    .from(tbl)
    .then(rows => {
      return rows.map(row => row.zip_code);
    })
    .catch(err => console.error('error:', err))
)

const saveWeatherData = (data, zipCode) => {
  // save fetched weather data into database
}

module.exports = fetchWeatherData;
