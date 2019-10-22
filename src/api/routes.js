const express = require('express'),
      db = require('../db/connection.js'),
      router = express.Router();

router.get('/api/v1/weather-data/:zip_code', (req, res) => {
  db.select('data')
    .from('weather_data')
    .where({ zip_code: req.params.zip_code })
    .then(data => res.json(data))
    .catch(err => {
      console.error(err);
      res.sendStatus(500);
    })
});

module.exports = router;
