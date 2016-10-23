var tracery = require('tracery-grammar');
var grammarSpec = require('./trendyname.json');
var grammar = tracery.createGrammar(grammarSpec);

function makeName(random) {
  tracery.setRandom(random);
  return grammar.flatten('#origin#');
}

module.exports = makeName;
