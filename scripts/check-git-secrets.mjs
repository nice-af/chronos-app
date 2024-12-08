// @ts-check

import consola from 'consola';
import { createHash } from 'crypto';
import { existsSync, readFileSync } from 'fs';
import notifier from 'node-notifier';

const MAPPING_FILE = '.gitsecret/paths/mapping.cfg';

/**
 * Gets the file hashes from the mapping file.
 * @returns {Record<string, string>}
 */
function getFileHashes() {
  const content = readFileSync(MAPPING_FILE, 'utf8');
  const lines = content.split('\n').filter(line => line.trim() !== '');
  /** @type {Record<string, string>} */
  const fileHashes = {};

  lines.forEach(line => {
    const [filePath, hash] = line.split(':');
    fileHashes[filePath] = hash;
  });

  return fileHashes;
}

/**
 * @param {string} filePath
 * @returns
 */
function calculateFileHash(filePath) {
  if (!existsSync(filePath)) {
    return null;
  }

  const fileBuffer = readFileSync(filePath);
  const hashSum = createHash('sha256');
  hashSum.update(fileBuffer);

  return hashSum.digest('hex');
}

/**
 *
 * @param {Record<string, string>} fileHashes
 * @returns
 */
function checkForChangedSecrets(fileHashes) {
  const changedFiles = [];

  for (const [filePath, expectedHash] of Object.entries(fileHashes)) {
    const actualHash = calculateFileHash(filePath);
    if (actualHash !== expectedHash) {
      changedFiles.push(filePath);
    }
  }

  return changedFiles;
}

const fileHashes = getFileHashes();
const changedFiles = checkForChangedSecrets(fileHashes);

if (changedFiles.length > 0) {
  consola.warn('Secret files have changed:', changedFiles);
  consola.warn('Please reveal your secrets with `git secret reveal`.');

  // Send a system notification to the user
  notifier.notify({
    title: 'Secret files have changed',
    message: `Changed secret files: ${changedFiles.join(', ')}.\nPlease reveal your secrets.`,
    sound: 'Hero',
    contentImage:
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAWlBMVEUka92ErOzj7PvW4/l2o+pAfuG60fXI2veRte7///9bkOXk7fuDrOzx9v0/fuEydN/j7ftNh+Nomeetx/Jomue70fXV4/mSte53o+pOh+N2o+lpmeefvvCtyPOorMc2AAAB40lEQVR42u3Zy07CYBSFUVQUehQUxbu+/2tKgmRPJKQs09HZo/6U9ltjmPV6vV6v1+v1zt3F5dX8cH19s5hP3V8Ou9Xv4XZ3vZy8v9vd/lDDEMF0/TQrp2n7AYBA+gGAQPoBgED6AYBA+gGAQPoBgED6AYBA+gGAQPoBgED6AYBA+gGAQPoBTCGYDycAowXeDwAE0g8ABNIPAATSDwAE0l+t9/fvH0Ag/c3hG2sQWN8E3jeB903gfRN4nwXed4H3XeB9F3j/kQTer+EJBNAPAATSDwAE0g8ABNIPAATSDwAE0g8ABNIPAATSDwAE0g8ABNIPAATeD8AF23H9AMYJ7mbH9nzkifSPAI4IVsOfexkNmI8CvB4+3wxjAZvVWEEA6Z9823b2z4Ia13/LkyYIwPouKOu7oKzvgrK+C8r6Lijru6Cs74KyvgvK+i4o67vgHfsu2FjfBdAHgfRdoH0XaN8F2neB9l2gfRdo3wXYd0Ht71+f6Ps+zvvL5pWipwUBQF8EAUBfBAFAXwQBQF8EAUBfBAFAXwQBQF8EAUBfBAFAXwQBQF8EAUBfBAFAXwQBQF8EAUBfBAFAXwQBQF8EAUAfBPnV+R36Jlj/Hh7Sn26fi+c6XK+/vmvW6/V6vV6v1ztzP8R2mfleVSa8AAAAAElFTkSuQmCC',
    wait: false,
    timeout: false,
  });
}
