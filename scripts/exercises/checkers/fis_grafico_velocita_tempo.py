"""Checker for fis-grafico-velocita-tempo (specs/exercises/fis-grafico-velocita-tempo.md), written from the spec and the
lesson 43-fis-grafico-velocita-tempo.md, not from the generator.

The graph is read from the scene `grafico-velocita-tempo` (its data are the problem's data): every vertex must sit on
a grid point, the axes must hold the graph. The slope of a piece is the acceleration, the area between the graph and
the time axis is the displacement (negative below the axis), the distance travelled counts every area as positive,
the average velocity is the total displacement over the total time. Areas are exact; slopes and average velocities
are rounded half up to two significant figures.
"""
import re

from sympy import Rational

from checkers._vettori import prose
from checkers._fis_moto import answer2, answer_exact

CASE_RANGES = {
    1: {"accelera": (0.40, 0.60), "frena": (0.40, 0.60)},
    2: {"accelera": (0.40, 0.60), "frena": (0.40, 0.60)},
    4: {"spostamento": (0.40, 0.60), "distanza": (0.40, 0.60)},
}
MOVER = r"(un'auto|un ciclista|un carrello|uno scooter)"
TRIP = r"(un autobus|un tram|un treno della metropolitana)"
R = lambda x: Rational(str(x))  # noqa: E731


def read_graph(sample, errs):
    sc = sample.get("scene") or {}
    if sc.get("type") != "grafico-velocita-tempo":
        errs.append("no velocity-time graph")
        return None
    d = sc["data"]
    ts, vs = R(d["tPasso"]), R(d["vPasso"])
    pts = [(R(a), R(b)) for a, b in d["punti"]]
    for t, v in pts:
        if (t / ts).q != 1 or (v / vs).q != 1:
            errs.append(f"vertex ({t}, {v}) off the grid")
    if pts[0][0] != 0 or any(pts[i][0] >= pts[i + 1][0] for i in range(len(pts) - 1)):
        errs.append("times not increasing from 0")
    if R(d["tMax"]) != pts[-1][0]:
        errs.append("tMax")
    top, low = max(v for _, v in pts), min([0] + [v for _, v in pts])
    if R(d["vMax"]) != top + vs or R(d["vMin"]) != (low - vs if low < 0 else 0):
        errs.append("velocity axis does not hold the graph")
    if d.get("aree"):
        errs.append("areas drawn in the problem's scene")
    if (R(d["tMax"]) / ts) > 10 or (R(d["vMax"]) - R(d["vMin"])) / vs > 12:
        errs.append("too many cells")
    return pts


def area(p, q):
    return (p[1] + q[1]) / 2 * (q[0] - p[0])


def level1(s, sample, errs, pts):
    if not re.fullmatch(r"Il grafico mostra la velocità di " + MOVER + r" in funzione del tempo\. Quanto vale l'accelerazione\?", s):
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    if len(pts) != 2:
        errs.append("one piece expected")
        return None
    (t0, v0), (t1, v1) = pts
    if v0 == v1:
        errs.append("flat graph")
    answer2(sample, errs, (v1 - v0) / (t1 - t0), "m/s^2", positive=False)
    return "accelera" if v1 > v0 else "frena"


def level2(s, sample, errs, pts):
    m = re.fullmatch(r"Il grafico mostra la velocità di " + MOVER + r" in funzione del tempo\. Quanto vale lo spostamento tra \$0\$ e \$(\d+)\\,\\text\{s\}\$\?", s)
    if not m or len(pts) != 2:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    (t0, v0), (t1, v1) = pts
    if R(m.group(2)) != t1 or v0 <= 0 or v1 <= 0 or v0 == v1:
        errs.append("level 2 graph")
    answer_exact(sample, errs, area(pts[0], pts[1]), "m")
    return "accelera" if v1 > v0 else "frena"


def trip(pts, errs):
    if len(pts) != 4 or pts[0][1] != 0 or pts[3][1] != 0 or pts[1][1] != pts[2][1] or pts[1][1] <= 0:
        errs.append("not a trip in three pieces")
        return None
    return sum(area(pts[i], pts[i + 1]) for i in range(3))


def level3(s, sample, errs, pts):
    if not re.fullmatch(r"Il grafico mostra la velocità di " + TRIP + r" tra due fermate\. Quanta strada percorre tra le due fermate\?", s):
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    x = trip(pts, errs)
    if x is not None:
        answer_exact(sample, errs, x, "m")
    return "tratti"


def level5(s, sample, errs, pts):
    if not re.fullmatch(r"Il grafico mostra la velocità di " + TRIP + r" tra due fermate\. Qual è la sua velocità media tra le due fermate\?", s):
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    x = trip(pts, errs)
    if x is not None:
        answer2(sample, errs, x / pts[3][0], "m/s")
    return "media"


def level4(s, sample, errs, pts):
    m = re.fullmatch(
        r"Una palla viene lanciata su per un piano inclinato, con l'asse rivolto verso l'alto lungo il piano\. Il grafico mostra la sua velocità\. "
        r"(Quanta strada percorre in tutto|Quanto vale il suo spostamento) tra \$0\$ e \$(\d+(?:\{,\}\d+)?)\\,\\text\{s\}\$\?",
        s,
    )
    if not m or len(pts) != 2:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    (t0, v0), (t1, v1) = pts
    if R(m.group(2).replace("{,}", ".")) != t1 or not (v0 > 0 > v1):
        errs.append("level 4 graph does not cross the axis downwards")
        return None
    tc = t0 + (t1 - t0) * v0 / (v0 - v1)
    up, down = area(pts[0], (tc, 0)), -area((tc, 0), pts[1])
    ts = R(sample["scene"]["data"]["tPasso"])
    if (tc / ts).q != 1:
        errs.append("the crossing is not on the grid")
    dist = m.group(1).startswith("Quanta")
    x = up + down if dist else up - down
    if x == 0:
        errs.append("zero answer")
    answer_exact(sample, errs, x, "m")
    return "distanza" if dist else "spostamento"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    from checkers._vettori import common

    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        pts = read_graph(sample, errs)
        if pts is None:
            return errs, None
        kind = LEVELS[lvl](prose(sample["problem"]), sample, errs, pts)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
