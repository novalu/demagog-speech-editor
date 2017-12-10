const express = require('express');
const router = express.Router();

const provider = require("../provider/demagog-provider");

router.get('/', function(req, res, next) {
  provider.articlesList(function(err, data) {
    console.log(data);
    if (!err) {
      res.render('index', { articles: data.articles });
    } else {
      res.sendStatus(500)
    }
  });
});

module.exports = router;
