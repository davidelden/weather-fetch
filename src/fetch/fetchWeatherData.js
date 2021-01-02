const fetchFromAPI = require('./helpers/fetchFromAPI.js'),
      weatherAPIEndpoint = require('./helpers/weatherAPIEndpoint.js'),
      saveWeatherData = require('./helpers/saveWeatherData.js'),
      writeStream = require('../streams/actions/writeStream.js'),
      eventMessages = require('../streams/events/eventMessages.js'),
      streamName = 'WeatherFetch';

const fetchWeatherData = async msg => {
  if(!Array.isArray(msg) || msg[0] !== 'WeatherZipCode') return;

  writeStream(streamName, eventMessages['start']);

  const zipCode = msg[1],
        forecastEndPoint = weatherAPIEndpoint('forecast/daily', zipCode),
        currentTempEndPoint = weatherAPIEndpoint('current', zipCode),
        dbTbl = 'weather_data';

  fetchFromAPI(forecastEndPoint)
    // delay call to subsequent #fetchFromAPI to avoid
    // 503 response from Weatherbit API
    .then(response => new Promise(resolve => setTimeout(() => resolve(response), 2000)))
    .then(forecastData => {
      return (
        fetchFromAPI(currentTempEndPoint)
          .then(currentTempData => {
            const { temp, state_code, city_name } = currentTempData;

            forecastData.current_temp = temp;
            forecastData.state_code = state_code;
            forecastData.city_name = city_name;

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

  writeStream(streamName, eventMessages['end']);
}

module.exports = fetchWeatherData;
