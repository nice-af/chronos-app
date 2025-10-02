import fs from 'fs';
import { Plugin } from 'release-it';

class XCode extends Plugin {
  getLatestVersion() {
    const packageJson = JSON.parse(fs.readFileSync('./package.json'));
    return packageJson.version;
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
    this.updateProjectPbxproj('./macos/Chronos.xcodeproj/project.pbxproj', version, buildNumber);
  }
}

export default XCode;
