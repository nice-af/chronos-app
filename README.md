![Chronos app icon with an UI screenshot](.github/repo-header.png)

**Chronos for Jira** is an app to track time spent on Jira issues. It is built with React Native and will soon be available for MacOS and Windows.
The project is still in development, we got an open beta for MacOS though.
You can join the beta by following the instructions [here](https://testflight.apple.com/join/mB7ZA6s5).

## Getting started

To start the project you first have to install the dependencies:

```bash
npm install
npx pod-install ios
npx pod-install macos
```

After that you can start the development server.
This will launch the Metro bundler which creates the JavaScript bundle for the app.

```bash
npm start
```

Once your Metro bundler is running, you can start the app by opening the Xcode project (`Chronos.xcodeproj`) in the `macos` directory and starting the app from within Xcode.
The Xcode project contains two schemes: `Chronos-macOS` for development and `Chronos-macOS-prod` for the production build.


## Debug starting issues

Sometimes the dev environment will not start after updating packages or other external dependencies.
The reason for that is that multiple caches have to be cleared and some of those don't get cleared automatically.
To fix this issue, run the following command:

```bash
npm run clear-cache
```
