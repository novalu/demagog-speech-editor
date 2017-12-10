const TOKEN_HEADING = 1;
const TOKEN_TEXT = 2;
const TOKEN_STATEMENT = 3;

exports.TOKEN_HEADING = TOKEN_HEADING;
exports.TOKEN_TEXT = TOKEN_TEXT;
exports.TOKEN_STATEMENT = TOKEN_STATEMENT;

exports.STATEMENT_VERACITY_TRUE = 1;
exports.STATEMENT_VERACITY_UNTRUE = 2;
exports.STATEMENT_VERACITY_MISLEADING = 3;
exports.STATEMENT_VERACITY_UNVERIFIABLE = 4;

exports.createHeadingToken = function (text) {
  return {
    type: TOKEN_HEADING,
    text: text
  }
};

exports.createTextToken = function (text) {
  return {
    type: TOKEN_TEXT,
    text: text
  }
};

exports.createStatementToken = function (text, veracity) {
  return {
    type: TOKEN_STATEMENT,
    veracity: veracity,
    text: text
  }
};