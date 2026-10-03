$ErrorActionPreference = 'Stop'
$rumboRoot = Split-Path -Parent $PSScriptRoot
$rumboUser = ''
foreach ($rumboLine in Get-Content -LiteralPath (Join-Path $rumboRoot '.env')) {
    if ($rumboLine -match '^DB_USER=(.+)$') { $rumboUser = $Matches[1].Trim() }
}
if ($rumboUser -notmatch '^rumbo_[a-z_]+$') { throw 'Primero configura tu acceso a Azure.' }
$rumboSsms = (Get-Command ssms.exe -ErrorAction SilentlyContinue).Source
if (-not $rumboSsms) {
    foreach ($rumboVersion in @('22','21')) {
        $rumboCandidate = Join-Path $env:ProgramFiles "Microsoft SQL Server Management Studio $rumboVersion\Release\Common7\IDE\SSMS.exe"
        if (Test-Path -LiteralPath $rumboCandidate) { $rumboSsms=$rumboCandidate;break }
    }
}
if (-not $rumboSsms) { throw 'Instala SQL Server Management Studio o abre database\CONSULTAR_DATOS.sql en tu cliente SQL.' }
$rumboQuery = Join-Path $rumboRoot 'database\CONSULTAR_DATOS.sql'
Write-Output 'SSMS abrira BD_VIAJES en Azure. Introduce la clave DB_PASSWORD de tu .env si la solicita y pulsa F5 para ver todos los resultados.'
# No se pasa la contraseña en los argumentos del proceso.
Start-Process -FilePath $rumboSsms -ArgumentList @('-S','rumbo-2026.database.windows.net','-d','BD_VIAJES','-U',$rumboUser,('"'+$rumboQuery+'"')) -WindowStyle Normal
