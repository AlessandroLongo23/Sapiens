"""Checker for sistemi-secondo-grado, written from specs/exercises/sistemi-secondo-grado.md.

Levels 1-5: it reads the two equations from the LaTeX of the problem (a \\begin{cases} with two lines),
solves the system with SymPy's solve and keeps the real solutions. Level 3 also eliminates y and reads the
position of the line from the discriminant of the resolvent. Level 6: it reads the perimeter and the area,
diagonal or hypotenuse from the text, writes the system again, solves it and keeps the positive pairs.

Every option is read back from its LaTeX and compared with its values; the keys are mathematical objects
(a frozenset of pairs, a frozenset of numbers, the position and the points, the two sides), so the same set
written in two ways is the same option.
"""
import re

from sympy import Matrix, Poly, Rational, discriminant, gcd, solve, symbols, sympify

from verify import FORBIDDEN

X, Y = symbols("x y")

CASE_RANGES = {
    3: {"secante": (0.30, 0.50), "tangente": (0.20, 0.40), "esterna": (0.20, 0.40)},
    4: {"due coppie": (0.50, 0.70), "una coppia": (0.12, 0.28), "impossibile": (0.12, 0.28)},
    6: {"area": (0.30, 0.50), "diagonale": (0.20, 0.40), "triangolo": (0.08, 0.22), "impossibile": (0.08, 0.22)},
}

FORBIDDEN_XY = FORBIDDEN + [
    ("1y", re.compile(r"(?<!\d)1\s*y")),
    ("0y", re.compile(r"(?<!\d)0\s*y")),
]


# ---------------------------------------------------------------------------
# Reading LaTeX


def tex_to_sympy(t):
    """A side of an equation as the problem writes it (2x - y, x^2 + 2y^2, xy) to SymPy."""
    s = t.strip().replace("^2", "**2")
    if "\\" in s or "{" in s:
        raise ValueError(f"unreadable: {t!r}")
    s = re.sub(r"(\d)\s*([xy(])", r"\1*\2", s)
    s = re.sub(r"([xy])\s*([xy(])", r"\1*\2", s)
    s = re.sub(r"\)\s*([xy(\d])", r")*\1", s)
    if not re.fullmatch(r"[0-9xy+\-*/() ]+", s):
        raise ValueError(f"unexpected characters: {t!r}")
    return sympify(s, locals={"x": X, "y": Y})


def parse_problem(tex):
    m = re.fullmatch(r"\\begin\{cases\} (.*) \\end\{cases\}", tex)
    if not m:
        raise ValueError(f"not a cases system: {tex!r}")
    lines = m.group(1).split(r" \\ ")
    if len(lines) != 2:
        raise ValueError(f"expected two equations: {tex!r}")
    out = []
    for line in lines:
        parts = line.split(" = ")
        if len(parts) != 2:
            raise ValueError(f"not an equation: {line!r}")
        out.append((line, parts, (tex_to_sympy(parts[0]) - tex_to_sympy(parts[1])).expand()))
    return out


def value(t):
    """An integer or a reduced fraction, -\\frac{3}{2}."""
    t = t.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        n, d = int(m.group(2)), int(m.group(3))
        if d < 2 or gcd(n, d) != 1:
            raise ValueError(f"fraction not reduced: {t!r}")
        return Rational(n, d) * (-1 if m.group(1) else 1)
    if re.fullmatch(r"-?\d+", t):
        return Rational(int(t))
    raise ValueError(f"unreadable value {t!r}")


def split_top(s, sep):
    """Splits s at sep outside parentheses and braces."""
    parts, depth, start, i = [], 0, 0, 0
    while i < len(s):
        c = s[i]
        if c in "({":
            depth += 1
        elif c in ")}":
            depth -= 1
        elif depth == 0 and s.startswith(sep, i):
            parts.append(s[start:i])
            i += len(sep)
            start = i
            continue
        i += 1
    parts.append(s[start:])
    return [p.strip() for p in parts]


def read_pair(t):
    m = re.fullmatch(r"\\left\((.*), (.*)\\right\)", t)
    left = bool(m)
    m = m or re.fullmatch(r"\((.*), (.*)\)", t)
    if not m:
        raise ValueError(f"unreadable pair {t!r}")
    p = (value(m.group(1)), value(m.group(2)))
    if left != any(not v.is_integer for v in p):
        raise ValueError(f"\\left( \\right) iff a fraction: {t!r}")
    return p


def read_set(latex):
    """S = \\emptyset, S = \\{(a, b), ...\\}, S = \\{a, b\\}; checks the order and the \\left braces."""
    if latex == r"S = \emptyset":
        return ("empty",)
    m = re.fullmatch(r"S = \\left\\\{(.*)\\right\\\}", latex)
    left = bool(m)
    m = m or re.fullmatch(r"S = \\\{(.*)\\\}", latex)
    if not m:
        raise ValueError(f"unreadable set {latex!r}")
    items = split_top(m.group(1), ", ")
    if all(i.startswith("(") or i.startswith("\\left(") for i in items):
        ps = [read_pair(i) for i in items]
        if ps != sorted(ps):
            raise ValueError(f"pairs not in ascending order: {latex!r}")
        if left != any(not v.is_integer for p in ps for v in p):
            raise ValueError(f"\\left\\{{ iff a fraction: {latex!r}")
        if len(set(ps)) != len(ps):
            raise ValueError(f"repeated pair: {latex!r}")
        return ("pairs", frozenset(ps))
    ns = [value(i) for i in items]
    if ns != sorted(ns) or len(set(ns)) != len(ns):
        raise ValueError(f"numbers not ascending: {latex!r}")
    if left != any(not v.is_integer for v in ns):
        raise ValueError(f"\\left\\{{ iff a fraction: {latex!r}")
    return ("nums", frozenset(ns))


def read_option(latex, lvl):
    if lvl == 3:
        if latex == r"\text{esterna, nessun punto comune}":
            return ("l3", "esterna", frozenset())
        m = re.fullmatch(r"\\begin\{gathered\} \\text\{(secante|tangente)\} \\\\ (.*) \\end\{gathered\}", latex)
        if not m:
            raise ValueError(f"unreadable option {latex!r}")
        ps = [read_pair(t) for t in split_top(m.group(2), r",\ ")]
        if ps != sorted(ps):
            raise ValueError(f"points not ascending: {latex!r}")
        if len(ps) != (2 if m.group(1) == "secante" else 1) or len(set(ps)) != len(ps):
            raise ValueError(f"{m.group(1)} with {len(ps)} points: {latex!r}")
        return ("l3", m.group(1), frozenset(ps))
    if lvl == 6:
        if re.fullmatch(r"\\text\{Il (rettangolo|triangolo) non esiste\}", latex):
            return ("none",)
        m = re.fullmatch(r"(\d+)\\ \\text\{cm e \} (\d+)\\ \\text\{cm\}", latex)
        if not m:
            raise ValueError(f"unreadable option {latex!r}")
        a, b = int(m.group(1)), int(m.group(2))
        if a > b or a <= 0:
            raise ValueError(f"sides not ascending or not positive: {latex!r}")
        return ("sides", a, b)
    return read_set(latex)


def rat(s):
    if not re.fullmatch(r"-?\d+(/\d+)?", s):
        raise ValueError(f"not a rational {s!r}")
    return Rational(s)


def val_pair(s):
    m = re.fullmatch(r"\((-?\d+(?:/\d+)?),(-?\d+(?:/\d+)?)\)", s)
    if not m:
        raise ValueError(f"not a pair value {s!r}")
    return (rat(m.group(1)), rat(m.group(2)))


def from_values(v, lvl):
    if lvl == 3:
        if not v or v[0] not in ("secante", "tangente", "esterna"):
            raise ValueError(f"level 3 values {v}")
        return ("l3", v[0], frozenset(val_pair(t) for t in v[1:]))
    if lvl == 6:
        if v == []:
            return ("none",)
        a, b = (int(t) for t in v)
        return ("sides", a, b)
    if v == []:
        return ("empty",)
    if all(t.startswith("(") for t in v):
        return ("pairs", frozenset(val_pair(t) for t in v))
    return ("nums", frozenset(rat(t) for t in v))


# ---------------------------------------------------------------------------
# Solving


def real_solutions(eqs):
    sols = solve(eqs, [X, Y], dict=True)
    out = set()
    for s in sols:
        sx, sy = s.get(X), s.get(Y)
        if sx is None or sy is None or sx.free_symbols or sy.free_symbols:
            raise ValueError(f"not a finite solution set: {sols}")
        if sx.is_real and sy.is_real:
            if not (sx.is_rational and sy.is_rational):
                raise ValueError(f"irrational solution {sx}, {sy}")
            out.add((Rational(sx), Rational(sy)))
    return frozenset(out)


def degree(e):
    return Poly(e, X, Y).total_degree()


def pairs_key(sols):
    return ("pairs", sols) if sols else ("empty",)


def coef_vector(e):
    P = Poly(e, X, Y)
    return [P.coeff_monomial(m) for m in (X**2, Y**2, X * Y, X, Y, 1)]


def same_equation(e1, e2):
    return Matrix([coef_vector(e1), coef_vector(e2)]).rank() == 1


# ---------------------------------------------------------------------------
# Level 6: the text


def parse_story(problem):
    text = " ".join(re.findall(r"\\text\{((?:[^{}]|\{[^{}]*\})*)\}", problem))
    m = re.search(r"perimetro (?:di un rettangolo )?(?:di|è) (\d+) cm", text)
    if not m:
        raise ValueError(f"no perimeter in {text!r}")
    P = int(m.group(1))
    if "triangolo rettangolo" in text:
        d = int(re.search(r"ipotenusa di (\d+) cm", text).group(1))
        return "triangolo", P, d, [X + Y - (P - d), X**2 + Y**2 - d**2], "triangolo"
    if "diagonale" in text:
        d = int(re.search(r"diagonale di (\d+) cm", text).group(1))
        return "diagonale", P, d, [X + Y - Rational(P, 2), X**2 + Y**2 - d**2], "rettangolo"
    A = int(re.search(r"(?:area di|area è) (\d+) \$\\text\{cm\}\^2\$", text).group(1))
    return "area", P, A, [X + Y - Rational(P, 2), X * Y - A], "rettangolo"


# ---------------------------------------------------------------------------


def check(sample):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    problem = sample["problem"]
    kind_out = None

    if lvl == 6:
        try:
            story, P, N, eqs, fig = parse_story(problem)
        except (ValueError, AttributeError) as e:
            return [f"unreadable story: {e}"], None
        try:
            sols = real_solutions(eqs)
        except ValueError as e:
            return [f"level 6: {e}"], None
        pos = sorted(s for s in sols if s[0] > 0 and s[1] > 0)
        if pos:
            if len(pos) != 2 or not all(v.is_integer for v in pos[0]) or pos[0][0] == pos[0][1]:
                errs.append(f"level 6: expected two integer pairs with different sides, got {pos}")
            truth = ("sides", int(pos[0][0]), int(pos[0][1]))
            kind_out = story
        else:
            truth = ("none",)
            kind_out = "impossibile"
            if story != "area":
                errs.append("level 6: only the rectangle with perimeter and area is impossible")
        if p.get("kind") != kind_out:
            errs.append(f"params.kind {p.get('kind')} but the problem is {kind_out}")
        if str(P) != p.get("P"):
            errs.append("params.P differs from the text")
        # the solution names the sides, or says the figure does not exist
        sol = sample["solution"]
        if truth[0] == "sides":
            m = re.search(r"(\d+)\\ \\text\{cm e \} (\d+)\\ \\text\{cm\}", sol)
            if not m or (int(m.group(1)), int(m.group(2))) != truth[1:]:
                errs.append(f"solution {sol!r} != {truth}")
        elif sol != r"\text{Il rettangolo non esiste}":
            errs.append(f"solution {sol!r} should say the rectangle does not exist")
        if sample["steps"] and truth[0] == "sides" and sample["steps"][-1] != sol:
            errs.append("last step != solution")
    else:
        try:
            lines = parse_problem(problem)
        except ValueError as e:
            return [str(e)], None
        for name, rx in FORBIDDEN_XY:
            if rx.search(problem):
                errs.append(f"problem contains forbidden '{name}': {problem}")
        degs = [degree(e) for _, _, e in lines]
        if sorted(degs) != [1, 2]:
            errs.append(f"degrees {degs}: a system of degree 2 has one equation of degree 1 and one of degree 2")
            return errs, None
        eqs = [e for _, _, e in lines]
        lin_i = degs.index(1)
        lin_e, quad_e = eqs[lin_i], eqs[1 - lin_i]
        try:
            sols = real_solutions(eqs)
        except ValueError as e:
            return errs + [str(e)], None
        truth = pairs_key(sols)
        # params say the same equations
        try:
            pl = [rat(t) for t in p["lin"]]
            pq = [rat(t) for t in p["quad"]]
            e_lin = pl[0] * X + pl[1] * Y - pl[2]
            e_quad = pq[0] * X**2 + pq[1] * Y**2 + pq[2] * X * Y + pq[3] * X + pq[4] * Y - pq[5]
            if not same_equation(e_lin, lin_e) or not same_equation(e_quad, quad_e):
                errs.append("params.lin / params.quad differ from the text")
            if bool(p.get("quadFirst")) != (lin_i == 1):
                errs.append("params.quadFirst differs from the text")
        except (KeyError, ValueError, TypeError) as e:
            errs.append(f"params unreadable: {e}")
        L = Poly(lin_e, X, Y)
        a, b = L.coeff_monomial(X), L.coeff_monomial(Y)
        Qc = coef_vector(quad_e)
        n = len(sols)
        if lvl in (1, 2):
            if abs(a) != 1 and abs(b) != 1:
                errs.append(f"level {lvl}: the linear equation needs a coefficient 1 or -1")
            if a < 0 and b < 0:
                errs.append(f"level {lvl}: both coefficients negative")
            if n != 2:
                errs.append(f"level {lvl}: two pairs expected, got {n}")
            if lvl == 1 and (Qc[0] or Qc[1] or Qc[3] or Qc[4] or not Qc[2]):
                errs.append("level 1: the second equation is xy = p")
            if lvl == 2 and (not Qc[0] or not Qc[1] or Qc[2] or Qc[3] or Qc[4]):
                errs.append("level 2: the second equation is a x^2 + b y^2 = r")
        elif lvl == 3:
            parts = [pt for _, pt, _ in lines]
            if any(pt[0] != "y" or "y" in pt[1] for pt in parts):
                errs.append("level 3: both equations y = f(x)")
            else:
                f1, f2 = (tex_to_sympy(pt[1]) for pt in parts)
                if degree(f1) != 2 or degree(f2) != 1 or Poly(f2, X).coeff_monomial(X) == 0:
                    errs.append("level 3: a parabola first, then a line y = mx + q with m != 0")
                res = Poly((f1 - f2).expand(), X)
                D = discriminant(res.as_expr(), X)
                pos = "secante" if D > 0 else "tangente" if D == 0 else "esterna"
                if n != {"secante": 2, "tangente": 1, "esterna": 0}[pos]:
                    errs.append(f"level 3: {pos} but {n} solutions")
                if any(not v.is_integer for s in sols for v in s):
                    errs.append("level 3: points with integer coordinates")
                truth = ("l3", pos, sols)
                kind_out = pos
                if p.get("kind") != pos:
                    errs.append(f"params.kind {p.get('kind')} but the line is {pos}")
        elif lvl in (4, 5):
            if a != 1 or b != 1 or L.coeff_monomial(1) == 0:
                errs.append(f"level {lvl}: x + y = s with s != 0")
            if lvl == 4:
                if Qc[0] or Qc[1] or Qc[3] or Qc[4] or Qc[2] != 1 or Qc[5] == 0:
                    errs.append("level 4: xy = p with p != 0")
                kind_out = {2: "due coppie", 1: "una coppia", 0: "impossibile"}[n]
                if p.get("kind") != kind_out:
                    errs.append(f"params.kind {p.get('kind')} but the system has {kind_out}")
            else:
                if Qc[0] != 1 or Qc[1] != 1 or Qc[2] or Qc[3] or Qc[4]:
                    errs.append("level 5: x^2 + y^2 = k")
                if n != 2:
                    errs.append(f"level 5: two pairs expected, got {n}")
        else:
            errs.append(f"unknown level {lvl}")

        # solution and last step say the truth
        try:
            sol = sample["solution"]
            i = sol.find("S = ")
            said = read_set(sol[i:]) if i >= 0 else None
            if lvl == 3:
                m = re.match(r"\\text\{(Secante|Tangente|Esterna): \} ", sol)
                said = ("l3", m.group(1).lower(), said[1] if said and said[0] == "pairs" else frozenset()) if m else None
            if said != truth:
                errs.append(f"solution {sol!r} != truth {truth}")
            last = read_set(sample["steps"][-1])
            if last != pairs_key(sols):
                errs.append("last step != truth")
        except (ValueError, IndexError, TypeError) as e:
            errs.append(f"solution or steps unreadable: {e}")

    # the options
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["answer must be a choice"], kind_out
    opts = ans.get("options", [])
    keys = []
    for o in opts:
        try:
            k = from_values(o["values"], lvl)
            if read_option(o["latex"], lvl) != k:
                errs.append(f"option latex {o['latex']} != values {o['values']}")
        except (ValueError, TypeError) as e:
            errs.append(f"option: {e}")
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

    # distractors the spec requires
    if lvl == 1 and len(sols) == 2:
        xs = frozenset(s[0] for s in sols)
        ys = frozenset(s[1] for s in sols)
        if ("nums", xs) not in keys and ("nums", ys) not in keys:
            errs.append("level 1: the option with the numbers only is missing")
        if not any(k and k[0] == "pairs" and len(k[1]) == 1 and k[1] <= sols for k in keys):
            errs.append("level 1: the option with one pair only is missing")
    if lvl == 2 and len(sols) == 2:
        # the other unknown taken from the second-degree equation: one pair with a sign changed
        wrong = set()
        for s in sols:
            for f in ((-s[0], s[1]), (s[0], -s[1])):
                if f != s and quad_e.subs({X: f[0], Y: f[1]}) == 0 and lin_e.subs({X: f[0], Y: f[1]}) != 0:
                    wrong.add(("pairs", (sols - {s}) | {f}))
        if wrong and not any(k in wrong for k in keys):
            errs.append("level 2: the pair taken from the second-degree equation is missing")
    if lvl == 4 and len(sols) == 2:
        if not any(k and k[0] == "pairs" and len(k[1]) == 1 and k[1] <= sols for k in keys):
            errs.append("level 4: the option with one pair only (the swapped pair forgotten) is missing")
    if lvl == 6:
        for k in keys:
            if k and k[0] == "sides" and (k[1] <= 0 or k[1] > 99 or k[2] > 99):
                errs.append(f"level 6: distractor {k} out of range")

    if not sample.get("steps"):
        errs.append("no steps")
    return errs, kind_out
