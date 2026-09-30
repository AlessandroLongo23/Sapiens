"""Checker for chim-volume-molare (specs/exercises/chim-volume-molare.md), written from the spec and the lesson
36-chim-volume-molare.md, not from the generator.

Normal conditions, V_m = 22,4 L/mol: n = V / V_m, V = n V_m, m = n M, N = n N_A (atoms: N times the atoms of the
formula), d = M / V_m, M = d V_m; the molecular formula is n = M / M_min times the empirical one. Molar masses from
the table of lesson 01. Results with three significant figures.
"""
import re

from sympy import Rational

from checkers._chim_mole import NA, VM, answer, common, formula_options, molar, parse_tex_formula, quantity, reduce_formula, sig_of, text, value

L = quantity("L")
MOL = quantity("mol")
G = quantity("g")
GL = quantity("gL")
CN = "in condizioni normali"
GAS = r"di ([a-z ]+), \$(.+?)\$,"
NA_TEXT = r"Il numero di Avogadro è \$6\{,\}02 \\cdot 10\^\{23\}\\,\\text\{mol\}\^\{-1\}\$\."

CASE_RANGES = {
    1: {"moli": (0.40, 0.60), "volume": (0.40, 0.60)},
    2: {"massa": (0.40, 0.60), "volume": (0.40, 0.60)},
    3: {"molecole": (0.40, 0.60), "atomi": (0.40, 0.60)},
    4: {"densità": (0.40, 0.60), "massa molare": (0.40, 0.60)},
}


def three(s, errs, lo, hi, what):
    v = value(s)
    if sig_of(s) != 3 or not lo <= v <= hi:
        errs.append(f"{what} {s} not three figures in {lo}-{hi}")
    return v


def level1(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"Quante moli ci sono in " + L + " " + GAS + " " + CN + r"\?", s):
        parse_tex_formula(m.group(3))
        V = three(m.group(1), errs, 1, Rational("99.9"), "V")
        answer(sample, errs, V / VM, 3, "mol")
        return "moli"
    if m := re.fullmatch(r"Che volume occupano " + MOL + " " + GAS + " " + CN + r"\?", s):
        parse_tex_formula(m.group(3))
        n = three(m.group(1), errs, Rational(1, 10), Rational("9.99"), "n")
        answer(sample, errs, n * VM, 3, "L")
        return "volume"
    errs.append(f"level 1 text not recognised: {s!r}")
    return None


def level2(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"Quanti grammi pesano " + L + " " + GAS + " " + CN + r"\?", s):
        f = parse_tex_formula(m.group(3))
        V = three(m.group(1), errs, 1, Rational("99.9"), "V")
        answer(sample, errs, V / VM * molar(f), 3, "g")
        return "massa"
    if m := re.fullmatch(r"Che volume occupano " + G + " " + GAS + " " + CN + r"\?", s):
        f = parse_tex_formula(m.group(3))
        mass = three(m.group(1), errs, 1, Rational("99.9"), "m")
        answer(sample, errs, mass / molar(f) * VM, 3, "L")
        return "volume"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def level3(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Quant(i atomi|e molecole) ci sono in " + L + " " + GAS + " " + CN + r"\? " + NA_TEXT, s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    f = parse_tex_formula(m.group(4))
    V = three(m.group(2), errs, Rational(1, 10), Rational("99.9"), "V")
    N = V / VM * NA
    atoms = m.group(1) == "i atomi"
    if atoms:
        N *= sum(k for _, k in f)
    answer(sample, errs, N, 3, "atomi" if atoms else "molecole")
    return "atomi" if atoms else "molecole"


def level4(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"Qual è la densità (?:del |dell')([a-z ]+), \$(.+?)\$, " + CN + r"\?", s):
        f = parse_tex_formula(m.group(2))
        answer(sample, errs, molar(f) / VM, 3, "gL")
        return "densità"
    if m := re.fullmatch(r"Un gas ha densità " + GL + " " + CN + r"\. Qual è la sua massa molare\?", s):
        d = value(m.group(1))
        if sig_of(m.group(1)) != 3:
            errs.append("density without three figures")
        answer(sample, errs, d * VM, 3, "gmol")
        return "massa molare"
    errs.append(f"level 4 text not recognised: {s!r}")
    return None


def level5(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Un idrocarburo gassoso ha formula minima \$(.+?)\$, e " + CN + r" la sua densità è " + GL + r"\. Qual è la sua formula molecolare\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    fm = parse_tex_formula(m.group(1))
    if reduce_formula(fm)[1] != 1 or {e for e, _ in fm} != {"C", "H"}:
        errs.append("empirical formula not in lowest terms or not a hydrocarbon")
    d = value(m.group(2))
    n = d * VM / molar(fm)
    nn = int(round(n))
    if abs(n - nn) > Rational(5, 100) or nn < 2:
        errs.append(f"n = {float(n)} not a whole number from 2")
    want = [(e, k * nn) for e, k in fm]
    fs, right = formula_options(sample, errs)
    if right is not None and right != want:
        errs.append(f"correct option {right} != {want}")
    return f"n = {nn}"


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
