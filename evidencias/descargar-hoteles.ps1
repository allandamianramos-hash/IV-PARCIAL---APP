$ErrorActionPreference = 'Stop'
$hotelRoot = Split-Path $PSScriptRoot -Parent
$hotelPlan = Get-Content (Join-Path $hotelRoot 'imagenes-viajes/CREDITOS-HOTELES.json') -Raw | ConvertFrom-Json
foreach ($hotelItem in $hotelPlan) {
    $hotelTarget = Join-Path $hotelRoot ('imagenes-viajes/' + $hotelItem.file)
    if ((Test-Path -LiteralPath $hotelTarget) -and (Get-Item -LiteralPath $hotelTarget).Length -gt 2000) { continue }
    $hotelUrl = $hotelItem.url -replace '/800px-', '/960px-'
    try { Invoke-WebRequest -Uri $hotelUrl -OutFile $hotelTarget }
    catch { Write-Output "Pendiente: $($hotelItem.file)"; Start-Sleep -Seconds 10; continue }
    Write-Output $hotelItem.file
    Start-Sleep -Seconds 3
}
