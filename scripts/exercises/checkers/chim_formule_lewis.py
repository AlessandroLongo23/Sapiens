"""Checker for chim-formule-lewis (specs/exercises/chim-formule-lewis.md), written from the spec and the lesson
67-chim-formule-lewis.md, not from the generator.

The valence electrons of a species are the sum of those of its atoms, read from the groups of the site's periodic
table, minus the charge. The lone pairs of a central atom are found as lesson 02 does: its valence electrons minus
those it puts in the bonds, halved. The bonding pairs of a formula that respects the octet are checked twice: with the
rule of the lesson (electrons for the octets minus valence electrons, halved) and against a table of the formulas
typed here. A formal charge is valence electrons minus lone electrons minus bonds. An exception to the octet is found
by counting the electrons around the central atom.
"""
import re

from checkers._chim3_f import BY_NAME, BY_SYMBOL, check_choice, check_number, common, option_text, prose_and_extra, valence

CASE_RANGES = {6: {"rispetta": (0.17, 0.33), "incompleto": (0.17, 0.33), "espanso": (0.17, 0.33), "dispari": (0.17, 0.33)}}

# bonding pairs of the Lewis formulas that respect the octet (a double bond counts two, a triple three)
BONDS = {
    "H_2O": 2, "NH_3": 3, "CH_4": 4, "CO_2": 4, "HCN": 4, "CH_2O": 4, "N_2": 3, "O_2": 2, "Cl_2": 1, "HCl": 1, "H_2S": 2, "PCl_3": 3, "CCl_4": 4,
    "OF_2": 2, "NF_3": 3, "CS_2": 4, "C_2H_4": 6, "C_2H_2": 5, "H_2CO_3": 6, "HNO_3": 5, "HClO": 2, "HBrO": 2, "COCl_2": 4, "O_3": 3, "SO_2": 3,
    "SO_3": 4, "H_2SO_4": 6,
}
# electrons a terminal atom takes from the central one in the bonds: one for hydrogen and the halogens, two for a
# terminal oxygen or sulfur, three for a terminal nitrogen
TAKES = {"H": 1, "F": 1, "Cl": 1, "Br": 1, "I": 1, "O": 2, "S": 2, "N": 3}
WORDS = {"un": 1, "due": 2, "tre": 3, "quattro": 4}
ORDER = {"semplice": 1, "semplici": 1, "doppio": 2, "doppi": 2, "triplo": 3, "tripli": 3}


def species(tex):
    """\\mathrm{CO_3^{2-}} -> ('CO_3', [('C', 1), ('O', 3)], -2)."""
    m = re.fullmatch(r"\\mathrm\{((?:[A-Z][a-z]?(?:_\d)?)+)(?:\^(?:([+-])|\{(\d)([+-])\}))?\}", tex.strip())
    if not m:
        raise ValueError(f"not a species: {tex!r}")
    atoms = [(s, int(k) if k else 1) for s, k in re.findall(r"([A-Z][a-z]?)(?:_(\d))?", m.group(1))]
    for s, _ in atoms:
        if s not in BY_SYMBOL:
            raise ValueError(f"unknown element {s}")
    sign = m.group(2) or m.group(4)
    n = int(m.group(3)) if m.group(3) else (1 if sign else 0)
    return m.group(1), atoms, (n if sign == "+" else -n)


def valence_total(atoms, charge):
    return sum(n * valence(s) for s, n in atoms) - charge


def level1(sample, prose, errs):
    m = re.fullmatch(r"Quanti elettroni di valenza ha in tutto la molecola \$(.+?)\$\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    _, atoms, charge = species(m.group(1))
    if charge:
        errs.append("level 1 with an ion")
    check_number(sample, valence_total(atoms, 0), errs)
    return "molecola"


def terminals_of(atoms, center):
    out, skipped = [], False
    for s, n in atoms:
        for _ in range(n):
            if s == center and not skipped:
                skipped = True
            else:
                out.append(s)
    if not skipped:
        raise ValueError(f"no {center} in the species")
    return out


def level2(sample, prose, errs):
    m = re.fullmatch(r"Nella formula di Lewis di \$(.+?)\$, quante coppie solitarie ha l'atomo centrale, (.+)\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    _, atoms, charge = species(m.group(1))
    name = re.sub(r"^(il |lo |l')", "", m.group(2))
    center = BY_NAME[name]["symbol"]
    ts = terminals_of(atoms, center)
    if center in ts:
        errs.append("more than one atom of the central element")
    # lesson 02: (valence electrons - charge - electrons put in the bonds) / 2
    left = valence(center) - charge - sum(TAKES[t] for t in ts)
    if left < 0 or left % 2:
        errs.append(f"{left} electrons left on the central atom")
        return None
    pairs = left // 2
    if not 0 <= pairs <= 3:
        errs.append(f"{pairs} lone pairs")
    check_number(sample, pairs, errs)
    return f"coppie-{pairs}"


def level3(sample, prose, errs):
    m = re.fullmatch(
        r"Nella formula di Lewis di \$(.+?)\$ che rispetta la regola dell'ottetto, quante coppie di legame ci sono in tutto\? "
        r"Un legame doppio conta per due, un triplo per tre\.",
        prose,
    )
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    body, atoms, charge = species(m.group(1))
    if charge:
        errs.append("level 3 with an ion")
    need = sum(n * (2 if s == "H" else 8) for s, n in atoms)
    total = valence_total(atoms, 0)
    if (need - total) % 2:
        errs.append("odd number of electrons")
        return None
    bonds = (need - total) // 2
    if body not in BONDS:
        errs.append(f"{body} is not in the table of the formulas")
    elif BONDS[body] != bonds:
        errs.append(f"{body}: the rule gives {bonds} bonding pairs, the formula has {BONDS[body]}")
    check_number(sample, bonds, errs)
    return "multipli" if bonds > sum(n for _, n in atoms) - 1 else "semplici"


def level4(sample, prose, errs):
    m = re.fullmatch(r"Quanti elettroni di valenza ha in tutto lo ione \$(.+?)\$\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    _, atoms, charge = species(m.group(1))
    if charge == 0 or sum(n for _, n in atoms) < 2:
        errs.append("level 4 needs a polyatomic ion")
    check_number(sample, valence_total(atoms, charge), errs)
    return "anione" if charge < 0 else "catione"


# the atoms of level 5 as the formulas of the lesson draw them: (species, element) -> (lone pairs, bonds)
ATOMS = {
    ("CN^-", "C"): (1, 3), ("CN^-", "N"): (1, 3), ("NH_4^+", "N"): (0, 4), ("H_3O^+", "O"): (1, 3), ("OH^-", "O"): (3, 1),
    ("CO_3^{2-}", "C"): (0, 4), ("NO_3^-", "N"): (0, 4), ("H_2SO_4", "S"): (0, 4), ("SO_3", "S"): (0, 4), ("NH_3", "N"): (1, 3),
    ("CO_2", "C"): (0, 4), ("H_2O", "O"): (2, 2), ("BF_4^-", "B"): (0, 4), ("NH_2^-", "N"): (2, 2), ("BF_3", "B"): (0, 3),
    ("HClO_4", "Cl"): (0, 4), ("HCN", "N"): (1, 3), ("HCN", "C"): (0, 4), ("O_3", "O"): (1, 3),
}


def bonds_of(words):
    """'due legami semplici e un doppio' -> 4; 'un legame triplo' -> 3."""
    total = 0
    for i, part in enumerate(words.split(" e ")):
        m = re.fullmatch(r"(un|due|tre|quattro) (?:(legame|legami) )?(semplice|semplici|doppio|doppi|triplo|tripli)", part)
        if not m:
            raise ValueError(f"bonds not recognised: {words!r}")
        n = WORDS[m.group(1)]
        # the word "legame" or "legami" is written with the first group only, and agrees with its number
        if (i == 0) != bool(m.group(2)) or (i == 0 and (m.group(2) == "legame") != (n == 1)):
            raise ValueError(f"bonds badly written: {words!r}")
        if (n == 1) != (m.group(3) in ("semplice", "doppio", "triplo")):
            raise ValueError(f"singular and plural do not agree: {words!r}")
        total += n * ORDER[m.group(3)]
    return total


def signed(n):
    return f"+{n}" if n > 0 else (f"-{-n}" if n < 0 else "0")


def level5(sample, prose, errs):
    m = re.fullmatch(r"(.+) (non ha coppie solitarie|ha una coppia solitaria|ha (?:due|tre) coppie solitarie) e forma (.+)\. Qual è la sua carica formale\?", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    # the atom is named after the formula: "... il carbonio", "... l'ossigeno al centro"
    tail = m.group(1).split("$")[-1]
    mt = re.search(r"(?:il |lo |l')(\w+)(?: al centro)?$", tail)
    if not mt or mt.group(1) not in BY_NAME:
        errs.append(f"atom not recognised in {m.group(1)!r}")
        return None
    sym = BY_NAME[mt.group(1)]["symbol"]
    pairs = {"non ha coppie solitarie": 0, "ha una coppia solitaria": 1, "ha due coppie solitarie": 2, "ha tre coppie solitarie": 3}[m.group(2)]
    bonds = bonds_of(m.group(3))
    ms = re.search(r"\$\\mathrm\{(.+?)\}\$", m.group(1))
    if not ms or (ms.group(1), sym) not in ATOMS:
        errs.append(f"atom not in the table of the formulas: {m.group(1)!r}")
    elif ATOMS[(ms.group(1), sym)] != (pairs, bonds):
        errs.append(f"{sym} in {ms.group(1)} has {ATOMS[(ms.group(1), sym)]} lone pairs and bonds, the text says {(pairs, bonds)}")
    if 2 * pairs + 2 * bonds > 8:
        errs.append("more than eight electrons around the atom")
    fc = valence(sym) - 2 * pairs - bonds
    if not -1 <= fc <= 3:
        errs.append(f"formal charge {fc} outside the range of the spec")
    for o in sample["answer"]["options"]:
        if not re.fullmatch(r"0|[+-][1-9]", o["latex"]):
            errs.append(f"option {o['latex']!r} is not a signed whole number")
    check_choice(sample["answer"], lambda o: o["latex"] == signed(fc), errs)
    return "zero" if fc == 0 else ("positiva" if fc > 0 else "negativa")


LABEL = {"rispetta": "Sì", "incompleto": "No: ottetto incompleto", "espanso": "No: ottetto espanso", "dispari": "No: elettroni dispari"}


def level6(sample, prose, errs):
    m = re.fullmatch(r"Nella formula di Lewis di \$(.+?)\$ l'atomo centrale rispetta la regola dell'ottetto\?", prose)
    if not m:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    _, atoms, charge = species(m.group(1))
    if valence_total(atoms, charge) % 2:
        kind = "dispari"
    else:
        singles = [s for s, n in atoms if n == 1 and s != "H"]
        if not singles:
            errs.append("no central atom")
            return None
        center = singles[0]
        ts = terminals_of(atoms, center)
        around = valence(center) - charge + sum(TAKES[t] for t in ts)
        kind = "rispetta" if around == 8 else ("incompleto" if around < 8 else "espanso")
        if kind == "espanso" and BY_SYMBOL[center]["period"] < 3:
            errs.append(f"{center} of the second period with an expanded octet")
    if sorted(option_text(o["latex"]) for o in sample["answer"]["options"]) != sorted(LABEL.values()):
        errs.append("the options are not the four cases")
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == LABEL[kind], errs)
    return kind


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}
NUMBER_LEVELS = {1, 2, 3, 4}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    kind_of_answer = sample.get("answer", {}).get("kind")
    if (lvl in NUMBER_LEVELS) != (kind_of_answer == "number"):
        return errs + [f"level {lvl} with a {kind_of_answer} answer"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append(f"unexpected lines {extra}")
    try:
        kind = LEVELS[lvl](sample, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
