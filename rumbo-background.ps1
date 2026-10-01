# Compatibilidad con el acceso de inicio automatico ya instalado en Windows.
param([switch]$Watch, [switch]$Install, [switch]$Open)
& "$PSScriptRoot\scripts\rumbo-background.ps1" @PSBoundParameters
