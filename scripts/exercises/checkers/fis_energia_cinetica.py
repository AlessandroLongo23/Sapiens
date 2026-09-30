"""Checker for fis-energia-cinetica (specs/exercises/fis-energia-cinetica.md), written from the spec and the lesson
61-fis-energia-cinetica.md, not from the generator.

A body of mass m at speed v has K = m v^2 / 2 (v in m/s: km/h times 5/18), so v = sqrt(2 K / m). The total work is
the change of kinetic energy, W = m (vf^2 - vi^2) / 2. Braking with dynamic friction on a level road, mu_d m g d =
m v^2 / 2, so d = v^2 / (2 mu_d g): at another speed the distance scales with the square of the ratio. g = 49/5,
exact arithmetic with sympy, results with two significant figures (checkers/_fis_lavoro.py).
"""
import re

from sympy import Rational, sqrt

from checkers._fis_lavoro import G, answer, data
from checkers._vettori import common, prose

CASE_RANGES = {
    4: {"accelera": (0.40, 0.60), "rallenta": (0.40, 0.60)},
    5: {"rapporto": (0.40, 0.60), "coefficiente": (0.40, 0.60)},
}

Q = r"\$(\d+(?:\{,\}\d+)?)\\,\\text\{%s\}\$"
BODY = r"(Un carrello|Una palla da bowling|Un pacco|Una slitta giocattolo)"
PERSON = r"(Un pattinatore|Una pattinatrice|Un ciclista con la sua bici|Una sciatrice)"
KMH = Rational(5, 18)


def small(errs, s, what):
    """A datum from 1,1 to 9,9 with two significant figures."""
    v = data(errs, s, what)
    if "{,}" not in s or not Rational(11, 10) <= v <= Rational(99, 10):
        errs.append(f"{what} {s} not between 1,1 and 9,9")
    return v


def level1(sample, errs):
    t = prose(sample["problem"])
    m = re.fullmatch(BODY + " di " + Q % "kg" + " si muove a " + Q % "m/s" + r"\. Quanto vale la sua energia cinetica\?", t)
    if not m:
        errs.append(f"level 1 text not recognised: {t!r}")
        return None
    mass, v = small(errs, m.group(2), "mass"), small(errs, m.group(3), "speed")
    answer(sample, errs, mass * v**2 / 2, "J")
    return "cinetica"


def level2(sample, errs):
    t = prose(sample["problem"])
    m = re.fullmatch(r"Un'auto di \$(\d\{,\}\d) \\cdot 10\^3\\,\\text\{kg\}\$ viaggia a " + Q % "km/h" + r"\. Quanto vale la sua energia cinetica\?", t)
    if not m:
        errs.append(f"level 2 text not recognised: {t!r}")
        return None
    mass = small(errs, m.group(1), "mass") * 1000
    if not 1100 <= mass <= 2400:
        errs.append("car mass outside 1,1-2,4 thousand kg")
    V = data(errs, m.group(2), "speed")
    answer(sample, errs, mass * (V * KMH) ** 2 / 2, "J")
    return "km/h"


def level3(sample, errs):
    t = prose(sample["problem"])
    m = re.fullmatch(BODY + " di " + Q % "kg" + r" ha un'energia cinetica di " + Q % "J" + r"\. Con quale velocità si muove\?", t)
    if not m:
        errs.append(f"level 3 text not recognised: {t!r}")
        return None
    mass, K = small(errs, m.group(2), "mass"), data(errs, m.group(3), "energy")
    answer(sample, errs, sqrt(2 * K / mass), "m/s")
    return "velocita"


def level4(sample, errs):
    t = prose(sample["problem"])
    m = re.fullmatch(PERSON + ", in tutto " + Q % "kg" + ", passa da " + Q % "m/s" + " a " + Q % "m/s" + r"\. Quanto lavoro compiono in tutto le forze che agiscono su di (lui|lei)\?", t)
    if not m:
        errs.append(f"level 4 text not recognised: {t!r}")
        return None
    if (m.group(5) == "lei") != m.group(1).startswith("Una"):
        errs.append("agreement")
    mass, vi, vf = data(errs, m.group(2), "mass"), small(errs, m.group(3), "speed"), small(errs, m.group(4), "speed")
    if abs(vf - vi) < 1:
        errs.append("speeds closer than 1 m/s")
    answer(sample, errs, mass * (vf**2 - vi**2) / 2, "J")
    return "accelera" if vf > vi else "rallenta"


def level5(sample, errs):
    t = prose(sample["problem"])
    if m := re.fullmatch(r"Un'auto che frena a " + Q % "km/h" + " si ferma in " + Q % "m" + r"\. In quanto spazio si ferma, sulla stessa strada, se frena a " + Q % "km/h" + r"\?", t):
        V1, d1, V2 = data(errs, m.group(1), "speed"), data(errs, m.group(2), "distance"), data(errs, m.group(3), "speed")
        r = V2 / V1
        if Rational(10, 13) < r < Rational(13, 10) or not Rational(1, 3) <= r <= 3 or min(V1, V2) < 21:
            errs.append("speeds too close, too far apart or too low")
        # the datum is a plausible braking: mu_d between 0,55 and 0,80
        mu = (V1 * KMH) ** 2 / (2 * G * d1)
        if not Rational(1, 2) <= mu <= Rational(17, 20):
            errs.append(f"the first braking implies mu_d = {float(mu):.2f}")
        answer(sample, errs, d1 * r**2, "m")
        return "rapporto"
    if m := re.fullmatch(r"Un'auto frena a " + Q % "km/h" + r" su una strada orizzontale; il coefficiente di attrito dinamico tra le gomme e la strada è \$\\mu_d = (0\{,\}\d\d)\$\. In quanto spazio si ferma\?", t):
        V = data(errs, m.group(1), "speed")
        mu = Rational(m.group(2).replace("{,}", "."))
        if not Rational(3, 10) <= mu <= Rational(9, 10):
            errs.append("mu_d outside 0,30-0,90")
        answer(sample, errs, (V * KMH) ** 2 / (2 * mu * G), "m")
        return "coefficiente"
    errs.append(f"level 5 text not recognised: {t!r}")
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    if sample.get("scene"):
        errs.append("unexpected scene")
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
