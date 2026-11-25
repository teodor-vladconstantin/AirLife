# One command, two clicks:
#   1) run:  powershell -File scripts/vercel-env-from-clipboard.ps1
#   2) in Stripe (Sandbox) click the copy icon next to the secret key (sk_test_...)
#   3) in Stripe (Sandbox) Webhooks > airlife-checkout: reveal + copy the signing secret (whsec_...)
# The script waits for each value to show up in the clipboard, validates the prefix, stores it in Vercel Production,
# then pushes an empty commit so Vercel redeploys with the new variables.
Set-Location (Join-Path $PSScriptRoot "..")

function Wait-Clip($pattern, $label) {
  Write-Host "Waiting for $label in the clipboard (copy it from Stripe now)..."
  for ($i = 0; $i -lt 180; $i++) {
    $v = (Get-Clipboard -Raw)
    if ($v) { $v = $v.Trim(); if ($v -match $pattern) { return $v } }
    Start-Sleep -Seconds 1
  }
  throw "Timed out waiting for $label"
}

function Set-Env($name, $value) {
  npx vercel env rm $name production --yes 2>$null | Out-Null
  $value | npx vercel env add $name production --yes
}

$sk = Wait-Clip '^sk_test_[A-Za-z0-9_]{20,}$' "STRIPE_SECRET_KEY (sk_test_...)"
Set-Env "STRIPE_SECRET_KEY" $sk
$whsec = Wait-Clip '^whsec_[A-Za-z0-9]{20,}$' "STRIPE_WEBHOOK_SECRET (whsec_...)"
Set-Env "STRIPE_WEBHOOK_SECRET" $whsec

git commit --allow-empty -m "Redeploy: Stripe sandbox env vars"
git push origin next-migration
git push origin next-migration:main
Write-Host "DONE. Tell Claude 'gata'."
