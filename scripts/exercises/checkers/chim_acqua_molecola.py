"""Checker for chim-acqua-molecola (specs/exercises/chim-acqua-molecola.md), written from the spec and the lesson
44-chim-acqua-molecola.md, not from the generator.

Level 1-2: water is 2,02 parts of hydrogen and 16,00 of oxygen in 18,02 (H 1,01, O 16,00): the mass of an element
in m grams of water is m times its share, the water that holds x grams of an element is x divided by its share.
Level 3: the right answer of each question, written again from the lesson. Level 4: a substance forms hydrogen
bonds between its molecules when its formula has hydrogen and oxygen, nitrogen or fluorine (true for the substances
of the spec). Level 5: the process is read from the verbs of the story.
"""
import re

from checkers._chim_acqua import Rational, common, one_right, option_text, quantity, quantity_options, text

CASE_RANGES = {
    1: {"idrogeno": (0.40, 0.60), "ossigeno": (0.40, 0.60)},
    2: {"da idrogeno": (0.40, 0.60), "da ossigeno": (0.40, 0.60)},
    4: {"forma": (0.40, 0.60), "non forma": (0.40, 0.60)},
    5: {"rotti": (0.48, 0.66), "formati": (0.20, 0.37), "covalenti": (0.08, 0.21)},
}

SHARE = {"idrogeno": Rational(202, 1802), "ossigeno": Rational(1600, 1802)}
MASSES = r" Masse atomiche: \$\\mathrm\{H\} = 1\{,\}01\$, \$\\mathrm\{O\} = 16\{,\}00\$\."


def mass_ok(s, errs, lo, hi):
    if not re.fullmatch(r"[1-9]\d*", s) or s.endswith("0"):
        errs.append(f"mass {s} is not a whole number without a final zero")
    v = int(s)
    if not lo <= v <= hi:
        errs.append(f"mass {s} outside {lo}-{hi}")
    return Rational(v)


def level1(sample, errs):
    m = re.fullmatch(r"Quanti grammi di (idrogeno|ossigeno) ci sono in " + quantity("g") + r" d'acqua\?" + MASSES, text(sample))
    if not m:
        errs.append("level 1 text not recognised")
        return None
    w = mass_ok(m.group(2), errs, 101, 999)
    quantity_options(sample, errs, w * SHARE[m.group(1)], 3, "g")
    return m.group(1)


def level2(sample, errs):
    m = re.fullmatch(r"Quanti grammi d'acqua contengono " + quantity("g") + r" di (idrogeno|ossigeno)\?" + MASSES, text(sample))
    if not m:
        errs.append("level 2 text not recognised")
        return None
    el = m.group(2)
    x = mass_ok(m.group(1), errs, 11, 99) if el == "idrogeno" else mass_ok(m.group(1), errs, 101, 999)
    quantity_options(sample, errs, x / SHARE[el], 2 if el == "idrogeno" else 3, "g")
    return "da " + el


RIGHT = {
    "Quanto vale l'angolo tra i due legami O-H della molecola d'acqua?": "$104{,}5^\\circ$",
    "Che forma ha la molecola d'acqua?": "piegata, a V",
    "Quale parte della molecola d'acqua ha la carica parziale negativa?": "l'ossigeno",
    "Quante coppie solitarie ha l'ossigeno nella molecola d'acqua?": "due",
    "Perché la molecola d'acqua è polare?": "è piegata, e l'ossigeno attira gli elettroni dei legami",
    "Perché l'anidride carbonica, $\\mathrm{CO_2}$, è apolare anche se l'ossigeno attira gli elettroni?": "è lineare: gli effetti dei due ossigeni si annullano",
    "Quanto vale la carica totale di una molecola d'acqua?": "zero: le cariche parziali si compensano",
    "Un filo sottile d'acqua si piega verso un palloncino strofinato sui capelli. Che cosa lo spiega?": "le molecole d'acqua sono polari",
}


def level3(sample, errs):
    s = text(sample)
    if s not in RIGHT:
        errs.append(f"level 3 question not recognised: {s!r}")
        return None
    one_right(sample, errs, lambda o: option_text(o["latex"]) == RIGHT[s])
    return f"q{list(RIGHT).index(s) + 1}"


NAMES = {
    "acqua": "H2O", "ammoniaca": "NH3", "fluoruro di idrogeno": "HF", "metanolo": "CH3OH", "etanolo": "C2H5OH",
    "metano": "CH4", "solfuro di idrogeno": "H2S", "anidride carbonica": "CO2", "ossigeno": "O2", "azoto": "N2",
    "idrogeno": "H2", "etano": "C2H6",
}


def h_bonds(formula):
    atoms = set(re.findall(r"[A-Z][a-z]?", formula))
    return "H" in atoms and bool(atoms & {"O", "N", "F"})


def level4(sample, errs):
    s = text(sample)
    if s == "Quale di queste sostanze forma legami a idrogeno tra le sue molecole?":
        want = True
    elif s == "Tre di queste sostanze formano legami a idrogeno tra le loro molecole. Quale non ne forma?":
        want = False
    else:
        errs.append("level 4 text not recognised")
        return None

    def formula(o):
        mm = re.fullmatch(r"([a-z ]+), \$\\mathrm\{([A-Za-z0-9_]+)\}\$", option_text(o["latex"]))
        if not mm:
            raise ValueError("not 'name, formula'")
        f = mm.group(2).replace("_", "")
        if NAMES.get(mm.group(1)) != f:
            raise ValueError(f"name {mm.group(1)!r} does not match {f}")
        return f

    one_right(sample, errs, lambda o: h_bonds(formula(o)) == want)
    return "forma" if want else "non forma"


LABELS = {
    "rotti": "si rompono legami a idrogeno tra le molecole, che restano intere",
    "formati": "si formano legami a idrogeno tra le molecole, che restano intere",
    "covalenti": "si rompono i legami covalenti O-H: le molecole si spezzano",
    "nessuno": "non si rompe e non si forma nessun legame",
}


def level5(sample, errs):
    m = re.fullmatch(r"(.*) Che cosa succede ai legami\?", text(sample))
    if not m:
        errs.append("level 5 text not recognised")
        return None
    story = m.group(1)
    kinds = []
    if re.search(r"fonde|bolle|evapora|diventa vapore", story):
        kinds.append("rotti")
    if re.search(r"si condensa|diventa ghiaccio", story):
        kinds.append("formati")
    if "si decompone" in story:
        kinds.append("covalenti")
    if len(kinds) != 1:
        errs.append(f"story not classified: {story!r}")
        return None
    for o in sample["answer"]["options"]:
        if option_text(o["latex"]) not in LABELS.values():
            errs.append(f"option not one of the four outcomes: {o['latex']!r}")
    one_right(sample, errs, lambda o: option_text(o["latex"]) == LABELS[kinds[0]])
    return kinds[0]


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
