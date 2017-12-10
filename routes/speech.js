const express = require('express');
const router = express.Router();

const parser = require('../parser/demagogParser');
const tokenFactory = require('../model/tokenFactory');

router.get('/', function(req, res, next) {
  // TODO get all articles
  //res.render('index', { title: 'Express' });
});

router.get('/:slug', function(req, res, next) {
  parser.getTokenParagraphs(req.param.slug, function(err, paragraphs) {
    if (req.query.json) {
      res.json(paragraphs)
    } else {
      res.render('speech', { paragraphs: paragraphs, tokenFactory: tokenFactory });
    }
  });
});

module.exports = router;