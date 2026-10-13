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
python3 - "$out" <<'PY'
from pathlib import Path
import sys
from PIL import Image

path = Path(sys.argv[1])
image = Image.open(path).convert("RGBA")
pixels = image.load()
width, height = image.size
colors = {
    pixels[x, y][:3]
    for y in range(height)
    for x in range(width)
    if pixels[x, y][3] > 200
}
brand = (0x2D, 0x92, 0x82)
canvas = (0x12, 0x18, 0x17)
superseded_green = (0x0F, 0x5F, 0x53)
if brand not in colors:
    raise SystemExit(f"{path} is missing Brand green #2D9282")
if canvas not in colors:
    raise SystemExit(f"{path} is missing canvas #121817")
if superseded_green in colors:
    raise SystemExit(f"{path} still contains superseded green #0F5F53")
print(f"{path} has Brand green on canvas")
PY
