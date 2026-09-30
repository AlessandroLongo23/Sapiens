"""Checker for chim-legge-charles-gay-lussac (specs/exercises/chim-legge-charles-gay-lussac.md), written from the spec
and the lesson 32-chim-legge-charles-gay-lussac.md, not from the generator.

At constant pressure V1 / T1 = V2 / T2 (Charles), at constant volume p1 / T1 = p2 / T2 (Gay-Lussac), with T = t + 273
in kelvin. On the V-T graph at constant pressure the points lie on a line through the origin, V = c T.
"""
import re

from checkers._chim_gas import answer, answer_int, common, quantity, sig_of, text, value
from sympy import Rational

CASE_RANGES = {
    4: {"charles": (0.40, 0.60), "gay-lussac": (0.40, 0.60)},
}

C = r"\$(-?\d+)\\,\^\\circ\\text\{C\}\$"
K = r"\$(\d+)\\,\\text\{K\}\$"


def celsius(s, errs, lo, hi):
    t = int(s)
    if not lo <= t <= hi or abs(t) < 5:
        errs.append(f"temperature {t} out of range")
    return t


def level1(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Un gas occupa " + quantity("L") + " alla temperatura di " + K + r"\. A pressione costante viene portato a " + K + r"\. Quale volume occupa\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    V1, T1, T2 = value(m.group(1)), int(m.group(2)), int(m.group(3))
    if sig_of(m.group(1)) != 2 or abs(T1 - T2) < 20:
        errs.append("data")
    answer(sample, errs, V1 * Rational(T2, T1), 2, "L")
    return "scalda" if T2 > T1 else "raffredda"


def level2(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Un palloncino contiene " + quantity("L") + " d'aria a " + C + r"\. La temperatura diventa " + C + r", e la pressione resta la stessa\. Quale volume ha il palloncino\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    V1 = value(m.group(1))
    t1, t2 = celsius(m.group(2), errs, -40, 150), celsius(m.group(3), errs, -40, 150)
    answer(sample, errs, V1 * Rational(t2 + 273, t1 + 273), 3, "L")
    return "scalda" if t2 > t1 else "raffredda"


def level3(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"(Una bombola contiene un gas|La gomma di un'auto contiene aria|Una bomboletta spray contiene un gas|Un recipiente di vetro chiuso contiene aria) alla pressione di \$(\d+(?:\{,\}\d+)?)\\,\\text\{(atm|kPa)\}\$ e alla temperatura di " + C + r"\. Il volume non può cambiare\. Quale pressione ha il gas a " + C + r"\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    p1, u = value(m.group(2)), m.group(3)
    t1, t2 = celsius(m.group(4), errs, -30, 400), celsius(m.group(5), errs, -30, 400)
    if sig_of(m.group(2)) != 3:
        errs.append("pressure without three significant figures")
    answer(sample, errs, p1 * Rational(t2 + 273, t1 + 273), 3, u)
    return u


def level4(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"Un gas occupa \$(\d+)\\,\\text\{mL\}\$ a " + C + r"\. Lo si scalda o lo si raffredda a pressione costante, e alla fine occupa \$(\d+)\\,\\text\{mL\}\$\. A quale temperatura, in gradi Celsius\?", s):
        x1, t1, x2, kind = int(m.group(1)), int(m.group(2)), int(m.group(3)), "charles"
    elif m := re.fullmatch(r"Un gas in un recipiente rigido ha la pressione di \$(\d+)\\,\\text\{kPa\}\$ a " + C + r"\. Dopo averlo scaldato o raffreddato, la pressione è \$(\d+)\\,\\text\{kPa\}\$\. A quale temperatura, in gradi Celsius\?", s):
        x1, t1, x2, kind = int(m.group(1)), int(m.group(2)), int(m.group(3)), "gay-lussac"
    else:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    T2 = Rational(t1 + 273) * Rational(x2, x1)
    if T2.q != 1:
        errs.append("T2 is not a whole number of kelvin")
    answer_int(sample, errs, T2 - 273, "C")
    return kind


def level5(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Il grafico mostra il volume di una quantità fissa di gas in funzione della temperatura assoluta, a pressione costante\. Quale volume ha il gas a " + C + r"\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    T = int(m.group(1)) + 273
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "grafico-dati" or d.get("x", {}).get("nome") != "T" or d.get("y", {}).get("nome") != "V":
        errs.append("no V-T graph")
        return None
    pts = [(Rational(str(a)), Rational(str(b))) for a, b in d.get("punti", [])]
    ratios = {b / a for a, b in pts}
    if len(pts) < 3 or len(ratios) != 1:
        errs.append(f"the points are not on a line through the origin: {pts}")
        return None
    c = ratios.pop()
    if any((b / Rational(str(d["y"]["passo"]))).q != 1 for _, b in pts):
        errs.append("a point off the grid")
    if any(a == T for a, _ in pts):
        errs.append("the temperature asked is one of the points")
    answer(sample, errs, c * T, 3, "L")
    return "grafico"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


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
