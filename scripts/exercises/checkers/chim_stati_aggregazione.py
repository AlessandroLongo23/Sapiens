"""Checker for chim-stati-aggregazione (specs/exercises/chim-stati-aggregazione.md), written from the spec and the lesson
14-chim-stati-aggregazione.md, not from the generator.

- Level 1: the sample named belongs to the state it is said to be in; the properties are judged with the lesson's
  table (solid: own shape and volume, rigid, almost incompressible; liquid: own volume, shape of the container, flat
  free surface, fluid, almost incompressible; gas: fills the container, takes its shape, fluid, compressible).
- Levels 2 and 3: below the melting point solid, between melting and boiling liquid, above boiling gas; the
  temperature is at least 5 degrees from both; in level 3 t = T - 273.
- Level 4: the table's values are those of the checker's own table, exactly one substance is in the state asked.
- Level 5: V = m / d (ice 0,917 g/mL, three figures; steam 0,60 g/L, two figures).
"""
import re

from sympy import Rational

from checkers._chim_stati_soluzioni import right_qty, right_text, rounded, setup, texts, num

CASE_RANGES = {
    1: {"solido": (0.25, 0.42), "liquido": (0.25, 0.42), "aeriforme": (0.25, 0.42)},
    2: {"solido": (0.25, 0.42), "liquido": (0.25, 0.42), "aeriforme": (0.25, 0.42)},
    3: {"stesso": (0.25, 0.50), "trappola": (0.50, 0.75)},
    4: {"solido": (0.20, 0.45), "liquido": (0.20, 0.45), "aeriforme": (0.20, 0.45)},
    5: {"ghiaccio": (0.40, 0.60), "vapore": (0.40, 0.60)},
}

# Melting and boiling points at 1 atm (°C), from the lesson's table and the notes.
TABLE = {
    "azoto": (-210, -196), "ossigeno": (-218, -183), "metano": (-182, -162), "etanolo": (-114, 78),
    "acetone": (-95, 56), "ammoniaca": (-78, -33), "mercurio": (-39, 357), "bromo": (-7, 59), "acqua": (0, 100),
    "iodio": (114, 184), "piombo": (327, 1749), "cloruro di sodio": (801, 1465), "rame": (1085, 2562), "ferro": (1538, 2862),
}

SAMPLES = {
    "solido": ["un cubetto di ghiaccio", "una moneta di rame", "un chiodo di ferro", "un cristallo di sale", "un sasso"],
    "liquido": ["l'acqua di un bicchiere", "l'olio di una bottiglia", "l'alcol di un flacone", "il mercurio di un termometro", "il latte di una tazza"],
    "aeriforme": ["l'aria di un pallone", "l'elio di un palloncino", "l'ossigeno di una bombola", "l'aria di una siringa tappata"],
}

HAS = {
    "solido": {"Ha forma propria", "Ha volume proprio", "È quasi incomprimibile", "È rigido"},
    "liquido": {"Ha volume proprio", "Prende la forma del recipiente", "È quasi incomprimibile", "Ha una superficie libera orizzontale", "Scorre, è un fluido"},
    "aeriforme": {"Prende la forma del recipiente", "Occupa tutto il recipiente", "Si comprime facilmente", "Scorre, è un fluido"},
}
ALL = set().union(*HAS.values())

DEG = r"\$(-?\d+)\\,\^\\circ\\text\{C\}\$"
ARTICLE = r"(?:l'|il |lo )"


def state_at(tf, teb, t):
    return "solido" if t < tf else "liquido" if t < teb else "aeriforme"


def level1(sample, prose, errs):
    m = re.fullmatch(r"(.+) è un (solido|liquido|aeriforme)\. Quale di queste proprietà (NON )?ha\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    what, state, neg = m.group(1), m.group(2), bool(m.group(3))
    if what[0].lower() + what[1:] not in SAMPLES[state]:
        errs.append(f"{what!r} is not a sample of a {state}")
    ts = texts(sample)
    for x in ts:
        if x not in ALL:
            errs.append(f"unknown property {x!r}")
            return state
    right = [x for x in ts if (x in HAS[state]) != neg]
    if len(right) != 1:
        errs.append(f"{len(right)} right options: {right}")
        return state
    right_text(sample, errs, right[0])
    return state


def temps(prose, errs):
    m = re.match(r"Alla pressione atmosferica " + ARTICLE + r"([a-z ]+) fonde a " + DEG + r" e bolle a " + DEG + r"\. ", prose)
    if not m:
        errs.append(f"text not recognised: {prose!r}")
        return None
    name, tf, teb = m.group(1), int(m.group(2)), int(m.group(3))
    if TABLE.get(name) != (tf, teb):
        errs.append(f"{name}: {tf}, {teb} not in the table")
    return name, tf, teb, prose[m.end():]


def level23(sample, prose, errs, kelvin):
    got = temps(prose, errs)
    if not got:
        return None
    name, tf, teb, rest = got
    if kelvin:
        m = re.fullmatch(r"In che stato si trova alla temperatura di \$(\d+)\\,\\text\{K\}\$\?", rest)
        t = int(m.group(1)) - 273 if m else None
    else:
        m = re.fullmatch(r"In che stato si trova a " + DEG + r"\?", rest)
        t = int(m.group(1)) if m else None
    if t is None:
        errs.append(f"question not recognised: {rest!r}")
        return None
    if min(abs(t - tf), abs(t - teb)) < 5:
        errs.append(f"{t} °C is within 5 degrees of {tf} or {teb}")
    if t < -268:
        errs.append(f"{t} °C below -268")
    state = state_at(tf, teb, t)
    if sorted(texts(sample)) != sorted(["Solido", "Liquido", "Aeriforme", "Solido e liquido insieme"]):
        errs.append(f"options {texts(sample)}")
    right_text(sample, errs, state.capitalize())
    if kelvin:
        return "stesso" if state_at(tf, teb, t + 273) == state else "trappola"
    return state


def level4(sample, prose, errs, extra):
    m = re.fullmatch(r"La tabella dà le temperature di fusione e di ebollizione di quattro sostanze alla pressione atmosferica\. Quale è allo stato (solido|liquido|aeriforme) a " + DEG + r"\?", prose)
    if not m or len(extra) != 1:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    state, t = m.group(1), int(m.group(2))
    rows = re.findall(r"\\text\{([a-z ]+)\} & (-?\d+) & (-?\d+)", extra[0])
    if len(rows) != 4:
        errs.append(f"table has {len(rows)} rows")
        return state
    inside = []
    for name, a, b in rows:
        tf, teb = int(a), int(b)
        if TABLE.get(name) != (tf, teb):
            errs.append(f"{name}: {tf}, {teb} not in the table")
        if min(abs(t - tf), abs(t - teb)) < 3:
            errs.append(f"{name} too close to a change of state at {t}")
        if state_at(tf, teb, t) == state:
            inside.append(name)
    if len(inside) != 1:
        errs.append(f"{len(inside)} substances {state} at {t}: {inside}")
        return state
    if sorted(x.lower() for x in texts(sample)) != sorted(r[0] for r in rows):
        errs.append("options are not the four substances")
    right_text(sample, errs, inside[0].capitalize())
    return state


def level5(sample, prose, errs):
    m = re.fullmatch(r"Una bottiglia contiene \$(\d+)\\,\\text\{g\}\$ d'acqua\. La densità del ghiaccio è \$0\{,\}917\\,\\text\{g/mL\}\$\. Che volume occupa l'acqua quando è tutta ghiacciata\?", prose)
    if m:
        mass = int(m.group(1))
        if not 120 <= mass <= 900:
            errs.append(f"mass {mass} outside 120-900 g")
        want = rounded(Rational(mass) / Rational("0.917"), 3)
        if want is None:
            errs.append("too close to a rounding boundary")
        else:
            right_qty(sample, errs, want, "mL")
        return "ghiaccio"
    m = re.fullmatch(r"Si fanno bollire \$(\d\{,\}\d)\\,\\text\{g\}\$ d'acqua\. A \$100\\,\^\\circ\\text\{C\}\$ e alla pressione atmosferica la densità del vapore acqueo è \$0\{,\}60\\,\\text\{g/L\}\$\. Che volume occupa il vapore\?", prose)
    if m:
        mass = num(m.group(1))
        if not Rational(11, 10) <= mass <= Rational(99, 10) or m.group(1).endswith("{,}0"):
            errs.append(f"mass {m.group(1)} outside 1,1-9,9 g")
        want = rounded(mass / Rational("0.60"), 2)
        if want is None:
            errs.append("too close to a rounding boundary")
        else:
            right_qty(sample, errs, want, "L")
        return "vapore"
    errs.append(f"level 5 text not recognised: {prose!r}")
    return None


def check(sample):
    errs, prose, extra = setup(sample)
    lvl = sample["level"]
    if lvl == 1:
        kind = level1(sample, prose, errs)
    elif lvl in (2, 3):
        kind = level23(sample, prose, errs, lvl == 3)
    elif lvl == 4:
        kind = level4(sample, prose, errs, extra)
    elif lvl == 5:
        kind = level5(sample, prose, errs)
    else:
        errs.append(f"unknown level {lvl}")
        kind = None
    return errs, kind
