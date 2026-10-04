param([string]$ProjectPath,[switch]$NoOpen)
$ErrorActionPreference = 'Stop'
# Distributed beside the private credential and the verified official Node ZIP.
$rumboPackage = $PSScriptRoot
if (-not $ProjectPath) {
    Add-Type -AssemblyName System.Windows.Forms
    $rumboDialog = New-Object System.Windows.Forms.FolderBrowserDialog
    $rumboDialog.Description = 'Selecciona la carpeta ORIGINAL del repositorio IV-PARCIAL---APP que ya usas en Visual Studio Code (contiene public y server.mjs).'
    $rumboDialog.ShowNewFolderButton = $false
    try { if ($rumboDialog.ShowDialog() -ne [Windows.Forms.DialogResult]::OK) { exit 0 }; $ProjectPath=$rumboDialog.SelectedPath } finally { $rumboDialog.Dispose() }
}
$rumboProject = [IO.Path]::GetFullPath($ProjectPath)
if (-not (Get-Command git.exe -ErrorAction SilentlyContinue)) { throw 'No se encontro Git. Abre este instalador en el equipo donde ya utilizas el repositorio de GitHub.' }
$rumboRemote = & git.exe -C $rumboProject remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0 -or $rumboRemote -notmatch '^(https://github\.com/|git@github\.com:)allandamianramos-hash/IV-PARCIAL---APP(?:\.git)?/?$') { throw 'Esa carpeta no esta conectada al repositorio compartido correcto. Selecciona la carpeta original que ya abres en Visual Studio Code.' }
foreach ($rumboRequired in @('server.mjs','package-lock.json','scripts/abrir-rumbo-portable.ps1','scripts/iniciar-proyecto.ps1')) {
    if (-not (Test-Path -LiteralPath (Join-Path $rumboProject $rumboRequired))) { throw 'Primero descarga los cambios en Visual Studio Code: Control de codigo fuente > ... > Pull. Despues repite este instalador.' }
}
# Refuse unsafe repository configuration before copying any credential.
$rumboTracked = & git.exe -C $rumboProject ls-files -- .env .rumbo-equipo.json .runtime
if ($LASTEXITCODE -ne 0 -or $rumboTracked) { throw 'Hay archivos privados versionados en esta carpeta. Pide a Allan revisar Git antes de instalar.' }
foreach($rumboPrivate in @('.env','.rumbo-equipo.json','.runtime/node/node.exe')) {
    & git.exe -C $rumboProject check-ignore --quiet -- $rumboPrivate
    if ($LASTEXITCODE -ne 0) { throw 'El repositorio no protege todos los archivos privados. Haz Pull para actualizar .gitignore antes de continuar.' }
}
$rumboCredential = Join-Path $rumboPackage '.rumbo-equipo.json'
$rumboAccess = Get-Content -LiteralPath $rumboCredential -Raw | ConvertFrom-Json
if ($rumboAccess.user -ne 'rumbo_equipo_omar' -or $rumboAccess.server -ne 'rumbo-2026.database.windows.net' -or $rumboAccess.database -ne 'BD_VIAJES') { throw 'El paquete de acceso no corresponde a Omar.' }
$rumboDestination = Join-Path $rumboProject '.rumbo-equipo.json'
if (Test-Path -LiteralPath $rumboDestination) {
    if ((Get-FileHash -LiteralPath $rumboDestination).Hash -ne (Get-FileHash -LiteralPath $rumboCredential).Hash) { throw 'Ya hay otro acceso personal en esta carpeta. No se reemplazo; pide a Allan revisarlo.' }
}
$rumboMetadata = Get-Content -LiteralPath (Join-Path $rumboPackage 'node-verificado.json') -Raw | ConvertFrom-Json
if ($rumboMetadata.name -notmatch '^node-v22\.[0-9]+\.[0-9]+-win-x64\.zip$') { throw 'Nombre de runtime no valido.' }
$rumboArchive = Join-Path $rumboPackage $rumboMetadata.name
if ((Get-FileHash -LiteralPath $rumboArchive -Algorithm SHA256).Hash -ne $rumboMetadata.sha256) { throw 'El archivo de Node esta incompleto o modificado. Vuelve a extraer el paquete.' }
$rumboRuntime = Join-Path $rumboProject '.runtime'
New-Item -ItemType Directory -Path $rumboRuntime -Force | Out-Null
if (-not (Test-Path -LiteralPath (Join-Path $rumboRuntime 'node/node.exe'))) {
    $rumboExtract = Join-Path $rumboRuntime ('node-instalacion-'+[guid]::NewGuid().ToString('N'))
    Expand-Archive -LiteralPath $rumboArchive -DestinationPath $rumboExtract
    $rumboSource = [IO.Path]::GetFullPath((Join-Path $rumboExtract $rumboMetadata.name.Replace('.zip','')))
    $rumboNodeTarget = [IO.Path]::GetFullPath((Join-Path $rumboRuntime 'node'))
    if (-not $rumboSource.StartsWith($rumboRuntime+[IO.Path]::DirectorySeparatorChar) -or -not $rumboNodeTarget.StartsWith($rumboRuntime+[IO.Path]::DirectorySeparatorChar)) { throw 'Ruta de instalacion no valida.' }
    Move-Item -LiteralPath $rumboSource -Destination $rumboNodeTarget
}
Copy-Item -LiteralPath $rumboCredential -Destination $rumboDestination
Write-Output 'Acceso instalado en tu repositorio existente. No se cambiaron tus archivos de codigo ni la conexion con GitHub.'
& (Join-Path $rumboProject 'scripts/abrir-rumbo-portable.ps1') -NoOpen:$NoOpen
