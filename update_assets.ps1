# Define variables
$srcDir = "temp/assets"
$siteAssetsDir = "public/dist/assets"

# Ensure destination directories exist
if (-not (Test-Path "$siteAssetsDir/images")) {
    New-Item -ItemType Directory -Path "$siteAssetsDir/images" -Force | Out-Null
}
if (-not (Test-Path "$siteAssetsDir/videos")) {
    New-Item -ItemType Directory -Path "$siteAssetsDir/videos" -Force | Out-Null
}

# Copy all files from the "/images" and "/videos" directories into the site assets directory, overwriting any existing files:
if (Test-Path "$srcDir/images") {
    Copy-Item -Path "$srcDir/images/*" -Destination "$siteAssetsDir/images/" -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path "$srcDir/videos") {
    Copy-Item -Path "$srcDir/videos/*" -Destination "$siteAssetsDir/videos/" -Recurse -Force -ErrorAction SilentlyContinue
}

Write-Host "Assets copied from '$srcDir\' to '$siteAssetsDir\'"
