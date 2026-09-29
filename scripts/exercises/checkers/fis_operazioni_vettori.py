"""Checker for fis-operazioni-vettori (specs/exercises/fis-operazioni-vettori.md).

Written from the spec and the lesson (docs/lezioni/fisica/riscritte/14-fis-operazioni-vettori.md). Levels 1-3 are
read from the text, and the scene must draw the same vectors (to scale along the directions of the text); levels
4-6 read the vectors from the scene, since the grid is the datum. The result is computed with sympy vectors; the
scene never draws it (only the solution scene does).
"""
import re

from sympy import Rational, sqrt

from checkers._vettori import check_choice, common, fmt_exact, num, parse_option, prose, scene_vectors

CASE_RANGES = {
    1: {"stesso verso": (0.20, 0.40), "versi opposti": (0.60, 0.80)},
    2: {"positivo": (0.35, 0.65), "negativo": (0.35, 0.65)},
    3: {"perpendicolari": (1.0, 1.0)},
    4: {"somma": (1.0, 1.0)},
    5: {"differenza": (1.0, 1.0)},
    6: {"tre forze": (1.0, 1.0)},
}

LR = {"destra": 1, "sinistra": -1}


def level1(s, sample, errs):
    m = re.fullmatch(
        r"Su una cassa agiscono due forze lungo la stessa retta orizzontale: \$\\vec\{F\}_1\$ di \$(\d+)\\,\\text\{N\}\$ verso (destra|sinistra) e \$\\vec\{F\}_2\$ di \$(\d+)\\,\\text\{N\}\$ verso (destra|sinistra)\. Quanto vale la forza risultante\?",
        s,
    )
    if not m:
        errs.append(f"level 1 text: {s!r}")
        return None
    f1 = Rational(m.group(1)) * LR[m.group(2)]
    f2 = Rational(m.group(3)) * LR[m.group(4)]
    if abs(f1) == abs(f2):
        errs.append("equal moduli")
    R = f1 + f2
    if R == 0:
        errs.append("null resultant")
        return None
    check_choice(sample, errs, f"{fmt_exact(abs(R))}\\,\\text{{N}}\\ \\text{{verso {'destra' if R > 0 else 'sinistra'}}}")
    for o in sample["answer"]["options"]:
        v, u, extra = parse_option(o["latex"])
        if u != "N" or extra not in ("verso destra", "verso sinistra") or num(v) <= 0:
            errs.append(f"option {o['latex']!r}")
    vecs = scene_vectors(sample["scene"])
    xs = [q[0] - p[0] for p, q, _ in vecs]
    if len(xs) != 2 or any(p[1] != q[1] for p, q, _ in vecs) or sorted(xs) != sorted([f1, f2]):
        errs.append("scene differs from the text")
    return "stesso verso" if f1 * f2 > 0 else "versi opposti"


AX = {"est": (1, 0), "ovest": (-1, 0), "nord": (0, 1), "sud": (0, -1), "l'alto": (0, 1), "il basso": (0, -1), "destra": (1, 0), "sinistra": (-1, 0)}
OPP = {"est": "ovest", "ovest": "est", "nord": "sud", "sud": "nord", "l'alto": "il basso", "il basso": "l'alto", "destra": "sinistra", "sinistra": "destra"}


def level2(s, sample, errs):
    m = re.fullmatch(r"Il vettore \$\\vec\{a\}\$ è (una forza|uno spostamento) di \$(\d+)\\,\\text\{(N|m|km)\}\$ verso (.*)\. Quanto vale il vettore \$(-?[\d{},]*)\\vec\{a\}\$\?", s)
    if not m or m.group(4) not in AX:
        errs.append(f"level 2 text: {s!r}")
        return None
    a, unit, d = Rational(m.group(2)), m.group(3), m.group(4)
    if (unit == "N") != (m.group(1) == "una forza"):
        errs.append("unit and noun")
    ks = m.group(5)
    k = Rational(-1) if ks == "-" else num(ks)
    if k in (0, 1):
        errs.append(f"k = {k}")
    verso = d if k > 0 else OPP[d]
    check_choice(sample, errs, f"{fmt_exact(abs(k) * a)}\\,\\text{{{unit}}}\\ \\text{{verso {verso}}}")
    for o in sample["answer"]["options"]:
        v, u, extra = parse_option(o["latex"])
        if u != unit or extra not in (f"verso {d}", f"verso {OPP[d]}"):
            errs.append(f"option {o['latex']!r}")
        if num(v) < 0 and k > 0:
            errs.append("negative option with positive k")
    vecs = scene_vectors(sample["scene"])
    if len(vecs) != 1:
        errs.append("the scene draws more than a")
    else:
        p, q, _ = vecs[0]
        w = (q[0] - p[0], q[1] - p[1])
        if w != (AX[d][0] * a, AX[d][1] * a):
            errs.append("scene vector differs from the text")
    return "positivo" if k > 0 else "negativo"


def level3(s, sample, errs):
    m = re.fullmatch(
        r"Due corde tirano lo stesso anello: \$\\vec\{F\}_1\$ di \$(\d+)\\,\\text\{N\}\$ verso (est|ovest|nord|sud) e \$\\vec\{F\}_2\$ di \$(\d+)\\,\\text\{N\}\$ verso (est|ovest|nord|sud)\. Quanto vale il modulo della forza risultante\?",
        s,
    )
    if not m:
        errs.append(f"level 3 text: {s!r}")
        return None
    F1 = tuple(Rational(m.group(1)) * c for c in AX[m.group(2)])
    F2 = tuple(Rational(m.group(3)) * c for c in AX[m.group(4)])
    if F1[0] * F2[0] + F1[1] * F2[1] != 0:
        errs.append("not perpendicular")
    R = sqrt((F1[0] + F2[0]) ** 2 + (F1[1] + F2[1]) ** 2)
    if not R.is_rational:
        errs.append(f"resultant {R} not exact")
        return None
    check_choice(sample, errs, f"{fmt_exact(R)}\\,\\text{{N}}")
    ws = sorted(((q[0] - p[0], q[1] - p[1]) for p, q, _ in scene_vectors(sample["scene"])), key=str)
    if ws != sorted([F1, F2], key=str):
        errs.append("scene differs from the text")
    return "perpendicolari"


def grid(s, sample, errs, lvl):
    m = re.fullmatch(r"(Due forze sono applicate|Due spostamenti partono|Tre forze sono applicate)(?: allo| dallo) stesso punto\. Nella figura ogni quadretto vale \$(\d+)\\,\\text\{(N|m)\}\$\. Quanto vale il modulo di \$(.*)\$\?", s)
    if not m:
        errs.append(f"level {lvl} text: {s!r}")
        return None
    e, unit, expr = Rational(m.group(2)), m.group(3), m.group(4)
    want = {4: r"\vec{a} + \vec{b}", 5: r"\vec{a} - \vec{b}", 6: r"\vec{F}_1 + \vec{F}_2 + \vec{F}_3"}[lvl]
    if expr != want:
        errs.append(f"expression {expr!r}")
    if (unit == "N") != m.group(1).endswith("applicate"):
        errs.append("unit and noun")
    vecs = scene_vectors(sample["scene"])
    names = [(w.get("nome"), w.get("sub")) for _, _, w in vecs]
    expect = [("F", "1"), ("F", "2"), ("F", "3")] if lvl == 6 else [("a", None), ("b", None)]
    if names != expect:
        errs.append(f"scene vectors {names}")
        return None
    ws = []
    for p, q, w in vecs:
        if p != (0, 0) or q[0] != int(q[0]) or q[1] != int(q[1]):
            errs.append("vector not from the origin to a crossing")
        if q[0] == 0 or q[1] == 0:
            errs.append("vector along a grid line")
        ws.append(q)
    if lvl == 5:
        r = (ws[0][0] - ws[1][0], ws[0][1] - ws[1][1])
    else:
        r = (sum(w[0] for w in ws), sum(w[1] for w in ws))
    mod = sqrt(r[0] ** 2 + r[1] ** 2)
    if not mod.is_rational or mod == 0:
        errs.append(f"modulus {mod} not a whole number of squares")
        return None
    check_choice(sample, errs, f"{fmt_exact(mod * e)}\\,\\text{{{unit}}}")
    for o in sample["answer"]["options"]:
        v, u, extra = parse_option(o["latex"])
        if u != unit or extra or num(v) <= 0:
            errs.append(f"option {o['latex']!r}")
    sol = scene_vectors(sample["solutionScene"])
    if not any(p == (0, 0) and q == r for p, q, _ in sol):
        errs.append("solution scene lacks the result")
    return {4: "somma", 5: "differenza", 6: "tre forze"}[lvl]


LEVELS = {1: level1, 2: level2, 3: level3}


def check(sample):
    errs = []
    lvl = sample.get("level")
    if lvl not in (1, 2, 3, 4, 5, 6):
        return [f"unknown level {lvl}"], None
    common(sample, errs)
    if not sample.get("scene") or not sample.get("solutionScene"):
        errs.append("scene missing")
        return errs, None
    try:
        s = prose(sample["problem"])
        kind = LEVELS[lvl](s, sample, errs) if lvl in LEVELS else grid(s, sample, errs, lvl)
    except ValueError as e:
        return errs + [str(e)], None
    return errs, kind
