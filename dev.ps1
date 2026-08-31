<#
    dev.ps1 — Entorno de desarrollo de «Prácticas v4».

    Por qué existe este script
    --------------------------
    El proyecto vive en Google Drive, pero su sistema de ficheros virtual no
    soporta lo que npm y Vite necesitan: escritura masiva de ficheros pequeños,
    enlaces simbólicos y vigilancia fiable de cambios. Un `npm install` sobre
    la unidad de Drive falla (TAR_ENTRY_ERROR / EBADF) y deja node_modules a
    medias.

    La solución es separar los dos papeles:
      · Drive  guarda el código fuente (y lo sincroniza)
      · C:     guarda node_modules y ejecuta el servidor

    Uso:
        .\dev.ps1              # sincroniza y arranca el servidor (3002)
        .\dev.ps1 -Build       # comprueba tipos y compila
        .\dev.ps1 -Pages       # compila para GitHub Pages y deja docs\ listo
        .\dev.ps1 -Back        # devuelve cambios de la copia local a Drive
#>

param(
    [switch]$Build,
    [switch]$Back,
    [switch]$Pages
)

$ErrorActionPreference = 'Stop'

$Source = $PSScriptRoot
$Local  = "$env:USERPROFILE\practicas-v4-node"
$Puerto = 3002

function Sync-ToLocal {
    Write-Host 'Sincronizando codigo -> disco local...' -ForegroundColor Cyan

    if (Test-Path "$Local\src") { Remove-Item "$Local\src" -Recurse -Force }
    Copy-Item "$Source\src" "$Local\src" -Recurse -Force

    if (Test-Path "$Source\public") {
        if (Test-Path "$Local\public") { Remove-Item "$Local\public" -Recurse -Force }
        Copy-Item "$Source\public" "$Local\public" -Recurse -Force
    }

    foreach ($f in @('index.html', 'package.json', 'vite.config.ts',
                     'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json')) {
        if (Test-Path "$Source\$f") { Copy-Item "$Source\$f" $Local -Force }
    }

    # .env.local lleva el Client ID de Google: sin el, el boton de entrar no va
    if (Test-Path "$Source\.env.local") {
        Copy-Item "$Source\.env.local" $Local -Force
    } else {
        Write-Warning 'Falta .env.local — el acceso con Google no funcionara.'
    }

    # Google Drive deja estos ficheros ocultos por todas partes y Vite intenta
    # servirlos como si fueran codigo
    Get-ChildItem $Local -Recurse -Force -Filter 'desktop.ini' -ErrorAction SilentlyContinue |
        Remove-Item -Force -ErrorAction SilentlyContinue
}

<#
    Libera el puerto antes de arrancar.

    Windows permite que dos procesos escuchen el mismo puerto si uno se ata a
    IPv4 (0.0.0.0) y otro al loopback IPv6 (::1). El navegador resuelve
    "localhost" a ::1 primero, asi que acabas viendo un servidor distinto del
    que crees, sirviendo el bundle antiguo.
#>
function Clear-Port {
    param([int]$Port)

    $pids = netstat -ano |
        Select-String 'LISTENING' |
        Select-String ":$Port\s" |
        ForEach-Object { ($_ -split '\s+' | Where-Object { $_ })[-1] } |
        Sort-Object -Unique

    foreach ($procId in $pids) {
        Write-Host "Cerrando servidor previo en el puerto $Port (pid $procId)" -ForegroundColor Yellow
        taskkill /PID $procId /F 2>&1 | Out-Null
    }
    if ($pids) { Start-Sleep -Milliseconds 800 }
}

function Sync-ToDrive {
    Write-Host 'Devolviendo cambios disco local -> Drive...' -ForegroundColor Cyan
    robocopy "$Local\src" "$Source\src" /MIR /R:2 /W:1 /NFL /NDL /NJH /NJS /NP | Out-Null
    if ($LASTEXITCODE -ge 8) { throw "robocopy fallo con codigo $LASTEXITCODE" }
    Write-Host 'Hecho.' -ForegroundColor Green
}

if ($Back) { Sync-ToDrive; return }

if (-not (Test-Path "$Local\node_modules\vite\bin\vite.js")) {
    Write-Host 'Falta node_modules en la copia local. Instalando...' -ForegroundColor Yellow
    New-Item -ItemType Directory -Force $Local | Out-Null
    Copy-Item "$Source\package.json" $Local -Force
    Push-Location $Local
    npm install --no-audit --no-fund
    Pop-Location
}

Sync-ToLocal
Push-Location $Local

if ($Pages) {
    # GitHub Pages sirve el sitio bajo /<repositorio>/, no en la raiz del
    # dominio. Sin esta base, el HTML pide sus recursos a la raiz y Pages
    # responde 404: la pagina sale en blanco sin ningun error a la vista.
    $env:PAGES_BASE = '/practicas/'

    Write-Host 'Comprobando tipos...' -ForegroundColor Cyan
    node 'node_modules\typescript\lib\tsc.js' --noEmit -p tsconfig.app.json
    if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Hay errores de tipos.' }

    Write-Host "Compilando para GitHub Pages (base $env:PAGES_BASE)..." -ForegroundColor Cyan
    node 'node_modules\vite\bin\vite.js' build
    if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Fallo la compilacion.' }
    Remove-Item Env:\PAGES_BASE

    Pop-Location

    # Se publica desde docs\ en la rama main: no hace falta una rama aparte
    $docs = Join-Path $Source 'docs'
    if (-not (Test-Path $docs)) { New-Item -ItemType Directory -Force $docs | Out-Null }
    robocopy "$Local\dist" "$docs" /MIR /R:2 /W:1 /NFL /NDL /NJH /NJS /NP | Out-Null
    # robocopy devuelve 1 cuando copia algo: sin esto, el script termina con
    # codigo de error aunque todo haya ido bien
    if ($LASTEXITCODE -lt 8) { $global:LASTEXITCODE = 0 }

    # Sin este fichero, Pages pasa el sitio por Jekyll y descarta lo que
    # empiece por guion bajo
    New-Item -ItemType File -Force (Join-Path $docs '.nojekyll') | Out-Null

    # Aplicacion de una sola pagina: cualquier ruta desconocida debe devolver
    # el mismo index.html en lugar del 404 de GitHub
    Copy-Item (Join-Path $docs 'index.html') (Join-Path $docs '404.html') -Force

    Write-Host ''
    Write-Host "Version publicable lista en: $docs" -ForegroundColor Green
    Write-Host 'Ahora: git add docs && git commit && git push' -ForegroundColor Cyan
    Write-Host 'Y en GitHub: Settings -> Pages -> Source: main / docs'
    return
}

if ($Build) {
    Write-Host 'Comprobando tipos...' -ForegroundColor Cyan
    node 'node_modules\typescript\lib\tsc.js' --noEmit -p tsconfig.app.json
    if ($LASTEXITCODE -ne 0) { Pop-Location; throw 'Hay errores de tipos.' }

    Write-Host 'Generando build de produccion...' -ForegroundColor Cyan
    node 'node_modules\vite\bin\vite.js' build
    Write-Host "Build en $Local\dist" -ForegroundColor Green
} else {
    Clear-Port -Port $Puerto
    Write-Host "Servidor en http://localhost:$Puerto  (Ctrl+C para parar)" -ForegroundColor Green
    Write-Host 'Desde el movil: usa la direccion "Network" que imprime Vite.' -ForegroundColor Cyan
    node 'node_modules\vite\bin\vite.js' --port $Puerto --strictPort --host
}

Pop-Location
