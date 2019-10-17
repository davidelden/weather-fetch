const redis = require('redis'),
      client = redis.createClient({ host: 'redis' });

const readStream = (streamName, elemId = '$', timeout = '0') => {
  let newId = elemId;

  client.xread(['BLOCK', timeout, 'STREAMS', streamName, elemId], (err, stream) => {
    if (err) return console.error('Error reading from stream:', err);

    if(stream) {
      newId = stream[0][1][0][0];
      let streamArr = [ ...stream[0][1][0][1] ],
          msgIndex = streamArr.indexOf('message') + 1,
          msg = streamArr[msgIndex];

      console.log('Stream Message:', msg);
    }

    // Read CronJob Service emitted messages
    // Do something when an actionable streamMessage is read
    //
    // ex:
    //
    // if(streamMessage === 'FetchUSEasternWeather') => messageEmitter.emit('beginUSEasternFetch');
    //
    // messageEmitter.on('beginUSEasternFetch', () => {
    //
    //    Do something on actionable messages (i.e. message: FetchUSEasternWeather)
    //      • Emit start message to stream
    //      • Begin fetching weather data
    //      • Emit success/error message to stream
    //      • Emit end message to stream
    // })

    readStream(streamName, newId);
  });
}

module.exports = readStream;
