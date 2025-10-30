# Define variables
$zipUrl = "https://www.dropbox.com/scl/fo/ssb5t8k6kka9xo9s7t5ui/AFV24EQJtQhA4wEr9pWrulE?rlkey=8th2vhwphgi2zr3r3hhvtr5fa&st=aa3gt86w&dl=1"
$zipFile = "temp/assets.zip"
$targetDir = "temp/assets"
$siteAssetsDir = "public/dist/assets"

Write-Host "=== Fetching assets from Dropbox ==="
# Remove old ZIP if it exists
if (Test-Path $zipFile) {
    Write-Host "Removing old $zipFile..."
    Remove-Item $zipFile -Force
}

# Download from Dropbox
Write-Host "Downloading $zipFile..."
Invoke-WebRequest -Uri $zipUrl -OutFile $zipFile -UseBasicParsing

if (-not (Test-Path $zipFile)) {
    Write-Host "Download failed!"
    exit 1
}
Write-Host "Download complete."

# Remove old assets directory
if (Test-Path $targetDir) {
    Write-Host "Removing old $targetDir directory..."
    Remove-Item $targetDir -Recurse -Force
}

# Create fresh target directory
New-Item -ItemType Directory -Path $targetDir | Out-Null

Write-Host "Unzipping contents..."
Expand-Archive -Path $zipFile -DestinationPath $targetDir -Force

Write-Host "Assets ready in '$targetDir\' - run 'update_assets.ps1' to copy to the site assets directory"
