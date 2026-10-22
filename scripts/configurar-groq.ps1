$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $projectRoot '.env'
Write-Host 'Crea una API key en https://console.groq.com/keys usando el plan Free.'
Write-Host 'Pega la llave aqui. La entrada estara oculta; no la compartas en el chat.'
$secret = Read-Host 'Groq API key' -AsSecureString
$pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try {
    $key = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer).Trim()
    if ($key -notmatch '^gsk_[A-Za-z0-9_-]{20,}$') { throw 'Formato de llave no reconocido. No se cambio la configuracion.' }
    $content = if (Test-Path -LiteralPath $envPath) { [IO.File]::ReadAllText($envPath) } else { '' }
    # Replace only Groq settings. Preserve database, OAuth and mail credentials.
    $content = [regex]::Replace($content, '(?m)^[ \t]*(?:export[ \t]+)?GROQ_(?:API_KEY|MODEL)[ \t]*=.*(?:\r?\n|$)', '')
    $content = $content.TrimEnd("`r", "`n") + "`r`nGROQ_API_KEY=$key`r`nGROQ_MODEL=openai/gpt-oss-20b`r`n"
    [IO.File]::WriteAllText($envPath, $content, (New-Object Text.UTF8Encoding($false)))
    Write-Host 'Llave guardada en el .env privado. No se ha validado aun con Groq.'
    Write-Host 'Abre INICIAR-RUMBO.cmd y ejecuta npm run chat:check para verificar.'
} finally {
    [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
    $key = $null
    $content = $null
    $secret.Dispose()
}
