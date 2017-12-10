const provider = require("../provider/demagogProvider");
const tokenFactory = require("../model/tokenFactory");

function splitIntoTokenParagraphs(text) {
  //console.log(text)
  const paragraphs = [
    [
      tokenFactory.createHeadingToken("Proč byste měl být prezidentem České republiky právě vy? Co nabízíte jiného oproti ostatním kandidátům?"),
      tokenFactory.createTextToken("Já jsem do politiky vstupoval, protože jsem se rozhodoval mezi tím, jestli chci být aktivním hráčem v této zemi, nebo se zatáhnout do sebe a jenom se vézt."),
      tokenFactory.createStatementToken("A to byl i důvod, proč jsem se rozhodl přijmout kandidaturu na prezidenta České republiky.", tokenFactory.STATEMENT_VERACITY_TRUE),
      tokenFactory.createTextToken("A jsem přesvědčen o tom, při vší pokoře k této funkci, že mám vlastnosti, které by prezident ČR měl splňovat.")
    ], [
      tokenFactory.createHeadingToken("Proč byste měl být prezidentem České republiky právě vy? Co nabízíte jiného oproti ostatním kandidátům?"),
      tokenFactory.createTextToken("Já jsem do politiky vstupoval, protože jsem se rozhodoval mezi tím, jestli chci být aktivním hráčem v této zemi, nebo se zatáhnout do sebe a jenom se vézt."),
      tokenFactory.createStatementToken("A to byl i důvod, proč jsem se rozhodl přijmout kandidaturu na prezidenta České republiky.", tokenFactory.STATEMENT_VERACITY_TRUE),
      tokenFactory.createTextToken("A jsem přesvědčen o tom, při vší pokoře k této funkci, že mám vlastnosti, které by prezident ČR měl splňovat.")
    ]
  ];
  return paragraphs;
}

exports.getTokenParagraphs = function(slug, callback) {
  provider.articleBySlug(slug, function(err, body) {
    if (!err) {
      //console.log(JSON.stringify(body));
      const tokens = splitIntoTokenParagraphs(body.article.source.transcript);
      callback(null, tokens)
    } else {
      callback(err)
    }
  });
};