#!/bin/zsh

# Define source and destination directories
SOURCE_DIR="../chronos-companion/build/safari-mv3-prod"
DEST_DIR="macos/Chronos Companion/Resources"

# Copy files from source to destination, excluding _locales folder
rsync -av --delete --exclude '_locales/' "$SOURCE_DIR/" "$DEST_DIR/"

# Adjust manifest.json
MANIFEST_FILE="$DEST_DIR/manifest.json"
if [ -f "$MANIFEST_FILE" ]; then
  # Use sed to replace the name and description entries
  sed -i '' 's/"name": ".*"/"name": "__MSG_extension_name__"/' "$MANIFEST_FILE"
  sed -i '' 's/"description": ".*"/"description": "__MSG_extension_description__"/' "$MANIFEST_FILE"
  echo "Updated manifest.json with translation keys."
else
  echo "manifest.json not found in $DEST_DIR."
fi

# Print completion message
echo "Extension files copied and manifest.json updated."
