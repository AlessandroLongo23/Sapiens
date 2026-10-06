"""Checker for parabola-rette, from specs/exercises/parabola-rette.md and lesson 117.

Parabola, line and point are read back from the LaTeX of the problem. The position of a line comes from the
number of real solutions of the system, the tangent at a point from the derivative (which the lesson does not
use), the value of q and the slopes of the tangents from a point from the discriminant of the resolvent, the
area of a parabolic segment from an integral. The params are only compared with what was read.
"""
from sympy import Rational, S, Symbol, diff, discriminant, expand, integrate, solve, solveset

from checkers._circonferenza_parabola import M, Q, X, Y, Problem, TexError, eq, equation, explicit_line, expr, frame, function_answer, must_be_choice, number_answer, numbers, quadratic, set_answer, text, val

third = (0.25, 0.42)
CASE_RANGES = {1: {"secante": third, "tangente": third, "esterna": third}, 7: {"orizzontale": (0.4, 0.6), "obliqua": (0.4, 0.6)}}

A_ALLOWED = (Rational(1, 4), Rational(1, 2), 1, 2, 3)


def parabola(tex, errs):
    a, b, c = quadratic(equation(tex), X, Y)
    if abs(a) not in A_ALLOWED or not (b.is_integer and c.is_integer) or abs(b) > 9 or abs(c) > 12:
        errs.append(f"parabola a = {a}, b = {b}, c = {c} out of the specification")
    return a * X**2 + b * X + c


def check(sample):
    lvl, p = sample["level"], sample["params"]
    errs, case, n = [], None, 4
    try:
        pr = Problem(sample["problem"])
        f = parabola(pr.bare[0], errs)
        if lvl in (1, 5, 7):
            m, k = explicit_line(pr.labelled["r"])
            if not (m.is_integer and k.is_integer):
                errs.append(f"line y = {m}x + {k}")
        if lvl == 1:
            if m == 0:
                errs.append("horizontal line")
            roots = solveset(f - m * X - k, X, S.Reals)
            case = {2: "secante", 1: "tangente", 0: "esterna"}[len(roots)]
            if any(not r.is_integer for r in roots):
                errs.append(f"common points of abscissa {roots}")
            truth, n = text(case), 3
            errs += must_be_choice(sample)
        elif lvl == 2:
            rhs = expr(pr.labelled["r"].split("=")[1])
            m = rhs.coeff(X, 1)
            if not pr.labelled["r"].startswith("y = ") or expand(rhs - m * X - Q) != 0 or not m.is_integer or m == 0:
                raise TexError(f"line {pr.labelled['r']} is not y = mx + q")
            sol = solve(discriminant(f - rhs, X), Q)
            if m == f.coeff(X, 1):
                errs.append("m = b: the resolvent has no term in x")
            if len(sol) != 1 or sol[0].q > 4:
                errs.append(f"q = {sol}")
            truth = val(sol[0])
            errs += number_answer(sample, sol[0])
        elif lvl in (3, 4):
            x0 = pr.given["x_0"]
            y0, m = f.subs(X, x0), diff(f, X).subs(X, x0)
            if not x0.is_integer or x0 == 0 or not y0.is_integer:
                errs.append(f"x0 = {x0}, y0 = {y0}")
            if lvl == 3:
                truth = val(m)
                errs += number_answer(sample, m)
            else:
                if m == 0:
                    errs.append("horizontal tangent")
                tangent = expand(m * (X - x0) + y0)
                truth = eq(Y - tangent)
                errs += function_answer(sample, tangent, "explicit")
        elif lvl == 5:
            if m == 0:
                errs.append("horizontal line")
            xs = solve(diff(f, X) - m, X)
            if len(xs) != 1 or not xs[0].is_integer:
                errs.append(f"point of contact {xs}")
            tangent = expand(m * (X - xs[0]) + f.subs(X, xs[0]))
            if tangent == m * X + k:
                errs.append("the given line is already the tangent")
            truth = eq(Y - tangent)
            errs += function_answer(sample, tangent, "explicit")
        elif lvl == 6:
            x0, y0 = pr.points["P"]
            if not (x0.is_integer and y0.is_integer):
                errs.append("P not integer")
            a = f.coeff(X, 2)
            if (y0 - f.subs(X, x0)) * a >= 0:
                errs.append("P is not external")
            mm = Symbol("m", real=True)
            sols = solve(discriminant(f - (mm * (X - x0) + y0), X), mm)
            if len(sols) != 2 or any(not s.is_integer for s in sols):
                errs.append(f"slopes {sols}")
            truth = numbers(sols)
            errs += set_answer(sample, [Rational(s) for s in sols])
        elif lvl == 7:
            case = "orizzontale" if m == 0 else "obliqua"
            xs = sorted(solveset(f - m * X - k, X, S.Reals))
            if len(xs) != 2 or any(not r.is_integer for r in xs):
                raise TexError(f"chord ends {xs}")
            area = abs(integrate(m * X + k - f, (X, xs[0], xs[1])))
            if area.q > 3:
                errs.append(f"area {area}")
            truth = val(area)
            errs += number_answer(sample, area)
        else:
            return [f"unknown level {lvl}"], None
    except (TexError, KeyError, IndexError, ValueError) as e:
        return [f"problem unreadable: {e!r}"], None
    if "case" in p and p["case"] != case:
        errs.append(f"params.case {p['case']} but the problem is {case}")
    return errs + frame(sample, truth, n), case
