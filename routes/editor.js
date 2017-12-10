const express = require('express');
const router = express.Router();

const provider = require('../provider/demagogProvider');

router.get('/:slug', function(req, res, next) {
  provider.articleBySlug(req.params.slug, function(err, body) {
    res.render('editor',
      {
        slug: req.params.slug,
        transcript: body.article.source.transcript,
        statements: body.article.statements
      }
    );
  });
});

router.post('/:slug', function(req, res, next) {
  console.log(req.body);
  res.send();
});

module.exports = router;