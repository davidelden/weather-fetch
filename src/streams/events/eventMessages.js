const dataMessage = zipCode => (
  ['message', 'WeatherFetchDataAvailable', 'zipcode', zipCode]
);

const eventMessages = {
  start: ['message', 'WeatherFetchStart'],
  end: ['message', 'WeatherFetchEnd'],
  data: dataMessage,
  error: ['message', 'WeatherFetchError']
}

module.exports = eventMessages;
