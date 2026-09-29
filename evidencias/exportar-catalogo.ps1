Add-Type -AssemblyName System.Drawing
$exportCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$exportParams = [System.Drawing.Imaging.EncoderParameters]::new(1)
$exportParams.Param[0]=[System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality,[long]88)
foreach($exportFile in Get-ChildItem -LiteralPath 'imagenes' -Filter 'producto-*.png'){
$exportDestination=Join-Path $exportFile.DirectoryName ($exportFile.BaseName+'.jpg')
if(Test-Path -LiteralPath $exportDestination){continue}
$exportImage=[System.Drawing.Image]::FromFile($exportFile.FullName)
$exportImage.Save($exportDestination,$exportCodec,$exportParams)
$exportImage.Dispose()
}
$exportParams.Dispose()
