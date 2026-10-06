"""Checker for chim-sali-ternari (specs/exercises/chim-sali-ternari.md), written from the spec and from the lesson
82-chim-sali-ternari.md, not from the generator.

The anion of an acid is the acid without its hydrogens, with one negative charge for each (checkers/_chim3_j.py reads
the group and names it from the oxidation number of the central atom). A formula is worked out from the charges with
the least common multiple; the names are worked out from the formula, with the charge of the metal found from the
charge of the anion; a formula is found from a name by naming every salt the spec admits and looking the name up.
"""
import re
from math import gcd

from checkers import _chim3_j as J
from checkers._fis_grandezze import check_choice, common, option_text, prose_and_extra

CASE_RANGES = {
    1: {"nome": (0.27, 0.41), "formula": (0.26, 0.40), "acido": (0.26, 0.40)},
    3: {"stock": (0.23, 0.37), "tradizionale-due": (0.23, 0.37), "tradizionale-uno": (0.33, 0.47)},
    4: {"nome-iupac": (0.40, 0.60), "formula-iupac": (0.40, 0.60)},
    5: {"formula": (0.40, 0.60), "nome": (0.40, 0.60)},
    6: {"formula": (0.40, 0.60), "nome": (0.40, 0.60)},
}

# the fourteen acids of the exercises: name -> formula
ACIDS = {
    "acido carbonico": "H_2CO_3", "acido nitroso": "HNO_2", "acido nitrico": "HNO_3", "acido solforoso": "H_2SO_3", "acido solforico": "H_2SO_4",
    "acido fosforico": "H_3PO_4", "acido ipocloroso": "HClO", "acido cloroso": "HClO_2", "acido clorico": "HClO_3", "acido perclorico": "HClO_4",
    "acido bromico": "HBrO_3", "acido iodico": "HIO_3", "acido cromico": "H_2CrO_4", "acido permanganico": "HMnO_4",
}
for _name, _f in ACIDS.items():  # the table agrees with the rules of the lesson 80
    assert _name in ("acido " + J.acid_trad(_f), "acido " + re.sub("^orto", "", J.acid_trad(_f))), _name


def anion_of(acid_formula, kept=0):
    """The acid without `kept` fewer than all its hydrogens: (group, charge)."""
    h, x, n_x, o = J.read_acid(acid_formula)
    head = "" if kept == 0 else "H" if kept == 1 else f"H_{kept}"
    return head + x + (f"_{n_x}" if n_x > 1 else "") + "O" + (f"_{o}" if o > 1 else ""), h - kept


ANIONS = {name: anion_of(f) for name, f in ACIDS.items()}  # acid name -> (group, charge)

# "Sali ammessi" of the spec: the acids a cation is used with; every acid for the cations not listed
EVERY = set(ACIDS)
ADMITTED = {
    ("Cu", 1): {"solforico"}, ("Pb", 4): {"solforico"}, ("Sn", 4): {"solforico", "nitrico"}, ("Sn", 2): {"solforico", "nitrico", "fosforico"},
    ("Fe", 2): {"solforico", "nitrico", "carbonico", "fosforico", "solforoso", "perclorico"}, ("Fe", 3): {"solforico", "nitrico", "fosforico", "perclorico"},
    ("Al", 3): {"solforico", "nitrico", "fosforico", "clorico", "perclorico"},
    ("NH_4", 1): {"carbonico", "nitroso", "nitrico", "solforoso", "solforico", "fosforico", "clorico", "perclorico", "cromico"},
    ("Cu", 2): {"carbonico", "nitroso", "nitrico", "solforico", "fosforico", "clorico", "perclorico", "cromico"},
    ("Pb", 2): {"carbonico", "nitrico", "solforoso", "solforico", "fosforico", "clorico", "perclorico", "bromico", "iodico", "cromico"},
    ("Ag", 1): {"carbonico", "nitroso", "nitrico", "solforoso", "solforico", "fosforico", "clorico", "perclorico", "bromico", "iodico", "cromico", "permanganico"},
}
ACID_SALTS = {
    "HCO_3": {"Na", "K", "Ca", "Mg", "Ba", "NH_4"}, "HSO_3": {"Na", "K", "Ca", "NH_4"}, "HSO_4": {"Na", "K", "NH_4"},
    "HPO_4": {"Na", "K", "Ca", "Mg", "NH_4"}, "H_2PO_4": {"Na", "K", "Ca", "NH_4"}, "HS": {"Na", "K", "NH_4"},
}
ACID_ANION_CHARGE = {"HCO_3": 1, "HSO_3": 1, "HSO_4": 1, "HPO_4": 2, "H_2PO_4": 1, "HS": 1}
HYDRATES = {"CuSO_4": 5, "CaSO_4": 2, "Na_2CO_3": 10, "MgSO_4": 7, "FeSO_4": 7, "ZnSO_4": 7, "Na_2SO_4": 10, "Cu(NO_3)_2": 3, "Ca(NO_3)_2": 4, "Mg(NO_3)_2": 6,
            "Zn(NO_3)_2": 6, "Na_2SO_3": 7, "Na_2CrO_4": 4}


def group(tex, n, poly):
    return tex if n == 1 else f"({tex})_{n}" if poly else f"{tex}_{n}"


def neutral(cat, q, an, c):
    lcm = q * c // gcd(q, c)
    return group(cat, lcm // q, cat == "NH_4") + group(an, lcm // c, len(J.atoms(an)) > 1)


def admitted(cat, q, acid_name):
    return acid_name.replace("acido ", "") in ADMITTED.get((cat, q), {a.replace("acido ", "") for a in EVERY})


def all_salts():
    """(nomenclature, name) -> formula for every admitted neutral salt."""
    out = {}
    for cat, (_, charges, _) in J.METALS.items():
        for q in charges:
            for acid, (an, c) in ANIONS.items():
                if not admitted(cat, q, acid):
                    continue
                f = neutral(cat, q, an, c)
                for style, name in J.salt_names(f).items():
                    if out.setdefault((style, name), f) != f:
                        raise RuntimeError(f"the name {name!r} has two formulas")
    return out


BY_NAME = all_salts()
ADMITTED_FORMULAS = set(BY_NAME.values())
ION = r"\$\\mathrm\{([A-Za-z_0-9]+?)\^\{?(\d?)([+-])\}?\}\$"
STYLES = {"tradizionale": "trad", "di Stock": "stock", "IUPAC": "iupac"}


def formula_of(o):
    return J.strip_mathrm(o["latex"])


def level1(sample, prose, errs):
    m = re.fullmatch(r"Come si chiama l'anione che deriva dall'(acido \w+)\?", prose)
    if m:
        an, _ = ANIONS[m.group(1)]
        want = "ione " + J.read_anion(an)[0]
        check_choice(sample["answer"], lambda o: option_text(o["latex"]) == want, errs)
        return "nome"
    by_anion = {J.read_anion(an)[0]: (acid, an, c) for acid, (an, c) in ANIONS.items()}
    m = re.fullmatch(r"Qual è la formula dello ione (\w+)\?", prose)
    if m:
        _, an, c = by_anion[m.group(1)]
        want = an + ("^-" if c == 1 else "^{" + str(c) + "-}")
        check_choice(sample["answer"], lambda o: formula_of(o) == want, errs)
        return "formula"
    m = re.fullmatch(r"Da quale acido deriva lo ione (\w+)\?", prose)
    if m:
        want = by_anion[m.group(1)][0]
        check_choice(sample["answer"], lambda o: option_text(o["latex"]) == want, errs)
        return "acido"
    errs.append(f"level 1 text not recognised: {prose!r}")
    return None


def level2(sample, prose, errs):
    m = re.fullmatch(r"Qual è la formula del sale formato dagli ioni " + ION + " e " + ION + r"\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    cat, q, an, c = m.group(1), int(m.group(2) or 1), m.group(4), int(m.group(5) or 1)
    acids = [a for a, v in ANIONS.items() if v == (an, c)]
    if m.group(3) != "+" or m.group(6) != "-" or q not in J.METALS[cat][1] or len(acids) != 1:
        errs.append("the ions are not ions of the lesson with their charge")
        return None
    if not admitted(cat, q, acids[0]):
        errs.append("salt not admitted")
    want = neutral(cat, q, an, c)
    check_choice(sample["answer"], lambda o: formula_of(o) == want, errs)
    return "ioni"


def named(sample, formula, style, errs):
    names = J.salt_names(formula)
    want = names[style]
    other = set(names.values()) - {want}
    for o in sample["answer"]["options"]:
        if option_text(o["latex"]) in other:
            errs.append(f"the option {option_text(o['latex'])!r} is a right name in another nomenclature")
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == want, errs)


def level3(sample, prose, errs):
    m = re.fullmatch(r"Che nome ha \$\\mathrm\{(.+)\}\$ (nella notazione di Stock|nella nomenclatura tradizionale)\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    f = m.group(1)
    if f not in ADMITTED_FORMULAS:
        errs.append(f"{f} is not an admitted salt")
    stock = "Stock" in m.group(2)
    two = len(J.METALS[J.read_salt(f)[0]][1]) == 2
    if stock and not two:
        errs.append("Stock asked for a metal with one oxidation number")
    named(sample, f, "stock" if stock else "trad", errs)
    return "stock" if stock else "tradizionale-due" if two else "tradizionale-uno"


def level4(sample, prose, errs):
    m = re.fullmatch(r"Che nome IUPAC ha \$\\mathrm\{(.+)\}\$\?", prose)
    if m:
        if m.group(1) not in ADMITTED_FORMULAS:
            errs.append(f"{m.group(1)} is not an admitted salt")
        named(sample, m.group(1), "iupac", errs)
        return "nome-iupac"
    m = re.fullmatch(r"Il nome IUPAC di un sale è (.+)\. Qual è la sua formula\?", prose)
    if not m or ("iupac", m.group(1)) not in BY_NAME:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    want = BY_NAME[("iupac", m.group(1))]
    check_choice(sample["answer"], lambda o: formula_of(o) == want, errs)
    return "formula-iupac"


def acid_salt_ok(formula, errs):
    cat, _, an, _, water = J.read_salt(formula)
    if water or an not in ACID_SALTS or cat not in ACID_SALTS[an]:
        errs.append(f"{formula} is not an acid salt of the spec")
    if J.read_anion(an)[2] != ACID_ANION_CHARGE.get(an):
        errs.append("charge of the anion")


def level5(sample, prose, errs):
    m = re.fullmatch(r"Che nome tradizionale ha \$\\mathrm\{(.+)\}\$\?", prose)
    if m:
        acid_salt_ok(m.group(1), errs)
        named(sample, m.group(1), "trad", errs)
        return "nome"
    m = re.fullmatch(r"Il nome tradizionale di un sale è ((?:di)?idrogeno\w+) di (\w+)\. Qual è la sua formula\?", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    found = [an for an in ACID_SALTS if J.read_anion(an)[0] == m.group(1)]
    cats = [c for c, v in J.METALS.items() if v[0] == m.group(2)]
    if len(found) != 1 or len(cats) != 1:
        errs.append("anion or metal not recognised")
        return None
    want = neutral(cats[0], J.METALS[cats[0]][1][0], found[0], ACID_ANION_CHARGE[found[0]])
    acid_salt_ok(want, errs)
    check_choice(sample["answer"], lambda o: formula_of(o) == want, errs)
    return "formula"


def level6(sample, prose, errs):
    m = re.fullmatch(r"Che nome (tradizionale|di Stock|IUPAC) ha \$\\mathrm\{(.+)\}\$\?", prose)
    if m:
        f = m.group(2)
        dry, water = re.fullmatch(r"(.*) \\cdot (\d+)H_2O", f).groups()
        if HYDRATES.get(dry) != int(water):
            errs.append(f"{f} is not a hydrate of the spec")
        named(sample, f, STYLES[m.group(1)], errs)
        return "nome"
    m = re.fullmatch(r"Il nome (tradizionale|di Stock|IUPAC) di un sale idrato è (.+) (\w+idrato)\. Qual è la sua formula\?", prose)
    if not m or (STYLES[m.group(1)], m.group(2)) not in BY_NAME:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    dry = BY_NAME[(STYLES[m.group(1)], m.group(2))]
    if dry not in HYDRATES or J.hydrate_word(HYDRATES[dry]) != m.group(3):
        errs.append("not a hydrate of the spec")
        return None
    want = f"{dry} \\cdot {HYDRATES[dry]}H_2O"
    check_choice(sample["answer"], lambda o: formula_of(o) == want, errs)
    return "formula"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


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
