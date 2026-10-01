$ErrorActionPreference = 'Stop'
$rumboRoot = Split-Path -Parent $PSScriptRoot
$rumboPhp = if ($env:RUMBO_PHP) { $env:RUMBO_PHP } else { 'C:\xampp\php\php.exe' }
if (-not (Test-Path -LiteralPath $rumboPhp)) { throw 'Instala XAMPP con PHP 8.2 x64, o define RUMBO_PHP con la ruta a php.exe.' }
$rumboRuntimeCheck = Join-Path $rumboRoot 'backend\php\runtime-check.php'
$rumboVersion = & $rumboPhp $rumboRuntimeCheck
if ($rumboVersion -ne '8.2/1/8') { throw 'Este instalador usa PHP 8.2 Thread Safe x64. Consulta docs/SQL-SERVER-PHP.md para otras versiones.' }
$rumboDll = Join-Path $rumboRoot '.runtime\sqlsrv-5.12\Windows\php_pdo_sqlsrv_82_ts_x64.dll'
function Assert-RumboDriver {
    if (-not (Test-Path -LiteralPath $rumboDll)) { throw 'Falta el controlador. Ejecuta CONFIGURAR-PHP.cmd primero.' }
    & $rumboPhp -d "extension=$rumboDll" $rumboRuntimeCheck driver
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo cargar PDO_SQLSRV. Comprueba Microsoft ODBC Driver 18 x64.' }
}
