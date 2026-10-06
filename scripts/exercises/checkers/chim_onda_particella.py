"""Checker for chim-onda-particella (specs/exercises/chim-onda-particella.md), written from the spec and the lesson
51-chim-onda-particella.md, not from the generator.

The data are read from `params`, looked for in the text of the problem, and every answer is recomputed with exact
fractions: lambda = h / (m v), Delta v = h / (4 pi m Delta x), with h = 6,63 · 10^-34 J·s, the electron's mass
9,11 · 10^-31 kg and the proton's 1,67 · 10^-27 kg. The proportions and the true and false statements are written
again here from the lesson.
"""
from fractions import Fraction as F

from checkers._chim3_a import H, M_E, M_P, PI, choice_of, common, far_from_right, from_sci, near_tie, need, option_text, plain, prose, right_text, right_value, rounded, sci_tex, sci_value, statements, tex

CASE_RANGES = {
    1: {"fattore": (0.2, 0.47), "massa": (0.2, 0.47), "onda": (0.2, 0.47)},
    3: {"grammi": (0.35, 0.65), "picometri": (0.35, 0.65)},
    4: {"velocita": (0.35, 0.65), "massa": (0.35, 0.65)},
    5: {"calcolo": (0.35, 0.65), "proporzione": (0.13, 0.37), "affermazione": (0.13, 0.37)},
    6: {"affermazione": (0.5, 0.8), "esperimento": (0.2, 0.5)},
}

MASS = {"un elettrone": M_E, "un protone": M_P}
# What happens to the other quantity of an inverse proportion.
INVERSE = {"raddoppia": "si dimezza", "triplica": "diventa un terzo", "si dimezza": "raddoppia", "diventa un terzo": "triplica", "diventa un decimo": "diventa dieci volte più grande", "diventa dieci volte più grande": "diventa un decimo"}
# Lighter first.
LIGHTER_FIRST = ["un elettrone", "un protone", "un atomo di elio", "un atomo di ferro", "un granello di polvere"]
WAVE_SEEN = {"un elettrone", "un protone", "un atomo di elio"}
OBJECT_G = {"Una pallina da tennis": "57", "Una pallina da golf": "46", "Una biglia": "5.2", "Un pallone da calcio": "430", "Una pallina da ping pong": "2.7"}

PRINCIPLE = {
    "posizione e velocità di un elettrone non si conoscono insieme con precisione arbitraria": True,
    "più è precisa la posizione, più è incerta la velocità": True,
    "l'indeterminazione è una proprietà dell'elettrone, non un difetto degli strumenti": True,
    "per una pallina da tennis l'indeterminazione esiste, ma è troppo piccola per notarla": True,
    "con strumenti abbastanza precisi l'indeterminazione si elimina": False,
    "il principio vale solo per gli elettroni, non per gli altri corpi": False,
    "la posizione di un elettrone non si può misurare in nessun modo": False,
    "più è precisa la posizione, più è precisa anche la velocità": False,
    "l'elettrone di un atomo percorre un'orbita precisa, che gli strumenti non riescono a seguire": False,
}
ORBITAL = {
    "un orbitale è la regione in cui è alta la probabilità di trovare l'elettrone": True,
    "un orbitale non dice che strada percorre l'elettrone": True,
    "l'orbita di Bohr non può esistere, per il principio di indeterminazione": True,
    "i livelli di energia di Bohr restano validi, le orbite no": True,
    "un orbitale è la traiettoria dell'elettrone attorno al nucleo": False,
    "un orbitale è un'orbita di Bohr misurata con meno precisione": False,
    "i puntini con cui si disegna un orbitale sono tanti elettroni": False,
    "fuori dalla superficie disegnata l'elettrone non si trova mai": False,
}


def computed(sample, x, unit, errs, digits=3):
    if near_tie(x, digits):
        errs.append("the answer hangs on a rounding")
    right_value(sample, f"{sci_value(x, digits)} {unit}", errs)
    far_from_right(sample, rounded(x, digits), errs, unit)


def level1(sample, p, text, errs):
    case = p["case"]
    if case == "fattore":
        need(text, f"La velocità di un elettrone {p['come']}.", errs)
        right_text(sample, INVERSE[p["come"]], errs)
    elif case == "massa":
        a, b = p["a"], p["b"]
        need(text.lower(), f"{a} e {b} si muovono alla stessa velocità", errs)
        need(text, "più lunga" if p["longer"] else "più corta", errs)
        light, heavy = sorted((a, b), key=LIGHTER_FIRST.index)
        if light == heavy:
            errs.append("the same object twice")
        # The lighter one has the longer wavelength.
        right_text(sample, light if p["longer"] else heavy, errs)
    elif case == "onda":
        opts = [option_text(o["latex"]) for o in choice_of(sample).get("options", [])]
        if sum(o in WAVE_SEEN for o in opts) != 1:
            errs.append("exactly one option must be an electron, a proton or an atom")
        right_text(sample, next((o for o in opts if o in WAVE_SEEN), ""), errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def level2(sample, p, text, errs):
    m = MASS[p["particle"]]
    v = from_sci(p["v"])
    need(text.lower(), p["particle"], errs)
    need(text, f"{sci_tex(m)}\\,\\text{{kg}}", errs)
    need(text, f"{sci_tex(v)}\\,\\text{{m/s}}", errs)
    if v > F(1, 10) * 3 * 10**8:
        errs.append("faster than a tenth of the speed of light")
    computed(sample, H / (m * v), "m", errs)
    return "calcolo"


def level3(sample, p, text, errs):
    case = p["case"]
    if case == "grammi":
        g = OBJECT_G.get(p["object"])
        if g is None or F(g) != F(str(p["g"])):
            errs.append("object or mass not in the table of the spec")
            return case
        v = p["v"]
        if not (isinstance(v, int) and 11 <= v <= 99 and v % 10):
            errs.append("speed out of range")
        need(text, p["object"], errs)
        need(text, f"{tex(g)}\\,\\text{{g}}", errs)
        need(text, f"{v}\\,\\text{{m/s}}", errs)
        computed(sample, H / (F(g) / 1000 * v), "m", errs, 2)
    elif case == "picometri":
        v = from_sci(p["v"])
        need(text, f"{sci_tex(v)}\\,\\text{{m/s}}", errs)
        need(text, "in picometri", errs)
        pm = H / (M_E * v) * 10**12
        if near_tie(pm) or not 100 <= pm < 1000:
            errs.append("the wavelength is not a plain number of three figures")
        right_value(sample, f"{plain(pm)} pm", errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def level4(sample, p, text, errs):
    case = p["case"]
    if case == "velocita":
        pm = p["pm"]
        if not (isinstance(pm, int) and 100 <= pm <= 999):
            errs.append("wavelength out of range")
        need(text, f"{pm}\\,\\text{{pm}}", errs)
        need(text, f"{sci_tex(M_E)}\\,\\text{{kg}}", errs)
        computed(sample, H / (M_E * pm * F(10) ** -12), "m/s", errs)
    elif case == "massa":
        v, lam = from_sci(p["v"]), from_sci(p["lam"])
        need(text, f"{sci_tex(v)}\\,\\text{{m/s}}", errs)
        need(text, f"{sci_tex(lam)}\\,\\text{{m}}", errs)
        need(text, f"{sci_tex(M_E)}\\,\\text{{kg}}", errs)
        need(text, f"{sci_tex(M_P)}\\,\\text{{kg}}", errs)
        m = H / (lam * v)
        close = [name for name, mass in (("elettrone", M_E), ("protone", M_P)) if abs(m / mass - 1) < F(1, 100)]
        if len(close) != 1:
            errs.append("the mass is not the electron's nor the proton's")
        else:
            right_value(sample, close[0], errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def level5(sample, p, text, errs):
    case = p["case"]
    if case == "calcolo":
        dx = from_sci(p["dx"])
        if not F(10) ** -11 <= dx < F(10) ** -8:
            errs.append("uncertainty on the position out of range")
        need(text, f"\\Delta x = {sci_tex(dx, 2)}\\,\\text{{m}}", errs)
        need(text, f"{sci_tex(M_E)}\\,\\text{{kg}}", errs)
        computed(sample, H / (4 * PI * M_E * dx), "m/s", errs, 2)
    elif case == "proporzione":
        need(text, f"L'incertezza sulla posizione di un elettrone {p['come']}.", errs)
        right_text(sample, INVERSE[p["come"]], errs)
    elif case == "affermazione":
        need(text, "è vera?" if p["want"] else "è sbagliata?", errs)
        statements(sample, PRINCIPLE, p["want"], errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def level6(sample, p, text, errs):
    case = p["case"]
    if case == "esperimento":
        need(text, "si comportano anche come onde", errs)
        right_value(sample, "diffrazione", errs)
        right_text(sample, "la diffrazione di un fascio di elettroni attraverso un cristallo", errs)
    elif case == "affermazione":
        need(text, "è vera?" if p["want"] else "è sbagliata?", errs)
        statements(sample, ORBITAL, p["want"], errs)
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
