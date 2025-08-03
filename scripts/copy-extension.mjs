// @ts-check

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import consola from 'consola';

// Define source and destination directories
const ROOT_DIR = resolve(import.meta.dirname + '/..');
const SOURCE_DIR = resolve(ROOT_DIR, '../chronos-companion/build/safari-mv3-prod');
const DEST_DIR = resolve(ROOT_DIR, './macos/Chronos Companion/Resources');
const MANIFEST_FILE = join(DEST_DIR, 'manifest.json');
const PACKAGE_JSON = resolve(ROOT_DIR, './package.json');

// Function to copy files using rsync
function copyFiles() {
  try {
    execSync(`rsync -a --delete --exclude '_locales/' "${SOURCE_DIR}/" "${DEST_DIR}/"`, { stdio: 'ignore' });
    consola.success('Files copied successfully.');
  } catch (error) {
    if (error instanceof Error) {
      consola.error('Error copying files:', error.message);
    }
    process.exit(1);
  }
}

// Function to update manifest.json
function updateManifest() {
  if (!existsSync(MANIFEST_FILE)) {
    consola.error(`manifest.json not found in ${DEST_DIR}.`);
    process.exit(1);
  }

  if (!existsSync(PACKAGE_JSON)) {
    consola.error('package.json not found.');
    process.exit(1);
  }

  try {
    const packageJson = JSON.parse(readFileSync(PACKAGE_JSON, 'utf8'));
    const manifestJson = JSON.parse(readFileSync(MANIFEST_FILE, 'utf8'));

    // Update manifest.json fields
    manifestJson.name = '__MSG_extension_name__';
    manifestJson.description = '__MSG_extension_description__';
    manifestJson.default_locale = 'en';
    manifestJson.version = packageJson.version;

    // Write updated manifest.json back to file
    writeFileSync(MANIFEST_FILE, JSON.stringify(manifestJson, null, 2), 'utf8');
    consola.success(`Updated manifest.json with translation keys, default_locale and version ${packageJson.version}.`);
  } catch (error) {
    if (error instanceof Error) {
      consola.error('Error updating manifest.json:', error.message);
    }
    process.exit(1);
  }
}

// Main execution
copyFiles();
updateManifest();
consola.success('Extension files copied and manifest.json updated.');
