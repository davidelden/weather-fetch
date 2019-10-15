const redis = require('redis'),
      client = redis.createClient({ host: 'redis' });

const writeStream = (streamName, msgArr) => {
  client.xadd([streamName, '*', ...msgArr], (err, res) => {
    if(err) {
      console.error('Error:', err);
    }
    console.log('Res:', res);
  });
}

module.exports = writeStream;
