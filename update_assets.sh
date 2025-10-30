#!/bin/bash

# Define variables
SRC_DIR="temp/assets"
SITE_ASSETS_DIR="public/dist/assets"

# Copy all files from the "/images" and "/videos" directories into the site assets directory, overwriting any existing files:
cp -r $SRC_DIR/images/* $SITE_ASSETS_DIR/images/ || true
cp -r $SRC_DIR/videos/* $SITE_ASSETS_DIR/videos/ || true

echo "Assets copied from '$SRC_DIR/' to '$SITE_ASSETS_DIR/'"