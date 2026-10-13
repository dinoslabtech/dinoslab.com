#!/usr/bin/env python3
"""Measure opaque sRGB pairs in the committed Signature Green Palette.

Run: python3 scripts/palette-contrast.py --palette src/styles/palette.css --fixed-brand
This checks authored colors, not rendered pixels, alpha overlays or whole-site compliance.
Copied from the identity repository's brand/preview/palette-contrast.py.
"""
from pathlib import Path
import argparse
import re


def luminance(value):
    channels = [int(value[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    linear = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in channels]
    return sum(c * w for c, w in zip(linear, (0.2126, 0.7152, 0.0722)))


def contrast(a, b):
    light, dark = sorted((luminance(a), luminance(b)), reverse=True)
    return (light + 0.05) / (dark + 0.05)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--palette",
        type=Path,
        default=Path(__file__).resolve().parents[1] / "src" / "styles" / "palette.css",
    )
    parser.add_argument("--fixed-brand", action="store_true", help="Check identical artwork ink and its approved grounds in both themes")
    args = parser.parse_args()
    css = args.palette.read_text()
    pairs = [(text, surface, 4.5) for text in ("text", "text-muted", "accent-text", "danger", "warning", "success", "info")
             for surface in ("bg-dark", "bg", "bg-light")]
    pairs += [("on-primary", state, 4.5) for state in ("primary", "primary-hover", "primary-active")]
    pairs += [("on-secondary", state, 4.5) for state in ("secondary", "secondary-hover")]
    pairs += [(role, surface, 3) for role in ("border", "focus-ring") for surface in ("bg-dark", "bg", "bg-light")]
    pairs += [("header-text", "header-bg", 4.5), ("mark-ink", "header-bg", 3)]
    if args.fixed_brand:
        pairs += [("mark-ink", surface, 3) for surface in ("bg-dark", "bg", "bg-light")]
        pairs += [(state, surface, 3) for state in ("primary", "primary-hover", "primary-active") for surface in ("bg-dark", "bg", "bg-light")]
    failures = []
    print("| Theme | Foreground | Background | Ratio | Target | Result |")
    print("| --- | --- | --- | ---: | ---: | --- |")
    for theme in ("dark", "light"):
        block = re.search(r'\[data-theme="' + theme + r'"\]\s*\{([^}]+)', css).group(1)
        values = dict(re.findall(r'--([\w-]+):\s*(#[0-9a-f]{6})', block))
        if args.fixed_brand:
            brand = re.search(r'--brand-green:\s*(#[0-9a-f]{6})', css).group(1)
            if values["mark-ink"] != brand:
                raise SystemExit(f"{theme} artwork ink differs from fixed Brand green")
        for foreground, background, target in pairs:
            ratio = contrast(values[foreground], values[background])
            passed = ratio >= target
            print(f"| {theme} | {foreground} | {background} | {ratio:.2f}:1 | {target}:1 | {'Pass' if passed else 'FAIL'} |")
            if not passed:
                failures.append((theme, foreground, background))
    if failures:
        raise SystemExit(f"Failed pairs: {failures}")


if __name__ == "__main__":
    main()
