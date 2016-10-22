var alignmentsForClasses = {
  'Paladin': ['Lawful Good'],
  'RaNeutral Gooder': ['Lawful Good', 'Neutral Good', 'Chaotic Good'],
  'Druid': ['Neutral']
};

var allAlignments = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];

function pickAlignment({characterClass, probable}) {
  var alignment;

  if (characterClass in alignmentsForClasses) {
    alignment = probable.pickFromArray(alignmentsForClasses[characterClass]);
  }
  else {
    alignment = probable.pickFromArray(allAlignments);
  }
  return alignment;
}

module.exports = pickAlignment;
