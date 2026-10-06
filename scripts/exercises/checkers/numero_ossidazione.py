"""Checker for numero-ossidazione (specs/exercises/numero-ossidazione.md), written from the spec and from lesson
76-numero-ossidazione.md, not from the generator.

The species is read from the LaTeX of the question; its oxidation numbers are found again with the eight rules in
their order of precedence (every element takes the value of its rule, except the one whose rule comes last or that
has none, found from the sum), and the number asked is compared with the answer and with the multiple choice. Level 6
crosses the two oxidation numbers of the text and reduces the subscripts.
"""
import re
from math import gcd

from checkers._chim3_i import check_formula_options, check_number, choice_of, common, element_after, parse_formula, prose_and_extra, solve

CASE_RANGES = {1: {"libero": (0.40, 0.60), "ione": (0.40, 0.60)}, 5: {"eccezione": (0.50, 0.70), "solito": (0.30, 0.50)}}

ASK = re.compile(r"Qual è il numero di ossidazione (.+) in \$(\\mathrm\{[^$]*\})\$\?")
ASK6 = re.compile(r"Che formula ha il composto tra (.+), con numero di ossidazione \$\+(\d)\$, e (.+), con numero di ossidazione \$-(\d)\$\?")
USUAL = {"H": 1, "O": -2}
# the lowest and the highest oxidation number of the non-metals (lesson 76: the group minus 18, the units of the group)
EXTREMES = {"H": (-1, 1), "B": (3, 3), "C": (-4, 4), "Si": (-4, 4), "N": (-3, 5), "P": (-3, 5), "O": (-2, 2), "S": (-2, 6), "F": (-1, -1), "Cl": (-1, 7), "Br": (-1, 7), "I": (-1, 7)}
# free elements as they are written (level 1)
FREE = {"Na", "Fe", "Cu", "Al", "Zn", "Mg", "O2", "Cl2", "N2", "H2", "S8", "P4", "Br2", "I2"}


def numbered(sample, prose, errs):
    m = ASK.fullmatch(prose)
    if not m:
        errs.append(f"text not recognised: {prose!r}")
        return None
    target = element_after(m.group(1))
    atoms, charge, key = parse_formula(m.group(2))
    symbols = [s for s, _ in atoms]
    if target not in symbols:
        errs.append(f"{target} is not in the formula")
        return None
    values, solved = solve(atoms, charge)
    x = values[target]
    if not -4 <= x <= 7:
        errs.append(f"oxidation number {x} out of range")
    for sym, value in values.items():
        lo, hi = EXTREMES.get(sym, (0, 7))
        if not lo <= value <= hi:
            errs.append(f"{sym} cannot have {value}")
    check_number(sample, x, errs)
    lvl = sample["level"]
    if lvl == 1:
        if len(atoms) != 1:
            errs.append("level 1 wants a free element or an ion of one atom")
        if charge != 0 and atoms[0][1] != 1:
            errs.append("an ion of level 1 has one atom")
        if charge == 0 and key not in FREE:
            errs.append(f"{key} is not how a free element of the lesson is written")
        return "libero" if charge == 0 else "ione"
    if lvl in (2, 3, 4):
        want = {2: 2, 3: 3}.get(lvl)
        if want and (len(atoms) != want or charge != 0):
            errs.append(f"level {lvl} wants a neutral compound of {want} elements")
        if lvl == 4 and (charge == 0 or len(atoms) < 2):
            errs.append("level 4 wants a polyatomic ion")
        if target != solved:
            errs.append(f"the element asked ({target}) is fixed by a rule: the one to find is {solved}")
        return {2: "binario", 3: "ternario", 4: "ione poliatomico"}[lvl]
    if lvl == 5:
        if target not in USUAL or charge != 0:
            errs.append("level 5 asks hydrogen or oxygen in a neutral compound")
            return None
        return "eccezione" if x != USUAL[target] else "solito"
    return None


def level6(sample, prose, errs):
    m = ASK6.fullmatch(prose)
    if not m:
        errs.append(f"text not recognised: {prose!r}")
        return None
    pos, neg = element_after(m.group(1), "il"), element_after(m.group(3), "il")
    p, q = int(m.group(2)), int(m.group(4))
    g = gcd(p, q)
    a, b = q // g, p // g
    key = pos + (str(a) if a != 1 else "") + neg + (str(b) if b != 1 else "")
    ch = choice_of(sample, errs)
    if ch:
        for o in ch["options"]:
            atoms, charge, _ = parse_formula(o["latex"])
            if [s for s, _ in atoms] != [pos, neg] or charge != 0:
                errs.append(f"option {o['latex']!r} is not a formula of {pos} and {neg}, in this order")
        check_formula_options(ch, key, errs)
    if parse_formula(sample.get("solution", ""))[2] != key:
        errs.append("solution is not the right formula")
    return "da semplificare" if g > 1 else "già ridotta"


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in (1, 2, 3, 4, 5, 6):
        return [f"unknown level {lvl}"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    try:
        kind = level6(sample, prose, errs) if lvl == 6 else numbered(sample, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    if kind and sample.get("params", {}).get("case") != kind:
        errs.append(f"params.case {sample.get('params', {}).get('case')!r} but the exercise is {kind!r}")
    return errs, kind
