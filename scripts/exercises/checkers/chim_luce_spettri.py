"""Checker for chim-luce-spettri (specs/exercises/chim-luce-spettri.md), written from the spec and the lesson
48-chim-luce-spettri.md, not from the generator.

The data are read from `params`, looked for in the text of the problem, and every answer is recomputed with exact
fractions: c = lambda nu, E = h nu = h c / lambda, a mole of photons with N_A = 6,02 · 10^23, the photon against the
least energy of the metal. The regions of the spectrum, the kinds of spectra and the true and false statements are
written again here from the lesson.
"""
from fractions import Fraction as F

from checkers._chim3_a import C, H, N_A, common, far_from_right, from_sci, near_tie, need, option_text, choice_of, plain, prose, right_text, right_value, rounded, sci_tex, sci_value, statements, tex

CASE_RANGES = {
    1: {"confronto": (0.2, 0.47), "regione": (0.2, 0.47), "ordine": (0.2, 0.47)},
    2: {"frequenza": (0.35, 0.65), "lunghezza": (0.35, 0.65)},
    3: {"da-frequenza": (0.35, 0.65), "da-lunghezza": (0.35, 0.65)},
    4: {"mole": (0.35, 0.65), "lambda": (0.35, 0.65)},
    5: {"soglia": (0.25, 0.55), "cinetica": (0.25, 0.55), "intensita": (0.1, 0.3)},
    6: {"tipo": (0.2, 0.47), "assorbimento": (0.2, 0.47), "affermazione": (0.2, 0.47)},
}

# From the longest wavelength to the shortest, with the lower bound of each region in metres (lesson 48, table).
REGIONS = [
    ("onde radio", F(1, 10)),
    ("microonde", F(1, 1000)),
    ("infrarosso", F(700) * F(10) ** -9),
    ("visibile", F(400) * F(10) ** -9),
    ("ultravioletto", F(10) * F(10) ** -9),
    ("raggi X", F(1, 100) * F(10) ** -9),
    ("raggi gamma", F(0)),
]
UNIT_M = {"m": F(1), "cm": F(1, 100), "mm": F(1, 1000), "nm": F(10) ** -9}


def region_of(metres):
    for name, low in REGIONS:
        if metres > low:
            return name
    raise ValueError("no region")


SOURCE_KIND = [
    ("filamento", "continuo"),
    ("ferro rovente", "continuo"),
    ("scarica elettrica", "emissione"),
    ("sulla fiamma", "emissione"),
    ("ha attraversato", "assorbimento"),
]

SPECTRA = {
    "ogni elemento ha le sue righe, diverse da quelle di ogni altro": True,
    "un elemento assorbe le stesse lunghezze d'onda che emette": True,
    "uno spettro continuo contiene tutte le lunghezze d'onda del visibile": True,
    "le righe di un elemento sono le stesse in ogni laboratorio": True,
    "tutti gli elementi hanno le stesse righe, con intensità diverse": False,
    "le righe di un elemento cambiano con la temperatura della fiamma": False,
    "un gas rarefatto eccitato dà uno spettro continuo": False,
    "le righe scure sono colori che la sorgente non emette": False,
    "un solido incandescente dà uno spettro a righe": False,
    "un elemento assorbe i colori che non riesce a emettere": False,
}


def nm_given(p, text, errs, lo=380, hi=780):
    nm = p["nm"]
    if not (isinstance(nm, int) and lo <= nm <= hi):
        errs.append(f"wavelength {nm} nm out of range")
    need(text, f"{nm}\\,\\text{{nm}}", errs)
    return F(nm) * F(10) ** -9


def computed(sample, x, unit, errs, digits=3):
    """A computed quantity in scientific notation: not on a tie, the right option, no wrong one too close."""
    if near_tie(x, digits):
        errs.append("the answer hangs on a rounding")
    right_value(sample, f"{sci_value(x, digits)} {unit}", errs)
    far_from_right(sample, rounded(x, digits), errs, unit)


def level1(sample, p, text, errs):
    case = p["case"]
    if case == "confronto":
        a, b = p["a"], p["b"]
        if abs(a - b) < 40:
            errs.append("the two radiations are too close")
        if p["given"] == "lunghezza":
            for x in (a, b):
                if not 400 <= x <= 700:
                    errs.append("wavelength out of the visible")
                need(text, f"{x}\\,\\text{{nm}}", errs)
            if "frequenza più alta" not in text:
                errs.append("question not recognised")
            right_value(sample, str(min(a, b)), errs)
        else:
            for x in (a, b):
                need(text, f"{sci_tex(F(x) * 10**12)}\\,\\text{{Hz}}", errs)
            if "lunghezza d'onda più lunga" not in text:
                errs.append("question not recognised")
            right_value(sample, str(min(a, b)), errs)
    elif case == "regione":
        need(text, f"{tex(p['num'])}\\,\\text{{{p['unit']}}}", errs)
        name = region_of(F(p["num"]) * UNIT_M[p["unit"]])
        names = {n for n, _ in REGIONS}
        for o in choice_of(sample).get("options", []):
            if option_text(o["latex"]) not in names:
                errs.append(f"option {o['latex']!r} is not a region")
        right_text(sample, name, errs)
    elif case == "ordine":
        order = [n for n, _ in REGIONS]
        three = sorted(p["regions"], key=order.index)
        if len(set(three)) != 3:
            errs.append("three different regions are needed")
        if p["what"] == "frequenza":
            need(text, "frequenza crescente", errs)
        else:
            need(text, "lunghezza d'onda crescente", errs)
            three.reverse()
        right_text(sample, ", ".join(three), errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def level2(sample, p, text, errs):
    case = p["case"]
    if case == "frequenza":
        lam = nm_given(p, text, errs)
        computed(sample, C / lam, "Hz", errs)
    elif case == "lunghezza":
        nu = from_sci(p["nu"])
        if not F(4) * 10**14 <= nu <= F(78, 10) * 10**14:
            errs.append("frequency out of range")
        need(text, f"{sci_tex(nu)}\\,\\text{{Hz}}", errs)
        computed(sample, C / nu, "m", errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def level3(sample, p, text, errs):
    case = p["case"]
    if case == "da-frequenza":
        nu = from_sci(p["nu"])
        need(text, f"{sci_tex(nu)}\\,\\text{{Hz}}", errs)
        computed(sample, H * nu, "J", errs)
    elif case == "da-lunghezza":
        lam = nm_given(p, text, errs)
        computed(sample, H * C / lam, "J", errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def level4(sample, p, text, errs):
    case = p["case"]
    if case == "mole":
        lam = nm_given(p, text, errs, 250, 780)
        need(text, "una mole di fotoni", errs)
        mole = H * C / lam * N_A / 1000
        if near_tie(mole):
            errs.append("the answer hangs on a rounding")
        if not 100 <= mole < 1000:
            errs.append("the answer is not a plain number of three figures")
        right_value(sample, f"{plain(mole)} kJ/mol", errs)
    elif case == "lambda":
        E = from_sci(p["E"])
        need(text, f"{sci_tex(E)}\\,\\text{{J}}", errs)
        need(text, "in nanometri", errs)
        lam = H * C / E * 10**9
        if near_tie(lam):
            errs.append("the answer hangs on a rounding")
        if not 380 <= lam <= 780:
            errs.append("wavelength out of range")
        right_value(sample, f"{plain(lam)} nm", errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def level5(sample, p, text, errs):
    case = p["case"]
    if case == "intensita":
        need(text, "Si raddoppia l'intensità", errs)
        right_text(sample, "escono più elettroni, con la stessa energia", errs)
        return case
    least = F(p["min"]) * F(10) ** -21
    if not 300 <= p["min"] <= 700:
        errs.append("least energy out of range")
    need(text, f"{sci_tex(least)}\\,\\text{{J}}", errs)
    if case == "soglia":
        lam = nm_given(p, text, errs, 250, 750)
        E = H * C / lam
        if abs(E / least - 1) < F(7, 100):
            errs.append("photon and threshold too close")
        right_value(sample, "si" if E > least else "no", errs)
    elif case == "cinetica":
        photon = F(p["photon"]) * F(10) ** -21
        need(text, f"{sci_tex(photon)}\\,\\text{{J}}", errs)
        k = p["photon"] - p["min"]
        if k < 60:
            errs.append("the photon is too close to the threshold")
        right_value(sample, f"{sci_value(F(k) * F(10) ** -21, 3 if k >= 100 else 2)} J", errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def level6(sample, p, text, errs):
    case = p["case"]
    if case == "tipo":
        need(text, p["source"], errs)
        kinds = [k for word, k in SOURCE_KIND if word in p["source"]]
        if len(set(kinds)) != 1:
            errs.append(f"source not recognised: {p['source']!r}")
        else:
            right_value(sample, kinds[0], errs)
    elif case == "assorbimento":
        a, b, c = p["lines"]
        need(text, f"${a}$, ${b}$ e ${c}\\,\\text{{nm}}$", errs)
        right_text(sample, f"a {a}, {b} e {c} nm", errs)
    elif case == "affermazione":
        need(text, "è vera?" if p["want"] else "è sbagliata?", errs)
        statements(sample, SPECTRA, p["want"], errs)
    else:
        errs.append(f"unknown case {case}")
    return case


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    if sample.get("answer", {}).get("kind") != "choice":
        errs.append("every level of this generator is a multiple choice")
    level = LEVELS.get(sample.get("level"))
    if not level:
        return errs + [f"unknown level {sample.get('level')}"], None
    case = level(sample, sample["params"], prose(sample), errs)
    return errs, case
