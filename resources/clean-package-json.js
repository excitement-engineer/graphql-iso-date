/**
 * Ensure a clean package.json before deploying so other tools do not
 * interpret the built output as requiring any further transformation.
 */

const fs = require('fs')

const packageJson = require('../package.json')

delete packageJson.scripts
delete packageJson.options
delete packageJson.devDependencies
delete packageJson.standard
delete packageJson.jest

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2))
