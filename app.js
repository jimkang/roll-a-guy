var d3 = require('d3-selection');
var seedRandom = require('seedrandom');
var createProbable = require('probable').createProbable;
var createDiceCup = require('dicecup');
var cloneDeep = require('lodash.clonedeep');
var accessor = require('accessor');
var abilityScoreBonuses = require('./ability-score-bonuses');
var makeName = require('./make-name');
var pickClass = require('./pick-class');
var pickAlignment = require('./pick-alignment');
var pickWeapons = require('./pick-weapons');

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

  d3.select('#roll-button').classed('hidden', false);    
})());

function bindEmAll() {
  d3.select('#level-requested').on('blur', validateLevelRequested);
  d3.select('#roll-button').on('click', update);
}

function update() {
  sheet.name = makeName();

  var requestedRace = d3.select('#race-requested').node().value;
  if (requestedRace == 'Whatevs') {
    sheet.race = probable.pickFromArray([
      'Dwarf',
      'Elf',
      'Gnome',
      'Half-Elf',
      'Halfling',
      'Human'
    ]);
  }
  else {
    sheet.race = requestedRace;
  }

  var requestedLevel = d3.select('#level-requested').node().value;
  if (!isNaN(requestedLevel)) {
    sheet.level = requestedLevel;
  }
  else {
    sheet.level = 1;
  }

  sheet.rolls = rollStats();
  var moddedStats = getModdedStats({rolls: sheet.rolls, race: sheet.race});

  sheet.characterClass = pickClass({
    race: sheet.race,
    stats: moddedStats,
    probable: probable
  });

  sheet.alignment = pickAlignment({
    characterClass: sheet.characterClass,
    probable: probable
  });

  sheet.weapons = pickWeapons({
    characterClass: sheet.characterClass,
    probable: probable    
  });

  renderDemographics();
  renderStats(moddedStats);
  renderWeapons(sheet.weapons);
}

function renderDemographics() {
  d3.select('#name').text(sheet.name);
  d3.select('#race').text(sheet.race);
  d3.select('#class').text(sheet.characterClass);
  d3.select('#level').text(sheet.level);
  d3.select('#alignment').text(sheet.alignment);

  d3.select('#demographics').classed('hidden', false);
}

function renderStats(rolls) {
  var abilityTable = d3.select('#ability-scores table');
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

  d3.select('#ability-scores').classed('hidden', false);    
}

function renderWeapons(weapons) {
  var abilityTable = d3.select('#weapons table');
  var rows = abilityTable.selectAll('.row').data(weapons, accessor('name'));

  rows.exit().remove();

  var newRows = rows.enter().append('tr').classed('row', true);
  newRows.append('td').classed('weapon-quantity', true);
  newRows.append('td').classed('weapon-name', true);
  newRows.append('td').classed('weapon-damage', true);

  var updateRows = newRows.merge(rows);
  updateRows.selectAll('.weapon-quantity').data(weapons, accessor('name'))
    .text(accessor('quantity'));
  updateRows.selectAll('.weapon-name').data(weapons, accessor('name'))
    .text(accessor('name'));
  updateRows.selectAll('.weapon-damage').data(weapons, accessor('name'))
    .text(accessor('damage'));

  d3.select('#weapons').classed('hidden', false);
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

function validateLevelRequested() {
  var value = parseInt(this.value, 10);
  if (isNaN(value) || value < 1) {
    value = 1;
  }
  else if (value > 9) {
    value = 9;
  }
  this.value = value;
  this.textContent = value;
}
