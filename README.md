# JiraTimeTracker App

## WIP Build on MacOS WIP

@see https://github.com/microsoft/react-native-macos/issues/400

To build the app on MacOS, you need follow the steps below.
Keep in mind to revert changes after building to keep the app in development mode.

1. In XCode klick on "JiraTimeTracker-macOS" in the top toolbar (center). Change all the targets to "Release".
2. Remove the debug line in XCode?
3. Delete JiraTimeTracker.jsbundle and make sure it gets build in prod mode?
4. Run `npm run build:macos`
