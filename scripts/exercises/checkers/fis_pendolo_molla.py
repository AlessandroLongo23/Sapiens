"""Checker for fis-pendolo-molla (specs/exercises/fis-pendolo-molla.md), written from the spec and the lesson
58-fis-pendolo-molla.md, not from the generator.

A mass m on a spring of constant k oscillates with period 2 pi sqrt(m / k), whatever the amplitude; a simple pendulum
of length l with 2 pi sqrt(l / g) for small oscillations, whatever the mass and the (small) amplitude. So a length
or a mass on the spring k times as big multiplies the period by sqrt(k), a constant k times as big divides it by
sqrt(k), the pendulum's mass and a small amplitude change nothing. Timed over n oscillations, T = t / n; then
k = 4 pi^2 m / T^2, l = g T^2 / (4 pi^2), g = 4 pi^2 l / T^2. g = 49/5 exactly, answers with two significant figures.
"""
import re

from sympy import Rational, pi, sqrt

from checkers._vettori import common, prose
from checkers._fis_forze_movimento import G, answer, data2, q

CASE_RANGES = {
    3: {k: (0.12, 0.28) for k in ["pendolo-lunghezza", "pendolo-massa", "pendolo-ampiezza", "molla-massa", "molla-costante"]},
    4: {"molla": (0.40, 0.60), "pendolo": (0.40, 0.60)},
}
TINY = Rational(11, 100), Rational(99, 100)
SMALL = Rational(11, 10), Rational(99, 10)
WORD = {"doppia": 2, "tripla": 3, "quadrupla": 4}


def tiny_or_small(errs, s, what):
    x = data2(errs, s, what)
    if not (TINY[0] <= x <= TINY[1] or SMALL[0] <= x <= SMALL[1]):
        errs.append(f"{what} {s} outside 0.11-0.99 and 1.1-9.9")
    return x


def timed(errs, n, tt):
    n = int(n)
    if n not in (10, 20):
        errs.append(f"{n} oscillations")
    t = data2(errs, tt, "time")
    return t / n


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un blocco di " + q("kg") + r", attaccato a una molla di costante elastica " + q("N/m") + r", oscilla su un piano orizzontale liscio\. Quanto vale il periodo delle oscillazioni\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    mass = tiny_or_small(errs, m.group(1), "mass")
    k = data2(errs, m.group(2), "k", 11, 99)
    answer(sample, errs, 2 * pi * sqrt(mass / k), "s")
    return "molla"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un pendolo è formato da una pallina di " + q("g") + r" appesa a un filo lungo " + q("m") + r"\. Quanto vale il periodo delle piccole oscillazioni\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    data2(errs, m.group(1), "mass", 11, 99)
    l = tiny_or_small(errs, m.group(2), "length")
    answer(sample, errs, 2 * pi * sqrt(l / G), "s")
    return "pendolo"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(Un pendolo oscilla|Un blocco attaccato a una molla oscilla) con un periodo di " + q("s") + r"\. Se (.*), quanto diventa il periodo\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    pendulum = m.group(1) == "Un pendolo oscilla"
    T0 = tiny_or_small(errs, m.group(2), "period")
    what = m.group(3)
    patterns = [
        ("pendolo-lunghezza", True, r"si usa un filo di lunghezza (doppia|tripla|quadrupla)"),
        ("pendolo-massa", True, r"si usa una pallina di massa (doppia|tripla|quadrupla)"),
        ("pendolo-ampiezza", True, r"si fa partire il pendolo da un angolo di \$(\d+)\^\\circ\$ invece che di \$2\^\\circ\$"),
        ("molla-massa", False, r"si usa un blocco di massa (doppia|tripla|quadrupla)"),
        ("molla-costante", False, r"si usa una molla con la costante elastica (doppia|tripla|quadrupla)"),
    ]
    for kind, is_pendulum, pat in patterns:
        mm = re.fullmatch(pat, what)
        if not mm:
            continue
        if is_pendulum != pendulum:
            errs.append("the change does not belong to the oscillator")
        if kind == "pendolo-ampiezza":
            if mm.group(1) not in ("4", "6", "8"):
                errs.append("amplitude not small")
            factor = 1
        else:
            k = WORD[mm.group(1)]
            factor = {"pendolo-lunghezza": sqrt(k), "pendolo-massa": 1, "molla-massa": sqrt(k), "molla-costante": 1 / sqrt(k)}[kind]
        answer(sample, errs, T0 * factor, "s")
        return kind
    errs.append(f"level 3 change not recognised: {what!r}")
    return None


def level4(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Un blocco di " + q("kg") + r", appeso a una molla, compie (\d+) oscillazioni complete in " + q("s") + r"\. Quanto vale la costante elastica della molla\?", s):
        mass = tiny_or_small(errs, m.group(1), "mass")
        T = timed(errs, m.group(2), m.group(3))
        answer(sample, errs, 4 * pi**2 * mass / T**2, "N/m", lo=1, hi=99)
        return "molla"
    if m := re.fullmatch(r"Un pendolo compie (\d+) piccole oscillazioni complete in " + q("s") + r"\. Quanto è lungo il filo\?", s):
        T = timed(errs, m.group(1), m.group(2))
        answer(sample, errs, G * T**2 / (4 * pi**2), "m", lo=Rational(1, 10), hi=Rational(99, 10))
        return "pendolo"
    errs.append(f"level 4 text not recognised: {s!r}")
    return None


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Su un pianeta sconosciuto un pendolo lungo " + q("m") + r" compie (\d+) piccole oscillazioni complete in " + q("s") + r"\. Quanto vale l'accelerazione di gravità sul pianeta\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    l = tiny_or_small(errs, m.group(1), "length")
    T = timed(errs, m.group(2), m.group(3))
    answer(sample, errs, 4 * pi**2 * l / T**2, "m/s2", lo=Rational(1, 2), hi=30)
    return "pianeta"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if sample.get("scene"):
        errs.append("this generator has no scenes")
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
