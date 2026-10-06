"""Checker for chim-elementi-composti (specs/exercises/chim-elementi-composti.md), written from the spec and the lesson
22-chim-elementi-composti.md, not from the generator.

- level 1: its own table of names and symbols (the lesson's table plus cobalt and manganese, and the real symbols of
  the element names used as distractors); the right option is the symbol of the element named, or the name of the
  symbol shown; every wrong option must be wrong (a wrong symbol that is a real element must not be that element's);
- level 2: every option is classified with its own lists of elements and compounds; exactly one has the kind asked;
- level 3: the description is classified from its words (does not decompose: element; decomposes, or splits by
  electricity: compound; a uniform material separated by evaporation or distillation, or with a composition that
  changes: homogeneous mixture; grains, filtration, layers: heterogeneous mixture), and exactly one rule must match;
- level 4: the formula's distinct symbols are counted from the capital letters, independently of the generator.
"""
import re

from checkers._chim_leggi_ponderali import check_choice, common, option_text, prose

CASE_RANGES = {
    1: {"simbolo": (0.40, 0.60), "nome": (0.40, 0.60)},
    2: {"composto": (0.40, 0.60), "elemento": (0.40, 0.60)},
    3: {k: (0.18, 0.32) for k in ["Un elemento", "Un composto", "Un miscuglio omogeneo", "Un miscuglio eterogeneo"]},
}

SYMBOL = {
    "idrogeno": "H", "elio": "He", "carbonio": "C", "azoto": "N", "ossigeno": "O", "sodio": "Na", "magnesio": "Mg",
    "alluminio": "Al", "silicio": "Si", "fosforo": "P", "zolfo": "S", "cloro": "Cl", "potassio": "K", "calcio": "Ca",
    "ferro": "Fe", "rame": "Cu", "zinco": "Zn", "argento": "Ag", "oro": "Au", "mercurio": "Hg", "piombo": "Pb",
    "iodio": "I", "cobalto": "Co", "manganese": "Mn",
}
# names that appear only as wrong answers, with their real symbols
OTHER = {
    "neon": "Ne", "nichel": "Ni", "kripton": "Kr", "fluoro": "F", "francio": "Fr", "curio": "Cm", "argon": "Ar",
    "polonio": "Po", "platino": "Pt", "stagno": "Sn", "molibdeno": "Mo", "zirconio": "Zr", "indio": "In",
    "iridio": "Ir", "afnio": "Hf", "osmio": "Os",
}
ALL = {**SYMBOL, **OTHER}

ELEMENTS = {"ossigeno", "azoto", "ferro", "rame", "oro", "argento", "zolfo", "mercurio", "elio", "alluminio", "idrogeno",
            "carbonio", "magnesio", "iodio", "piombo", "zinco", "sodio", "cloro"}
COMPOUNDS = {"acqua", "cloruro di sodio", "diossido di carbonio", "ammoniaca", "metano", "glucosio", "carbonato di calcio",
             "ossido di magnesio", "solfuro di ferro", "ossido di mercurio", "bicarbonato di sodio", "monossido di carbonio"}

KINDS = ["Un elemento", "Un composto", "Un miscuglio omogeneo", "Un miscuglio eterogeneo"]
RULES = [
    ("Un elemento", re.compile(r"(la|lo) scompon(e|gono) in sostanze più semplici|non si riesce a scomporre")),
    ("Un composto", re.compile(r"si scompone in (un|due)|si decompone in")),
    ("Un miscuglio omogeneo", re.compile(r"(uniforme|limpido).*(cambiano|diverse)")),
    ("Un miscuglio eterogeneo", re.compile(r"granelli di due colori|filtrato|due strati")),
]


def level1(sample, errs):
    s = prose(sample["problem"])
    opts = sample["answer"]["options"]
    if m := re.fullmatch(r"Qual è il simbolo chimico (?:del|dello|dell') ?([a-z]+)\?", s):
        name = m.group(1)
        if name not in SYMBOL:
            errs.append(f"unknown element {name!r}")
            return None
        for o in opts:
            if not re.fullmatch(r"\\mathrm\{[A-Z][a-z]?\}", o["latex"]):
                errs.append(f"option {o['latex']!r} is not a symbol")
        check_choice(sample["answer"], lambda o: o["latex"] == "\\mathrm{" + SYMBOL[name] + "}", errs)
        return "simbolo"
    if m := re.fullmatch(r"Quale elemento ha il simbolo \$\\mathrm\{([A-Z][a-z]?)\}\$\?", s):
        sym = m.group(1)
        names = [n for n, x in SYMBOL.items() if x == sym]
        if len(names) != 1:
            errs.append(f"unknown symbol {sym!r}")
            return None
        for o in opts:
            if option_text(o["latex"]) not in ALL:
                errs.append(f"unknown element name {o['latex']!r}")
        check_choice(sample["answer"], lambda o: ALL.get(option_text(o["latex"])) == sym, errs)
        return "nome"
    errs.append(f"level 1 text not recognised: {s!r}")
    return None


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Quale di queste sostanze è un (composto|elemento)\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    for o in sample["answer"]["options"]:
        if option_text(o["latex"]) not in ELEMENTS | COMPOUNDS:
            errs.append(f"unknown substance {o['latex']!r}")
    target = COMPOUNDS if m.group(1) == "composto" else ELEMENTS
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) in target, errs)
    return m.group(1)


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(.*) Che cos'è\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    hits = [k for k, rule in RULES if rule.search(m.group(1))]
    if len(hits) != 1:
        errs.append(f"kinds found {hits} in {m.group(1)!r}")
        return None
    if sorted(option_text(o["latex"]) for o in sample["answer"]["options"]) != sorted(KINDS):
        errs.append("the options are not the four kinds")
    check_choice(sample["answer"], lambda o: option_text(o["latex"]) == hits[0], errs)
    return hits[0]


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Quanti elementi diversi ci sono nella sostanza \$\\mathrm\{([A-Za-z0-9_{}]+)\}\$\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    body = m.group(1)
    symbols = re.findall(r"[A-Z][a-z]?", body)
    for x in symbols:
        if x not in SYMBOL.values():
            errs.append(f"symbol {x!r} not in the lesson")
    n = len(set(symbols))
    for o in sample["answer"]["options"]:
        if not re.fullmatch(r"[1-9]\d?", o["latex"]):
            errs.append(f"option {o['latex']!r} is not a whole number")
    check_choice(sample["answer"], lambda o: o["latex"] == str(n), errs)
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4}


def values_match(sample, errs):
    """Each option's value is what it shows: the symbol, the words, the number."""
    for o in sample["answer"]["options"]:
        m = re.fullmatch(r"\\mathrm\{([A-Za-z]+)\}", o["latex"])
        shown = m.group(1) if m else o["latex"] if re.fullmatch(r"\d+", o["latex"]) else option_text(o["latex"])
        if o["values"] != [shown]:
            errs.append(f"option {o['latex']!r} has value {o['values']}")


def check(sample):
    errs = []
    common(sample, errs)
    try:
        values_match(sample, errs)
    except Exception as e:  # noqa: BLE001
        errs.append(f"checker error: {e!r}")
    fn = LEVELS.get(sample["level"])
    if not fn:
        return [f"unknown level {sample['level']}"], None
    try:
        kind = fn(sample, errs)
    except Exception as e:  # noqa: BLE001
        errs.append(f"checker error: {e!r}")
        kind = None
    return errs, kind
