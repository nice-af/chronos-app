#
# This script is used to fix the repo when the build is broken (e.g. after an update)
#

# Clean XCode cache
rm -rf ~/Library/Caches/CocoaPods
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Clean root folder
rm -rf node_modules package-lock.json Pods Podfile.lock Gemfile.lock

# Clean macos folder
cd macos
rm -rf ./build Podfile.lock
pod deintegrate
pod cache clean --all
pod setup
cd ..

# Install node modules
npm i

# Install gems
bundle install

# Install pods
npm run pod-install:macos

watchman shutdown-server
watchman watch-del-all
npm start --reset-cache
