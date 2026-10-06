"""Checker for circonferenza-rette, from specs/exercises/circonferenza-rette.md and lesson 115.

Circles, lines and points are read back from the LaTeX of the problem and become SymPy geometry: the position
of a line and the common points come from Circle.intersection, the chord from the distance of the two points,
the tangent at a point from the perpendicular to the radius, the tangents from a point from solving "distance
of the centre = radius" in m. The params are only compared with what was read.
"""
from sympy import Circle, Line, Point, Rational, Symbol, solve, sqrt

from checkers._circonferenza_parabola import X, Y, Problem, TexError, circle, eq, equation, explicit_line, frame, function_answer, length_answer, line, must_be_choice, pt, set_answer, numbers, text, val

third = (0.25, 0.42)
CASE_RANGES = {
    1: {"secante": third, "tangente": third, "esterna": third},
    4: {"obliqua": (0.65, 0.85), "verticale": (0.05, 0.22), "orizzontale": (0.05, 0.22)},
    6: {"retta": (0.6, 0.8), "asse": (0.2, 0.4)},
    7: {k: (0.12, 0.28) for k in ("esterne", "tangenti esternamente", "secanti", "tangenti internamente", "una interna all'altra")},
}

PYTH = {(3, 4), (4, 3), (5, 12), (12, 5)}
LATTICE = (5, 10, 13, 17, 25)


def read_circle(tex):
    al, be, r2 = circle(equation(tex))
    if r2 <= 0:
        raise TexError("not a circle")
    if (al, be) == (0, 0) and not tex.startswith("x^2 + y^2 = "):
        raise TexError(f"centre in the origin not written x² + y² = r²: {tex}")
    return al, be, r2


def sym_line(e):
    a, b, c = line(e)
    return Line(Point(0, -c / b), Point(1, -(a + c) / b)) if b != 0 else Line(Point(-c / a, 0), Point(-c / a, 1))


def pythagorean(e, errs):
    a, b, c = line(e)
    if (abs(a), abs(b)) not in PYTH or a < 0 or c == 0 or abs(c) > 99:
        errs.append(f"line {a}, {b}, {c} out of the specification")


def check(sample):
    lvl, p, prompt = sample["level"], sample["params"], sample["prompt"]
    errs, case, n = [], None, 4
    try:
        pr = Problem(sample["problem"])
        if lvl <= 5:
            al, be, r2 = read_circle(pr.bare[0])
            if not (al.is_integer and be.is_integer):
                errs.append("centre not integer")
            C = Point(al, be)
            circ = Circle(C, sqrt(r2))
        if lvl in (1, 3):
            e = equation(pr.labelled["r"])
            pythagorean(e, errs)
            L = sym_line(e)
            d = L.distance(C)
            r = sqrt(r2)
            if not (d.is_integer and r.is_integer):
                errs.append(f"distance {d} or radius {r} not integer")
            common = circ.intersection(L)
        if lvl == 1:
            if not 2 <= r <= 5:
                errs.append(f"radius {r}")
            case = {2: "secante", 1: "tangente", 0: "esterna"}[len(common)]
            if (d < r, d == r) != (case == "secante", case == "tangente"):
                errs.append("distance and number of common points disagree")
            truth, n = text(case), 3
            errs += must_be_choice(sample)
        elif lvl == 2:
            m, k = explicit_line(pr.labelled["r"])
            if not m.is_integer or m == 0 or abs(m) > 3 or k == 0 or not k.is_integer:
                errs.append(f"line y = {m}x + {k} out of the specification")
            common = circ.intersection(Line(Point(0, k), Point(1, m + k)))
            if len(common) != 2 or any(not (c.x.is_integer and c.y.is_integer) for c in common):
                errs.append(f"common points {common}")
            if r2 not in LATTICE:
                errs.append(f"r² = {r2}")
            truth = frozenset(pt(c.x, c.y) for c in common)
            errs += must_be_choice(sample)
        elif lvl == 3:
            if len(common) != 2 or d == 0 or not 2 <= r <= 6:
                errs.append(f"level 3: distance {d}, radius {r}")
            chord = common[0].distance(common[1])
            truth = val(chord)
            errs += length_answer(sample, chord)
        elif lvl == 4:
            x0, y0 = pr.points["P"]
            P = Point(x0, y0)
            if not (x0.is_integer and y0.is_integer) or (x0 - al) ** 2 + (y0 - be) ** 2 != r2:
                errs.append("P is not a lattice point of the circle")
            tangent = Line(C, P).perpendicular_line(P)
            a, b, c = tangent.coefficients
            truth = eq(a * X + b * Y + c)
            if b == 0:
                case = "verticale"
                errs += must_be_choice(sample)
            elif a == 0:
                case = "orizzontale"
                errs += must_be_choice(sample)
            else:
                case = "obliqua"
                if r2 not in LATTICE:
                    errs.append(f"r² = {r2}")
                errs += function_answer(sample, -a / b * X - c / b, "explicit")
            if case != "obliqua" and not sqrt(r2).is_integer:
                errs.append("axis case with irrational radius")
        elif lvl == 5:
            x0, y0 = pr.points["P"]
            if not (x0.is_integer and y0.is_integer) or max(abs(x0), abs(y0)) > 12:
                errs.append(f"P({x0}, {y0})")
            if (x0 - al) ** 2 + (y0 - be) ** 2 <= r2:
                errs.append("P is not external")
            m = Symbol("m", real=True)
            # distance of the centre from mx - y + y0 - m·x0 = 0 equal to the radius, squared
            sols = solve((m * al - be + y0 - m * x0) ** 2 - r2 * (m**2 + 1), m)
            if len(sols) != 2 or any(not s.is_rational or s.q > 4 for s in sols):
                errs.append(f"slopes {sols}: need two rationals with denominator <= 4")
            if (al - x0) ** 2 == r2:
                errs.append("one tangent is vertical")
            truth = numbers(sols)
            errs += set_answer(sample, [Rational(s) for s in sols])
        elif lvl == 6:
            al, be = pr.points["C"]
            if not (al.is_integer and be.is_integer) or al == 0 or be == 0 or max(abs(al), abs(be)) > 5:
                errs.append(f"centre {al}, {be}")
            if "tangente all'asse x" in prompt or "tangente all'asse y" in prompt:
                case = "asse"
                r = abs(be) if "asse x" in prompt else abs(al)
                if abs(al) == abs(be):
                    errs.append("|α| = |β|: the wrong axis gives the same circle")
            elif "tangente alla retta r" in prompt:
                case = "retta"
                e = equation(pr.labelled["r"])
                pythagorean(e, errs)
                r = sym_line(e).distance(Point(al, be))
                if not r.is_integer or not 1 <= r <= 5:
                    errs.append(f"radius {r}")
            else:
                raise TexError(f"unknown prompt {prompt!r}")
            truth = eq((X - al) ** 2 + (Y - be) ** 2 - r**2)
            errs += must_be_choice(sample)
        elif lvl == 7:
            (a1, b1, s1), (a2, b2, s2) = (read_circle(t) for t in pr.bare)
            r1, r2 = sqrt(s1), sqrt(s2)
            d = Point(a1, b1).distance(Point(a2, b2))
            if not all(v.is_integer for v in (a1, b1, a2, b2, r1, r2, d)) or r1 == r2 or d == 0:
                errs.append("level 7: integer centres, different integer radii, integer distance")
            big, small = max(r1, r2), min(r1, r2)
            case = "esterne" if d > big + small else "tangenti esternamente" if d == big + small else "secanti" if d > big - small else "tangenti internamente" if d == big - small else "una interna all'altra"
            pts = len(Circle(Point(a1, b1), r1).intersection(Circle(Point(a2, b2), r2)))
            if pts != {"esterne": 0, "tangenti esternamente": 1, "secanti": 2, "tangenti internamente": 1, "una interna all'altra": 0}[case]:
                errs.append("number of common points disagrees with the position")
            truth = text(case)
            errs += must_be_choice(sample)
        else:
            return [f"unknown level {lvl}"], None
    except (TexError, KeyError, IndexError, ValueError) as e:
        return [f"problem unreadable: {e!r}"], None
    if "case" in p and p["case"] != case:
        errs.append(f"params.case {p['case']} but the problem is {case}")
    return errs + frame(sample, truth, n), case
