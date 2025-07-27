#!/bin/zsh

echo "Installling CocoaPods..."
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
brew install cocoapods

echo "Installing Node.js..."
brew install node@22
brew link --force --overwrite node@22
echo "export NODE_BINARY=$(which node)" > ../.xcode.env.local

# Install dependencies
echo "Installing dependencies..."
npm ci
echo "Running pod install..."
cd macos
pod install
