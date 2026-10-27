"""Reusable layout helpers that emit real <text> SVG fragments and track a
vertical cursor, mirroring the CSS box model of index-v2.html closely enough
that the rendered result matches it. Coordinates are in the same px units as
the HTML build (canvas 794x1123, 56px side margins)."""
import re
from xml.sax.saxutils import escape
from wrap import wrap as wrap_text

BRAND = "#3355FF"
BRAND_600 = "#2944CC"
BRAND_700 = "#1F3399"
INFO_SUBTLE = "#D6DDFF"
INK = "#0D0D0D"
BODY = "#4D4D4D"
MUTED = "#808080"
DIVIDER = "#E5E5E5"
CARD_BG = "#F9FAFB"
BG = "#FFFFFF"

PAGE_W, PAGE_H = 794, 1123
MARGIN = 56
CONTENT_X = MARGIN
CONTENT_W = PAGE_W - 2 * MARGIN
CONTENT_RIGHT = PAGE_W - MARGIN

LOGO_VB_W, LOGO_VB_H = 218, 50

FONT_USAGE = []  # (family, weight, text) tuples collected as the slide is built


def _use(family, weight, text):
    FONT_USAGE.append((family, weight, text))


def reset_font_usage():
    FONT_USAGE.clear()


def _inline_logo_paths(svg_path: str) -> str:
    raw = open(svg_path).read()
    inner = re.search(r"<svg[^>]*>(.*)</svg>", raw, re.S).group(1)
    return inner


import os as _os
_SKILL_ROOT = _os.path.abspath(_os.path.join(_os.path.dirname(__file__), "..", ".."))
LOGO_WHITE_INNER = _inline_logo_paths(_os.path.join(_SKILL_ROOT, "assets", "logo", "Logo.svg"))
LOGO_DARK_INNER = _inline_logo_paths(_os.path.join(_SKILL_ROOT, "assets", "logo", "Logo-dark.svg"))


def logo(x, y, height, dark=False):
    scale = height / LOGO_VB_H
    inner = LOGO_DARK_INNER if dark else LOGO_WHITE_INNER
    return f'<g transform="translate({x},{y}) scale({scale:.5f})">{inner}</g>'


def text_line(x, y_baseline, text, family, weight, size, color, letter_spacing=0.0,
              anchor="start", transform=None, opacity=None, uppercase=False):
    _use(family, weight, text)
    disp = text.upper() if uppercase else text
    ls = f' letter-spacing="{letter_spacing}"' if letter_spacing else ""
    op = f' opacity="{opacity}"' if opacity is not None else ""
    tr = f' transform="{transform}"' if transform else ""
    return (f'<text x="{x:.2f}" y="{y_baseline:.2f}" font-family="{family}" font-weight="{weight}" '
            f'font-size="{size}" fill="{color}" text-anchor="{anchor}"{ls}{op}{tr}>{escape(disp)}</text>')


def text_block(x, y_top, width, text, family, weight, size, color, line_height_mult,
               letter_spacing=0.0, ascent_ratio=0.83):
    """Wraps `text` to `width`, emits one <text> per line. Returns (svg, total_height)."""
    lines = wrap_text(text, family, weight, size, width, letter_spacing)
    line_h = size * line_height_mult
    baseline0 = y_top + size * ascent_ratio
    parts = []
    for i, line in enumerate(lines):
        y = baseline0 + i * line_h
        parts.append(text_line(x, y, line, family, weight, size, color, letter_spacing))
    return "\n".join(parts), len(lines) * line_h


def rect(x, y, w, h, fill, rx=0, opacity=None):
    op = f' fill-opacity="{opacity}"' if opacity is not None else ""
    return f'<rect x="{x:.2f}" y="{y:.2f}" width="{w:.2f}" height="{h:.2f}" rx="{rx}" fill="{fill}"{op}/>'


def line(x1, y1, x2, y2, stroke, width=1):
    return f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{stroke}" stroke-width="{width}"/>'


def circle(cx, cy, r, fill):
    return f'<circle cx="{cx:.2f}" cy="{cy:.2f}" r="{r}" fill="{fill}"/>'


# ---- page chrome -----------------------------------------------------------

def header_chrome(run_title):
    parts = [logo(MARGIN, 44, 18, dark=True)]
    tw_svg, _ = "", 0
    from wrap import text_width
    w = text_width(run_title, "Gilroy", 600, 11, letter_spacing=0.44)
    parts.append(text_line(CONTENT_RIGHT - w, 44 + 13, run_title, "Gilroy", 600, 11, MUTED,
                            letter_spacing=0.44, uppercase=True))
    parts.append(line(MARGIN, 84, CONTENT_RIGHT, 84, DIVIDER, 1))
    return "\n".join(parts)


def footer_chrome(page_num):
    y_rule = PAGE_H - 56
    y_text = PAGE_H - 30 + 4
    from wrap import text_width
    num = f"{page_num:02d}"
    w = text_width(num, "Gilroy", 500, 10)
    parts = [
        line(MARGIN, y_rule, CONTENT_RIGHT, y_rule, DIVIDER, 1),
        text_line(MARGIN, y_text, "cleartax.com", "Gilroy", 500, 10, MUTED),
        text_line(CONTENT_RIGHT - w, y_text, num, "Gilroy", 500, 10, MUTED),
    ]
    return "\n".join(parts)


def sec_head(y_top, text):
    svg1, h = text_block(CONTENT_X, y_top, CONTENT_W, text, "Nohemi", 700, 24, BRAND, 1.15)
    y = y_top + h + 8
    svg2 = rect(CONTENT_X, y, 38, 4, BRAND, rx=2)
    y += 4 + 18
    return svg1 + "\n" + svg2, y


def sub_head(y_cursor, text):
    # y_cursor already carries the preceding block's trailing gap (paragraph's +12);
    # CSS adjacent margins collapse to max(prev, 56), so only top up the difference.
    y_top = y_cursor + 44
    svg, h = text_block(CONTENT_X, y_top, CONTENT_W, text, "Nohemi", 700, 18, INK, 1.2)
    y = y_top + h + 12
    return svg, y


def paragraph(y_cursor, text, width=CONTENT_W, x=CONTENT_X):
    svg, h = text_block(x, y_cursor, width, text, "Gilroy", 400, 13.5, BODY, 1.62)
    y = y_cursor + h + 12
    return svg, y


def stat_row(y_cursor, stats):
    """stats: list of (number, label) triples of length 3."""
    gap = 12
    card_w = (CONTENT_W - 2 * gap) / 3
    pad_x, pad_y = 14, 16
    parts = []
    max_h = 0
    card_blocks = []
    for i, (num, lbl) in enumerate(stats):
        cx = CONTENT_X + i * (card_w + gap)
        num_svg, num_h = text_block(cx + pad_x, y_cursor + pad_y, card_w - 2 * pad_x, num,
                                     "Nohemi", 700, 22, BRAND, 1.15)
        lbl_top = y_cursor + pad_y + num_h + 6
        lbl_svg, lbl_h = text_block(cx + pad_x, lbl_top, card_w - 2 * pad_x, lbl,
                                     "Gilroy", 400, 10.5, BODY, 1.4)
        card_h = pad_y + num_h + 6 + lbl_h + pad_y
        max_h = max(max_h, card_h)
        card_blocks.append((cx, num_svg, lbl_svg))
    for cx, num_svg, lbl_svg in card_blocks:
        parts.append(rect(cx, y_cursor, card_w, max_h, CARD_BG, rx=12))
    for cx, num_svg, lbl_svg in card_blocks:
        parts.append(num_svg)
        parts.append(lbl_svg)
    y = y_cursor + max_h + 16
    return "\n".join(parts), y


def row_card(y_cursor, title, desc):
    pad_x, pad_y = 18, 14
    title_svg, title_h = text_block(CONTENT_X + pad_x, y_cursor + pad_y, CONTENT_W - 2 * pad_x,
                                     title, "Nohemi", 600, 13.5, INK, 1.15)
    desc_top = y_cursor + pad_y + title_h + 4
    desc_svg, desc_h = text_block(CONTENT_X + pad_x, desc_top, CONTENT_W - 2 * pad_x,
                                   desc, "Gilroy", 400, 12, BODY, 1.5)
    card_h = pad_y + title_h + 4 + desc_h + pad_y
    svg = rect(CONTENT_X, y_cursor, CONTENT_W, card_h, CARD_BG, rx=12) + "\n" + title_svg + "\n" + desc_svg
    y = y_cursor + card_h + 9
    return svg, y


def flow_timeline(y_cursor, steps):
    # y_cursor already carries the preceding paragraph's trailing +12; CSS adjacent
    # margins collapse to max(prev, 14), so only top up the difference.
    y_top = y_cursor + 2
    step_h = 14 + 10 + 9 + 9  # approx label line height(14*1.0) + paddings; computed per-step below
    parts = []
    y = y_top
    cy_list = []
    for i, label in enumerate(steps):
        pad = 9
        dot_r = 5
        row_top = y + pad
        cy = row_top + 7  # visually center dot with 14px label line (~ baseline-7)
        cy_list.append(cy)
        parts.append(circle(CONTENT_X + 4, cy, dot_r, BRAND))
        label_svg, label_h = text_block(CONTENT_X + 4 + dot_r + 14, row_top - 2, CONTENT_W - 32,
                                         label, "Nohemi", 700, 14, INK, 1.2)
        parts.append(label_svg)
        y = row_top + max(label_h, dot_r * 2) + pad
    for i in range(len(cy_list) - 1):
        parts.append(line(CONTENT_X + 4, cy_list[i] + 5, CONTENT_X + 4, cy_list[i + 1] - 5, DIVIDER, 2))
    y_final = y_cursor + (y - y_cursor) + 14
    return "\n".join(parts), y_final


def cmp_table(y_cursor, header, rows):
    col1_w = CONTENT_W * 0.5
    col2_x = CONTENT_X + col1_w
    col2_w = CONTENT_W - col1_w
    pad_x, pad_y = 12, 9
    y = y_cursor + 12
    header_h = pad_y * 2 + 11 * 1.2
    parts = [rect(CONTENT_X, y, CONTENT_W, header_h, INFO_SUBTLE, rx=8)]
    parts.append(text_line(CONTENT_X + pad_x, y + pad_y + 9, header[0], "Gilroy", 600, 11, BRAND_700,
                            letter_spacing=0.33, uppercase=True))
    parts.append(text_line(col2_x + pad_x, y + pad_y + 9, header[1], "Gilroy", 600, 11, BRAND_700,
                            letter_spacing=0.33, uppercase=True))
    y += header_h
    for i, (c1, c2) in enumerate(rows):
        cell_pad_y = 11
        c1_svg, c1_h = text_block(CONTENT_X + pad_x, y + cell_pad_y, col1_w - 2 * pad_x, c1,
                                   "Gilroy", 400, 12, BODY, 1.5)
        c2_svg, c2_h = text_block(col2_x + pad_x, y + cell_pad_y, col2_w - 2 * pad_x, c2,
                                   "Gilroy", 400, 12, BODY, 1.5)
        row_h = cell_pad_y + max(c1_h, c2_h) + cell_pad_y
        parts.append(c1_svg)
        parts.append(c2_svg)
        y += row_h
        parts.append(line(CONTENT_X, y, CONTENT_RIGHT, y, DIVIDER, 1))
    y += 12
    return "\n".join(parts), y


def pullquote(y_cursor, text):
    y_top = y_cursor + 16 + 4
    svg, h = text_block(CONTENT_X + 20, y_top, CONTENT_W - 20, text, "Nohemi", 700, 16, BRAND_700, 1.4)
    bar_h = h + 8
    bar = rect(CONTENT_X, y_cursor + 16, 4, bar_h, BRAND, rx=2)
    y = y_cursor + 16 + bar_h + 16
    return bar + "\n" + svg, y
