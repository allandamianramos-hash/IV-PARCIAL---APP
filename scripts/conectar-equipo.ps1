$ErrorActionPreference = 'Stop'
$rumboRoot = Split-Path -Parent $PSScriptRoot
$rumboAccessPath = Join-Path $rumboRoot '.rumbo-equipo.json'
if (-not (Test-Path -LiteralPath $rumboAccessPath)) { throw 'Usa el paquete personal que te entrego Allan. Falta .rumbo-equipo.json.' }
$rumboAccess = Get-Content -LiteralPath $rumboAccessPath -Raw | ConvertFrom-Json
if ($rumboAccess.server -ne 'rumbo-2026.database.windows.net' -or $rumboAccess.database -ne 'BD_VIAJES' -or $rumboAccess.user -notmatch '^rumbo_equipo_[a-z]+$' -or $rumboAccess.password -notmatch '^[A-Za-z0-9!_-]{24,100}$') { throw 'El archivo de acceso no es valido.' }
$rumboEnvPath = Join-Path $rumboRoot '.env'
$rumboText = if (Test-Path -LiteralPath $rumboEnvPath) { [IO.File]::ReadAllText($rumboEnvPath) } else { '' }
$rumboPrivate = Join-Path $rumboRoot '.runtime'
New-Item -ItemType Directory -Path $rumboPrivate -Force | Out-Null
if ($rumboText) { [IO.File]::WriteAllText((Join-Path $rumboPrivate ('env-anterior-' + (Get-Date -Format yyyyMMdd-HHmmss) + '.txt')), $rumboText) }
$rumboSettings = [ordered]@{ DB_ENABLED='true'; DB_SERVER=$rumboAccess.server; DB_NAME=$rumboAccess.database; DB_AUTH='sql'; DB_PORT='1433'; DB_USER=$rumboAccess.user; DB_PASSWORD=$rumboAccess.password; DB_TRUST_CERTIFICATE='false'; DB_SETUP_MODE='check' }
foreach ($rumboEntry in $rumboSettings.GetEnumerator()) {
    $rumboPattern = '(?m)^' + $rumboEntry.Key + '=.*$'
    $rumboLine = $rumboEntry.Key + '=' + $rumboEntry.Value
    if ([regex]::IsMatch($rumboText, $rumboPattern)) { $rumboText = [regex]::Replace($rumboText, $rumboPattern, $rumboLine) }
    else { $rumboText = $rumboText.TrimEnd() + "`r`n" + $rumboLine + "`r`n" }
}
[IO.File]::WriteAllText($rumboEnvPath, $rumboText, [Text.UTF8Encoding]::new($false))
Write-Output ('Acceso personal configurado: ' + $rumboAccess.user)
if (-not (Get-Command node.exe -ErrorAction SilentlyContinue)) { throw 'Instala Node.js 22 o posterior y vuelve a abrir CONECTAR-EQUIPO.cmd.' }
$rumboNodeMajor = [int]((& node.exe --version).TrimStart('v').Split('.')[0])
if ($rumboNodeMajor -lt 22) { throw 'Actualiza Node.js a la version 22 o posterior y vuelve a abrir CONECTAR-EQUIPO.cmd.' }
Push-Location $rumboRoot
try {
    if (-not (Test-Path -LiteralPath (Join-Path $rumboRoot 'node_modules\mssql\package.json'))) { & npm.cmd ci; if ($LASTEXITCODE -ne 0) { throw 'No se pudieron instalar las dependencias.' } }
    & node.exe database/manage.mjs check
    if ($LASTEXITCODE -ne 0) {
        Write-Output 'Si Azure indica IP no autorizada, envia esa IP a Allan para autorizar tu casa. No compartas tu contrasena.'
        throw 'Azure no confirmo la conexion; los datos de acceso quedaron guardados para reintentar.'
    }
    & (Join-Path $PSScriptRoot 'configurar-php.ps1')
    & (Join-Path $PSScriptRoot 'iniciar-php.ps1') -Open
} finally { Pop-Location }
