const client = require("graphql-client")(
  {
    url: "https://demagog.cz/graphql"
  }
);

const getArticlesList = function (callback) {
  client.query(`
      {
        articles {
          id
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
          source {
            transcript
          }
          statements {
            speaker {
              id
            }
            assessment {
              veracity {
                key
              }
            }
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

// TODO get statement by id

exports.articlesList = getArticlesList;
exports.articleBySlug = getArticleBySlug;