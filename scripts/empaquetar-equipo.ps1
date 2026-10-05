$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$rumboRoot = [IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
$rumboOutput = Join-Path $rumboRoot '.runtime\equipo'
$rumboAccess = Get-Content -LiteralPath (Join-Path $rumboOutput 'accesos.json') -Raw | ConvertFrom-Json
$rumboDirectories = @('public','src','backend','database','scripts','tests','docs','.vscode')
$rumboFiles = @('README.md','package.json','package-lock.json','vite.config.ts','tsconfig.json','tailwind.config.cjs','postcss.config.cjs','.env.example','.gitignore','router.php','server.mjs','rumbo-background.ps1','INICIAR-RUMBO.cmd','CONFIGURAR-PHP.cmd','COMPROBAR-CONEXION.cmd','CONECTAR-EQUIPO.cmd','VER-BD-AZURE.cmd') | ForEach-Object { Get-Item -LiteralPath (Join-Path $rumboRoot $_) }
foreach ($rumboDirectory in $rumboDirectories) { $rumboFiles += Get-ChildItem -LiteralPath (Join-Path $rumboRoot $rumboDirectory) -Recurse -File }
# Explicit allowlist: never package .env, .runtime, backups, administrator credentials or node_modules.
$rumboBase = Join-Path $rumboOutput 'proyecto-sin-claves.zip'
if (Test-Path -LiteralPath $rumboBase) { throw 'Ya hay paquetes preparados. Revisa antes de reemplazarlos.' }
$rumboZip = [IO.Compression.ZipFile]::Open($rumboBase,[IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($rumboFile in $rumboFiles) {
        $rumboRelative = $rumboFile.FullName.Substring($rumboRoot.Length+1).Replace('\','/')
        if ($rumboFile.Name -eq '.env' -or $rumboFile.Name -eq '.rumbo-equipo.json') { throw 'Se detecto un archivo privado en la lista.' }
        [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($rumboZip,$rumboFile.FullName,$rumboRelative,[IO.Compression.CompressionLevel]::Fastest) | Out-Null
    }
} finally { $rumboZip.Dispose() }
foreach ($rumboPerson in $rumboAccess) {
    if ($rumboPerson.name -notmatch '^(omar|dianny|dilan|yeison)$') { throw 'Integrante desconocido.' }
    $rumboTarget = Join-Path $rumboOutput ('RUMBO-EQUIPO-'+$rumboPerson.name+'.zip')
    Copy-Item -LiteralPath $rumboBase -Destination $rumboTarget
    $rumboZip = [IO.Compression.ZipFile]::Open($rumboTarget,[IO.Compression.ZipArchiveMode]::Update)
    try { [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($rumboZip,(Join-Path $rumboOutput ($rumboPerson.name+'\.rumbo-equipo.json')),'.rumbo-equipo.json') | Out-Null }
    finally { $rumboZip.Dispose() }
    Write-Output ('Preparado para '+$rumboPerson.name+': '+$rumboTarget)
}
