const redis = require('redis'),
      client = redis.createClient({ host: 'redis' }),
      msgEmitter = require('../../emitter/msgEmitter.js');

const readStream = (streamName, elemId = '$', timeout = '0') => {
  let newId = elemId;

  client.xread(['BLOCK', timeout, 'STREAMS', streamName, elemId], (err, stream) => {
    if (err) return console.error('Error reading from stream:', err);

    if(stream) {
      newId = stream[0][1][0][0];
      let streamArr = [ ...stream[0][1][0][1] ],
          msgIndex = streamArr.indexOf('message') + 1,
          zipCodeIndex = streamArr.indexOf('zipcode'),
          msg = streamArr[msgIndex];

      if(zipCodeIndex !== -1) {
        let zipCode = streamArr[zipCodeIndex+1];

        msgEmitter.emit('streamMessage', [msg, zipCode]);
      } else {
        msgEmitter.emit('streamMessage', msg);
      }
    }

    readStream(streamName, newId);
  });
}

module.exports = readStream;
