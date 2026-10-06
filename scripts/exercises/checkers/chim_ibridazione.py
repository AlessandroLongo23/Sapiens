"""Checker for chim-ibridazione (specs/exercises/chim-ibridazione.md), written from the spec and the lesson
71-chim-ibridazione.md, not from the generator.

The rule is one: an atom has as many hybrid orbitals as domains (atoms bound plus lone pairs), 2 -> sp, 3 -> sp2,
4 -> sp3, and 4 minus that number of p orbitals left for pi bonds. For the molecules the lone pairs are not looked up:
they are counted from the valence electrons, the charge and the bond orders of a table of its own, as lesson 02 does.
For the chains the hybridisation of each carbon is read from the formula by another road: the pi bonds it takes part
in (0 -> sp3, 1 -> sp2, 2 -> sp).
"""
import re

from checkers._chim3_g import common_g, mathrm
from checkers._fis_grandezze import check_choice, option_text, prose_and_extra

HYB = {2: "sp", 3: "sp^2", 4: "sp^3"}
N_OF = {"sp": 2, "sp^2": 3, "sp^3": 4}
ANGLE = {2: "180^\\circ", 3: "120^\\circ", 4: "109{,}5^\\circ"}
MIX = {2: "Un s e un p", 3: "Un s e due p", 4: "Un s e tre p"}
SHAPE = {2: "Su una retta, in versi opposti", 3: "In un piano, verso i vertici di un triangolo", 4: "Verso i vertici di un tetraedro"}


def plain(latex):
    if latex.strip().startswith("\\begin{gathered}"):
        return option_text(latex)
    return re.sub(r"\\text\{([^}]*)\}", r"\1", latex)


def level1(sample, prose, errs):
    m = re.search(r"\$(sp(?:\^[23])?)\$\?$", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    n = N_OF[m.group(1)]
    head = prose[: m.start()]
    if head == "Quanti orbitali ibridi ha un atomo ibridato ":
        want, kind = str(n), "quanti"
    elif head == "Che angolo formano tra loro gli orbitali ibridi ":
        want, kind = ANGLE[n], "angolo"
    elif head == "Quanti orbitali $p$ non ibridati restano a un atomo ibridato ":
        want, kind = str(4 - n), "rimasti"
    elif head == "Quanti legami $\\pi$ può formare un atomo di carbonio ibridato ":
        want, kind = str(4 - n), "pi"
    elif head == "Quali orbitali si mescolano per dare gli ibridi ":
        want, kind = MIX[n], "mescolati"
    elif head == "Come sono disposti gli orbitali ibridi ":
        want, kind = SHAPE[n], "disposizione"
    else:
        errs.append(f"level 1 question not recognised: {prose!r}")
        return None
    check_choice(sample["answer"], lambda o: plain(o["latex"]) == want, errs)
    return kind


def hyb_choice(sample, steric, errs):
    if steric not in HYB:
        errs.append(f"{steric} domains: outside the lesson")
        return
    for o in sample["answer"]["options"]:
        if o["latex"] not in ("sp", "sp^2", "sp^3", "sp^3d"):
            errs.append(f"option {o['latex']!r} is not a hybridisation")
    check_choice(sample["answer"], lambda o: o["latex"] == HYB[steric], errs)


def level2(sample, prose, errs):
    m = re.fullmatch(r"Un atomo è legato a \$(\d)\$ atom[oi] e (non ha coppie solitarie|ha \$(\d)\$ coppi[ae] solitari[ae])\. Qual è la sua ibridazione\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    a, l = int(m.group(1)), int(m.group(3) or 0)
    if a < 1 or not 2 <= a + l <= 4:
        errs.append("domains out of range")
    hyb_choice(sample, a + l, errs)
    return "senza coppie" if l == 0 else "con coppie"


VAL = {"B": 3, "C": 4, "N": 5, "O": 6}
# formula -> (central atom, orders of its bonds, charge taken from its electrons)
# For an ion the charge is put on the central atom or on the atoms around it as the Lewis formula of lesson 67 does:
# NH4+ and H3O+ on the centre; BF4- on the centre; NH2- on the centre; in CO3 2-, NO3- and NO2- the negative charges
# are on the oxygens with a single bond, and the nitrogen of NO3- carries a positive one.
MOLS = {
    "CH_4": ("C", [1, 1, 1, 1], 0), "CCl_4": ("C", [1, 1, 1, 1], 0), "CF_4": ("C", [1, 1, 1, 1], 0), "CH_3Cl": ("C", [1, 1, 1, 1], 0),
    "NH_3": ("N", [1, 1, 1], 0), "NF_3": ("N", [1, 1, 1], 0), "NH_4^+": ("N", [1, 1, 1, 1], 1), "NH_2^-": ("N", [1, 1], -1),
    "H_2O": ("O", [1, 1], 0), "OF_2": ("O", [1, 1], 0), "H_3O^+": ("O", [1, 1, 1], 1),
    "BF_3": ("B", [1, 1, 1], 0), "BCl_3": ("B", [1, 1, 1], 0), "BF_4^-": ("B", [1, 1, 1, 1], -1),
    "CO_2": ("C", [2, 2], 0), "CS_2": ("C", [2, 2], 0), "HCN": ("C", [1, 3], 0), "CH_2O": ("C", [1, 1, 2], 0), "COCl_2": ("C", [2, 1, 1], 0),
    "CH_2{=}CH_2": ("C", [1, 1, 2], 0), "HC{\\equiv}CH": ("C", [1, 3], 0), "CO_3^{2-}": ("C", [2, 1, 1], 0),
    "NO_3^-": ("N", [2, 1, 1], 1), "NO_2^-": ("N", [2, 1], 0), "HN{=}NH": ("N", [1, 2], 0),
}
ATOM_WORDS = {"del carbonio": "C", "di ciascun carbonio": "C", "dell'azoto": "N", "di ciascun azoto": "N", "dell'ossigeno": "O", "del boro": "B"}
SECOND_PERIOD = {"B", "C", "N", "O"}


def level34(sample, prose, errs, lvl):
    m = re.fullmatch(r"Qual è l'ibridazione (.+?) (nello ione|nella molecola) \$(\\mathrm\{.+\})\$\?", prose)
    if not m or m.group(1) not in ATOM_WORDS:
        errs.append(f"level {lvl} text not recognised: {prose!r}")
        return None
    f = mathrm(m.group(3))
    if f not in MOLS:
        errs.append(f"molecule {f} not in the table")
        return None
    centre, orders, charge = MOLS[f]
    if centre != ATOM_WORDS[m.group(1)] or centre not in SECOND_PERIOD:
        errs.append("central atom does not match, or is not of the second period")
    if ("^" in f) != (m.group(2) == "nello ione"):
        errs.append("molecule called an ion, or an ion called a molecule")
    left = VAL[centre] - charge - sum(orders)
    if left < 0 or left % 2:
        errs.append(f"{f}: electrons of the central atom do not add up")
        return None
    multiple = any(o > 1 for o in orders)
    if multiple != (lvl == 4):
        errs.append("single bonds only belong to level 3, multiple bonds to level 4")
    hyb_choice(sample, len(orders) + left // 2, errs)
    return "multipli" if lvl == 4 else "con coppie" if left else "senza coppie"


def chain(formula):
    """The hybridisation of each carbon of a condensed open chain, left to right, from the pi bonds it takes part in."""
    parts = re.split(r"(\{-\}|\{=\}|\{\\equiv\})", formula)
    groups, links = parts[0::2], [{"{-}": 1, "{=}": 2, "{\\equiv}": 3}[x] for x in parts[1::2]]
    out = []
    for i, g in enumerate(groups):
        if not re.fullmatch(r"(H?C|CH(_[23])?|N|O)", g):
            raise ValueError(f"cannot read group {g!r}")
        if "C" not in g:
            continue
        around = ([links[i - 1]] if i > 0 else []) + ([links[i]] if i < len(links) else [])
        pis = sum(o - 1 for o in around)
        h = int(re.search(r"_(\d)", g).group(1)) if "_" in g else g.count("H")
        if sum(around) + h != 4:
            raise ValueError(f"carbon {g!r} does not have four bonds")
        out.append(HYB[4 - pis])
    return out


def level5(sample, prose, errs):
    m = re.fullmatch(r"Qual è l'ibridazione degli atomi di carbonio della molecola \$(\\mathrm\{.+\})\$, da sinistra a destra\?", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    want = chain(mathrm(m.group(1)))
    if not 2 <= len(want) <= 4:
        errs.append("from two to four carbons")
    for o in sample["answer"]["options"]:
        if len(o["latex"].split(",\\ ")) != len(want):
            errs.append(f"option {o['latex']!r} with another number of carbons")
    check_choice(sample["answer"], lambda o: o["latex"].split(",\\ ") == want, errs)
    return f"{len(want)} carboni"


# the bond -> the two orbitals, from the lesson: hybrids of the two atoms for a sigma bond, 1s for hydrogen, p and p
# for a pi bond
def overlap(desc):
    m = re.fullmatch(r"(?:in un legame|nel legame|in uno dei legami) (.+?),? ?\$(\\mathrm\{[^$]+\})\$", desc)
    if not m:
        raise ValueError(f"bond not recognised: {desc!r}")
    what, f = m.group(1), mathrm(m.group(2))
    if "$\\pi$" in what:
        # the molecule must have the pi bond asked for (one for "il legame", two for "uno dei legami"), and be well formed
        hs = chain(f)
        need = "sp" if m.group(0).startswith("in uno dei legami") else "sp^2"
        if hs.count(need) != 2 or len(hs) != 2:
            raise ValueError(f"{f}: no such pi bond")
        return ["p", "p"], "pi"
    if f in MOLS:
        centre, orders, charge = MOLS[f]
        hyb = HYB[len(orders) + (VAL[centre] - charge - sum(orders)) // 2]
        hs = [hyb, hyb]
    else:
        hs = chain(f)
    if re.match(r"\$\\mathrm\{[CNO]\{-\}H\}\$", what):
        return [hs[0], "1s"], "con H"
    if "tra i due carboni" in what:
        if len(hs) != 2 or hs[0] != hs[1]:
            raise ValueError("two equal carbons expected")
        return hs, "tra carboni"
    if "tra il primo e il secondo carbonio" in what:
        return hs[:2], "tra carboni"
    raise ValueError(f"bond not recognised: {desc!r}")


def level6(sample, prose, errs):
    m = re.fullmatch(r"Quali orbitali si sovrappongono (.+)\?", prose)
    if not m:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    want, kind = overlap(m.group(1))
    check_choice(sample["answer"], lambda o: sorted(o["latex"].split("\\text{ e }")) == sorted(want), errs)
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
        elif lvl == 2:
            kind = level2(sample, prose, errs)
        elif lvl in (3, 4):
            kind = level34(sample, prose, errs, lvl)
        elif lvl == 5:
            kind = level5(sample, prose, errs)
        elif lvl == 6:
            kind = level6(sample, prose, errs)
        else:
            return [f"unknown level {lvl}"], None
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
