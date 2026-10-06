"""Checker for fis-prodotto-scalare-vettoriale (specs/exercises/fis-prodotto-scalare-vettoriale.md), written from the
spec and the lesson 71-fis-prodotto-scalare-vettoriale.md, not from the generator.

The scalar product of two vectors is a b cos(alpha), negative for an obtuse angle, and a_x b_x + a_y b_y with the
components; the angle between two vectors has cosine (a . b) / (a b). The vector product has modulus a b sin(alpha);
for two vectors of the xy plane it lies along z with c_z = a_x b_y - a_y b_x, out of the page when positive and into
it when negative; in space its components are (a_y b_z - a_z b_y, a_z b_x - a_x b_z, a_x b_y - a_y b_x). Exact
trigonometry with sympy; results with two significant figures (checkers/_fis_lavoro.py), angles to the degree.
"""
import re

from sympy import Rational, acos, cos, pi, sin, sqrt

from checkers._fis_lavoro import answer, data, sig2
from checkers._vettori import check_choice, common, prose, round_deg

Q = r"\$(\d+(?:\{,\}\d+)?)\\,\\text\{%s\}\$"
ANG = r"\$(\d+)\^\\circ\$"
INT = r"(-?\d)"
NM = "N}\\cdot\\text{m"


def rad(d):
    return pi * Rational(d) / 180


def clean(errs, truth):
    s = sig2(truth)
    if s is not None and re.fullmatch(r"-?[1-9]0", s):
        errs.append(f"answer {s} ends with an ambiguous zero")


def nonzero(errs, *xs, bound=9):
    out = [int(x) for x in xs]
    if any(x == 0 or abs(x) > bound for x in out):
        errs.append(f"components outside 1-{bound} in absolute value: {out}")
    return out


def no_scene(sample, errs):
    if sample.get("scene"):
        errs.append("unexpected scene")


def work(sample, errs):
    m = re.fullmatch(r"Una forza di modulo " + Q % "N" + r" agisce su un corpo che si sposta di " + Q % "m" + r"\. Forza e spostamento formano un angolo di " + ANG + r"\. Quanto vale il lavoro \$W = \\vec F \\cdot \\vec s\$\?", prose(sample["problem"]))
    if not m:
        raise ValueError("text not recognised")
    F, s, a = data(errs, m.group(1), "force"), data(errs, m.group(2), "displacement"), int(m.group(3))
    if not (11 <= F <= 99 and Rational(11, 10) <= s <= Rational(99, 10)):
        errs.append("force or displacement outside the ranges")
    lvl = sample["level"]
    if lvl == 1 and not 10 <= a <= 80:
        errs.append(f"angle {a} not acute enough for level 1")
    if lvl == 2 and not 100 <= a <= 170:
        errs.append(f"angle {a} not obtuse for level 2")
    W = F * s * cos(rad(a))
    if lvl == 2 and W >= 0:
        errs.append("the work of level 2 is not negative")
    clean(errs, W)
    answer(sample, errs, W, "J")
    no_scene(sample, errs)
    return "acuto" if lvl == 1 else "ottuso"


def from_components(sample, errs):
    m = re.fullmatch(r"Una forza ha componenti \$F_x = " + INT + r"\\,\\text\{N\}\$ e \$F_y = " + INT + r"\\,\\text\{N\}\$\. Il corpo su cui agisce compie uno spostamento di componenti \$s_x = " + INT + r"\\,\\text\{m\}\$ e \$s_y = " + INT + r"\\,\\text\{m\}\$\. Quanto lavoro compie la forza\?", prose(sample["problem"]))
    if not m:
        raise ValueError("level 3 text not recognised")
    fx, fy, sx, sy = nonzero(errs, *m.groups())
    if min(fx, fy, sx, sy) > 0:
        errs.append("no negative component")
    W = Rational(fx * sx + fy * sy)
    if W == 0:
        errs.append("the scalar product is zero")
    clean(errs, W)
    answer(sample, errs, W, "J")
    no_scene(sample, errs)
    return "componenti"


PAIR = r"\(" + INT + r";\\ " + INT + r"\)"


def angle_between(sample, errs):
    m = re.fullmatch(r"I vettori \$\\vec a\$ e \$\\vec b\$ hanno componenti \$\\vec a = " + PAIR + r"\$ e \$\\vec b = " + PAIR + r"\$\. Quanto vale l'angolo tra i due vettori\?", prose(sample["problem"]))
    if not m:
        raise ValueError("level 4 text not recognised")
    ax, ay, bx, by = nonzero(errs, *m.groups(), bound=6)
    d = ax * bx + ay * by
    if d == 0:
        errs.append("perpendicular vectors")
    alpha = acos(Rational(d) / (sqrt(ax**2 + ay**2) * sqrt(bx**2 + by**2))) * 180 / pi
    if not 15 <= alpha <= 165:
        errs.append("angle outside 15-165")
    want = round_deg(alpha)
    if want is None:
        errs.append("angle too close to a half degree")
        return "angolo"
    for o in check_choice(sample, errs, f"{want}^\\circ"):
        mm = re.fullmatch(r"(\d+)\^\\circ", o)
        if not mm or not 5 <= int(mm.group(1)) <= 175:
            errs.append(f"option {o!r} is not an angle between 5 and 175 degrees")
    no_scene(sample, errs)
    return "angolo"


def cross_modulus(sample, errs):
    m = re.fullmatch(r"Il vettore \$\\vec r\$, di modulo " + Q % "m" + r", e la forza \$\\vec F\$, di modulo " + Q % "N" + r", partono dallo stesso punto e formano un angolo di " + ANG + r"\. Quanto vale il modulo di \$\\vec r \\times \\vec F\$\?", prose(sample["problem"]))
    if not m:
        raise ValueError("level 5 text not recognised")
    r, F, a = data(errs, m.group(1), "r"), data(errs, m.group(2), "force"), int(m.group(3))
    if not (Rational(11, 100) <= r <= Rational(99, 100) and 11 <= F <= 99):
        errs.append("r or F outside the ranges")
    if not 20 <= a <= 160 or a == 90 or a % 5:
        errs.append(f"angle {a} not allowed")
    M = r * F * sin(rad(a))
    clean(errs, M)
    answer(sample, errs, M, NM)
    # the scene: r along x, F at the angle of the text, the labels of the data
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "vettori-piano":
        errs.append("no vettori-piano scene")
        return "modulo"
    vs = d.get("vettori", [])
    lab = lambda s, u: f"{s.replace('{,}', ',')} {u}"
    if len(vs) != 2 or vs[0].get("etichetta") != lab(m.group(1), "m") or vs[1].get("etichetta") != lab(m.group(2), "N"):
        errs.append("scene labels do not match the data")
    else:
        (x0, y0), (x1, y1) = vs[0]["a"], vs[1]["a"]
        if vs[0]["da"] != [0, 0] or vs[1]["da"] != [0, 0] or y0 != 0 or x0 <= 0:
            errs.append("scene vectors do not start from the same point with r along x")
        drawn = acos(Rational(str(x1)) / sqrt(Rational(str(x1)) ** 2 + Rational(str(y1)) ** 2)) * 180 / pi
        if abs(drawn.evalf() - a) > 0.1 or y1 <= 0:
            errs.append("scene angle does not match the text")
    angs = d.get("angoli", [])
    if len(angs) != 1 or angs[0].get("testo") != f"{a}°":
        errs.append("scene angle label")
    return "modulo"


def side(cz):
    return f"{abs(cz)}\\text{{, {'esce dal foglio' if cz > 0 else 'entra nel foglio'}}}"


def cross_plane(sample, errs):
    m = re.fullmatch(r"I vettori \$\\vec a = " + PAIR + r"\$ e \$\\vec b = " + PAIR + r"\$ stanno nel piano del foglio, con l'asse \$x\$ verso destra e l'asse \$y\$ verso l'alto\. Quanto vale il modulo di \$\\vec a \\times \\vec b\$, e il prodotto esce dal foglio o vi entra\?", prose(sample["problem"]))
    if not m:
        raise ValueError("level 6 text not recognised")
    ax, ay, bx, by = nonzero(errs, *m.groups(), bound=6)
    cz = ax * by - ay * bx
    if cz == 0:
        errs.append("parallel vectors")
        return "piano"
    for o in check_choice(sample, errs, side(cz)):
        if not re.fullmatch(r"[1-9]\d*\\text\{, (esce dal|entra nel) foglio\}", o):
            errs.append(f"option {o!r} is not a modulus with its direction")
    no_scene(sample, errs)
    return "piano"


TRIPLE = r"\((-?\d+);\\ (-?\d+);\\ (-?\d+)\)"


def cross_space(sample, errs):
    m = re.fullmatch(r"Nello spazio i vettori \$\\vec a\$ e \$\\vec b\$ hanno componenti \$\\vec a = " + TRIPLE + r"\$ e \$\\vec b = " + TRIPLE + r"\$\. Quali sono le componenti di \$\\vec c = \\vec a \\times \\vec b\$\?", prose(sample["problem"]))
    if not m:
        raise ValueError("level 7 text not recognised")
    n = [int(x) for x in m.groups()]
    a, b = n[:3], n[3:]
    if any(abs(x) > 4 for x in n) or n.count(0) > 1:
        errs.append("components outside -4..4 or more than one zero")
    c = (a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0])
    if sum(x * y for x, y in zip(a, c)) or sum(x * y for x, y in zip(b, c)):
        errs.append("checker bug: c is not perpendicular")
    if c[1] == 0 or list(c).count(0) > 1:
        errs.append("degenerate vector product")
    for o in check_choice(sample, errs, f"({c[0]};\\ {c[1]};\\ {c[2]})"):
        if not re.fullmatch(TRIPLE, o):
            errs.append(f"option {o!r} is not a triple")
    no_scene(sample, errs)
    return "spazio"


LEVELS = {1: work, 2: work, 3: from_components, 4: angle_between, 5: cross_modulus, 6: cross_plane, 7: cross_space}


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
