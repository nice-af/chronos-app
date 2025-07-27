#!/bin/zsh

echo "Installling CocoaPods..."
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
brew install cocoapods
echo "Installing Node.js..."
brew install node@22
brew link node@22

# Install dependencies
echo "Installing dependencies..."
npm ci
echo "Running pod install..."
cd macos
pod install
