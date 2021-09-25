#!/usr/bin/node

/* global process */

var makeName = require('../make-name');

var numberOfNames = 10;
if (process.argv.length > 2) {
  numberOfNames = +process.argv[2];
}

for (var i = 0; i < numberOfNames; ++i) {
  console.log(makeName(Math.random));
}
