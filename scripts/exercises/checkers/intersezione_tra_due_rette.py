"""Checker for intersezione-tra-due-rette, written from specs/exercises/intersezione-tra-due-rette.md.

It reads the lines from the LaTeX of the problem (items "name: equation" separated by \\quad), checks that each
is written in its canonical form (implicit ax + by + c = 0 with a > 0, explicit y = mx + q, x = h, y = k; at
levels 2, 4, 5 and 6 the implicit ones without a common factor), recomputes everything with SymPy (linsolve,
Line, Polygon.area, solve for the parameter), reads every option back from its LaTeX, compares it with its
values, and checks that exactly one option is true: the correct one. It also checks the constraints of each
level and the share of each case.
"""
import re

from sympy import Line, Point, Polygon, Rational, gcd, linsolve, Poly, solve as sp_solve, symbols, sympify

from verify import FORBIDDEN

X, Y, K = symbols("x y k")

CASE_RANGES = {
    2: {"implicite": (0.5, 0.7), "verticale": (0.12, 0.28), "orizzontale": (0.12, 0.28)},
    3: {"incidenti": (0.3, 0.5), "parallele": (0.2, 0.4), "coincidenti": (0.2, 0.4)},
    5: {"asse x": (0.3, 0.5), "asse y": (0.12, 0.28), "assi": (0.3, 0.5)},
    6: {"parametro": (0.5, 0.7), "concorrenti": (0.12, 0.28), "non concorrenti": (0.12, 0.28)},
}

FORBIDDEN_LINES = FORBIDDEN + [
    ("1y", re.compile(r"(?<!\d)1\s*y")),
    ("0y", re.compile(r"(?<!\d)0\s*y")),
    ("1k", re.compile(r"(?<!\d)1\s*k")),
]


# ---------------------------------------------------------------------------
# Reading LaTeX

def tex_to_sympy(t):
    s = t.strip()
    frac = re.compile(r"\\d?frac\{([^{}]*)\}\{([^{}]*)\}")
    while frac.search(s):
        s = frac.sub(r"((\1)/(\2))", s)
    if "\\" in s or "{" in s:
        raise ValueError(f"unreadable: {t!r}")
    s = re.sub(r"(\d)\s*([xyk(])", r"\1*\2", s)
    s = re.sub(r"\)\s*([xyk(\d])", r")*\1", s)
    s = re.sub(r"([xyk])\s*([xyk(])", r"\1*\2", s)
    if not re.fullmatch(r"[0-9xyk+\-*/() ]+", s):
        raise ValueError(f"unexpected characters: {t!r}")
    return sympify(s, locals={"x": X, "y": Y, "k": K})


def value(t):
    t = t.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        return Rational(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    if re.fullmatch(r"-?\d+", t):
        return Rational(int(t))
    raise ValueError(f"unreadable value {t!r}")


def fmt_seq(items):
    """Terms as the lesson writes them: no 1x, no + -, no zero terms."""
    out = []
    for c, v in items:
        c = Rational(c)
        if c == 0:
            continue
        a = abs(c)
        num = f"\\frac{{{a.p}}}{{{a.q}}}" if a.q != 1 else str(a.p)
        body = (v if a == 1 else f"{num}{v}") if v else num
        if not out:
            out.append(("-" if c < 0 else "") + body)
        else:
            out.append((" - " if c < 0 else " + ") + body)
    return "".join(out) if out else "0"


def read_line(item):
    """(name, form, (a, b, c) of a x + b y + c = 0 or None for a line with k, the equation as a SymPy expression)."""
    m = re.fullmatch(r"([a-zA-Z]+): (.*) = (.*)", item)
    if not m:
        raise ValueError(f"not a line: {item!r}")
    name, lhs, rhs = m.group(1), m.group(2), m.group(3)
    expr = tex_to_sympy(lhs) - tex_to_sympy(rhs)
    if "k" in lhs:
        form = "param"
    elif rhs == "0":
        form = "imp"
    elif lhs == "x":
        form = "vert"
    elif lhs == "y":
        form = "exp" if "x" in rhs else "hor"
    else:
        raise ValueError(f"unknown form: {item!r}")
    if form == "param":
        return name, form, None, expr
    P = Poly(expr, X, Y)
    if P.total_degree() != 1:
        raise ValueError(f"not a line: {item!r}")
    abc = (P.coeff_monomial(X), P.coeff_monomial(Y), P.coeff_monomial(1))
    # the canonical text of that form
    a, b, c = abc
    if form == "imp":
        canon = f"{fmt_seq([(a, 'x'), (b, 'y'), (c, '')])} = 0"
    elif form == "exp":
        canon = f"y = {fmt_seq([(-a / b, 'x'), (-c / b, '')])}"
    elif form == "vert":
        canon = f"x = {fmt_seq([(-c / a, '')])}"
    else:
        canon = f"y = {fmt_seq([(-c / b, '')])}"
    if f"{name}: {canon}" != item:
        raise ValueError(f"not in canonical form: {item!r} (expected {canon!r})")
    return name, form, abc, expr


def primitive(abc):
    a, b, c = abc
    ints = all(Rational(v).q == 1 for v in abc)
    return ints and gcd(gcd(a, b), c) == 1 and (a > 0 or (a == 0 and b > 0))


def meet(e1, e2):
    sol = linsolve([e1, e2], X, Y)
    if not sol:
        return None
    (sx, sy), = list(sol)
    if sx.free_symbols or sy.free_symbols:
        return "same"
    return (sx, sy)


def position(e1, e2):
    p = meet(e1, e2)
    if p is None:
        return "parallele", None
    if p == "same":
        return "coincidenti", None
    return "incidenti", p


def read_point(t):
    m = re.fullmatch(r"([A-Z])\((-?\d+), (-?\d+)\)", t) or re.fullmatch(r"([A-Z])\\left\((.*), (.*)\\right\)", t)
    if not m:
        raise ValueError(f"unreadable point {t!r}")
    x, y = value(m.group(2)), value(m.group(3))
    if "\\left" in t and x.q == 1 and y.q == 1:
        raise ValueError(f"\\left( on an integer point: {t!r}")
    if "\\left" not in t and (x.q != 1 or y.q != 1):
        raise ValueError(f"fraction without \\left(: {t!r}")
    return m.group(1), x, y


def read_option(latex):
    """A key: ("P", letter, x, y), ("x", h), ("y", k), ("incidenti", x, y), ("parallele",), ("coincidenti",),
    ("concorrenti", x, y), ("non concorrenti",), ("n", v)."""
    if latex == r"\text{parallele distinte}":
        return ("parallele",)
    if latex == r"\text{coincidenti}":
        return ("coincidenti",)
    if latex == r"\text{non concorrenti}":
        return ("non concorrenti",)
    for tag in ("incidenti", "concorrenti"):
        pre = f"\\text{{{tag} in }} "
        if latex.startswith(pre):
            letter, x, y = read_point(latex[len(pre):])
            if letter != "P":
                raise ValueError(f"point not named P: {latex!r}")
            return (tag, x, y)
    m = re.fullmatch(r"([xy]) = (.*)", latex)
    if m:
        return (m.group(1), value(m.group(2)))
    if re.match(r"[A-Z](\(|\\left)", latex):
        letter, x, y = read_point(latex)
        return ("P", letter, x, y)
    return ("n", value(latex))


def from_values(vals, letter):
    t = vals[0]
    if t == "P":
        return ("P", letter, Rational(vals[1]), Rational(vals[2]))
    if t in ("x", "y"):
        return (t, Rational(vals[1]))
    if t in ("incidenti", "concorrenti"):
        return (t, Rational(vals[1]), Rational(vals[2]))
    if t in ("parallele", "coincidenti", "non concorrenti"):
        return (t,)
    return ("n", Rational(t))


# ---------------------------------------------------------------------------
# Check

def check_choice(ch, truth_fn, letter, errs, what="answer"):
    """Every option read back equals its values; exactly one option is true, and it is the correct one."""
    if not ch or ch.get("kind") != "choice":
        errs.append(f"{what}: no choice")
        return
    opts = ch["options"]
    if len(opts) != 4:
        errs.append(f"{what}: {len(opts)} options")
    keys = []
    for o in opts:
        try:
            k = read_option(o["latex"])
        except ValueError as e:
            errs.append(f"{what}: {e}")
            return
        if k != from_values(o["values"], letter):
            errs.append(f"{what}: option {o['latex']!r} != values {o['values']}")
        keys.append(k)
    if len(set(keys)) != len(keys):
        errs.append(f"{what}: options not distinct {keys}")
    true = [i for i, k in enumerate(keys) if truth_fn(k)]
    if true != [ch["correct"]]:
        errs.append(f"{what}: true options {true}, correct {ch['correct']}: {[o['latex'] for o in opts]}")


def point_is(k, p, letter="P"):
    return k[0] == "P" and k[1] == letter and (k[2], k[3]) == tuple(p)


def check(sample):
    errs = []
    lvl = sample["level"]
    problem = sample["problem"]
    prompt = sample["prompt"]
    for name, rx in FORBIDDEN_LINES:
        if rx.search(problem):
            errs.append(f"problem contains {name}: {problem}")
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("no steps or solution")
    try:
        lines = [read_line(it) for it in problem.split(" \\quad ")]
    except ValueError as e:
        return [str(e)], None
    names = [ln[0] for ln in lines]
    forms = [ln[1] for ln in lines]
    exprs = [ln[3] for ln in lines]
    ans = sample["answer"]
    choice = ans if ans.get("kind") == "choice" else sample.get("choice")
    case = None

    def small(abc, m_ab, m_c):
        return all(Rational(v).q == 1 for v in abc) and abs(abc[0]) <= m_ab and abs(abc[1]) <= m_ab and abs(abc[2]) <= m_c

    if lvl in (1, 2):
        if names != ["r", "s"]:
            return [f"expected r and s: {names}"], None
        kind, P = position(*exprs)
        if kind != "incidenti":
            return [f"lines are {kind}"], None
        check_choice(choice, lambda k: point_is(k, P), "P", errs)
        if lvl == 1:
            if forms != ["exp", "exp"]:
                errs.append(f"level 1: forms {forms}")
            if any(v.q != 1 or abs(v) > 6 for v in P):
                errs.append(f"level 1: point {P} not integer")
            for _, _, (a, b, c), _ in lines:
                if abs(a / b) > 4 or abs(c / b) > 9 or (a / b).q != 1 or (c / b).q != 1:
                    errs.append("level 1: m or q out of range")
        else:
            if forms == ["imp", "imp"]:
                case = "implicite"
            elif forms == ["vert", "imp"]:
                case = "verticale"
            elif forms == ["hor", "imp"]:
                case = "orizzontale"
            else:
                errs.append(f"level 2: forms {forms}")
            if all(v.q == 1 for v in P) or any(v.q > 6 for v in P):
                errs.append(f"level 2: point {P} needs a fractional coordinate, denominator up to 6")
            for _, f, abc, _ in lines:
                if f == "imp" and (not primitive(abc) or not small(abc, 5, 20) or 0 in abc):
                    errs.append(f"level 2: implicit line {abc} not primitive, small, complete")
    elif lvl == 3:
        if names != ["r", "s"]:
            return [f"expected r and s: {names}"], None
        case, P = position(*exprs)
        if case != sample["params"].get("kind"):
            errs.append(f"level 3: params say {sample['params'].get('kind')}, lines are {case}")

        def true3(k):
            if k[0] == "incidenti":
                return case == "incidenti" and (k[1], k[2]) == tuple(P)
            return k[0] == case

        check_choice(choice, true3, "P", errs)
        if "vert" in forms or "hor" in forms:
            errs.append("level 3: lines parallel to the axes")
        if forms == ["exp", "exp"] and case == "coincidenti":
            errs.append("level 3: two identical explicit equations")
        for _, f, abc, _ in lines:
            if f == "imp" and (0 in abc or any(Rational(v).q != 1 for v in abc) or abc[0] < 0):
                errs.append(f"level 3: implicit line {abc}")
            if f == "exp" and ((-abc[0] / abc[1]).q != 1 or (-abc[2] / abc[1]).q != 1):
                errs.append("level 3: explicit line with fractional m or q")
    elif lvl == 4:
        if names != ["AB", "BC", "CA"]:
            return [f"expected AB, BC, CA: {names}"], None
        m = re.fullmatch(r"I lati del triangolo ABC stanno su queste rette\. Trova il vertice ([ABC])\.", prompt)
        if not m:
            return [f"unreadable prompt {prompt!r}"], None
        ask = m.group(1)
        e = dict(zip(names, exprs))
        V = {"A": meet(e["AB"], e["CA"]), "B": meet(e["AB"], e["BC"]), "C": meet(e["BC"], e["CA"])}
        if any(not isinstance(p, tuple) for p in V.values()):
            return ["level 4: two sides parallel"], None
        tri = Polygon(*(Point(*V[k]) for k in "ABC"))
        if not isinstance(tri, Polygon) or tri.area == 0:
            errs.append("level 4: degenerate triangle")
        if any(v.q != 1 or abs(v) > 5 for p in V.values() for v in p):
            errs.append(f"level 4: vertices {V} not integer in [-5, 5]")
        for _, f, abc, _ in lines:
            if f != "imp" or not primitive(abc) or 0 in abc[:2] or not small(abc, 6, 20):
                errs.append(f"level 4: side {abc}")
        check_choice(choice, lambda k: point_is(k, V[ask], ask), ask, errs)
        # the other letters must not appear in the options
        for o in (choice or {}).get("options", []):
            if not o["latex"].startswith(ask):
                errs.append(f"level 4: option {o['latex']!r} not named {ask}")
    elif lvl == 5:
        if prompt == "Trova l'area del triangolo che la retta r forma con gli assi.":
            case = "assi"
            if names != ["r"]:
                return [f"expected r: {names}"], None
            sides = [exprs[0], X, Y]
        else:
            m = re.fullmatch(r"Trova l'area del triangolo formato dalle rette r, s e dall'asse ([xy])\.", prompt)
            if not m or names != ["r", "s"]:
                return [f"unreadable prompt {prompt!r}"], None
            case = f"asse {m.group(1)}"
            axis = Y if m.group(1) == "x" else X
            sides = [exprs[0], exprs[1], axis]
            # the third vertex is off the axis
            C = meet(exprs[0], exprs[1])
            if not isinstance(C, tuple) or C[1 if m.group(1) == "x" else 0] == 0:
                errs.append("level 5: third vertex on the axis")
        verts = [meet(sides[i], sides[j]) for i, j in ((0, 1), (1, 2), (2, 0))]
        if any(not isinstance(p, tuple) for p in verts):
            return ["level 5: parallel sides"], None
        tri = Polygon(*(Point(*p) for p in verts))
        area = abs(tri.area) if isinstance(tri, Polygon) else 0
        if area == 0:
            return ["level 5: degenerate triangle"], case
        if ans.get("kind") != "number" or Rational(ans["value"]) != area:
            errs.append(f"level 5: answer {ans.get('value')} != area {area}")
        if area.q > 4:
            errs.append(f"level 5: area {area} with denominator > 4")
        for _, f, abc, _ in lines:
            if f != "imp" or not primitive(abc) or not small(abc, 8, 20):
                errs.append(f"level 5: line {abc}")
        check_choice(choice, lambda k: k == ("n", area), "", errs, "choice")
        for o in (choice or {}).get("options", []):
            if o["values"] == ["0"]:
                errs.append("level 5: zero area option")
    elif lvl == 6:
        if names[:2] != ["r", "s"]:
            return [f"expected r, s: {names}"], None
        P = meet(exprs[0], exprs[1])
        if not isinstance(P, tuple):
            return ["level 6: r and s not incident"], None
        if any(v.q != 1 for v in P):
            errs.append(f"level 6: point {P} not integer")
        for _, f, abc, _ in lines[:2]:
            if not primitive(abc) or not small(abc, 5, 20):
                errs.append(f"level 6: line {abc}")
        if forms[2] == "param":
            case = "parametro"
            if names[2] != "v" or prompt != "Per quale valore di k le tre rette passano per lo stesso punto?":
                errs.append("level 6: parameter line or prompt")
            at_p = exprs[2].subs({X: P[0], Y: P[1]})
            ks = sp_solve(at_p, K)
            if len(ks) != 1:
                return [f"level 6: k solutions {ks}"], case
            k0 = ks[0]
            if ans.get("kind") != "number" or Rational(ans["value"]) != k0:
                errs.append(f"level 6: answer {ans.get('value')} != k {k0}")
            v_line = exprs[2].subs(K, k0)
            for e in exprs[:2]:
                if position(e, v_line)[0] != "incidenti":
                    errs.append("level 6: with that k, v is parallel to r or s")
            check_choice(choice, lambda k: k == ("n", k0), "", errs, "choice")
        else:
            if names[2] != "t" or forms[2] != "imp":
                errs.append("level 6: third line")
            conc = exprs[2].subs({X: P[0], Y: P[1]}) == 0
            case = "concorrenti" if conc else "non concorrenti"
            for e in exprs[:2]:
                if position(e, exprs[2])[0] != "incidenti":
                    errs.append("level 6: t parallel to r or s")

            def true6(k):
                if k[0] == "concorrenti":
                    return conc and (k[1], k[2]) == tuple(P)
                return k[0] == "non concorrenti" and not conc

            check_choice(choice, true6, "P", errs)
        if case != sample["params"].get("kind"):
            errs.append(f"level 6: params say {sample['params'].get('kind')}, case {case}")
    else:
        errs.append(f"unknown level {lvl}")
    # a second computation of the point with SymPy's Line, for the pairs of levels 1-3
    if lvl in (1, 2, 3) and not errs and case in (None, "implicite", "verticale", "orizzontale", "incidenti"):
        got = as_line(lines[0][2]).intersection(as_line(lines[1][2]))
        if len(got) != 1 or tuple(got[0]) != tuple(meet(exprs[0], exprs[1])):
            errs.append(f"Line.intersection {got} != linsolve")
    return errs, case


def as_line(abc):
    a, b, c = abc
    if b != 0:
        return Line(Point(0, -c / b), Point(1, (-c - a) / b))
    return Line(Point(-c / a, 0), Point(-c / a, 1))
