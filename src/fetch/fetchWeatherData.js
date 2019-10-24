const fetchFromAPI = require('./helpers/fetchFromAPI.js'),
      fetchZipCodes = require('./helpers/fetchZipCodes.js'),
      weatherAPIEndpoint = require('./helpers/weatherAPIEndpoint.js'),
      saveWeatherData = require('./helpers/saveWeatherData.js'),
      writeStream = require('../streams/actions/writeStream.js'),
      eventMessages = require('../streams/events/eventMessages.js'),
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
  if(!fetchMsgTimeZones[msg]) return;
  // Publish start message to Redis stream
  writeStream(streamName, eventMessages['start']);

  const dbTbl = fetchMsgTimeZones[msg],
        zipCodes = await fetchZipCodes(dbTbl);

  zipCodes.forEach(zipCode => {
    const forecastEndPoint = weatherAPIEndpoint('forecast/daily', zipCode),
          currentTempEndPoint = weatherAPIEndpoint('current', zipCode);

    fetchFromAPI(forecastEndPoint)
      .then(forecastData => {
        return (
          fetchFromAPI(currentTempEndPoint)
            .then(currentTempData => {
              forecastData['current_temp'] = currentTempData['temp'];
              return forecastData;
            })
           .catch(err => console.error(err))
        )
      })
      .then(data => saveWeatherData(dbTbl, zipCode, data))
      .catch(err => {
        writeStream(streamName, eventMessages['error'](err));
        console.log(err);
      });
  });

  // Publish end message to Redis stream
  writeStream(streamName, eventMessages['end']);
}

module.exports = fetchWeatherData;
