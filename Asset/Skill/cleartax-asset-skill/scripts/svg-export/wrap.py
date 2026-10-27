"""Greedy word-wrap using real glyph metrics from the actual font files,
so SVG <tspan> line breaks match what the browser would have rendered."""
from PIL import ImageFont
from fontembed import _path

_CACHE = {}


def _font(family: str, weight: int, size_px: int):
    key = (family, weight, size_px)
    if key not in _CACHE:
        _CACHE[key] = ImageFont.truetype(_path(family, weight), size_px)
    return _CACHE[key]


def wrap(text: str, family: str, weight: int, size_px: float, max_width: float, letter_spacing: float = 0.0) -> list:
    font = _font(family, weight, round(size_px))
    words = text.split(" ")
    lines = []
    cur = ""
    for w in words:
        cand = w if not cur else cur + " " + w
        width = font.getlength(cand) + letter_spacing * len(cand)
        if width <= max_width or not cur:
            cur = cand
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def text_width(text: str, family: str, weight: int, size_px: float, letter_spacing: float = 0.0) -> float:
    font = _font(family, weight, round(size_px))
    return font.getlength(text) + letter_spacing * len(text)
