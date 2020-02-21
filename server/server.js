const express = require('express');
const path = require('path');
const database = require('./database.js');

const app = express();
app.use(express.json());

function makeQuery(query) {
  return new Promise((resolve, reject) => {
    database.query(query, function(err, result, fields) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

app.listen(process.env.PORT || 5000);
