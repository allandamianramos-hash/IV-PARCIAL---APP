param([switch]$Open)
. "$PSScriptRoot\php-runtime.ps1"
Assert-RumboDriver
& $rumboPhp -d "extension=$rumboDll" (Join-Path $rumboRoot 'backend\php\install.php') check
if ($LASTEXITCODE -ne 0) { throw 'No hay conexion SQL. Ejecuta CONFIGURAR-PHP.cmd.' }
New-Item -ItemType Directory -Path (Join-Path $rumboRoot '.runtime') -Force | Out-Null
# El chat es auxiliar: una caida de Node no bloquea PHP ni SQL Server.
try { & (Join-Path $rumboRoot 'rumbo-background.ps1') }
catch { Write-Warning 'El asistente Node no inicio. PHP y SQL Server pueden seguir funcionando.' }
$rumboUrl = 'http://localhost:8000'
function Test-RumboPhp {
    try { return (Invoke-RestMethod 'http://127.0.0.1:8000/api/health' -TimeoutSec 3).backend -eq 'php' } catch { return $false }
}
if (-not (Test-RumboPhp)) {
    $rumboArgs = '-d "extension=' + $rumboDll + '" -d display_errors=0 -d log_errors=1 -S 127.0.0.1:8000 -t "' + (Join-Path $rumboRoot 'public') + '" "' + (Join-Path $rumboRoot 'router.php') + '"'
    $rumboProcess = Start-Process -FilePath $rumboPhp -ArgumentList $rumboArgs -WorkingDirectory $rumboRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $rumboRoot '.runtime\php-output.log') -RedirectStandardError (Join-Path $rumboRoot '.runtime\php-errors.log') -PassThru
    $rumboDeadline = (Get-Date).AddSeconds(15)
    while (-not (Test-RumboPhp)) {
        if ($rumboProcess.HasExited -or (Get-Date) -gt $rumboDeadline) { throw 'PHP no inicio. Revisa .runtime/php-errors.log y el puerto 8000.' }
        Start-Sleep -Milliseconds 300
    }
}
$rumboPage = Invoke-WebRequest -UseBasicParsing 'http://127.0.0.1:8000/index.html' -TimeoutSec 15
$rumboMatch = [regex]::Match($rumboPage.Content, 'id="rumbo-bootstrap" type="application/json">(.*?)</script>')
if (-not $rumboMatch.Success -or -not ($rumboMatch.Groups[1].Value | ConvertFrom-Json).connected) {
    throw 'La web no confirma conexion SQL. Ejecuta CONFIGURAR-PHP.cmd y revisa .runtime/php-errors.log.'
}
if ($Open) { Start-Process explorer.exe -ArgumentList $rumboUrl -WindowStyle Hidden }
Write-Output "PHP y SQL Server disponibles: $rumboUrl"
