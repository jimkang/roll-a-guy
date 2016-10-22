var d3 = require('d3-selection');
var seedRandom = require('seedrandom');
var createProbable = require('probable').createProbable;
var createDiceCup = require('dicecup');
var cloneDeep = require('lodash.clonedeep');
var accessor = require('accessor');
var abilityScoreBonuses = require('./ability-score-bonuses');
var makeName = require('./make-name');

var probable;
var dicecup;
var getId = accessor();

var sheet = {};

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
  sheet.name = makeName();
  sheet.race = probable.pickFromArray([
    'Dwarf',
    'Elf',
    'Gnome',
    'Half-Elf',
    'Halfling',
    'Human'
  ]);
  sheet.rolls = rollStats();
  var moddedStats = getModdedStats({rolls: sheet.rolls, race: sheet.race});

  d3.select('#race').text(sheet.race);
  d3.select('#name').text(sheet.name);

  renderStats(moddedStats);
}

function renderStats(rolls) {
  var abilityTable = d3.select('#ability-scores');
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
  updateStatRows.selectAll('.ability-bonus-column').data(rolls.map(addBonus), getId)
    .text(accessor('bonus'));
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
  return stats;
}

function getModdedStats({rolls, race}) {
  var modded = cloneDeep(rolls);

  switch (race) {
  case 'Dwarf':
    modded[2].score += 1; // CON
    modded[5].score -= 1; // CHA
    break;
  case 'Elf':
    modded[1].score += 1; // DEX
    modded[2].score -= 1; // CON
    break;
  case 'Gnome':
    modded[3].score += 1; // INT
    modded[4].score -= 1; // WIS
    break;
  case 'Halfling':
    modded[1].score += 1; // DEX
    modded[0].score -= 1; // STR
    break;
  }

  return modded;
}

function addBonus(stat) {
  var withBonus = cloneDeep(stat);
  withBonus.bonus = abilityScoreBonuses[stat.id][stat.score];
  return withBonus;
}
