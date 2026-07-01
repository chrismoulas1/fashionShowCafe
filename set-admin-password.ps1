<#
.SYNOPSIS
    Sets a new admin password for the Fashion Show Cafe admin login.

.DESCRIPTION
    Prompts for a new password, generates a bcrypt hash using the project's
    Node.js runtime, updates ADMIN_PASSWORD in .env.local, and restarts the
    Next.js service (supports PM2, Windows Service, or a plain npm process).

.PARAMETER Password
    Optional. Supply the new password directly (useful for automation).
    If omitted the script will prompt interactively.

.PARAMETER ServiceName
    Optional. Name of a Windows Service that runs the app (e.g. "fashionShowCafe").
    When supplied the script restarts that service instead of using PM2 / npm.

.PARAMETER Pm2AppName
    Optional. PM2 process name / id (e.g. "fashionShowCafe").
    When supplied (and no ServiceName given) the script uses PM2 to restart.

.EXAMPLE
    .\set-admin-password.ps1
    .\set-admin-password.ps1******
    .\set-admin-password.ps1 -Pm2AppName "fashionShowCafe"
    .\set-admin-password.ps1 -ServiceName "fashionShowCafe"
#>

[CmdletBinding()]
param(
    [string]$Password,
    [string]$ServiceName,
    [string]$Pm2AppName
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

function Write-Step([string]$msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-Ok([string]$msg)   { Write-Host "    [OK] $msg" -ForegroundColor Green }
function Write-Err([string]$msg)  { Write-Host "    [ERROR] $msg" -ForegroundColor Red }

# ---------------------------------------------------------------------------
# Locate project root (directory containing this script)
# ---------------------------------------------------------------------------

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$EnvFile     = Join-Path $ProjectRoot ".env.local"

Write-Step "Project root: $ProjectRoot"

# ---------------------------------------------------------------------------
# Ensure .env.local exists
# ---------------------------------------------------------------------------

if (-not (Test-Path $EnvFile)) {
    $ExampleEnv = Join-Path $ProjectRoot ".env.local.example"
    if (Test-Path $ExampleEnv) {
        Write-Step "No .env.local found – copying from .env.local.example"
        Copy-Item $ExampleEnv $EnvFile
        Write-Ok "Created $EnvFile"
    } else {
        Write-Err ".env.local not found and no .env.local.example to copy from."
        Write-Err "Please create .env.local before running this script."
        exit 1
    }
}

# ---------------------------------------------------------------------------
# Collect new password
# ---------------------------------------------------------------------------

Write-Step "New admin password"

if (-not $Password) {
    $SecurePass  = Read-Host "Enter new admin password" -AsSecureString
    $SecurePass2 = Read-Host "Confirm new admin password" -AsSecureString

    $Plain1 = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePass))
    $Plain2 = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecurePass2))

    if ($Plain1 -ne $Plain2) {
        Write-Err "Passwords do not match. Aborting."
        exit 1
    }

    if ($Plain1.Length -lt 8) {
        Write-Err "Password must be at least 8 characters. Aborting."
        exit 1
    }

    $Password = $Plain1
}

# ---------------------------------------------------------------------------
# Generate bcrypt hash via Node.js (bcryptjs is a project dependency)
# ---------------------------------------------------------------------------

Write-Step "Hashing password with bcrypt (salt rounds = 12)"

$NodeScript = @"
const bcrypt = require('bcryptjs');
bcrypt.hash(process.argv[1], 12, (err, hash) => {
  if (err) { process.stderr.write(err.message); process.exit(1); }
  process.stdout.write(hash);
});
"@

$TempJs = Join-Path ([System.IO.Path]::GetTempPath()) "hash_password_$([System.Guid]::NewGuid().ToString('N')).js"

try {
    Set-Content -Path $TempJs -Value $NodeScript -Encoding UTF8

    $NodeExe = "node"
    $HashResult = & $NodeExe $TempJs $Password 2>&1

    if ($LASTEXITCODE -ne 0) {
        Write-Err "Node.js failed to generate hash: $HashResult"
        exit 1
    }

    $BcryptHash = $HashResult.Trim()

    if (-not $BcryptHash.StartsWith('$2')) {
        Write-Err "Unexpected hash output: $BcryptHash"
        exit 1
    }

    Write-Ok "Hash generated successfully."
}
finally {
    if (Test-Path $TempJs) { Remove-Item $TempJs -Force }
}

# ---------------------------------------------------------------------------
# Update ADMIN_PASSWORD in .env.local
# ---------------------------------------------------------------------------

Write-Step "Updating ADMIN_PASSWORD in $EnvFile"

$EnvContent = Get-Content $EnvFile -Raw

if ($EnvContent -match '(?m)^ADMIN_PASSWORD=') {
    # Replace existing value
    $EnvContent = $EnvContent -replace '(?m)^ADMIN_PASSWORD=.*', "ADMIN_PASSWORD=$BcryptHash"
    Write-Ok "Replaced existing ADMIN_PASSWORD entry."
} else {
    # Append new entry
    $EnvContent = $EnvContent.TrimEnd() + "`nADMIN_PASSWORD=$BcryptHash`n"
    Write-Ok "Appended ADMIN_PASSWORD entry."
}

Set-Content -Path $EnvFile -Value $EnvContent -NoNewline -Encoding UTF8
Write-Ok ".env.local saved."

# ---------------------------------------------------------------------------
# Restart the service / process
# ---------------------------------------------------------------------------

Write-Step "Restarting the Next.js service"

if ($ServiceName) {
    # ---- Windows Service ----
    $svc = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
    if (-not $svc) {
        Write-Err "Windows Service '$ServiceName' not found. Skipping restart."
        Write-Host "    Start the app manually: npm run start" -ForegroundColor Yellow
    } else {
        Restart-Service -Name $ServiceName -Force
        Write-Ok "Windows Service '$ServiceName' restarted."
    }

} elseif ($Pm2AppName) {
    # ---- PM2 ----
    $pm2 = Get-Command pm2 -ErrorAction SilentlyContinue
    if (-not $pm2) {
        Write-Err "PM2 not found in PATH. Skipping restart."
        Write-Host "    Install PM2 globally: npm install -g pm2" -ForegroundColor Yellow
    } else {
        & pm2 restart $Pm2AppName
        if ($LASTEXITCODE -eq 0) {
            Write-Ok "PM2 process '$Pm2AppName' restarted."
        } else {
            Write-Err "PM2 restart failed (exit code $LASTEXITCODE)."
        }
    }

} else {
    # ---- Auto-detect PM2 ----
    $pm2 = Get-Command pm2 -ErrorAction SilentlyContinue
    if ($pm2) {
        Write-Host "    PM2 detected. Attempting to restart all processes..." -ForegroundColor Yellow
        & pm2 restart all
        if ($LASTEXITCODE -eq 0) {
            Write-Ok "PM2 restarted all processes."
        } else {
            Write-Host "    PM2 restart did not succeed – you may need to restart manually." -ForegroundColor Yellow
        }
    } else {
        # ---- Kill existing node process and start fresh ----
        Write-Host "    Stopping any running 'next' Node processes..." -ForegroundColor Yellow
        Get-Process -Name "node" -ErrorAction SilentlyContinue |
            Where-Object { $_.MainWindowTitle -eq "" } |
            ForEach-Object {
                $cmdLine = (Get-CimInstance Win32_Process -Filter "ProcessId=$($_.Id)").CommandLine
                if ($cmdLine -match "next") {
                    Write-Host "    Stopping PID $($_.Id): $cmdLine" -ForegroundColor Yellow
                    Stop-Process -Id $_.Id -Force
                }
            }

        Write-Host "    Starting Next.js in background (npm run start)..." -ForegroundColor Yellow
        $startArgs = @{
            FilePath         = "npm"
            ArgumentList     = "run", "start"
            WorkingDirectory = $ProjectRoot
            WindowStyle      = "Hidden"
        }
        Start-Process @startArgs
        Write-Ok "Next.js started. Check the application at the configured URL."
    }
}

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------

Write-Host ""
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  Admin password updated successfully!" -ForegroundColor Green
Write-Host "  Log in at /admin/login with your new credentials." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host ""
