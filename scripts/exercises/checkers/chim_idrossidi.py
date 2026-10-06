"""Checker for chim-idrossidi (specs/exercises/chim-idrossidi.md), written from the spec and from lesson
79-chim-idrossidi.md, not from the generator.

The oxidation number of the metal is found again from the sum with oxygen at -2 and hydrogen at +1; the formula is
the metal with as many OH groups as its oxidation number; the names come from the tables of _chim3_i.py; the hydroxide
that goes with an oxide is the one in which the metal has the oxidation number it has in the oxide.
"""
import re

from checkers._chim3_i import (
    ASK_FORMULA, BASIC_OXIDES, HYDROXIDES, METALS, by_key, check_formula_options, check_formula_question, check_name_options, check_name_question, check_number,
    choice_of, common, element_after, find_by_name, hydroxide, names_of, parse_formula, prose_and_extra, solve,
)

CASE_RANGES = {5: {"dalla formula": (0.40, 0.60), "dal nome": (0.40, 0.60)}}


def level1(sample, prose, errs):
    m = re.fullmatch(r"Qual è il numero di ossidazione (.+) in \$(\\mathrm\{[^$]*\})\$\?", prose)
    if not m:
        errs.append(f"text not recognised: {prose!r}")
        return None
    target = element_after(m.group(1))
    atoms, charge, key = parse_formula(m.group(2))
    if key not in by_key(HYDROXIDES) or by_key(HYDROXIDES)[key]["sym"] != target:
        errs.append(f"{key} is not a hydroxide of the lesson, or {target} is not its metal")
        return None
    values, _ = solve(atoms, charge)
    d = dict(atoms)
    if values[target] != d["O"] or d["O"] != d["H"]:
        errs.append("the oxidation number is not the number of OH groups")
    check_number(sample, values[target], errs)
    return "un gruppo" if d["O"] == 1 else "più gruppi"


def level2(sample, prose, errs):
    m = re.fullmatch(r"In un idrossido (.+) ha numero di ossidazione \$\+(\d)\$\. Qual è la formula dell'idrossido\?", prose)
    if not m:
        errs.append(f"text not recognised: {prose!r}")
        return None
    sym, n = element_after(m.group(1), "il"), int(m.group(2))
    if sym not in METALS or n not in METALS[sym][0]:
        errs.append(f"{sym} with +{n} is not in the table of the lesson")
        return None
    key = hydroxide(sym, n)["key"]
    ch = choice_of(sample, errs)
    if ch:
        check_formula_options(ch, key, errs)
    if parse_formula(sample.get("solution", ""))[2] != key:
        errs.append("solution is not the right formula")
    return "senza parentesi" if n == 1 else "con parentesi"


def level5(sample, prose, errs):
    ch = choice_of(sample, errs)
    m = re.fullmatch(r"Quale idrossido corrisponde all'ossido \$(\\mathrm\{[^$]*\})\$\?", prose)
    if m:
        atoms, charge, key = parse_formula(m.group(1))
        ox = by_key(BASIC_OXIDES).get(key)
        if ox is None:
            errs.append(f"{key} is not a basic oxide of the lesson")
            return None
        # the oxidation number of the metal from the sum, with oxygen at -2
        d = dict(atoms)
        n = 2 * d["O"] / d[ox["sym"]]
        if n != ox["n"]:
            errs.append("the table of the oxides is wrong")
        if ch:
            check_formula_options(ch, hydroxide(ox["sym"], int(n))["key"], errs)
        return "dalla formula"
    m = re.fullmatch(r"Quale idrossido corrisponde all'(ossido .+)\?", prose)
    if not m:
        errs.append(f"text not recognised: {prose!r}")
        return None
    name = m.group(1)
    ox = find_by_name(BASIC_OXIDES, name)
    if name == ox["iupac"] and name != ox["trad"]:
        errs.append("the oxide is given with its IUPAC name")
    hyd = hydroxide(ox["sym"], ox["n"])
    which = "stock" if name == ox["stock"] and name != ox["trad"] else "trad"
    if ch:
        check_name_options(ch, hyd[which], names_of(hyd), errs)
    return "dal nome"


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in (1, 2, 3, 4, 5):
        return [f"unknown level {lvl}"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    try:
        if lvl == 1:
            kind = level1(sample, prose, errs)
        elif lvl == 2:
            kind = level2(sample, prose, errs)
        elif lvl == 3:
            kind = check_name_question(sample, prose, HYDROXIDES, errs)
        elif lvl == 4:
            kind = check_formula_question(sample, prose, HYDROXIDES, errs)
        else:
            kind = level5(sample, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    if kind and sample.get("params", {}).get("case") != kind:
        errs.append(f"params.case {sample.get('params', {}).get('case')!r} but the exercise is {kind!r}")
    return errs, kind


assert ASK_FORMULA
