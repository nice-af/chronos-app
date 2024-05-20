import { Plugin } from 'release-it';
import fs from 'fs';
import packageJson from '../../package.json' with { type: 'json' };

class XCode extends Plugin {
  getLatestVersion() {
    return packageJson.version;
  }
  bump(version) {
    this.version = version;
    // Get todays date in the format YYMMDD as the build number
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const buildNumber = `${year}${month}${day}`;

    // Get CFBundleVersion from the Info.plist file
    let infoPlistFile = fs.readFileSync('./macos/JiraTimeTracker-macOS/Info.plist', 'utf8');
    const currentBuildNumber = infoPlistFile.match(/<key>CFBundleVersion<\/key>\n\t<string>(.*)<\/string>/)?.[1];

    // The buildNumber should be in the format YYMMDD.
    // If there already is a build number for today, we add a "-1" to it
    // If there already is a build number with a suffix, we increment the number
    let newBuildNumber = buildNumber;
    if (currentBuildNumber === buildNumber) {
      newBuildNumber = `${buildNumber}-1`;
    } else if (currentBuildNumber?.startsWith(buildNumber)) {
      const suffix = currentBuildNumber.slice(buildNumber.length);
      const suffixNumber = parseInt(suffix);
      newBuildNumber = `${buildNumber}-${suffixNumber + 1}`;
    }

    // Update the CFBundleShortVersionString and CFBundleVersion in the Info.plist file
    infoPlistFile = infoPlistFile
      .replace(
        /<key>CFBundleShortVersionString<\/key>\n\t<string>.*<\/string>/,
        `<key>CFBundleShortVersionString</key>\n\t<string>${version}</string>`
      )
      .replace(
        /<key>CFBundleVersion<\/key>\n\t<string>.*<\/string>/,
        `<key>CFBundleVersion</key>\n\t<string>${newBuildNumber}</string>`
      );
    fs.writeFileSync('./macos/JiraTimeTracker-macOS/Info.plist', infoPlistFile);

    // Update the MARKETING_VERSION and CURRENT_PROJECT_VERSION in the xcodeproj file
    let xcodeprojFile = fs.readFileSync('./macos/JiraTimeTracker.xcodeproj/project.pbxproj', 'utf8');
    xcodeprojFile = xcodeprojFile
      .replace(/MARKETING_VERSION = [0-9]+\.[0-9]+\.[0-9]+;/g, `MARKETING_VERSION = "${version}";`)
      .replace(/CURRENT_PROJECT_VERSION = .*;/g, `CURRENT_PROJECT_VERSION = ${newBuildNumber};`);
    fs.writeFileSync('./macos/JiraTimeTracker.xcodeproj/project.pbxproj', xcodeprojFile);
  }
}

export default XCode;
