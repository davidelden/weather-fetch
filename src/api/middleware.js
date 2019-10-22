const middleWare = {
  checkAPIKey: (req, res, next) => {
    if(req.query.key && req.query.key === process.env.WEATHER_FETCH_SERVICE_API_KEY) {
      return next();
    }
    res.sendStatus(401);
  }
}



module.exports = middleWare;
