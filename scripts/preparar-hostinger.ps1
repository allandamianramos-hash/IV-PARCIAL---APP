$ErrorActionPreference = 'Stop'
$rumboRoot = Split-Path -Parent $PSScriptRoot
Push-Location -LiteralPath $rumboRoot
try {
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'La compilación falló. No se preparó la publicación.' }
    & npm.cmd test
    if ($LASTEXITCODE -ne 0) { throw 'Las pruebas fallaron. No se preparó la publicación.' }
    $rumboReleaseJson = & node scripts/prepare-hostinger.mjs
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo preparar el paquete.' }
    $rumboRelease = $rumboReleaseJson | ConvertFrom-Json
    Push-Location -LiteralPath $rumboRelease.directory
    try {
        & npm.cmd install --package-lock-only --ignore-scripts --omit=optional --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) { throw 'No se pudieron fijar las dependencias de producción.' }
    } finally { Pop-Location }
    Compress-Archive -Path (Join-Path $rumboRelease.directory '*') -DestinationPath $rumboRelease.archive
    Write-Output ('Paquete listo: ' + $rumboRelease.archive)
    Write-Output 'Sube este ZIP en la aplicación Node existente de Hostinger mediante Redeploy. Conserva sus variables privadas.'
} finally { Pop-Location }
