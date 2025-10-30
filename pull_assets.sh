#!/bin/bash

# Define variables
ZIP_URL="https://www.dropbox.com/scl/fo/ssb5t8k6kka9xo9s7t5ui/AFV24EQJtQhA4wEr9pWrulE?rlkey=8th2vhwphgi2zr3r3hhvtr5fa&st=aa3gt86w&dl=1"
ZIP_FILE="temp/assets.zip"
TARGET_DIR="temp/assets"
SITE_ASSETS_DIR="public/dist/assets"

echo "=== Fetching assets from Dropbox ==="
# Remove any previous zip file or target directory
if [ -f "$ZIP_FILE" ]; then
  echo "Removing old $ZIP_FILE..."
  rm "$ZIP_FILE"
fi

# Download from Dropbox
echo "Downloading $ZIP_FILE..."
wget -q --show-progress -O "$ZIP_FILE" "$ZIP_URL"

# Check if download succeeded
if [ $? -ne 0 ]; then
  echo "Download failed!"
  exit 1
fi
echo "Download complete."

# Remove old assets directory
if [ -d "$TARGET_DIR" ]; then
  echo "Removing old $TARGET_DIR directory..."
  rm -rf "$TARGET_DIR"
fi

# Create fresh temp assets directory
mkdir "$TARGET_DIR"

echo "Unzipping contents..."
unzip -q "$ZIP_FILE" -d "$TARGET_DIR"

echo "Assets ready in '$TARGET_DIR/' - run 'update_assets.sh' to copy to the site assets directory"