"""Checker for parabola-equazione, from specs/exercises/parabola-equazione.md and lesson 116.

The parabola, the focus, the directrix and the points are read back from the LaTeX of the problem. Vertex, focus
and directrix come from the formulas with the discriminant, and are then tested against the definition: the
squared distances of a point from the focus and from the directrix must differ by a multiple of the equation.
An equation asked from focus and directrix is found by solving that same condition. The params are only
compared with what was read.
"""
import re

from sympy import Rational, expand, solve

from checkers._circonferenza_parabola import X, Y, Problem, TexError, eq, equation, frame, function_answer, must_be_choice, pt, quadratic

third = (0.25, 0.42)
CASE_RANGES = {1: {"fuoco": (0.4, 0.6), "direttrice": (0.4, 0.6)}, 2: {"vertice": third, "fuoco": third, "direttrice": third}, 3: {"vertice": third, "fuoco": third, "direttrice": third}}


def elements(tex):
    """'y = ax² + bx + c' or 'x = ay² + by + c' -> (axis, a, b, c, vertex, focus, directrix as an expression = 0)."""
    m = re.fullmatch(r"([xy]) = (.+)", tex)
    if not m:
        raise TexError(f"not a parabola: {tex}")
    axis = "y" if m.group(1) == "y" else "x"
    u, w = (X, Y) if axis == "y" else (Y, X)  # w = a·u² + b·u + c
    a, b, c = quadratic(equation(tex), u, w)
    delta = b**2 - 4 * a * c
    v = (-b / (2 * a), -delta / (4 * a))
    f = (-b / (2 * a), (1 - delta) / (4 * a))
    d = -(1 + delta) / (4 * a)
    # the definition: (u − u_F)² + (w − w_F)² − (w − d)² is the equation times a constant
    locus = expand((u - f[0]) ** 2 + (w - f[1]) ** 2 - (w - d) ** 2)
    if expand(locus - (a * u**2 + b * u + c - w) / a) != 0:
        raise TexError("focus and directrix do not satisfy the definition")
    swap = (lambda t: t) if axis == "y" else (lambda t: (t[1], t[0]))
    return axis, a, b, c, swap(v), swap(f), w - d


def check(sample):
    lvl, p, prompt = sample["level"], sample["params"], sample["prompt"]
    errs, case = [], None
    try:
        pr = Problem(sample["problem"])
        if lvl <= 3:
            axis, a, b, c, v, f, d = elements(pr.bare[0])
            if (axis == "x") != (lvl == 3):
                errs.append(f"axis parallel to the {axis} axis at level {lvl}")
            if lvl == 1 and (b != 0 or c != 0 or abs(a) not in (Rational(1, 12), Rational(1, 8), Rational(1, 4), Rational(1, 2), 1, 2, 3, 4)):
                errs.append(f"level 1: y = ax² with a = {a}, b = {b}, c = {c}")
            if lvl in (2, 3):
                if abs(a) not in (Rational(1, 4), Rational(1, 2), 1, 2) or not (v[0].is_integer and v[1].is_integer):
                    errs.append(f"a = {a}, vertex {v}")
                if b == 0 or c == 0 or c.q > 2 or abs(c) > 20:
                    errs.append(f"b = {b}, c = {c}")
            if prompt == "Trova il vertice della parabola.":
                case, truth = "vertice", pt(*v)
            elif prompt == "Trova il fuoco della parabola.":
                case, truth = "fuoco", pt(*f)
            elif prompt == "Scrivi l'equazione della direttrice della parabola.":
                case, truth = "direttrice", eq(d)
            else:
                raise TexError(f"unknown prompt {prompt!r}")
            if lvl == 1 and case == "vertice":
                errs.append("level 1 asks the vertex")
            errs += must_be_choice(sample)
        elif lvl in (4, 5):
            xf, yf = pr.points["F"]
            dtex = pr.labelled["d"]
            m = re.fullmatch(r"([xy]) = (-?\d+)", dtex)
            if not m or (m.group(1) == "x") != (lvl == 5):
                raise TexError(f"directrix {dtex} at level {lvl}")
            k = Rational(m.group(2))
            if not (xf.is_integer and yf.is_integer):
                errs.append("focus not integer")
            w, wf = (Y, yf) if lvl == 4 else (X, xf)
            if abs(wf - k) not in (1, 2, 4):
                errs.append(f"distance between focus and directrix {abs(wf - k)}")
            locus = expand((X - xf) ** 2 + (Y - yf) ** 2 - (w - k) ** 2)
            sol = solve(locus, w)
            if len(sol) != 1:
                raise TexError("the locus is not a parabola with that axis")
            truth = eq(w - sol[0])
            if lvl == 4:
                errs += function_answer(sample, expand(sol[0]), "expanded")
            else:
                errs += must_be_choice(sample)
        elif lvl == 6:
            (xv, yv), (xa, ya) = pr.points["V"], pr.points["A"]
            if not all(t.is_integer for t in (xv, yv, xa, ya)) or xa == xv or ya == yv:
                errs.append("vertex and point")
            a = (ya - yv) / (xa - xv) ** 2
            if abs(a) not in (Rational(1, 4), Rational(1, 2), 1, 2, 3):
                errs.append(f"a = {a}")
            fx = expand(a * (X - xv) ** 2 + yv)
            truth = eq(Y - fx)
            errs += function_answer(sample, fx, "expanded")
        else:
            return [f"unknown level {lvl}"], None
    except (TexError, KeyError, IndexError, ValueError) as e:
        return [f"problem unreadable: {e!r}"], None
    if lvl <= 3 and p.get("case") != case:
        errs.append(f"params.case {p.get('case')} but the prompt asks {case}")
    return errs + frame(sample, truth), case
