. "$PSScriptRoot\php-runtime.ps1"
Assert-RumboDriver
& $rumboPhp -d "extension=$rumboDll" (Join-Path $rumboRoot 'backend\php\install.php') check
if ($LASTEXITCODE -ne 0) { throw 'Conexion incompleta: revisa .env y ejecuta CONFIGURAR-PHP.cmd.' }
Write-Output 'Lectura y escritura SQL verificadas. La prueba temporal se revirtio.'
Write-Output 'Abre INICIAR-RUMBO.cmd y usa http://localhost:8000; Live Server no ejecuta PHP.'
