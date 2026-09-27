"""Checker for il-coefficiente-angolare, written from specs/exercises/il-coefficiente-angolare.md.

It reads the points, the slope and the equations back from the LaTeX of the problem (not from params),
recomputes the answer with SymPy (Point, Line, slope, is_collinear, solve), reads every option back from its
LaTeX and compares it with its values, checks the form of the answer (explicit form with reduced coefficients,
implicit form with coprime integer coefficients and a > 0) and that every distractor is really wrong: two
options that are the same line, even written differently, are rejected.

Option keys: a number, "none" for a missing slope, a normalised line (a, b, c) with ax + by + c = 0, a point.
"""
import re
from math import gcd

from sympy import Line, Point, Poly, Rational, Symbol, oo, solve, symbols, sympify, zoo

from verify import FORBIDDEN, rat

X, Y = symbols("x y")
K = Symbol("k")

CASE_RANGES = {
    1: {"generica": (0.6, 0.8), "orizzontale": (0.08, 0.22), "verticale": (0.08, 0.22)},
    3: {"implicita": (0.4, 0.6), "da esplicitare": (0.17, 0.33), "due membri": (0.17, 0.33)},
    6: {"generica": (0.6, 0.8), "orizzontale": (0.08, 0.22), "verticale": (0.08, 0.22)},
    7: {"quale punto": (0.4, 0.6), "coordinata": (0.4, 0.6)},
}

NONE_TEX = r"\text{non esiste}"


# ---------------------------------------------------------------------------
# Reading LaTeX


def num(t):
    """-3, \\frac{2}{3}, -\\frac{5}{4}."""
    t = t.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        if int(m.group(3)) < 2 or gcd(int(m.group(2)), int(m.group(3))) != 1:
            raise ValueError(f"fraction not reduced: {t!r}")
        return Rational(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    if re.fullmatch(r"-?\d+", t):
        return Rational(int(t))
    raise ValueError(f"not a number: {t!r}")


def num_tex(r):
    r = Rational(r)
    if r.q == 1:
        return str(r.p)
    return ("-" if r < 0 else "") + rf"\frac{{{abs(r.p)}}}{{{r.q}}}"


def points(problem):
    """{'A': (x, y), ...} from 'A(1, 2) \\quad B\\left(\\frac{1}{2}, 3\\right)'; k stays a symbol."""
    out = {}
    for part in problem.split(r" \quad "):
        m = re.fullmatch(r"([A-Z])(?:\((.+), (.+)\)|\\left\((.+), (.+)\\right\))", part.strip())
        if not m:
            continue
        a, b = (m.group(2), m.group(3)) if m.group(2) is not None else (m.group(4), m.group(5))
        # the plain brackets only for integer coordinates
        if m.group(2) is not None and ("frac" in a or "frac" in b):
            raise ValueError(f"fractional point without \\left( \\right): {part!r}")
        if m.group(4) is not None and "frac" not in a + b:
            raise ValueError(f"integer point with \\left( \\right): {part!r}")
        out[m.group(1)] = (K if a == "k" else num(a), num(b))
    return out


def given_m(problem):
    m = re.search(r"\\quad m = (.+)$", problem)
    if not m:
        raise ValueError("no slope in the problem")
    return num(m.group(1))


def tex_to_sympy(t):
    s = t.strip()
    frac = re.compile(r"\\frac\{([^{}]*)\}\{([^{}]*)\}")
    while frac.search(s):
        s = frac.sub(r"((\1)/(\2))", s)
    if "\\" in s or "{" in s:
        raise ValueError(f"unreadable: {t!r}")
    s = re.sub(r"(\d|\))\s*([xy(])", r"\1*\2", s)
    if not re.fullmatch(r"[0-9xy+\-*/() ]+", s):
        raise ValueError(f"unexpected characters: {t!r}")
    return sympify(s, locals={"x": X, "y": Y})


def line_key(expr):
    """ax + by + c = 0 as (a, b, c): integers, gcd 1, a > 0 or a = 0 and b > 0."""
    P = Poly(expr, X, Y)
    if P.total_degree() != 1:
        raise ValueError(f"not a line: {expr}")
    a, b, c = P.coeff_monomial(X), P.coeff_monomial(Y), P.coeff_monomial(1)
    den = 1
    for v in (a, b, c):
        den = den * Rational(v).q // gcd(den, Rational(v).q)
    a, b, c = (int(v * den) for v in (a, b, c))
    g = gcd(gcd(a, b), c) or 1
    a, b, c = a // g, b // g, c // g
    if a < 0 or (a == 0 and b < 0):
        a, b, c = -a, -b, -c
    return (a, b, c)


def parse_line(tex):
    parts = tex.split(" = ")
    if len(parts) != 2:
        raise ValueError(f"not an equation: {tex!r}")
    return line_key(tex_to_sympy(parts[0]) - tex_to_sympy(parts[1]))


def sympy_line_key(L):
    a, b, c = L.coefficients
    return line_key(a * X + b * Y + c)


def explicit_tex(key):
    a, b, c = key
    if b == 0:
        return f"x = {num_tex(Rational(-c, a))}"
    m, q = Rational(-a, b), Rational(-c, b)
    out = ""
    if m != 0:
        coef = "" if abs(m) == 1 else num_tex(abs(m))
        out = ("-" if m < 0 else "") + coef + "x"
    if q != 0:
        out = num_tex(q) if not out else out + (" - " if q < 0 else " + ") + num_tex(abs(q))
    return "y = " + (out or "0")


def implicit_tex(key):
    a, b, c = key
    out = ""
    for coef, v in ((a, "x"), (b, "y"), (c, "")):
        if coef == 0:
            continue
        body = (str(abs(coef)) if abs(coef) != 1 or not v else "") + v
        if not out:
            out = ("-" if coef < 0 else "") + body
        else:
            out += (" - " if coef < 0 else " + ") + body
    return out + " = 0"


# ---------------------------------------------------------------------------
# Options


def option_key(o, kind):
    """The option read from its LaTeX, checked against its values."""
    tex, vals = o["latex"], o["values"]
    if kind == "number":
        if tex == NONE_TEX:
            if vals != ["none"]:
                raise ValueError(f"'non esiste' with values {vals}")
            return "none"
        v = num(tex)
        if vals != [str(v).replace(" ", "")]:
            raise ValueError(f"option {tex!r} != values {vals}")
        return v
    if kind in ("explicit", "implicit"):
        key = parse_line(tex)
        want = explicit_tex(key) if kind == "explicit" else implicit_tex(key)
        if tex != want:
            raise ValueError(f"option {tex!r} not in the required form {want!r}")
        if vals != ["line", *map(str, key)]:
            raise ValueError(f"option {tex!r} != values {vals}")
        return key
    if kind == "point":
        m = re.fullmatch(r"\\left\((.+), (.+)\\right\)", tex)
        if not m:
            raise ValueError(f"not a point: {tex!r}")
        p = (num(m.group(1)), num(m.group(2)))
        if vals != [str(p[0]), str(p[1])]:
            raise ValueError(f"option {tex!r} != values {vals}")
        return p
    raise ValueError(kind)


def check_choice(ch, truth, kind, errs, wrong=None):
    """Four distinct options, exactly one equal to the truth, `correct` pointing to it. `wrong(key)` is True when
    a key is a wrong answer (by default: different from the truth)."""
    if not ch:
        errs.append("no choice")
        return []
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options")
    try:
        keys = [option_key(o, kind) for o in opts]
    except Exception as e:  # noqa: BLE001
        errs.append(f"option unreadable: {e}")
        return []
    if len(set(keys)) != len(keys):
        errs.append(f"options not distinct: {[o['latex'] for o in opts]}")
    right = [i for i, k in enumerate(keys) if (k == truth if wrong is None else not wrong(k))]
    if len(right) != 1:
        errs.append(f"{len(right)} options are right: {[o['latex'] for o in opts]}")
    if not isinstance(ch.get("correct"), int) or not right or ch["correct"] != right[0]:
        errs.append(f"choice.correct {ch.get('correct')} does not point to the right option")
    return keys


# ---------------------------------------------------------------------------
# Levels


def slope(A, B):
    L = Line(Point(*A), Point(*B))
    s = L.slope
    return None if s in (oo, -oo, zoo) else Rational(s)


def check(sample):
    errs = []
    lvl = sample["level"]
    prob = sample["problem"]
    ans = sample["answer"]
    ch = sample.get("choice") or (ans if ans.get("kind") == "choice" else None)
    if ans.get("kind") == "choice" and sample.get("choice") and sample["choice"] != ans:
        errs.append("choice answer and choice variant differ")
    for name, rx in FORBIDDEN:
        if rx.search(prob):
            errs.append(f"problem contains forbidden '{name}': {prob}")
    for name, rx in [("1y", re.compile(r"(?<![\d}])1\s*y")), ("0y", re.compile(r"(?<![\d}])0\s*y"))]:
        if rx.search(prob):
            errs.append(f"problem contains forbidden '{name}'")
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("no steps or no solution")
    for t in [sample["solution"], *sample["steps"]]:
        if re.search(r"\\begin\{(aligned|gathered|array)\}", t):
            errs.append("environment in solution or steps")
    kind = None

    if lvl in (1, 2):
        P = points(prob)
        A, B = P["A"], P["B"]
        coords = [*A, *B]
        if A == B:
            errs.append("coincident points")
        m = slope(A, B)
        kind = "verticale" if m is None else "orizzontale" if m == 0 else "generica"
        if m is None:
            if ans.get("kind") != "choice":
                errs.append("vertical line: the answer must be a choice")
            check_choice(ch, "none", "number", errs)
        else:
            if ans.get("kind") != "number" or rat(ans["value"]) != m:
                errs.append(f"answer {ans.get('value')} != slope {m}")
            check_choice(ch, m, "number", errs)
        if lvl == 1:
            if any(not c.is_integer or abs(c) > 6 for c in coords):
                errs.append("level 1: integer coordinates from -6 to 6")
            if not any(c < 0 for c in coords):
                errs.append("level 1: no negative coordinate")
            if m is not None and m.q > 5:
                errs.append(f"level 1: slope {m} with denominator > 5")
        else:
            if all(c.is_integer for c in A) or all(c.is_integer for c in B):
                errs.append("level 2: every point needs a fractional coordinate")
            if any(c.q > 4 for c in coords):
                errs.append("level 2: denominators up to 4")
            if m is None or m == 0:
                errs.append("level 2: the slope must exist and be nonzero")
            elif m.q > 6 or abs(m.p) > 9:
                errs.append(f"level 2: slope {m} too big")

    elif lvl == 3:
        lhs, rhs = prob.split(" = ")
        key = parse_line(prob)
        a, b, c = key
        if b == 0:
            return errs + ["level 3: vertical line"], None
        m = Rational(-a, b)
        mm = solve(tex_to_sympy(lhs) - tex_to_sympy(rhs), Y)
        if len(mm) != 1 or Poly(mm[0], X).coeff_monomial(X) != m:
            errs.append("level 3: slope from solve differs")
        if rhs == "0":
            kind = "implicita"
            if prob != implicit_tex(key):
                errs.append(f"level 3: implicit form not reduced or a < 0: {prob}")
        elif re.fullmatch(r"\d+y", lhs):
            kind = "da esplicitare"
            if int(lhs[:-1]) < 2:
                errs.append("level 3: by = ... needs b >= 2")
            if m.is_integer:
                errs.append("level 3: by = ax + c with an integer slope")
        elif "y" not in lhs and "x" not in rhs:
            kind = "due membri"
        else:
            errs.append(f"level 3: unknown form {prob}")
        if kind in ("implicita", "due membri") and abs(b) == 1:
            errs.append("level 3: b = ±1 (the equation is almost explicit)")
        if lhs == "y":
            errs.append("level 3: already explicit")
        if ans.get("kind") != "number" or rat(ans["value"]) != m:
            errs.append(f"answer {ans.get('value')} != slope {m}")
        check_choice(ch, m, "number", errs)

    elif lvl in (4, 5):
        P = points(prob)["P"]
        m = given_m(prob)
        truth = sympy_line_key(Line(Point(*P), slope=m))
        if any(not c.is_integer or abs(c) > 6 for c in P) or not any(c < 0 for c in P) or P[0] == 0:
            errs.append("P: integer coordinates to 6, one negative, x0 != 0")
        if lvl == 4:
            if not m.is_integer or m == 0 or abs(m) > 4:
                errs.append(f"level 4: slope {m}")
            if ans.get("kind") != "expression":
                errs.append("level 4: expression answer")
            else:
                if ans["latex"] != explicit_tex(truth):
                    errs.append(f"answer latex {ans['latex']!r} != {explicit_tex(truth)!r}")
                val = sympify(ans["value"], locals={"x": X})
                if line_key(Y - val) != truth:
                    errs.append(f"answer value {ans['value']} is not the line")
            check_choice(ch, truth, "explicit", errs)
        else:
            if m.is_integer or m.q > 5 or abs(m.p) > 5:
                errs.append(f"level 5: slope {m}")
            if P[1] == 0:
                errs.append("level 5: y0 = 0")
            if ans.get("kind") != "choice":
                errs.append("level 5: choice answer")
            if sample["solution"] != implicit_tex(truth):
                errs.append("level 5: solution not the implicit form")
            check_choice(ch, truth, "implicit", errs)

    elif lvl == 6:
        P = points(prob)
        A, B = P["A"], P["B"]
        coords = [*A, *B]
        if A == B:
            return errs + ["coincident points"], None
        truth = sympy_line_key(Line(Point(*A), Point(*B)))
        m = slope(A, B)
        kind = "verticale" if m is None else "orizzontale" if m == 0 else "generica"
        if any(not c.is_integer or abs(c) > 6 for c in coords) or not any(c < 0 for c in coords):
            errs.append("level 6: integer coordinates to 6, one negative")
        if m is not None and (m.q > 4 or abs(m.p) > 6):
            errs.append(f"level 6: slope {m}")
        if m is None:
            if ans.get("kind") != "choice":
                errs.append("vertical line: choice answer")
        elif ans.get("kind") != "expression":
            errs.append("level 6: expression answer")
        else:
            if ans["latex"] != explicit_tex(truth):
                errs.append(f"answer latex {ans['latex']!r} != {explicit_tex(truth)!r}")
            val = sympify(ans["value"], locals={"x": X})
            if line_key(Y - val) != truth:
                errs.append(f"answer value {ans['value']} is not the line")
        check_choice(ch, truth, "explicit", errs)

    elif lvl == 7:
        P = points(prob)
        A, B = P["A"], P["B"]
        if A[0] == B[0] or A[1] == B[1]:
            errs.append("level 7: AB vertical or horizontal")
        if any(abs(c) > 5 for c in [*A, *B]):
            errs.append("level 7: A and B coordinates to 5")
        if "C" in P:
            kind = "coordinata"
            k_, yC = P["C"]
            if k_ != K:
                errs.append("level 7: C has no unknown abscissa")
            sols = solve((B[0] - A[0]) * (yC - A[1]) - (B[1] - A[1]) * (K - A[0]), K)
            if len(sols) != 1:
                return errs + [f"level 7: k solutions {sols}"], kind
            k = Rational(sols[0])
            if k == A[0]:
                errs.append("level 7: k puts C on the vertical of A")
            if not Point.is_collinear(Point(*A), Point(*B), Point(k, yC)):
                errs.append("level 7: C(k) not collinear")
            if ans.get("kind") != "number" or rat(ans["value"]) != k:
                errs.append(f"answer {ans.get('value')} != k = {k}")
            check_choice(ch, k, "number", errs)
        else:
            kind = "quale punto"
            if ans.get("kind") != "choice":
                errs.append("level 7: choice answer")
            pa, pb = Point(*A), Point(*B)
            keys = check_choice(ch, None, "point", errs, wrong=lambda p: not Point.is_collinear(pa, pb, Point(*p)))
            for p in keys:
                if p in (A, B):
                    errs.append(f"option {p} is A or B")
                if abs(p[0]) > 13 or abs(p[1]) > 13:
                    errs.append(f"option {p} too far")
    else:
        errs.append(f"unknown level {lvl}")
    if kind and sample["params"].get("case") != kind:
        errs.append(f"params.case {sample['params'].get('case')!r} but the problem is {kind!r}")
    return errs, kind
