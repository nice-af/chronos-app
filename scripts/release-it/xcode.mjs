import fs from 'fs';
import { Plugin } from 'release-it';

class XCode extends Plugin {
  getLatestVersion() {
    const packageJson = JSON.parse(fs.readFileSync('./package.json'));
    return packageJson.version;
  }

  updateInfoPlist(infoPlistPath, version, buildNumber) {
    let infoPlistFile = fs.readFileSync(infoPlistPath, 'utf8');
    const currentBuildNumber = infoPlistFile.match(/<key>CFBundleVersion<\/key>\n\t<string>(.*)<\/string>/)?.[1];

    let newBuildNumber = buildNumber;
    if (currentBuildNumber === buildNumber) {
      newBuildNumber = `${buildNumber}.1`;
    } else if (currentBuildNumber?.startsWith(buildNumber)) {
      const suffix = currentBuildNumber.slice(buildNumber.length);
      const suffixNumber = parseInt(suffix);
      newBuildNumber = `${buildNumber}.${suffixNumber + 1}`;
    }

    infoPlistFile = infoPlistFile
      .replace(
        /<key>CFBundleShortVersionString<\/key>\n\t<string>.*<\/string>/,
        `<key>CFBundleShortVersionString</key>\n\t<string>${version}</string>`
      )
      .replace(
        /<key>CFBundleVersion<\/key>\n\t<string>.*<\/string>/,
        `<key>CFBundleVersion</key>\n\t<string>${newBuildNumber}</string>`
      );

    fs.writeFileSync(infoPlistPath, infoPlistFile);
  }

  updateProjectPbxproj(xcodeprojPath, targetName, version, buildNumber) {
    let xcodeprojFile = fs.readFileSync(xcodeprojPath, 'utf8');

    const targetRegex = new RegExp(`\b${targetName}\b[\s\S]*?buildSettings = \{([\s\S]*?)\};`, 'g');
    xcodeprojFile = xcodeprojFile.replace(targetRegex, (match, buildSettings) => {
      const updatedBuildSettings = buildSettings
        .replace(/MARKETING_VERSION = [0-9]+\.[0-9]+\.[0-9]+;/, `MARKETING_VERSION = ${version};`)
        .replace(/CURRENT_PROJECT_VERSION = [0-9]+;/, `CURRENT_PROJECT_VERSION = ${buildNumber};`);
      return match.replace(buildSettings, updatedBuildSettings);
    });

    fs.writeFileSync(xcodeprojPath, xcodeprojFile);
  }

  bump(version) {
    this.version = version;
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const buildNumber = `${year}${month}${day}`;

    const targets = [
      {
        name: 'Chronos-macOS',
        infoPlistPath: './macos/Chronos-macOS/Info.plist',
      },
      {
        name: 'Chronos Companion',
        xcodeprojTarget: 'Chronos Companion',
      },
      {
        name: 'ChronosWidget4WeeksOverview',
        xcodeprojTarget: 'ChronosWidget4WeeksOverview',
      },
    ];

    targets.forEach(target => {
      if (target.infoPlistPath) {
        this.updateInfoPlist(target.infoPlistPath, version, buildNumber);
      } else if (target.xcodeprojTarget) {
        this.updateProjectPbxproj(
          './macos/Chronos.xcodeproj/project.pbxproj',
          target.xcodeprojTarget,
          version,
          buildNumber
        );
      }
    });
  }
}

export default XCode;
