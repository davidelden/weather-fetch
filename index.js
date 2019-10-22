require('dotenv').config();

const migrateLatest = require('./src/db/migrateLatest.js'),
      readStream = require('./src/streams/actions/readStream.js'),
      msgEmitter = require('./src/emitter/msgEmitter'),
      fetchWeatherData = require('./src/fetch/fetchWeatherData'),
      streamName = 'StartWeatherFetch',
      startServer = require('./src/api/server.js');

migrateLatest();
readStream(streamName);
msgEmitter.on('streamMessage', msg => fetchWeatherData(msg)); // Check if msg is a valid msg
startServer();
