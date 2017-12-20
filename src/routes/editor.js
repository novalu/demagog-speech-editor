const express = require('express');
const router = express.Router();

const provider = require('../../provider/demagog-provider');
const storage = require('../../storage/speech-storage');
const auth = require("../utils/auth-utils");

router.get('/:slug', auth.middle, function(req, res, next) {
  provider.articleBySlug(req.params.slug, function(err, body) {
    if (!err) {
      storage.getSpeechData(req.params.slug, function(err, data) {
        let text = body.article.source.transcript;
        console.log(text);
        let renderData = {
          slug: req.params.slug,
          title: body.article.title,
          transcript: text,
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

router.post('/save/:slug', auth.middle, function(req, res, next) {
  console.log(req.body.data);
  storage.upsertSpeechData(req.params.slug, req.body.data, function(err, response) {
    if (!err) {
      res.redirect(`/editor/${req.params.slug}?code=s0`)
    } else {
      res.sendStatus(500);
    }
  });
});

router.post('/delete/:slug', auth.middle, function(req, res, next) {
  console.log(req.body.data);
  storage.deleteSpeechData(req.params.slug, req.body.data, function(err, response) {
    if (!err) {
      res.redirect(`/editor/${req.params.slug}?code=d0`)
    } else {
      res.sendStatus(500);
    }
  });
});

module.exports = router;