param([switch]$Watch, [switch]$Install, [switch]$Open)
$ErrorActionPreference = 'Stop'
$rumboRoot = Split-Path -Parent $PSScriptRoot
$rumboScript = Join-Path $PSScriptRoot 'rumbo-background.ps1'
$rumboNode = (Get-Command node.exe -ErrorAction Stop).Source
$rumboPowerShell = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
# Read the same port as Node, without exposing the credentials in .env.
$rumboPort = 3000
if (Test-Path -LiteralPath (Join-Path $rumboRoot '.env')) {
    foreach ($rumboLine in Get-Content -LiteralPath (Join-Path $rumboRoot '.env')) {
        if ($rumboLine -match '^\s*PORT\s*=\s*["'']?(\d+)') { $rumboPort = [int]$Matches[1] }
    }
}
if ($env:PORT) { $rumboPort = [int]$env:PORT }
if ($rumboPort -lt 1 -or $rumboPort -gt 65535) { throw 'PORT debe estar entre 1 y 65535.' }
$rumboUrl = "http://127.0.0.1:$rumboPort"
function Test-RumboReady {
    try {
        $rumboHealth = Invoke-RestMethod -Uri "$rumboUrl/api/health" -TimeoutSec 2
        return $rumboHealth.app -eq 'rumbo-viajes' -and $rumboHealth.status -eq 'ok'
    } catch { return $false }
}

if ($Install) {
    # Per-user logon startup: no administrator privileges or saved passwords.
    $rumboStartup = [Environment]::GetFolderPath('Startup')
    $rumboShortcutPath = Join-Path $rumboStartup 'Rumbo - servidor automatico.lnk'
    $rumboShell = New-Object -ComObject WScript.Shell
    $rumboShortcut = $rumboShell.CreateShortcut($rumboShortcutPath)
    $rumboShortcut.TargetPath = $rumboPowerShell
    $rumboShortcut.Arguments = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$rumboScript`" -Watch"
    $rumboShortcut.WorkingDirectory = $rumboRoot
    $rumboShortcut.WindowStyle = 7
    $rumboShortcut.Description = 'Mantiene el servidor local de Rumbito disponible al iniciar sesion.'
    $rumboShortcut.Save()
    Write-Output "Inicio automatico instalado: $rumboShortcutPath"
}

if (-not $Watch) {
    Start-Process -FilePath $rumboPowerShell -ArgumentList "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$rumboScript`" -Watch" -WorkingDirectory $rumboRoot -WindowStyle Hidden
    $rumboDeadline = (Get-Date).AddSeconds(25)
    while (-not (Test-RumboReady)) {
        if ((Get-Date) -ge $rumboDeadline) { throw "No se pudo iniciar Rumbo en $rumboUrl. Revisa rumbo-errors.log y si otro programa ocupa el puerto." }
        Start-Sleep -Seconds 1
    }
    if ($Open) { Start-Process explorer.exe -ArgumentList "http://localhost:$rumboPort" -WindowStyle Hidden }
    Write-Output "Rumbo disponible: http://localhost:$rumboPort"
    exit 0
}

# A named mutex prevents duplicate supervisors when reopening the launcher.
$rumboMutex = New-Object System.Threading.Mutex($false, "Local\RumboServer-$rumboPort")
$rumboOwnsMutex = $false
$rumboChild = $null
try {
    try { $rumboOwnsMutex = $rumboMutex.WaitOne(0) }
    catch [System.Threading.AbandonedMutexException] { $rumboOwnsMutex = $true }
    if (-not $rumboOwnsMutex) { exit 0 }
    while ($true) {
        try {
            if (-not (Test-RumboReady)) {
                if ($null -eq $rumboChild -or $rumboChild.HasExited) {
                    $rumboChild = Start-Process -FilePath $rumboNode -ArgumentList ('"' + (Join-Path $rumboRoot 'server.mjs') + '"') -WorkingDirectory $rumboRoot -WindowStyle Hidden -RedirectStandardOutput (Join-Path $rumboRoot 'rumbo-server.log') -RedirectStandardError (Join-Path $rumboRoot 'rumbo-errors.log') -PassThru
                }
            }
        } catch {
            Add-Content -LiteralPath (Join-Path $rumboRoot 'rumbo-background.log') -Value "$(Get-Date -Format o) No se pudo iniciar el servidor. Se reintentara."
        }
        Start-Sleep -Seconds 5
    }
} finally {
    if ($rumboOwnsMutex) { $rumboMutex.ReleaseMutex() }
    $rumboMutex.Dispose()
}
