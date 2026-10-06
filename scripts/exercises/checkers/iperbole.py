"""iperbole (lesson 119), from specs/exercises/iperbole.md.

Written from the spec, not from the generator. The hyperbola, the line and the givens are read back from the LaTeX
of the problem; the answers are recomputed with SymPy: the real vertices by intersecting the axes, the foci checked
on the definition (the difference of the distances of a point of the curve), the asymptotes as the lines whose
substitution cancels x^2, the position of a line from the degree and the real roots of the resolvent.
"""
import re
from math import gcd

from sympy import N, Poly, Rational, S, solveset, sqrt

from checkers._ellisse_iperbole import X, check_options, common, same_params, conic_tex, is_square, line_tex, num, on_axis, point_tex, quad_tex, read_axis, read_number

AXES = {"asse x": (0.4, 0.6), "asse y": (0.4, 0.6)}
CASE_RANGES = {
    1: AXES,
    2: AXES,
    3: AXES,
    4: AXES,
    5: AXES,
    6: {"secante": (0.18, 0.32), "tangente": (0.18, 0.32), "esterna": (0.18, 0.32), "parallela": (0.18, 0.32)},
    7: {"fuochi": (0.4, 0.6), "asintoti": (0.4, 0.6)},
}

POSITIONS = ["secante", "tangente", "esterna", "parallela"]
POSITION_TEXT = {"secante": "secante", "tangente": "tangente", "esterna": "esterna", "parallela": "parallela a un asintoto"}


def hyperbola(tex):
    A, B, sign, rhs = conic_tex(tex)
    if sign != -1:
        raise ValueError(f"not a hyperbola: {tex!r}")
    return A, B, rhs


def real_vertices(A, B, rhs):
    """Axis and squared semi-axis of the real vertices: where the curve meets an axis."""
    on_x = solveset(X**2 / A - rhs, X, S.Reals)
    on_y = solveset(-(X**2) / B - rhs, X, S.Reals)
    if bool(on_x) == bool(on_y):
        raise ValueError("the curve must meet exactly one axis")
    return ("x", A) if on_x else ("y", B)


def foci(A, B, rhs):
    axis, t2 = real_vertices(A, B, rhs)
    c2 = A + B
    # the definition on a point of the curve other than a vertex
    if axis == "x":
        P = (sqrt(2 * A), sqrt(B))
        F1, F2 = (-sqrt(c2), 0), (sqrt(c2), 0)
    else:
        P = (sqrt(A), sqrt(2 * B))
        F1, F2 = (0, -sqrt(c2)), (0, sqrt(c2))
    assert P[0] ** 2 / A - P[1] ** 2 / B == rhs
    d = lambda F: sqrt((P[0] - F[0]) ** 2 + (P[1] - F[1]) ** 2)  # noqa: E731
    if abs(N(abs(d(F1) - d(F2)) - 2 * sqrt(t2), 30)) > 1e-20:
        raise ValueError("the foci do not satisfy the definition")
    return axis, c2


def squares_in(A, B, lo, hi, errs):
    if not (is_square(A) and is_square(B)) or not all(lo <= sqrt(v) <= hi for v in (A, B)) or A == B:
        errs.append(f"denominators {A}, {B} out of spec")


def level1(s, ch, errs):
    A, B, rhs = hyperbola(s["problem"])
    same_params(s["params"], errs, A=A, B=B, rhs=rhs)
    squares_in(A, B, 2, 9, errs)
    truth = real_vertices(A, B, rhs)
    check_options(ch, read_axis(""), truth, errs)
    return f"asse {truth[0]}"


def level2(s, ch, errs):
    A, B, rhs = hyperbola(s["problem"])
    same_params(s["params"], errs, A=A, B=B, rhs=rhs)
    squares_in(A, B, 2, 9, errs)
    truth = foci(A, B, rhs)
    check_options(ch, read_axis("F"), truth, errs)
    return f"asse {truth[0]}"


def read_slope(tex):
    m = re.fullmatch(r"y = \\pm (.+)x", tex.strip())
    if not m:
        raise ValueError(f"unreadable asymptotes {tex!r}")
    v = num(m.group(1))
    if v == 1 or v <= 0:
        raise ValueError(f"slope {v} written")
    return v


def level3(s, ch, errs):
    A, B, rhs = hyperbola(s["problem"])
    same_params(s["params"], errs, A=A, B=B, rhs=rhs)
    squares_in(A, B, 1, 9, errs)
    m = sqrt(Rational(B, A))
    # substituting y = m x the terms in x^2 cancel: the line never meets the curve
    if Poly(X**2 / A - (m * X) ** 2 / B - rhs, X).degree() != 0:
        errs.append("not an asymptote")

    def read(o):
        return read_slope(o["latex"]), Rational(o["values"][0])

    check_options(ch, read, m, errs)
    return f"asse {real_vertices(A, B, rhs)[0]}"


def level4(s, ch, errs):
    p, q, r = quad_tex(s["problem"])
    if p <= 0 or q >= 0 or r == 0 or gcd(p, -q) != 1 or abs(r) % p or abs(r) % q:
        errs.append("coefficients out of spec")
        return None
    A, B, rhs = abs(r) // p, abs(r) // -q, (1 if r > 0 else -1)
    same_params(s["params"], errs, p=p, q=q, r=r, A=A, B=B, rhs=rhs)
    squares_in(A, B, 1, 6, errs)
    if conic_tex(s["steps"][1]) != (A, B, -1, rhs):
        errs.append("the canonical form in the steps is wrong")
    truth = foci(A, B, rhs)
    check_options(ch, read_axis("F"), truth, errs)
    return f"asse {truth[0]}"


def level5(s, ch, errs):
    A, B, rhs = hyperbola(s["problem"])
    same_params(s["params"], errs, A=A, B=B, rhs=rhs)
    axis, c2 = foci(A, B, rhs)
    t2 = A if axis == "x" else B
    if not (is_square(A) and is_square(B) and is_square(c2)) or not 5 <= sqrt(c2) <= 17:
        errs.append("semi-axes and c must be integers, c between 5 and 17")
    e = sqrt(c2) / sqrt(t2)
    if e <= 1:
        errs.append("eccentricity not greater than 1")
    ans = s["answer"]
    if ans.get("kind") != "number" or Rational(ans["value"]) != e:
        errs.append(f"answer {ans.get('value')} != {e}")
    check_options(ch, read_number, e, errs)
    return f"asse {axis}"


def level6(s, ch, errs):
    parts = s["problem"].split(r" \qquad ")
    if len(parts) != 2:
        errs.append("two givens expected")
        return None
    A, B, rhs = hyperbola(parts[0])
    m, q = line_tex(parts[1])
    same_params(s["params"], errs, A=A, B=B, m=m, q=q)
    if rhs != 1 or q == 0 or not q.is_integer or A == B:
        errs.append("hyperbola or line out of spec")
    P = Poly(X**2 / A - (m * X + q) ** 2 / B - 1, X)
    if P.degree() == 1:
        pos = "parallela"
        if m**2 != Rational(B, A):
            errs.append("first degree but not parallel to an asymptote")
        squares_in(A, B, 1, 6, errs)
        if abs(q) > 6:
            errs.append("q out of spec")
    elif P.degree() == 2:
        roots = solveset(P.as_expr(), X, S.Reals)
        pos = {0: "esterna", 1: "tangente", 2: "secante"}[len(roots)]
        t2 = A * m**2 - B
        if not m.is_integer or m == 0 or abs(m) > 3 or not is_square(t2) or t2 < 4:
            errs.append("line out of spec: A m^2 - B must be a square t^2 with t >= 2")
    else:
        errs.append("the resolvent has no x")
        return None
    if [o["latex"] for o in ch["options"]] != [rf"\text{{{POSITION_TEXT[k]}}}" for k in POSITIONS]:
        errs.append("options are not the four positions in order")

    def read(o):
        text = re.fullmatch(r"\\text\{(.+)\}", o["latex"]).group(1)
        return [k for k in POSITIONS if POSITION_TEXT[k] == text][0], o["values"][0]

    check_options(ch, read, pos, errs)
    return pos


def level7(s, ch, errs):
    parts = s["problem"].split(r" \qquad ")
    if len(parts) != 2:
        errs.append("two givens expected")
        return None
    if parts[0].startswith("F"):
        case = "fuochi"
        axis, c2 = on_axis(parts[0], "F")
        vx, vy = point_tex(parts[1], "A_2" if axis == "x" else "B_2")
        tr = vx if axis == "x" else vy
        c = sqrt(c2)
        if not c.is_integer or c > 10 or not 1 <= tr < c:
            errs.append("givens out of spec")
        other2 = c2 - tr**2
        same_params(s["params"], errs, axis=axis, vertex=tr, c=c)
        a2, b2 = (tr**2, other2) if axis == "x" else (other2, tr**2)
    else:
        case = "asintoti"
        axis = "x" if parts[0].startswith("A_2") else "y"
        vx, vy = point_tex(parts[0], "A_2" if axis == "x" else "B_2")
        tr = vx if axis == "x" else vy
        m = read_slope(parts[1])
        a, b = (tr, m * tr) if axis == "x" else (tr / m, tr)
        if not (a.is_integer and b.is_integer) or not all(1 <= v <= 8 for v in (a, b)) or a == b:
            errs.append("semi-axes out of spec")
        a2, b2 = a**2, b**2
        same_params(s["params"], errs, axis=axis, vertex=tr, slope=m)
    if (vy if axis == "x" else vx) != 0:
        errs.append("the vertex is not on the axis")
    truth = (a2, b2, 1 if axis == "x" else -1)
    if real_vertices(*truth) != (axis, tr**2):
        errs.append("the answer has not the given vertex")

    def read(o):
        A, B, rhs = hyperbola(o["latex"])
        return (A, B, rhs), tuple(int(v) for v in o["values"])

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
