const express = require('express');
const router = express.Router();
const lodash = require('lodash');

const provider = require("../../provider/demagog-provider");
const auth = require("../utils/auth-utils");

router.get('/', auth.middle, function(req, res, next) {
  provider.articlesList(function(err, data) {
    if (!err) {
      const allowedSlugs = [
        "prezidentuv-projev-na-konferenci-hnuti-spd",
        "prezidentske-interview-ct-michal-horacek",
        "prezidentske-interview-ct-jiri-drahos",
        "prezidentske-interview-ct-vratislav-kulhanek",
        "prezidentske-interview-ct-jiri-hynek",
        "prezidentske-interview-ct-petr-hannig",
        "prezidentske-interview-ct-mirek-topolanek",
        "prezidentske-interview-ct-marek-hilser",
        "prezidentske-interview-ct-pavel-fischer"
      ];
      const filteredArticles = lodash.filter(data.articles, function(it) {
        return lodash.indexOf(allowedSlugs, it.slug) !== -1
      });
      res.render('index', { articles: filteredArticles });
    } else {
      res.sendStatus(500)
    }
  });
});

module.exports = router;
