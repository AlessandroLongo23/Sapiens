"""ellisse (lesson 118), from specs/exercises/ellisse.md.

Written from the spec, not from the generator. The ellipse, the line, the point and the givens are read back from
the LaTeX of the problem; every answer is recomputed with SymPy (the foci from the sum of the distances of two
vertices, the position of a line by solving the system, the tangent as the only line through the point with one
common point); every option is read back from its LaTeX, must say what its values say, and exactly one is right.
"""
import re
from math import gcd

from sympy import Rational, S, solveset, sqrt

from checkers._ellisse_iperbole import X, Y, check_options, common, same_params, conic_tex, implicit_tex, is_square, line_tex, num, on_axis, point_tex, quad_tex, read_axis, read_number

CASE_RANGES = {
    1: {"asse x": (0.4, 0.6), "asse y": (0.4, 0.6)},
    2: {"asse x": (0.4, 0.6), "asse y": (0.4, 0.6)},
    3: {"asse x": (0.4, 0.6), "asse y": (0.4, 0.6)},
    4: {"asse x": (0.4, 0.6), "asse y": (0.4, 0.6)},
    5: {"secante": (0.25, 0.42), "tangente": (0.25, 0.42), "esterna": (0.25, 0.42)},
    7: {"fuochi": (0.4, 0.6), "eccentricità": (0.4, 0.6)},
}

POSITIONS = ["secante", "tangente", "esterna"]


def ellipse(tex):
    A, B, sign, rhs = conic_tex(tex)
    if sign != 1 or rhs != 1:
        raise ValueError(f"not an ellipse: {tex!r}")
    if A == B:
        raise ValueError("a circle")
    return A, B


def foci(A, B):
    """Axis and c^2, from the definition: the vertices of the major axis have sum of distances 2M, and so must the
    vertices of the minor axis, at distance sqrt(c^2 + m^2) from each focus."""
    M2, m2 = max(A, B), min(A, B)
    c2 = M2 - m2
    assert 2 * sqrt(c2 + m2) == 2 * sqrt(M2)
    return ("x" if A > B else "y"), c2


def squares_in(A, B, lo, hi, errs):
    if not (is_square(A) and is_square(B)) or not all(lo <= sqrt(v) <= hi for v in (A, B)):
        errs.append(f"denominators {A}, {B} out of spec")


def level1(s, ch, errs):
    A, B = ellipse(s["problem"])
    same_params(s["params"], errs, A=A, B=B)
    squares_in(A, B, 2, 9, errs)

    def read(o):
        m = re.fullmatch(r"a = (\d+),\\ b = (\d+)", o["latex"])
        return (int(m.group(1)), int(m.group(2))), tuple(int(v) for v in o["values"])

    check_options(ch, read, (sqrt(A), sqrt(B)), errs)
    return "asse x" if A > B else "asse y"


def level2(s, ch, errs):
    A, B = ellipse(s["problem"])
    same_params(s["params"], errs, A=A, B=B)
    squares_in(A, B, 2, 9, errs)
    truth = foci(A, B)
    check_options(ch, read_axis("F"), truth, errs)
    if on_axis(s["solution"], "F") != truth:
        errs.append("solution differs")
    return f"asse {truth[0]}"


def level3(s, ch, errs):
    p, q, r = quad_tex(s["problem"])
    if p <= 0 or q <= 0 or r <= 0 or gcd(p, q) != 1 or r % p or r % q:
        errs.append("coefficients out of spec")
        return None
    A, B = r // p, r // q
    same_params(s["params"], errs, p=p, q=q, r=r, A=A, B=B)
    if A == B:
        errs.append("a circle")
    squares_in(A, B, 1, 6, errs)
    if conic_tex(s["steps"][1]) != (A, B, 1, 1):
        errs.append("the canonical form in the steps is wrong")
    truth = foci(A, B)
    check_options(ch, read_axis("F"), truth, errs)
    return f"asse {truth[0]}"


def level4(s, ch, errs):
    A, B = ellipse(s["problem"])
    same_params(s["params"], errs, A=A, B=B)
    axis, c2 = foci(A, B)
    M = sqrt(max(A, B))
    if not (is_square(A) and is_square(B) and is_square(c2)) or not 5 <= M <= 17:
        errs.append("semi-axes and c must be integers, major semi-axis between 5 and 17")
    e = sqrt(c2) / M
    if not 0 < e < 1:
        errs.append("eccentricity out of (0, 1)")
    ans = s["answer"]
    if ans.get("kind") != "number" or Rational(ans["value"]) != e:
        errs.append(f"answer {ans.get('value')} != {e}")
    check_options(ch, read_number, e, errs)
    return f"asse {axis}"


def split(problem, n):
    parts = problem.split(r" \qquad ")
    if len(parts) != n:
        raise ValueError(f"{n} givens expected in {problem!r}")
    return parts


def level5(s, ch, errs):
    conic, line = split(s["problem"], 2)
    A, B = ellipse(conic)
    m, q = line_tex(line)
    same_params(s["params"], errs, A=A, B=B, m=m, q=q)
    if not (2 <= A <= 30 and 2 <= B <= 40) or m not in (1, -1, 2, -2) or q == 0 or not q.is_integer:
        errs.append("ellipse or line out of spec")
    if not is_square(A * m**2 + B):
        errs.append("no integer q would make the line tangent")
    sol = solveset((X**2 / A + (m * X + q) ** 2 / B - 1), X, S.Reals)
    pos = {0: "esterna", 1: "tangente", 2: "secante"}[len(sol)]
    if [o["latex"] for o in ch["options"]] != [rf"\text{{{k}}}" for k in POSITIONS]:
        errs.append("options are not the three positions in order")

    def read(o):
        return re.fullmatch(r"\\text\{(.+)\}", o["latex"]).group(1), o["values"][0]

    check_options(ch, read, pos, errs, n=3)
    return pos


def level6(s, ch, errs):
    conic, pt = split(s["problem"], 2)
    A, B = ellipse(conic)
    x0, y0 = point_tex(pt, "P")
    same_params(s["params"], errs, A=A, B=B, x0=x0, y0=y0)
    if not (2 <= A <= 60 and 2 <= B <= 60) or x0 == 0 or y0 == 0 or abs(x0) > 7 or abs(y0) > 7:
        errs.append("ellipse or point out of spec")
    if x0**2 / A + y0**2 / B != 1:
        errs.append("the point is not on the ellipse")
    tangents = []
    for i, o in enumerate(ch["options"]):
        p, q, r = implicit_tex(o["latex"])
        if (p, q, r) != tuple(int(v) for v in o["values"]):
            errs.append(f"option {o['latex']!r} differs from its values")
        if gcd(gcd(abs(p), abs(q)), abs(r)) != 1 or r <= 0:
            errs.append(f"line {o['latex']!r} not reduced with r > 0")
        through = p * x0 + q * y0 == r
        # one common point with the ellipse: substitute y from the line (q != 0 in every option)
        common_points = solveset(X**2 / A + ((r - p * X) / q) ** 2 / B - 1, X, S.Reals)
        if through and len(common_points) == 1:
            tangents.append(i)
    if len({o["latex"] for o in ch["options"]}) != 4:
        errs.append("options not distinct")
    if tangents != [ch.get("correct")]:
        errs.append(f"tangent options {tangents}, correct {ch.get('correct')}")
    return "tangente"


def level7(s, ch, errs):
    first, second = split(s["problem"], 2)
    m = re.search(r"fuochi sull'asse ([xy])", s["prompt"])
    if second.startswith("e = "):
        case = "eccentricità"
        if not m:
            errs.append("the prompt does not say the axis of the foci")
            return case
        axis = m.group(1)
        e = num(second[4:])
        vx, vy = point_tex(first, "A_2" if axis == "x" else "B_2")
        M = vx if axis == "x" else vy
        c = e * M
    else:
        case = "fuochi"
        axis, c2 = on_axis(first, "F")
        vx, vy = point_tex(second, "A_2" if axis == "x" else "B_2")
        M = vx if axis == "x" else vy
        c = sqrt(c2)
    if (vy if axis == "x" else vx) != 0 or not (3 <= M <= 9) or not c.is_integer or not 1 <= c < M:
        errs.append("givens out of spec")
    same_params(s["params"], errs, axis=axis, M=M, c=c)
    minor2 = M**2 - c**2
    truth = (M**2, minor2) if axis == "x" else (minor2, M**2)

    def read(o):
        A, B = ellipse(o["latex"])
        return (A, B), tuple(int(v) for v in o["values"])

    check_options(ch, read, truth, errs)
    return case


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}


def check(sample):
    errs, ch = common(sample)
    fn = LEVELS.get(sample["level"])
    if fn is None:
        return [f"unknown level {sample['level']}"], None
    if ch is None:
        return errs, None
    kind = fn(sample, ch, errs)
    if kind != sample["params"].get("case"):
        errs.append(f"case {sample['params'].get('case')!r} but the exercise is {kind!r}")
    return errs, kind
