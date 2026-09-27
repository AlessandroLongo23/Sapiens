"""Checker for distanza-punto-retta, from specs/exercises/distanza-punto-retta.md and lesson 85.

Everything is recomputed from the LaTeX the student sees: the points and the lines are read back from
the problem (and, at level 1, the axis from the prompt), the lines become SymPy Line objects, and the
distance comes from Line.distance, the area and the height from Triangle and Line.distance. The params
are only compared with what was read. The answer must be the exact value, a number when it is rational
and a rationalised radical k*sqrt(r)/d otherwise (r square-free, gcd(k, d) = 1, no root below); every
choice option is parsed back from its LaTeX, and exactly one of the four equals the truth.
"""
import re
from math import gcd

from sympy import Line, Point, Rational, Symbol, Triangle, expand, factorint, sqrt, sympify

from verify import canon, exact

X, Y = Symbol("x"), Symbol("y")

CASE_RANGES = {
    1: {"orizzontale": (0.25, 0.45), "verticale": (0.25, 0.45), "asse": (0.20, 0.40)},
    4: {"origine": (0.18, 0.42), "frazionari": (0.58, 0.82)},
    5: {"implicite": (0.50, 0.70), "esplicite": (0.30, 0.50)},
    6: {"area": (0.50, 0.70), "altezza": (0.30, 0.50)},
}

FORBIDDEN = [
    ("1x", re.compile(r"(?<![\d}])1\s*[xy]")),
    ("0x", re.compile(r"(?<![\d}])0\s*[xy]")),
    ("+ -", re.compile(r"\+\s*-")),
    ("- -", re.compile(r"-\s*-")),
    ("+ +", re.compile(r"\+\s*\+")),
    ("zero term", re.compile(r"[+-]\s*0(?!\d)")),
]


class TexError(Exception):
    pass


# ---------------------------------------------------------------------------
# Reading the LaTeX


def number(tex):
    """-3, \\frac{1}{2}, -\\frac{5}{4}."""
    m = re.fullmatch(r"\s*(-?)\s*(?:(\d+)|\\frac\{(\d+)\}\{(\d+)\})\s*", tex)
    if not m:
        raise TexError(f"not a number: {tex!r}")
    v = Rational(int(m.group(2))) if m.group(2) else Rational(int(m.group(3)), int(m.group(4)))
    if m.group(3) and (int(m.group(4)) < 2 or gcd(int(m.group(3)), int(m.group(4))) != 1):
        raise TexError(f"fraction not reduced: {tex!r}")
    return -v if m.group(1) else v


def linear(tex):
    """A side of a line equation: 3x - 4y + 8, y, -\\frac{5}{4}x - \\frac{1}{4}, 0."""
    s = tex.strip()
    if not re.fullmatch(r"[0-9xy+\- ]*(?:\\frac\{\d+\}\{\d+\}[0-9xy+\- ]*)*", s):
        raise TexError(f"unexpected characters in {tex!r}")
    s = re.sub(r"\\frac\{(\d+)\}\{(\d+)\}", r"(\1/\2)", s)
    s = re.sub(r"([0-9)])\s*([xy])", r"\1*\2", s)
    return expand(sympify(s, locals={"x": X, "y": Y}))


def line_eq(tex):
    """'3x - 4y + 8 = 0' or 'y = 2x + 3' -> (expression = 0, kind)."""
    lhs, rhs = tex.split("=")
    lhs, rhs = lhs.strip(), rhs.strip()
    e = expand(linear(lhs) - linear(rhs))
    kind = "implicita" if rhs == "0" else "esplicita" if lhs == "y" else "altro"
    return e, kind


def coeffs(e):
    a, b = e.coeff(X), e.coeff(Y)
    c = expand(e - a * X - b * Y)
    if c.free_symbols:
        raise TexError(f"not linear: {e}")
    return a, b, c


def sym_line(e):
    a, b, c = coeffs(e)
    if b != 0:
        return Line(Point(0, -c / b), Point(1, -(a + c) / b))
    return Line(Point(-c / a, 0), Point(-c / a, 1))


def read_problem(problem):
    points, lines = {}, {}
    for item in re.split(r"\s*\\quad\s*", problem.strip()):
        m = re.fullmatch(r"([A-Z])\((.+), (.+)\)", item)
        if m:
            points[m.group(1)] = (number(m.group(2)), number(m.group(3)))
            continue
        m = re.fullmatch(r"([rs])\\colon (.+)", item)
        if m:
            lines[m.group(1)] = (m.group(2), *line_eq(m.group(2)))
            continue
        raise TexError(f"unreadable item {item!r}")
    return points, lines


def value_tex(tex):
    """An option or an answer as written: 3, -\\frac{7}{2}, 2\\sqrt{5}, -\\frac{8\\sqrt{5}}{5}, \\frac{\\sqrt{41}}{41}.
    Returns (value, rationalised form ok, why not)."""
    s = tex.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d*)\\sqrt\{(\d+)\}\}\{(\d+)\}", s) or re.fullmatch(r"(-?)(\d*)\\sqrt\{(\d+)\}()", s)
    if m:
        sign, k, r, d = m.group(1), int(m.group(2) or 1), int(m.group(3)), int(m.group(4) or 1)
        if m.group(2) == "1":
            return None, False, "coefficient 1 written"
        v = (-1 if sign else 1) * k * sqrt(r) / d
        if r < 2 or any(e > 1 for e in factorint(r).values()):
            return v, False, f"radicand {r} not square-free"
        if m.group(4) and (d < 2 or gcd(k, d) != 1):
            return v, False, "fraction not reduced"
        return v, True, ""
    return number(s), True, ""


# ---------------------------------------------------------------------------
# Truth


def truth_of(sample, points, lines):
    lvl = sample["level"]
    p = sample["params"]
    if lvl <= 4:
        name = "O" if "O" in points else "P"
        P = Point(*points[name])
        if lvl == 1 and not lines:
            m = re.fullmatch(r"Calcola la distanza del punto P dall'asse ([xy])\.", sample["prompt"])
            if not m:
                raise TexError("level 1 without a line and without an axis in the prompt")
            L = Line(Point(0, 0), Point(1, 0)) if m.group(1) == "x" else Line(Point(0, 0), Point(0, 1))
        else:
            L = sym_line(lines["r"][1])
        return L.distance(P)
    if lvl == 5:
        r, s = sym_line(lines["r"][1]), sym_line(lines["s"][1])
        return s.distance(r.points[0])
    A, B, C = (Point(*points[k]) for k in "ABC")
    if p.get("case") == "area":
        return abs(Triangle(A, B, C).area)
    return Line(A, B).distance(C)


# ---------------------------------------------------------------------------
# Level constraints


def is_int(v):
    return v.is_integer


def level_errors(sample, points, lines, truth):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    prob = sample["problem"]
    kind = None
    for name, rx in FORBIDDEN:
        if rx.search(prob):
            errs.append(f"problem contains forbidden '{name}': {prob}")
    coords = [c for pt in points.values() for c in pt]
    if truth == 0:
        errs.append("distance 0: the point is on the line")
    if lvl == 1:
        P = points.get("P")
        if not P or 0 in P or any(abs(c) > 8 or not c.is_integer for c in P):
            errs.append("level 1: P needs nonzero integer coordinates in [-8, 8]")
        if lines:
            tex, e, _ = lines["r"]
            mm = re.fullmatch(r"([xy]) = (-?\d+)", tex)
            if not mm or mm.group(2) == "0" or abs(int(mm.group(2))) > 8:
                errs.append(f"level 1: line {tex!r} not x = h / y = k with h, k nonzero in [-8, 8]")
            kind = "orizzontale" if mm and mm.group(1) == "y" else "verticale"
        else:
            kind = "asse"
        if not is_int(truth):
            errs.append("level 1: distance not integer")
    elif lvl == 2:
        tex, e, k = lines["r"]
        a, b, c = coeffs(e)
        if k != "implicita" or not all(v.is_integer for v in (a, b, c)):
            errs.append("level 2: line not in implicit form with integer coefficients")
        elif sqrt(a**2 + b**2) not in (5, 10, 13) or c == 0 or abs(c) > 30 or gcd(gcd(int(a), int(b)), int(c)) != 1:
            errs.append(f"level 2: a, b not Pythagorean or c out of range: {tex}")
        if not is_int(truth):
            errs.append("level 2: distance not integer")
        if any(abs(v) > 6 or not v.is_integer for v in coords):
            errs.append("level 2: P out of [-6, 6]")
    elif lvl == 3:
        tex, e, k = lines["r"]
        mm = re.fullmatch(r"y = (-?\d*)x ([+-]) (\d+)", tex)
        if k != "esplicita" or not mm:
            errs.append(f"level 3: line not y = mx + q with integers: {tex}")
        else:
            m = coeffs(e)[0] / -coeffs(e)[1]
            if m == 0 or abs(m) > 4 or not m.is_integer:
                errs.append(f"level 3: m = {m}")
        if truth.is_rational:
            errs.append("level 3: distance rational, nothing to rationalise")
        if any(abs(v) > 5 or not v.is_integer for v in coords):
            errs.append("level 3: P out of [-5, 5]")
    elif lvl == 4:
        tex, e, k = lines["r"]
        a, b, c = coeffs(e)
        m, qq = -a / b, -c / b
        if k != "esplicita" or m.is_integer or m.q not in (2, 3, 4) or qq.q not in (1, 2, 3, 4) or m.q % qq.q:
            errs.append(f"level 4: line needs y = (p/s)x + q, s in 2..4: {tex}")
        if truth.is_rational:
            errs.append("level 4: distance rational")
        if "O" in points:
            kind = "origine"
            if points["O"] != (0, 0):
                errs.append("O is not the origin")
            if p.get("case") != "origine":
                errs.append("params.case is not origine")
        else:
            kind = "frazionari"
            x0, y0 = points["P"]
            if (x0, y0) == (0, 0):
                errs.append("level 4: P is the origin but the case is not origine")
            # numerator of s·(mx + q - y), s > 0: negative when P is above the line
            if m * x0 + qq - y0 >= 0:
                errs.append("level 4: numerator not negative")
            if any(abs(v) > 5 or not v.is_integer for v in coords):
                errs.append("level 4: P out of [-5, 5]")
    elif lvl == 5:
        (tr, er, kr), (ts, es, ks) = lines["r"], lines["s"]
        r, s = sym_line(er), sym_line(es)
        if not r.is_parallel(s) or r == s:
            errs.append("level 5: lines not parallel and distinct")
        if kr == ks == "implicita":
            kind = "implicite"
            ar, br, cr = coeffs(er)
            as_, bs, cs = coeffs(es)
            ratio = as_ / ar
            if ratio < 1:
                ratio = 1 / ratio
            if ratio not in (2, 3):
                errs.append(f"level 5: ratio of the coefficients {ratio}, expected 2 or 3")
            big = (as_, bs, cs) if abs(as_) > abs(ar) else (ar, br, cr)
            if gcd(gcd(int(big[0]), int(big[1])), int(big[2])) != 1:
                errs.append("level 5: the multiple line can be divided: no trap")
            if abs(cr) > 30 or abs(cs) > 30:
                errs.append("level 5: constant term over 30")
        elif kr == ks == "esplicita":
            kind = "esplicite"
            m = -coeffs(er)[0] / coeffs(er)[1]
            if not m.is_integer or abs(m) > 3:
                errs.append(f"level 5: m = {m}")
        else:
            errs.append("level 5: the two lines are not in the same form")
    elif lvl == 6:
        A, B, C = (points[k] for k in "ABC")
        if A[0] == B[0] or A[1] == B[1]:
            errs.append("level 6: AB parallel to an axis")
        area = abs(Triangle(Point(*A), Point(*B), Point(*C)).area) if Point(*A) != Point(*B) else 0
        if not area or area > 30:
            errs.append(f"level 6: area {area}")
        if any(abs(v) > 10 or not v.is_integer for v in coords):
            errs.append("level 6: coordinates over 10")
        ask = "area" if sample["prompt"].startswith("Calcola l'area") else "altezza" if "altezza" in sample["prompt"] else None
        if ask != p.get("case"):
            errs.append(f"prompt asks {ask}, params.case {p.get('case')}")
        kind = ask
    else:
        errs.append(f"unknown level {lvl}")
    if p.get("case") != kind and kind is not None:
        errs.append(f"params.case {p.get('case')} but the problem is {kind}")
    return errs, kind


# ---------------------------------------------------------------------------


def check(sample):
    errs = []
    try:
        points, lines = read_problem(sample["problem"])
        truth = canon(truth_of(sample, points, lines))
    except TexError as e:
        return [f"problem unreadable: {e}"], None
    errs_l, kind = level_errors(sample, points, lines, truth)
    errs += errs_l

    # params agree with what the student reads
    p = sample["params"]
    if canon(exact(p["distance"])) != canon(truth):
        errs.append(f"params.distance {p['distance']} != {truth}")

    ans = sample["answer"]
    if truth.is_rational:
        if ans.get("kind") != "number":
            errs.append("rational distance must be a number answer")
        elif not re.fullmatch(r"-?\d+(/\d+)?", ans["value"]) or Rational(ans["value"]) != truth:
            errs.append(f"answer {ans.get('value')} != {truth}")
    else:
        if ans.get("kind") != "expression" or ans.get("form") != "rationalized":
            errs.append("irrational distance must be an expression, form rationalized")
        else:
            if canon(exact(ans["value"])) != canon(truth):
                errs.append(f"answer {ans['value']} != {truth}")
            try:
                v, ok, why = value_tex(ans["latex"])
                if not ok:
                    errs.append(f"answer latex not rationalised/simplified: {why}")
                elif canon(v) != canon(truth):
                    errs.append(f"answer latex {ans['latex']} != {truth}")
            except TexError as e:
                errs.append(f"answer latex unreadable: {e}")

    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    for st in [sample.get("solution", "")] + sample.get("steps", []):
        if re.search(r"\\begin\{(aligned|gathered|array)\}", st) and "\\text" in st:
            errs.append("environment with \\text in a step")

    ch = sample.get("choice")
    if ch is None:
        errs.append("no choice variant")
    else:
        opts = ch.get("options", [])
        if len(opts) != 4:
            errs.append(f"{len(opts)} options")
        keys = []
        for o in opts:
            try:
                v, ok, why = value_tex(o["latex"])
            except TexError as e:
                errs.append(f"option unreadable: {e}")
                continue
            if not ok:
                errs.append(f"option {o['latex']} not in simplified form: {why}")
            if len(o["values"]) != 1 or canon(exact(o["values"][0])) != canon(v):
                errs.append(f"option latex {o['latex']} != values {o['values']}")
            keys.append(canon(v))
        if len(set(keys)) != len(keys):
            errs.append("options not distinct")
        right = [i for i, k in enumerate(keys) if k == canon(truth)]
        if len(right) != 1:
            errs.append(f"{len(right)} options equal the truth")
        elif ch.get("correct") != right[0]:
            errs.append(f"choice.correct {ch.get('correct')} but the truth is option {right[0]}")
    return errs, kind
