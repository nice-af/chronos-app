#!/bin/zsh

echo "Installling CocoaPods..."
export HOMEBREW_NO_INSTALL_CLEANUP=TRUE
brew install cocoapods

echo "Installing Node.js..."
brew install node@22
echo 'export PATH="/usr/local/opt/node@22/bin:$PATH"' >> ~/.zshrc
export LDFLAGS="-L/usr/local/opt/node@22/lib"
export CPPFLAGS="-I/usr/local/opt/node@22/include"
ln -s $(which node) /usr/local/bin/node

# Install dependencies
echo "Installing dependencies..."
npm ci
echo "Running pod install..."
cd macos
pod install
