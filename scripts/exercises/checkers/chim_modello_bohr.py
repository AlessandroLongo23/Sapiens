"""Checker for chim-modello-bohr (specs/exercises/chim-modello-bohr.md), written from the spec and the lesson
49-chim-modello-bohr.md, not from the generator.

The energies of the levels are recomputed as the lesson's table gives them, E_n = -2,18 · 10^-18 J / n^2 rounded to
three figures; the energy of a jump is their difference rounded to three figures, and the wavelength is h c over that
energy, three figures. The data come from `params` and are looked for in the text of the problem.
"""
from fractions import Fraction as F

from checkers._chim3_a import C, H, RYDBERG, check_number, common, need, plain, prose, right_value, rounded, sci_tex, sci_value, from_sci, near_tie, tex

CASE_RANGES = {
    1: {"raggio": (0.2, 0.47), "verso": (0.2, 0.47), "stato": (0.2, 0.47)},
    2: {"energia": (0.35, 0.65), "livello": (0.13, 0.37), "confronto": (0.13, 0.37)},
    3: {"salto": (0.6, 0.9), "ionizzazione": (0.1, 0.4)},
    4: {"lambda": (0.35, 0.65), "serie": (0.13, 0.37), "confronto": (0.13, 0.37)},
    5: {"da-lambda": (0.35, 0.65), "da-energia": (0.35, 0.65)},
}

A0 = F(529, 10)  # pm
LEVEL = {n: rounded(RYDBERG / n**2) for n in range(1, 7)}  # the lesson's table, without the minus
SERIES = {1: ("Lyman", "ultravioletto"), 2: ("Balmer", "visibile"), 3: ("Paschen", "infrarosso")}


def neg(x):
    return f"-{sci_tex(x)}\\,\\text{{J}}"


def jump(a, b):
    """(energy in J, wavelength in nm) of the jump between two levels, each rounded to three figures."""
    dE = rounded(abs(LEVEL[a] - LEVEL[b]))
    return dE, rounded(H * C / dE * 10**9)


def nm_value(x):
    return f"{plain(x)} nm" if x < 1000 else f"{sci_value(x)} nm"


def nm_tex(x):
    return f"{tex(plain(x))}\\,\\text{{nm}}" if x < 1000 else f"{sci_tex(x)}\\,\\text{{nm}}"


def levels_ok(lo, hi, errs):
    if not (isinstance(lo, int) and isinstance(hi, int) and 1 <= lo < hi <= 6):
        errs.append(f"levels {lo}, {hi} out of range")
        return False
    return True


def level1(sample, p, text, errs):
    case = p["case"]
    if case == "raggio":
        n = p["n"]
        if not 2 <= n <= 6:
            errs.append("n out of range")
        need(text, f"$n = {n}$", errs)
        need(text, "52{,}9\\,\\text{pm}", errs)
        r = n * n * A0
        right_value(sample, f"{plain(r)} pm" if r < 1000 else f"{sci_value(r)} pm", errs)
    elif case == "verso":
        a, b = p["from"], p["to"]
        if a == b or not (1 <= a <= 6 and 1 <= b <= 6):
            errs.append("levels out of range")
        need(text, f"dal livello $n = {a}$ al livello $n = {b}$", errs)
        right_value(sample, "assorbe" if b > a else "emette", errs)
    elif case == "stato":
        n = p["n"]
        need(text, f"nel livello $n = {n}$", errs)
        right_value(sample, "fondamentale" if n == 1 else "eccitato", errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def level2(sample, p, text, errs):
    case = p["case"]
    if case == "energia":
        n = p["n"]
        if not 2 <= n <= 6:
            errs.append("n out of range")
        need(text, f"$n = {n}$", errs)
        right_value(sample, f"-{sci_value(LEVEL[n])} J", errs)
    elif case == "livello":
        n = p["n"]
        if not 2 <= n <= 6:
            errs.append("n out of range")
        need(text, neg(LEVEL[n]), errs)
        right_value(sample, str(n), errs)
    elif case == "confronto":
        lo, hi = p["lo"], p["hi"]
        levels_ok(lo, hi, errs)
        need(text, f"$n = {lo}$ oppure $n = {hi}$", errs)
        need(text, "più energia" if p["more"] else "meno energia", errs)
        # -E_n grows towards zero with n: the higher level has more energy.
        right_value(sample, str(hi if p["more"] else lo), errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def level3(sample, p, text, errs):
    case = p["case"]
    if case == "ionizzazione":
        n = p["n"]
        if not 1 <= n <= 4:
            errs.append("n out of range")
        need(text, f"nel livello $n = {n}$", errs)
        right_value(sample, f"{sci_value(LEVEL[n])} J", errs)
    elif case == "salto":
        lo, hi = p["lo"], p["hi"]
        if levels_ok(lo, hi, errs):
            raw = abs(LEVEL[lo] - LEVEL[hi])
            if near_tie(raw):
                errs.append("the energy of this jump hangs on a rounding")
            if p["up"]:
                need(text, f"sale dal livello $n = {lo}$ al livello $n = {hi}$", errs)
                need(text, "assorbe", errs)
            else:
                need(text, f"scende dal livello $n = {hi}$ al livello $n = {lo}$", errs)
                need(text, "emette", errs)
            right_value(sample, f"{sci_value(raw)} J", errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def level4(sample, p, text, errs):
    case = p["case"]
    if case == "lambda":
        lo, hi = p["lo"], p["hi"]
        if levels_ok(lo, hi, errs):
            if lo > 3:
                errs.append("only the series of Lyman, Balmer and Paschen")
            raw = abs(LEVEL[lo] - LEVEL[hi])
            dE, nm = jump(lo, hi)
            if near_tie(raw) or near_tie(H * C / dE * 10**9):
                errs.append("the wavelength of this jump hangs on a rounding")
            need(text, f"scende dal livello $n = {hi}$ al livello $n = {lo}$", errs)
            right_value(sample, nm_value(nm), errs)
    elif case == "serie":
        lo, hi = p["lo"], p["hi"]
        if levels_ok(lo, hi, errs):
            need(text, f"scende dal livello $n = {hi}$ al livello $n = {lo}$", errs)
            if lo not in SERIES:
                errs.append("no series for this arrival level")
            else:
                right_value(sample, f"{SERIES[lo][0]}-{SERIES[lo][1]}", errs)
    elif case == "confronto":
        lo, a, b = p["lo"], p["a"], p["b"]
        if not (1 <= lo < a < b <= 6):
            errs.append("levels out of range")
        need(text, f"${a} \\to {lo}$ oppure ${b} \\to {lo}$", errs)
        need(text, "più corta" if p["shorter"] else "più lunga", errs)
        # The jump from higher up has more energy, so the shorter wavelength.
        da, db = abs(LEVEL[lo] - LEVEL[a]), abs(LEVEL[lo] - LEVEL[b])
        if not db > da:
            errs.append("the energies do not grow with the starting level")
        right_value(sample, f"{b if p['shorter'] else a}-{lo}", errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def nearest_level(energy_without_minus):
    """The level whose n^2 is closest to 2,18e-18 / |E|; None when |E| is not close to any of them."""
    n2 = RYDBERG / energy_without_minus
    best = min(range(1, 8), key=lambda n: abs(n * n - n2))
    return best if abs(n2 / (best * best) - 1) < F(8, 100) else None


def level5(sample, p, text, errs):
    case = p["case"]
    lo = p["lo"]
    if case == "da-lambda":
        if lo not in (1, 2):
            errs.append("only Lyman and Balmer")
        nm = from_sci(p["nm"])
        need(text, f"serie di {SERIES[lo][0]}", errs)
        need(text, nm_tex(nm), errs)
        photon = H * C / (nm * F(10) ** -9)
        n = nearest_level(LEVEL[lo] - photon) if LEVEL[lo] > photon else None
    elif case == "da-energia":
        if not 1 <= lo <= 3:
            errs.append("starting level out of range")
        dE = from_sci(p["dE"])
        need(text, f"nel livello $n = {lo}$", errs)
        need(text, f"{sci_tex(dE)}\\,\\text{{J}}", errs)
        n = nearest_level(LEVEL[lo] - dE) if LEVEL[lo] > dE else None
    else:
        errs.append(f"unknown case {case}")
        return case
    if n is None or not lo < n <= 6:
        errs.append("the data do not lead to a level")
    else:
        check_number(sample, n, errs)
    return case


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    level = LEVELS.get(sample.get("level"))
    if not level:
        return errs + [f"unknown level {sample.get('level')}"], None
    if (sample["answer"]["kind"] == "number") != (sample["level"] == 5):
        errs.append("only level 5 is answered with a number")
    case = level(sample, sample["params"], prose(sample), errs)
    return errs, case
