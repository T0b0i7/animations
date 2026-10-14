$ErrorActionPreference = "Continue"
$animDir = "C:\Users\Eucher O. ABATTI\Music\Projets Externes\animations"
$tmp = "C:\Users\Eucher O. ABATTI\AppData\Local\Temp\opencode\bg-migrate"
New-Item -ItemType Directory -Path $tmp -Force | Out-Null
$log = "$tmp\bg.log"
"BG START $(Get-Date)" | Out-File $log -Append

function Download-WithRetry($repo, $branch, $outZip) {
  $url = "https://codeload.github.com/T0b0i7/$repo/zip/refs/heads/$branch"
  for ($i=1; $i -le 5; $i++) {
    "[$repo] try $i $url" | Out-File $log -Append
    try {
      Remove-Item $outZip -Force -ErrorAction SilentlyContinue
      Invoke-WebRequest -Uri $url -OutFile $outZip
      $size = (Get-Item $outZip).Length
      "[$repo] downloaded $size bytes" | Out-File $log -Append
      if ($size -gt 1000000) { return $true }
    } catch { "[$repo] fail: $_" | Out-File $log -Append; Start-Sleep -Seconds 10 }
  }
  return $false
}

$jobs = @(
  @{repo="gicoth-galaxy-celebration-hbd"; branch="main"; dest="gicoth-galaxy-hbd"},
  @{repo="peace-bloodness-hbd"; branch="master"; dest="peace-bloodness-hbd"},
  @{repo="ursulesowolabi-hbd"; branch="main"; dest="ursule-sowolabi-hbd"}
)

Set-Location $animDir
git config user.email "t0b0i7@users.noreply.github.com"
git config user.name "T0b0i7"

foreach ($j in $jobs) {
  $zip = "$tmp\$($j.dest).zip"
  $unz = "$tmp\$($j.dest)-unz"
  if (Download-WithRetry $j.repo $j.branch $zip) {
    try {
      Remove-Item $unz -Recurse -Force -ErrorAction SilentlyContinue
      Expand-Archive -Path $zip -DestinationPath $unz -Force
      $src = (Get-ChildItem $unz -Directory | Select-Object -First 1).FullName
      Set-Location $src
      npm install --no-audit --no-fund 2>&1 | Out-File $log -Append
      npx vite build --base=./ 2>&1 | Out-File $log -Append
      $dist = Join-Path $src "dist"
      if (Test-Path $dist) {
        Set-Location $animDir
        Get-ChildItem "$animDir\$($j.dest)" -Recurse | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
        New-Item -ItemType Directory -Path "$animDir\$($j.dest)" -Force | Out-Null
        Copy-Item -Path "$dist\*" -Destination "$animDir\$($j.dest)" -Recurse -Force
        git add -A
        git commit -m "feat: migre $($j.dest) (build Vite BG)" 2>&1 | Out-File $log -Append
        git push origin main 2>&1 | Out-File $log -Append
        "[$($j.dest)] PUSHED $(Get-Date)" | Out-File $log -Append
      } else { "[$($j.dest)] no dist" | Out-File $log -Append }
    } catch { "[$($j.dest)] ERROR: $_" | Out-File $log -Append }
  } else { "[$($j.dest)] download failed after retries" | Out-File $log -Append }
  Set-Location $animDir
}
"BG DONE $(Get-Date)" | Out-File $log -Append
