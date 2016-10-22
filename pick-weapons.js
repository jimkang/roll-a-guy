var weaponTableDef = require('./weapon-table');
var uniq = require('lodash.uniq');

function pickWeapons({characterClass, probable}) {
  var allowedWeaponsDef = weaponTableDef.filter(weaponIsAllowed);
  var table = probable.createTableFromSizes(allowedWeaponsDef);
  var numberOfWeapons = probable.rollDie(15);
  var weapons = [];

  for (var i = 0; i < numberOfWeapons; ++i) {
    weapons.push(table.roll());
  }
  return uniq(weapons);

  function weaponIsAllowed(weaponDef) {
    return weaponDef[1].classes.indexOf(characterClass) !== -1;
  }
}

module.exports = pickWeapons;
