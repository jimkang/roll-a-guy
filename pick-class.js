var classesForRace = {
  'Dwarf': [
    'Fighter',
    'Cleric',
    'Thief'
  ],
  'Elf': [
    'Fighter',
    'Ranger',
    'Mage',
    'Thief'
  ],
  'Gnome': [
    'Fighter',
    'Cleric',
    'Thief',
    'Illusionist'
  ],
  'Half-Elf': [
    'Fighter',
    'Ranger',
    'Mage',
    'Cleric',
    'Druid',
    'Thief',
    'Bard'
  ],
  'Halfling': [
    'Fighter',
    'Cleric',
    'Thief'
  ],
  'Human': [
    'Fighter',
    'Paladin',
    'Ranger',
    'Mage',
    'Cleric',
    'Druid',
    'Thief',
    'Bard'
  ]
};

function pickClass({race, stats, probable}) {
  var availableClasses = classesForRace[race];
  availableClasses = availableClasses.filter(classIsValidForStats);
  return probable.pickFromArray(availableClasses);

  function classIsValidForStats(charClass) {
    switch (charClass) {
    case 'Fighter':
      if (stats[0].score < 9) {
        return false;
      }
      break;
    case 'Paladin':
      if (stats[0].score < 12 || stats[2].score < 9 || stats[4].score < 13 || stats[5].score < 17) {
        return false;
      }
      break;
    case 'Ranger':
      if (stats[0].score < 13 || stats[1].score < 13 || stats[2].score < 14 || stats[4].score < 14) {
        return false;
      }
      break;
    case 'Mage':
      if (stats[3].score < 9) {
        return false;
      }
      break;
    case 'Illusionist':
      if (stats[3].score < 9 || stats[1].score < 16) {
        return false;
      }
      break;
    case 'Cleric':
      if (stats[4].score < 9) {
        return false;
      }    
      break;
    case 'Druid':
      if (stats[4].score < 12 || stats[5].score < 15) {
        return false;
      }    
      break;
    case 'Thief':
      if (stats[1].score < 9) {
        return false;
      }
      break;
    case 'Bard':
      if (stats[1].score < 12 || stats[3].score < 13 || stats[5].score < 15) {
        return false;
      }    
      break;
    }
    
    return true;
  }

}

module.exports = pickClass;
