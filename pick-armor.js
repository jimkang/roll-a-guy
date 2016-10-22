// var uniq = require('lodash.uniq');

var allArmors = [
  'Leather armor',
  'Studded leather',
  'Scale mail',
  'Hide armor',
  'Chain mail',
  'Splint mail',
  'Plate mail',
  'Field plate',
  'Full plate'
];

var thiefArmors = [
  'Leather armor',
  'Studded leather',
];

var druidArmors = [
  'Leather armor',
  'Studded leather',
  'Hide armor'
];  

var shields = [
  'Buckler',
  'Medium shield',
  'Kite shield'
];

function pickArmor({characterClass, probable}) {
  var armors = [];
  var hasShield = probable.roll(2) === 0;

  if (['Fighter', 'Paladin', 'Ranger', 'Cleric'].indexOf(characterClass) !== -1) {
    armors.push(probable.pickFromArray(allArmors));
    if (hasShield) {
      armors.push(probable.pickFromArray(shields));
    }
  }
  else if (['Thief', 'Bard'].indexOf(characterClass) !== -1) {
    armors.push(probable.pickFromArray(thiefArmors));
  }
  else if (characterClass === 'Druid') {
    armors.push(probable.pickFromArray(druidArmors));
    if (hasShield) {
      armors.push(probable.pickFromArray(shields));
    }
  }

  return armors;
}

module.exports = pickArmor;
