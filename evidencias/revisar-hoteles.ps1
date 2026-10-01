Add-Type -AssemblyName System.Drawing
$hotelRoot=Split-Path $PSScriptRoot -Parent
$hotelPlan=Get-Content (Join-Path $hotelRoot 'imagenes-viajes/CREDITOS-HOTELES.json') -Raw | ConvertFrom-Json
for($hotelSheet=0;$hotelSheet -lt 2;$hotelSheet++) {
 $hotelBitmap=[System.Drawing.Bitmap]::new(1200,1120)
 $hotelCanvas=[System.Drawing.Graphics]::FromImage($hotelBitmap)
 $hotelCanvas.Clear([System.Drawing.Color]::White)
 $hotelFont=[System.Drawing.Font]::new('Arial',10)
 for($hotelSlot=0;$hotelSlot -lt 35;$hotelSlot++) {
  $hotelIndex=$hotelSheet*35+$hotelSlot
  $hotelEntry=$hotelPlan[$hotelIndex]
  $hotelPath=Join-Path $hotelRoot ('imagenes-viajes/'+$hotelEntry.file)
  if(-not (Test-Path -LiteralPath $hotelPath)){continue}
  $hotelImg=[System.Drawing.Image]::FromFile($hotelPath)
  $hotelX=($hotelSlot%5)*240
  $hotelY=[Math]::Floor($hotelSlot/5)*160
  $hotelScale=[Math]::Min(230/$hotelImg.Width,130/$hotelImg.Height)
  $hotelCanvas.DrawImage($hotelImg,[int]$hotelX,[int]$hotelY,[int]($hotelImg.Width*$hotelScale),[int]($hotelImg.Height*$hotelScale))
  $hotelCanvas.DrawString("$hotelIndex $($hotelEntry.id)",$hotelFont,[System.Drawing.Brushes]::Black,$hotelX,($hotelY+132))
  $hotelImg.Dispose()
 }
 $hotelBitmap.Save((Join-Path $PSScriptRoot "hoteles-revision-$hotelSheet.jpg"),[System.Drawing.Imaging.ImageFormat]::Jpeg)
 $hotelCanvas.Dispose();$hotelBitmap.Dispose();$hotelFont.Dispose()
}
