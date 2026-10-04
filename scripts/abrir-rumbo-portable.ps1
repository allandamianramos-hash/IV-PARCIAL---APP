param([switch]$NoOpen)
$ErrorActionPreference = 'Stop'
$rumboRoot = Split-Path -Parent $PSScriptRoot
$rumboRuntime = Join-Path $rumboRoot '.runtime'
$rumboNode = Join-Path $rumboRuntime 'node\node.exe'
if (-not (Test-Path -LiteralPath $rumboNode)) { throw 'Primero instala tu paquete ACCESO-OMAR-GITHUB en esta carpeta del repositorio.' }
$rumboAccess = Get-Content -LiteralPath (Join-Path $rumboRoot '.rumbo-equipo.json') -Raw | ConvertFrom-Json
if ($rumboAccess.server -ne 'rumbo-2026.database.windows.net' -or $rumboAccess.database -ne 'BD_VIAJES' -or $rumboAccess.user -ne 'rumbo_equipo_omar' -or $rumboAccess.password -notmatch '^[A-Za-z0-9!_-]{24,100}$') { throw 'Este paquete requiere el acceso personal de Omar.' }
$rumboServer = Join-Path $rumboRoot 'server.mjs'
$rumboPort = 3010
$rumboUrl = "http://127.0.0.1:$rumboPort"
# Keep unrelated private settings (for example an AI key) and back up configuration changes.
$rumboEnvPath = Join-Path $rumboRoot '.env'
$rumboOldConfig = if (Test-Path -LiteralPath $rumboEnvPath) { [IO.File]::ReadAllText($rumboEnvPath) } else { '' }
$rumboConfig = $rumboOldConfig
$rumboSettings = [ordered]@{DB_ENABLED='true';DB_AUTH='sql';DB_PORT='1433';DB_TRUST_CERTIFICATE='false';DB_SETUP_MODE='check';DB_SERVER=$rumboAccess.server;DB_NAME=$rumboAccess.database;DB_USER=$rumboAccess.user;DB_PASSWORD=$rumboAccess.password;PORT=[string]$rumboPort;APP_ORIGIN=$rumboUrl}
foreach ($rumboEntry in $rumboSettings.GetEnumerator()) {
    $rumboPattern = '(?m)^\s*' + $rumboEntry.Key + '\s*=.*$'
    $rumboLine = $rumboEntry.Key + '=' + $rumboEntry.Value
    if ([regex]::IsMatch($rumboConfig,$rumboPattern)) { $rumboConfig=[regex]::Replace($rumboConfig,$rumboPattern,$rumboLine) }
    else { $rumboConfig=$rumboConfig.TrimEnd()+"`r`n"+$rumboLine+"`r`n" }
}
if ($rumboConfig -ne $rumboOldConfig) {
    if ($rumboOldConfig) { [IO.File]::WriteAllText((Join-Path $rumboRuntime ('env-anterior-'+(Get-Date -Format yyyyMMdd-HHmmss-fff)+'.txt')),$rumboOldConfig) }
    [IO.File]::WriteAllText($rumboEnvPath,$rumboConfig,[Text.UTF8Encoding]::new($false))
}
Push-Location $rumboRoot
try {
    $rumboLockHash = (Get-FileHash -LiteralPath (Join-Path $rumboRoot 'package-lock.json') -Algorithm SHA256).Hash
    $rumboInstalledHashPath = Join-Path $rumboRuntime 'npm-lock.sha256'
    $rumboInstalledHash = if (Test-Path -LiteralPath $rumboInstalledHashPath) { [IO.File]::ReadAllText($rumboInstalledHashPath).Trim() } else { '' }
    if ($rumboInstalledHash -ne $rumboLockHash -or -not (Test-Path -LiteralPath (Join-Path $rumboRoot 'node_modules/mssql/package.json'))) {
        Write-Output 'Preparando las dependencias de esta version del proyecto...'
        $env:Path = (Split-Path -Parent $rumboNode)+';'+$env:Path
        & (Join-Path (Split-Path -Parent $rumboNode) 'npm.cmd') ci --ignore-scripts --no-audit --no-fund
        if ($LASTEXITCODE -ne 0) { throw 'No se pudieron preparar las dependencias. Revisa Internet y vuelve a abrir INICIAR-RUMBO.cmd.' }
        [IO.File]::WriteAllText($rumboInstalledHashPath,$rumboLockHash)
    }
    Write-Output 'Comprobando tu acceso a BD_VIAJES en Azure...'
    & $rumboNode database/manage.mjs check
    if ($LASTEXITCODE -ne 0) { throw 'No se pudo conectar. Revisa Internet. Si el mensaje indica una IP bloqueada, envia a Allan esa IP o una foto del error; no envies tu contrasena.' }
    $rumboPidPath = Join-Path $rumboRuntime 'portable.pid'
    $rumboRunning = $false
    if (Test-Path -LiteralPath $rumboPidPath) {
        $rumboPidText = [IO.File]::ReadAllText($rumboPidPath).Trim()
        if ($rumboPidText -match '^\d+$') {
            $rumboExisting = Get-CimInstance Win32_Process -Filter ('ProcessId = '+$rumboPidText)
            $rumboRunning = $rumboExisting -and $rumboExisting.ExecutablePath -eq $rumboNode -and $rumboExisting.CommandLine.Contains($rumboServer)
        }
    }
    if ($rumboRunning) {
        # Restart only this verified project process so pulled backend changes take effect.
        Stop-Process -Id ([int]$rumboPidText) -ErrorAction Stop
        Wait-Process -Id ([int]$rumboPidText) -Timeout 10 -ErrorAction SilentlyContinue
        $rumboRunning = $false
    }
    if (-not $rumboRunning) {
        $rumboListener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback,$rumboPort)
        try { $rumboListener.Start() } catch { throw 'El puerto 3010 esta ocupado por otra aplicacion. Cierra la otra copia de Rumbo o envia este mensaje a Allan.' } finally { $rumboListener.Stop() }
        $env:PORT = [string]$rumboPort
        $rumboProcess = Start-Process -FilePath $rumboNode -ArgumentList ('"'+$rumboServer+'"') -WorkingDirectory $rumboRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $rumboRuntime 'portable-output.log') -RedirectStandardError (Join-Path $rumboRuntime 'portable-errors.log') -PassThru
        [IO.File]::WriteAllText($rumboPidPath,[string]$rumboProcess.Id)
    }
    $rumboReady = $false
    $rumboDeadline = (Get-Date).AddSeconds(40)
    while ((Get-Date) -lt $rumboDeadline) {
        try { $rumboHealth=Invoke-RestMethod "$rumboUrl/api/health" -TimeoutSec 2; $rumboReady=$rumboHealth.app -eq 'rumbo-viajes'; if($rumboReady){break} } catch {}
        Start-Sleep -Milliseconds 400
    }
    if (-not $rumboReady) { throw 'Rumbo no inicio. Envia a Allan el archivo .runtime/portable-errors.log.' }
    $rumboPage = Invoke-WebRequest -UseBasicParsing "$rumboUrl/index.html" -TimeoutSec 45
    $rumboMatch = [regex]::Match($rumboPage.Content,'id="rumbo-bootstrap" type="application/json">(.*?)</script>')
    if (-not $rumboMatch.Success -or -not ($rumboMatch.Groups[1].Value | ConvertFrom-Json).connected) { throw 'La pagina no confirma conexion a Azure. Envia a Allan el archivo .runtime/portable-errors.log.' }
    Write-Output "LISTO: Rumbo conectado a Azure. $rumboUrl"
    if (-not $NoOpen) { Start-Process explorer.exe -ArgumentList $rumboUrl -WindowStyle Hidden }
} finally { Pop-Location }
