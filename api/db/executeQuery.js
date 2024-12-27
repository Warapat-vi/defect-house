const db = require('../config/db');
const _ = require('lodash');


const executeQuery = (query, params) => {
    console.log('executeQuery', {query, params})
    if(_.isEmpty(params)){
        params = null;
    }
    return new Promise((resolve, reject) => {
      db.query(query, params, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });
    });
  };

module.exports = {
    executeQuery
}