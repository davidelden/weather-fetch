const https = require('https'),
      writeStream = require('../streams/actions/writeStream.js'),
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

const weatherAPIUrl = (zipCode) => {
  return process.env.WEATHER_API_BASE_URL + `?postal_code=${zipCode}&country=US&units=I&key=${process.env.WEATHER_API_KEY}`;
}

const fetchWeatherData = async msg => {
  // Publish start message to Redis stream
  writeStream(streamName, eventMessages['start']);

  const dbTbl = fetchMsgTimeZones[msg],
        zipCodes = await fetchZipCodes(dbTbl);

  zipCodes.forEach(zipCode => {
    const endPoint = weatherAPIUrl(zipCode);

    fetchFromAPI(endPoint, dbTbl, zipCode);
  });

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

const fetchFromAPI = (url, dbTbl, zipCode) => {
  https.get(url, res => {
    const { statusCode } = res,
          contentType = res.headers['content-type'];

    let error,
        rawData = '';

    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
    }

    if (error) {
      writeStream(streamName, eventMessages['error'](error.message));
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    res.on('data', chunk => rawData += chunk);
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData),
              weatherData = { data: parsedData.data.slice(0,1) };

        saveWeatherData(dbTbl, zipCode, weatherData);
      } catch (err) {
        writeStream(streamName, eventMessages['error'](err.message));
        console.error(err.message);
      }
    });
  })
  .on('error', err => {
    writeStream(streamName, eventMessages['error'](err.message));
    console.error(`https.get received an error: ${err.message}`);
  });
}

const saveWeatherData = (dbTbl, zipCode, data) => {
  db(dbTbl)
    .where({ zip_code: zipCode })
    .update({ data: data })
    .then(() => {
      writeStream(streamName, eventMessages['data'](zipCode));
      console.log(`${dbTbl} updated with ${zipCode} weather data`);
    })
    .catch(err => {
      writeStream(streamName, eventMessages['error'](err));
      console.error('error:', err);
    })
}

module.exports = fetchWeatherData;
