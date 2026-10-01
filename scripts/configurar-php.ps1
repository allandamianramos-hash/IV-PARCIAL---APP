. "$PSScriptRoot\php-runtime.ps1"
$rumboRuntime = Join-Path $rumboRoot '.runtime'
New-Item -ItemType Directory -Path $rumboRuntime -Force | Out-Null
if (-not (Test-Path -LiteralPath $rumboDll)) {
    $rumboZip = Join-Path $rumboRuntime 'sqlsrv-5.12.zip'
    Invoke-WebRequest -UseBasicParsing -Uri 'https://github.com/microsoft/msphpsql/releases/download/v5.12.0/Windows_5.12.0RTW.zip' -OutFile $rumboZip
    if ((Get-FileHash -LiteralPath $rumboZip -Algorithm SHA256).Hash -ne '48C2067C8FC4683418D3096807AF92A65660245BE846A61BB65F93D28272FF71') { throw 'La descarga no coincide con el controlador verificado.' }
    Expand-Archive -LiteralPath $rumboZip -DestinationPath (Join-Path $rumboRuntime 'sqlsrv-5.12') -Force
}
Assert-RumboDriver
if (-not (Test-Path -LiteralPath (Join-Path $rumboRoot '.env'))) {
    Copy-Item -LiteralPath (Join-Path $rumboRoot '.env.example') -Destination (Join-Path $rumboRoot '.env')
    Write-Output 'Se creo .env. Revisa DB_SERVER si usas SQLEXPRESS.'
}
& $rumboPhp -d "extension=$rumboDll" (Join-Path $rumboRoot 'backend\php\install.php')
if ($LASTEXITCODE -ne 0) { throw 'SQL Server no se pudo preparar. Revisa docs/SQL-SERVER-PHP.md.' }
& $rumboPhp -d "extension=$rumboDll" (Join-Path $rumboRoot 'backend\php\install.php') check
if ($LASTEXITCODE -ne 0) { throw 'La comprobacion SQL fallo.' }
Write-Output 'Listo. Ejecuta INICIAR-RUMBO.cmd.'
