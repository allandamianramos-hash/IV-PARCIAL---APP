. "$PSScriptRoot\php-runtime.ps1"
Assert-RumboDriver
& $rumboPhp -d "extension=$rumboDll" (Join-Path $rumboRoot 'backend\php\install.php') check
if ($LASTEXITCODE -ne 0) { throw 'Conexion incompleta: revisa .env y ejecuta CONFIGURAR-PHP.cmd.' }
Write-Output 'Lectura y escritura SQL verificadas. La prueba temporal se revirtio.'
Write-Output 'Abre el sitio con Go Live en Visual Studio Code. PHP trabaja en segundo plano y el navegador conserva la direccion de Live Server.'
