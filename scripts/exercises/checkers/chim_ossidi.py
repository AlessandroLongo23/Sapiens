"""Checker for chim-ossidi (specs/exercises/chim-ossidi.md), written from the spec and from lesson 77-chim-ossidi.md,
not from the generator.

The kind of a compound is decided again from its formula (two elements, oxygen at -2 or at -1, a metal or a
non-metal); the names of the oxides are built again from the tables of _chim3_i.py; the peroxides are found from the
oxidation number of oxygen; the questions on the oxides outside the two rules have an answer key typed from the lesson.
"""
import re

from checkers._chim3_i import (
    ANHYDRIDES, ASK_FORMULA, BASIC_OXIDES, METAL_SET, NAMES, PEROXIDES, check_choice, check_formula_options, check_formula_question, check_name_options,
    check_name_question, choice_of, common, option_text, parse_formula, prose_and_extra, solve,
)

CASE_RANGES = {
    1: {"basico": (0.22, 0.38), "acido": (0.22, 0.38), "perossido": (0.13, 0.27), "nessuno": (0.13, 0.27)},
    6: {"quale perossido": (0.27, 0.43), "perossido nome": (0.08, 0.23), "perossido formula": (0.08, 0.23), "particolari": (0.27, 0.43)},
}

KIND_LABELS = {"Ossido basico": "basico", "Ossido acido (anidride)": "acido", "Perossido": "perossido", "Non è un ossido": "nessuno"}
AMPHOTERIC = {"Al", "Zn"}
# level 1: the formulas that are not oxides
NOT_OXIDES = {"OF2", "NaOH", "Ca(OH)2", "H2SO4", "HNO3", "CaCO3", "HCl", "NaCl", "H2S", "NH3", "CaH2", "FeCl3"}
KNOWN = {c["key"] for c in BASIC_OXIDES + ANHYDRIDES} | set(PEROXIDES) | NOT_OXIDES

# level 6, the oxides outside the two rules: question -> the right answer (a name, or the key of a formula)
KEY6 = {
    "Qual è il nome tradizionale di $\\mathrm{CrO_3}$?": {"anidride cromica"},
    "Qual è il nome di $\\mathrm{CrO_3}$ nella notazione di Stock?": {"ossido di cromo(VI)"},
    "Qual è il nome tradizionale di $\\mathrm{Mn_2O_7}$?": {"anidride permanganica"},
    "Qual è il nome di $\\mathrm{Mn_2O_7}$ nella notazione di Stock?": {"ossido di manganese(VII)"},
    "Qual è il nome di $\\mathrm{MnO_2}$ nella notazione di Stock?": {"ossido di manganese(IV)"},
    "Qual è il nome IUPAC di $\\mathrm{CO}$?": {"monossido di carbonio"},
    "Qual è la formula del composto che ha questo nome: anidride cromica?": {"CrO3"},
    "Qual è la formula del composto che ha questo nome: anidride permanganica?": {"Mn2O7"},
    "Qual è la formula del composto che ha questo nome: monossido di azoto?": {"NO"},
    "Quale di questi ossidi è anfotero?": {"Al2O3", "ZnO"},
    "Quale di questi ossidi di un metallo è un ossido acido?": {"CrO3", "Mn2O7"},
    "Quale di questi ossidi di un non metallo non è un'anidride?": {"CO", "NO"},
}
# other right names of the same compounds, which must not be among the wrong options
ALSO_RIGHT = {
    "CrO_3": {"anidride cromica", "ossido di cromo(VI)", "triossido di cromo"},
    "Mn_2O_7": {"anidride permanganica", "ossido di manganese(VII)", "eptaossido di dimanganese"},
    "MnO_2": {"biossido di manganese", "ossido di manganese(IV)", "diossido di manganese"},
    "CO": {"monossido di carbonio", "ossido di carbonio(II)", "ossido di carbonio"},
}


def kind_of(atoms, charge):
    """basico, acido, perossido or nessuno, from the formula alone."""
    symbols = [s for s, _ in atoms]
    if charge != 0 or len(atoms) != 2 or "O" not in symbols or "F" in symbols:
        return "nessuno"
    other = next(s for s in symbols if s != "O")
    values, _ = solve(atoms, 0)
    if values["O"] == -1:
        return "perossido"
    if values["O"] != -2:
        return "nessuno"
    return "basico" if other in METAL_SET else "acido"


def level1(sample, prose, errs):
    m = re.fullmatch(r"Che tipo di composto è \$(\\mathrm\{[^$]*\})\$\?", prose)
    if not m:
        errs.append(f"text not recognised: {prose!r}")
        return None
    atoms, charge, key = parse_formula(m.group(1))
    kind = kind_of(atoms, charge)
    if key not in KNOWN:
        errs.append(f"{key} is not a compound of the lesson")
    if kind == "basico" and atoms[0][0] in AMPHOTERIC:
        errs.append("an amphoteric oxide at level 1")
    ch = choice_of(sample, errs)
    if ch:
        if {option_text(o["latex"]) for o in ch["options"]} != set(KIND_LABELS):
            errs.append("the four options are not the four kinds")
        check_choice(ch, lambda o: KIND_LABELS.get(option_text(o["latex"])) == kind, errs)
    return kind


def level6(sample, prose, errs):
    ch = choice_of(sample, errs)
    if not ch:
        return None
    if prose == "Quale di questi composti è un perossido?":
        kinds = [kind_of(*parse_formula(o["latex"])[:2]) for o in ch["options"]]
        if any(k not in ("perossido", "basico", "acido") for k in kinds):
            errs.append("an option is neither an oxide nor a peroxide")
        two_o = sum(1 for o in ch["options"] if dict(parse_formula(o["latex"])[0]).get("O") == 2 and kind_of(*parse_formula(o["latex"])[:2]) != "perossido")
        if two_o < 2:
            errs.append("fewer than two oxides with two atoms of oxygen among the wrong options")
        for o in ch["options"]:
            if o["values"] != [parse_formula(o["latex"])[2]]:
                errs.append(f"option {o['latex']!r} has value {o['values']}")
        check_choice(ch, lambda o: kind_of(*parse_formula(o["latex"])[:2]) == "perossido", errs)
        return "quale perossido"
    m = re.fullmatch(r"Che nome ha \$(\\mathrm\{[^$]*\})\$\?", prose)
    if m:
        atoms, charge, key = parse_formula(m.group(1))
        if kind_of(atoms, charge) != "perossido" or key not in PEROXIDES:
            errs.append(f"{key} is not a peroxide of the lesson")
            return None
        check_name_options(ch, "perossido di " + PEROXIDES[key], {"perossido di " + PEROXIDES[key], "acqua ossigenata"}, errs)
        return "perossido nome"
    m = ASK_FORMULA.fullmatch(prose)
    if m and m.group(1).startswith("perossido di "):
        keys = [k for k, name in PEROXIDES.items() if name == m.group(1)[len("perossido di "):]]
        if len(keys) != 1:
            errs.append(f"no peroxide called {m.group(1)!r}")
            return None
        check_formula_options(ch, keys[0], errs)
        return "perossido formula"
    if prose not in KEY6:
        errs.append(f"level 6 question not in the key: {prose!r}")
        return None
    right = KEY6[prose]
    f = re.search(r"\$\\mathrm\{([^$]*)\}\$", prose)
    also = ALSO_RIGHT.get(f.group(1), set()) if f else set()

    def is_right(o):
        try:
            return parse_formula(o["latex"])[2] in right
        except ValueError:
            return option_text(o["latex"]) in right

    for o in ch["options"]:
        try:
            text = option_text(o["latex"])
        except ValueError:
            continue
        if text in also and text not in right:
            errs.append(f"option {text!r} is another right name")
    check_choice(ch, is_right, errs)
    return "particolari"


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
        if lvl == 1:
            kind = level1(sample, prose, errs)
        elif lvl in (2, 4):
            kind = check_name_question(sample, prose, BASIC_OXIDES if lvl == 2 else ANHYDRIDES, errs)
        elif lvl in (3, 5):
            kind = check_formula_question(sample, prose, BASIC_OXIDES if lvl == 3 else ANHYDRIDES, errs)
        else:
            kind = level6(sample, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    if kind and sample.get("params", {}).get("case") != kind:
        errs.append(f"params.case {sample.get('params', {}).get('case')!r} but the exercise is {kind!r}")
    return errs, kind if lvl in (1, 6) else kind


assert all(n in NAMES.values() for n in PEROXIDES.values())
