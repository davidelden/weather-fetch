const dataMessage = zipCode => (
  ['message', 'WeatherFetchDataAvailable', 'zipcode', zipCode]
);

const errorMessage = errMsg => (
  ['message', 'WeatherFetchError', 'error', errMsg]
);

const eventMessages = {
  start: ['message', 'WeatherFetchStart'],
  end: ['message', 'WeatherFetchEnd'],
  data: dataMessage,
  error: errorMessage
}

module.exports = eventMessages;
