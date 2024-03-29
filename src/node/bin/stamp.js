#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { viewFile, changeFile } = require('../lib/versionStamper');

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [options]')
  .option('s', {
    alias: 'set',
    describe: 'Provide the new version to set.',
    type: 'string',
  })
  .option('v', {
    alias: 'view-files',
    describe: 'View the current state of all files to stamp. (ignores --set)',
    type: 'boolean',
    default: false,
  })
  .option('d', {
    alias: 'dry-run',
    describe: 'See which files will change, and from what version.',
    type: 'boolean',
    default: false,
  })
  .option('t', {
    alias: 'tag',
    describe: 'Create git tag with current version (ignored if used with --set).',
    type: 'boolean',
    default: false,
  })
  .help('h')
  .alias('h', 'help')
  .argv;

function loadStamps() {
  if (!fs.existsSync('version_stamp.json')) {
    console.error('version_stamp.json is missing');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync('version_stamp.json', 'utf8'));
}

function createGitTag(version) {
  const comment = `Released ${new Date().toISOString().split('T')[0]}`;
  try {
    execSync(`git tag -d ${version}`, { stdio: 'ignore' });
    execSync(`git tag -a ${version} -m "${comment}"`, { stdio: 'inherit' });
    console.log(`Git tag ${version} created.`);
  } catch (error) {
    console.error(`Error creating git tag: ${error}`);
  }
}

// Main logic based on provided arguments
const stamps = loadStamps();
const currentVersion = stamps.version;
console.log(`Current version is ${currentVersion}`);

if (argv.viewFiles) {
  console.log('Viewing files');
  let allGood = true;
  stamps.files.forEach(file => {
    const isFileGood = viewFile(currentVersion, file.path, file.pattern);
    allGood = allGood && isFileGood;
  });
  if (!allGood) {
    console.log(`\n*** One or more files do not match the current version of ${currentVersion}`);
  }
} else if (argv.set) {
  const newVersion = argv.set;
  if (argv.dryRun) {
    console.log('----- DRY RUN -----\n');
  }
  console.log(`Changing to ${newVersion}`);
  stamps.files.forEach(file => {
    changeFile(newVersion, file.path, file.pattern, argv.dryRun);
  });
  if (!argv.dryRun) {
    stamps.version = newVersion;
    fs.writeFileSync('version_stamp.json', JSON.stringify(stamps, null, 4));
    console.log('version_stamp.json updated.');
  }
} else if (argv.tag) {
  createGitTag(currentVersion);
}
