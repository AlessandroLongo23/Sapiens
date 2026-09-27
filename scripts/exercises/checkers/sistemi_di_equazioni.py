"""Checker for sistemi-di-equazioni, written from specs/exercises/sistemi-di-equazioni.md.

It reads the system from the LaTeX of the problem (a \\begin{cases} with two lines), turns every line
into a SymPy expression on its own, solves it with linsolve (level 7: after multiplying by the
denominators, then discarding a solution that makes a denominator zero), checks that params.sys says the
same equations, reads every option back from its LaTeX and compares it with its values, and checks the
constraints of each level and the share of each case.

Option keys: ("pair", x, y), ("empty",), ("R",), ("line", a, b, c) with the line normalised.
"""
import re

from sympy import EmptySet, Matrix, Poly, Rational, fraction, gcd, linsolve, solve as sp_solve, symbols, sympify, together

from verify import FORBIDDEN

X, Y = symbols("x y")

# Shares from the spec, with slack.
CASE_RANGES = {
    4: {"pronti": (0.18, 0.42), "da moltiplicare": (0.58, 0.82)},
    6: {"determinato": (0.12, 0.28), "impossibile": (0.32, 0.48), "indeterminato": (0.32, 0.48)},
    7: {"accettabile": (0.5, 0.7), "non accettabile": (0.3, 0.5)},
}

FORBIDDEN_XY = FORBIDDEN + [
    ("1y", re.compile(r"(?<!\d)1\s*y")),
    ("0y", re.compile(r"(?<!\d)0\s*y")),
    ("\\frac{0}", re.compile(r"\\d?frac\{0\}")),
]

NORMAL = re.compile(r"-?\d*x [+-] \d*y = -?\d+")


def tex_to_sympy(t):
    """A side of an equation as the generator writes it (2x - 3y, \\dfrac{x + 1}{3}, 4(x - 1)) to SymPy."""
    s = t.strip()
    frac = re.compile(r"\\d?frac\{([^{}]*)\}\{([^{}]*)\}")
    while frac.search(s):
        s = frac.sub(r"((\1)/(\2))", s)
    if "\\" in s or "{" in s:
        raise ValueError(f"unreadable: {t!r}")
    s = re.sub(r"(\d)\s*([xy(])", r"\1*\2", s)
    s = re.sub(r"\)\s*([xy(\d])", r")*\1", s)
    s = re.sub(r"([xy])\s*([xy(])", r"\1*\2", s)
    if not re.fullmatch(r"[0-9xy+\-*/() ]+", s):
        raise ValueError(f"unexpected characters: {t!r}")
    return sympify(s, locals={"x": X, "y": Y})


def parse_problem(tex):
    m = re.fullmatch(r"\\begin\{cases\} (.*) \\end\{cases\}", tex)
    if not m:
        raise ValueError(f"not a cases system: {tex!r}")
    lines = re.split(r" \\\\(?:\[1ex\])? ", m.group(1))
    if len(lines) != 2:
        raise ValueError(f"expected two equations: {tex!r}")
    out = []
    for line in lines:
        parts = line.split(" = ")
        if len(parts) != 2:
            raise ValueError(f"not an equation: {line!r}")
        out.append((line, tex_to_sympy(parts[0]) - tex_to_sympy(parts[1])))
    return out


def value(t):
    t = t.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        return Rational(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    if re.fullmatch(r"-?\d+", t):
        return Rational(int(t))
    raise ValueError(f"unreadable value {t!r}")


def coeffs(expr):
    """(a, b, c) of a x + b y - c, or None if not linear."""
    e = sympify(expr).expand()
    if not e.is_polynomial(X, Y):
        return None
    P = Poly(e, X, Y)
    if P.total_degree() > 1:
        return None
    return (P.coeff_monomial(X), P.coeff_monomial(Y), -P.coeff_monomial(1))


def line_key(a, b, c):
    k = a if a != 0 else b
    return ("line", a / k, b / k, c / k)


def read_option(latex, bare):
    if latex == r"S = \emptyset":
        return ("empty",)
    if latex == r"S = \mathbb{R}":
        return ("R",)
    m = re.fullmatch(r"S = \\\{\(x, y\) \\mid (.*)\\\}", latex)
    if m:
        parts = m.group(1).split(" = ")
        abc = coeffs(tex_to_sympy(parts[0]) - tex_to_sympy(parts[1]))
        return line_key(*abc)
    inner = latex
    if not bare:
        m = re.fullmatch(r"S = \\\{(.*)\\\}", latex) or re.fullmatch(r"S = \\left\\\{(.*)\\right\\\}", latex)
        if not m:
            raise ValueError(f"unreadable option {latex!r}")
        inner = m.group(1)
    m = re.fullmatch(r"\((-?\d+), (-?\d+)\)", inner) or re.fullmatch(r"\\left\((.*), (.*)\\right\)", inner)
    if not m:
        raise ValueError(f"unreadable pair {inner!r}")
    return ("pair", value(m.group(1)), value(m.group(2)))


def from_values(v):
    if v == []:
        return ("empty",)
    if v == ["R"]:
        return ("R",)
    if v and v[0] == "line":
        return line_key(*(Rational(t) for t in v[1:]))
    if len(v) == 2:
        return ("pair", Rational(v[0]), Rational(v[1]))
    raise ValueError(f"unreadable values {v}")


def solve(eqs):
    """Kind and key of the solution set of two linear equations (expressions = 0)."""
    sol = linsolve([e for e in eqs], X, Y)
    if sol == EmptySet:
        return "impossibile", ("empty",)
    (sx, sy), = list(sol)
    if sx.free_symbols or sy.free_symbols:
        a, b, c = coeffs(eqs[0])
        if a == 0 and b == 0:
            a, b, c = coeffs(eqs[1])
        return "indeterminato", line_key(a, b, c)
    return "determinato", ("pair", sx, sy)


def check(sample):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    problem = sample["problem"]
    try:
        lines = parse_problem(problem)
    except ValueError as e:
        return [str(e)], None
    for name, rx in FORBIDDEN_XY:
        if rx.search(problem):
            errs.append(f"problem contains forbidden '{name}': {problem}")

    # the integer system: levels 1-6 the equations themselves, level 7 the first one times its denominators
    ce = []
    ints = []
    for i, (tex, e) in enumerate(lines):
        num, den = fraction(together(e))
        if den.free_symbols:
            for d in re.findall(r"\\dfrac\{[^{}]*\}\{([^{}]*)\}", tex):
                dd = tex_to_sympy(d)
                if dd.free_symbols:
                    (v,) = dd.free_symbols
                    (r,) = sp_solve(dd, v)
                    ce.append((str(v), r))
            ints.append(num)
        else:
            ints.append(e)
    abc = [coeffs(e) for e in ints]
    if any(t is None for t in abc):
        return errs + ["an equation is not linear"], None
    kind, truth = solve(ints)
    excluded_pair = None
    if kind == "determinato" and ce:
        _, sx, sy = truth
        if any((v == "x" and sx == r) or (v == "y" and sy == r) for v, r in ce):
            excluded_pair = truth
            truth = ("empty",)

    # params.sys says the same equations as the text
    ps = p.get("sys", [])
    if len(ps) != 2:
        errs.append("params.sys needs two equations")
    else:
        for (a, b, c), row in zip(abc, ps):
            M = Matrix([[a, b, c], [Rational(row[0]), Rational(row[1]), Rational(row[2])]])
            if M.rank() != 1:
                errs.append(f"params.sys {row} is not the equation {a}x + {b}y = {c}")

    # the answer
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["answer must be a choice"], None
    opts = ans.get("options", [])
    bare = lvl == 1
    keys = []
    for o in opts:
        try:
            k = from_values(o["values"])
            if read_option(o["latex"], bare) != k:
                errs.append(f"option latex {o['latex']} != values {o['values']}")
        except (ValueError, TypeError) as e:
            errs.append(str(e))
            k = None
        keys.append(k)
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    if len(set(keys)) != len(keys):
        errs.append("choice options not distinct")
    if sum(1 for k in keys if k == truth) != 1:
        errs.append(f"not exactly one correct option (truth {truth})")
    idx = ans.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(keys) or keys[idx] != truth:
        errs.append("choice.correct is wrong")
    if sample.get("choice") is not None and sample["choice"] != ans:
        errs.append("choice differs from the answer")

    # solution and last step say the truth
    def said(t):
        i = t.find("S = ")
        return read_option(t[i:], False) if i >= 0 else None

    try:
        if lvl == 1:
            if read_option(sample["solution"], True) != truth:
                errs.append("solution != truth")
        else:
            if said(sample["solution"]) != truth:
                errs.append("solution != truth")
            if said(sample["steps"][-1]) != truth:
                errs.append("last step != truth")
    except (ValueError, IndexError, TypeError) as e:
        errs.append(f"solution or steps unreadable: {e}")

    # levels
    kind_out = None
    normal = all(NORMAL.fullmatch(t) for t, _ in lines)
    int_sol = truth[0] == "pair" and all(v.is_integer and abs(v) <= 6 for v in truth[1:])
    coef = [v for t in abc for v in t]
    ab = [v for t in abc for v in t[:2]]
    if lvl != 6 and kind != "determinato":
        errs.append(f"level {lvl} needs a determinate system, got {kind}")
    if lvl == 1:
        if not normal or not int_sol or any(abs(v) > 5 or v == 0 for v in ab):
            errs.append("level 1: normal form, coefficients 1..5, integer solution up to 6")
        _, sx, sy = truth
        if sx != sy and ("pair", sy, sx) not in keys:
            errs.append("level 1: the swapped pair is missing")
        one = 0
        for k in keys:
            if k and k[0] == "pair":
                ok = [sympify(e).subs({X: k[1], Y: k[2]}) == 0 for e in ints]
                if sum(ok) == 1:
                    one += 1
        if one == 0:
            errs.append("level 1: no option solves exactly one equation")
    elif lvl == 2:
        if not normal or not int_sol or any(v == 0 or abs(v) > 5 for v in ab) or not any(abs(v) == 1 for v in ab):
            errs.append("level 2: normal form, a coefficient 1 or -1, integer solution")
    elif lvl == 3:
        heads = [re.match(r"([xy]) = ", t) for t, _ in lines]
        if not all(heads) or heads[0].group(1) != heads[1].group(1):
            errs.append("level 3: both equations v = m u + q with the same v")
        else:
            v = heads[0].group(1)
            for t, _ in lines:
                if v in t.split(" = ")[1]:
                    errs.append(f"level 3: {v} on the right side: {t}")
        if truth[0] != "pair" or any(r.q > 6 or abs(r.p) > 30 for r in truth[1:]):
            errs.append("level 3: solution with denominator up to 6")
    elif lvl == 4:
        if not normal or not int_sol or any(abs(v) <= 1 or abs(v) > 7 for v in ab):
            errs.append("level 4: normal form, coefficients 2..7, integer solution")
        if truth[0] == "pair" and truth[1] >= 0 and truth[2] >= 0:
            errs.append("level 4: a negative coordinate")
        (a1, b1, _), (a2, b2, _) = abc
        kind_out = "pronti" if abs(a1) == abs(a2) or abs(b1) == abs(b2) else "da moltiplicare"
        if p.get("kind") != kind_out:
            errs.append(f"params.kind {p.get('kind')} but the system is {kind_out}")
    elif lvl == 5:
        if "\\dfrac" not in problem or not int_sol:
            errs.append("level 5: numeric denominators, integer solution")
        for t, _ in lines:
            if NORMAL.fullmatch(t):
                errs.append(f"level 5: {t} is already in normal form")
            for n, d in re.findall(r"\\dfrac\{(\d*)[xy]\}\{(\d+)\}", t):
                if gcd(int(n or 1), int(d)) != 1:
                    errs.append(f"level 5: fraction {n}/{d} not reduced")
        normal_step = [s for s in sample["steps"] if s.startswith(r"\text{Il sistema in forma normale è } ")]
        if len(normal_step) != 1:
            errs.append("level 5: one step with the normal form")
        else:
            eqs = normal_step[0].split("} ", 1)[1].split(r",\quad ")
            for t, (a, b, c) in zip(eqs, abc):
                if not NORMAL.fullmatch(t):
                    errs.append(f"level 5: normal form step {t} not in normal form")
                    continue
                l, r = t.split(" = ")
                M = Matrix([list(coeffs(tex_to_sympy(l) - tex_to_sympy(r))), [a, b, c]])
                if M.rank() != 1:
                    errs.append(f"level 5: normal form {t} differs from the equation")
    elif lvl == 6:
        if not normal or any(v == 0 for v in coef) or any(abs(v) > 20 for v in ab):
            errs.append("level 6: normal form, no zero coefficient or known term")
        kind_out = kind
        if p.get("kind") != kind:
            errs.append(f"params.kind {p.get('kind')} but the system is {kind}")
        if kind != "determinato" and ("R",) not in keys:
            errs.append("level 6: S = R (the mistake of the lesson) is missing")
        if kind == "indeterminato":
            o = opts[idx]["latex"] if isinstance(idx, int) and 0 <= idx < len(opts) else ""
            m = re.fullmatch(r"S = \\\{\(x, y\) \\mid (.*)\\\}", o)
            if m:
                l, r = m.group(1).split(" = ")
                a, b, c = coeffs(tex_to_sympy(l) - tex_to_sympy(r))
                if a <= 0 or gcd(gcd(a, b), c) != 1:
                    errs.append(f"level 6: the line {m.group(1)} is not written with the smallest integers and a > 0")
    elif lvl == 7:
        if not ce or "\\dfrac" not in lines[0][0]:
            errs.append("level 7: the first equation has an unknown in a denominator")
        kind_out = "accettabile" if truth[0] == "pair" else "non accettabile"
        if p.get("kind") != kind_out:
            errs.append(f"params.kind {p.get('kind')} but the solution is {kind_out}")
        if excluded_pair and excluded_pair not in keys:
            errs.append("level 7: the excluded pair (C.E. forgotten) is missing")
        for k in keys:
            if k and k[0] == "pair" and k != excluded_pair and any((v == "x" and k[1] == r) or (v == "y" and k[2] == r) for v, r in ce):
                errs.append(f"level 7: distractor {k} hits an excluded value")
        cest = [s for s in sample["steps"] if s.startswith(r"\text{C.E.: }")]
        shown = sorted((v, value(r)) for v, r in re.findall(r"([xy]) \\neq (-?\d+)", cest[0])) if len(cest) == 1 else None
        if shown != sorted(ce):
            errs.append(f"level 7: C.E. in the steps {shown} != {sorted(ce)}")
    else:
        errs.append(f"unknown level {lvl}")
    if not sample.get("steps"):
        errs.append("no steps")
    return errs, kind_out
