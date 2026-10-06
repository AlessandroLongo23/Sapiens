"""Checker for chim-ossiacidi (specs/exercises/chim-ossiacidi.md), written from the spec and from the lesson
80-chim-ossiacidi.md, not from the generator.

It reads the formula or the name in the text and works the answer out on its own: the oxidation number from hydrogen
+1 and oxygen -2; the traditional name from the oxidation number and the lesson's table of suffixes; the formula of a
name by adding water to the oxide and reducing the indices; the IUPAC name from the count of the oxygens; the water
of meta-, piro- and orto- from the hydrogens.
"""
import re
from math import gcd

from checkers import _chim3_j as J
from checkers._fis_grandezze import check_choice, common, option_text, prose_and_extra

CASE_RANGES = {
    4: {"nome-iupac": (0.40, 0.60), "formula-iupac": (0.40, 0.60)},
    5: {"famiglia-formula": (0.22, 0.38), "famiglia-nome": (0.22, 0.38), "famiglia-acqua": (0.13, 0.27), "famiglia-no": (0.13, 0.27)},
}

ARTICLE = {"carbonio": "del", "azoto": "dell'", "zolfo": "dello", "fosforo": "del", "cloro": "del", "bromo": "del", "iodio": "dello",
           "boro": "del", "silicio": "del", "cromo": "del", "manganese": "del"}

# the oxides of the lesson: element -> {oxidation number: (atoms of the element, atoms of oxygen)}
OXIDES = {
    "C": {4: (1, 2)}, "N": {3: (2, 3), 5: (2, 5)}, "S": {4: (1, 2), 6: (1, 3)}, "P": {3: (2, 3), 5: (2, 5)},
    "Cl": {1: (2, 1), 3: (2, 3), 5: (2, 5), 7: (2, 7)}, "Br": {1: (2, 1), 5: (2, 5)}, "I": {1: (2, 1), 5: (2, 5), 7: (2, 7)},
    "B": {3: (2, 3)}, "Si": {4: (1, 2)}, "Cr": {6: (1, 3)}, "Mn": {7: (2, 7)},
}
OXIDE_NAMES = {"anidride fosforica": ("P", 5), "anidride fosforosa": ("P", 3), "anidride borica": ("B", 3), "anidride silicica": ("Si", 4)}
FAMILY = {"P": (1, 2, 3), "B": (1, 2, 3), "Si": (1, 2)}


def sub(s, n):
    return s if n == 1 else f"{s}_{n}"


def from_oxide(x, no, water):
    """The acid from one oxide and `water` molecules of water, indices reduced."""
    n_x, n_o = OXIDES[x][no]
    h, o = 2 * water, n_o + water
    g = gcd(gcd(h, n_x), o)
    return sub("H", h // g) + sub(x, n_x // g) + sub("O", o // g)


def main_acids():
    """name -> formula for the acids with one molecule of water, and the orthophosphoric acid called fosforico."""
    out = {}
    for x, nos in OXIDES.items():
        if x in FAMILY:
            continue
        for no in nos:
            f = from_oxide(x, no, 1)
            out["acido " + J.acid_trad(f)] = f
    out["acido fosforico"] = from_oxide("P", 5, 3)
    return out


def family_acids():
    out = {}
    for x, waters in FAMILY.items():
        for no in OXIDES[x]:
            for w in waters:
                f = from_oxide(x, no, w)
                out["acido " + J.acid_trad(f)] = (f, w, x, no)
    return out


MAIN = main_acids()
FAM = family_acids()
MAIN_FORMULAS = set(MAIN.values())


def element_of(prose_article, name, x, errs):
    if J.ELEMENT_NAME[x] != name or not prose_article.startswith(ARTICLE[name]):
        errs.append(f"element {prose_article}{name} does not match {x}")


def formula_of(o):
    return J.strip_mathrm(o["latex"])


def level1(sample, prose, errs):
    m = re.fullmatch(r"Quanto vale il numero di ossidazione (del |dello |dell')(\w+) in \$\\mathrm\{(.+)\}\$\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    f = m.group(3)
    h, x, n_x, o = J.read_acid(f)
    if f not in MAIN_FORMULAS:
        errs.append(f"{f} is not an acid of the lesson's tables")
    element_of(m.group(1), m.group(2), x, errs)
    no = J.acid_no(h, n_x, o)
    check_choice(sample["answer"], lambda op: op["latex"] == f"{no:+d}", errs)
    return "no"


def level2(sample, prose, errs):
    m = re.fullmatch(r"Che nome tradizionale ha \$\\mathrm\{(.+)\}\$\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    f = m.group(1)
    if f not in MAIN_FORMULAS:
        errs.append(f"{f} is not an acid of the lesson's tables")
    full = "acido " + J.acid_trad(f)
    good = {full, re.sub(r"^acido orto", "acido ", full)}
    check_choice(sample["answer"], lambda op: option_text(op["latex"]) in good, errs)
    return "nome"


def level3(sample, prose, errs):
    m = re.fullmatch(r"Qual è la formula dell'(acido \w+)\?", prose)
    if not m or m.group(1) not in MAIN:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    if m.group(1) == "acido fosforico":
        errs.append("the phosphoric acid takes three molecules of water: it belongs to level 5")
    want = MAIN[m.group(1)]
    check_choice(sample["answer"], lambda op: formula_of(op) == want, errs)
    return "formula"


def level4(sample, prose, errs):
    m = re.fullmatch(r"Che nome IUPAC ha \$\\mathrm\{(.+)\}\$\?", prose)
    if m:
        f = m.group(1)
        if f not in MAIN_FORMULAS:
            errs.append(f"{f} is not an acid of the lesson's tables")
        want = J.acid_iupac(f)
        check_choice(sample["answer"], lambda op: option_text(op["latex"]) == want, errs)
        return "nome-iupac"
    m = re.fullmatch(r"Qual è la formula dell'(acido \S+)\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    want = J.acid_from_iupac(m.group(1))
    if want not in MAIN_FORMULAS:
        errs.append(f"{want} is not an acid of the lesson's tables")
    check_choice(sample["answer"], lambda op: formula_of(op) == want, errs)
    return "formula-iupac"


def level5(sample, prose, errs):
    m = re.fullmatch(r"Qual è la formula dell'(acido (?:meta|piro|orto)\w+)\?", prose)
    if m:
        want = FAM[m.group(1)][0]
        check_choice(sample["answer"], lambda op: formula_of(op) == want, errs)
        return "famiglia-formula"
    m = re.fullmatch(r"Che nome tradizionale ha \$\\mathrm\{(.+)\}\$, con il prefisso che dice quanta acqua contiene\?", prose)
    if m:
        want = "acido " + J.acid_trad(m.group(1))
        if want not in FAM or FAM[want][0] != m.group(1):
            errs.append(f"{m.group(1)} is not a meta, piro or orto acid of the lesson")
        check_choice(sample["answer"], lambda op: option_text(op["latex"]) == want, errs)
        return "famiglia-nome"
    m = re.fullmatch(r"Quante molecole d'acqua si aggiungono a una molecola di (anidride \w+), \$\\mathrm\{(.+)\}\$, per ottenere l'(acido \w+)\?", prose)
    if m:
        f, w, x, no = FAM[m.group(3)]
        n_x, n_o = OXIDES[x][no]
        if OXIDE_NAMES.get(m.group(1)) != (x, no) or m.group(2) != sub(x, n_x) + sub("O", n_o):
            errs.append("the oxide is not the one of the acid")
        check_choice(sample["answer"], lambda op: op["latex"] == str(w), errs)
        return "famiglia-acqua"
    m = re.fullmatch(r"Quanto vale il numero di ossidazione (del |dello |dell')(\w+) nell'(acido \w+), \$\\mathrm\{(.+)\}\$\?", prose)
    if m:
        f = m.group(4)
        if m.group(3) not in FAM or FAM[m.group(3)][0] != f:
            errs.append("name and formula do not match")
        h, x, n_x, o = J.read_acid(f)
        element_of(m.group(1), m.group(2), x, errs)
        no = J.acid_no(h, n_x, o)
        check_choice(sample["answer"], lambda op: op["latex"] == f"{no:+d}", errs)
        return "famiglia-no"
    errs.append(f"level 5 text not recognised: {prose!r}")
    return None


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
