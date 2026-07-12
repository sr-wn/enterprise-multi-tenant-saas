$ErrorActionPreference = "Stop"

$envFile = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envFile)) {
    Write-Error "Missing $envFile. Copy the values you need into backend/.env (git-ignored)."
}

Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith("#")) {
        $parts = $line -split "=", 2
        if ($parts.Length -eq 2) {
            [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim())
        }
    }
}

$jar = Join-Path $PSScriptRoot "target/backend-0.0.1-SNAPSHOT.jar"
if (-not (Test-Path $jar)) {
    Write-Error "Jar not found at $jar. Build it first: ./mvnw clean package -DskipTests"
}

Write-Output "Starting backend with environment variables from .env ..."
java -jar $jar --spring.profiles.active=dev
