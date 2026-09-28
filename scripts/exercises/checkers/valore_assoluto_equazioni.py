"""Checker for valore-assoluto-equazioni, written from specs/exercises/valore-assoluto-equazioni.md.

It reads the equation or the inequality from the LaTeX of the problem (the bars become SymPy's Abs), solves it
over the reals with SymPy (solveset for the equations, solve_univariate_inequality for the inequalities) and
compares the result with the answer, the solution, the last step and the right option. Every option is read
back from its LaTeX (a set of values, intervals with reversed brackets, inequalities joined by "oppure", the
special sets, the lines of a gathered) and must say the same thing as its values; values and ends must be
reduced fractions. Each wrong option, or each distractor stored in params for the equations, carries the tag
of the mistake it comes from, and the checker makes that mistake again on its own from the text (only one of
the two equations, no condition, a solution outside its interval, the sign changed on one term, internal and
external values exchanged, the intersection in place of the union, the rows of the table with k <= 0).
Then the constraints of each level and the share of the cases.
"""
import re
from functools import lru_cache
from math import gcd

from sympy import (
    Abs,
    EmptySet,
    FiniteSet,
    Intersection,
    Interval,
    Poly,
    Rational,
    S,
    Union,
    expand,
    oo,
    solveset,
    sqrt,
    sympify,
)
from sympy.core.relational import Eq, Ge, Gt, Le, Lt
from sympy.solvers.inequalities import solve_univariate_inequality

from verify import x

CASE_RANGES = {
    1: {"k positivo": (0.50, 0.70), "k nullo": (0.12, 0.28), "k negativo": (0.12, 0.28)},
    2: {"pura": (0.50, 0.70), "completa": (0.30, 0.50)},
    4: {"una scartata": (0.50, 0.70), "tutte e due": (0.12, 0.28), "nessuna": (0.12, 0.28)},
    6: {"numero": (0.50, 0.70), "con x": (0.30, 0.50)},
    7: {"k positivo": (0.60, 0.80), "k nullo o negativo": (0.20, 0.40)},
    8: {"pura": (0.50, 0.70), "completa": (0.30, 0.50)},
    9: {"primo grado": (0.50, 0.70), "secondo grado": (0.30, 0.50)},
}

REL = {"<": Lt, ">": Gt, r"\leq": Le, r"\geq": Ge}
FLIP = {"<": ">", ">": "<", r"\leq": r"\geq", r"\geq": r"\leq"}
TOGGLE = {"<": r"\leq", ">": r"\geq", r"\leq": "<", r"\geq": ">"}
TABLE = {">": ">", ">=": r"\geq", "<": "<", "<=": r"\leq"}
LARGE = {r"\leq", r"\geq"}
FORBIDDEN = [r"(?<![\d}])1\s*x", r"(?<![\d}])0\s*x", r"\+\s*-", r"-\s*-", r"\+\s*\+", r"\^\{?1(?!\d)", r"[+-]\s*0(?!\d)", r"\\frac\{-"]
OPPURE = r" \ \text{ oppure } \ "


# ---------------------------------------------------------------------------
# LaTeX to SymPy


def poly_py(s):
    s = s.strip().replace("^", "**")
    s = re.sub(r"(\d)\s*x", r"\1*x", s)
    if not re.fullmatch(r"[0-9x+\-*/() ]+", s):
        raise ValueError(f"unreadable polynomial {s!r}")
    return expand(sympify(s, locals={"x": x}))


def read_problem(tex):
    """(args, rhs, rhs_abs, rel) from 'abs + abs rel rhs'."""
    parts = re.split(r" (=|<|>|\\leq|\\geq) ", tex)
    if len(parts) != 3:
        raise ValueError(f"not one relation: {tex!r}")
    left, rel, right = parts
    m = re.fullmatch(r"\|([^|]+)\|((?: \+ \|[^|]+\|)*)", left)
    if not m:
        raise ValueError(f"left member is not a sum of absolute values: {left!r}")
    args = [poly_py(m.group(1))] + [poly_py(a) for a in re.findall(r"\|([^|]+)\|", m.group(2))]
    mr = re.fullmatch(r"\|([^|]+)\|", right)
    if mr:
        return args, poly_py(mr.group(1)), True, rel
    if "|" in right:
        raise ValueError(f"unreadable right member {right!r}")
    return args, poly_py(right), False, rel


def value(t):
    """An integer or a reduced fraction, written in the canonical way; returns (value, errors)."""
    t = t.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        v = Rational(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    elif re.fullmatch(r"-?\d+", t):
        v = Rational(int(t))
    else:
        raise ValueError(f"unreadable value {t!r}")
    return v, ([] if t == latex_of(v) else [f"value {t!r} not reduced, expected {latex_of(v)!r}"])


def latex_of(v):
    if v.q == 1:
        return str(v.p)
    return f"{'-' if v < 0 else ''}\\frac{{{abs(v.p)}}}{{{v.q}}}"


def read_values(tex):
    """S = \\{...\\}, S = \\left\\{...\\right\\}, S = \\emptyset -> (sorted values, style errors)."""
    if tex == r"S = \emptyset":
        return [], []
    m = re.fullmatch(r"S = \\left\\\{(.+)\\right\\\}", tex)
    left = bool(m)
    m = m or re.fullmatch(r"S = \\\{(.+)\\\}", tex)
    if not m:
        raise ValueError(f"unreadable set {tex!r}")
    vals, errs = [], []
    for t in m.group(1).split(", "):
        v, e = value(t)
        vals.append(v)
        errs += e
    if left != any(not v.is_integer for v in vals):
        errs.append(f"\\left braces only with a fraction: {tex!r}")
    if vals != sorted(set(vals)):
        errs.append(f"values not sorted or repeated: {tex!r}")
    return vals, errs


# ---------------------------------------------------------------------------
# Intervals: (lo, hi, lo closed, hi closed), a point is (v, v, True, True)


def end_value(t):
    t = t.strip()
    if t == r"+\infty":
        return oo, []
    if t == r"-\infty":
        return -oo, []
    return value(t)


def read_interval(raw):
    errs = []
    raw = raw.strip()
    frac = r"\frac" in raw
    if frac != raw.startswith(r"\left"):
        errs.append(f"\\left exactly around fractions: {raw!r}")
    t = raw.replace(r"\,", "").strip()
    for a, b in ((r"\mathopen{]}", "]"), (r"\mathclose{[}", "["), (r"\left]", "]"), (r"\left[", "["), (r"\right[", "["), (r"\right]", "]")):
        t = t.replace(a, b)
    m = re.fullmatch(r"([\[\]])(.+), (.+)([\[\]])", t)
    if not m:
        raise ValueError(f"unreadable interval {raw!r}")
    if not frac and ((m.group(1) == "]") != (r"\mathopen{]}" in raw) or (m.group(4) == "[") != (r"\mathclose{[}" in raw)):
        errs.append(f"reversed brackets without \\mathopen/\\mathclose: {raw!r}")
    lo, e1 = end_value(m.group(2))
    hi, e2 = end_value(m.group(3))
    return (lo, hi, m.group(1) == "[", m.group(4) == "]"), errs + e1 + e2


def gathered(tex):
    m = re.fullmatch(r"\\begin\{gathered\} (.+) \\end\{gathered\}", tex)
    return m.group(1).split(r" \\ ") if m else None


def read_set(tex):
    """A set in the interval notation -> (pieces, style errors)."""
    g = gathered(tex)
    if g:
        if not g[0].startswith("S = ") or not all(li.startswith(r"\cup ") for li in g[1:]):
            raise ValueError(f"bad gathered set {tex!r}")
        parts = [g[0][4:]] + [li[len(r"\cup ") :] for li in g[1:]]
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
            v, e = value(m.group(1))
            return [(-oo, v, False, False), (v, oo, False, False)], e
        if body.startswith(r"\{") or body.startswith(r"\left\{"):
            vals, e = read_values(tex)
            return [(v, v, True, True) for v in vals], e
        parts = body.split(r" \cup ")
    out, errs = [], []
    for p in parts:
        piece, e = read_interval(p)
        out.append(piece)
        errs += e
    frac = any(r"\frac" in p for p in parts)
    want_wide = len(parts) >= 3 or (len(parts) == 2 and frac)
    if want_wide != bool(g):
        errs.append(f"one line per interval exactly with three intervals or two with a fraction: {tex!r}")
    if not g:
        for i, p in enumerate(parts):
            if r"\mathopen" in p and not p.startswith(r"\,"):
                errs.append(f"missing \\, before \\mathopen: {tex!r}")
            if i < len(parts) - 1 and p.endswith(r"\mathclose{[}"):
                errs.append(f"missing \\, after \\mathclose: {tex!r}")
    return out, errs


def read_piece(p):
    p = p.strip()
    m = re.fullmatch(r"x = (.+)", p)
    if m:
        v, e = value(m.group(1))
        return (v, v, True, True), e
    m = re.fullmatch(r"x (<|\\leq) (.+)", p)
    if m:
        v, e = value(m.group(2))
        return (-oo, v, False, m.group(1) == r"\leq"), e
    m = re.fullmatch(r"x (>|\\geq) (.+)", p)
    if m:
        v, e = value(m.group(2))
        return (v, oo, m.group(1) == r"\geq", False), e
    m = re.fullmatch(r"(.+) (<|\\leq) x (<|\\leq) (.+)", p)
    if m:
        lo, e1 = value(m.group(1))
        hi, e2 = value(m.group(4))
        return (lo, hi, m.group(2) == r"\leq", m.group(3) == r"\leq"), e1 + e2
    raise ValueError(f"unreadable piece {p!r}")


def read_inequalities(tex):
    g = gathered(tex)
    if g:
        if not all(li.startswith(r"\text{oppure} \ ") for li in g[1:]):
            raise ValueError(f"bad gathered inequalities {tex!r}")
        parts = [g[0]] + [li[len(r"\text{oppure} \ ") :] for li in g[1:]]
    else:
        parts = tex.split(OPPURE)
    out, errs = [], []
    for p in parts:
        piece, e = read_piece(p)
        out.append(piece)
        errs += e
    bounded = len(out) == 2 and all(lo not in (oo, -oo) and hi not in (oo, -oo) and lo != hi for lo, hi, _, _ in out)
    if bool(g) != (len(parts) >= 3 or bounded):
        errs.append(f"inequalities on more lines exactly with three pieces or two bounded ones: {tex!r}")
    return out, errs


def to_set(pieces):
    out = []
    for lo, hi, lc, hc in pieces:
        out.append(FiniteSet(lo) if lo == hi else Interval(lo, hi, not lc, not hc))
    return Union(*out) if out else EmptySet


def same(a, b):
    return (a - b) == EmptySet and (b - a) == EmptySet


def ordered(pieces):
    """Pieces must be disjoint, in order, not touching (a touching pair would be one interval)."""
    for (lo1, hi1, _, hc1), (lo2, _, lc2, _) in zip(pieces, pieces[1:]):
        if hi1 > lo2 or (hi1 == lo2 and (hc1 or lc2)):
            return False
    return True


def from_values(vals):
    out = []
    for v in vals:
        m = re.fullmatch(r"([\[(])([^,]+),([^,]+)([\])])", v)
        if not m:
            raise ValueError(f"bad option value {v!r}")
        conv = lambda t: -oo if t == "-oo" else oo if t == "oo" else Rational(t)  # noqa: E731
        out.append((conv(m.group(2)), conv(m.group(3)), m.group(1) == "[", m.group(4) == "]"))
    return out


def is_special(pieces):
    s = to_set(pieces)
    if s == EmptySet or s == S.Reals or all(lo == hi for lo, hi, _, _ in pieces):
        return True
    return len(pieces) == 2 and pieces[0][0] == -oo and pieces[1][1] == oo and pieces[0][1] == pieces[1][0] and not pieces[0][3] and not pieces[1][2]


# ---------------------------------------------------------------------------
# Solving


@lru_cache(maxsize=None)
def ineq(lhs, op, rhs):
    return solve_univariate_inequality(REL[op](lhs, rhs), x, relational=False, domain=S.Reals)


def roots(e):
    s = solveset(expand(e), x, S.Reals)
    if s == S.Reals:
        raise ValueError(f"identity {e}")
    return sorted(s, key=float) if s != EmptySet else []


def fset(vals):
    return FiniteSet(*vals) if vals else EmptySet


# ---------------------------------------------------------------------------
# Equations


def wrong_equation(tag, lvl, args, R, rabs, truth):
    A = args[0]
    if tag == "vuoto":
        return []
    if tag in ("solo A = k", "solo A = B"):
        return roots(A - R)
    if tag in ("solo A = -k", "solo A = -B"):
        return roots(A + R)
    if tag == "opposti":
        if lvl == 1:
            v = roots(A - R)[0]
            return [v, -v]
        return [-v for v in truth]
    if tag == "segno":
        # |ax + b| = 0 solved as ax = b
        return [-v for v in roots(A)]
    if tag == "più o meno":
        return roots(A - Abs(R)) + roots(A + Abs(R))
    if tag == "positive":
        return [v for v in truth if v > 0]
    if tag == "meno sotto radice":
        # x^2 - c = -k with c - k < 0: the square taken as if it were k - c
        c = -Poly(A, x).coeff_monomial(1)
        k = R
        return [-sqrt(c + k), -sqrt(k - c), sqrt(k - c), sqrt(c + k)]
    if tag == "un termine":
        a2, b2 = Poly(R, x).coeff_monomial(x), Poly(R, x).coeff_monomial(1)
        return roots(A - R) + roots(A - (-a2 * x + b2))
    if tag == "senza condizione":
        return roots(A - R) + roots(A + R)
    if tag == "scartate":
        return [v for v in roots(A - R) + roots(A + R) if R.subs(x, v) < 0]
    if tag == "fuori":
        return [r for r, _ in region_roots(args, R)]
    if tag == "togliere":
        return roots(sum(args) - R)
    if tag == "solo il minore":
        return [min(truth)]
    if tag == "solo il maggiore":
        return [max(truth)]
    raise ValueError(f"unknown tag {tag!r}")


def region_roots(args, R):
    """The three regions between the zeros of two linear arguments: the root of each region's equation, and
    whether it lies in its region (the zero goes with the region at its right)."""
    z = sorted(roots(a)[0] for a in args)
    probes = [z[0] - 1, (z[0] + z[1]) / 2, z[1] + 1]
    inside = [lambda v: v < z[0], lambda v: z[0] <= v < z[1], lambda v: v >= z[1]]
    out = []
    for t, ok in zip(probes, inside):
        e = expand(sum(a if a.subs(x, t) > 0 else -a for a in args) - R)
        if e == 0:
            raise ValueError("a region with infinitely many solutions")
        for r in roots(e):
            out.append((r, ok(r)))
    return out


def check_equation(sample, args, R, rabs):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    lhs = sum(Abs(a) for a in args)
    rhs = Abs(R) if rabs else R
    sol = solveset(lhs - rhs, x, S.Reals)
    if not isinstance(sol, FiniteSet) and sol != EmptySet:
        return [f"not a finite set of solutions: {sol}"], None
    truth = sorted(sol, key=float) if sol != EmptySet else []
    if not all(v.is_rational for v in truth):
        errs.append(f"irrational solutions {truth}")

    ans = sample["answer"]
    if ans.get("kind") != "set" or ans.get("universal"):
        return errs + ["answer must be a finite set"], None
    given = [Rational(v) for v in ans["values"]]
    if given != truth:
        errs.append(f"answer {ans['values']} != sympy {truth}")
    for name, tex in (("answer", ans.get("latex", "")), ("solution", sample.get("solution", "")), ("last step", (sample.get("steps") or [""])[-1])):
        try:
            vals, style = read_values(tex)
            errs += style
            if vals != truth:
                errs.append(f"{name} {tex!r} != {truth}")
        except ValueError as e:
            errs.append(f"{name}: {e}")

    # the distractors stored in params, each rebuilt from its mistake
    dis = p.get("distractors", [])
    dsets = []
    for d in dis:
        try:
            want = wrong_equation(d["tag"], lvl, args, R, rabs, truth)
        except (ValueError, IndexError) as e:
            errs.append(f"distractor {d['tag']!r}: {e}")
            continue
        got = [Rational(v) for v in d["values"]]
        if set(got) != set(want):
            errs.append(f"distractor {d['tag']!r} {d['values']} is not that mistake: {want}")
        dsets.append(frozenset(got))

    # the choice
    ch = sample.get("choice")
    if ch is None:
        errs.append("no choice")
    else:
        opts = ch.get("options", [])
        keys = []
        for o in opts:
            try:
                vals, style = read_values(o["latex"])
                errs += style
                if vals != [Rational(v) for v in o["values"]]:
                    errs.append(f"option latex {o['latex']!r} != values {o['values']}")
                keys.append(frozenset(vals))
            except ValueError as e:
                errs.append(str(e))
                keys.append(None)
        if len(opts) != 4:
            errs.append("need four options")
        if len(set(keys)) != len(keys):
            errs.append("options not distinct")
        tk = frozenset(truth)
        if [i for i, k in enumerate(keys) if k == tk] != [ch.get("correct")]:
            errs.append("choice.correct is wrong")
        for i, k in enumerate(keys):
            if i != ch.get("correct") and k not in dsets:
                errs.append(f"option {i} is not one of the distractors")

    # levels
    A = args[0]
    PA = Poly(A, x)
    kind = None
    small = lambda vs, d, m: all(v.q <= d and abs(v) <= m for v in vs)  # noqa: E731
    if lvl in (1, 2):
        if len(args) != 1 or rabs or not R.is_Integer:
            errs.append(f"level {lvl}: |A| = k")
    if lvl == 1:
        a, b = PA.coeff_monomial(x), PA.coeff_monomial(1)
        if PA.degree() != 1 or not (1 <= a <= 5) or b == 0 or not a.is_integer or abs(b) > 9 or gcd(int(a), int(b)) != 1:
            errs.append("level 1: ax + b with 1 <= a <= 5, b != 0, gcd 1")
        if R.is_Integer:
            kind = "k positivo" if R > 0 else "k nullo" if R == 0 else "k negativo"
        if R.is_Integer and (R > 0 and len(truth) != 2 or R == 0 and len(truth) != 1 or R < 0 and truth):
            errs.append("level 1: the three cases of the table")
        if not small(truth, 5, 20):
            errs.append("level 1: small solutions")
    elif lvl == 2:
        if PA.degree() != 2 or PA.LC() != 1 or not (R > 0):
            errs.append("level 2: monic second degree argument, k positive")
        if not all(v.is_integer for v in truth) or not truth:
            errs.append("level 2: integer solutions")
        kind = "pura" if PA.coeff_monomial(x) == 0 else "completa"
    elif lvl == 3:
        if len(args) != 1 or not rabs or PA.degree() != 1 or Poly(R, x).degree() != 1 or len(truth) != 2:
            errs.append("level 3: |A| = |B| of first degree, two solutions")
        if not small(truth, 7, 20):
            errs.append("level 3: small solutions")
    elif lvl in (4, 5):
        if len(args) != 1 or rabs or Poly(R, x).degree() != 1 or PA.degree() != (1 if lvl == 4 else 2):
            errs.append(f"level {lvl}: |A| = B")
        cands = sorted(set(roots(A - R) + roots(A + R)), key=float)
        kept = [v for v in cands if R.subs(x, v) >= 0]
        if kept != truth:
            errs.append("the condition B >= 0 does not give the solutions")
        if any(R.subs(x, v) == 0 for v in cands):
            errs.append("a candidate with B = 0")
        if lvl == 4:
            if len(cands) != 2 or not small(cands, 5, 15):
                errs.append("level 4: two small candidates")
            kind = {1: "una scartata", 2: "tutte e due", 0: "nessuna"}[len(kept)] if len(cands) == 2 else None
        else:
            if len(cands) != 4 or not all(v.is_integer for v in cands) or not 0 < len(kept) < 4:
                errs.append("level 5: four integer candidates, at least one kept and one discarded")
            kind = {1: "una accettata", 2: "due accettate", 3: "tre accettate"}.get(len(kept))
        if not any(re.fullmatch(r"\\text\{Condizione: \} (.+) \\geq 0\\text\{, cioè \} x (\\geq|\\leq) (.+)\\text\{\.\}", s) for s in sample.get("steps", [])):
            errs.append("no condition in the steps")
        for s in sample.get("steps", []):
            m = re.fullmatch(r"\\text\{Condizione: \} (.+) \\geq 0\\text\{, cioè \} x (\\geq|\\leq) (.+)\\text\{\.\}", s)
            if m:
                shown = ineq(poly_py(m.group(1)), r"\geq", 0)
                if expand(poly_py(m.group(1)) - R) != 0 or not same(shown, ineq(x, m.group(2), value(m.group(3))[0])):
                    errs.append(f"condition step wrong: {s!r}")
    elif lvl == 6:
        if len(args) != 2 or rabs or any(Poly(a, x).degree() != 1 for a in args) or Poly(R, x).degree() > 1:
            errs.append("level 6: two absolute values of first degree")
        kind = "numero" if R.is_number else "con x"
        if R.is_number and not R > 0:
            errs.append("level 6: positive second member")
        rr = region_roots(args, R)
        if sorted({r for r, ok in rr if ok}, key=float) != truth:
            errs.append("level 6: the regions do not give the solutions")
        if not small([r for r, _ in rr], 3, 15):
            errs.append("level 6: small candidates")
        # each region's line: x = v, accettata or scartata
        shown = []
        for s in sample.get("steps", []):
            m = re.search(r"x = (-?(?:\\frac\{\d+\}\{\d+\}|\d+))\\text\{, (accettata|scartata)\}$", s)
            if m:
                shown.append((value(m.group(1))[0], m.group(2) == "accettata"))
        if sorted(shown, key=lambda t: float(t[0])) != sorted(rr, key=lambda t: float(t[0])):
            errs.append(f"level 6: the steps say {shown}, the regions give {rr}")
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind


# ---------------------------------------------------------------------------
# Inequalities


def wrong_inequality(tag, A, op, R, truth):
    if tag == "scambiati":
        return ineq(Abs(A), FLIP[op], R)
    if tag == "estremi":
        return ineq(Abs(A), TOGGLE[op], R)
    if tag == "scambiati ed estremi":
        return ineq(Abs(A), TOGGLE[FLIP[op]], R)
    if tag == "una sola":
        return ineq(A, op, R)
    if tag == "altra sola":
        return ineq(A, FLIP[op], -R)
    if tag == "equazione":
        return solveset(Abs(A) - R, x, S.Reals)
    if tag == "intersezione":
        return Intersection(ineq(A, op, R), ineq(A, FLIP[op], -R))
    if tag == "unione":
        return Union(ineq(A, op, R), ineq(A, FLIP[op], -R))
    if tag == "condizione":
        return Intersection(truth, ineq(R, r"\geq", 0))
    if tag.startswith("tabella:"):
        return ineq(Abs(A), TABLE[tag.split(":")[1]], 0)
    raise ValueError(f"unknown tag {tag!r}")


def read_option(tex, notation):
    if tex.startswith("S = ") or tex.startswith(r"\begin{gathered} S = "):
        return read_set(tex)
    if notation != "disequazioni":
        raise ValueError(f"inequalities in notation {notation!r}: {tex!r}")
    return read_inequalities(tex)


def check_inequality(sample, args, R, rabs, op):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    if len(args) != 1 or rabs:
        return ["one absolute value on the left"], None
    A = args[0]
    truth = ineq(Abs(A), op, R)

    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["answer must be a choice"], None
    if sample.get("choice") is not None and sample["choice"] != ans:
        errs.append("the choice variant differs from the answer")
    notation = p.get("notation")
    opts = ans["options"]
    tags = p.get("optionTags", [])
    if len(opts) != 4 or len(tags) != 4:
        errs.append("need four options with their tags")
    sets = []
    for o in opts:
        val = from_values(o["values"])
        try:
            shown, style = read_option(o["latex"], notation)
        except ValueError as e:
            errs.append(str(e))
            sets.append(None)
            continue
        errs += style
        if shown != val:
            errs.append(f"option latex {o['latex']!r} != values {o['values']}")
        if not ordered(val):
            errs.append(f"option pieces not ordered and separate: {o['values']}")
        if notation == "disequazioni" and o["latex"].startswith("S = ") and not is_special(val):
            errs.append(f"set notation in a disequazioni option: {o['latex']!r}")
        sets.append(to_set(val))
    for i in range(len(sets)):
        for j in range(i):
            if sets[i] is not None and sets[j] is not None and same(sets[i], sets[j]):
                errs.append(f"options {j} and {i} are the same set")
    right = [i for i, s in enumerate(sets) if s is not None and same(s, truth)]
    if right != [ans.get("correct")]:
        errs.append(f"right options {right}, correct = {ans.get('correct')}, truth {truth}")
    for i, (t, s) in enumerate(zip(tags, sets)):
        if i == ans.get("correct"):
            if t != "giusta":
                errs.append(f"correct option tagged {t!r}")
            continue
        if t == "giusta" or s is None:
            errs.append(f"option {i} tagged {t!r}")
            continue
        if not same(s, wrong_inequality(t, A, op, R, truth)):
            errs.append(f"option {i} tagged {t!r} is not that mistake: {opts[i]['values']}")
        if not t.startswith("tabella") and (s == EmptySet or s == S.Reals):
            errs.append(f"option {i} is empty or all of R")
    table = any(t.startswith("tabella") for t in tags)

    # solution and last step
    try:
        sol, style = read_set(sample["solution"])
        errs += style
        if not same(to_set(sol), truth):
            errs.append(f"solution {sample['solution']!r} != {truth}")
        last = sample["steps"][-1]
        if last == r"\text{Nessun } x \text{ è soluzione.}":
            got = EmptySet
        elif last == r"\text{Ogni } x \text{ è soluzione.}":
            got = S.Reals
        elif last.startswith(r"x \neq "):
            got = S.Reals - FiniteSet(value(last[len(r"x \neq ") :])[0])
        else:
            pieces = [read_piece(t)[0] for t in last.split(OPPURE)]
            got = to_set(pieces)
        if not same(got, truth):
            errs.append("last step is not the solution")
    except (ValueError, IndexError) as e:
        errs.append(f"solution or last step unreadable: {e}")

    # ends included only with the large signs, where the solution is not a special set
    for s_ in (truth.args if isinstance(truth, Union) else (truth,)):
        if isinstance(s_, Interval):
            for e, open_ in ((s_.start, s_.left_open), (s_.end, s_.right_open)):
                if e not in (oo, -oo) and (not open_) != (op in LARGE) and lvl != 9:
                    errs.append("an end included or excluded against the sign")

    PA = Poly(A, x)
    PR = Poly(R, x)
    kind = None
    if lvl == 7:
        if PA.degree() != 1 or PR.degree() > 0:
            errs.append("level 7: |ax + b| op k")
        a, b = PA.coeff_monomial(x), PA.coeff_monomial(1)
        if not (1 <= a <= 4) or b == 0:
            errs.append("level 7: 1 <= a <= 4, b != 0")
        if R > 0:
            kind = "k positivo"
            if table:
                errs.append("level 7: k positive without the table")
            for piece in (truth.args if isinstance(truth, Union) else (truth,)):
                for e in (piece.start, piece.end) if isinstance(piece, Interval) else ():
                    if e not in (oo, -oo) and (e.q > 4 or abs(e) > 15):
                        errs.append("level 7: small ends")
        else:
            kind = "k nullo o negativo"
            if not table:
                errs.append("level 7: k <= 0 wants the four answers of the table")
            elif sorted(tags) != sorted(["giusta"] + [t for t in ("tabella:>", "tabella:>=", "tabella:<", "tabella:<=") if not same(wrong_inequality(t, A, op, R, truth), truth)]):
                errs.append("level 7: the four answers of the table")
    elif lvl == 8:
        if PA.degree() != 2 or PA.LC() != 1 or PR.degree() > 0 or not R > 0:
            errs.append("level 8: |A| op k with A monic of second degree, k positive")
        kind = "pura" if PA.coeff_monomial(x) == 0 else "completa"
    elif lvl == 9:
        if PR.degree() != 1 or PA.degree() not in (1, 2):
            errs.append("level 9: |A| op B with B of first degree")
        kind = "primo grado" if PA.degree() == 1 else "secondo grado"
    else:
        errs.append(f"unknown level {lvl}")
    if lvl in (8, 9) and (truth == EmptySet or truth == S.Reals):
        errs.append(f"level {lvl}: the solution is neither empty nor R")
    if lvl in (8, 9) and table:
        errs.append(f"level {lvl}: no table")
    return errs, kind


# ---------------------------------------------------------------------------


def check(sample):
    errs = []
    tex = sample["problem"]
    for rx in FORBIDDEN:
        if re.search(rx, tex):
            errs.append(f"forbidden pattern {rx} in {tex!r}")
    try:
        args, R, rabs, rel = read_problem(tex)
    except ValueError as e:
        return [str(e)], None
    for a in args + [R]:
        if not all(c.is_integer for c in Poly(a, x).all_coeffs()):
            errs.append(f"non-integer coefficient in {a}")
    for a in args:
        # a second degree argument must take both signs, or the bars change nothing
        if Poly(a, x).degree() == 2 and len(roots(a)) != 2:
            errs.append(f"argument {a} does not change sign")
    if not sample.get("steps"):
        errs.append("no steps")
    for s in sample.get("steps", []):
        if re.search(r"\\begin\{", s) and r"\text" in s:
            errs.append(f"environment with text in a step: {s!r}")
    lvl = sample["level"]
    if lvl <= 6:
        if rel != "=":
            return errs + ["levels 1-6 are equations"], None
        e, kind = check_equation(sample, args, R, rabs)
    else:
        if rel == "=":
            return errs + ["levels 7-9 are inequalities"], None
        e, kind = check_inequality(sample, args, R, rabs, rel)
    return errs + e, kind
