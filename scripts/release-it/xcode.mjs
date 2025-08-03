import fs from 'fs';
import { Plugin } from 'release-it';

class XCode extends Plugin {
  getLatestVersion() {
    const packageJson = JSON.parse(fs.readFileSync('./package.json'));
    return packageJson.version;
  }

  updateInfoPlist(infoPlistPath, version, buildNumber) {
    let infoPlistFile = fs.readFileSync(infoPlistPath, 'utf8');
    const currentBuildNumber = infoPlistFile.match(/<key>CFBundleVersion<\/key>\n\s+<string>(.*)<\/string>/)?.[1];

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
        /<key>CFBundleShortVersionString<\/key>\n(\s+)<string>.*<\/string>/,
        `<key>CFBundleShortVersionString</key>\n$1<string>${version}</string>`
      )
      .replace(
        /<key>CFBundleVersion<\/key>\n(\s+)<string>.*<\/string>/,
        `<key>CFBundleVersion</key>\n$1<string>${newBuildNumber}</string>`
      );

    fs.writeFileSync(infoPlistPath, infoPlistFile);
  }

  updateProjectPbxproj(xcodeprojPath, version, buildNumber) {
    let xcodeprojFile = fs.readFileSync(xcodeprojPath, 'utf8');
    xcodeprojFile = xcodeprojFile
      .replace(/MARKETING_VERSION = .+;/g, `MARKETING_VERSION = ${version};`)
      .replace(/CURRENT_PROJECT_VERSION = .+;/g, `CURRENT_PROJECT_VERSION = ${buildNumber};`);
    fs.writeFileSync(xcodeprojPath, xcodeprojFile);
  }

  bump(version) {
    this.version = version;
    const today = new Date();
    const year = today.getFullYear().toString().slice(-2);
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const buildNumber = `${year}${month}${day}`;
    this.updateInfoPlist('./macos/Chronos-macOS/Info.plist', version, buildNumber);
    this.updateProjectPbxproj('./macos/Chronos.xcodeproj/project.pbxproj', version, buildNumber);
  }
}

export default XCode;
