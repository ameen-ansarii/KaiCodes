param(
    [string]$Message = "Update"
)

Write-Host "Publishing OTA update..." -ForegroundColor Cyan
npx eas-cli update --branch preview --message $Message
Write-Host "Done! Users will get the update on next app open." -ForegroundColor Green
