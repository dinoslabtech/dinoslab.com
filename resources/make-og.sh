#!/usr/bin/env bash
# One-off raster for public/og.png. Not a site runtime dependency.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
out="$root/public/og.png"
html="$root/resources/og.html"
rm -f "$out"
profile="$(mktemp -d /tmp/ff-og-XXXXXX)"
cleanup() { rm -rf "$profile"; }
trap cleanup EXIT
MOZ_HEADLESS=1 firefox --headless --profile "$profile" \
  --window-size=1200,630 \
  --screenshot="$out" \
  "file://$html"
python3 - "$out" <<'PY'
import struct, sys
path = sys.argv[1]
with open(path, "rb") as f:
    sig = f.read(8)
    if sig != b"\x89PNG\r\n\x1a\n":
        raise SystemExit(f"{path} is not a PNG")
    length, chunk = struct.unpack(">I4s", f.read(8))
    if chunk != b"IHDR":
        raise SystemExit("missing IHDR")
    width, height = struct.unpack(">II", f.read(8))
print(f"{path} {width}x{height}")
if (width, height) != (1200, 630):
    raise SystemExit(f"expected 1200x630, got {width}x{height}")
PY
