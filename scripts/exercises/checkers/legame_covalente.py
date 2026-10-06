"""Checker for legame-covalente (specs/exercises/legame-covalente.md), written from the spec and the lesson
63-legame-covalente.md, not from the generator.

The facts of the lesson (answer key below); the bonds an atom forms, 8 minus its valence electrons (1 for hydrogen),
and its lone pairs; the valence electrons of a molecule summed from its formula; its lone pairs, counted atom by atom
from the bonds each atom needs (another road than the generator's, which subtracts the bonding pairs from the total);
the electrons around an atom for a given number of shared pairs; bond order against length and energy, with the table
of the lesson typed again in _chim3_e.py.
"""
import re

from checkers._chim3_e import BONDS, BY_SYMBOL, EL, ORDER, bond_tex, choice_answer, common, mixed, number_answer, parse_formula, unart, valence
from checkers._fis_grandezze import option_text, prose_and_extra

CASE_RANGES = {
    2: {"legami": (0.50, 0.75), "solitarie": (0.25, 0.50)},
    3: {"valenza": (0.30, 0.50), "solitarie": (0.50, 0.70)},
    4: {"solitarie": (0.30, 0.50), "coppie": (0.20, 0.40), "intorno": (0.20, 0.40)},
}

KEY = {
    "Che cos'è un legame covalente?": "Una coppia di elettroni in comune",
    "Tra quali atomi si forma di solito il legame covalente?": "Tra atomi di non metalli",
    "Quando un legame covalente si chiama puro?": "Quando la coppia sta a metà tra i due atomi",
    "Che cos'è una coppia solitaria?": "Una coppia di elettroni di un atomo solo",
    "Che cos'è una coppia di legame?": "Una coppia in comune tra due atomi",
    "Nel conto dell'ottetto, quanti elettroni vale una coppia di legame per ciascuno dei due atomi?": "2",
    "Quante coppie di elettroni sono in comune in un legame doppio?": "2",
    "Quanti elettroni sono in comune in un legame triplo?": "6",
    "Che cos'è l'ordine di legame?": "Il numero di coppie in comune",
    "In una formula di Lewis, che cosa indica un trattino tra due atomi?": "Una coppia di elettroni in comune",
    "Quanti elettroni ha intorno un atomo di idrogeno in una molecola?": "2",
    "La formula di Lewis di una molecola dice che forma ha la molecola?": "No, solo quali atomi sono legati",
    "Che legame unisce i due atomi nella molecola di azoto?": "Un legame triplo",
    "Che legame unisce i due atomi nella molecola di ossigeno?": "Un legame doppio",
}

# formula -> name, for the molecules of levels 3 and 4
MOLECULES = {
    "\\mathrm{F_2}": "fluoro", "\\mathrm{Cl_2}": "cloro", "\\mathrm{Br_2}": "bromo", "\\mathrm{HF}": "fluoruro di idrogeno",
    "\\mathrm{HCl}": "cloruro di idrogeno", "\\mathrm{HBr}": "bromuro di idrogeno", "\\mathrm{H_2O}": "acqua", "\\mathrm{H_2S}": "solfuro di idrogeno",
    "\\mathrm{NH_3}": "ammoniaca", "\\mathrm{PH_3}": "fosfina", "\\mathrm{NF_3}": "trifluoruro di azoto", "\\mathrm{PCl_3}": "tricloruro di fosforo",
    "\\mathrm{CH_4}": "metano", "\\mathrm{SiH_4}": "silano", "\\mathrm{CCl_4}": "tetraclorometano", "\\mathrm{CF_4}": "tetrafluorometano",
    "\\mathrm{OF_2}": "difluoruro di ossigeno", "\\mathrm{O_2}": "ossigeno", "\\mathrm{N_2}": "azoto", "\\mathrm{CO_2}": "diossido di carbonio",
    "\\mathrm{C_2H_4}": "etene", "\\mathrm{C_2H_2}": "etino", "\\mathrm{HCN}": "cianuro di idrogeno", "\\mathrm{CH_2O}": "metanale",
}


def bonds_of(sym):
    """The bonds an atom needs: 8 minus its valence electrons, 1 for hydrogen."""
    return 1 if sym == "H" else 8 - valence(BY_SYMBOL[sym])


def lone_of(sym):
    """The lone pairs of an atom that has formed its bonds."""
    v = valence(BY_SYMBOL[sym])
    return (v - bonds_of(sym)) // 2


def level1(sample, prose, errs):
    if prose not in KEY:
        errs.append(f"level 1 question not in the key: {prose!r}")
        return None
    choice_answer(sample, lambda o: option_text(o["latex"]) == KEY[prose], errs)
    return "fatto"


def level2(sample, prose, errs):
    m = re.fullmatch(r"(.+) è nel gruppo \$(\d+)\$\. (Quanti legami covalenti forma di solito un suo atomo\?|Quante coppie solitarie ha di solito un suo atomo in una molecola, dopo aver formato i suoi legami covalenti\?)", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    name = unart(m.group(1))
    sym, _, group, _, metal = EL[name]
    if group != int(m.group(2)) or metal:
        errs.append(f"{name}: wrong group, or a metal")
    if m.group(3).startswith("Quanti legami"):
        number_answer(sample, bonds_of(sym), errs)
        return "legami"
    if sym == "H":
        errs.append("lone pairs asked for hydrogen")
    number_answer(sample, lone_of(sym), errs)
    return "solitarie"


def molecule(tex, name, errs):
    if MOLECULES.get(tex) != name:
        errs.append(f"molecule {tex!r} with name {name!r}: not one of the spec")
    return parse_formula(tex)


def counting(sample, prose, errs, level):
    """Levels 3 and 4: valence electrons of a molecule, or its lone pairs."""
    m = re.fullmatch(r"Quanti elettroni di valenza ha in tutto la molecola di ([a-z ]+), \$(\\mathrm\{\w+\})\$\?", prose)
    if m:
        atoms = molecule(m.group(2), m.group(1), errs)
        number_answer(sample, sum(n * valence(BY_SYMBOL[s]) for s, n in atoms), errs)
        return "valenza"
    m = re.fullmatch(r"Nella molecola di ([a-z ]+), \$(\\mathrm\{\w+\})\$, (.+)\. Quante coppie solitarie ci sono in tutto nella molecola\?", prose)
    if not m:
        return None
    atoms = molecule(m.group(2), m.group(1), errs)
    words = set(re.findall(r"legam[ei] (singol[oi]|doppio|triplo)", m.group(3)))
    multiple = bool(words & {"doppio", "triplo"})
    if not words:
        errs.append("the text does not say how the atoms are bound")
    if level == 3 and multiple:
        errs.append("level 3 has single bonds only")
    if level == 4 and not multiple:
        errs.append("level 4 needs a double or a triple bond")
    # the description must agree with what the atoms need: twice the bonding pairs is the sum of the atoms' bonds
    orders = [ORDER[w.replace("singoli", "singolo")] for w in re.findall(r"legam[ei] (singol[oi]|doppio|triplo)", m.group(3))]
    if len(atoms) == 1 and atoms[0][1] == 2 and orders != [bonds_of(atoms[0][0])]:
        errs.append("the bond of the diatomic molecule is not the one its atoms need")
    lone = sum(n * lone_of(s) for s, n in atoms)
    total = sum(n * valence(BY_SYMBOL[s]) for s, n in atoms)
    bonding = sum(n * bonds_of(s) for s, n in atoms)
    if bonding % 2 or total != 2 * lone + bonding:
        errs.append("electrons of the molecule do not add up")
    number_answer(sample, lone, errs)
    return "solitarie"


def level3(sample, prose, errs):
    kind = counting(sample, prose, errs, 3)
    if kind is None:
        errs.append(f"level 3 text not recognised: {prose!r}")
    return kind


def level4(sample, prose, errs):
    kind = counting(sample, prose, errs, 4)
    if kind == "valenza":
        errs.append("level 4 does not ask for the valence electrons")
    if kind is not None:
        return kind
    m = re.fullmatch(r"(.+) è nel gruppo \$(\d+)\$\. Quante coppie di elettroni mettono in comune i due atomi della molecola \$\\mathrm\{(\w+)_2\}\$\?", prose)
    if m:
        name = unart(m.group(1))
        sym, _, group, _, metal = EL[name]
        if group != int(m.group(2)) or sym != m.group(3) or metal or sym not in ("H", "F", "Cl", "Br", "O", "N"):
            errs.append(f"{name}: wrong group or symbol, or not a molecule of the spec")
        number_answer(sample, bonds_of(sym), errs)
        return "coppie"
    m = re.fullmatch(
        r"(.+) ha \$(\d)\$ elettroni di valenza\. Se nella molecola \$\\mathrm\{(\w+)_2\}\$ i due atomi fossero uniti da un legame (singolo|doppio|triplo), quanti elettroni avrebbe intorno ogni atomo, contando per intero le coppie in comune\?",
        prose,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    name = unart(m.group(1))
    sym = EL[name][0]
    v = valence(name)
    k = ORDER[m.group(4)]
    if v != int(m.group(2)) or sym != m.group(3) or sym not in ("O", "N") or k > 8 - v:
        errs.append(f"{name}: wrong valence electrons or symbol, or too many shared pairs")
    # k electrons go in the bonds, v - k stay, and the k shared pairs count in full
    number_answer(sample, (v - k) + 2 * k, errs)
    return "intorno"


FAMILIES = {"carbonio": "C", "azoto": "N"}


def level5(sample, prose, errs):
    m = re.fullmatch(r"Tra due atomi di (\w+) ci può essere un legame singolo, doppio o triplo\. Quale dei tre è (il più corto|il più lungo|quello con energia di legame maggiore|quello con energia di legame minore)\?", prose)
    if m:
        sym = FAMILIES[m.group(1)]
        col, pick = {"il più corto": (0, min), "il più lungo": (0, max), "quello con energia di legame maggiore": (1, max), "quello con energia di legame minore": (1, min)}[m.group(2)]
        values = {bond_tex(sym, sym, o): BONDS[(sym, sym, o)][col] for o in (1, 2, 3)}
        best = pick(values.values())
        choice_answer(sample, lambda o: values.get(o["latex"]) == best, errs)
        return {"il più corto": "corto", "il più lungo": "lungo", "quello con energia di legame maggiore": "forte", "quello con energia di legame minore": "debole"}[m.group(2)]
    m = re.fullmatch(
        r"Due legami tra atomi di (\w+) hanno lunghezza \$(\d+)\\,\\text\{pm\}\$ e \$(\d+)\\,\\text\{pm\}\$: uno è (singolo|doppio|triplo), l'altro (singolo|doppio|triplo)\. (Quale dei due è il legame (singolo|doppio|triplo)\?|Quale dei due ha l'energia di legame maggiore\?)",
        prose,
    )
    if m:
        sym = FAMILIES[m.group(1)]
        o1, o2 = ORDER[m.group(4)], ORDER[m.group(5)]
        by_length = {BONDS[(sym, sym, o)][0]: o for o in (o1, o2)}
        if o1 == o2 or set(by_length) != {int(m.group(2)), int(m.group(3))}:
            errs.append("lengths do not match the two bonds of the lesson")
            return None
        if m.group(7):
            if ORDER[m.group(7)] not in (o1, o2):
                errs.append("the bond asked for is not one of the two")
                return None
            target = ORDER[m.group(7)]
            kind = "dati-ordine"
        else:
            # the stronger of the two: the one with the greater energy in the table
            target = max((o1, o2), key=lambda o: BONDS[(sym, sym, o)][1])
            kind = "dati-energia"
        want = f"Quello di ${BONDS[(sym, sym, target)][0]}\\,\\text{{pm}}$"
        choice_answer(sample, lambda o: mixed(o["latex"]) == want, errs)
        return kind
    m = re.fullmatch(r"L'energia del legame \$\\mathrm\{C\{-\}C\}\$ è \$(\d+)\\,\\text\{kJ/mol\}\$\. Quale di questi valori è l'energia del legame \$\\mathrm\{C\{(=|\\equiv)\}C\}\$\?", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    single = BONDS[("C", "C", 1)][1]
    k = 2 if m.group(2) == "=" else 3
    if int(m.group(1)) != single:
        errs.append("not the energy of the single bond of the lesson")
    want = BONDS[("C", "C", k)][1]
    values = []
    for o in sample["answer"]["options"]:
        mm = re.fullmatch(r"(\d+)\\,\\text\{kJ/mol\}", o["latex"])
        if not mm:
            errs.append(f"option {o['latex']!r} is not an energy")
            return None
        values.append(int(mm.group(1)))
    # only the right value is stronger than the single bond and weaker than k single bonds
    if [x for x in values if single < x < k * single] != [want]:
        errs.append(f"options {values}: exactly one must lie between {single} and {k * single}, and be {want}")
    choice_answer(sample, lambda o: o["latex"] == f"{want}\\,\\text{{kJ/mol}}", errs)
    return "energia-doppio"


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
    try:
        kind = LEVELS[lvl](sample, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
