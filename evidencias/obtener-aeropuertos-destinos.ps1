$ErrorActionPreference = 'Stop'
$travelRoot = Split-Path $PSScriptRoot -Parent
$travelPages = @{ 'san-pedro-sula'='San_Pedro_Sula'; comayagua='Comayagua'; 'ciudad-guatemala'='Guatemala_City'; venecia='Venice'; osaka='Osaka'; 'san-jose'='San_Jos%C3%A9,_Costa_Rica' }
$travelCredits = @()
if (Test-Path (Join-Path $travelRoot 'imagenes-viajes/CREDITOS-DESTINOS.json')) { $travelCredits = @(Get-Content (Join-Path $travelRoot 'imagenes-viajes/CREDITOS-DESTINOS.json') -Raw | ConvertFrom-Json) }
foreach ($travelId in $travelPages.Keys) {
    if ($travelCredits.id -contains $travelId) { continue }
    $travelSummary = Invoke-RestMethod -Uri ('https://en.wikipedia.org/api/rest_v1/page/summary/' + $travelPages[$travelId])
    $travelOriginal = $travelSummary.originalimage.source
    $travelParts = ([Uri]$travelOriginal).AbsolutePath -split '/'
    $travelFileName = [Uri]::UnescapeDataString($(if ($travelParts -contains 'thumb') {$travelParts[-2]} else {$travelParts[-1]}))
    $travelMetadataUrl = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=extmetadata&titles=' + [Uri]::EscapeDataString('File:'+$travelFileName)
    $travelMetadata = Invoke-RestMethod -Uri $travelMetadataUrl
    $travelInfo = ($travelMetadata.query.pages.PSObject.Properties.Value | Select-Object -First 1).imageinfo[0].extmetadata
    if (-not $travelInfo.LicenseShortName.value) { throw "No license metadata for $travelId" }
    $travelImage = $travelSummary.thumbnail.source -replace '/\d+px-', '/960px-'
    Invoke-WebRequest -Uri $travelImage -OutFile (Join-Path $travelRoot "imagenes-viajes/destino-$travelId.jpg")
    $travelCredits += [ordered]@{id=$travelId;title=$travelSummary.title;file="imagenes-viajes/destino-$travelId.jpg";source=$travelOriginal;page=$travelSummary.content_urls.desktop.page;author=$travelInfo.Artist.value;license=$travelInfo.LicenseShortName.value;licenseUrl=$travelInfo.LicenseUrl.value;description=$travelInfo.ImageDescription.value}
    $travelCredits | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $travelRoot 'imagenes-viajes/CREDITOS-DESTINOS.json') -Encoding utf8
    Write-Output "$travelId : $($travelInfo.LicenseShortName.value)"
}
