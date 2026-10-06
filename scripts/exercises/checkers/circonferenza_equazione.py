"""Checker for circonferenza-equazione, from specs/exercises/circonferenza-equazione.md and lesson 114.

The equation, the points and the radius are read back from the LaTeX of the problem, and what is asked from the
prompt. Centre and radius come from the coefficients of the expanded polynomial, the circle through three
points from SymPy's Circle, the position of a point from its distance from the centre. The params are only
compared with what was read.
"""
import re

from sympy import Circle, Point, Rational, sqrt

from checkers._circonferenza_parabola import X, Y, Problem, TexError, circle, eq, equation, frame, length_answer, must_be_choice, pt, text, val

CASE_RANGES = {
    1: {"intero": (0.6, 0.8), "radice": (0.2, 0.4)},
    2: {"interno": (0.25, 0.42), "sulla circonferenza": (0.25, 0.42), "esterno": (0.25, 0.42)},
    4: {"raggio": (0.5, 0.7), "centro": (0.3, 0.5)},
    5: {"circonferenza": (0.3, 0.5), "punto": (0.2, 0.4), "nessuno": (0.2, 0.4)},
    6: {"raggio": (0.5, 0.7), "centro": (0.3, 0.5)},
    7: {"centro e punto": (0.25, 0.45), "diametro": (0.25, 0.45), "tre punti": (0.2, 0.4)},
}

CENTRE_FORM = re.compile(r"(x\^2|\(x [+-] \d+\)\^2) \+ (y\^2|\(y [+-] \d+\)\^2) = \d+")
GENERAL = re.compile(r"(\d*)x\^2 \+ (\d*)y\^2( [+-] \d*x)?( [+-] \d*y)?( [+-] \d+)? = 0")


def general_of(al, be, r2):
    return eq((X - al) ** 2 + (Y - be) ** 2 - r2)


def check(sample):
    lvl, p, prompt = sample["level"], sample["params"], sample["prompt"]
    errs, case, n = [], None, 4
    try:
        pr = Problem(sample["problem"])
        if lvl in (1, 2):
            tex = pr.bare[0]
            if not CENTRE_FORM.fullmatch(tex):
                errs.append(f"not in the form (x - α)² + (y - β)² = r²: {tex}")
            al, be, r2 = circle(equation(tex))
            if not (al.is_integer and be.is_integer) or (al, be) == (0, 0):
                errs.append(f"centre {al}, {be}")
        if lvl == 1:
            if max(abs(al), abs(be)) > 6:
                errs.append("centre out of [-6, 6]")
            r = sqrt(r2)
            case = "intero" if r.is_integer else "radice"
            if r.is_integer and not 2 <= r <= 7:
                errs.append(f"radius {r} out of [2, 7]")
            if not r.is_integer and r2 not in (2, 3, 5, 6, 7, 10, 13):
                errs.append(f"r² = {r2} not allowed")
            truth = (pt(al, be), val(r))
            errs += must_be_choice(sample)
        elif lvl == 2:
            x0, y0 = pr.points["P"]
            if r2 not in (5, 10, 13, 17, 25):
                errs.append(f"r² = {r2}")
            d2 = (x0 - al) ** 2 + (y0 - be) ** 2
            if d2 == 0:
                errs.append("P is the centre")
            case = "interno" if d2 < r2 else "esterno" if d2 > r2 else "sulla circonferenza"
            truth, n = text(case), 3
            errs += must_be_choice(sample)
        elif lvl == 3:
            al, be = pr.points["C"]
            r = pr.given["r"]
            if not (al.is_integer and be.is_integer and r.is_integer) or max(abs(al), abs(be)) > 5 or not 1 <= r <= 6 or (al, be) == (0, 0):
                errs.append(f"centre {al}, {be}, radius {r} out of the specification")
            truth = general_of(al, be, r**2)
            errs += must_be_choice(sample)
        elif lvl in (4, 5, 6):
            tex = pr.bare[0]
            m = GENERAL.fullmatch(tex)
            if not m:
                raise TexError(f"not in general form: {tex}")
            k = int(m.group(1) or 1)
            if int(m.group(2) or 1) != k:
                errs.append("x² and y² with different coefficients")
            if (k != 1) != (lvl == 6) or k not in (1, 2, 3, 4):
                errs.append(f"coefficient of x² is {k}")
            al, be, v = circle(equation(tex))
            if (al, be) == (0, 0):
                errs.append("centre in the origin")
            if al**2 + be**2 == v:
                errs.append("c = 0")
            if lvl == 5:
                if not (al.is_integer and be.is_integer):
                    errs.append("a, b not even")
                if v > 0:
                    r = sqrt(v)
                    if not r.is_integer:
                        errs.append(f"radius {r} not an integer")
                    case, truth = "circonferenza", text("una circonferenza", val(r))
                elif v == 0:
                    case, truth = "punto", text("il solo punto", pt(al, be))
                else:
                    case, truth = "nessuno", text("nessun punto")
                errs += must_be_choice(sample)
            else:
                if v <= 0:
                    raise TexError("not a circle")
                r = sqrt(v)
                if not r.is_rational:
                    errs.append(f"radius {r} not rational")
                if lvl == 4 and not (al.is_integer and be.is_integer and r.is_integer and 1 <= r <= 7):
                    errs.append("level 4: centre and radius must be integers, radius in [1, 7]")
                if lvl == 6 and al.is_integer and be.is_integer:
                    errs.append("level 6: the centre has no fractional coordinate")
                if prompt == "Calcola il raggio della circonferenza.":
                    case, truth = "raggio", val(r)
                    errs += length_answer(sample, r)
                elif prompt == "Trova il centro della circonferenza.":
                    case, truth = "centro", pt(al, be)
                    errs += must_be_choice(sample)
                else:
                    raise TexError(f"unknown prompt {prompt!r}")
        elif lvl == 7:
            pts = {k: Point(*v) for k, v in pr.points.items()}
            if any(not c.is_integer for v in pr.points.values() for c in v):
                errs.append("non-integer coordinates")
            if "di centro C che passa per A" in prompt:
                case = "centro e punto"
                c = Circle(pts["C"], pts["C"].distance(pts["A"]))
            elif "per diametro il segmento AB" in prompt:
                case = "diametro"
                mid = pts["A"].midpoint(pts["B"])
                if not (mid.x.is_integer and mid.y.is_integer):
                    errs.append("centre of the diameter not integer")
                c = Circle(mid, mid.distance(pts["A"]))
            elif "passa per i tre punti" in prompt:
                case = "tre punti"
                c = Circle(pts["A"], pts["B"], pts["D"])
                if not isinstance(c, Circle):
                    raise TexError("collinear points")
            else:
                raise TexError(f"unknown prompt {prompt!r}")
            if c.radius == 0:
                raise TexError("radius 0")
            truth = general_of(c.center.x, c.center.y, c.radius**2)
            errs += must_be_choice(sample)
        else:
            return [f"unknown level {lvl}"], None
    except (TexError, KeyError, IndexError) as e:
        return [f"problem unreadable: {e!r}"], None
    if "case" in p and p["case"] != case:
        errs.append(f"params.case {p['case']} but the problem is {case}")
    return errs + frame(sample, truth, n), case
