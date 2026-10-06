"""Checker for chim-regola-ottetto (specs/exercises/chim-regola-ottetto.md), written from the spec and the lesson
62-chim-regola-ottetto.md, not from the generator.

The facts of the lesson (answer key below); the extreme of a column of a table of bonds, read again from the table
and checked against the values of the lesson; the energy to break n moles of bonds, n times the bond energy in exact
arithmetic; the balance of H2 + X2 -> 2 HX, bonds broken and formed counted from the equation; the electrons lost or
gained to the octet from the group; the ion and the noble gas, by counting the electrons of every option.
"""
import re

from sympy import Rational, floor

from checkers._chim3_e import BONDS, EL, NOBLE, bond_tex, choice_answer, common, mixed, number_answer, parse_bond, unart, valence
from checkers._fis_grandezze import option_text, prose_and_extra

CASE_RANGES = {
    2: {"forte": (0.15, 0.35), "debole": (0.15, 0.35), "corto": (0.15, 0.35), "lungo": (0.15, 0.35)},
    4: {"assorbita": (0.15, 0.35), "ceduta": (0.15, 0.35), "bilancio": (0.40, 0.60)},
    5: {"cede": (0.40, 0.60), "acquista": (0.40, 0.60)},
    6: {"catione": (0.40, 0.60), "anione": (0.40, 0.60)},
}

KEY = {
    "Quando due atomi si legano, che cosa succede alla loro energia?": "Diminuisce",
    "Nella curva dell'energia di due atomi in funzione della distanza, che cosa indica la distanza del punto di minimo?": "La lunghezza di legame",
    "Nella curva dell'energia di due atomi in funzione della distanza, che cosa indica la profondità del minimo?": "L'energia di legame",
    "Perché l'energia risale quando due atomi sono più vicini della lunghezza di legame?": "I nuclei si respingono",
    "Che cosa succede quando un legame chimico si rompe?": "Si assorbe energia",
    "Che cosa succede quando un legame chimico si forma?": "Si cede energia all'ambiente",
    "In quale unità si misura l'energia di legame?": "kJ/mol",
    "In quale unità si misura di solito la lunghezza di legame?": "Picometri",
    "Quali elettroni di un atomo formano i legami chimici?": "Gli elettroni di valenza",
    "Quanti elettroni ha nel livello più esterno un atomo di neon?": "8",
    "Quanti elettroni ha nel livello più esterno un atomo di elio?": "2",
    "Perché i gas nobili non formano legami?": "Hanno il livello esterno completo",
    "Tra due legami, qual è il più forte?": "Quello con energia di legame maggiore",
    "Che cos'è l'ottetto?": "Otto elettroni nel livello più esterno",
    "Quanti elettroni servono a un atomo di idrogeno per avere il livello esterno completo?": "2",
    "Lo ione $\\mathrm{Na^+}$ ha la configurazione del neon. Di quale elemento è?": "Sodio",
}

NAMES = {
    ("H", "H"): ("idrogeno", "\\mathrm{H_2}"), ("F", "F"): ("fluoro", "\\mathrm{F_2}"), ("Cl", "Cl"): ("cloro", "\\mathrm{Cl_2}"),
    ("Br", "Br"): ("bromo", "\\mathrm{Br_2}"), ("I", "I"): ("iodio", "\\mathrm{I_2}"), ("H", "F"): ("fluoruro di idrogeno", "\\mathrm{HF}"),
    ("H", "Cl"): ("cloruro di idrogeno", "\\mathrm{HCl}"), ("H", "Br"): ("bromuro di idrogeno", "\\mathrm{HBr}"), ("H", "I"): ("ioduro di idrogeno", "\\mathrm{HI}"),
}
BOND = r"\\mathrm\{[A-Za-z]+\{-\}[A-Za-z]+\}"


def level1(sample, prose, extra, errs):
    if prose not in KEY:
        errs.append(f"level 1 question not in the key: {prose!r}")
        return None
    choice_answer(sample, lambda o: option_text(o["latex"]) == KEY[prose], errs)
    return "fatto"


QUESTIONS2 = {
    "Quale di questi legami è il più forte?": ("forte", 1, max),
    "Quale di questi legami è il più debole?": ("debole", 1, min),
    "Quale di questi legami è il più corto?": ("corto", 0, min),
    "Quale di questi legami è il più lungo?": ("lungo", 0, max),
}


def level2(sample, prose, extra, errs):
    m = re.fullmatch(r"(Quale di questi legami è il più \w+\?) Le lunghezze sono in picometri, le energie in chilojoule per mole\.", prose)
    if not m or m.group(1) not in QUESTIONS2 or len(extra) != 1:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    kind, col, pick = QUESTIONS2[m.group(1)]
    rows = re.findall(r"(" + BOND + r") & (\d+) & (\d+)", extra[0])
    if len(rows) != 4:
        errs.append(f"{len(rows)} rows in the table, expected 4")
        return None
    values = {}
    for tex, length, energy in rows:
        b = parse_bond(tex)
        if BONDS.get(b) != (int(length), int(energy)):
            errs.append(f"row {tex}: not the values of the lesson")
        values[tex] = (int(length), int(energy))[col]
    if len(values) != 4 or len(set(values.values())) != 4:
        errs.append("two rows with the same bond or the same value")
    best = pick(values.values())
    for o in sample["answer"]["options"]:
        if o["latex"] not in values:
            errs.append(f"option {o['latex']!r} is not a row of the table")
    choice_answer(sample, lambda o: values.get(o["latex"]) == best, errs)
    return kind


def level3(sample, prose, extra, errs):
    m = re.fullmatch(
        r"L'energia del legame \$(" + BOND + r")\$ è \$(\d+)\\,\\text\{kJ/mol\}\$\. Quanta energia serve per rompere tutti i legami di \$(\d\{,\}\d\d|\d\d\{,\}\d|0\{,\}\d\d\d)\\,\\text\{mol\}\$ di ([a-z ]+), \$(\\mathrm\{\w+\})\$\?",
        prose,
    )
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    a, b, order = parse_bond(m.group(1))
    if BONDS.get((a, b, order)) is None or BONDS[(a, b, order)][1] != int(m.group(2)) or (a, b) not in NAMES:
        errs.append("not a bond energy of the lesson")
        return None
    if NAMES[(a, b)] != (m.group(4), m.group(5)):
        errs.append(f"substance {m.group(4)!r} {m.group(5)!r} does not match the bond")
    n = Rational(m.group(3).replace("{,}", "."))
    e = n * int(m.group(2))
    if e - floor(e) == Rational(1, 2):
        errs.append("tie")
        return None
    r = int(floor(e + Rational(1, 2)))
    if not (100 <= r <= 999) or r % 10 == 0:
        errs.append(f"result {r} kJ outside the spec (100 to 999, not ending with 0)")
    want = f"{r}\\,\\text{{kJ}}"
    for o in sample["answer"]["options"]:
        if not re.fullmatch(r"\d+\\,\\text\{kJ\}", o["latex"]):
            errs.append(f"option {o['latex']!r} is not an energy in kJ")
    choice_answer(sample, lambda o: o["latex"] == want, errs)
    return "campione"


def level4(sample, prose, extra, errs):
    m = re.fullmatch(
        r"(Una mole|\$(\d)\$ moli) di \$\\mathrm\{H_2\}\$ (reagisce|reagiscono) con (una mole|\$(\d)\$ moli) di \$\\mathrm\{(\w+)_2\}\$ e (forma|formano) \$(\d)\$ moli di \$\\mathrm\{H(\w+)\}\$\. "
        r"Le energie di legame sono \$(\d+)\\,\\text\{kJ/mol\}\$ per \$\\mathrm\{H\{-\}H\}\$, \$(\d+)\\,\\text\{kJ/mol\}\$ per \$(" + BOND + r")\$ e \$(\d+)\\,\\text\{kJ/mol\}\$ per \$(" + BOND + r")\$\. (.+)",
        prose,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    k = int(m.group(2) or 1)
    if int(m.group(5) or 1) != k or int(m.group(8)) != 2 * k or (m.group(3) == "reagisce") != (k == 1) or (m.group(7) == "forma") != (k == 1):
        errs.append("moles of the equation do not match")
    X = m.group(6)
    if X not in ("F", "Cl", "Br", "I") or m.group(9) != X or m.group(12) != bond_tex(X, X) or m.group(14) != bond_tex("H", X):
        errs.append("bonds of the text do not match the reaction")
        return None
    hh, xx, hx = int(m.group(10)), int(m.group(11)), int(m.group(13))
    if (hh, xx, hx) != (BONDS[("H", "H", 1)][1], BONDS[(X, X, 1)][1], BONDS[("H", X, 1)][1]):
        errs.append("bond energies are not those of the lesson")
    broken = k * hh + k * xx
    formed = 2 * k * hx
    question = m.group(15)
    if question == "Quanta energia viene assorbita per rompere i legami dei reagenti?":
        want, kind = f"{broken}\\,\\text{{kJ}}", "assorbita"
    elif question == "Quanta energia viene ceduta quando si formano i legami dei prodotti?":
        want, kind = f"{formed}\\,\\text{{kJ}}", "ceduta"
    elif question == "Nel complesso la reazione cede energia o la assorbe? Quanta?":
        net = formed - broken
        if net == 0:
            errs.append("no net energy")
            return None
        want, kind = f"\\text{{{'Cede' if net > 0 else 'Assorbe'} }}{abs(net)}\\,\\text{{kJ}}", "bilancio"
    else:
        errs.append(f"level 4 question not recognised: {question!r}")
        return None
    choice_answer(sample, lambda o: o["latex"] == want, errs)
    return kind


def level5(sample, prose, extra, errs):
    m = re.fullmatch(r"(.+) è nel gruppo \$(\d+)\$\. Quanti elettroni deve (cedere un suo atomo per restare con il livello più esterno completo|acquistare un suo atomo per completare l'ottetto)\?", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    name = unart(m.group(1))
    group = EL[name][2]
    if group != int(m.group(2)):
        errs.append(f"{name} is in group {group}")
    lose = m.group(3).startswith("cedere")
    if lose != (group in (1, 2, 13)) or group == 14 or name == "idrogeno":
        errs.append(f"{name}: the question does not fit its group")
    v = valence(name)
    number_answer(sample, v if lose else 8 - v, errs)
    return "cede" if lose else "acquista"


def level6(sample, prose, extra, errs):
    m = re.fullmatch(r"(.+) è nel gruppo \$(\d+)\$\. Quale ione forma per avere il livello più esterno completo, e quale gas nobile ha la stessa configurazione elettronica\?", prose)
    if not m:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    name = unart(m.group(1))
    sym, z, group = EL[name][0], EL[name][1], EL[name][2]
    if group != int(m.group(2)) or group == 14 or name == "idrogeno":
        errs.append(f"{name}: wrong group, or an element the level does not use")
    lose = group in (1, 2, 13)

    def right(o):
        mm = re.fullmatch(r"\$\\mathrm\{([A-Z][a-z]?)\^\{(\d?)([+-])\}\}\$, come (.+)", mixed(o["latex"]))
        if not mm or mm.group(1) != sym:
            raise ValueError("not an ion of the element with a noble gas")
        q = int(mm.group(2) or 1) * (1 if mm.group(3) == "+" else -1)
        gas = unart(mm.group(4))
        # the ion a metal forms is positive, the one a non-metal forms is negative, and it has the electrons of the gas
        return (q > 0) == lose and z - q == NOBLE[gas]

    choice_answer(sample, right, errs)
    return "catione" if lose else "anione"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra and lvl != 2:
        errs.append(f"unexpected lines {extra}")
    try:
        kind = LEVELS[lvl](sample, prose, extra, errs)
    except (ValueError, KeyError, TypeError, AttributeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
