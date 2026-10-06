"""Checker for chim-sali-binari (specs/exercises/chim-sali-binari.md), written from the spec and from the lesson
81-chim-sali-binari.md, not from the generator.

It reads the ions, the formula or the name in the text. A formula is worked out from the charges with the least
common multiple; a name is worked out from the formula, finding the charge of the metal from the charge of the anion
(checkers/_chim3_j.py); a formula is found from a name by naming every salt of the lesson and looking the name up.
"""
import re
from math import gcd

from checkers import _chim3_j as J
from checkers._fis_grandezze import check_choice, common, option_text, prose_and_extra

CASE_RANGES = {
    1: {"catione-nome": (0.23, 0.37), "catione-formula": (0.23, 0.37), "anione-nome": (0.13, 0.27), "anione-formula": (0.13, 0.27)},
    3: {"iupac": (0.40, 0.60), "tradizionale": (0.40, 0.60)},
    4: {"stock": (0.40, 0.60), "tradizionale": (0.40, 0.60)},
    5: {"trad": (0.26, 0.41), "stock": (0.26, 0.41), "iupac": (0.26, 0.41)},
}

# salts the spec leaves out: (metal, charge, anion)
UNSTABLE = {("Fe", 3, "I"), ("Cu", 2, "I"), ("Pb", 4, "I"), ("Pb", 4, "Br"), ("Pb", 4, "S"), ("Cu", 1, "F")}
METALS = {k: v for k, v in J.METALS.items() if k != "NH_4"}


def sub(s, n):
    return s if n == 1 else f"{s}_{n}"


def charge_tex(q, sign):
    return "^" + (sign if q == 1 else "{" + str(q) + sign + "}")


def neutral(sym, q, an, c):
    """The formula of the salt of a cation q+ and an anion c-: the smallest numbers of ions with total charge zero."""
    lcm = q * c // gcd(q, c)
    return sub(sym, lcm // q) + sub(an, lcm // c)


def all_salts():
    """(nomenclature, name) -> formula, for the three names of every stable salt of the lesson's ions."""
    out = {}
    for sym, (_, charges, _) in METALS.items():
        for q in charges:
            for an, (_, c, _, _) in J.SIMPLE.items():
                if (sym, q, an) in UNSTABLE:
                    continue
                f = neutral(sym, q, an, c)
                for style, name in J.salt_names(f).items():
                    if out.setdefault((style, name), f) != f:
                        raise RuntimeError(f"the name {name!r} has two formulas")
    return out


BY_NAME = all_salts()
ION = r"\$\\mathrm\{([A-Z][a-z]?)\^\{?(\d?)([+-])\}?\}\$"


def formula_of(o):
    return J.strip_mathrm(o["latex"])


def cation_name(sym, q, style):
    nome, charges, adj = METALS[sym]
    return "ione " + (adj[charges.index(q)] if style == "trad" else f"{nome}({J.ROMAN[q]})")


def level1(sample, prose, errs):
    m = re.fullmatch(r"Come si chiama lo ione " + ION + r" (nella nomenclatura tradizionale|nella notazione di Stock)\?", prose)
    if m:
        sym, q = m.group(1), int(m.group(2) or 1)
        if m.group(3) != "+" or len(METALS[sym][1]) != 2 or q not in METALS[sym][1]:
            errs.append("not an ion of a metal with two charges")
        want = cation_name(sym, q, "trad" if "tradizionale" in m.group(4) else "stock")
        check_choice(sample["answer"], lambda o: option_text(o["latex"]) == want, errs)
        return "catione-nome"
    m = re.fullmatch(r"Come si chiama lo ione " + ION + r"\?", prose)
    if m:
        sym, q = m.group(1), int(m.group(2) or 1)
        if m.group(3) != "-" or J.SIMPLE[sym][1] != q:
            errs.append("not an anion of the lesson with its charge")
        want = "ione " + J.SIMPLE[sym][0]
        check_choice(sample["answer"], lambda o: option_text(o["latex"]) == want, errs)
        return "anione-nome"
    m = re.fullmatch(r"Qual è la formula dello (ione \S+)\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    name = m.group(1)
    for an, (nome, c, _, _) in J.SIMPLE.items():
        if name == "ione " + nome:
            want = an + charge_tex(c, "-")
            check_choice(sample["answer"], lambda o: formula_of(o) == want, errs)
            return "anione-formula"
    found = [(sym, q) for sym, (_, charges, _) in METALS.items() if len(charges) == 2 for q in charges for style in ("trad", "stock") if cation_name(sym, q, style) == name]
    if len(found) != 1:
        errs.append(f"ion {name!r} not recognised")
        return None
    want = found[0][0] + charge_tex(found[0][1], "+")
    check_choice(sample["answer"], lambda o: formula_of(o) == want, errs)
    return "catione-formula"


def same_salt(a, b):
    try:
        return J.read_salt(a) == J.read_salt(b)
    except ValueError:
        return False


def level2(sample, prose, errs):
    m = re.fullmatch(r"Qual è la formula del sale formato dagli ioni " + ION + " e " + ION + r"\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    sym, q, an, c = m.group(1), int(m.group(2) or 1), m.group(4), int(m.group(5) or 1)
    if m.group(3) != "+" or m.group(6) != "-" or q not in METALS[sym][1] or J.SIMPLE[an][1] != c:
        errs.append("the ions are not ions of the lesson")
    if (sym, q, an) in UNSTABLE:
        errs.append("unstable salt")
    want = neutral(sym, q, an, c)
    check_choice(sample["answer"], lambda o: formula_of(o) == want, errs)
    return "ioni"


def named(sample, formula, kind, want_charges, errs):
    cat, _, an, _, water = J.read_salt(formula)
    if an not in J.SIMPLE or water or cat not in METALS:
        errs.append(f"{formula} is not a binary salt of the lesson")
    if len(METALS[cat][1]) != want_charges:
        errs.append(f"the metal of {formula} has not {want_charges} oxidation number(s)")
    names = J.salt_names(formula)  # raises if the formula is not in lowest terms or the charge is not of the metal
    if (cat, J.metal_charge(formula), an) in UNSTABLE:
        errs.append("unstable salt")
    want = names[kind]
    other = set(names.values()) - {want}
    for o in sample["answer"]["options"]:
        if option_text(o["latex"]) in other:
            errs.append(f"the option {option_text(o['latex'])!r} is a right name in another nomenclature")
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == want, errs)


def level3(sample, prose, errs):
    m = re.fullmatch(r"Che nome (IUPAC|tradizionale) ha \$\\mathrm\{(.+)\}\$\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    kind = "iupac" if m.group(1) == "IUPAC" else "trad"
    named(sample, m.group(2), kind, 1, errs)
    return "iupac" if kind == "iupac" else "tradizionale"


def level4(sample, prose, errs):
    m = re.fullmatch(r"Che nome ha \$\\mathrm\{(.+)\}\$ (nella notazione di Stock|nella nomenclatura tradizionale)\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    kind = "stock" if "Stock" in m.group(2) else "trad"
    named(sample, m.group(1), kind, 2, errs)
    return "stock" if kind == "stock" else "tradizionale"


def level5(sample, prose, errs):
    m = re.fullmatch(r"Il nome (tradizionale|di Stock|IUPAC) di un sale è (.+)\. Qual è la sua formula\?", prose)
    style = {"tradizionale": "trad", "di Stock": "stock", "IUPAC": "iupac"}.get(m.group(1)) if m else None
    if not m or (style, m.group(2)) not in BY_NAME:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    want = BY_NAME[(style, m.group(2))]
    check_choice(sample["answer"], lambda o: formula_of(o) == want, errs)
    return style


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    if sample.get("solution") != sample["answer"]["options"][sample["answer"]["correct"]]["latex"]:
        errs.append("solution is not the right option")
    try:
        kind = LEVELS[lvl](sample, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError, StopIteration) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
