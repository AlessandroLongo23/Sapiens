"""Checker for fis-potenza (specs/exercises/fis-potenza.md), written from the spec and the lesson 60-fis-potenza.md,
not from the generator.

Average power is work over time, P = W / dt; lifting a load at constant speed takes a force equal to the weight m g,
so P = m g h / dt, and at speed v, P = m g v; a force along the velocity gives P = F v, with v in m/s (km/h over
18/5). One kilowatt-hour is 1000 W for 3600 s, 3.6e6 J. g = 49/5, exact arithmetic with sympy, results with two
significant figures (checkers/_fis_lavoro.py).
"""
import re

from sympy import Rational

from checkers._fis_lavoro import G, answer, data
from checkers._vettori import common, prose

CASE_RANGES = {
    3: {"argano": (0.40, 0.60), "traino": (0.40, 0.60)},
    5: {"kWh": (0.40, 0.60), "joule": (0.40, 0.60)},
}

Q = r"\$(\d+(?:\{,\}\d+)?)\\,\\text\{%s\}\$"
APPL = r"(Un forno elettrico|Una stufa elettrica|Un bollitore|Un condizionatore)"


def level1(sample, errs):
    t = prose(sample["problem"])
    m = re.fullmatch(r"Un motore compie un lavoro di " + Q % "J" + " in " + Q % "s" + r"\. Quale potenza media sviluppa\?", t)
    if not m:
        errs.append(f"level 1 text not recognised: {t!r}")
        return None
    W, dt = data(errs, m.group(1), "work", 3), data(errs, m.group(2), "time")
    if not (dt < 10 and "{,}" in m.group(2)):
        errs.append("time not between 1,1 and 9,9 s")
    answer(sample, errs, W / dt, "W")
    return "lavoro-tempo"


def level2(sample, errs):
    t = prose(sample["problem"])
    m = re.fullmatch(r"Un montacarichi solleva a velocità costante una cassa di " + Q % "kg" + r" fino a un'altezza di " + Q % "m" + " in " + Q % "s" + r"\. Quale potenza media sviluppa\?", t)
    if not m:
        errs.append(f"level 2 text not recognised: {t!r}")
        return None
    mass, h, dt = data(errs, m.group(1), "mass"), data(errs, m.group(2), "height"), data(errs, m.group(3), "time")
    answer(sample, errs, mass * G * h / dt, "W")
    return "sollevare"


def level3(sample, errs):
    t = prose(sample["problem"])
    if m := re.fullmatch(r"Un argano solleva un carico di " + Q % "kg" + r" a velocità costante, " + Q % "m/s" + r"\. Quale potenza sviluppa\?", t):
        mass, v = data(errs, m.group(1), "mass"), data(errs, m.group(2), "speed")
        if not Rational(11, 100) <= v <= Rational(99, 100):
            errs.append("speed outside 0,11-0,99 m/s")
        answer(sample, errs, mass * G * v, "W")
        return "argano"
    if m := re.fullmatch(r"Un cavallo tira un carro lungo una strada piana con una forza di " + Q % "N" + r", parallela alla strada, e il carro avanza a velocità costante, " + Q % "m/s" + r"\. Quale potenza sviluppa il cavallo\?", t):
        F, v = data(errs, m.group(1), "force", 3), data(errs, m.group(2), "speed")
        answer(sample, errs, F * v, "W")
        return "traino"
    errs.append(f"level 3 text not recognised: {t!r}")
    return None


def level4(sample, errs):
    t = prose(sample["problem"])
    m = re.fullmatch(r"Un'auto viaggia a velocità costante, " + Q % "km/h" + "; le forze resistenti valgono in tutto " + Q % "N" + r"\. Quale potenza sviluppa il motore\?", t)
    if not m:
        errs.append(f"level 4 text not recognised: {t!r}")
        return None
    V, F = data(errs, m.group(1), "speed"), data(errs, m.group(2), "force", 3)
    answer(sample, errs, F * V * Rational(5, 18), "W")
    return "km/h"


def level5(sample, errs):
    t = prose(sample["problem"])
    if m := re.fullmatch(APPL + " da " + Q % "kW" + r" resta acces([ao]) per \$(\d+)\$ minuti\. Quanta energia consuma, in kilowattora\?", t):
        if m.group(1).startswith("Una") != (m.group(3) == "a"):
            errs.append("agreement")
        P, minutes = data(errs, m.group(2), "power"), data(errs, m.group(4), "minutes")
        if not (Rational(11, 10) <= P <= Rational(39, 10) and 11 <= minutes <= 99):
            errs.append("data outside the ranges")
        answer(sample, errs, P * minutes / 60, "kWh")
        return "kWh"
    if m := re.fullmatch(APPL + " da " + Q % "kW" + r" resta acces([ao]) per " + Q % "h" + r"\. Quanta energia consuma, in joule\?", t):
        if m.group(1).startswith("Una") != (m.group(3) == "a"):
            errs.append("agreement")
        P, h = data(errs, m.group(2), "power"), data(errs, m.group(4), "time")
        answer(sample, errs, P * 1000 * h * 3600, "J")
        return "joule"
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
