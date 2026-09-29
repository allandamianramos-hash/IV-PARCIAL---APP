param([string]$Pattern='producto-*.png',[string]$Output='evidencias/catalogo-nuevo-auditoria.png')
Add-Type -AssemblyName System.Drawing
$reviewFiles = @(Get-ChildItem -LiteralPath 'imagenes' -Filter $Pattern | Sort-Object { [int]($_.BaseName -replace '\D','') })
$reviewCanvas = [System.Drawing.Bitmap]::new(1200,([int][Math]::Ceiling($reviewFiles.Count / 6.0) * 175))
$reviewGraphics = [System.Drawing.Graphics]::FromImage($reviewCanvas)
$reviewGraphics.Clear([System.Drawing.Color]::White)
$reviewFont = [System.Drawing.Font]::new('Arial',10)
for($reviewIndex=0; $reviewIndex -lt $reviewFiles.Count; $reviewIndex++){
$reviewImage=[System.Drawing.Image]::FromFile($reviewFiles[$reviewIndex].FullName)
$reviewX=($reviewIndex % 6)*200
$reviewY=[int][Math]::Floor($reviewIndex/6)*175
$reviewRatio=[Math]::Min(195.0/$reviewImage.Width,145.0/$reviewImage.Height)
$reviewGraphics.DrawImage($reviewImage,[int]$reviewX,[int]$reviewY,[int]($reviewImage.Width*$reviewRatio),[int]($reviewImage.Height*$reviewRatio))
$reviewGraphics.DrawString($reviewFiles[$reviewIndex].Name,$reviewFont,[System.Drawing.Brushes]::Black,$reviewX,($reviewY+149))
$reviewImage.Dispose()
}
$reviewCanvas.Save((Join-Path (Get-Location) $Output))
$reviewGraphics.Dispose(); $reviewCanvas.Dispose(); $reviewFont.Dispose()
