$ErrorActionPreference = 'Stop'
$rumboRoot = Split-Path -Parent $PSScriptRoot
$rumboItems = @('public','src','backend','database','scripts','tests','docs','README.md','package.json','package-lock.json','vite.config.ts','tsconfig.json','tailwind.config.cjs','postcss.config.cjs','.env.example','.gitignore','.htaccess','router.php','server.mjs','rumbo-background.ps1','INICIAR-RUMBO.cmd','CONFIGURAR-PHP.cmd','PREPARAR-ENTREGA.cmd','ACTIVAR-RUMBO-AUTOMATICO.cmd')
$rumboItems += 'COMPROBAR-CONEXION.cmd'
$rumboItems += '.vscode'
$rumboItems += 'config'
$rumboPaths = $rumboItems | ForEach-Object { Join-Path $rumboRoot $_ }
Compress-Archive -LiteralPath $rumboPaths -DestinationPath (Join-Path $rumboRoot 'ENTREGA-RUMBO.zip') -Force
Write-Output 'ENTREGA-RUMBO.zip listo. Incluye SQL, sin credenciales ni datos de usuarios.'
