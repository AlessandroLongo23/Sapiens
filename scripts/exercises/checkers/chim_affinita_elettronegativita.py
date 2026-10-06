"""Checker for chim-affinita-elettronegativita (specs/exercises/chim-affinita-elettronegativita.md), written from the
spec and the lesson 60-chim-affinita-elettronegativita.md, not from the generator.

The facts of the lesson (answer key below); the electron affinities of the lesson's table (who releases most, who
releases none); the electronegativity rising along a period and falling down a group, checked on the Pauling values
of the site's table; the partial negative charge on the more electronegative atom; the difference as the larger value
minus the smaller; of four bonds, the one with the largest difference.
"""
import re

from sympy import Rational

from checkers._chim3_d import AFFINITY, BY_NAME, BY_SYMBOL, art, cap, check_number, dec, monotonic, row_of, sym_of, the_choice
from checkers._fis_grandezze import check_choice, option_text, prose_and_extra

CASE_RANGES = {
    2: {"nessuna": (0.32, 0.48), "massima": (0.37, 0.53), "cloro-fluoro": (0.09, 0.21)},
    3: {"periodo": (0.35, 0.65), "gruppo": (0.35, 0.65)},
}

KEY = {
    "Che cosa misura l'affinità elettronica?": "L'energia liberata da un atomo che acquista un elettrone",
    "Che cosa misura l'elettronegatività?": "La tendenza ad attirare gli elettroni di un legame",
    "In che unità si misura l'affinità elettronica?": "In kJ/mol",
    "In che unità si misura l'elettronegatività?": "In nessuna: è un numero puro",
    "Quale processo descrive l'affinità elettronica?": r"\mathrm{X} + e^- \to \mathrm{X^-}",
    "Qual è la scala di elettronegatività più usata?": "La scala di Pauling",
    "Qual è l'elemento più elettronegativo?": "Il fluoro",
    "Quale elemento ha l'affinità elettronica più alta?": "Il cloro",
    "Quale gruppo della tavola ha le affinità elettroniche più alte?": "Il gruppo 17, gli alogeni",
    "Perché un gas nobile non libera energia acquistando un elettrone?": "Ha il livello esterno pieno",
    "Come cambia l'elettronegatività lungo un periodo, da sinistra a destra?": "Aumenta",
    "Come cambia l'elettronegatività scendendo lungo un gruppo?": "Diminuisce",
    "In quale zona della tavola stanno gli elementi più elettronegativi?": "In alto a destra",
    "Come sono energia di ionizzazione e affinità elettronica nei metalli?": "Tutte e due basse",
    r"In un legame tra due atomi diversi, quale atomo prende la carica parziale $\delta^-$?": "Il più elettronegativo",
    r"Come si calcola la differenza di elettronegatività $\Delta\chi$?": "Il valore maggiore meno il minore",
}


def shown(o):
    """What an option says: its text, or its formula when it is not plain text."""
    try:
        return option_text(o["latex"])
    except ValueError:
        return o["latex"]


def chi(sym):
    x = BY_SYMBOL[sym]["electronegativity"]
    if x is None:
        raise ValueError(f"{sym} has no Pauling value")
    return Rational(str(x))


def chi_tex(sym):
    return f"{float(chi(sym)):.2f}".replace(".", "{,}")


def level1(sample, ch, prose, errs):
    if prose not in KEY:
        errs.append(f"level 1 question not in the key: {prose!r}")
        return None
    check_choice(ch, lambda o: shown(o) == KEY[prose], errs)
    return "fatto"


def level2(sample, ch, prose, errs):
    syms = [sym_of(o["latex"]) for o in ch["options"]]
    if any(s not in AFFINITY for s in syms) or len(set(syms)) != 4:
        errs.append("an option is not in the lesson's table, or is repeated")
        return None
    if prose == "Quale di questi elementi non libera energia quando un suo atomo acquista un elettrone?":
        check_choice(ch, lambda o: AFFINITY[sym_of(o["latex"])] is None, errs)
        return "nessuna"
    if prose != "Quale di questi elementi libera più energia quando un suo atomo acquista un elettrone?":
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    vals = sorted(((AFFINITY[s] or 0), s) for s in syms)
    both = "F" in syms and "Cl" in syms
    # one element clearly ahead, unless the question is the lesson's warning: chlorine against fluorine
    if vals[-1][0] - vals[-2][0] < (20 if both else 150):
        errs.append("no clear maximum")
    check_choice(ch, lambda o: sym_of(o["latex"]) == vals[-1][1], errs)
    return "cloro-fluoro" if both else "massima"


def level3(sample, ch, prose, errs):
    m = re.fullmatch(r"Quale di questi elementi del (.+) è il (più|meno) elettronegativo\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    syms = [sym_of(o["latex"]) for o in ch["options"]]
    got = row_of(m.group(1), syms, lambda e: None if e["electronegativity"] is None else Rational(str(e["electronegativity"])), (1, 2, 13, 14, 15, 16, 17), (1, 2, 16, 17), errs)
    if not got:
        return None
    mode, els, vals = got
    # lesson 60: the electronegativity rises along a period and falls down a group
    rising = mode == "periodo"
    if not monotonic(vals, Rational(3, 100), rising, errs):
        return mode
    most = m.group(2) == "più"
    right = els[-1] if rising == most else els[0]
    check_choice(ch, lambda o: sym_of(o["latex"]) == right["symbol"], errs)
    return mode


BOND = r"Nel legame tra (\w+) \(\$\\chi = (\d\{,\}\d\d)\$\) e (\w+) \(\$\\chi = (\d\{,\}\d\d)\$\), "


def two(m, errs):
    a, b = BY_NAME[m.group(1)], BY_NAME[m.group(3)]
    for el, shown_chi in ((a, m.group(2)), (b, m.group(4))):
        if chi_tex(el["symbol"]) != shown_chi:
            errs.append(f"electronegativity of {el['symbol']} is not the table's")
    if a["symbol"] == b["symbol"] or chi(a["symbol"]) == chi(b["symbol"]):
        errs.append("the two atoms have the same electronegativity")
    return a, b


def su(name):
    return re.sub(r"^l'", "sull'", re.sub(r"^lo ", "sullo ", re.sub(r"^il ", "sul ", art(name))))


def level4(sample, ch, prose, errs):
    m = re.fullmatch(BOND + r"su quale atomo sta la carica parziale \$\\delta\^-\$\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    a, b = two(m, errs)
    hi = a if chi(a["symbol"]) > chi(b["symbol"]) else b
    want = f"{cap(su(hi['name'].lower()))}, che è più elettronegativo"
    names = {cap(su(e["name"].lower())) for e in (a, b)}
    for o in ch["options"]:
        mm = re.fullmatch(r"(.+), che è (più|meno) elettronegativo", option_text(o["latex"]))
        if not mm or mm.group(1) not in names:
            errs.append(f"option {o['latex']!r} not about the two atoms")
    check_choice(ch, lambda o: option_text(o["latex"]) == want, errs)
    return "carica"


def level5(sample, ch, prose, errs):
    m = re.fullmatch(BOND + r"quanto vale la differenza di elettronegatività \$\\Delta\\chi\$\?", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    a, b = two(m, errs)
    d = abs(chi(a["symbol"]) - chi(b["symbol"]))
    check_number(sample, ch, d, errs)
    for o in ch["options"]:
        if not re.fullmatch(r"-?\d\{,\}\d\d", o["latex"]) or dec(o["latex"]) != Rational(o["values"][0]):
            errs.append(f"option {o['latex']!r}: two decimals, and its value")
    return "differenza"


def level6(sample, ch, prose, extra, errs):
    if prose != "In quale di questi legami gli elettroni sono più spostati verso uno dei due atomi? Usa i valori di elettronegatività della tabella." or len(extra) != 1:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    t = re.fullmatch(r"\\begin\{array\}\{[c|]+\} (.+) \\\\ \\hline (.+) \\end\{array\}", extra[0])
    if not t:
        errs.append("table not read")
        return None
    heads = [sym_of(x) for x in t.group(1).split("&")]
    vals = [x.strip() for x in t.group(2).split("&")]
    if len(heads) != len(vals) or any(chi_tex(s) != x for s, x in zip(heads, vals)):
        errs.append("the table's values are not those of the site's table")
    deltas = {}
    used = set()
    for o in ch["options"]:
        mm = re.fullmatch(r"\\mathrm\{([A-Z][a-z]?)\{-\}([A-Z][a-z]?)\}", o["latex"])
        if not mm or mm.group(1) == mm.group(2):
            errs.append(f"option {o['latex']!r} is not a bond between two elements")
            return None
        used |= {mm.group(1), mm.group(2)}
        deltas[o["latex"]] = abs(chi(mm.group(1)) - chi(mm.group(2)))
    if used != set(heads):
        errs.append("the table does not list exactly the elements of the bonds")
    ds = sorted(deltas.values())
    if len(set(ds)) != 4 or ds[-1] - ds[-2] < Rational(1, 10):
        errs.append(f"no bond clearly ahead: {ds}")
    check_choice(ch, lambda o: deltas[o["latex"]] == ds[-1], errs)
    return "confronto"


def check(sample):
    errs = []
    ch = the_choice(sample, errs)
    lvl = sample.get("level")
    if lvl not in (1, 2, 3, 4, 5, 6) or ch is None:
        return errs + [f"unknown level {lvl} or no choice"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra and lvl != 6:
        errs.append(f"unexpected lines {extra}")
    if (sample["answer"]["kind"] == "number") != (lvl == 5):
        errs.append("only level 5 has a number as the answer")
    try:
        if lvl == 6:
            kind = level6(sample, ch, prose, extra, errs)
        else:
            kind = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}[lvl](sample, ch, prose, errs)
    except (ValueError, KeyError, TypeError, AttributeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
