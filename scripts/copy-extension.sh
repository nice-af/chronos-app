#!/bin/zsh

# Define source and destination directories
SOURCE_DIR="../chronos-companion/build/safari-mv3-prod"
DEST_DIR="macos/Chronos Companion/Resources"

# Copy files from source to destination, excluding _locales folder
rsync -av --delete --exclude '_locales/' "$SOURCE_DIR/" "$DEST_DIR/"

# Adjust manifest.json
MANIFEST_FILE="$DEST_DIR/manifest.json"
if [ -f "$MANIFEST_FILE" ]; then
  # Use jq to update name, description, and add default_locale
  jq '.name = "__MSG_extension_name__" | .description = "__MSG_extension_description__" | .default_locale = "en"' \
    "$MANIFEST_FILE" > "$MANIFEST_FILE.tmp" && mv "$MANIFEST_FILE.tmp" "$MANIFEST_FILE"

  echo "Updated manifest.json with translation keys and default_locale."
else
  echo "manifest.json not found in $DEST_DIR."
fi

# Print completion message
echo "Extension files copied and manifest.json updated."
