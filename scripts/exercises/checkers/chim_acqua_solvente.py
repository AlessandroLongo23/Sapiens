"""Checker for chim-acqua-solvente (specs/exercises/chim-acqua-solvente.md), written from the spec and the lesson
46-chim-acqua-solvente.md, not from the generator.

Level 1: soluble ionic compounds give hydrated ions, sugar and ethanol stay whole molecules, calcium carbonate,
silver chloride and apolar substances do not dissolve. Level 2: the ions are read back from each option (coefficient,
symbol, charge) and compared with the salt's own ions from this file's table. Level 3: moles of ions are the moles of
salt times the ions per formula unit (two figures). Levels 4-5: the solubility of the lesson's table, scaled to the
water of the problem (three figures). Level 6: °f = mg per litre / 10, soft below 15, medium 15-30, hard above 30.
"""
import re

from checkers._chim_acqua import Rational, common, exact_dec, one_right, option_text, quantity, quantity_options, rounded, text

CASE_RANGES = {
    1: {"ioni": (0.26, 0.41), "molecole": (0.26, 0.41), "no": (0.26, 0.41)},
    3: {"catione": (0.24, 0.45), "anione": (0.24, 0.45), "tutti": (0.24, 0.45)},
    4: {"massima": (0.40, 0.60), "fondo": (0.40, 0.60)},
    6: {"dolce": (0.10, 0.45), "media": (0.25, 0.60), "dura": (0.15, 0.50)},
}

IONIC = ["cloruro di sodio", "cloruro di potassio", "nitrato di potassio", "cloruro di calcio", "solfato di magnesio"]
MOLECULAR = ["saccarosio", "glucosio", "etanolo"]
INSOLUBLE = ["carbonato di calcio", "cloruro d'argento", "olio", "benzina", "cera"]
FORMULA = {
    "cloruro di sodio": "NaCl", "cloruro di potassio": "KCl", "nitrato di potassio": "KNO_3", "cloruro di calcio": "CaCl_2",
    "solfato di magnesio": "MgSO_4", "saccarosio": "C_{12}H_{22}O_{11}", "glucosio": "C_6H_{12}O_6", "etanolo": "C_2H_5OH",
    "carbonato di calcio": "CaCO_3", "cloruro d'argento": "AgCl",
}
LABEL = {
    "ioni": "si scioglie e si separa in ioni idratati",
    "molecole": "si scioglie e le molecole restano intere",
    "no": "non si scioglie",
    "atomi": "si scioglie e si separa in atomi",
}

# name: (formula, cation, cation charge, cations per unit, anion, anion charge, anions per unit)
SALTS = {
    "cloruro di calcio": ("CaCl_2", "Ca", 2, 1, "Cl", 1, 2),
    "cloruro di magnesio": ("MgCl_2", "Mg", 2, 1, "Cl", 1, 2),
    "cloruro di alluminio": ("AlCl_3", "Al", 3, 1, "Cl", 1, 3),
    "solfato di sodio": ("Na_2SO_4", "Na", 1, 2, "SO_4", 2, 1),
    "solfato di potassio": ("K_2SO_4", "K", 1, 2, "SO_4", 2, 1),
    "solfato di magnesio": ("MgSO_4", "Mg", 2, 1, "SO_4", 2, 1),
    "nitrato di calcio": ("Ca(NO_3)_2", "Ca", 2, 1, "NO_3", 1, 2),
    "nitrato di magnesio": ("Mg(NO_3)_2", "Mg", 2, 1, "NO_3", 1, 2),
    "carbonato di sodio": ("Na_2CO_3", "Na", 1, 2, "CO_3", 2, 1),
    "carbonato di potassio": ("K_2CO_3", "K", 1, 2, "CO_3", 2, 1),
    "solfato di alluminio": ("Al_2(SO_4)_3", "Al", 3, 2, "SO_4", 2, 3),
    "fosfato di sodio": ("Na_3PO_4", "Na", 1, 3, "PO_4", 3, 1),
    "fosfato di potassio": ("K_3PO_4", "K", 1, 3, "PO_4", 3, 1),
    "nitrato di potassio": ("KNO_3", "K", 1, 1, "NO_3", 1, 1),
}

SOLUBILITY = {
    "cloruro di sodio": {0: "35{,}7", 20: "35{,}9", 40: "36{,}4", 60: "37{,}1", 80: "38{,}0", 100: "39{,}2"},
    "cloruro di potassio": {0: "28{,}0", 20: "34{,}2", 40: "40{,}1", 60: "45{,}8", 80: "51{,}3", 100: "56{,}3"},
    "nitrato di potassio": {0: "13{,}3", 20: "31{,}6", 40: "63{,}9", 60: "110", 80: "169", 100: "246"},
    "saccarosio": {0: "179", 20: "204", 40: "238", 60: "287", 80: "362", 100: "487"},
}


def level1(sample, errs):
    m = re.fullmatch(r"Che cosa succede se si mette (.+) in acqua e si mescola\?", text(sample))
    if not m:
        errs.append("level 1 text not recognised")
        return None
    what = m.group(1)
    kinds = [k for k, names in (("ioni", IONIC), ("molecole", MOLECULAR), ("no", INSOLUBLE)) if any(n in what for n in names)]
    f = re.search(r"\$\\mathrm\{(.+?)\}\$", what)
    named = [n for n in FORMULA if n in what]
    if f and (len(named) != 1 or FORMULA[named[0]] != f.group(1)):
        errs.append(f"formula {f.group(1)} does not match {named}")
    if not f and named:
        errs.append("formula missing")
    if len(kinds) != 1:
        errs.append(f"substance not classified: {what!r}")
        return None
    for o in sample["answer"]["options"]:
        if option_text(o["latex"]) not in LABEL.values():
            errs.append(f"option is not a behaviour: {o['latex']!r}")
    one_right(sample, errs, lambda o: option_text(o["latex"]) == LABEL[kinds[0]])
    return kinds[0]


TERM = re.compile(r"(?:(\d+)\\,)?\\mathrm\{([^{}^]+?)(?:\^\{([^}]*)\})?\}\(aq\)")


def ions_of(latex):
    """[(coefficient, species, charge string)] of an option 'a + b'."""
    out = []
    for part in latex.split(" + "):
        m = TERM.fullmatch(part.strip())
        if not m:
            raise ValueError(f"term not recognised: {part!r}")
        out.append((int(m.group(1) or 1), m.group(2), m.group(3) or ""))
    return out


def charge(n, sign):
    return sign if n == 1 else f"{n}{sign}"


def level2(sample, errs):
    m = re.fullmatch(r"Il (.+?), \$\\mathrm\{(.+?)\}\$, si scioglie in acqua\. Quali ioni si formano\?", text(sample))
    if not m or m.group(1) not in SALTS:
        errs.append("level 2 text not recognised")
        return None
    f, cat, a, x, an, b, y = SALTS[m.group(1)]
    if m.group(2) != f:
        errs.append(f"formula {m.group(2)} is not {f}")
    want = [(x, cat, charge(a, "+")), (y, an, charge(b, "-"))]
    one_right(sample, errs, lambda o: ions_of(o["latex"]) == want)
    return "con coefficienti" if x > 1 or y > 1 else "uno a uno"


def level3(sample, errs):
    m = re.fullmatch(r"Si sciolgono in acqua " + quantity("mol") + r" di (.+?), \$\\mathrm\{(.+?)\}\$\. Quante moli di (.+?) si formano\?", text(sample))
    if not m or m.group(2) not in SALTS:
        errs.append("level 3 text not recognised")
        return None
    f, cat, a, x, an, b, y = SALTS[m.group(2)]
    if m.group(3) != f:
        errs.append("formula")
    n = m.group(1)
    if not re.fullmatch(r"0\{,\}[1-9][1-9]", n):
        errs.append(f"moles {n} not 0,11-0,99 with two figures")
    asked = m.group(4)
    if asked == "ioni in tutto":
        k, kind = x + y, "tutti"
    elif asked == f"ioni $\\mathrm{{{cat}^{{{charge(a, '+')}}}}}$":
        k, kind = x, "catione"
    elif asked == f"ioni $\\mathrm{{{an}^{{{charge(b, '-')}}}}}$":
        k, kind = y, "anione"
    else:
        errs.append(f"asked ions not recognised: {asked!r}")
        return None
    if x + y <= 2:
        errs.append("salt with one ion of each kind")
    quantity_options(sample, errs, exact_dec(n) * k, 2, "mol")
    return kind


def water(s, errs):
    if not re.fullmatch(r"[1-4]\d[1-9]", s):
        errs.append(f"water mass {s} not 101-499 g without a final zero")
    return Rational(int(s))


def solubility(name, T, written, errs):
    if name not in SOLUBILITY or T not in SOLUBILITY[name]:
        errs.append(f"no solubility for {name} at {T}")
        return None
    if SOLUBILITY[name][T] != written:
        errs.append(f"solubility of {name} at {T} is {SOLUBILITY[name][T]}, not {written}")
    return exact_dec(SOLUBILITY[name][T])


def level4(sample, errs):
    s = text(sample)
    head = r"La solubilità del (.+?) a " + quantity("C") + " è di " + quantity("g") + r" in \$100\\,\\text\{g\}\$ d'acqua\. "
    if m := re.fullmatch(head + r"Quanti grammi di (.+?) si sciolgono al massimo in " + quantity("g") + " d'acqua a " + quantity("C") + r"\?", s):
        name, T = m.group(1), int(m.group(2))
        if m.group(4) != name or int(m.group(6)) != T:
            errs.append("substance or temperature changes in the text")
        sol = solubility(name, T, m.group(3), errs)
        quantity_options(sample, errs, sol * water(m.group(5), errs) / 100, 3, "g")
        return "massima"
    if m := re.fullmatch(head + r"In " + quantity("g") + r" d'acqua a " + quantity("C") + r" si mettono " + quantity("g") + r" di (.+?) e si mescola a lungo\. Quanti grammi restano sul fondo\?", s):
        name, T = m.group(1), int(m.group(2))
        if m.group(7) != name or int(m.group(5)) != T:
            errs.append("substance or temperature changes in the text")
        sol = solubility(name, T, m.group(3), errs)
        dissolved = sol * water(m.group(4), errs) / 100
        added = Rational(int(m.group(6)))
        if added - dissolved < 1:
            errs.append("nothing (or almost nothing) on the bottom")
        quantity_options(sample, errs, added - dissolved, 3, "g")
        return "fondo"
    errs.append("level 4 text not recognised")
    return None


def level5(sample, errs):
    m = re.fullmatch(
        r"In " + quantity("g") + r" d'acqua a " + quantity("C") + r" si scioglie tutto il (.+?) possibile, poi la soluzione si raffredda a " + quantity("C")
        + r"\. Quanti grammi di (.+?) cristallizzano\? Solubilità in \$100\\,\\text\{g\}\$ d'acqua: " + quantity("g") + " a " + quantity("C") + ", " + quantity("g") + " a " + quantity("C") + r"\.",
        text(sample),
    )
    if not m:
        errs.append("level 5 text not recognised")
        return None
    name, hot, cold = m.group(3), int(m.group(2)), int(m.group(4))
    if m.group(5) != name or int(m.group(7)) != hot or int(m.group(9)) != cold or cold >= hot:
        errs.append("temperatures or substance")
    s1 = solubility(name, hot, m.group(6), errs)
    s2 = solubility(name, cold, m.group(8), errs)
    quantity_options(sample, errs, (s1 - s2) * water(m.group(1), errs) / 100, 3, "g")
    return name


VOLUMES = {r"250\,\text{mL}": Rational(1, 4), r"500\,\text{mL}": Rational(1, 2), r"1{,}5\,\text{L}": Rational(3, 2), r"2{,}0\,\text{L}": Rational(2)}


def hardness_class(f):
    return "dolce" if f < 15 else "media" if f <= 30 else "dura"


def level6(sample, errs):
    m = re.fullmatch(
        r"L'analisi di un campione di \$(.+?)\$ d'acqua dice che contiene l'equivalente di " + quantity("mg") + r" di carbonato di calcio\. Quanti gradi francesi è la sua durezza, e com'è l'acqua\? Un grado francese sono \$10\\,\\text\{mg\}\$ di carbonato di calcio per litro\.",
        text(sample),
    )
    if not m or m.group(1) not in VOLUMES:
        errs.append("level 6 text not recognised")
        return None
    f = exact_dec(m.group(2)) / VOLUMES[m.group(1)] / 10
    if f.q != 1 or not 5 <= f <= 45 or abs(f - 15) <= 1 or abs(f - 30) <= 1:
        errs.append(f"hardness {f} not a whole number away from the limits")
    cls = hardness_class(f)
    want = f"${rounded(f, 2)}\\,^\\circ\\text{{f}}$, {cls}"
    for o in sample["answer"]["options"]:
        if not re.fullmatch(r"\$[^$]+\\,\^\\circ\\text\{f\}\$, (dolce|media|dura)", option_text(o["latex"])):
            errs.append(f"option not 'X °f, class': {o['latex']!r}")
    one_right(sample, errs, lambda o: option_text(o["latex"]) == want)
    return cls


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


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
