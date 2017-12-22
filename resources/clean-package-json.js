/**
 * Ensure a clean package.json before deploying so other tools do not
 * interpret the built output as requiring any further transformation.
 */

const fs = require('fs');

const package = require('../package.json');

delete package.scripts;
delete package.options;
delete package.devDependencies;
delete package.standard;
delete package.jest;

fs.writeFileSync('./dist/package.json', JSON.stringify(package, null, 2));