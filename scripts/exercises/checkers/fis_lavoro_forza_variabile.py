"""Checker for fis-lavoro-forza-variabile (specs/exercises/fis-lavoro-forza-variabile.md), written from the spec and
the lesson 77-fis-lavoro-forza-variabile.md, not from the generator.

The work of a force that changes with the position is the area between the force-displacement graph and the x axis,
negative where the graph is below the axis; the mean force is that work over the displacement. The elastic force does
k (x1^2 - x2^2) / 2 when the deformation goes from x1 to x2. A cart of mass m that starts from rest and receives the
work W leaves at sqrt(2 W / m); a cart arriving at v on a spring at rest compresses it by v sqrt(m / k). The graph is
read from the scene (whole coordinates, straight pieces), so the areas are exact; answers have two significant
figures (checkers/_fis_lavoro.py) and never end with an ambiguous zero.
"""
import re

from sympy import Rational, sqrt

from checkers._fis_lavoro import answer, data, sig2
from checkers._vettori import common, prose

CASE_RANGES = {
    2: {"retta": (0.35, 0.65), "gradino": (0.35, 0.65)},
    4: {"aumenta": (0.40, 0.60), "diminuisce": (0.40, 0.60)},
}

Q = r"\$(\d+(?:\{,\}\d+)?)\\,\\text\{%s\}\$"
CART = r"Su un carrello che si muove lungo un binario rettilineo agisce una forza diretta lungo il binario, che cambia con la posizione come nel grafico\. "
END = r"\$x = 0\$ (?:a|e) \$x = (\d)\\,\\text\{m\}\$\?"


def graph(sample, errs, below):
    """The points of the problem's graph, checked: whole coordinates, x not decreasing, inside the sheet."""
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "grafico-forza-spostamento":
        raise ValueError("no grafico-forza-spostamento scene")
    if d.get("aree"):
        errs.append("the problem's graph shows the areas")
    pts = [(Rational(p[0]), Rational(p[1])) for p in d["punti"]]
    if any(p[0].q != 1 or p[1].q != 1 for p in pts):
        errs.append("graph coordinates are not whole")
    if pts[0][0] != 0 or any(a[0] > b[0] for a, b in zip(pts, pts[1:])):
        errs.append("x does not start at 0 or decreases")
    fs = [p[1] for p in pts]
    if d.get("xPasso") != 1 or d.get("xMax") != pts[-1][0] or not 2 <= d["xMax"] <= 8:
        errs.append("x axis does not match the graph")
    if d.get("fMax", 0) <= max(fs) or d.get("fMin", 0) > min(fs) or d.get("fPasso") not in (1, 2):
        errs.append("force axis does not hold the graph")
    if any(f % d["fPasso"] for f in fs):
        errs.append("a force is not on the grid")
    if (min(fs) < 0) != below:
        errs.append("graph below the axis" if not below else "graph never below the axis")
    if max(abs(f) for f in fs) > 12:
        errs.append("force above 12 N")
    sol = sample.get("solutionScene") or {}
    if sol.get("type") != "grafico-forza-spostamento" or sol.get("data", {}).get("punti") != d["punti"] or not sol["data"].get("aree"):
        errs.append("the solution's graph is not the same graph with the areas")
    return pts


def area(pts):
    """Signed area: each straight piece is a trapezoid (f1 + f2) dx / 2, also across the axis."""
    return sum((a[1] + b[1]) * (b[0] - a[0]) / 2 for a, b in zip(pts, pts[1:]))


def clean(errs, truth, unit="J"):
    s = sig2(truth)
    if s is not None and re.fullmatch(r"-?[1-9]0", s):
        errs.append(f"answer {s} ends with an ambiguous zero")


def ends(errs, m, pts):
    if int(m) != pts[-1][0]:
        errs.append("the text's last position is not the graph's")


def level1(sample, errs):
    m = re.fullmatch(CART + r"Quanto lavoro compie la forza mentre il carrello va da " + END, prose(sample["problem"]))
    if not m:
        raise ValueError("level 1 text not recognised")
    pts = graph(sample, errs, below=False)
    ends(errs, m.group(1), pts)
    W = area(pts)
    clean(errs, W)
    answer(sample, errs, W, "J")
    return "area"


def level2(sample, errs):
    m = re.fullmatch(CART + r"Quanto lavoro compie in tutto la forza mentre il carrello va da " + END, prose(sample["problem"]))
    if not m:
        raise ValueError("level 2 text not recognised")
    pts = graph(sample, errs, below=True)
    ends(errs, m.group(1), pts)
    W = area(pts)
    if W == 0:
        errs.append("total work is zero")
    clean(errs, W)
    answer(sample, errs, W, "J")
    if len(pts) == 2:
        x0 = pts[0][1] * pts[1][0] / (pts[0][1] - pts[1][1])
        if x0.q != 1:
            errs.append("the line does not cross the axis at a whole position")
        return "retta"
    if len(pts) == 4 and pts[1][0] == pts[2][0] and pts[0][1] == pts[1][1] > 0 > pts[2][1] == pts[3][1]:
        return "gradino"
    errs.append("level 2 graph of an unknown shape")
    return None


def level3(sample, errs):
    m = re.fullmatch(CART + r"Quanto vale la forza media tra " + END, prose(sample["problem"]))
    if not m:
        raise ValueError("level 3 text not recognised")
    pts = graph(sample, errs, below=False)
    ends(errs, m.group(1), pts)
    Fm = area(pts) / pts[-1][0]
    clean(errs, Fm)
    answer(sample, errs, Fm, "N")
    return "media"


def level4(sample, errs):
    s = prose(sample["problem"])
    K = r"Una molla di costante elastica \$k = (\d\d)\\,\\text\{N/m\}\$, "
    CM = Q % "cm"
    if m := re.fullmatch(K + r"già allungata di " + CM + r", viene allungata fino a " + CM + r"\. Quanto lavoro compie la forza elastica\?", s):
        kind = "aumenta"
    elif m := re.fullmatch(K + r"allungata di " + CM + r", si accorcia fino a restare allungata di " + CM + r"\. Quanto lavoro compie la forza elastica\?", s):
        kind = "diminuisce"
    else:
        raise ValueError("level 4 text not recognised")
    k, x1, x2 = data(errs, m.group(1), "k"), data(errs, m.group(2), "deformation"), data(errs, m.group(3), "deformation")
    lo, hi = (x1, x2) if kind == "aumenta" else (x2, x1)
    if not (11 <= lo <= 25 and lo + 6 <= hi <= 39):
        errs.append("deformations outside the ranges")
    W = k * ((x1 / 100) ** 2 - (x2 / 100) ** 2) / 2
    if (W < 0) != (kind == "aumenta"):
        errs.append("sign of the elastic work")
    clean(errs, W)
    answer(sample, errs, W, "J")
    if sample.get("scene"):
        errs.append("unexpected scene")
    return kind


def level5(sample, errs):
    m = re.fullmatch(r"Un carrello di " + Q % "kg" + r", fermo in \$x = 0\$ su un binario rettilineo senza attrito, è spinto da una forza diretta lungo il binario, che cambia con la posizione come nel grafico\. Con quale velocità passa per \$x = (\d)\\,\\text\{m\}\$\?", prose(sample["problem"]))
    if not m:
        raise ValueError("level 5 text not recognised")
    mass = data(errs, m.group(1), "mass")
    if not Rational(11, 10) <= mass <= Rational(99, 10):
        errs.append("mass outside 1.1-9.9 kg")
    pts = graph(sample, errs, below=False)
    ends(errs, m.group(2), pts)
    v = sqrt(2 * area(pts) / mass)
    clean(errs, v)
    answer(sample, errs, v, "m/s")
    return "velocita"


def level6(sample, errs):
    m = re.fullmatch(r"Un carrello di " + Q % "kg" + r" arriva a " + Q % "m/s" + r", senza attrito, contro una molla a riposo di costante elastica \$k = (\d\d\d)\\,\\text\{N/m\}\$\. Di quanti centimetri si comprime la molla prima che il carrello si fermi\?", prose(sample["problem"]))
    if not m:
        raise ValueError("level 6 text not recognised")
    mass, v, k = data(errs, m.group(1), "mass"), data(errs, m.group(2), "speed"), data(errs, m.group(3), "k", 3)
    if not (Rational(11, 10) <= mass <= Rational(99, 10) and Rational(11, 10) <= v <= Rational(99, 10)):
        errs.append("mass or speed outside 1.1-9.9")
    x = 100 * v * sqrt(mass / k)
    if not 2 <= x <= 60:
        errs.append(f"compression {x.evalf(5)} cm outside 2-60")
    clean(errs, x)
    answer(sample, errs, x, "cm")
    if sample.get("scene"):
        errs.append("unexpected scene")
    return "molla"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
