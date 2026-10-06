"""Checker for chim-polarita-molecole (specs/exercises/chim-polarita-molecole.md), written from the spec and the lesson
69-chim-polarita-molecole.md, not from the generator.

The bond dipole is decided from the two electronegativities of a table of its own (Pauling, as in
src/lib/tools/elementi.json). The polarity of a molecule is not looked up: the checker places the bonds of each
molecule in space from its steric number (line, triangle, tetrahedron, the lone pairs taking the last places), puts on
every polar bond a vector as long as its difference of electronegativity, and adds the vectors. The sum of two equal
dipoles is recomputed with exact rounding. Solubility and the charged rod follow from the polarity found.
"""
import math
import re

from sympy import Rational, cos, floor, pi

from checkers._chim3_g import art, cap, common_g, mathrm
from checkers._fis_grandezze import check_choice, option_text, prose_and_extra

CASE_RANGES = {1: {"polare": (0.65, 0.85), "apolare": (0.15, 0.35)}}

# name -> (symbol, electronegativity in hundredths, valence electrons)
EL = {
    "idrogeno": ("H", 220, 1), "boro": ("B", 204, 3), "carbonio": ("C", 255, 4), "azoto": ("N", 304, 5), "ossigeno": ("O", 344, 6),
    "fluoro": ("F", 398, 7), "silicio": ("Si", 190, 4), "fosforo": ("P", 219, 5), "zolfo": ("S", 258, 6), "cloro": ("Cl", 316, 7),
    "bromo": ("Br", 296, 7), "iodio": ("I", 266, 7),
}
CHI = {v[0]: v[1] for v in EL.values()}
VAL = {v[0]: v[2] for v in EL.values()}

# formula -> (central atom, [(outer atom, bond order), ...]); None for what has no central atom
MOLS = {
    "CO_2": ("C", [("O", 2), ("O", 2)]), "CS_2": ("C", [("S", 2), ("S", 2)]), "BF_3": ("B", [("F", 1)] * 3), "BCl_3": ("B", [("Cl", 1)] * 3),
    "SO_3": ("S", [("O", 2)] * 3), "CH_4": ("C", [("H", 1)] * 4), "CCl_4": ("C", [("Cl", 1)] * 4), "CF_4": ("C", [("F", 1)] * 4),
    "SiCl_4": ("Si", [("Cl", 1)] * 4), "SiH_4": ("Si", [("H", 1)] * 4),
    "H_2O": ("O", [("H", 1)] * 2), "NH_3": ("N", [("H", 1)] * 3), "SO_2": ("S", [("O", 2)] * 2), "NF_3": ("N", [("F", 1)] * 3),
    "PCl_3": ("P", [("Cl", 1)] * 3), "PF_3": ("P", [("F", 1)] * 3), "OF_2": ("O", [("F", 1)] * 2), "SCl_2": ("S", [("Cl", 1)] * 2),
    "CHCl_3": ("C", [("H", 1)] + [("Cl", 1)] * 3), "CH_2Cl_2": ("C", [("H", 1)] * 2 + [("Cl", 1)] * 2), "CH_3Cl": ("C", [("H", 1)] * 3 + [("Cl", 1)]),
    "CH_3F": ("C", [("H", 1)] * 3 + [("F", 1)]), "CHF_3": ("C", [("H", 1)] + [("F", 1)] * 3), "CH_2F_2": ("C", [("H", 1)] * 2 + [("F", 1)] * 2),
    "HCN": ("C", [("H", 1), ("N", 3)]), "CH_2O": ("C", [("H", 1), ("H", 1), ("O", 2)]),
}
T = math.sqrt(8) / 3
PLACES = {
    2: [(1, 0, 0), (-1, 0, 0)],
    3: [(math.cos(a), math.sin(a), 0) for a in (0, 2 * math.pi / 3, 4 * math.pi / 3)],
    4: [(0, 0, 1)] + [(T * math.cos(a), T * math.sin(a), -1 / 3) for a in (0, 2 * math.pi / 3, 4 * math.pi / 3)],
}


def bond_dipole(a, b):
    """Signed length of the dipole of the bond a-b, towards b when positive; zero under 0,4."""
    d = CHI[b] - CHI[a]
    return d / 100 if abs(d) >= 40 else 0.0


def is_polar(formula):
    centre, outer = MOLS[formula]
    left = VAL[centre] - sum(o for _, o in outer)
    if left < 0 or left % 2:
        raise ValueError(f"{formula}: electrons of the central atom do not add up")
    steric = len(outer) + left // 2
    places = PLACES[steric]
    best = None
    # the atoms may sit on any of the places: the answer must not depend on which (it does not, for these shapes)
    import itertools

    for perm in itertools.permutations(range(steric), len(outer)):
        s = [0.0, 0.0, 0.0]
        for (atom, _), k in zip(outer, perm):
            mu = bond_dipole(centre, atom)
            for i in range(3):
                s[i] += mu * places[k][i]
        polar = math.sqrt(sum(x * x for x in s)) > 1e-6
        if best is None:
            best = polar
        elif best != polar:
            raise ValueError(f"{formula}: polarity depends on the arrangement")
    return best


def equal_outer(formula):
    return len({a for a, _ in MOLS[formula][1]}) == 1


def level1(sample, prose, errs):
    m = re.fullmatch(r"Nel legame tra un atomo di (\w+) \(\$\\chi = (\d\{,\}\d\d)\$\) e un atomo di (\w+) \(\$\\chi = (\d\{,\}\d\d)\$\), (.+)", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    a, b, q = m.group(1), m.group(3), m.group(5)
    for name, chi in ((a, m.group(2)), (b, m.group(4))):
        if name not in EL or f"{EL[name][1] // 100}{{,}}{EL[name][1] % 100:02d}" != chi:
            errs.append(f"electronegativity of {name} wrong")
            return None
    if a == b:
        errs.append("two equal atoms")
    d = abs(EL[a][1] - EL[b][1])
    if 35 < d < 45:
        errs.append(f"difference {d} too close to the threshold")
    if d > 180:
        errs.append(f"difference {d}: ionic by the lesson's rule")
    hi, lo = (a, b) if EL[a][1] > EL[b][1] else (b, a)
    polar = d >= 40
    if q == "verso quale atomo punta la freccia del momento dipolare?":
        want = "Verso " + art(hi) if polar else "Nessuna freccia: il legame è apolare"
    elif q == "quale atomo ha la carica parziale $\\delta^-$?":
        want = cap(art(hi)) if polar else "Nessuno: il legame è apolare"
    elif q == "quale atomo ha la carica parziale $\\delta^+$?":
        want = cap(art(lo)) if polar else "Nessuno: il legame è apolare"
    else:
        errs.append(f"question not recognised: {q!r}")
        return None
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == want, errs)
    return "polare" if polar else "apolare"


def which_molecule(sample, prose, errs, mixed):
    m = re.fullmatch(r"Quale di queste molecole è (polare|apolare)\?", prose)
    if not m:
        errs.append(f"text not recognised: {prose!r}")
        return None
    want_polar = m.group(1) == "polare"
    formulas = [mathrm(o["latex"]) for o in sample["answer"]["options"]]
    for f in formulas:
        if f not in MOLS:
            errs.append(f"molecule {f} not in the table")
            return None
    n_mixed = sum(1 for f in formulas if not equal_outer(f))
    if mixed and n_mixed == 0:
        errs.append("level 3 without a molecule with different atoms")
    if not mixed and n_mixed:
        errs.append("level 2 with a molecule with different atoms")
    check_choice(sample["answer"], lambda o: is_polar(mathrm(o["latex"])) == want_polar, errs)
    return "miste" if mixed else "uguali"


def round2(x):
    """x >= 0 exact or symbolic, rounded half up to the hundredth; raises close to a tie."""
    y = (x * 100).evalf(40)
    fl = floor(y)
    frac = y - fl
    if abs(frac - Rational(1, 2)) < Rational(2, 100):
        raise ValueError("too close to a tie")
    return int(fl) + (1 if frac > Rational(1, 2) else 0)


def level4(sample, prose, errs):
    m = re.fullmatch(
        r"In una molecola un atomo centrale è legato a due atomi uguali\. Ogni legame ha un dipolo di \$(\d\{,\}\d)\\,\\text\{D\}\$ e i due legami formano un angolo di \$(\d+(?:\{,\}\d)?)\^\\circ\$\. Quanto vale il momento dipolare della molecola\?",
        prose,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    mu = Rational(m.group(1).replace("{,}", "."))
    theta = Rational(m.group(2).replace("{,}", "."))
    if not (Rational(8, 10) <= mu <= 2 and 90 <= theta <= 180):
        errs.append("data out of range")
    k = round2(2 * mu * cos(theta * pi / 360)) if theta != 180 else 0
    want = "0\\,\\text{D}" if k == 0 else f"{k // 100}{{,}}{k % 100:02d}\\,\\text{{D}}"
    for o in sample["answer"]["options"]:
        if not re.fullmatch(r"(\d\{,\}\d\d|0)\\,\\text\{D\}", o["latex"]):
            errs.append(f"option {o['latex']!r} not a value in debye")
    check_choice(sample["answer"], lambda o: o["latex"] == want, errs)
    return "opposti" if theta == 180 else "angolo"


# substances of level 5: formula -> (name, polar, liquid at room temperature)
def _subst():
    out = {}
    for f, name, liquid in (
        ("NH_3", "ammoniaca", False), ("SO_2", "diossido di zolfo", False), ("CH_2O", "formaldeide", False), ("HCN", "cianuro di idrogeno", False),
        ("CH_4", "metano", False), ("CCl_4", "tetraclorometano", True), ("CS_2", "solfuro di carbonio", True), ("H_2O", "acqua", True),
        ("CHCl_3", "triclorometano", True), ("CH_2Cl_2", "diclorometano", True),
    ):
        out[f] = (name, is_polar(f), liquid)
    # two atoms: polar when the bond is
    for f, name, a, b, liquid in (
        ("HCl", "cloruro di idrogeno", "H", "Cl", False), ("HF", "fluoruro di idrogeno", "H", "F", False), ("I_2", "iodio", "I", "I", False),
        ("N_2", "azoto", "N", "N", False), ("O_2", "ossigeno", "O", "O", False), ("H_2", "idrogeno", "H", "H", False), ("Br_2", "bromo", "Br", "Br", True),
    ):
        out[f] = (name, bond_dipole(a, b) != 0, liquid)
    # a hydrocarbon: only C-C and C-H bonds, apolar by the lesson's step 2
    out["C_6H_{14}"] = ("esano", bond_dipole("C", "H") != 0, True)
    return out


SUBST = _subst()


def read_substance(latex):
    s = latex.strip()
    m = re.fullmatch(r"\\begin\{gathered\} \\text\{(.+)\} \\\\ (\\mathrm\{.+\}) \\end\{gathered\}", s) or re.fullmatch(r"\\text\{(.+), \}(\\mathrm\{.+\})", s)
    if not m:
        raise ValueError(f"not a substance: {latex!r}")
    f = mathrm(m.group(2))
    if f not in SUBST or SUBST[f][0] != m.group(1):
        raise ValueError(f"substance {m.group(1)} {f} not in the table")
    return f


def level5(sample, prose, errs):
    kinds = {
        "Quale di queste sostanze si scioglie meglio in acqua?": ("acqua", True),
        "Quale di queste sostanze si scioglie meglio nell'esano, un solvente apolare?": ("esano", False),
        "Quale di questi liquidi, fatto scendere in un filo sottile, devia di più vicino a una bacchetta elettrizzata?": ("bacchetta", True),
    }
    if prose not in kinds:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    kind, want_polar = kinds[prose]
    if kind == "bacchetta":
        for o in sample["answer"]["options"]:
            if not SUBST[read_substance(o["latex"])][2]:
                errs.append(f"{o['latex']!r} is not a liquid")
    check_choice(sample["answer"], lambda o: SUBST[read_substance(o["latex"])][1] == want_polar, errs)
    return kind


def check(sample):
    errs = []
    common_g(sample, errs)
    if sample.get("answer", {}).get("kind") != "choice":
        return errs + ["answer is not a choice"], None
    lvl = sample.get("level")
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    try:
        if lvl == 1:
            kind = level1(sample, prose, errs)
        elif lvl in (2, 3):
            kind = which_molecule(sample, prose, errs, lvl == 3)
        elif lvl == 4:
            kind = level4(sample, prose, errs)
        elif lvl == 5:
            kind = level5(sample, prose, errs)
        else:
            return [f"unknown level {lvl}"], None
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
