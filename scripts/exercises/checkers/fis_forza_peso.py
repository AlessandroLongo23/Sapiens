"""Checker for fis-forza-peso (specs/exercises/fis-forza-peso.md), written from the spec and the lesson
17-fis-forza-peso.md. The problem is read back from its text; the weight is P = m g with the g of the lesson's table
(NASA Planetary Fact Sheet, 18 March 2025): the g written in the text must be the table's. Every datum has two
significant figures, the answer is the exact value rounded half up to two, and an exact tie is refused. On level 2
the reading in the text must be the one drawn in the scene, on a division of one of the spec's balances.
"""
import re

from sympy import Rational

from checkers.forze_comune import common, expect, match, parse_num, prose, sig_figs

CASE_RANGES = {
    4: {k: (0.10, 0.24) for k in ["luna", "marte", "venere", "giove", "saturno", "nettuno"]},
    5: {"con-la-terra": (0.30, 0.60), "due-pianeti": (0.40, 0.70)},
}

G = {
    "Terra": Rational(98, 10),
    "Luna": Rational(16, 10),
    "Marte": Rational(37, 10),
    "Venere": Rational(89, 10),
    "Giove": Rational(231, 10),
    "Saturno": Rational(90, 10),
    "Nettuno": Rational(110, 10),
}
PLACE = {"sulla Terra": "Terra", "sulla Luna": "Luna", "su Marte": "Marte", "su Venere": "Venere", "su Giove": "Giove", "su Saturno": "Saturno", "su Nettuno": "Nettuno"}
THINGS = ["Uno zaino", "Una cassa", "Un secchio", "Una valigia", "Un pacco", "Una borsa", "Un cane", "Una bicicletta"]
BALANCES = {(5, 25, 5), (10, 20, 4), (20, 20, 5), (50, 25, 5)}
S2 = ("sig", 2)
PLACES = "(" + "|".join(PLACE) + ")"


def two_sig(errs, s, what):
    if sig_figs(s) != 2:
        errs.append(f"{what} {s!r} has not two significant figures")


def given_g(errs, s, bodies):
    """The '(Luna: $g = 1{,}6\\,\\text{N/kg}$; ...)' at the end: one per body other than the Earth, as in the table."""
    found = dict(re.findall(r"(\w+): \$g = ([^$]+?)\\,\\text\{N/kg\}\$", s))
    want = {b for b in bodies if b != "Terra"}
    if set(found) != want:
        errs.append(f"given g for {sorted(found)}, expected {sorted(want)}")
    for b, v in found.items():
        if parse_num(v) != G.get(b):
            errs.append(f"g of {b} is {v}, the table says {G.get(b)}")


def level1(sample, errs):
    s = prose(sample["problem"])
    g = match("{W} {W} ha la massa di {KG}. Quanto pesa sulla Terra?", s)
    if not g or f"{g[0]} {g[1]}" not in THINGS:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    two_sig(errs, g[2], "mass")
    m = parse_num(g[2])
    if not 1 <= m <= Rational(99, 10):
        errs.append("mass outside 1,0-9,9 kg")
    expect(errs, sample, m * G["Terra"], "N", S2)
    return "kg"


def level2(sample, errs):
    s = prose(sample["problem"])
    g = match("Un sacchetto è appeso al dinamometro della figura, che segna {N}. Qual è la massa del sacchetto?", s)
    if not g:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    two_sig(errs, g[0], "reading")
    P = parse_num(g[0])
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "dinamometro" or (d.get("portata"), d.get("divisioni"), d.get("ogni")) not in BALANCES or not d.get("oggetto"):
        errs.append("scene is not one of the spec's balances with a bag")
    else:
        if Rational(str(d["forza"])) != P:
            errs.append(f"scene reads {d['forza']}, the text {P}")
        i = P / Rational(d["portata"], d["divisioni"])
        if not i.is_integer or not 0 < i < d["divisioni"]:
            errs.append("reading not on a division")
    expect(errs, sample, P / G["Terra"], "kg", S2)
    return "dinamometro"


def level3(sample, errs):
    s = prose(sample["problem"])
    g = match("Quanto pesa sulla Terra un oggetto con la massa di {G}?", s)
    if not g:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    grams = parse_num(g[0])
    if not (100 <= grams <= 990 and grams % 10 == 0):
        errs.append("grams outside 100-990 or not a multiple of 10")
    expect(errs, sample, grams / 1000 * G["Terra"], "N", S2)
    return "grammi"


def level4(sample, errs):
    s = prose(sample["problem"])
    m_ = re.fullmatch(r"Un robot ha la massa di \$(.+?)\\,\\text\{kg\}\$\. Quanto pesa " + PLACES + r"\? \((.*)\)", s)
    if not m_:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    body = PLACE[m_.group(2)]
    if body == "Terra":
        errs.append("level 4 on the Earth")
    given_g(errs, m_.group(3), [body])
    two_sig(errs, m_.group(1), "mass")
    truth = parse_num(m_.group(1)) * G[body]
    if not 1 <= truth <= 99:
        errs.append(f"weight {truth} outside 1-99 N")
    expect(errs, sample, truth, "N", S2)
    return body.lower()


def level5(sample, errs):
    s = prose(sample["problem"])
    m_ = re.fullmatch(r"Una sonda pesa \$(.+?)\\,\\text\{N\}\$ " + PLACES + r"\. Quanto pesa " + PLACES + r"\? \((.*)\)", s)
    if not m_:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    a, b = PLACE[m_.group(2)], PLACE[m_.group(3)]
    if a == b:
        errs.append("same body")
    given_g(errs, m_.group(4), [a, b])
    two_sig(errs, m_.group(1), "weight")
    mass = parse_num(m_.group(1)) / G[a]
    truth = mass * G[b]
    if not 1 <= truth <= 99:
        errs.append(f"weight {truth} outside 1-99 N")
    expect(errs, sample, truth, "N", S2)
    return "con-la-terra" if "Terra" in (a, b) else "due-pianeti"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = common(sample)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
