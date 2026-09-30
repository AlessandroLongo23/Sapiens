"""Checker for fis-dispersione (specs/exercises/fis-dispersione.md).

Written from the spec and the lesson (docs/lezioni/fisica/riscritte/35-fis-dispersione.md). Colours are sets of the
three additive primaries: lights add them, filters and inks keep the ones they all share, a body diffuses the ones of
its colour that it receives. Level 6 is redone with sympy's exact sines, rounded to the tenth half up.
"""
import re

from sympy import Rational, asin, pi, sin, floor

from checkers._vettori import check_choice, common, prose

CASE_RANGES = {
    1: {"devia di più": (0.17, 0.33), "devia di meno": (0.17, 0.33), "indice": (0.17, 0.33), "angolo": (0.17, 0.33)},
    2: {"nero": (0.35, 0.75), "colorato": (0.25, 0.65)},
    3: {"due": (0.70, 0.90), "tre": (0.10, 0.30)},
    4: {"due": (0.70, 0.90), "tre": (0.10, 0.30)},
}

PRIM = {"rosso": {"r"}, "verde": {"g"}, "blu": {"b"}}
COLOUR = {"nero": set(), "rosso": {"r"}, "verde": {"g"}, "blu": {"b"}, "giallo": {"r", "g"}, "ciano": {"g", "b"}, "magenta": {"r", "b"}, "bianco": {"r", "g", "b"}}
FEM = {"rossa": "rosso", "verde": "verde", "blu": "blu", "gialla": "giallo", "ciano": "ciano", "magenta": "magenta"}
SPECTRUM = ["rosso", "arancione", "giallo", "verde", "azzurro", "indaco", "violetto"]
FEM_SPECTRUM = {"rossa": "rosso", "arancione": "arancione", "gialla": "giallo", "verde": "verde", "azzurra": "azzurro", "indaco": "indaco", "violetta": "violetto"}


def name_of(cs):
    for k, v in COLOUR.items():
        if v == set(cs):
            return k
    raise ValueError(f"no colour {cs}")


def text_options(sample, errs, allowed):
    for o in sample["answer"]["options"]:
        m = re.fullmatch(r"\\text\{([^}]*)\}", o["latex"])
        if not m or m.group(1) not in allowed:
            errs.append(f"option {o['latex']!r}")


def article(c):
    return ("l'" if c[0] in "aeiou" else "il ") + c


def level1(s, sample, errs):
    m = re.fullmatch(r"Un raggio di luce bianca attraversa un prisma di vetro\. Quale colore viene deviato (di più|di meno)\?", s)
    if m:
        right = "violetto" if m.group(1) == "di più" else "rosso"
        check_choice(sample, errs, f"\\text{{{right}}}")
        text_options(sample, errs, set(SPECTRUM))
        return "devia di più" if m.group(1) == "di più" else "devia di meno"
    m = re.fullmatch(r"Nel vetro, quale ha l'indice di rifrazione più grande tra la luce (\w+) e la luce (\w+)\?", s)
    kind = "indice"
    if not m:
        m = re.fullmatch(r"La luce (\w+) e la luce (\w+) entrano dall'aria nel vetro con lo stesso angolo di incidenza\. Quale ha l'angolo di rifrazione più grande\?", s)
        kind = "angolo"
    if not m:
        errs.append(f"level 1 text: {s!r}")
        return None
    a, b = FEM_SPECTRUM.get(m.group(1)), FEM_SPECTRUM.get(m.group(2))
    if a is None or b is None or a == b:
        errs.append("colours")
        return None
    ia, ib = SPECTRUM.index(a), SPECTRUM.index(b)
    # The index grows from red to violet; a smaller index gives a larger angle of refraction.
    right = (a if ia > ib else b) if kind == "indice" else (a if ia < ib else b)
    check_choice(sample, errs, f"\\text{{{article(right)}}}")
    text_options(sample, errs, {article(c) for c in SPECTRUM} | {"sono uguali", "dipende dall'angolo"})
    return kind


BODIES2 = {"Una maglietta, rossa": "rosso", "Una foglia, verde": "verde", "Un quaderno, blu": "blu", "Un foglio, bianco": "bianco", "Un cappello, nero": "nero"}
BODIES5 = {"Una banana, gialla": "giallo", "Un costume, ciano": "ciano", "Un fiore, magenta": "magenta"}


def bodies(s, sample, errs, lvl):
    table = BODIES2 if lvl == 2 else BODIES5
    m = re.fullmatch(r"(.+?) in luce bianca, viene (illuminata|illuminato) (solo )?con luce (\w+)\. Di che colore appare\?", s)
    if not m or m.group(1) not in table or (lvl == 2) != bool(m.group(3)):
        errs.append(f"level {lvl} text: {s!r}")
        return None
    body = COLOUR[table[m.group(1)]]
    light_name = FEM.get(m.group(4))
    if light_name is None:
        errs.append("light")
        return None
    light = COLOUR[light_name]
    if (m.group(2) == "illuminata") != m.group(1).startswith("Una"):
        errs.append("agreement")
    if lvl == 2 and len(light) != 1:
        errs.append("level 2 light not primary")
    if lvl == 5 and (len(light) not in (1, 2) or light == body):
        errs.append("level 5 light")
    right = name_of(body & light)
    check_choice(sample, errs, f"\\text{{{right}}}")
    text_options(sample, errs, set(COLOUR))
    return None if lvl == 5 else ("nero" if right == "nero" else "colorato")


def synthesis(s, sample, errs, lvl):
    if lvl == 3:
        m = re.fullmatch(r"Su un muro bianco, al buio, si sovrappongono (?:la luce (\w+) e la luce (\w+) di due faretti|le luci rossa, verde e blu di tre faretti)\. Di che colore è la zona in cui si sovrappongono\?", s)
        if not m:
            errs.append(f"level 3 text: {s!r}")
            return None
        names = [FEM.get(m.group(1)), FEM.get(m.group(2))] if m.group(1) else ["rosso", "verde", "blu"]
        if any(n not in PRIM for n in names) or len(set(names)) != len(names):
            errs.append("lights")
            return None
        total = set().union(*(COLOUR[n] for n in names))
    else:
        m = re.fullmatch(r"(?:Davanti a una lampada bianca si mettono, uno sopra l'altro, (due|tre) filtri|Su un foglio bianco si mescolano (due|tre) inchiostri): (\w+)(?:, (\w+))? e (\w+)\. Di che colore (?:è la luce che passa|appare la macchia in luce bianca)\?", s)
        if not m:
            errs.append(f"level 4 text: {s!r}")
            return None
        names = [x for x in (m.group(3), m.group(4), m.group(5)) if x]
        count = m.group(1) or m.group(2)
        if {"due": 2, "tre": 3}[count] != len(names) or any(n not in ("ciano", "magenta", "giallo") for n in names) or len(set(names)) != len(names):
            errs.append("filters")
            return None
        total = {"r", "g", "b"}
        for n in names:
            total &= COLOUR[n]
    right = name_of(total)
    check_choice(sample, errs, f"\\text{{{right}}}")
    text_options(sample, errs, set(COLOUR))
    return "tre" if len(names) == 3 else "due"


GLASS = {"in un vetro": ("1{,}514", "1{,}530"), "in un vetro denso": ("1{,}615", "1{,}645"), "nell'acqua": ("1{,}331", "1{,}343")}


def tenth(x):
    y = x * 10
    fl = int(floor(y))
    frac = y - fl
    if abs(frac - Rational(1, 2)) < Rational(1, 10**9):
        return None
    return Rational(fl + (1 if frac > Rational(1, 2) else 0), 10)


def level6(s, sample, errs):
    m = re.fullmatch(r"Un raggio di luce bianca entra dall'aria (in un vetro|in un vetro denso|nell'acqua) con un angolo di incidenza di \$(\d+)\^\\circ\$\. L'indice di rifrazione è \$(\d\{,\}\d+)\$ per il rosso e \$(\d\{,\}\d+)\$ per il violetto\. Di quanti gradi differiscono gli angoli di rifrazione dei due colori\? Rispondi al decimo di grado\.", s)
    if not m:
        errs.append(f"level 6 text: {s!r}")
        return None
    if GLASS[m.group(1)] != (m.group(3), m.group(4)):
        errs.append("indices")
    th = int(m.group(2))
    if not 30 <= th <= 80:
        errs.append("angle range")
    nr, nv = (Rational(x.replace("{,}", ".")) for x in (m.group(3), m.group(4)))
    ang = lambda n: (asin(sin(pi * th / 180) / n) * 180 / pi).evalf(50)  # noqa: E731
    ar, av = ang(nr), ang(nv)
    right = tenth(ar - av)
    if right is None or right <= 0:
        errs.append("difference at a boundary or zero")
        return None
    tr, tv = tenth(ar), tenth(av)
    if tr is None or tv is None or tenth(tr - tv) != right:
        errs.append("the answer depends on rounding the angles first")
    txt = f"{float(right):.1f}".replace(".", "{,}")
    check_choice(sample, errs, f"{txt}^\\circ")
    for o in sample["answer"]["options"]:
        if not re.fullmatch(r"\d+\{,\}\d\^\\circ", o["latex"]):
            errs.append(f"option {o['latex']!r}")
    return None


def check(sample):
    errs = []
    lvl = sample.get("level")
    if lvl not in (1, 2, 3, 4, 5, 6):
        return [f"unknown level {lvl}"], None
    common(sample, errs)
    try:
        s = prose(sample["problem"])
        if lvl == 1:
            kind = level1(s, sample, errs)
        elif lvl in (2, 5):
            kind = bodies(s, sample, errs, lvl)
        elif lvl in (3, 4):
            kind = synthesis(s, sample, errs, lvl)
        else:
            kind = level6(s, sample, errs)
    except ValueError as e:
        return errs + [str(e)], None
    return errs, kind
