"""Checker for chim-formula-chimica (specs/exercises/chim-formula-chimica.md).

Written from the spec and lesson 28, not from the generator. The formula is read back from the LaTeX of the problem
and counted with the parser of _chim_trasformazioni (brackets, hydrates); the question says which element, and whether
the particle is a molecule or a formula unit, which must agree with the formula (a metal or the ammonium ion makes it
ionic). At level 6 the two ions are read with their charges, the smallest neutral ratio is found, and the right
option is the only one with those atoms.
"""
import re
from math import gcd

from checkers._chim_trasformazioni import ELEMENT_NAME, check_choice, common, count, formulas_in, int_option, plain_formula, prose_and_extra

CASE_RANGES = {
    1: {"molecolare": (0.45, 0.80), "ionico": (0.20, 0.55)},
    4: {"tutti": (0.15, 0.35), "elemento": (0.65, 0.85)},
    5: {"O": (0.23, 0.43), "H": (0.23, 0.43), "tutti": (0.23, 0.43)},
}

# The compounds the exercises name, with their formulas (from the lessons and a textbook's table of names).
KNOWN = {
    "acqua": "H2O", "anidride carbonica": "CO2", "ammoniaca": "NH3", "metano": "CH4", "acido solforico": "H2SO4",
    "acido nitrico": "HNO3", "acido fosforico": "H3PO4", "glucosio": "C6H12O6", "etanolo": "C2H6O", "propano": "C3H8",
    "acido acetico": "C2H4O2", "saccarosio": "C12H22O11", "caffeina": "C8H10N4O2", "acido acetilsalicilico": "C9H8O4",
    "acqua ossigenata": "H2O2", "anidride solforica": "SO3", "pentossido di diazoto": "N2O5", "carbonato di calcio": "CaCO3",
    "solfato di sodio": "Na2SO4", "nitrato di potassio": "KNO3", "fosfato di sodio": "Na3PO4",
    "idrogenocarbonato di sodio": "NaHCO3", "ossido di ferro(III)": "Fe2O3", "ossido di alluminio": "Al2O3",
    "cloruro di calcio": "CaCl2", "carbonato di potassio": "K2CO3", "cloruro di magnesio": "MgCl2",
    "idrossido di calcio": "Ca(OH)2", "idrossido di magnesio": "Mg(OH)2", "idrossido di alluminio": "Al(OH)3",
    "idrossido di ferro(III)": "Fe(OH)3", "nitrato di calcio": "Ca(NO3)2", "nitrato di magnesio": "Mg(NO3)2",
    "nitrato di alluminio": "Al(NO3)3", "nitrato di ferro(III)": "Fe(NO3)3", "solfato di alluminio": "Al2(SO4)3",
    "solfato di ferro(III)": "Fe2(SO4)3", "solfato di ammonio": "(NH4)2SO4", "fosfato di ammonio": "(NH4)3PO4",
    "carbonato di ammonio": "(NH4)2CO3", "fosfato di calcio": "Ca3(PO4)2", "fosfato di magnesio": "Mg3(PO4)2",
    "idrogenocarbonato di calcio": "Ca(HCO3)2", "carbonato di alluminio": "Al2(CO3)3",
    "solfato di rame pentaidrato": "CuSO4.5H2O", "solfato di magnesio eptaidrato": "MgSO4.7H2O", "gesso": "CaSO4.2H2O",
    "carbonato di sodio decaidrato": "Na2CO3.10H2O", "cloruro di cobalto esaidrato": "CoCl2.6H2O",
    "solfato di ferro(II) eptaidrato": "FeSO4.7H2O", "solfato di sodio decaidrato": "Na2SO4.10H2O",
    "cloruro di bario diidrato": "BaCl2.2H2O", "cloruro di calcio esaidrato": "CaCl2.6H2O",
    "solfato di zinco eptaidrato": "ZnSO4.7H2O",
}


def known(name, f, errs):
    if KNOWN.get(name) != f:
        errs.append(f"{name!r} is not {f}")


METALS = {"Na", "K", "Mg", "Ca", "Fe", "Al", "Cu", "Zn", "Ba", "Co"}


def ionic(f):
    return bool(set(count(f)) & METALS) or "NH4" in f


def particle_ok(f, particle, errs):
    want = "un'unità formula" if ionic(f) else "una molecola"
    if particle != want:
        errs.append(f"{f} is described as {particle!r}, expected {want!r}")


def check(sample):
    errs = []
    common(sample, errs)
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected lines in the problem")
    lvl = sample["level"]
    ch = sample["answer"]
    kind = None
    fs = formulas_in(prose)

    if lvl in (1, 2, 4, 5):
        m = re.fullmatch(r"Quanti (?:atomi di (\w+)|atomi) ci sono (?:in tutto )?in (una molecola|un'unità formula) di ([\w' ()]+), \$\\mathrm\{.*\}\$\?", prose)
        if not m or len(fs) != 1:
            return errs + [f"text not recognised: {prose!r}"], None
        f = fs[0][1]
        c = count(f)
        known(m.group(3), f, errs)
        particle_ok(f, m.group(2), errs)
        total_q = "in tutto" in prose
        if total_q == bool(m.group(1)):
            errs.append("either an element or all the atoms")
        if m.group(1):
            el = ELEMENT_NAME.get(m.group(1))
            if el not in c:
                return errs + [f"{m.group(1)} not in {f}"], None
            right = c[el]
        else:
            right = sum(c.values())
        has_bracket, has_dot = "(" in f, "." in f
        if lvl in (1, 2) and (has_bracket or has_dot):
            errs.append(f"level {lvl} formula with brackets or water: {f}")
        if lvl == 1:
            if total_q:
                errs.append("level 1 asks for one element")
            kind = "ionico" if ionic(f) else "molecolare"
        if lvl == 2:
            if not total_q:
                errs.append("level 2 asks for all the atoms")
            if not re.search(r"[A-Z][a-z]?(?![a-z0-9])", f):
                errs.append(f"no unwritten index 1 in {f}")
            kind = "tutti"
        if lvl == 4:
            if not has_bracket or has_dot:
                errs.append(f"level 4 needs brackets: {f}")
            if not total_q:
                # the element must be only inside the bracket
                outside = count(re.sub(r"\([^)]*\)\d*", "", f))
                if outside.get(el):
                    errs.append(f"{el} also outside the bracket in {f}")
            kind = "tutti" if total_q else "elemento"
        if lvl == 5:
            if not has_dot:
                errs.append(f"level 5 needs a hydrate: {f}")
            kind = "tutti" if total_q else el
            if not total_q and el not in ("O", "H"):
                errs.append(f"level 5 asks for {el}")
        check_choice(ch, lambda o: int_option(o) == right, errs)
        for o in ch.get("options", []):
            if int_option(o) <= 0:
                errs.append("an option is not positive")
        return errs, kind

    if lvl == 3:
        m = re.fullmatch(r"Quanti atomi di (\w+) ci sono in \$(\d)\\,\\mathrm\{.*\}\$, cioè in \$(\d)\$ (molecole|unità formula) di ([\w' ()]+)\?", prose)
        if not m or len(fs) != 1:
            return errs + [f"text not recognised: {prose!r}"], None
        k, f, _ = fs[0]
        known(m.group(5), f, errs)
        if not 2 <= k <= 5 or int(m.group(3)) != k or int(m.group(2)) != k:
            errs.append(f"coefficient {k}")
        if ("unità formula" == m.group(4)) != ionic(f):
            errs.append(f"{f}: {m.group(4)}")
        if "(" in f or "." in f:
            errs.append(f"level 3 formula with brackets or water: {f}")
        el = ELEMENT_NAME.get(m.group(1))
        c = count(f)
        if el not in c:
            return errs + [f"{m.group(1)} not in {f}"], None
        right = k * c[el]
        check_choice(ch, lambda o: int_option(o) == right, errs)
        return errs, "ionico" if ionic(f) else "molecolare"

    if lvl == 6:
        m = re.fullmatch(r"Qual è la formula del composto formato dagli ioni \$\\mathrm\{.*\}\$ e \$\\mathrm\{.*\}\$ \(([\w ()]+)\)\?", prose)
        if not m or len(fs) != 2:
            return errs + [f"text not recognised: {prose!r}"], None
        (_, cf, cq), (_, af, aq) = fs
        if not (cq and cq > 0 and aq and aq < 0):
            return errs + [f"charges {cq}, {aq}"], None
        g = gcd(cq, -aq)
        x, y = -aq // g, cq // g
        want = count(cf)
        for e in want:
            want[e] *= x
        for e, n in count(af).items():
            want[e] += n * y
        # the formula: cation first; an ion of several atoms with an index between brackets
        def right(o):
            f, q = plain_formula(o["latex"])
            if q is not None:
                raise ValueError("charge in a compound")
            if o["values"] != [f]:
                raise ValueError(f"value {o['values']} != {f}")
            if count(f) != want:
                return False
            poly = [p for p, n in ((cf, x), (af, y)) if len(count(p)) > 1 or sum(count(p).values()) > 1]
            return all((n == 1) or f"({p})" in f for p, n in ((cf, x), (af, y)) if p in poly) and f.startswith(cf if x == 1 or cf not in poly else f"({cf})")

        check_choice(ch, right, errs)
        return errs, "poliatomico" if any(sum(count(p).values()) > 1 for p in (cf, af)) else "monoatomico"

    return errs + [f"unknown level {lvl}"], None
