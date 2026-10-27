import base64
import math
import os
import sys
import components as C
from components import (
    CONTENT_X, CONTENT_W, CONTENT_RIGHT, PAGE_W, PAGE_H, MARGIN,
    BRAND, BRAND_600, BRAND_700, INFO_SUBTLE, INK, BODY, MUTED, DIVIDER, CARD_BG, BG,
)
from wrap import text_width
import fontembed

OUT_DIR = os.path.join(os.path.dirname(__file__), "out")
os.makedirs(OUT_DIR, exist_ok=True)

_SKILL_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
# Per-asset: point at whichever bundled cover background this asset uses.
STARS5_SOURCE = os.path.join(_SKILL_ROOT, "assets", "backgrounds", "stars", "Stars-5.jpg")
STARS5_SMALL = os.path.join(OUT_DIR, "_Stars-5-cover-src.jpg")


def _prepare_cover_source():
    """Downscale the source photo (avoids a multi-hundred-MB embedded SVG image)
    and strip EXIF orientation — Chrome's SVG <image> honors EXIF rotation even
    though its CSS background-image path doesn't, which otherwise renders this
    photo sheared/misaligned. Re-run whenever the source photo changes."""
    if os.path.exists(STARS5_SMALL):
        return
    from PIL import Image
    im = Image.open(STARS5_SOURCE).convert("RGB")
    scale = 1600 / max(im.size)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    im.save(STARS5_SMALL, quality=92, exif=b"")


def css_angle_dir(theta_deg):
    t = math.radians(theta_deg)
    return math.sin(t), -math.cos(t)


def grad_coords(theta_deg):
    dx, dy = css_angle_dir(theta_deg)
    return (0.5 - dx / 2, 0.5 - dy / 2, 0.5 + dx / 2, 0.5 + dy / 2)


def linear_gradient_def(gid, theta_deg, stops):
    x1, y1, x2, y2 = grad_coords(theta_deg)
    stop_tags = "".join(
        f'<stop offset="{off}" stop-color="{color}"' + (f' stop-opacity="{op}"' if op is not None else "") + "/>"
        for off, color, op in stops
    )
    return f'<linearGradient id="{gid}" x1="{x1:.4f}" y1="{y1:.4f}" x2="{x2:.4f}" y2="{y2:.4f}">{stop_tags}</linearGradient>'


def dot_pattern_def(pid, opacity=0.16, size=18, color="#ffffff"):
    return (f'<pattern id="{pid}" width="{size}" height="{size}" patternUnits="userSpaceOnUse">'
            f'<circle cx="{size/2}" cy="{size/2}" r="1" fill="{color}" fill-opacity="{opacity}"/></pattern>')


def wrap_svg(body, defs=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'width="{PAGE_W}" height="{PAGE_H}" viewBox="0 0 {PAGE_W} {PAGE_H}">'
            f'<defs>{defs}</defs>'
            f'<rect x="0" y="0" width="{PAGE_W}" height="{PAGE_H}" fill="{BG}"/>'
            f'{body}</svg>')


def embed_font_style():
    if not C.FONT_USAGE:
        return ""
    by_key = {}
    for family, weight, text in C.FONT_USAGE:
        by_key.setdefault((family, weight), []).append(text)
    specs = [(family, weight, "".join(texts)) for (family, weight), texts in by_key.items()]
    return fontembed.face_style(specs)


def closepanel(y_top, title, body_text, pill_text):
    pad = 26
    panel_bottom = PAGE_H
    panel_h = panel_bottom - y_top
    gid = "cta-grad"
    defs = linear_gradient_def(gid, 160, [(  "0%", BRAND_700, None), ("55%", BRAND, None), ("100%", BRAND_600, None)])
    pid = "cta-dots"
    defs += dot_pattern_def(pid)
    parts = [C.rect(CONTENT_X, y_top, CONTENT_W, panel_h, f"url(#{gid})", rx=16)]
    parts.append(f'<rect x="{CONTENT_X}" y="{y_top:.2f}" width="{CONTENT_W}" height="{panel_h:.2f}" rx="16" fill="url(#{pid})"/>')

    ty = y_top + pad
    title_svg, title_h = C.text_block(CONTENT_X + pad, ty, CONTENT_W - 2 * pad, title,
                                       "Nohemi", 700, 19, "#ffffff", 1.3)
    parts.append(title_svg)
    ty += title_h + 10
    body_svg, body_h = C.text_block(CONTENT_X + pad, ty, 560, body_text,
                                     "Gilroy", 400, 12.5, "rgba(255,255,255,0.88)", 1.55)
    parts.append(body_svg)
    ty += body_h + 16

    pill_pad_x = 22
    tw = text_width(pill_text, "Gilroy", 700, 12.5)
    C._use("Gilroy", 700, pill_text)
    pill_w = tw + 2 * pill_pad_x
    pill_h = 37
    parts.append(C.rect(CONTENT_X + pad, ty, pill_w, pill_h, "#ffffff", rx=999))
    parts.append(C.text_line(CONTENT_X + pad + pill_pad_x, ty + pill_h / 2 + 4.3, pill_text,
                              "Gilroy", 700, 12.5, BRAND_700))
    return "\n".join(parts), defs


def cover():
    C.reset_font_usage()
    title = "How Landmark Group Prepared Millions of Invoices for ZATCA Phase 2 with ClearTax"
    sub = ("3+ years of trusted partnership supporting 54M+ annual invoices — with zero invoice "
           "leakage and 100% business continuity, all while absorbing peak retail volumes.")

    _prepare_cover_source()
    from PIL import Image
    img_w, img_h = Image.open(STARS5_SMALL).size
    scale = max(PAGE_W / img_w, PAGE_H / img_h)
    dw, dh = img_w * scale, img_h * scale
    b64 = base64.b64encode(open(STARS5_SMALL, "rb").read()).decode()
    img_tag = f'<image x="0" y="0" width="{dw:.2f}" height="{dh:.2f}" href="data:image/jpeg;base64,{b64}"/>'

    scrim_gid = "cover-scrim"
    scrim_defs = linear_gradient_def(scrim_gid, 180, [
        ("0%", "#000000", 0.42), ("30%", "#000000", 0.18), ("60%", "#000000", 0.2), ("100%", "#000000", 0.55),
    ])
    scrim_rect = C.rect(0, 0, PAGE_W, PAGE_H, f"url(#{scrim_gid})")

    logo_svg = C.logo(MARGIN, 44, 32, dark=False)

    title_svg, title_h = C.text_block(MARGIN, 224, 668, title, "Nohemi", 700, 68, "#ffffff", 1.088,
                                       letter_spacing=-0.68)
    sub_top = 224 + title_h + 26
    sub_svg, _ = C.text_block(MARGIN, sub_top, 620, sub, "Gilroy", 500, 23, "#ffffff", 1.435)

    body = img_tag + scrim_rect + logo_svg + title_svg + sub_svg
    defs = scrim_defs
    svg = wrap_svg(body, defs)
    font_style = embed_font_style()
    svg = svg.replace(f'<defs>{defs}</defs>', f'<defs>{defs}</defs>{font_style}')
    return svg


def interior_page(page_num, run_title, blocks, footer=True, content_bottom0=False):
    """blocks: list of callables taking y_cursor -> (svg, new_y_cursor)."""
    C.reset_font_usage()
    parts = [C.header_chrome(run_title)]
    y = 130
    extra_defs = ""
    for b in blocks:
        result = b(y)
        if len(result) == 3:
            svg, y, defs = result
            extra_defs += defs
        else:
            svg, y = result
        parts.append(svg)
    if footer:
        parts.append(C.footer_chrome(page_num))
    body = "\n".join(parts)
    svg = wrap_svg(body, extra_defs)
    font_style = embed_font_style()
    svg = svg.replace(f'<defs>{extra_defs}</defs>', f'<defs>{extra_defs}</defs>{font_style}')
    return svg


def page2():
    def blocks_gen():
        def b1(y):
            return C.sec_head(y, "About Landmark Group")
        def b2(y):
            return C.paragraph(y, "Landmark Group operates one of the largest retail businesses across Saudi "
                                   "Arabia. Its operations span physical stores and digital commerce, serving "
                                   "millions of customers every year. Behind these operations is a technology "
                                   "landscape made up of multiple business systems, all working together to keep "
                                   "the business running smoothly.")
        def b3(y):
            return C.stat_row(y, [
                ("54 Million+", "Annual B2C invoices"),
                ("250,000+", "Annual B2B invoices"),
                ("POS · ERP · E-com", "Multiple integrated business systems"),
            ])
        def b4(y):
            return C.paragraph(y, "The business relies on Oracle Retail Point-of-Sale systems for both B2C and "
                                   "B2B transactions, along with e-commerce platforms and ERP systems such as "
                                   "OFIN and RMS. These systems support different parts of the business, while "
                                   "operating under a single group VAT registration with multiple Commercial "
                                   "Registration Numbers (CRNs).")
        def b5(y):
            return C.paragraph(y, "When ZATCA introduced Phase 2 of e-invoicing, Landmark Group had more to "
                                   "prepare than just a compliance solution. Every invoice generated across "
                                   "every business system had to meet regulatory requirements, while retail "
                                   "operations continued without disruption. The engagement focused on helping "
                                   "the business understand its existing landscape, identify compliance gaps, "
                                   "and build a roadmap for long-term regulatory readiness.")
        return [b1, b2, b3, b4, b5]
    return interior_page(2, "Landmark Group Case Study", blocks_gen())


def page3():
    def b1(y):
        return C.sec_head(y, "What Was the Requirement?")
    def b2(y):
        return C.paragraph(y, "On paper, the requirement looked simple — prepare for ZATCA Phase 2. In "
                               "reality, it was far more complex. Invoices originated from multiple independent "
                               "systems: retail stores through Oracle Retail POS, online orders through a "
                               "different journey, and ERP systems managing another part of the business. "
                               "Every system handled data differently, but all had to comply with the same "
                               "regulatory requirements.")
    def b3(y):
        return C.paragraph(y, "The scale made the challenge bigger still — up to 54 million B2C invoices and "
                               "around 250,000 B2B invoices every year, all without slowing down operations or "
                               "affecting customer experience. The engagement also involved a Wave 1 entity, "
                               "with no previous implementation references to follow. Retail-specific scenarios "
                               "— promotions, offers, and discount structures — added another layer of "
                               "complexity requiring careful ZATCA assessment.")
    def b4(y):
        return C.sub_head(y, "The Consequences It Had")
    def mk_row(title, desc):
        def f(y):
            return C.row_card(y, title, desc)
        return f
    blocks = [b1, b2, b3, b4,
              mk_row("No single compliance view",
                     "Different systems generated invoices independently, making it difficult to monitor "
                     "compliance across the business."),
              mk_row("High operational complexity",
                     "Millions of invoices needed to be processed accurately without affecting business "
                     "performance."),
              mk_row("Implementation uncertainty",
                     "As a Wave 1 entity, there was no previous benchmark to follow, making planning and "
                     "regulatory interpretation even more critical."),
              mk_row("Risk of inconsistent compliance",
                     "Different business units and systems could interpret regulatory requirements differently "
                     "if not managed through a unified approach.")]
    return interior_page(3, "Landmark Group Case Study", blocks)


def page4():
    def b1(y):
        return C.sec_head(y, "How ClearTax Helped")
    def b2(y):
        return C.paragraph(y, "Rather than beginning with implementation, ClearTax started by understanding "
                               "the business. The team worked closely with business and technical stakeholders "
                               "to study how invoices moved across the organisation — every source system "
                               "analysed, every process reviewed, every data flow mapped — to identify "
                               "compliance gaps before implementation began.")
    def b3(y):
        return C.flow_timeline(y, ["Business Assessment", "System & Data Analysis", "Gap Identification",
                                    "Compliance Blueprint", "Implementation", "Continuous Support"])
    def b4(y):
        return C.paragraph(y, "With a clear understanding of the business landscape, ClearTax designed a "
                               "scalable compliance blueprint aligned with ZATCA Phase 2 — built to support high "
                               "transaction volumes while maintaining operational efficiency across POS, ERP, "
                               "and e-commerce systems, with retry mechanisms to prevent invoice leakage and "
                               "notifications for timely corrective action.")
    def b5(y):
        return C.sub_head(y, "Everything That Came With ClearTax")
    def mk_row(title, desc):
        def f(y):
            return C.row_card(y, title, desc)
        return f
    blocks = [b1, b2, b3, b4, b5,
              mk_row("Dedicated implementation team",
                     "Worked closely with business and technical teams throughout the engagement."),
              mk_row("Regulatory expertise",
                     "Guided the organisation through complex ZATCA Phase 2 requirements and implementation "
                     "decisions."),
              mk_row("Reliable delivery",
                     "Built a scalable compliance framework without disrupting day-to-day retail operations."),
              mk_row("Continuous support",
                     "Assisted during live operations with monitoring, alerts, and support during ZATCA "
                     "downtime scenarios."),
              mk_row("Future assurance",
                     "Leveraged experience from multiple e-invoicing implementations to help the business stay "
                     "prepared for evolving requirements.")]
    return interior_page(4, "Landmark Group Case Study", blocks)


def page5():
    C.reset_font_usage()
    parts = [C.header_chrome("Landmark Group Case Study")]
    y = 130
    extra_defs = ""

    svg, y = C.sec_head(y, "The Result")
    parts.append(svg)

    svg, y = C.cmp_table(y, ("Before", "After"), [
        ("Independent systems with limited compliance visibility",
         "A structured compliance roadmap across business systems"),
        ("Compliance gaps yet to be identified",
         "Clear understanding of data, process, and architectural requirements"),
        ("Infrastructure needed validation for high transaction volumes",
         "Scalable design prepared for peak retail operations"),
        ("Greater dependency on manual processes",
         "Process-driven execution supported by alerts and retry mechanisms"),
    ])
    parts.append(svg)

    svg, y = C.pullquote(y, "\"One of the strongest validations came during the first-ever ZATCA inspection of "
                             "Landmark Group's stores — the authorities provided positive feedback on the "
                             "organisation's compliance and overall process execution.\"")
    parts.append(svg)

    svg, y = C.sub_head(y, "A Partnership Built on Expertise")
    parts.append(svg)

    svg, y = C.paragraph(y, "The engagement delivered far more than regulatory readiness. Landmark Group "
                             "gained a scalable compliance foundation designed to support one of Saudi Arabia's "
                             "largest retail operations — and the confidence of having an experienced partner "
                             "that understood both the regulation and the realities of large-scale "
                             "implementation. That is what sets ClearTax apart: not just technology, but the "
                             "expertise, delivery assurance, and continuous support that help businesses stay "
                             "compliant today while remaining prepared for tomorrow.")
    parts.append(svg)

    panel_top = y + 16
    panel_svg, panel_defs = closepanel(panel_top, "Planning your ZATCA compliance journey?",
                                        "Partner with ClearTax to build a future-ready compliance framework and "
                                        "get the expert guidance, reliable delivery, and continuous support you "
                                        "need.", "Book a demo now")
    parts.append(panel_svg)
    extra_defs += panel_defs

    body = "\n".join(parts)
    svg = wrap_svg(body, extra_defs)
    font_style = embed_font_style()
    svg = svg.replace(f'<defs>{extra_defs}</defs>', f'<defs>{extra_defs}</defs>{font_style}')
    return svg


if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    builders = {"1": cover, "2": page2, "3": page3, "4": page4, "5": page5}
    todo = builders.items() if which == "all" else [(which, builders[which])]
    for num, fn in todo:
        svg = fn()
        path = os.path.join(OUT_DIR, f"Landmark Group Case Study - Slide {num}.svg")
        open(path, "w").write(svg)
        print(path, len(svg), "bytes")
