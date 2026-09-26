"""Checker for sistemi-di-disequazioni, written from specs/exercises/sistemi-di-disequazioni.md.

It reads the system (or the double inequality) from the LaTeX of the problem, solves every row with SymPy
(solve_univariate_inequality) and intersects the solutions. Then: the params describe the same rows, the four
options are distinct sets read back from their LaTeX (and equal to their values), exactly one is the solution,
the distractors the spec requires are there (union, direction not changed, the point excluded read as
included, the brackets kept in place), the solution and the last step say the right set, the constraints of
each level and the share of each case.
"""
import re

from sympy import (
    EmptySet,
    FiniteSet,
    Interval,
    Poly,
    Rational,
    S,
    Union,
    expand,
    oo,
    solve_univariate_inequality,
    sympify,
)
from sympy.core.relational import Ge, Gt, Le, Lt

from verify import FORBIDDEN, x

CASE_RANGES = {
    1: {"stesso verso": (0.38, 0.62), "versi opposti": (0.38, 0.62)},
    2: {"stesso estremo": (0.30, 0.50), "estremi diversi": (0.50, 0.70)},
    4: {"impossibile": (0.18, 0.32), "un punto": (0.18, 0.32), "punto escluso": (0.18, 0.32), "intervallo": (0.18, 0.32)},
    5: {"sempre vera": (0.40, 0.60), "mai vera": (0.40, 0.60)},
    6: {"coefficiente positivo": (0.40, 0.60), "coefficiente negativo": (0.40, 0.60)},
}

REL = {"<": Lt, ">": Gt, r"\le": Le, r"\ge": Ge}
REL_RE = re.compile(r" (<|>|\\le|\\ge) ")
EXPR = re.compile(r"[0-9x+\-() ]*")


def expr_of(tex):
    """A side as the generator writes it (2(x + 1), \\dfrac{x - 1}{2} - 3x, 5) to SymPy; anything else raises."""
    s = tex.strip()
    s = re.sub(r"\\dfrac\{([^{}]*)\}\{(\d+)\}", r"((\1)/(\2))", s)
    if not re.fullmatch(r"[0-9x+\-()/ ]*", s) or not s:
        raise ValueError(f"not a linear expression: {tex!r}")
    s = re.sub(r"(\d)\s*(x|\()", r"\1*\2", s)
    s = re.sub(r"\)\s*\(", ")*(", s)
    return expand(sympify(s, locals={"x": x}))


def split_rel(line):
    """'a op b op c' -> [a, op, b, op, c]."""
    parts = REL_RE.split(line.strip())
    if len(parts) not in (3, 5):
        raise ValueError(f"not an inequality: {line!r}")
    return parts


def read_problem(tex):
    """(kind, rows as (lhs, op, rhs) LaTeX, has_fraction_rows_spacing_ok)."""
    m = re.fullmatch(r"\\begin\{cases\} (.*) \\end\{cases\}", tex)
    if m:
        body = m.group(1)
        pieces = re.split(r" (\\\\(?:\[2mm\])?) ", body)
        lines, seps = pieces[0::2], pieces[1::2]
        rows = []
        for ln in lines:
            p = split_rel(ln)
            if len(p) != 3:
                raise ValueError(f"row with two relations: {ln!r}")
            rows.append((p[0], p[1], p[2]))
        spacing = all((sep == r"\\[2mm]") == ("dfrac" in lines[i]) for i, sep in enumerate(seps))
        return "system", rows, spacing
    p = split_rel(tex)
    if len(p) != 5:
        raise ValueError(f"not a double inequality: {tex!r}")
    return "double", [(p[0], p[1], p[2]), (p[2], p[3], p[4])], True


def row_set(lhs, op, rhs):
    rel = REL[op](expr_of(lhs), expr_of(rhs))
    if rel in (S.true, S.false):
        return S.Reals if rel == S.true else EmptySet
    return solve_univariate_inequality(rel, x, relational=False)


def normal(lhs, op, rhs):
    """A, c with lhs - rhs = A x + c."""
    P = Poly(expr_of(lhs) - expr_of(rhs), x)
    return P.coeff_monomial(x), P.coeff_monomial(1)


def unflipped(lhs, op, rhs):
    """The row divided by its negative coefficient without changing the direction."""
    A, c = normal(lhs, op, rhs)
    e = -c / A
    return solve_univariate_inequality(REL[op](x, e), x, relational=False)


def end_val(t):
    return {r"-\infty": -oo, r"+\infty": oo}.get(t) if "infty" in t else Rational(int(t))


IV = re.compile(r"(\[|\\mathopen\{\]\})(-?\d+|-\\infty), (-?\d+|\+\\infty)(\]|\\mathclose\{\[\})")


def read_option(latex):
    if not latex.startswith("S = "):
        raise ValueError(f"option without 'S = ': {latex!r}")
    body = latex[4:]
    if body == r"\emptyset":
        return EmptySet
    if body == r"\mathbb{R}":
        return S.Reals
    parts = body.split(r" \cup ")
    sets = []
    for part in parts:
        m = re.fullmatch(r"\\\{(-?\d+)\\\}", part)
        if m:
            sets.append(FiniteSet(Rational(int(m.group(1)))))
            continue
        m = IV.fullmatch(part)
        if not m:
            raise ValueError(f"unreadable interval {part!r}")
        lo, hi = end_val(m.group(2)), end_val(m.group(3))
        lo_open, hi_open = m.group(1) != "[", m.group(4) != "]"
        if (lo == -oo and not lo_open) or (hi == oo and not hi_open):
            raise ValueError(f"infinity with a closed bracket: {part!r}")
        if not lo < hi:
            raise ValueError(f"empty or point interval written as an interval: {part!r}")
        sets.append(Interval(lo, hi, lo_open, hi_open))
    if len(sets) > 1:
        u = Union(*sets)
        if isinstance(u, (Interval, FiniteSet)) or len(u.args) != len(sets):
            raise ValueError(f"union of pieces that touch: {latex!r}")
        return u
    if sets[0] == S.Reals:
        raise ValueError(r"R written as an interval")
    return sets[0]


def read_value(v):
    m = re.fullmatch(r"\{(-?\d+)\}", v)
    if m:
        return FiniteSet(Rational(int(m.group(1))))
    m = re.fullmatch(r"([\[\]])(-oo|-?\d+),(\+oo|-?\d+)([\[\]])", v)
    if not m:
        raise ValueError(f"unreadable value {v!r}")
    f = lambda t: -oo if t == "-oo" else oo if t == "+oo" else Rational(int(t))
    return Interval(f(m.group(2)), f(m.group(3)), m.group(1) == "]", m.group(4) == "[")


def values_set(vals):
    return Union(*[read_value(v) for v in vals]) if vals else EmptySet


def params_tex(terms):
    """The params' terms written back, to compare with the problem (a light independent re-rendering)."""
    out = 0
    for t in terms:
        out += Rational(int(t["k"]) * int(t["a"]), int(t["den"])) * x + Rational(int(t["k"]) * int(t["b"]), int(t["den"]))
    return expand(out)


def boundary(lhs, op, rhs):
    A, c = normal(lhs, op, rhs)
    return None if A == 0 else -c / A


def check(sample):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    try:
        kind, rows, spacing = read_problem(sample["problem"])
    except ValueError as e:
        return [str(e)], None
    if not spacing:
        errs.append("row separator: \\\\[2mm] after a row with fractions, \\\\ otherwise")
    if kind != p.get("kind"):
        errs.append(f"params.kind {p.get('kind')} but the problem is a {kind}")
    for name, rx in FORBIDDEN + [("1(", re.compile(r"(?<![\d.])1\("))]:
        if rx.search(sample["problem"]):
            errs.append(f"problem contains forbidden '{name}'")

    prow = p.get("rows", [])
    if len(prow) != len(rows):
        errs.append("params.rows has a different number of rows")
    else:
        for (l, op, r), pr in zip(rows, prow):
            if expand(expr_of(l) - params_tex(pr["lhs"])) != 0 or expand(expr_of(r) - params_tex(pr["rhs"])) != 0:
                errs.append(f"params row differs from the problem: {l} {op} {r}")
            if {"<": "<", ">": ">", "<=": r"\le", ">=": r"\ge"}.get(pr["op"]) != op:
                errs.append("params op differs from the problem")

    sets = [row_set(*r) for r in rows]
    truth = sets[0]
    for s in sets[1:]:
        truth = truth.intersect(s)

    # every row's boundary an integer within 9, coefficients small
    for l, op, r in rows:
        b = boundary(l, op, r)
        if b is not None and (not b.is_integer or abs(b) > 9):
            errs.append(f"boundary {b} of {l} {op} {r}")
        for side in (l, r):
            for n in re.findall(r"\d+", side):
                if int(n) > 30:
                    errs.append(f"number {n} over 30")

    # answer
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["answer must be multiple choice"], None
    opts = ans["options"]
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, need 4")
    read = []
    for o in opts:
        try:
            s = read_option(o["latex"])
        except ValueError as e:
            errs.append(str(e))
            s = None
        read.append(s)
        try:
            if s is not None and values_set(o["values"]) != s:
                errs.append(f"option {o['latex']!r} != values {o['values']}")
        except ValueError as e:
            errs.append(str(e))
    if any(s is None for s in read):
        return errs, None
    if len(set(read)) != len(read):
        errs.append("options not distinct")
    idx = ans.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts) or read[idx] != truth:
        errs.append(f"correct option is not the solution {truth}")
    if sum(1 for s in read if s == truth) != 1:
        errs.append("not exactly one option equal to the solution")
    if sample.get("choice") is not None and sample["choice"] != ans:
        errs.append("choice differs from answer")

    truth_tex = opts[idx]["latex"] if isinstance(idx, int) and 0 <= idx < len(opts) else None
    if truth_tex and not sample["solution"].endswith(truth_tex):
        errs.append("solution does not end with the right set")
    if truth_tex and sample["steps"][-1] != truth_tex:
        errs.append("last step is not the right set")
    if values_set(p.get("solution", [])) != truth:
        errs.append("params.solution differs")

    # the distractors from the lesson's warnings
    union = sets[0]
    for s in sets[1:]:
        union = union.union(s)
    if union != truth and union not in read:
        errs.append("union (instead of intersection) missing")
    neg_rows = [i for i, r in enumerate(rows) if (normal(*r)[0] or 0) < 0]
    if neg_rows and lvl in (2, 4):
        nf = S.Reals
        for i, r in enumerate(rows):
            nf = nf.intersect(unflipped(*r) if i in neg_rows else sets[i])
        if nf != truth and nf not in read:
            errs.append("direction-not-changed distractor missing")

    rays = [boundary(*r) for r in rows]
    case = None
    if lvl in (1, 2, 3, 7):
        if not isinstance(truth, Interval):
            errs.append(f"level {lvl}: solution must be an interval, got {truth}")
    if lvl == 1:
        if len(rows) != 2 or neg_rows or any("x" in r[2] or "dfrac" in r[0] or "(" in r[0] for r in rows):
            errs.append("level 1: two rows solved in one step, no change of direction")
        dirs = {("inf" if s.sup == oo else "sup") for s in sets if isinstance(s, Interval)}
        case = "stesso verso" if len(dirs) == 1 else "versi opposti"
    elif lvl == 2:
        if len(rows) != 2 or not neg_rows or any("dfrac" in l + r or "(" in l + r for l, _, r in rows):
            errs.append("level 2: two rows without fractions or parentheses, one with a change of direction")
        case = "stesso estremo" if rays[0] == rays[1] else "estremi diversi"
        if case == "stesso estremo" and sets[0] == sets[1]:
            errs.append("level 2: same endpoint must be included in one row only")
    elif lvl == 3:
        fr = sum(1 for l, _, r in rows if "dfrac" in l + r)
        gr = sum(1 for l, _, r in rows if "(" in l + r and "dfrac" not in l + r)
        if len(rows) != 3 or fr != 1 or gr != 1:
            errs.append("level 3: three rows, one with fractions and one with parentheses")
    elif lvl == 4:
        if len(rows) != 2 or None in rays:
            errs.append("level 4: two rows")
        elif truth == EmptySet:
            case = "punto escluso" if rays[0] == rays[1] else "impossibile"
            if case == "punto escluso" and FiniteSet(rays[0]) not in read:
                errs.append("point excluded: the point read as included is missing")
        elif isinstance(truth, FiniteSet):
            case = "un punto"
            if EmptySet not in read:
                errs.append("one point: the empty set is missing")
        else:
            case = "intervallo"
            if not (isinstance(truth, Interval) and truth.sup - truth.inf <= 4):
                errs.append("level 4 interval: bounded, at most 4 wide")
        if p.get("case") != case:
            errs.append(f"params.case {p.get('case')} but the system is {case}")
    elif lvl == 5:
        zero = [i for i, r in enumerate(rows) if rays[i] is None]
        if len(rows) != 2 or len(zero) != 1:
            errs.append("level 5: one row with 0x")
        else:
            case = "sempre vera" if sets[zero[0]] == S.Reals else "mai vera"
            if case == "mai vera" and truth != EmptySet:
                errs.append("never true row but solution not empty")
    elif lvl == 6:
        l, _, m = rows[0]
        _, _, r = rows[1]
        if kind != "double" or "x" in l or "x" in r:
            errs.append("level 6: double inequality with x only in the middle")
        if not (isinstance(truth, Interval) and truth.inf.is_finite and truth.sup.is_finite):
            errs.append("level 6: bounded interval")
        a = Poly(expr_of(m), x).coeff_monomial(x)
        case = "coefficiente negativo" if a < 0 else "coefficiente positivo"
        if a < 0 and isinstance(truth, Interval) and truth.left_open != truth.right_open:
            kept = Interval(truth.inf, truth.sup, truth.right_open, truth.left_open)
            if kept not in read:
                errs.append("level 6: the brackets-kept-in-place distractor is missing")
    elif lvl == 7:
        l, _, m = rows[0]
        _, _, r = rows[1]
        if kind != "double" or not ("x" in l or "x" in r) or "x" not in m:
            errs.append("level 7: double inequality with x in two members")
    else:
        errs.append(f"unknown level {lvl}")
    if case and p.get("case") != case and lvl != 4:
        errs.append(f"params.case {p.get('case')} but the exercise is {case}")
    return errs, (case if lvl in CASE_RANGES else None)
