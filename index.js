require('dotenv').config();

const migrateLatest = require('./src/db/migrateLatest.js'),
      readStream = require('./src/streams/actions/readStream.js'),
      msgEmitter = require('./src/emitter/msgEmitter'),
      fetchWeatherData = require('./src/fetch/fetchWeatherData'),
      streamName = 'StartWeatherFetch';

migrateLatest();
readStream(streamName);
msgEmitter.on('streamMessage', msg => fetchWeatherData(msg));
