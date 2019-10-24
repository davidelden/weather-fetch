const https = require('https'),
      writeStream = require('../../streams/actions/writeStream.js'),
      eventMessages = require('../../streams/events/eventMessages.js'),
      streamName = 'WeatherFetch';

const fetchFromAPI = endPoint => {
  return new Promise((resolve, reject) => {
    https.get(endPoint, res => {
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
                weatherData = parsedData.data.slice(0,1);

          resolve(...weatherData);

        } catch (err) {
          writeStream(streamName, eventMessages['error'](err.message));
          console.error(err.message);
        }
      })
    })
    .on('error', err => {
      writeStream(streamName, eventMessages['error'](err.message));
      console.error(`https.get received an error: ${err.message}`);
      reject(err);
    });
  });
}

module.exports = fetchFromAPI;
