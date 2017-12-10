const client = require("graphql-client")(
  {
    url: "https://demagog.cz/graphql"
  }
);

const getArticlesList = function (callback) {
  client.query(`
      {
        articles {
          slug
          title
        }
      }`
  )
    .then(function (body) {
      callback(null, body.data);
    })
    .catch(function (err) {
      console.error(err.message);
      callback(err, null);
    })
};

const getArticleBySlug = function (slug, callback) {
  client.query(
    `
      {
        article(slug: "${slug}") {
          title
          source {
            transcript
          }
          statements {
            id
            content
          }
        }
      }
    `)
    .then(function (body) {
      callback(null, body.data);
    })
    .catch(function (err) {
      console.error(err.message);
      callback(err, null);
    })
};

exports.articlesList = getArticlesList;
exports.articleBySlug = getArticleBySlug;