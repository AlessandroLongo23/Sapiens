"""Where things go, and a check that they did not collide.

The safe area is split into a 6x6 grid of anchors (rows A-F from the top, columns 1-6),
as in Code2Video: scenes place blocks in a region such as "B1:D3" and never pick free
coordinates. After every animation the scene measures what is on screen: blocks outside
the frame or the safe area, and blocks that overlap. Marks tagged `decor` (highlighter,
pen) are allowed to overlap.
"""

from __future__ import annotations

import itertools

import numpy as np
from manim import LEFT, RIGHT, UP, DOWN, ORIGIN, config

MARGIN_X, MARGIN_Y = 0.7, 0.45
ROWS, COLS = "ABCDEF", 6
# Row A is the heading, a fixed band at the top; rows B-F share what is left, starting two
# squares below it so content never touches the title's pen stroke.
HEADER_H = 1.15
HEADER_GAP = 0.7


def _safe():
    w, h = config.frame_width, config.frame_height
    return -w / 2 + MARGIN_X, w / 2 - MARGIN_X, -h / 2 + MARGIN_Y, h / 2 - MARGIN_Y


def regione(zona: str):
    """'B2' or 'B1:D3' -> (left, right, bottom, top) in scene units. Row A is the heading band."""
    a, _, b = zona.partition(":")
    b = b or a
    r0, r1 = sorted((ROWS.index(a[0]), ROWS.index(b[0])))
    c0, c1 = sorted((int(a[1:]) - 1, int(b[1:]) - 1))
    x0, x1, y0, y1 = _safe()
    cw = (x1 - x0) / COLS
    content_top = y1 - HEADER_H - HEADER_GAP
    rh = (content_top - y0) / (len(ROWS) - 1)

    def top(r):
        return y1 if r == 0 else content_top - (r - 1) * rh

    def bottom(r):
        return y1 - HEADER_H if r == 0 else content_top - r * rh

    return x0 + c0 * cw, x0 + (c1 + 1) * cw, bottom(r1), top(r0)


def metti(mob, zona: str, allinea=ORIGIN, riempi: float = 0.96):
    """Put `mob` in a region: shrink it if it does not fit, then align it (ORIGIN centres)."""
    l, r, b, t = regione(zona)
    w, h = (r - l) * riempi, (t - b) * riempi
    if mob.width > w or mob.height > h:
        k = min(w / mob.width, h / mob.height)
        mob.scale(k)
        # Shrinking makes sizes inconsistent between pages: the check reports it.
        mob.sapiens_scala = getattr(mob, "sapiens_scala", 1.0) * k
    cx, cy = (l + r) / 2, (b + t) / 2
    target = np.array([cx + allinea[0] * (r - l - mob.width) / 2 * riempi, cy + allinea[1] * (t - b - mob.height) / 2 * riempi, 0])
    mob.move_to(target)
    mob.sapiens_zona = zona
    return mob


def blocco(nome: str, *mobs):
    """Parts of one figure (a square and its labels): they may overlap each other."""
    for i, m in enumerate(mobs):
        m.sapiens_blocco = nome
        m.name = f"{nome}.{i}"
    return mobs


def _visible(m) -> bool:
    for s in m.family_members_with_points():
        if s.get_fill_opacity() > 0.05 or s.get_stroke_opacity() > 0.05:
            return True
    return False


def _box(m):
    return m.get_left()[0], m.get_right()[0], m.get_bottom()[1], m.get_top()[1]


def content_top() -> float:
    return _safe()[3] - HEADER_H - HEADER_GAP


def controlla(mobjects, nome_di=lambda m: m.__class__.__name__) -> list[str]:
    """Return the layout problems of what is on screen now."""
    blocks = [m for m in mobjects if m.z_index > -100 and not getattr(m, "sapiens_decor", False) and _visible(m)]
    issues = []
    fw, fh = config.frame_width / 2, config.frame_height / 2
    x0, x1, y0, y1 = _safe()
    for m in blocks:
        if getattr(m, "sapiens_scala", 1.0) < 0.9:
            issues.append(f"RIMPICCIOLITO: {nome_di(m)} x{m.sapiens_scala:.2f}, la zona è troppo piccola")
        l, r, b, t = _box(m)
        zona = getattr(m, "sapiens_zona", None)
        if zona and not zona.startswith("A") and t > content_top() + 0.05:
            issues.append(f"SOPRA LA ZONA: {nome_di(m)} entra nella fascia dell'intestazione")
        if l < -fw or r > fw or b < -fh or t > fh:
            issues.append(f"FUORI DAL QUADRO: {nome_di(m)} ({l:.2f},{b:.2f})-({r:.2f},{t:.2f})")
        elif l < x0 - 0.05 or r > x1 + 0.05 or b < y0 - 0.05 or t > y1 + 0.05:
            issues.append(f"fuori dall'area sicura: {nome_di(m)}")
    for m, n in itertools.combinations(blocks, 2):
        bm, bn = getattr(m, "sapiens_blocco", None), getattr(n, "sapiens_blocco", None)
        if bm is not None and bm == bn:
            continue
        a, b_ = _box(m), _box(n)
        ox = min(a[1], b_[1]) - max(a[0], b_[0])
        oy = min(a[3], b_[3]) - max(a[2], b_[2])
        if ox > 0.04 and oy > 0.04:
            issues.append(f"SOVRAPPOSTI: {nome_di(m)} e {nome_di(n)} ({ox:.2f} x {oy:.2f})")
    return issues


__all__ = ["regione", "metti", "controlla", "blocco", "LEFT", "RIGHT", "UP", "DOWN", "ORIGIN"]
