param([switch]$Open)
$ErrorActionPreference = 'Stop'
$rumboRoot = Split-Path -Parent $PSScriptRoot
if ((Test-Path -LiteralPath (Join-Path $rumboRoot '.rumbo-equipo.json')) -and (Test-Path -LiteralPath (Join-Path $rumboRoot '.runtime/node/node.exe'))) {
    & (Join-Path $PSScriptRoot 'abrir-rumbo-portable.ps1') -NoOpen:(-not $Open)
} else {
    & (Join-Path $PSScriptRoot 'iniciar-php.ps1') -Open:$Open
}
