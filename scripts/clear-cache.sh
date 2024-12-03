#
# This script is used to fix the repo when the build is broken (e.g. after an update)
#

# Clean XCode cache
rm -rf ~/Library/Caches/CocoaPods
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# Clean root folder
rm -rf node_modules package-lock.json Pods Podfile.lock Gemfile.lock

# Install gems
bundle install

# Clean ios folder
cd ios
rm -rf ./build Podfile.lock
pod deintegrate
pod cache clean --all
pod setup
cd ..

# Clean macos folder
cd macos
rm -rf ./build Podfile.lock
pod deintegrate
pod cache clean --all
pod setup
cd ..

# Reinstall dependencies
npm i
npx pod-install ios
npx pod-install macos
npm start --reset-cache
