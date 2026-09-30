"""Checker for ottica-geometrica (specs/exercises/ottica-geometrica.md).

Written from the spec and the lesson (docs/lezioni/fisica/riscritte/31-ottica-geometrica.md). The problem is read
back from its text and solved with exact fractions: t = d/c with c = 3,00 * 10^8 m/s, d = c*t, the light-year as
9,46 * 10^15 m, the shadow H = h*D/d and the camera obscura h' = h*d'/d, with the units converted. Results are
rounded half up to the significant figures of the spec (3 with c, 2 otherwise), refusing values within 1e-9 of a
boundary, and written plainly between 10^-2 and 10^3, in scientific notation outside. The scenes are measured: the
card where the text puts it, no rays and no answer in the problem scene, and in the solution the rays from the
source grazing the card's edges.
"""
import re

from sympy import Rational, floor, log

from checkers._vettori import check_choice, common, num, prose, round_sig

CASE_RANGES = {
    2: {"chilometri": (0.40, 0.60), "minuti": (0.40, 0.60)},
    3: {"in metri": (0.40, 0.60), "in anni luce": (0.40, 0.60)},
    5: {"immagine": (0.40, 0.60), "oggetto": (0.40, 0.60)},
    6: {"distanza": (0.40, 0.60), "altezza": (0.40, 0.60)},
}

C = Rational(3 * 10**8)
LY = Rational(946 * 10**13)
SCI = r"(\d(?:\{,\}\d+)?) \\cdot 10\^\{(-?\d+)\}"
C_TEX = r"Usa \$c = 3\{,\}00 \\cdot 10\^\{8\}\\,\\text\{m/s\}\$\."
LY_TEX = r"Usa \$1\\,\\text\{anno luce\} = 9\{,\}46 \\cdot 10\^\{15\}\\,\\text\{m\}\$\."


def sci(m, e):
    return num(m) * Rational(10) ** int(e)


def written(x, n):
    """The way the spec writes a result with n significant figures."""
    e = int(floor(log(x, 10).evalf(50)))
    if Rational(10) ** e > x:
        e -= 1
    if Rational(10) ** (e + 1) <= x:
        e += 1
    if -2 <= e <= 2:
        r = round_sig(x, n)
        if r is not None:
            return r
    m = round_sig(x / Rational(10) ** e, n)
    if m is None:
        return None
    if num(m) >= 10:
        m = round_sig(x / Rational(10) ** (e + 1), n)
        e += 1
    return f"{m} \\cdot 10^{{{e}}}"


def answer(sample, errs, x, n, unit):
    w = written(x, n)
    if w is None:
        errs.append("result at a rounding boundary")
        return
    check_choice(sample, errs, f"{w}\\,\\text{{{unit}}}")
    for o in sample["answer"]["options"]:
        if not o["latex"].endswith(f"\\,\\text{{{unit}}}"):
            errs.append(f"option unit {o['latex']!r}")
        body = o["latex"][: -len(f"\\,\\text{{{unit}}}")]
        m = re.fullmatch(SCI, body)
        digits = (m.group(1) if m else body).replace("{,}", "").lstrip("0")
        if len(digits) != n:
            errs.append(f"option {body} has not {n} figures")


def els(sc, kind):
    return [e for e in sc["data"]["elementi"] if e["tipo"] == kind]


def shadow_scene(sample, errs, d_cm, D_cm, card_in_problem):
    X = Rational(6)
    xd = d_cm * X / D_cm
    sc, sol = sample["scene"], sample["solutionScene"]
    cards = els(sc, "ostacolo")
    if card_in_problem != bool(cards):
        errs.append("problem scene: card shown or missing")
    if els(sc, "raggio"):
        errs.append("problem scene has rays")
    c = els(sol, "ostacolo")
    if len(c) != 1 or abs(Rational(str(c[0]["da"][0])) - xd) > Rational(1, 100):
        errs.append("solution card misplaced")
        return
    w = Rational(str(c[0]["a"][1]))
    for r in els(sol, "raggio"):
        x1, y1 = Rational(str(r["a"][0])), Rational(str(r["a"][1]))
        if r["da"] != [0, 0] or x1 != X or abs(abs(y1) - w * X / xd) > Rational(1, 100):
            errs.append("a ray does not graze the card")
    if len(els(sol, "raggio")) != 2:
        errs.append("solution rays")


def camera(sample, errs):
    """The image on the back wall, where the lines from the object's ends through the hole reach it."""
    sol = sample["solutionScene"]
    box, obj, img = els(sol, "scatola"), els(sol, "oggetto"), els(sol, "immagine")
    if len(box) != 1 or len(obj) != 1 or len(img) != 1:
        errs.append("solution camera")
        return
    b = box[0]
    hole = (Rational(str(b["x0"])), Rational(str(b["foro"])))
    x = Rational(str(img[0]["piede"][0]))
    if abs(x - Rational(str(b["x1"]))) > Rational(1, 10):
        errs.append("image not on the back wall")
    ox, oy = Rational(str(obj[0]["piede"][0])), Rational(str(obj[0]["piede"][1]))
    for y_obj, y_img in ((oy, Rational(str(img[0]["piede"][1]))), (oy + Rational(str(obj[0]["h"])), Rational(str(img[0]["piede"][1])) + Rational(str(img[0]["h"])))):
        want = hole[1] + (hole[1] - y_obj) * (x - hole[0]) / (hole[0] - ox)
        if abs(want - y_img) > Rational(3, 100):
            errs.append("image not on the rays through the hole")


def check(sample):
    errs = []
    lvl = sample.get("level")
    if lvl not in range(1, 7):
        return [f"unknown level {lvl}"], None
    common(sample, errs)
    try:
        s = prose(sample["problem"])
        kind = None
        if lvl == 1:
            m = re.fullmatch(r".+ \$" + SCI + r"\\,\\text\{m\}\$\. Quanto tempo impiega\? " + C_TEX, s)
            if not m:
                return errs + [f"level 1 text: {s!r}"], None
            answer(sample, errs, sci(m.group(1), m.group(2)) / C, 3, "s")
            kind = "metri"
        elif lvl == 2:
            m = re.fullmatch(r".+ \$" + SCI + r"\\,\\text\{km\}\$\. Quanto tempo impiega\? " + C_TEX, s)
            if m:
                answer(sample, errs, sci(m.group(1), m.group(2)) * 1000 / C, 3, "s")
                kind = "chilometri"
            else:
                m = re.fullmatch(r".+ impiega \$(\d+(?:\{,\}\d)?)\$ minuti per arrivare sulla Terra\. Quanti metri percorre\? " + C_TEX, s)
                if not m:
                    return errs + [f"level 2 text: {s!r}"], None
                answer(sample, errs, C * 60 * num(m.group(1)), 2, "m")
                kind = "minuti"
        elif lvl == 3:
            m = re.fullmatch(r"Una stella dista \$(\d+(?:\{,\}\d)?)\$ anni luce dalla Terra\. Quanti metri sono\? " + LY_TEX, s)
            if m:
                answer(sample, errs, num(m.group(1)) * LY, 2, "m")
                kind = "in metri"
            else:
                m = re.fullmatch(r"Una stella dista dalla Terra \$" + SCI + r"\\,\\text\{m\}\$\. Quanti anni luce sono\? " + LY_TEX, s)
                if not m:
                    return errs + [f"level 3 text: {s!r}"], None
                answer(sample, errs, sci(m.group(1), m.group(2)) / LY, 2, "anni luce")
                kind = "in anni luce"
        elif lvl == 4:
            m = re.fullmatch(r"Una lampadina puntiforme illumina un cartoncino alto \$(\d\{,\}\d)\\,\\text\{cm\}\$, a \$(\d\d)\\,\\text\{cm\}\$ da essa\. Uno schermo parallelo al cartoncino è a \$(\d\{,\}\d)\\,\\text\{m\}\$ dalla lampadina\. Quanto è alta l'ombra del cartoncino sullo schermo\?", s)
            if not m:
                return errs + [f"level 4 text: {s!r}"], None
            h, d, D = num(m.group(1)), num(m.group(2)), num(m.group(3)) * 100
            answer(sample, errs, h * D / d, 2, "cm")
            shadow_scene(sample, errs, d, D, True)
            kind = "vicino" if D <= Rational(5, 2) * d else "lontano"
        elif lvl == 5:
            m = re.fullmatch(r"Un albero alto \$(\d\{,\}\d|\d\d)\\,\\text\{m\}\$ si trova a \$(\d\{,\}\d|\d\d)\\,\\text\{m\}\$ dal foro di una camera oscura profonda \$(\d\d)\\,\\text\{cm\}\$\. Quanto è alta la sua immagine sulla parete di fondo\?", s)
            if m:
                h, d, dp = (num(m.group(i)) for i in (1, 2, 3))
                answer(sample, errs, h * dp / d, 2, "cm")
                kind = "immagine"
            else:
                m = re.fullmatch(r"Un edificio si trova a \$(\d\{,\}\d|\d\d)\\,\\text\{m\}\$ dal foro di una camera oscura profonda \$(\d\d)\\,\\text\{cm\}\$, e la sua immagine sulla parete di fondo è alta \$(\d\{,\}\d)\\,\\text\{cm\}\$\. Quanto è alto l'edificio\?", s)
                if not m:
                    return errs + [f"level 5 text: {s!r}"], None
                d, dp, hi = (num(m.group(i)) for i in (1, 2, 3))
                answer(sample, errs, hi * d / dp, 2, "m")
                kind = "oggetto"
            if els(sample["scene"], "immagine") or els(sample["scene"], "raggio"):
                errs.append("the problem scene shows the image")
            camera(sample, errs)
        else:
            m = re.fullmatch(r"Una lampadina puntiforme è a \$(\d\{,\}\d)\\,\\text\{m\}\$ da uno schermo\. A quale distanza dalla lampadina va messo un cartoncino alto \$(\d\{,\}\d)\\,\\text\{cm\}\$, parallelo allo schermo, perché la sua ombra sia alta \$(\d\d)\\,\\text\{cm\}\$\?", s)
            if m:
                D, h, H = num(m.group(1)) * 100, num(m.group(2)), num(m.group(3))
                d = h * D / H
                answer(sample, errs, d, 2, "cm")
                shadow_scene(sample, errs, d, D, False)
                kind = "distanza"
            else:
                m = re.fullmatch(r"Una lampadina puntiforme illumina un cartoncino a \$(\d\d)\\,\\text\{cm\}\$ da essa, e sullo schermo, parallelo al cartoncino e a \$(\d\{,\}\d)\\,\\text\{m\}\$ dalla lampadina, l'ombra è alta \$(\d\d)\\,\\text\{cm\}\$\. Quanto è alto il cartoncino\?", s)
                if not m:
                    return errs + [f"level 6 text: {s!r}"], None
                d, D, H = num(m.group(1)), num(m.group(2)) * 100, num(m.group(3))
                answer(sample, errs, H * d / D, 2, "cm")
                shadow_scene(sample, errs, d, D, True)
                kind = "altezza"
        if lvl >= 4 and (not sample.get("scene") or not sample.get("solutionScene")):
            errs.append("scene missing")
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
