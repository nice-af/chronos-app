# JiraTimeTracker App

## Debug starting issues

Sometimes the dev environment will not start after updating packages or other changes.
A good try to fix this is to do a hard clean install and build using this command:

```bash
cd ios && rm -rf ~/Library/Caches/CocoaPods && rm -rf Pods && rm -rf ~/Library/Developer/Xcode/DerivedData/* && pod deintegrate && pod setup && cd .. && rm -rf node_modules yarn.lock Podfile.lock && yarn && npx pod-install ios && yarn start --reset-cache
```

## WIP Build on MacOS WIP

@see https://github.com/microsoft/react-native-macos/issues/400

To build the app on MacOS, you need follow the steps below.
Keep in mind to revert changes after building to keep the app in development mode.

1. In XCode klick on "JiraTimeTracker-macOS" in the top toolbar (center). Change all the targets to "Release".
2. Remove the debug line in XCode?
3. Delete JiraTimeTracker.jsbundle and make sure it gets build in prod mode?
4. Run `npm run build:macos`
