// type choices: 'forecast/daily' -or- 'current'
const weatherAPIEndpoint = (type, zipCode) => {
  return process.env.WEATHER_API_BASE_URL + `${type}?postal_code=${zipCode}&country=US&units=I&key=${process.env.WEATHER_API_KEY}`;
}

module.exports = weatherAPIEndpoint;
