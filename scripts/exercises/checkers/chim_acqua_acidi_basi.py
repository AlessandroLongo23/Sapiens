"""Checker for chim-acqua-acidi-basi (specs/exercises/chim-acqua-acidi-basi.md), written from the spec and the lesson
47-chim-acqua-acidi-basi.md, not from the generator.

Level 1: the test is classified by its words (litmus red or blue, zinc, marble, phenolphthalein pink or colourless,
universal indicator green, violet or red, conductivity). Level 2: acids are the formulas that start with H or end
with COOH, bases the hydroxides and ammonia, the rest (salts, glucose, ethanol) neutral. Level 3: the pH values are
read from the options, the right one follows from the question (acid below 7, basic above 7). Level 4: 10 to the
difference of pH. Level 5: a strong acid diluted 10^k times gains k units of pH, a strong base loses k, the dilution
read from the two volumes. Level 6: the lesson's colours: litmus red below 4,5 and blue above 8,3, phenolphthalein
colourless up to 8,2 and deep pink above 10, universal indicator by bands.
"""
import re

from checkers._chim_acqua import Rational, common, exact_dec, one_right, option_text, text

CASE_RANGES = {
    1: {"acida": (0.32, 0.48), "basica": (0.22, 0.38), "neutra": (0.05, 0.16), "boh": (0.13, 0.28)},
    2: {"acido": (0.26, 0.41), "base": (0.26, 0.41), "neutro": (0.26, 0.41)},
    3: {k: (0.17, 0.33) for k in ["piu-acida", "piu-basica", "unica-acida", "unica-basica"]},
    5: {"acido": (0.40, 0.60), "base": (0.40, 0.60)},
    6: {"tornasole": (0.26, 0.41), "fenolftaleina": (0.26, 0.41), "universale": (0.26, 0.41)},
}

VERDICT = {"acida": "è acida", "basica": "è basica", "neutra": "è neutra", "boh": "non si può dire con questa sola prova"}
TESTS = [
    ("acida", r"rossa una cartina al tornasole blu|zinco|marmo|universale diventa rossa"),
    ("basica", r"blu una cartina al tornasole rossa|fenolftaleina diventa rosa|universale diventa viola"),
    ("neutra", r"universale diventa verde"),
    ("boh", r"fenolftaleina resta incolore|conduce la corrente"),
]


def level1(sample, errs):
    m = re.fullmatch(r"Una soluzione sconosciuta (.+)\. Che cosa si può dire della soluzione\?", text(sample))
    if not m:
        errs.append("level 1 text not recognised")
        return None
    kinds = [k for k, rx in TESTS if re.search(rx, m.group(1))]
    if len(kinds) != 1:
        errs.append(f"test not classified: {m.group(1)!r}")
        return None
    for o in sample["answer"]["options"]:
        if option_text(o["latex"]) not in VERDICT.values():
            errs.append(f"option not a verdict: {o['latex']!r}")
    one_right(sample, errs, lambda o: option_text(o["latex"]) == VERDICT[kinds[0]])
    return kinds[0]


REASON = {
    "acido": "acida: libera ioni $\\mathrm{H^+}$",
    "base": "basica: libera ioni $\\mathrm{OH^-}$",
    "neutro": "neutra: non libera né $\\mathrm{H^+}$ né $\\mathrm{OH^-}$",
}
WRONG_REASON = "basica: libera ioni $\\mathrm{H^+}$"
NEUTRAL = {"NaCl", "KNO_3", "C_6H_{12}O_6", "C_2H_5OH"}


def kind_of(formula):
    if formula in NEUTRAL:
        return "neutro"
    if formula == "NH_3" or re.search(r"OH\)?(_\d)?$", formula) and not formula.endswith("COOH") and formula not in NEUTRAL:
        return "base"
    if formula.startswith("H") or formula.endswith("COOH"):
        return "acido"
    raise ValueError(f"unknown substance {formula}")


NAMES = {
    "l'acido cloridrico": "HCl", "l'acido nitrico": "HNO_3", "l'acido solforico": "H_2SO_4", "l'acido acetico": "CH_3COOH",
    "l'idrossido di sodio": "NaOH", "l'idrossido di potassio": "KOH", "l'idrossido di calcio": "Ca(OH)_2", "l'ammoniaca": "NH_3",
    "il cloruro di sodio": "NaCl", "il nitrato di potassio": "KNO_3", "il glucosio": "C_6H_{12}O_6", "l'etanolo": "C_2H_5OH",
}


def level2(sample, errs):
    m = re.fullmatch(r"Si scioglie in acqua (.+?), \$\\mathrm\{(.+?)\}\$\. Com'è la soluzione, secondo Arrhenius\?", text(sample))
    if not m:
        errs.append("level 2 text not recognised")
        return None
    if NAMES.get(m.group(1)) != m.group(2):
        errs.append(f"name {m.group(1)!r} and formula {m.group(2)} do not match")
    k = kind_of(m.group(2))
    for o in sample["answer"]["options"]:
        if option_text(o["latex"]) not in [*REASON.values(), WRONG_REASON]:
            errs.append(f"option not a reason: {o['latex']!r}")
    one_right(sample, errs, lambda o: option_text(o["latex"]) == REASON[k])
    return k


ASK = {
    "Quale di queste soluzioni è la più acida?": "piu-acida",
    "Quale di queste soluzioni è la più basica?": "piu-basica",
    "Una sola di queste soluzioni è acida. Quale?": "unica-acida",
    "Una sola di queste soluzioni è basica. Quale?": "unica-basica",
}


def ph_of(o):
    mm = re.fullmatch(r"pH \$(\d+(?:\{,\}\d)?)\$", option_text(o["latex"]))
    if not mm:
        raise ValueError("not a pH option")
    return exact_dec(mm.group(1))


def level3(sample, errs):
    m = re.fullmatch(r"(.+?) Tutte sono a \$25\\,\^\\circ\\text\{C\}\$\.", text(sample))
    if not m or m.group(1) not in ASK:
        errs.append("level 3 text not recognised")
        return None
    ask = ASK[m.group(1)]
    phs = [ph_of(o) for o in sample["answer"]["options"]]
    if any(not 0 <= p <= 14 for p in phs):
        errs.append("pH outside 0-14")
    if ask == "piu-acida":
        target = min(phs)
        if target >= 7:
            errs.append("the most acid solution is not acid")
    elif ask == "piu-basica":
        target = max(phs)
        if target <= 7:
            errs.append("the most basic solution is not basic")
    else:
        good = [p for p in phs if (p < 7 if ask == "unica-acida" else p > 7)]
        if len(good) != 1:
            errs.append(f"{len(good)} solutions fit")
            return ask
        target = good[0]
    one_right(sample, errs, lambda o: ph_of(o) == target)
    return ask


def times_of(o):
    mm = re.fullmatch(r"\$([\d\\,{}]+)\$ volte", option_text(o["latex"]))
    if not mm:
        raise ValueError("not 'N volte'")
    return exact_dec(mm.group(1).replace("\\,", ""))


def level4(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"Quante volte più ioni \$\\mathrm\{H\^\+\}\$ ci sono in una soluzione a pH \$([\d{},]+)\$ che in una a pH \$([\d{},]+)\$\?", s):
        low, high, kind = exact_dec(m.group(1)), exact_dec(m.group(2)), "più"
    elif m := re.fullmatch(r"Quante volte meno ioni \$\\mathrm\{H\^\+\}\$ ci sono in una soluzione a pH \$([\d{},]+)\$ che in una a pH \$([\d{},]+)\$\?", s):
        high, low, kind = exact_dec(m.group(1)), exact_dec(m.group(2)), "meno"
    else:
        errs.append("level 4 text not recognised")
        return None
    d = high - low
    if d.q != 1 or not 1 <= d <= 4:
        errs.append(f"difference {d} not a whole number 1-4")
        return kind
    if (kind == "più" and high > 7) or (kind == "meno" and low < 7):
        errs.append("pair on the wrong side of 7")
    one_right(sample, errs, lambda o: times_of(o) == Rational(10) ** int(d))
    return kind


VOL = {r"5\,\text{mL}": 5, r"10\,\text{mL}": 10, r"20\,\text{mL}": 20, r"25\,\text{mL}": 25, r"50\,\text{mL}": 50, r"100\,\text{mL}": 100, r"250\,\text{mL}": 250, r"500\,\text{mL}": 500, r"1{,}0\,\text{L}": 1000, r"2{,}0\,\text{L}": 2000}


def level5(sample, errs):
    m = re.fullmatch(
        r"Si prendono \$(.+?)\$ di una soluzione di (acido cloridrico, un acido forte|idrossido di sodio, una base forte), a pH \$(\d+)\$, e si aggiunge acqua fino a \$(.+?)\$\. Quanto vale il pH della nuova soluzione\?",
        text(sample),
    )
    if not m or m.group(1) not in VOL or m.group(4) not in VOL:
        errs.append("level 5 text not recognised")
        return None
    factor = Rational(VOL[m.group(4)], VOL[m.group(1)])
    k = {10: 1, 100: 2}.get(int(factor)) if factor.q == 1 else None
    if k is None:
        errs.append(f"dilution {factor} is not 10 or 100")
        return None
    base = m.group(2).startswith("idrossido")
    p = int(m.group(3))
    new = p - k if base else p + k
    if (base and new < 8) or (not base and new > 6):
        errs.append("the dilution comes too close to 7")
    one_right(sample, errs, lambda o: ph_of(o) == new)
    return "base" if base else "acido"


UNIVERSAL = {**{p: "rosso" for p in (0, 1, 2)}, 3: "arancione", 4: "arancione", 5: "giallo", 6: "giallo", 7: "verde", **{p: "blu" for p in (8, 9, 10)}, **{p: "viola" for p in (11, 12, 13, 14)}}


def level6(sample, errs):
    m = re.fullmatch(r"Si aggiunge qualche goccia di (tornasole|fenolftaleina|indicatore universale) a una soluzione a pH \$([\d{},]+)\$\. Di che colore è la soluzione\?", text(sample))
    if not m:
        errs.append("level 6 text not recognised")
        return None
    ind, ph = m.group(1), exact_dec(m.group(2))
    if ind == "tornasole":
        if ph < Rational(4):
            want = "rosso"
        elif ph > 9:
            want = "blu"
        else:
            errs.append(f"litmus at pH {ph}, too close to its change")
            return ind
    elif ind == "fenolftaleina":
        if ph <= Rational(15, 2):
            want = "incolore"
        elif ph >= Rational(21, 2):
            want = "rosa acceso"
        else:
            errs.append(f"phenolphthalein at pH {ph}, too close to its change")
            return ind
    else:
        if ph.q != 1:
            errs.append("universal indicator at a pH that is not a whole number")
            return "universale"
        want = UNIVERSAL[int(ph)]
    one_right(sample, errs, lambda o: option_text(o["latex"]) == want)
    return "universale" if ind == "indicatore universale" else ind


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
