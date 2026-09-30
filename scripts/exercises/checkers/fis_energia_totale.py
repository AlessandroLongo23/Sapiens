"""Checker for fis-energia-totale (specs/exercises/fis-energia-totale.md), written from the spec and the lesson
64-fis-energia-totale.md, not from the generator.

Kinetic friction on a level floor is mu m g, and its work over d is -mu m g d; after d a body that was moving at v
has v_f^2 = v^2 - 2 mu g d. The energy dissipated on a ramp is the loss of mechanical energy, m g h - m v^2 / 2. On an incline
the pressing force is m g cos(alpha), so after a length l from rest v = sqrt(2 g l (sin(alpha) - mu cos(alpha))).
The efficiency is useful over spent energy, and the energy spent is the useful one divided by the efficiency.
"""
import re

from sympy import Rational, cos, pi, sin, sqrt, tan

from checkers._fis_energia import G, Q, answer, data, percent_answer
from checkers._vettori import common, num, prose

KG, M, MS, KJ = Q("kg"), Q("m"), Q("m/s"), Q("kJ")
MU = r"\$\\mu_d = (0\{,\}\d\d)\$"


def coeff(errs, s, lo, hi):
    mu = num(s)
    if not Rational(lo, 100) <= mu <= Rational(hi, 100):
        errs.append("coefficient out of range")
    return mu


def rad(d):
    return pi * Rational(d) / 180


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una cassa di " + KG + " scivola per " + M + " su un pavimento orizzontale; tra la cassa e il pavimento " + MU + r"\. Quanto lavoro compie l'attrito\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    mass, d, mu = data(errs, m.group(1), "mass"), data(errs, m.group(2), "distance"), coeff(errs, m.group(3), 10, 90)
    answer(sample, errs, -mu * mass * G * d, "J", lo=1, hi=Rational(995, 10))
    return "lavoro"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una cassa scivola sul pavimento a " + MS + "; tra la cassa e il pavimento " + MU + r"\. Con che velocità si muove dopo " + M + r"\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    v, mu, d = data(errs, m.group(1), "speed"), coeff(errs, m.group(2), 10, 90), data(errs, m.group(3), "distance")
    if not (2 <= v <= 15 and Rational(1, 2) <= d <= 30):
        errs.append("data out of range")
    lost = 2 * mu * G * d
    if not Rational(19, 100) * v**2 <= lost <= Rational(91, 100) * v**2:
        errs.append("friction takes too little or too much of the kinetic energy")
    answer(sample, errs, sqrt(v**2 - lost), "m/s")
    return "velocita"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un blocco di " + KG + " parte da fermo dalla cima di una rampa curva alta " + M + " e arriva in fondo a " + MS + r"\. Quanta energia è stata dissipata dagli attriti\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    mass, h, v = data(errs, m.group(1), "mass"), data(errs, m.group(2), "height"), data(errs, m.group(3), "speed")
    ideal2 = 2 * G * h
    if not (Rational(9, 100) * ideal2 <= v**2 <= Rational(81, 100) * ideal2):
        errs.append("speed not between 30% and 90% of the frictionless one")
    answer(sample, errs, mass * G * h - mass * v**2 / 2, "J", lo=1, hi=Rational(995, 10))
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "pista-energia" or Rational(str(d.get("hA"))) != h or d.get("hB") != 0 or d.get("testoA") != m.group(2).replace("{,}", ",") + " m":
        errs.append("the scene does not match the data")
    if "vA" in d or "testoB" in d:
        errs.append("the scene shows more than the data")
    return "dissipata"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un blocco parte da fermo e scivola per " + M + r" lungo un piano inclinato di \$(\d+)\^\\circ\$, con " + MU + r"\. Con che velocità arriva in fondo\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    l, a, mu = data(errs, m.group(1), "length"), int(m.group(2)), coeff(errs, m.group(3), 10, 60)
    if not 20 <= a <= 60 or tan(rad(a)) < Rational(13, 10) * mu:
        errs.append("angle out of range or too close to the limit angle")
    answer(sample, errs, sqrt(2 * G * l * (sin(rad(a)) - mu * cos(rad(a)))), "m/s")
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "piano-inclinato" or d.get("angolo") != a or d.get("testoAngolo") != f"{a}°" or d.get("lunghezza") != m.group(1).replace("{,}", ",") + " m" or "forze" in d:
        errs.append("the scene does not match the data")
    return "rampa"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un argano elettrico solleva un carico di " + KG + " di " + M + ", consumando " + KJ + r" di energia elettrica\. Qual è il suo rendimento\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    mass, h, E = data(errs, m.group(1), "mass"), data(errs, m.group(2), "height"), data(errs, m.group(3), "energy")
    eta = mass * G * h / (E * 1000)
    if not Rational(1, 5) <= eta <= Rational(95, 100):
        errs.append("efficiency out of range")
    percent_answer(sample, errs, eta)
    return "rendimento"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(Un motore elettrico|Un motore a benzina|Una pompa|Un montacarichi) con un rendimento del \$(\d\d)\\%\$ deve fornire " + KJ + r" di energia utile\. Quanta energia consuma\?", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    p, Eu = int(m.group(2)), data(errs, m.group(3), "useful energy")
    if not 15 <= p <= 95 or p % 10 == 0:
        errs.append("efficiency out of range")
    answer(sample, errs, Eu * 100 / p, "kJ", hi=Rational(995, 10))
    return "spesa"


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
    if lvl not in (3, 4) and sample.get("scene"):
        errs.append("no scene expected")
    return errs, kind
