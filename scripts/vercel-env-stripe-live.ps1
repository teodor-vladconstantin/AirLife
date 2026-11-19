# Stripe LIVE keys -> Vercel Production. After this, airlife.ro takes REAL card payments.
#   1) Stripe (LIVE) > Developers > API keys: reveal + click the copy icon next to the SECRET key (sk_live_...)
#   2) Stripe (LIVE) > Webhooks > the airlife webhook: reveal + copy the signing secret (whsec_...)
#   3) run:  powershell -File scripts/vercel-env-stripe-live.ps1   (it waits for each value, validates it, then redeploys)
Set-Location (Join-Path $PSScriptRoot "..")

function Wait-Clip($pattern, $label) {
  Write-Host "Waiting for $label in the clipboard (copy it from Stripe LIVE now)..."
  for ($i = 0; $i -lt 240; $i++) {
    $v = Get-Clipboard -Raw
    if ($v) { $v = $v.Trim(); if ($v -match $pattern) { return $v } }
    Start-Sleep -Seconds 1
  }
  throw "Timed out waiting for $label"
}
function Set-Env($name, $value) {
  npx vercel env rm $name production --yes 2>$null | Out-Null
  $value | npx vercel env add $name production --yes
}

$sk = Wait-Clip '^sk_live_[A-Za-z0-9_]{20,}$' "STRIPE_SECRET_KEY (sk_live_...)"
Set-Env "STRIPE_SECRET_KEY" $sk
$wh = Wait-Clip '^whsec_[A-Za-z0-9]{20,}$' "STRIPE_WEBHOOK_SECRET (whsec_... of the LIVE webhook)"
Set-Env "STRIPE_WEBHOOK_SECRET" $wh

git commit --allow-empty -m "Redeploy: Stripe LIVE keys"
git push origin next-migration
git push origin next-migration:main
Write-Host "DONE. Live payments are on. Tell Claude 'gata' to verify."
