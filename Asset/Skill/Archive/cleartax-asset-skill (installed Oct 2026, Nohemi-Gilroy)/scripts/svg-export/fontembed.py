"""Subset + base64-embed the exact Nohemi/Gilroy weights used on one slide.

Mirrors Ad/Scripts/fontembed.py's approach: subset each font to only the
characters actually used on that slide, encode as base64 woff2, and return a
<style> block for the SVG <defs>. Keeps each slide file small and fully
self-contained (no local font install needed to see true brand type).
"""
import base64
import io
import os
from fontTools import subset

_SKILL_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
NOHEMI_DIR = os.path.join(_SKILL_ROOT, "assets", "fonts", "nohemi")
GILROY_DIR = os.path.join(_SKILL_ROOT, "assets", "fonts", "gilroy")

NOHEMI_FILES = {
    500: "Nohemi-Medium.ttf",
    600: "Nohemi-SemiBold.ttf",
    700: "Nohemi-Bold.ttf",
    800: "Nohemi-ExtraBold.ttf",
}
GILROY_FILES = {
    400: "Gilroy-Regular.otf",
    500: "Gilroy-Medium.otf",
    600: "Gilroy-Semibold.otf",
    700: "Gilroy-Bold.otf",
}


def _path(family: str, weight: int) -> str:
    if family == "Nohemi":
        return os.path.join(NOHEMI_DIR, NOHEMI_FILES[weight])
    if family == "Gilroy":
        return os.path.join(GILROY_DIR, GILROY_FILES[weight])
    raise ValueError(family)


def _subset_woff2(path: str, text: str) -> bytes:
    opts = subset.Options(flavor="woff2", desubroutinize=True)
    opts.drop_tables += ["TTFA"]
    font = subset.load_font(path, opts)
    s = subset.Subsetter(options=opts)
    s.populate(text=text + " ")
    s.subset(font)
    buf = io.BytesIO()
    font.save(buf)
    return buf.getvalue()


def face(family: str, weight: int, text: str) -> str:
    path = _path(family, weight)
    data = _subset_woff2(path, text)
    b64 = base64.b64encode(data).decode()
    return (
        "@font-face{font-family:'%s';font-weight:%d;"
        "src:url(data:font/woff2;base64,%s) format('woff2');}"
        % (family, weight, b64)
    )


def face_style(specs) -> str:
    """specs: list of (family, weight, text) tuples."""
    return "<style>" + "".join(face(*spec) for spec in specs) + "</style>"
