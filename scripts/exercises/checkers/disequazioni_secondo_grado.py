"""Checker for disequazioni-secondo-grado, written from specs/exercises/disequazioni-secondo-grado.md.

It reads the inequality from the LaTeX of the problem, solves it with SymPy (reduce_rational_inequalities over
the reals) and compares the result with the right option, the solution and the last step. Every option is
read back from its LaTeX (inequalities joined by "oppure", intervals with reversed brackets, the special sets
of the table, one or two lines of a gathered) and must say the same intervals as its values; the ends must be
in the simplified form (square-free radicand, reduced fraction). Each wrong option carries the tag of the
mistake it comes from, and the checker makes that mistake again on its own (the sign turned, the ends
toggled, the equation in place of the inequality, 2 in place of 2a, the sign not changed with a < 0, the
second member forgotten, the zeros in the wrong order, the square root taken, the division by x, the other
rows of the table). Then the constraints of each level and the share of the forms of levels 3, 4 and 7.
"""
import re
from functools import lru_cache
from math import gcd  # noqa: F401

from sympy import (
    EmptySet,
    FiniteSet,
    Interval,
    Poly,
    Rational,
    S,
    Union,
    cancel,
    expand,
    factorint,
    ilcm,
    oo,
    radsimp,
    sqrt,
    sympify,
)
from sympy.core.relational import Ge, Gt, Le, Lt
from sympy.solvers.inequalities import reduce_rational_inequalities

from verify import x

CASE_RANGES = {
    3: {"a negativo": (0.25, 0.45), "due membri": (0.25, 0.45), "due membri, a negativo": (0.20, 0.40)},
    4: {"b pari": (0.65, 0.85), "b dispari": (0.15, 0.35)},
    7: {"pura": (0.30, 0.50), "pura sempre o mai": (0.12, 0.28), "spuria": (0.30, 0.50)},
}

REL = {"<": Lt, ">": Gt, r"\leq": Le, r"\geq": Ge}
FLIP = {"<": ">", ">": "<", r"\leq": r"\geq", r"\geq": r"\leq"}
TOGGLE = {"<": r"\leq", ">": r"\geq", r"\leq": "<", r"\geq": ">"}
OPS_TS = {"<": "<", ">": ">", "<=": r"\leq", ">=": r"\geq"}
LARGE = {r"\leq", r"\geq"}
FORBIDDEN = [r"(?<![\d}])1\s*x", r"(?<![\d}])0\s*x", r"\+\s*-", r"-\s*-", r"\+\s*\+", r"\^\{?1(?!\d)", r"[+-]\s*0(?!\d)"]
OPPURE = r" \ \text{ oppure } \ "


# ---------------------------------------------------------------------------
# LaTeX to SymPy


def to_py(s):
    s = s.strip().replace("^", "**")
    s = re.sub(r"(\d)\s*x", r"\1*x", s)
    if not re.fullmatch(r"[0-9x+\-*/() ]+", s):
        raise ValueError(f"unreadable expression {s!r}")
    return s


def poly_expr(s):
    return sympify(to_py(s), locals={"x": x})


def brace(s, i):
    """The brace group starting at s[i] == '{': (content, index after it)."""
    if s[i] != "{":
        raise ValueError(f"expected a brace in {s!r}")
    depth = 0
    for k in range(i, len(s)):
        if s[k] == "{":
            depth += 1
        elif s[k] == "}":
            depth -= 1
            if depth == 0:
                return s[i + 1 : k], k + 1
    raise ValueError(f"unbalanced braces in {s!r}")


def end_value(t):
    """An end of an interval: an integer, a fraction, a radical; returns (value, style errors)."""
    t = t.strip()
    if t in (r"+\infty",):
        return oo, []
    if t == r"-\infty":
        return -oo, []
    errs = []
    for r in re.findall(r"\\sqrt\{(\d+)\}", t):
        r = int(r)
        if r < 2 or any(e > 1 for e in factorint(r).values()):
            errs.append(f"radicand {r} not square-free in {t!r}")
    if not errs:
        want = canon_latex(parse_end(t))
        if t != want:
            errs.append(f"end {t!r} not in the simplified form {want!r}")
    return parse_end(t), errs


def parse_end(t):
    py = t
    while r"\frac" in py:
        i = py.index(r"\frac")
        a, j = brace(py, i + 5)
        b, k = brace(py, j)
        py = py[:i] + f"(({a})/({b}))" + py[k:]
    py = re.sub(r"(\d)\\sqrt\{(\d+)\}", r"\1*sqrt(\2)", py)
    py = re.sub(r"\\sqrt\{(\d+)\}", r"sqrt(\1)", py)
    if not re.fullmatch(r"[0-9sqrt+\-*/() ]+", py):
        raise ValueError(f"unreadable end {t!r}")
    return sympify(py)


def canon_latex(v):
    """The simplified form of p + q·√r: one fraction (A ± K√r)/D with gcd(A, K, D) = 1, the sign in front of a
    rational fraction, no 1 in front of the radical."""
    v = expand(radsimp(v))
    if v.is_Rational:
        if v.q == 1:
            return f"{v.p}"
        return f"{'-' if v < 0 else ''}\\frac{{{abs(v.p)}}}{{{v.q}}}"
    p = sum((t for t in v.as_ordered_terms() if t.is_Rational), Rational(0))
    rad = expand(v - p)
    qq, root = rad.as_coeff_Mul()
    r = root.args[0]
    D = ilcm(Rational(p).q, Rational(qq).q)
    A, K = int(p * D), int(qq * D)
    k = abs(K)
    rt = f"{'' if k == 1 else k}\\sqrt{{{r}}}"
    if A == 0:
        body = f"{'-' if K < 0 else ''}{rt}"
        return body if D == 1 else f"{'-' if K < 0 else ''}\\frac{{{rt}}}{{{D}}}"
    body = f"{A} {'-' if K < 0 else '+'} {rt}"
    return body if D == 1 else f"\\frac{{{body}}}{{{D}}}"


def value_end(v):
    if v == "-oo":
        return -oo
    if v == "oo":
        return oo
    if not re.fullmatch(r"[0-9sqrt+\-*/() ]+", v):
        raise ValueError(f"bad value {v!r}")
    return sympify(v)


def eq(a, b):
    if a in (oo, -oo) or b in (oo, -oo):
        return a == b
    return expand(radsimp(a - b)) == 0


def same_pieces(p, r):
    return len(p) == len(r) and all(eq(a[0], b[0]) and eq(a[1], b[1]) and a[2] == b[2] and a[3] == b[3] for a, b in zip(p, r))


def to_set(pieces):
    out = []
    for lo, hi, lc, hc in pieces:
        if lo != -oo and hi != oo and eq(lo, hi):
            out.append(FiniteSet(lo))
        else:
            out.append(Interval(lo, hi, not lc, not hc))
    return Union(*out) if out else EmptySet


def same(a, b):
    return (a - b) == EmptySet and (b - a) == EmptySet


# ---------------------------------------------------------------------------
# Options


def from_values(vals):
    out = []
    for v in vals:
        m = re.fullmatch(r"([\[(])([^,]+),([^,]+)([\])])", v)
        if not m:
            raise ValueError(f"bad option value {v!r}")
        out.append((value_end(m.group(2)), value_end(m.group(3)), m.group(1) == "[", m.group(4) == "]"))
    return out


def lines(tex, joiner):
    """One line, or the two lines of a gathered, joined back; the second line must start with the joiner."""
    m = re.fullmatch(r"\\begin\{gathered\} (.+) \\\\ (.+) \\end\{gathered\}", tex)
    if not m:
        return tex
    first, second = m.group(1), m.group(2)
    if not second.startswith(joiner):
        raise ValueError(f"second line does not start with {joiner!r}: {tex!r}")
    return first, second[len(joiner) :]


def read_interval(raw):
    errs = []
    raw = raw.strip()
    frac = r"\frac" in raw or r"\sqrt" in raw
    if frac and not raw.startswith(r"\left"):
        errs.append(f"interval with a fraction or radical without \\left: {raw!r}")
    if not frac and r"\left" in raw:
        errs.append(f"\\left without a fraction: {raw!r}")
    if re.search(r"(?<!\\,)\\mathopen", raw):
        errs.append(f"missing \\, before \\mathopen: {raw!r}")
    t = raw.replace(r"\,", "").strip()
    for a, b in ((r"\mathopen{]}", "]"), (r"\mathclose{[}", "["), (r"\left]", "]"), (r"\left[", "["), (r"\right[", "["), (r"\right]", "]")):
        t = t.replace(a, b)
    m = re.fullmatch(r"([\[\]])(.+), (.+)([\[\]])", t.strip())
    if not m:
        raise ValueError(f"unreadable interval {raw!r}")
    lo, e1 = end_value(m.group(2))
    hi, e2 = end_value(m.group(3))
    return (lo, hi, m.group(1) == "[", m.group(4) == "]"), errs + e1 + e2


def read_set(tex):
    """S = ... in any of its forms -> (pieces, style errors)."""
    g = lines(tex, r"\cup ")
    if isinstance(g, tuple):
        if not g[0].startswith("S = "):
            raise ValueError(f"not a set: {tex!r}")
        parts = [g[0][4:], g[1]]
        if r"\cup" in parts[0] or r"\cup" in parts[1]:
            raise ValueError(f"more than two intervals: {tex!r}")
        wide = True
    else:
        if not tex.startswith("S = "):
            raise ValueError(f"not a set: {tex!r}")
        body = tex[4:]
        if body == r"\emptyset":
            return [], []
        if body == r"\mathbb{R}":
            return [(-oo, oo, False, False)], []
        m = re.fullmatch(r"\\mathbb\{R\} \\setminus \\\{(.+)\\\}", body)
        if m:
            v, e = end_value(m.group(1))
            return [(-oo, v, False, False), (v, oo, False, False)], e
        m = re.fullmatch(r"\\\{(.+)\\\}", body)
        if m:
            out, errs = [], []
            for t in m.group(1).split(", "):
                v, e = end_value(t)
                out.append((v, v, True, True))
                errs += e
            return out, errs
        parts = body.split(r" \cup ")
        wide = False
    out, errs = [], []
    for p in parts:
        piece, e = read_interval(p)
        out.append(piece)
        errs += e
    if len(parts) == 2:
        has_frac = any(r"\frac" in p or r"\sqrt" in p for p in parts)
        if has_frac != wide:
            errs.append(f"two intervals with a fraction go on two lines, the others on one: {tex!r}")
    return out, errs


def read_piece(p):
    p = p.strip()
    m = re.fullmatch(r"x = (.+)", p)
    if m:
        v, e = end_value(m.group(1))
        return (v, v, True, True), e
    m = re.fullmatch(r"x (<|\\leq) (.+)", p)
    if m:
        v, e = end_value(m.group(2))
        return (-oo, v, False, m.group(1) == r"\leq"), e
    m = re.fullmatch(r"x (>|\\geq) (.+)", p)
    if m:
        v, e = end_value(m.group(2))
        return (v, oo, m.group(1) == r"\geq", False), e
    m = re.fullmatch(r"(.+) (<|\\leq) x (<|\\leq) (.+)", p)
    if m:
        lo, e1 = end_value(m.group(1))
        hi, e2 = end_value(m.group(4))
        return (lo, hi, m.group(2) == r"\leq", m.group(3) == r"\leq"), e1 + e2
    raise ValueError(f"unreadable piece {p!r}")


def read_inequalities(tex):
    g = lines(tex, r"\text{oppure} \ ")
    parts = list(g) if isinstance(g, tuple) else tex.split(OPPURE)
    out, errs = [], []
    for p in parts:
        piece, e = read_piece(p)
        out.append(piece)
        errs += e
    if isinstance(g, tuple) and not any(r"\sqrt" in p for p in parts):
        errs.append(f"gathered without a radical: {tex!r}")
    return out, errs


def read_option(tex, notation):
    if tex.startswith("S = ") or tex.startswith(r"\begin{gathered} S = "):
        return read_set(tex)
    if notation != "disequazioni":
        raise ValueError(f"inequalities in notation {notation!r}: {tex!r}")
    return read_inequalities(tex)


def is_special(pieces):
    s = to_set(pieces)
    if s == EmptySet or s == S.Reals:
        return True
    if isinstance(s, FiniteSet) and len(s) == 1:
        return True
    return isinstance(s, Union) and len(pieces) == 2 and pieces[0][0] == -oo and pieces[1][1] == oo and eq(pieces[0][1], pieces[1][0])


# ---------------------------------------------------------------------------
# Solving


@lru_cache(maxsize=None)
def _solve(e, op):
    return reduce_rational_inequalities([[REL[op](e, 0)]], x, relational=False)


def solve(e, op):
    """e op 0 over the reals, with SymPy's solver for polynomial and rational inequalities."""
    return _solve(expand(e), op)


def pieces_of(e, op):
    """The solution of e op 0 as ordered pieces, the way the options write them (a point as [v, v])."""
    st = solve(e, op)
    parts = st.args if isinstance(st, Union) else (st,)
    out = []
    for p in parts:
        if p == EmptySet:
            continue
        if isinstance(p, FiniteSet):
            out += [(v, v, True, True) for v in p.args]
        elif isinstance(p, Interval):
            out.append((p.start, p.end, not p.left_open, not p.right_open))
        else:
            raise ValueError(f"unexpected set {p}")
    return sorted(out, key=lambda t: float(t[0]) if t[0] != -oo else -1e9)


def zeros(P):
    rs = sorted(set(Poly(P, x).real_roots()), key=float)
    return [radsimp(r) for r in rs]


def expected_wrong(tag, ctx):
    P, L, op, lvl = ctx["P"], ctx["L"], ctx["op"], ctx["level"]
    a = Poly(P, x).LC()
    if tag == "scambiati":
        return to_set(pieces_of(P, FLIP[op]))
    if tag == "estremi":
        return to_set(pieces_of(P, TOGGLE[op]))
    if tag == "scambiati ed estremi":
        return to_set(pieces_of(P, TOGGLE[FLIP[op]]))
    if tag == "equazione":
        return FiniteSet(*zeros(P))
    if tag == "denominatore":
        # (-b ± √Δ)/2 in place of (-b ± √Δ)/(2a): the zeros a times too big
        z = zeros(P)
        Q = expand((x - a * z[0]) * (x - a * z[1]) * (1 if a > 0 else -1))
        return solve(Q, op)
    if tag == "verso":
        if a > 0:
            raise ValueError("verso with a > 0")
        return solve(-P, op)
    if tag == "senza zero":
        return solve(L, op)
    if tag == "radice":
        k = sqrt(-Poly(P, x).coeff_monomial(1) / a)
        return solve(x - k, op)
    if tag == "dividi":
        return solve(cancel(P / x), op)
    if tag.startswith("tabella:"):
        v = -Poly(P, x).coeff_monomial(x) / (2 * a)
        return solve((x - v) ** 2, OPS_TS[tag.split(":")[1]])
    raise ValueError(f"unknown tag {tag!r}")


# ---------------------------------------------------------------------------


def check(sample):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    tex = sample["problem"]
    for rx in FORBIDDEN:
        if re.search(rx, tex):
            errs.append(f"forbidden pattern {rx} in {tex!r}")
    parts = re.split(r" (<|>|\\leq|\\geq) ", tex)
    if len(parts) != 3:
        return [f"not one inequality: {tex!r}"], None
    lhs, op, rhs = parts
    L, R = poly_expr(lhs), poly_expr(rhs)
    P = expand(L - R)
    PP = Poly(P, x)
    if PP.degree() != 2:
        return [f"degree {PP.degree()}"], None
    a, b, c = PP.coeff_monomial(x**2), PP.coeff_monomial(x), PP.coeff_monomial(1)
    delta = b**2 - 4 * a * c
    truth = solve(P, op)
    tpieces = pieces_of(P, op)
    zs = zeros(P)

    # ends included only with ≥ and ≤
    for lo, hi, lc, hc in tpieces:
        for e, closed in ((lo, lc), (hi, hc)):
            if e not in (oo, -oo) and closed != (op in LARGE):
                errs.append("an end included or excluded against the sign")

    # the answer
    ans = sample["answer"]
    notation = p.get("notation")
    if ans.get("kind") != "choice":
        return errs + ["answer must be a choice"], None
    opts = ans["options"]
    tags = p.get("optionTags", [])
    if len(opts) != 4 or len(tags) != 4:
        errs.append("need four options with their tags")
    raws, sets = [], []
    for o in opts:
        val = from_values(o["values"])
        shown, style = read_option(o["latex"], notation)
        errs += style
        if not same_pieces(val, shown):
            errs.append(f"option latex {o['latex']!r} != values {o['values']}")
        if notation == "disequazioni" and o["latex"].startswith("S = ") and not is_special(val):
            errs.append(f"set notation in a disequazioni option: {o['latex']!r}")
        raws.append(val)
        sets.append(to_set(val))
    for i in range(len(raws)):
        for j in range(i):
            if same_pieces(raws[i], raws[j]):
                errs.append(f"options {j} and {i} are written the same")
    right = [i for i, s in enumerate(sets) if same(s, truth)]
    if right != [ans.get("correct")]:
        errs.append(f"right options {right}, correct = {ans.get('correct')}, truth {truth}")
    elif not same_pieces(raws[ans["correct"]], tpieces):
        errs.append("the right option is not written as the ordered intervals")
    ctx = {"P": P, "L": L, "op": op, "level": lvl}
    for i, (t, s) in enumerate(zip(tags, sets)):
        if i == ans.get("correct"):
            if t != "giusta":
                errs.append(f"correct option tagged {t!r}")
            continue
        if t == "giusta":
            errs.append("wrong option tagged giusta")
            continue
        if t == "ordine":
            # the right intervals with x1 and x2 exchanged
            if len(zs) != 2:
                errs.append("ordine without two zeros")
                continue
            sw = lambda e: e if e in (oo, -oo) else (zs[1] if eq(e, zs[0]) else zs[0])  # noqa: E731
            want = [(sw(lo), sw(hi), lc, hc) for lo, hi, lc, hc in tpieces]
            if not same_pieces(raws[i], want):
                errs.append(f"option {i} tagged ordine is not the swapped solution")
            continue
        if not same(s, expected_wrong(t, ctx)):
            errs.append(f"option {i} tagged {t!r} is not that mistake: {opts[i]['values']}")
        if not t.startswith("tabella") and (s == EmptySet or s == S.Reals):
            errs.append(f"option {i} is empty or all of R")
    table = any(t.startswith("tabella") for t in tags)
    if table:
        v = -b / (2 * a)
        four = [solve((x - v) ** 2, o) for o in (">", r"\geq", "<", r"\leq")]
        if sorted(i for s in sets for i, f in enumerate(four) if same(s, f)) != [0, 1, 2, 3]:
            errs.append("the four options are not the four answers of the table")

    # solution and last step
    try:
        sol, style = read_set(sample["solution"])
        errs += style
        if not same_pieces(sol, tpieces):
            errs.append(f"solution {sample['solution']!r} != {truth}")
        last = sample["steps"][-1]
        if last == r"\text{Nessun } x \text{ è soluzione.}":
            got = EmptySet
        elif last == r"\text{Ogni } x \text{ è soluzione.}":
            got = S.Reals
        elif last.startswith(r"x \neq "):
            v, _ = end_value(last[len(r"x \neq ") :])
            got = S.Reals - FiniteSet(v)
        else:
            got = to_set(read_inequalities(last)[0])
        if not same(got, truth):
            errs.append("last step is not the solution")
    except (ValueError, IndexError) as e:
        errs.append(f"solution or last step unreadable: {e}")

    # steps: Δ of the trinomial with a > 0, the approximations of irrational zeros
    steps = sample.get("steps", [])
    dsteps = [s for s in steps if s.startswith(r"\Delta = ")]
    if lvl <= 6:
        if len(dsteps) != 1 or not dsteps[0].endswith(f"= {delta}") and dsteps[0] != rf"\Delta = {delta}":
            errs.append(f"the step with Δ does not give {delta}")
    for s in steps:
        for num, whole in re.findall(r"\\approx (-?(\d+)\{,\}\d\d)", s):
            val = float(num.replace("{,}", "."))
            if not any(abs(float(z) - val) < 0.006 for z in zs):
                errs.append(f"approximation {num} is not a zero")
        if re.search(r"\\begin\{", s) and r"\text" in s:
            errs.append(f"environment with text in a step: {s!r}")
    if r"\text" in sample.get("solution", ""):
        errs.append("text in the solution")

    # levels
    rhs_zero = R == 0
    complete = b != 0 and c != 0
    rational = all(z.is_rational for z in zs)
    kind = None
    if lvl in (1, 2, 4, 5, 6) and not complete:
        errs.append(f"level {lvl}: complete trinomial")
    if lvl in (1, 2, 4, 5, 6) and not rhs_zero:
        errs.append(f"level {lvl}: zero on the right")
    if lvl == 1:
        if a != 1 or len(zs) != 2 or not all(z.is_integer and abs(z) <= 9 for z in zs):
            errs.append("level 1: a = 1, two integer zeros in [-9, 9]")
    elif lvl == 2:
        if a < 2 or len(zs) != 2 or not rational or all(z.is_integer for z in zs):
            errs.append("level 2: a > 1, rational zeros, at least one fractional")
        elif any(z.q > 3 or abs(z.p) > 7 for z in zs):
            errs.append("level 2: small zeros")
    elif lvl == 3:
        if not complete:
            errs.append("level 3: complete trinomial after moving the terms")
        if len(zs) != 2 or not all(z.is_integer and abs(z) <= 6 for z in zs):
            errs.append("level 3: two integer zeros in [-6, 6]")
        if rhs_zero:
            kind = "a negativo"
            if a > 0:
                errs.append("level 3: with zero on the right, a negative")
        else:
            kind = "due membri" if a > 0 else "due membri, a negativo"
            if not all(z.is_integer for z in zeros(L)) or len(zeros(L)) != 2:
                errs.append("level 3: the first member alone has two integer zeros")
            if Poly(R, x).degree() > 1:
                errs.append("level 3: the second member of first degree")
    elif lvl == 4:
        if a != 1 or len(zs) != 2 or rational:
            errs.append("level 4: a = 1, irrational zeros")
        kind = "b pari" if b % 2 == 0 else "b dispari"
    elif lvl == 5:
        if delta != 0:
            errs.append("level 5: Δ = 0")
        if not table:
            errs.append("level 5: the options of the table")
    elif lvl == 6:
        if delta >= 0:
            errs.append("level 6: Δ < 0")
        if not table:
            errs.append("level 6: the options of the table")
    elif lvl == 7:
        if complete:
            errs.append("level 7: incomplete")
        if b == 0:
            if -c / a > 0:
                kind = "pura"
                if not all(z.is_integer for z in zs):
                    errs.append("level 7: pure with integer zeros")
            else:
                kind = "pura sempre o mai"
                if not table:
                    errs.append("level 7: the options of the table")
        else:
            kind = "spuria"
    else:
        errs.append(f"unknown level {lvl}")

    if not steps:
        errs.append("no steps")
    return errs, kind
