const passport = require('passport');
const Strategy = require('passport-http').BasicStrategy;

exports.init = function() {
  passport.use(new Strategy(
    {
      realm: "Demagog.cz speech editor"
    },
    function (username, password, cb) {
      const isCorrectCredentials = username === process.env.EDITOR_USERNAME && password === process.env.EDITOR_PASSWORD;
      if (isCorrectCredentials) {
        console.log("granted");
        return cb(null, {username: username});
      } else {
        console.log("denied");
        return cb('denied');
      }
    }));
};

exports.middle = passport.authenticate('basic', {
    session: false,
});