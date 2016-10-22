var d3 = require('d3-selection');
var seedRandom = require('seedrandom');
var createProbable = require('probable').createProbable;
var createDiceCup = require('dicecup');
var pluck = require('lodash.pluck');
var accessor = require('accessor');
var abilityScoreBonuses = require('./ability-score-bonuses');

var probable;
var dicecup;

var getId = accessor();

function identity(x) {
  return x;
}

((function go() {
  var seed = (new Date()).toISOString();

  probable = createProbable({
    random: seedRandom(seed)
  });
  dicecup = createDiceCup({
    probable: probable
  });

  bindEmAll();
})());

function bindEmAll() {
  d3.select('#roll-button').on('click', update);
}

function update() {
  var stats = updateStats();
}

function updateStats() {
  var abilityTable = d3.select('#ability-scores');
  var rolls = rollStats();
  var statRows = abilityTable.selectAll('.row').data(rolls, getId);

  statRows.exit().remove();

  var newStatRows = statRows.enter().append('tr').classed('row', true);
  newStatRows.append('td').classed('ability-name-column', true)
    .text(getId);
  newStatRows.append('td').classed('ability-score-column', true);
  newStatRows.append('td').classed('ability-bonus-column', true);

  var updateStatRows = newStatRows.merge(statRows);
  updateStatRows.selectAll('.ability-score-column').data(rolls, getId)
    .text(accessor('score'));
  updateStatRows.selectAll('.ability-bonus-column').data(rolls, getId)
    .text(accessor('bonus'));

  return rolls;
}

function rollStats() {
  var stats = [
    { id: 'STR', score: dicecup.roll('3d6')[0].total },
    { id: 'DEX', score: dicecup.roll('3d6')[0].total },
    { id: 'CON', score: dicecup.roll('3d6')[0].total },
    { id: 'INT', score: dicecup.roll('3d6')[0].total },
    { id: 'WIS', score: dicecup.roll('3d6')[0].total },
    { id: 'CHA', score: dicecup.roll('3d6')[0].total }
  ];
  stats.forEach(addBonus);
  return stats;
}

function addBonus(stat) {
  stat.bonus = abilityScoreBonuses[stat.id][stat.score];
}
