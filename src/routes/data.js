const express = require('express');
const router = express.Router();

const cors = require('cors');

const storage = require('../../storage/speech-storage');

router.get('/:slug', cors(), function(req, res, next) {
  storage.getSpeechData(req.params.slug, function(err, data) {
    if (!err) {
      console.log(data);
      res.json(data);
    } else {
      res.sendStatus(500);
    }
  });

});

module.exports = router;