"""Sapiens look for manim: the squared notebook page of the site.

Colours come from src/app/globals.css (oklch converted to sRGB by `oklch`), fonts are the
site's own (video/fonts). Scenes import colours and text helpers from here and never pick
their own.
"""

from __future__ import annotations

import math
from pathlib import Path

import manimpango
from manim import (
    DOWN,
    LEFT,
    ORIGIN,
    RIGHT,
    UP,
    Line,
    MarkupText,
    MathTex,
    Tex,
    TexTemplate,
    Text,
    VGroup,
    config,
)

FONTS = Path(__file__).resolve().parent.parent / "fonts"
for f in FONTS.glob("*.ttf"):
    manimpango.register_font(str(f))


def oklch(L: float, C: float, h: float) -> str:
    a, b = C * math.cos(math.radians(h)), C * math.sin(math.radians(h))
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_**3, m_**3, s_**3
    rgb = (
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
    )

    def enc(x: float) -> int:
        x = max(0.0, min(1.0, x))
        return round((12.92 * x if x <= 0.0031308 else 1.055 * x ** (1 / 2.4) - 0.055) * 255)

    return "#%02X%02X%02X" % tuple(enc(x) for x in rgb)


# Paper and ink (globals.css, light theme).
PAPER = oklch(0.978, 0.008, 85)  # --color-paper-100, the page
PAPER_CARD = oklch(0.992, 0.004, 85)  # --color-paper-50
INK = oklch(0.26, 0.022, 265)  # --color-ink-800, text
INK_STRONG = oklch(0.175, 0.014, 265)  # --color-ink-950, titles
INK_MUTED = oklch(0.43, 0.02, 265)  # --color-ink-600
INK_FAINT = oklch(0.6, 0.016, 265)  # --color-ink-400
GRAPHITE = oklch(0.47, 0.012, 265)  # --graphite, pencil notes
# The corrector's red pen: crimson-600 for marks, crimson-700 for red text on paper.
PEN = oklch(0.586, 0.252, 21)
PEN_TEXT = oklch(0.514, 0.222, 21)
# Highlighter (--marker, 80% on paper).
MARKER = oklch(0.93, 0.15, 102)
MARKER_OPACITY = 0.8
# Squared paper: pale blue lines at 16%.
GRID = oklch(0.62, 0.09, 245)
GRID_OPACITY = 0.16
# Subject tint (data-subject='math': hue 18, chroma 0.19), --tint and --tint-soft.
MATH = oklch(0.5, 0.19, 18)
MATH_SOFT = oklch(0.95, 0.19 * 0.22, 18)
# A second ink for "the other term" when two things must be told apart (physics blue).
BLUE = oklch(0.5, 0.15, 252)

SERIF = "Fraunces"
SANS = "Inter"
MONO = "JetBrains Mono"
HAND = "Caveat"

# Squares of the notebook, in scene units. 0.4 gives ~35 squares across a 16:9 frame.
SQUARE = 0.4

config.background_color = PAPER

# Maths in the same Computer Modern as KaTeX on the site, in ink.
TEX = TexTemplate()
TEX.add_to_preamble(r"\usepackage{amsmath}\usepackage{amssymb}")
MathTex.set_default(color=INK, tex_template=TEX, font_size=56)
Tex.set_default(color=INK, tex_template=TEX)


def testo(s: str, size: float = 30, color: str = INK, weight: str = "NORMAL", **kw) -> Text:
    """Body text in Inter."""
    return Text(s, font=SANS, font_size=size, color=color, weight=weight, **kw)


def testo_ricco(s: str, size: float = 30, color: str = INK, **kw) -> MarkupText:
    """Inter with Pango markup, for a word in <b>bold</b> or <span fgcolor=...>colour</span>."""
    return MarkupText(s, font=SANS, font_size=size, color=color, **kw)


def titolo(s: str, size: float = 64, color: str = INK_STRONG, **kw) -> Text:
    """Headings in Fraunces, as h1 and h2 on the site."""
    return Text(s, font=SERIF, font_size=size, color=color, weight="SEMIBOLD", **kw)


def etichetta(s: str, size: float = 28, color: str = INK_MUTED, **kw) -> Text:
    """label-mono: small monospaced caps with wide tracking."""
    spaced = " ".join(s.upper()) if kw.pop("spaziata", False) else s.upper()
    return Text(spaced, font=MONO, font_size=size, color=color, weight="MEDIUM", **kw)


def matita(s: str, size: float = 44, color: str = GRAPHITE, **kw) -> Text:
    """A pencil note in the margin (Caveat, the site's `pencil` utility)."""
    return Text(s, font=HAND, font_size=size, color=color, weight="SEMIBOLD", **kw)


def quadretti(width: float | None = None, height: float | None = None) -> VGroup:
    """The squared page behind every scene, aligned so a line passes through the origin."""
    w = width or config.frame_width
    h = height or config.frame_height
    lines = VGroup()
    nx, ny = int(w / 2 / SQUARE) + 1, int(h / 2 / SQUARE) + 1
    for i in range(-nx, nx + 1):
        x = i * SQUARE
        lines.add(Line([x, -h / 2, 0], [x, h / 2, 0]))
    for j in range(-ny, ny + 1):
        y = j * SQUARE
        lines.add(Line([-w / 2, y, 0], [w / 2, y, 0]))
    lines.set_stroke(GRID, width=1.4, opacity=GRID_OPACITY)
    lines.set_z_index(-100)
    return lines


def su_quadretto(mob, edge=ORIGIN):
    """Snap a mobject so its `edge` point sits on the nearest grid crossing (UP|LEFT for text blocks)."""
    p = mob.get_critical_point(edge)
    q = [round(p[0] / SQUARE) * SQUARE, round(p[1] / SQUARE) * SQUARE, 0]
    mob.shift([q[0] - p[0], q[1] - p[1], 0])
    return mob


__all__ = [
    "oklch", "PAPER", "PAPER_CARD", "INK", "INK_STRONG", "INK_MUTED", "INK_FAINT", "GRAPHITE", "PEN",
    "PEN_TEXT", "MARKER", "MARKER_OPACITY", "GRID", "GRID_OPACITY", "MATH", "MATH_SOFT", "BLUE", "SERIF",
    "SANS", "MONO", "HAND", "SQUARE", "TEX", "testo", "testo_ricco", "titolo", "etichetta", "matita",
    "quadretti", "su_quadretto", "UP", "DOWN", "LEFT", "RIGHT",
]
