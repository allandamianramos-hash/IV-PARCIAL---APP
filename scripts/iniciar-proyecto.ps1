param([switch]$Open, [switch]$Install)
$ErrorActionPreference = 'Stop'
$rumboRoot = Split-Path -Parent $PSScriptRoot
if ((Test-Path -LiteralPath (Join-Path $rumboRoot '.rumbo-equipo.json')) -and (Test-Path -LiteralPath (Join-Path $rumboRoot '.runtime/node/node.exe'))) {
    & (Join-Path $PSScriptRoot 'abrir-rumbo-portable.ps1') -NoOpen:(-not $Open)
} else {
    & (Join-Path $PSScriptRoot 'iniciar-php.ps1') -Open:$Open
}

if ($Install) {
    # Start the complete project at logon, independently of the editor.
    $rumboPowerShell = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
    $rumboLauncher = Join-Path $PSScriptRoot 'iniciar-proyecto.ps1'
    $rumboStartupLink = Join-Path ([Environment]::GetFolderPath('Startup')) 'Rumbo - servidor automatico.lnk'
    $rumboDesktopLink = Join-Path ([Environment]::GetFolderPath('Desktop')) 'Rumbo.lnk'
    $rumboRuntime = Join-Path $rumboRoot '.runtime'
    New-Item -ItemType Directory -Path $rumboRuntime -Force | Out-Null
    $rumboPreviousLink = Join-Path $rumboRuntime 'inicio-automatico-anterior.lnk'
    if ((Test-Path -LiteralPath $rumboStartupLink) -and -not (Test-Path -LiteralPath $rumboPreviousLink)) {
        Copy-Item -LiteralPath $rumboStartupLink -Destination $rumboPreviousLink
    }
    $rumboShortcutShell = New-Object -ComObject WScript.Shell
    foreach ($rumboLinkPath in @($rumboStartupLink, $rumboDesktopLink)) {
        $rumboLink = $rumboShortcutShell.CreateShortcut($rumboLinkPath)
        $rumboLink.TargetPath = $rumboPowerShell
        $rumboLink.Arguments = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$rumboLauncher`""
        if ($rumboLinkPath -eq $rumboDesktopLink) { $rumboLink.Arguments += ' -Open' }
        $rumboLink.WorkingDirectory = $rumboRoot
        $rumboLink.WindowStyle = 7
        $rumboLink.IconLocation = (Join-Path $env:SystemRoot 'System32\url.dll') + ',0'
        $rumboLink.Description = 'Abre Rumbo con su servidor propio, sin Visual Studio Code.'
        $rumboLink.Save()
    }
    Write-Output 'RUMBO | Inicio automatico activado al entrar a Windows y acceso Rumbo creado en el escritorio.'
}
