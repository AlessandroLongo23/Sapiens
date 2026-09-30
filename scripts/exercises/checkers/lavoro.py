"""Checker for lavoro (specs/exercises/lavoro.md), written from the spec and the lesson 59-lavoro.md, not from the
generator.

A constant force F along the displacement s does W = F s; at an angle alpha, W = F s cos(alpha). Dynamic friction
does -mu_d F_perp s, with F_perp = m g on a horizontal floor and m g - F sin(alpha) when a rope pulls upwards; the
weight does -m g h going up, +m g h coming down and nothing on a horizontal path. Stretching a spring from x1 to x2
takes k (x2^2 - x1^2) / 2, the area under F = k x. g = 49/5, exact trigonometry with sympy, results with two
significant figures (checkers/_fis_lavoro.py).
"""
import re

from sympy import Rational, cos, pi, sin

from checkers._fis_lavoro import G, answer, data, sig2
from checkers._vettori import common, prose

CASE_RANGES = {
    3: {"attrito": (0.25, 0.42), "peso": (0.25, 0.42), "nullo": (0.25, 0.42)},
    6: {"da-riposo": (0.40, 0.60), "tra-due": (0.40, 0.60)},
}

Q = r"\$(\d+(?:\{,\}\d+)?)\\,\\text\{%s\}\$"
KG, NW, M, CM = Q % "kg", Q % "N", Q % "m", Q % "cm"
ANG = r"\$(\d+)\^\\circ\$"
MU = r"\$\\mu_d = (0\{,\}\d\d)\$"
CRATE = r"(Una cassa|Uno scatolone|Un baule|Una valigia)"
SMALL = r"(Uno zaino|Una borsa|Un vaso|Una scatola di libri)"


def rad(d):
    return pi * Rational(d) / 180


def fem(errs, body, *endings):
    f = body.startswith("Una")
    if any((e == "a") != f for e in endings):
        errs.append("agreement")


def mu_of(errs, s, lo, hi):
    mu = Rational(s.replace("{,}", "."))
    if not Rational(lo, 100) <= mu <= Rational(hi, 100):
        errs.append(f"mu_d {mu} outside {lo}-{hi} hundredths")
    return mu


def scene(sample, errs, angle, F, s):
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "cassa-fune":
        errs.append("no cassa-fune scene")
        return
    if d.get("angolo") != angle:
        errs.append(f"scene angle {d.get('angolo')} != {angle}")
    if angle and d.get("testoAngolo") != f"{angle}°":
        errs.append("scene angle text")
    if d.get("forza") != f"F = {F.replace('{,}', ',')} N" or d.get("spostamento") != f"s = {s.replace('{,}', ',')} m":
        errs.append("scene labels do not match the data")


def has_option(sample, errs, x, what):
    """The distractor the spec names is among the options (when it rounds): it also ties the mass to the text."""
    want = sig2(x)
    if want is not None and f"{want}\\,\\text{{J}}" not in [o["latex"] for o in sample["answer"]["options"]]:
        errs.append(f"missing the distractor {what}")


def no_scene(sample, errs):
    if sample.get("scene"):
        errs.append("unexpected scene")


def level1(sample, errs):
    t = prose(sample["problem"])
    m = re.fullmatch(CRATE + " di " + KG + r" viene spint([ao]) sul pavimento con una forza orizzontale di " + NW + ", per un tratto rettilineo di " + M + r"\. Quanto lavoro compie la forza\?", t)
    if not m:
        errs.append(f"level 1 text not recognised: {t!r}")
        return None
    fem(errs, m.group(1), m.group(3))
    mass = data(errs, m.group(2), "mass")
    F, s = data(errs, m.group(4), "force"), data(errs, m.group(5), "displacement")
    answer(sample, errs, F * s, "J")
    has_option(sample, errs, mass * G * s, "m g s")
    scene(sample, errs, 0, m.group(4), m.group(5))
    return "parallela"


def level2(sample, errs):
    t = prose(sample["problem"])
    m = re.fullmatch(CRATE + r" viene trascinat([ao]) sul pavimento per " + M + " con una fune inclinata di " + ANG + r" rispetto all'orizzontale, che tira con una forza di " + NW + r"\. Quanto lavoro compie la forza della fune\?", t)
    if not m:
        errs.append(f"level 2 text not recognised: {t!r}")
        return None
    fem(errs, m.group(1), m.group(2))
    s, a, F = data(errs, m.group(3), "displacement"), int(m.group(4)), data(errs, m.group(5), "force")
    if not 10 <= a <= 80:
        errs.append("angle outside 10-80")
    answer(sample, errs, F * s * cos(rad(a)), "J")
    scene(sample, errs, a, m.group(5), m.group(3))
    return "inclinata"


def level3(sample, errs):
    t = prose(sample["problem"])
    if m := re.fullmatch(CRATE + " di " + KG + " scivola per " + M + r" su un pavimento orizzontale; il coefficiente di attrito dinamico è " + MU + r"\. Quanto vale il lavoro della forza di attrito\?", t):
        mass, s = data(errs, m.group(2), "mass"), data(errs, m.group(3), "displacement")
        mu = mu_of(errs, m.group(4), 10, 60)
        answer(sample, errs, -mu * mass * G * s, "J")
        no_scene(sample, errs)
        return "attrito"
    if m := re.fullmatch(SMALL + " di " + KG + r" viene portat([ao]) su per le scale, fino a un piano " + M + r" più in alto\. Quanto lavoro compie il peso\?", t):
        fem(errs, m.group(1), m.group(3))
        mass, h = data(errs, m.group(2), "mass"), data(errs, m.group(4), "height")
        answer(sample, errs, -mass * G * h, "J")
        no_scene(sample, errs)
        return "peso"
    if m := re.fullmatch(SMALL + " di " + KG + r" cade da un'altezza di " + M + r"\. Quanto lavoro compie il peso\?", t):
        mass, h = data(errs, m.group(2), "mass"), data(errs, m.group(3), "height")
        answer(sample, errs, mass * G * h, "J")
        no_scene(sample, errs)
        return "peso"
    if m := re.fullmatch(CRATE + " di " + KG + r" viene spint([ao]) per " + M + r" su un pavimento orizzontale, con una forza orizzontale di " + NW + r"\. Quanto lavoro compie il peso\?", t):
        fem(errs, m.group(1), m.group(3))
        mass = data(errs, m.group(2), "mass")
        s = data(errs, m.group(4), "displacement")
        data(errs, m.group(5), "force")
        answer(sample, errs, Rational(0), "J")
        has_option(sample, errs, mass * G * s, "m g s")
        scene(sample, errs, 0, m.group(5), m.group(4))
        return "nullo"
    errs.append(f"level 3 text not recognised: {t!r}")
    return None


def level4(sample, errs):
    t = prose(sample["problem"])
    m = re.fullmatch(CRATE + " di " + KG + r" viene tirat([ao]) per " + M + r" sul pavimento con una forza orizzontale di " + NW + "; il coefficiente di attrito dinamico è " + MU + r"\. Quanto vale il lavoro totale delle forze\?", t)
    if not m:
        errs.append(f"level 4 text not recognised: {t!r}")
        return None
    fem(errs, m.group(1), m.group(3))
    mass, s, F = data(errs, m.group(2), "mass"), data(errs, m.group(4), "displacement"), data(errs, m.group(5), "force")
    mu = mu_of(errs, m.group(6), 10, 60)
    friction = mu * mass * G
    if F < Rational(6, 5) * friction:
        errs.append("the pull is not at least 1.2 times the friction")
    answer(sample, errs, (F - friction) * s, "J", zero_ok=False)
    scene(sample, errs, 0, m.group(5), m.group(4))
    return "totale"


def level5(sample, errs):
    t = prose(sample["problem"])
    m = re.fullmatch(
        CRATE + " di " + KG + r" viene trascinat([ao]) per " + M + r" sul pavimento con una fune inclinata di " + ANG + r" rispetto all'orizzontale, che tira con " + NW + "; il coefficiente di attrito dinamico è " + MU + r"\. Quanto vale il lavoro totale delle forze\?",
        t,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {t!r}")
        return None
    fem(errs, m.group(1), m.group(3))
    mass, s, a, F = data(errs, m.group(2), "mass"), data(errs, m.group(4), "displacement"), int(m.group(5)), data(errs, m.group(6), "force")
    mu = mu_of(errs, m.group(7), 10, 50)
    if not 10 <= a <= 60:
        errs.append("angle outside 10-60")
    P = mass * G
    Fx, Fy = F * cos(rad(a)), F * sin(rad(a))
    if Fy > Rational(4, 5) * P:
        errs.append("the rope lifts more than 80% of the weight")
    net = Fx - mu * (P - Fy)
    if net < Rational(1, 5) * Fx:
        errs.append("net force along the floor under 20% of F cos alpha")
    answer(sample, errs, net * s, "J")
    scene(sample, errs, a, m.group(6), m.group(4))
    return "fune-attrito"


def spring_scene(sample, errs, k, xmax):
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "grafico-dati":
        errs.append("no graph scene")
        return
    line = d.get("linea", {})
    if line.get("tipo") != "retta" or abs(line.get("m", 0) - k / 100) > 1e-12 or line.get("q", 0) != 0:
        errs.append("the graph's line is not F = k x")
    x = d.get("x", {})
    if x.get("unita") != "cm" or x.get("passo", 0) * x.get("celle", 0) < xmax:
        errs.append("the graph does not reach the stretch")
    if "evidenzia" in d or "punti" in d:
        errs.append("the problem graph marks points")


def level6(sample, errs):
    t = prose(sample["problem"])
    if m := re.fullmatch(r"Una molla ha costante elastica \$k = (\d\d)\\,\\text\{N/m\}\$\. Quanto lavoro serve per allungarla di " + CM + r", partendo dalla sua lunghezza a riposo\?", t):
        k, x = data(errs, m.group(1), "k"), data(errs, m.group(2), "stretch")
        if not 11 <= x <= 39:
            errs.append("stretch outside 11-39 cm")
        answer(sample, errs, k * (x / 100) ** 2 / 2, "J")
        spring_scene(sample, errs, int(k), x)
        return "da-riposo"
    if m := re.fullmatch(r"Una molla ha costante elastica \$k = (\d\d)\\,\\text\{N/m\}\$ ed è già allungata di " + CM + r"\. Quanto lavoro serve per allungarla fino a " + CM + r"\?", t):
        k, x1, x2 = data(errs, m.group(1), "k"), data(errs, m.group(2), "stretch"), data(errs, m.group(3), "stretch")
        if not (11 <= x1 <= 25 and x1 + 6 <= x2 <= 39):
            errs.append("stretches outside the ranges")
        answer(sample, errs, k * ((x2 / 100) ** 2 - (x1 / 100) ** 2) / 2, "J")
        spring_scene(sample, errs, int(k), x2)
        return "tra-due"
    errs.append(f"level 6 text not recognised: {t!r}")
    return None


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
