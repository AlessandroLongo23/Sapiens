"""Checker for chim-formula-minima (specs/exercises/chim-formula-minima.md), written from the spec and the lesson
35-chim-formula-minima.md, not from the generator.

Level 1: the empirical formula is the molecular one with every index divided by their greatest common divisor.
Level 2: the percentage of an element is its mass over the sample's, times 100, with three significant figures.
Levels 3-5: in 100 g the percentages are grams; grams over atomic mass give the moles of atoms; divided by the
smallest they give the ratio, multiplied by the smallest of 1, 2, 3, 4 that makes every quotient whole within 0,1.
Level 5: n = M / M_min must be a whole number within 0,05, and the molecular formula is n times the empirical one.
"""
import re

from sympy import Rational

from checkers._chim_mole import A, NAMES, answer, common, formula_options, molar, parse_tex_formula, quantity, reduce_formula, sig_of, text, value

PCT = quantity("pct")
G = quantity("g")
GMOL = quantity("gmol")
NAME = "(" + "|".join(NAMES) + ")"


def names_list(s):
    """ "azoto e ossigeno", "carbonio, idrogeno e ossigeno" → element symbols."""
    parts = re.split(r", | e ", s)
    return [NAMES[p] for p in parts]


def percents_list(s):
    """ "$40{,}0\\,\\%$ di carbonio, $6{,}7\\,\\%$ di idrogeno e $53{,}3\\,\\%$ di ossigeno" → [(el, pct)]."""
    items = re.findall(PCT + " di " + NAME, s)
    rebuilt = [f"${p}\\,\\%$ di {n}" for p, n in items]
    joined = rebuilt[0] if len(rebuilt) == 1 else ", ".join(rebuilt[:-1]) + " e " + rebuilt[-1]
    if joined != s:
        raise ValueError(f"percentages not recognised: {s!r}")
    return [(NAMES[n], value(p)) for p, n in items]


def empirical(pcts, errs):
    """The lesson's procedure: the empirical formula and the multiplier used."""
    total = sum(p for _, p in pcts)
    if abs(total - 100) > Rational(2, 10):
        errs.append(f"percentages add up to {total}")
    for _, p in pcts:
        s = str(p)
        if p.q not in (1, 2, 5, 10):
            errs.append(f"percentage {p} not with one decimal")
    mol = [p / A[e] for e, p in pcts]
    mn = min(mol)
    ratio = [m / mn for m in mol]
    for k in (1, 2, 3, 4):
        if all(abs(r * k - round(r * k)) < Rational(1, 10) for r in ratio):
            return [(e, int(round(r * k))) for (e, _), r in zip(pcts, ratio)], k
    errs.append("no multiplier up to 4 makes the quotients whole")
    return None, None


def level1(sample, errs):
    m = re.fullmatch(r"La formula molecolare (?:del |dello |dell')([a-zà-ù' ]+) è \$(.+?)\$\. Qual è la sua formula minima\?", text(sample))
    if not m:
        errs.append(f"level 1 text not recognised: {text(sample)!r}")
        return None
    f = parse_tex_formula(m.group(2))
    mini, g = reduce_formula(f)
    if g < 2:
        errs.append("the molecular formula is already empirical")
    fs, right = formula_options(sample, errs)
    if right is not None and right != mini:
        errs.append(f"correct option {right} != {mini}")
    if sum(1 for x in fs if x == mini) != 1:
        errs.append("the empirical formula is not exactly one option")
    return "molecola"


def level2(sample, errs):
    m = re.fullmatch(r"Un campione di " + G + r" di un composto di (.+?) contiene " + G + " di " + NAME + r"\. Qual è la percentuale in massa di " + NAME + r" nel composto\?", text(sample))
    if not m:
        errs.append(f"level 2 text not recognised: {text(sample)!r}")
        return None
    ms, mx = value(m.group(1)), value(m.group(3))
    els = names_list(m.group(2))
    if m.group(4) != m.group(5) or NAMES[m.group(4)] not in els:
        errs.append("element not in the compound")
    if sig_of(m.group(1)) != 3 or sig_of(m.group(3)) != 3:
        errs.append("data without three significant figures")
    if not (1 <= ms < 10 and Rational(1, 10) <= mx < ms):
        errs.append("masses out of range")
    # the datum agrees with the compound of params (independent composition from the table)
    f = [(e, int(k) if k else 1) for e, k in re.findall(r"([A-Z][a-z]?)(\d*)", sample["params"]["formula"])]
    if [e for e, _ in f] != els:
        errs.append("params formula does not match the elements named")
    frac = sum(A[e] * k for e, k in f if e == NAMES[m.group(4)]) / molar(f)
    decimals = len(m.group(3).split("{,}")[1]) if "{,}" in m.group(3) else 0
    if abs(mx - ms * frac) > Rational(1, 2) * Rational(10) ** -decimals:
        errs.append("mass of the element not consistent with the compound")
    answer(sample, errs, mx / ms * 100, 3, "pct")
    return "binario" if len(els) == 2 else "ternario"


def level34(sample, errs, lvl):
    m = re.fullmatch(r"Un composto contiene (.+)\. Qual è la sua formula minima\?", text(sample))
    if not m:
        errs.append(f"level {lvl} text not recognised: {text(sample)!r}")
        return None
    pcts = percents_list(m.group(1))
    f, k = empirical(pcts, errs)
    if f is None:
        return None
    if (lvl == 3) != (k == 1):
        errs.append(f"multiplier {k} at level {lvl}")
    if reduce_formula(f)[1] != 1:
        errs.append("procedure result not in lowest terms")
    fs, right = formula_options(sample, errs)
    if right is not None and right != f:
        errs.append(f"correct option {right} != {f}")
    for x in fs:
        if x != f and reduce_formula(x)[0] == f:
            errs.append(f"distractor {x} has the same composition as the answer")
        if x != f and reduce_formula(x)[1] != 1:
            errs.append(f"distractor {x} not in lowest terms")
    return "interi" if k == 1 else f"per {k}"


def level5(sample, errs):
    m = re.fullmatch(r"Un composto contiene (.+), e la sua massa molare è " + GMOL + r"\. Qual è la sua formula molecolare\?", text(sample))
    if not m:
        errs.append(f"level 5 text not recognised: {text(sample)!r}")
        return None
    pcts = percents_list(m.group(1))
    f, _ = empirical(pcts, errs)
    if f is None:
        return None
    M = value(m.group(2))
    if sig_of(m.group(2)) != 3:
        errs.append("molar mass without three significant figures")
    n = M / molar(f)
    nn = int(round(n))
    if abs(n - nn) > Rational(5, 100) or nn < 2:
        errs.append(f"n = {float(n)} is not a whole number from 2")
    want = [(e, k * nn) for e, k in f]
    fs, right = formula_options(sample, errs)
    if right is not None and right != want:
        errs.append(f"correct option {right} != {want}")
    return f"n = {nn}"


LEVELS = {1: level1, 2: level2, 3: lambda s, e: level34(s, e, 3), 4: lambda s, e: level34(s, e, 4), 5: level5}


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
