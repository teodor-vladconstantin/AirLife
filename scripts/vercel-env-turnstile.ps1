# Turnstile keys -> Vercel Production. One command, two clicks:
#   1) run:  powershell -File scripts/vercel-env-turnstile.ps1
#   2) Cloudflare > Turnstile > your widget > Widget Keys: click "Click to copy" under SITE key
#   3) then click "Click to copy" under SECRET key (use the ROTATED secret, the old one was exposed in chat)
# Order matters: both keys start with 0x4, so the script takes the first value as site key and the NEXT different one as secret.
Set-Location (Join-Path $PSScriptRoot "..")

function Wait-Clip($label, $notEqual) {
  Write-Host "Waiting for $label in the clipboard (copy it from Cloudflare now)..."
  for ($i = 0; $i -lt 240; $i++) {
    $v = Get-Clipboard -Raw
    if ($v) {
      $v = $v.Trim()
      if ($v -match '^0x4[A-Za-z0-9_-]{15,60}$' -and $v -ne $notEqual) { return $v }
    }
    Start-Sleep -Seconds 1
  }
  throw "Timed out waiting for $label"
}

function Set-Env($name, $value) {
  npx vercel env rm $name production --yes 2>$null | Out-Null
  $value | npx vercel env add $name production --yes
}

$site = Wait-Clip "SITE key (NEXT_PUBLIC_TURNSTILE_SITE_KEY)" ""
Set-Env "NEXT_PUBLIC_TURNSTILE_SITE_KEY" $site
$secret = Wait-Clip "SECRET key (TURNSTILE_SECRET_KEY), a different value than the site key" $site
Set-Env "TURNSTILE_SECRET_KEY" $secret

git commit --allow-empty -m "Redeploy: Turnstile env vars"
git push origin next-migration
git push origin next-migration:main
Write-Host "DONE. Tell Claude 'gata' and it will verify the widget on the live forms."
