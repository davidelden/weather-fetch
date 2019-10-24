const db = require('../../db/connection.js');

const fetchZipCodes = tbl => (
  db.select('zip_code')
    .from(tbl)
    .then(rows => {
      return rows.map(row => row.zip_code);
    })
    .catch(err => console.error('error:', err))
)

module.exports = fetchZipCodes;
