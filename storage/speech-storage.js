const dbConfig = require('./db-config.js');

let db = dbConfig.createKnex();

exports.getSpeechData = function(slug, callback) {
  db.select('data').from('speechs').where("slug", slug)
    .then(function(rows) {
      if (rows.length > 0) {
        let jsonString = rows[0].data;
        let json = JSON.parse(jsonString);
        callback(null, json)
      } else {
        console.error("Cannot find speech with slug");
        callback(true)
      }
    })
    .catch(function(err) {
      console.error(err);
      callback(true);
    })
};

function insertSpeechData(slug, data, callback) {
  db('speechs').insert({slug: slug, data: JSON.stringify(data)})
    .then(function(res) {
      callback(null, true)
    })
    .catch(function(err) {
      console.error(err);
      callback(err)
    })
}

function updateSpeechData(slug, data, callback) {
  db('speechs').update({data: JSON.stringify(data)}).where({slug: slug})
    .then(function(res) {
      callback(null, true)
    })
    .catch(function(err) {
      console.error(err);
      callback(err)
    })
}

exports.upsertSpeechData = function(slug, data, callback) {
  db.select('data').from('speechs').where("slug", slug)
    .then(function(rows) {
      if (rows.length > 0) {
        updateSpeechData(slug, data, callback)
      } else {
        insertSpeechData(slug, data, callback)
      }
    })
    .catch(function(err) {
      console.error(err);
      callback(err)
    })
};