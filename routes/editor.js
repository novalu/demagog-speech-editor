const express = require('express');
const router = express.Router();

const lodash = require('lodash');

const provider = require('../provider/demagog-provider');
const storage = require('../storage/speech-storage');

router.get('/:slug', function(req, res, next) {
  provider.articleBySlug(req.params.slug, function(err, body) {
    if (!err) {
      storage.getSpeechData(req.params.slug, function(err, data) {
        let renderData = {
          slug: req.params.slug,
          title: body.article.title,
          transcript: body.article.source.transcript,
          statements: body.article.statements,
          code: req.query.code
        };
        if (!err) {
          renderData.data = data;
        } else {
          console.log("There is no speech data for this slug, opening editor with no data")
        }
        res.render('editor', renderData);
      });
    }
  });
});

router.post('/:slug', function(req, res, next) {
  console.log(req.body.data);
  storage.upsertSpeechData(req.params.slug, req.body.data, function(err, response) {
    if (!err) {
      res.redirect(`/editor/${req.params.slug}?code=0`)
    } else {
      res.sendStatus(500);
    }
  });
});

module.exports = router;