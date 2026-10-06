"""Checker for fis-gravitazione-universale (specs/exercises/fis-gravitazione-universale.md), written from the spec
and the lesson 94-fis-gravitazione-universale.md, not from the generator.

F = G m1 m2 / r^2 with G = 6,67 * 10^-11 N m^2 / kg^2 and r between the centres, in metres. With the distance k times
as large the force is divided by k^2. Above the Earth r = R_T + h, with M_T = 5,97 * 10^24 kg and
R_T = 6,37 * 10^6 m. On the surface of a planet g = G M / R^2. A body between two others on a line is pulled by the
difference of the two forces, towards the body that pulls harder.
"""
import re

from sympy import Rational

from checkers._vettori import common, prose
from checkers._fis_keplero_newton import G, M_T, R_T, answer, dec, exact_dec, fmt, is_sci, mantissa, q, qs, two, whole

CASE_RANGES = {2: {"lontano": (0.40, 0.60), "vicino": (0.40, 0.60)}}
TIMES = {"doppia": 2, "tripla": 3, "quadrupla": 4}
PART = {"la metà": 2, "un terzo": 3, "un quarto": 4}


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(?:Due sfere di piombo|Due casse|Due persone) hanno masse di " + q("kg") + " e " + q("kg") + ", e i loro centri distano " + q("m") + r"\. Con quale forza si attraggono\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    m1, m2 = whole(errs, m.group(1), 11, 99, "m_1"), whole(errs, m.group(2), 11, 99, "m_2")
    r = two(errs, m.group(3), "r")
    answer(sample, errs, fmt(G * m1 * m2 / r**2, 2), "N")
    return "due corpi"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Due corpi si attraggono con una forza gravitazionale di " + q("N") + r"\. Quanto vale la forza se la distanza tra i loro centri diventa (doppia|tripla|quadrupla|la metà|un terzo|un quarto), senza cambiare le masse\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    F = dec(m.group(1))
    farther = m.group(2) in TIMES
    k = TIMES[m.group(2)] if farther else PART[m.group(2)]
    out = F / k**2 if farther else F * k**2
    small, big = (out, F) if farther else (F, out)
    if not re.fullmatch(r"[1-9]\{,\}[1-9]|0\{,\}[1-9][1-9]", exact_dec(small)):
        errs.append(f"the smaller force {small} has not two figures")
    sb = exact_dec(big)
    if big >= 100 or re.fullmatch(r"\d*0", sb) or re.fullmatch(r"\d", sb):
        errs.append(f"the larger force {sb} is 100 or more, or ends with an ambiguous zero, or has one figure")
    if m.group(1) != exact_dec(F):
        errs.append("the given force is written with useless zeros")
    answer(sample, errs, exact_dec(out), "N")
    return "lontano" if farther else "vicino"


KINDS = [
    (r"Un pianeta di massa " + qs("kg") + r" e il suo satellite di massa " + qs("kg") + r" hanno i centri a una distanza di " + qs("km") + r"\.", (23, 26), (20, 22), (5, 6)),
    (r"Una stella di massa " + qs("kg") + r" e un suo pianeta di massa " + qs("kg") + r" hanno i centri a una distanza di " + qs("km") + r"\.", (29, 31), (23, 27), (7, 9)),
    (r"Due asteroidi di masse " + qs("kg") + r" e " + qs("kg") + r" hanno i centri a una distanza di " + qs("km") + r"\.", (15, 18), (14, 17), (2, 4)),
]


def level3(sample, errs):
    s = prose(sample["problem"])
    for pat, r1, r2, rd in KINDS:
        m = re.fullmatch(pat + r" Con quale forza si attraggono\?", s)
        if m:
            break
    else:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    a1, e1, a2, e2, ad, ed = m.groups()
    for e, (lo, hi), what in ((e1, r1, "first mass"), (e2, r2, "second mass"), (ed, rd, "distance")):
        if not lo <= int(e) <= hi:
            errs.append(f"exponent of the {what} outside [{lo}, {hi}]")
    M1 = mantissa(errs, a1, 3, "m_1") * Rational(10) ** int(e1)
    M2 = mantissa(errs, a2, 3, "m_2") * Rational(10) ** int(e2)
    r = mantissa(errs, ad, 3, "d") * Rational(10) ** (int(ed) + 3)
    right = fmt(G * M1 * M2 / r**2, 3)
    if right is not None and not is_sci(right):
        errs.append("the force should be in scientific notation")
    answer(sample, errs, right, "N")
    return "corpi celesti"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un satellite di " + q("kg") + r" orbita a " + q("km") + r" sopra la superficie della Terra, che ha massa \$5\{,\}97 \\cdot 10\^\{24\}\\,\\text\{kg\}\$ e raggio \$6\{,\}37 \\cdot 10\^\{6\}\\,\\text\{m\}\$\. Con quale forza la Terra lo attira\?",
        s,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    mass = whole(errs, m.group(1), 121, 989, "m")
    h = whole(errs, m.group(2), 251, 2499, "h")
    answer(sample, errs, fmt(G * M_T * mass / (R_T + 1000 * h) ** 2, 3), "N")
    return "quota"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un pianeta ha massa " + qs("kg") + r" e raggio " + qs("km") + r"\. Quanto vale l'accelerazione di gravità sulla sua superficie\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    aM, eM, aR, eR = m.groups()
    if not 22 <= int(eM) <= 26 or not 3 <= int(eR) <= 4:
        errs.append("exponents out of range")
    M = mantissa(errs, aM, 3, "M") * Rational(10) ** int(eM)
    R = mantissa(errs, aR, 3, "R") * Rational(10) ** (int(eR) + 3)
    g = G * M / R**2
    if not Rational(1, 2) <= g <= 60:
        errs.append(f"g = {float(g)} outside 0,5-60 m/s^2")
    right = fmt(g, 3)
    if right is not None and is_sci(right):
        errs.append("g should be written without a power of ten")
    answer(sample, errs, right, "m/s2")
    return "g"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Tre corpi sono allineati\. Il corpo B, di " + q("kg") + r", sta tra il corpo A, di " + q("kg") + r", e il corpo C, di " + q("kg") + r": dista " + q("m") + r" da A e " + q("m") + r" da C\. Quanto vale la forza gravitazionale totale su B, e verso quale corpo è diretta\?",
        s,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    sB, sA, sC, sdA, sdC = m.groups()
    mB, mA, mC = (whole(errs, x, 11, 99, "mass") for x in (sB, sA, sC))
    dA, dC = two(errs, sdA, "d_A"), two(errs, sdC, "d_C")
    if dA < 1 or dC < 1:
        errs.append("distances under 1,1 m")
    FA, FC = G * mA * mB / dA**2, G * mC * mB / dC**2
    big, small = max(FA, FC), min(FA, FC)
    if not Rational(13, 10) <= big / small <= 8:
        errs.append("the two forces are too close or too different")
    answer(sample, errs, fmt(big - small, 2), "N", tail="verso A" if FA > FC else "verso C", tails=["verso A", "verso C"])
    scene = sample.get("scene") or {}
    data = scene.get("data", {})
    comma = lambda x: x.replace("{,}", ",")
    bodies = data.get("corpi") or []
    if scene.get("type") != "masse-allineate" or [(b.get("nome"), b.get("massa")) for b in bodies] != [("A", sA + " kg"), ("B", sB + " kg"), ("C", sC + " kg")]:
        errs.append("scene missing or with other masses")
    elif data.get("quote") != [comma(sdA) + " m", comma(sdC) + " m"]:
        errs.append("scene with other distances")
    elif bodies[0].get("x") != 0 or bodies[2].get("x") != 1 or abs(Rational(str(bodies[1].get("x"))) - dA / (dA + dC)) > Rational(1, 1000):
        errs.append("scene: B is not where the distances put it")
    return "tre corpi"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if lvl != 6 and sample.get("scene"):
        errs.append("only level 6 has a scene")
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
