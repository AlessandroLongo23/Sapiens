"""What a hand adds to the page: highlighter, red pen, pencil.

Every mark is a mobject tagged `decor`, so the layout check lets it overlap what it marks.
Shapes carry a little irregularity (seeded, so renders are stable) because a hand never
draws the same circle twice; the highlighter uses the three bands of `.marker-hand` in
globals.css.
"""

from __future__ import annotations

import math
from pathlib import Path

import numpy as np
from manim import (
    DOWN,
    LEFT,
    RIGHT,
    UP,
    Animation,
    Create,
    SVGMobject,
    VGroup,
    VMobject,
    rate_functions,
)

from .theme import INK, MARKER, MARKER_OPACITY, PEN

ASSETS = Path(__file__).resolve().parent / "assets"
PEN_WIDTH = 5


def decor(mob):
    """Mark a mobject as decoration: the layout check ignores its overlaps."""
    mob.sapiens_decor = True
    return mob


def _tratto(points, color=PEN, width=PEN_WIDTH) -> VMobject:
    m = VMobject()
    m.set_points_smoothly([np.array([x, y, 0.0]) for x, y in points])
    m.set_stroke(color, width=width, opacity=1)
    m.set_fill(opacity=0)
    return decor(m)


def evidenziatore(mob, variante: int = 0, pad: float = 0.12) -> SVGMobject:
    """The yellow felt-tip band behind `mob`. Reveal it with `Stendi`."""
    band = SVGMobject(str(ASSETS / f"evidenziatore-{'abc'[variante % 3]}.svg"))
    band.set_fill(MARKER, opacity=MARKER_OPACITY).set_stroke(width=0)
    band.stretch_to_fit_width(mob.width + 2 * pad)
    band.stretch_to_fit_height(mob.height + 1.4 * pad)
    band.move_to(mob).shift(DOWN * 0.02)
    band.rotate([-0.6, 0.5, -0.2][variante % 3] * math.pi / 180)
    band.set_z_index(mob.z_index - 1)
    return decor(band)


class Stendi(Animation):
    """Lay a band down left to right, as a highlighter moves."""

    def __init__(self, mobject, **kwargs):
        kwargs.setdefault("run_time", 0.6)
        kwargs.setdefault("rate_func", rate_functions.ease_out_sine)
        super().__init__(mobject, **kwargs)

    def interpolate_mobject(self, alpha: float) -> None:
        self.mobject.become(self.starting_mobject.copy())
        self.mobject.stretch(max(alpha, 1e-3), 0, about_edge=LEFT)


def cerchio(mob, pad: float = 0.22, seed: int = 0, color=PEN, width=PEN_WIDTH) -> VMobject:
    """The corrector's loop around `mob`: a little more than one turn, ends crossing.

    An ellipse through the corners of a box passes over the glyphs at the ends of a wide
    object, so the horizontal radius grows with the width.
    """
    rng = np.random.default_rng(seed)
    cx, cy = mob.get_center()[:2]
    pad = max(pad, 0.2)
    # Wide horizontally, tight vertically: the loop must not reach the rows above and below.
    rx, ry = mob.width / 2 * 1.12 + pad, mob.height / 2 * 1.1 + pad * 0.6
    # Start and close on the right, where the crossing ends fall in empty paper.
    start = math.radians(10 + rng.uniform(-8, 8))
    sweep = math.radians(372)
    phase = rng.uniform(0, 2 * math.pi)
    tilt = math.radians(rng.uniform(-4, 4))
    pts = []
    for i in range(49):
        t = start - sweep * i / 48
        wob = 1 + 0.035 * math.sin(3 * t + phase)
        shrink = 1 - 0.07 * i / 48  # the pen spirals in slightly as it closes
        x, y = rx * wob * shrink * math.cos(t), ry * wob * shrink * math.sin(t)
        pts.append((cx + x * math.cos(tilt) - y * math.sin(tilt), cy + x * math.sin(tilt) + y * math.cos(tilt)))
    return _tratto(pts, color, width)


def sottolinea(mob, seed: int = 0, color=PEN, width=PEN_WIDTH, gap: float = 0.1) -> VMobject:
    """A quick wavy stroke under `mob`."""
    rng = np.random.default_rng(seed)
    x0, x1 = mob.get_left()[0] + 0.02, mob.get_right()[0] + 0.06
    y = mob.get_bottom()[1] - gap
    n = 12
    pts = [(x0 + (x1 - x0) * i / n, y + 0.025 * math.sin(i * 1.3 + rng.uniform(0, 1)) + 0.03 * i / n) for i in range(n + 1)]
    return _tratto(pts, color, width)


def barra(mob, seed: int = 0, color=PEN, width=PEN_WIDTH) -> VMobject:
    """Strike `mob` out: one slanted stroke, lower left to upper right."""
    rng = np.random.default_rng(seed)
    l, r = mob.get_left()[0] - 0.12, mob.get_right()[0] + 0.12
    b, t = mob.get_bottom()[1] + mob.height * 0.25, mob.get_top()[1] - mob.height * 0.2
    mid = ((l + r) / 2, (b + t) / 2 + rng.uniform(-0.03, 0.03))
    return _tratto([(l, b), mid, (r, t)], color, width)


def spunta(punto, size: float = 0.4, color=PEN, width=PEN_WIDTH + 1) -> VMobject:
    """A red tick with its lower corner at `punto`."""
    x, y = punto[0], punto[1]
    return _tratto([(x - size * 0.45, y + size * 0.4), (x - size * 0.2, y + size * 0.12), (x, y), (x + size * 0.35, y + size * 0.6), (x + size * 0.6, y + size * 1.05)], color, width)


def riquadro(mob, pad: float = 0.25, seed: int = 0, color=INK, width=3) -> VMobject:
    """A box drawn by hand around a formula, as definitions are framed on the site."""
    rng = np.random.default_rng(seed)
    l, r = mob.get_left()[0] - pad, mob.get_right()[0] + pad
    b, t = mob.get_bottom()[1] - pad, mob.get_top()[1] + pad

    def j():
        return rng.uniform(-0.03, 0.03)

    start = (l + 0.35, t)
    # The pen closes on the top edge, past where it started, at the same height: no stub.
    corners = [start, (r + j(), t + j()), (r + j(), b + j()), (l + j(), b + j()), (l, t), (start[0] + 0.3, t)]
    m = VMobject()
    m.set_points_as_corners([np.array([x, y, 0.0]) for x, y in corners])
    m.set_stroke(color, width=width).set_fill(opacity=0)
    return decor(m)


def freccia(da, a, curva: float = 0.3, color=PEN, width=PEN_WIDTH - 1) -> VGroup:
    """A curved arrow drawn with the pen from point `da` to point `a`."""
    da, a = np.array(da, dtype=float), np.array(a, dtype=float)
    d = a - da
    normal = np.array([-d[1], d[0], 0.0]) / (np.linalg.norm(d) or 1)
    mid = (da + a) / 2 + normal * curva
    body = _tratto([tuple(da[:2]), tuple(((da + mid) / 2 + normal * curva * 0.25)[:2]), tuple(mid[:2]), tuple(((mid + a) / 2 + normal * curva * 0.25)[:2]), tuple(a[:2])], color, width)
    tangent = body.point_from_proportion(1) - body.point_from_proportion(0.94)
    tangent /= np.linalg.norm(tangent)
    side = np.array([-tangent[1], tangent[0], 0.0])
    tip = a
    head = _tratto([tuple((tip - tangent * 0.22 + side * 0.13)[:2]), tuple(tip[:2]), tuple((tip - tangent * 0.22 - side * 0.13)[:2])], color, width)
    return decor(VGroup(body, head))


def disegna(mark, **kw):
    """Draw a pen mark at hand speed."""
    kw.setdefault("run_time", 0.7)
    kw.setdefault("rate_func", rate_functions.ease_in_out_sine)
    return Create(mark, **kw)


__all__ = ["decor", "evidenziatore", "Stendi", "cerchio", "sottolinea", "barra", "spunta", "riquadro", "freccia", "disegna", "UP", "DOWN", "LEFT", "RIGHT"]
