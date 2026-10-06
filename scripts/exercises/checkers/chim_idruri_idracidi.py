"""Checker for chim-idruri-idracidi (specs/exercises/chim-idruri-idracidi.md), written from the spec and from lesson
78-chim-idruri-idracidi.md, not from the generator.

The family is decided again from the formula (the other element a metal, or a non-metal of groups 14-15 with hydrogen
on the right, or of groups 16-17 with hydrogen on the left); the oxidation numbers are found again with the rules of
lesson 76; the names come from the tables of _chim3_i.py.
"""
import re

from checkers._chim3_i import (
    ASK_FORMULA, COVALENT_HYDRIDES, GROUP, HYDRACIDS, METAL_HYDRIDES, METAL_SET, by_key, check_choice, check_formula_question, check_name_question, check_number,
    choice_of, common, element_after, option_text, parse_formula, prose_and_extra, read_name_question, solve,
)

CASE_RANGES = {
    1: {"metallico": (0.22, 0.38), "covalente": (0.18, 0.32), "idracido": (0.18, 0.32), "ossido": (0.13, 0.27)},
    3: {"metallico": (0.45, 0.65), "covalente": (0.35, 0.55)},
    4: {"metallico": (0.45, 0.65), "covalente": (0.35, 0.55)},
    5: {"formula-nome": (0.40, 0.60), "nome-formula": (0.40, 0.60)},
}

KIND_LABELS = {"Idruro metallico": "metallico", "Idruro covalente": "covalente", "Idracido": "idracido", "Ossido": "ossido"}
HYDRIDES = METAL_HYDRIDES + COVALENT_HYDRIDES
NOT_NUMBERED = {"SiH4", "PH3", "AsH3"}
OXIDES = {"Na2O", "CaO", "SO2", "CO2", "Al2O3", "MgO", "SO3", "K2O"}


def family(atoms):
    """metallico, covalente, idracido or ossido, from the formula alone (the order of the symbols counts)."""
    symbols = [s for s, _ in atoms]
    if len(symbols) != 2:
        raise ValueError("not a binary compound")
    if "H" not in symbols:
        if "O" in symbols:
            return "ossido"
        raise ValueError("neither hydrogen nor oxygen")
    other = next(s for s in symbols if s != "H")
    if other in METAL_SET:
        if symbols[0] == "H":
            raise ValueError("hydrogen on the left of a metal")
        return "metallico"
    if GROUP.get(other) in (16, 17) and other != "O" and symbols[0] == "H":
        return "idracido"
    if GROUP.get(other) in (14, 15) and symbols[1] == "H":
        return "covalente"
    raise ValueError(f"cannot classify {symbols}")


def level1(sample, prose, errs):
    m = re.fullmatch(r"A quale famiglia appartiene \$(\\mathrm\{[^$]*\})\$\?", prose)
    if not m:
        errs.append(f"text not recognised: {prose!r}")
        return None
    atoms, charge, key = parse_formula(m.group(1))
    kind = family(atoms)
    if key not in OXIDES and key not in by_key(HYDRIDES + HYDRACIDS):
        errs.append(f"{key} is not a compound of the lesson")
    ch = choice_of(sample, errs)
    if ch:
        if {option_text(o["latex"]) for o in ch["options"]} != set(KIND_LABELS):
            errs.append("the four options are not the four families")
        check_choice(ch, lambda o: KIND_LABELS.get(option_text(o["latex"])) == kind, errs)
    return kind


def level2(sample, prose, errs):
    m = re.fullmatch(r"Qual è il numero di ossidazione (.+) in \$(\\mathrm\{[^$]*\})\$\?", prose)
    if not m:
        errs.append(f"text not recognised: {prose!r}")
        return None
    target = element_after(m.group(1))
    atoms, charge, key = parse_formula(m.group(2))
    if key in NOT_NUMBERED or key not in by_key(HYDRIDES + HYDRACIDS):
        errs.append(f"{key} is not a compound of level 2")
    if family(atoms) == "ossido" or charge != 0:
        errs.append("not a binary compound of hydrogen")
    values, _ = solve(atoms, charge)
    if target not in values:
        errs.append(f"{target} is not in the formula")
        return None
    check_number(sample, values[target], errs)
    return "idruro metallico" if values["H"] == -1 else "idrogeno a +1"


def level5(sample, prose, errs):
    if ASK_FORMULA.fullmatch(prose):
        check_formula_question(sample, prose, HYDRACIDS, errs)
        return "nome-formula"
    check_name_question(sample, prose, HYDRACIDS, errs)
    return "formula-nome"


def hydride_kind(sample, prose, errs, to_name):
    if to_name:
        check_name_question(sample, prose, HYDRIDES, errs)
        q = read_name_question(prose)
        key = q[1] if q else None
    else:
        check_formula_question(sample, prose, HYDRIDES, errs)
        ch = sample["answer"]
        key = parse_formula(ch["options"][ch["correct"]]["latex"])[2]
    comp = by_key(HYDRIDES).get(key)
    return comp["classe"] if comp else None


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
        elif lvl in (3, 4):
            kind = hydride_kind(sample, prose, errs, lvl == 3)
        else:
            kind = level5(sample, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    if kind and sample.get("params", {}).get("case") != kind:
        errs.append(f"params.case {sample.get('params', {}).get('case')!r} but the exercise is {kind!r}")
    return errs, kind
