param([switch]$Open)
. "$PSScriptRoot\php-runtime.ps1"
Assert-RumboDriver
New-Item -ItemType Directory -Path (Join-Path $rumboRoot '.runtime') -Force | Out-Null
# El chat es auxiliar: una caida de Node no bloquea PHP ni SQL Server.
try { & (Join-Path $rumboRoot 'rumbo-background.ps1') }
catch { Write-Warning 'El asistente Node no inicio. PHP y SQL Server pueden seguir funcionando.' }
$rumboUrl = 'http://127.0.0.1:5500'
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
$rumboConnected = $rumboMatch.Success -and ($rumboMatch.Groups[1].Value | ConvertFrom-Json).connected
if (-not $rumboConnected) {
    Write-Warning 'RUMBO | El sitio esta disponible, pero no hay conexion a la base de datos. Tus selecciones se conservan en este navegador.'
    if ($rumboMatch.Success -and ($rumboMatch.Groups[1].Value | ConvertFrom-Json).reason -eq 'firewall') {
        Write-Warning 'RUMBO | Azure bloqueo la IP de esta conexion. Autoriza la IP publica actual en las reglas de red de SQL Server y vuelve a conectar desde el sitio.'
    }
}
if ($Open) {
    try {
        $rumboLive = Invoke-RestMethod "$rumboUrl/api/health" -TimeoutSec 2
        if ($rumboLive.backend -eq 'php') { Start-Process explorer.exe -ArgumentList $rumboUrl -WindowStyle Hidden }
    } catch { }
}
Write-Output 'RUMBO | PHP listo en segundo plano. Abre el sitio con Go Live en Visual Studio Code.'
Write-Output "RUMBO | Direccion de Live Server: $rumboUrl"
if ($rumboConnected) { Write-Output 'RUMBO | Base de datos conectada.' }
