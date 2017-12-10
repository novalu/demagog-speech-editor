const express = require('express');
const lodash = require('lodash');
const router = express.Router();

const provider = require('../provider/demagogProvider');

function getStatementKeys(slug, statements) {
  return lodash.map(statements, function(statement, index) {
    statement.id = `${slug}-${index}`;
    return statement
  })
}

router.get('/:slug', function(req, res, next) {
  provider.articleBySlug(req.params.slug, function(err, body) {
    const statements = getStatementKeys(req.params.slug, body.article.statements);
    res.render('editor',
      {
        transcript: body.article.source.transcript,
        statements: statements
      }
    );
  });
});

module.exports = router;