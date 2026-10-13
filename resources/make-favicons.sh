#!/usr/bin/env bash
# One-off rasters for the browser icon. Not a site runtime dependency.
# The served SVG is the canonical Mark. PNGs and the ICO sit on canvas #121817
# so apple-touch and fallback icons keep an approved opaque ground.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
mark="$root/public/mark.svg"
bg="#121817"

cp "$mark" "$root/public/favicon.svg"

for size in 16 32 48; do
  rsvg-convert -w "$size" -h "$size" -b "$bg" "$mark" -o "$root/public/favicon-${size}.png"
done

magick \
  "$root/public/favicon-16.png" \
  "$root/public/favicon-32.png" \
  "$root/public/favicon-48.png" \
  "$root/public/favicon.ico"

rsvg-convert -w 180 -h 180 -b "$bg" "$mark" -o "$root/public/apple-touch-icon.png"

python3 - "$root" <<'PY'
from pathlib import Path
import sys
from PIL import Image

root = Path(sys.argv[1])
brand = (0x2D, 0x92, 0x82)
canvas = (0x12, 0x18, 0x17)
expected = {
    "public/favicon-16.png": (16, 16),
    "public/favicon-32.png": (32, 32),
    "public/favicon-48.png": (48, 48),
    "public/apple-touch-icon.png": (180, 180),
}

svg = (root / "public/favicon.svg").read_text()
if 'fill="#2D9282"' not in svg:
    raise SystemExit("favicon.svg is missing Brand green #2D9282")
if 'fill="#0F5F53"' in svg:
    raise SystemExit("favicon.svg still uses the superseded green")

for rel, size in expected.items():
    path = root / rel
    image = Image.open(path).convert("RGBA")
    if image.size != size:
        raise SystemExit(f"{path} expected {size}, got {image.size}")
    pixels = image.load()
    width, height = image.size
    colors = {
        pixels[x, y][:3]
        for y in range(height)
        for x in range(width)
        if pixels[x, y][3] > 200
    }
    if canvas not in colors:
        raise SystemExit(f"{path} is missing canvas #121817")
    # 16px antialiases the Mark so the exact Brand-green hex may not survive.
    if brand not in colors and rel != "public/favicon-16.png":
        raise SystemExit(f"{path} is missing Brand green #2D9282")
    print(f"{path} {image.size[0]}x{image.size[1]}")

ico = root / "public/favicon.ico"
if not ico.is_file() or ico.stat().st_size < 100:
    raise SystemExit("favicon.ico is missing or empty")
print(f"{ico} {ico.stat().st_size} bytes")
PY
