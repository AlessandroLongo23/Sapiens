"""Checker for fis-attrito (specs/exercises/fis-attrito.md), written from the spec and the lesson 19-fis-attrito.md.

The problem is read back from its text. On a level floor with no other vertical force the pressing force is the
weight m * 9,8 N/kg; a hand pressing down adds its force, a rope pulling up takes its force away; against a wall the
pressing force is the push. Static friction equals the push while the body stays still (push up to mu_s * F_perp),
kinetic friction is mu_d * F_perp. Data have two significant figures, the coefficients two decimals between 0,10 and
0,80, and mu_d < mu_s; the answer is the exact value rounded half up to two figures, never at a tie; on level 3 the
push is at most 90% or at least 110% of the maximum static friction, so the case is never borderline.
"""
import re

from sympy import Rational

from checkers.forze_comune import common, expect, parse_num, prose, sig_figs

CASE_RANGES = {
    2: {"dinamico": (0.40, 0.60), "statico": (0.40, 0.60)},
    3: {"fermo": (0.40, 0.60), "striscia": (0.40, 0.60)},
    4: {"mano": (0.40, 0.60), "corda": (0.40, 0.60)},
    5: {"massa": (0.40, 0.60), "spinta": (0.40, 0.60)},
}

G = Rational(98, 10)
S2 = ("sig", 2)
BODY = r"(Una cassa|Uno scatolone|Un mobile|Una slitta|Un blocco di legno)"
WHERE = r"(su un pavimento orizzontale|su una strada innevata orizzontale|su un tavolo orizzontale)"
Q = r"\$(.+?)\\,\\text\{(?:N|kg)\}\$"
MU = r"\$\\mu_([sd]) = (.+?)\$"
FEM = {"Una cassa": True, "Una slitta": True, "Uno scatolone": False, "Un mobile": False, "Un blocco di legno": False}


def num2(errs, s, what):
    if sig_figs(s) != 2:
        errs.append(f"{what} {s!r} has not two significant figures")
    return parse_num(s)


def coeff(errs, s):
    v = parse_num(s)
    if not (Rational(1, 10) <= v <= Rational(8, 10)) or (v * 100) % 1:
        errs.append(f"coefficient {s} outside 0,10-0,80")
    return v


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY + " di " + Q + " striscia " + WHERE + r"; il coefficiente di attrito dinamico è " + MU + r"\. Quanto vale la forza di attrito\?", s)
    if not m or m.group(4) != "d":
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    mass, md = num2(errs, m.group(2), "mass"), coeff(errs, m.group(5))
    truth = md * mass * G
    if not 1 <= truth <= 99:
        errs.append("friction outside 1-99 N")
    expect(errs, sample, truth, "N", S2)
    return "dinamico"


def level2(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Per trascinare a velocità costante " + BODY.lower() + " di " + Q + " " + WHERE + r" serve una forza orizzontale di " + Q + r"\. Quanto vale il coefficiente di attrito dinamico\?", s):
        mass, F, kind = num2(errs, m.group(2), "mass"), num2(errs, m.group(4), "force"), "dinamico"
    elif m := re.fullmatch(BODY + " di " + Q + r" è ferm([ao]) " + WHERE + r"\. La forza orizzontale più piccola che (la|lo) mette in moto è di " + Q + r"\. Quanto vale il coefficiente di attrito statico\?", s):
        if (m.group(3) == "a") != FEM[m.group(1)] or (m.group(5) == "la") != FEM[m.group(1)]:
            errs.append("agreement")
        mass, F, kind = num2(errs, m.group(2), "mass"), num2(errs, m.group(6), "force"), "statico"
    else:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    expect(errs, sample, F / (mass * G), "", S2)
    return kind


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BODY + " di " + Q + r" è ferm([ao]) " + WHERE + ", con " + MU + " e " + MU + r"\. (La|Lo) si spinge orizzontalmente con una forza di " + Q + r"\. Quanto vale la forza di attrito\?", s)
    if not m or m.group(5) != "s" or m.group(7) != "d":
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    if (m.group(3) == "a") != FEM[m.group(1)] or (m.group(9) == "La") != FEM[m.group(1)]:
        errs.append("agreement")
    mass, ms, md, F = num2(errs, m.group(2), "mass"), coeff(errs, m.group(6)), coeff(errs, m.group(8)), num2(errs, m.group(10), "push")
    if not md < ms:
        errs.append("mu_d not smaller than mu_s")
    Fn = mass * G
    smax = ms * Fn
    if F <= smax * Rational(9, 10):
        expect(errs, sample, F, "N", S2)
        return "fermo"
    if F >= smax * Rational(11, 10):
        expect(errs, sample, md * Fn, "N", S2)
        return "striscia"
    errs.append(f"push {F} too close to the maximum static friction {smax}")
    return None


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        BODY + " di " + Q + r" è appoggiat([ao]) " + WHERE + ", con " + MU + r"\. (Una mano (?:la|lo) preme anche verso il basso|Una corda (?:la|lo) tira verso l'alto) con una forza di "
        + Q + r"(, più piccola del suo peso)?\. Quanto vale l'attrito statico massimo\?",
        s,
    )
    if not m or m.group(5) != "s":
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    if (m.group(3) == "a") != FEM[m.group(1)] or (" la " in m.group(7)) != FEM[m.group(1)]:
        errs.append("agreement")
    mass, ms, Fv = num2(errs, m.group(2), "mass"), coeff(errs, m.group(6)), num2(errs, m.group(8), "vertical force")
    if not 1 <= Fv <= 99:
        errs.append("vertical force outside 1-99 N")
    P = mass * G
    down = m.group(7).startswith("Una mano")
    if not down and (Fv >= P or not m.group(9)):
        errs.append("the rope does not pull less than the weight")
    Fn = P + Fv if down else P - Fv
    truth = ms * Fn
    if not 1 <= truth <= 99:
        errs.append("friction outside 1-99 N")
    expect(errs, sample, truth, "N", S2)
    return "mano" if down else "corda"


def level5(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Un libro è premuto contro una parete verticale da una mano che lo spinge orizzontalmente con una forza di " + Q + r"; tra libro e parete " + MU + r"\. Qual è la massa più grande che il libro può avere senza scivolare\?", s):
        F, ms = num2(errs, m.group(1), "push"), coeff(errs, m.group(3))
        expect(errs, sample, ms * F / G, "kg", S2)
        return "massa"
    if m := re.fullmatch(r"Un libro di " + Q + r" è premuto contro una parete verticale da una mano che lo spinge orizzontalmente; tra libro e parete " + MU + r"\. Con quale forza minima bisogna spingerlo perché non scivoli\?", s):
        mass, ms = num2(errs, m.group(1), "mass"), coeff(errs, m.group(3))
        expect(errs, sample, mass * G / ms, "N", S2)
        return "spinta"
    errs.append(f"level 5 text not recognised: {s!r}")
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = common(sample)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
