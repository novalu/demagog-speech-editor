const express = require('express');
const router = express.Router();
const lodash = require('lodash');

const provider = require("../../provider/demagog-provider");
const auth = require("../utils/auth-utils");

router.get('/', auth.middle, function(req, res, next) {
  provider.articlesList(function(err, data) {
    if (!err) {
      // TODO filter only allowed articles
      res.render('index', { articles: data.articles });
    } else {
      res.sendStatus(500)
    }
  });
});

module.exports = router;
