"""Checker for disequazioni-razionali, written from specs/exercises/disequazioni-razionali.md.

It reads the inequality from the LaTeX of the problem, solves it with SymPy (reduce_rational_inequalities over the reals, which
knows that a fraction does not exist where its denominator vanishes) and compares the result with the right
option, the solution and the last step. Every option is read back from its LaTeX, in either notation
(inequalities joined by "oppure", or intervals with reversed brackets), and must say the same set as its
values. Each wrong option carries the tag of the mistake it comes from, and the checker solves that mistake
again on its own (the inequality with the sign turned, the fraction multiplied by its denominator, the zero
of the denominator included, the sign table read as a system, ...). Then the constraints of each level and
the share of the forms of levels 2 and 4 and of the wide signs of level 5.
"""
import re

from sympy import (
    EmptySet,
    FiniteSet,
    Intersection,
    Interval,
    Poly,
    Rational,
    S,
    Union,
    cancel,
    expand,
    factor_list,
    oo,
    solveset,
    sqrt,
    sympify,
)
from sympy.core.relational import Ge, Gt, Le, Lt
from sympy.solvers.inequalities import reduce_rational_inequalities

from verify import x

CASE_RANGES = {
    2: {"prodotto": (0.20, 0.40), "x^2 e kx": (0.25, 0.45), "raccoglimento": (0.25, 0.45)},
    4: {"x^3 - k^2x": (0.22, 0.38), "x^3 e k^2x": (0.13, 0.27), "x^2 e k^2": (0.18, 0.32), "tre fattori": (0.18, 0.32)},
    5: {"largo": (0.65, 0.85), "stretto": (0.15, 0.35)},
}

REL = {"<": Lt, ">": Gt, r"\leq": Le, r"\geq": Ge}
FLIP = {"<": ">", ">": "<", r"\leq": r"\geq", r"\geq": r"\leq"}
TOGGLE = {"<": r"\leq", ">": r"\geq", r"\leq": "<", r"\geq": ">"}
LARGE = {r"\leq", r"\geq"}
FORBIDDEN = [r"(?<![\d}])1\s*x", r"(?<![\d}])0\s*x", r"\+\s*-", r"-\s*-", r"\+\s*\+", r"\^\{?1(?!\d)", r"[+-]\s*0(?!\d)", r"\\frac\{-"]


# ---------------------------------------------------------------------------
# LaTeX to SymPy


def frac_args(s, i):
    """The two brace groups after \\frac at position i: (numerator, denominator, end)."""
    out = []
    j = i + len(r"\frac")
    for _ in range(2):
        if s[j] != "{":
            raise ValueError(f"bad \\frac in {s!r}")
        depth, k = 0, j
        while True:
            if s[k] == "{":
                depth += 1
            elif s[k] == "}":
                depth -= 1
                if depth == 0:
                    break
            k += 1
        out.append(s[j + 1 : k])
        j = k + 1
    return out[0], out[1], j


def to_py(s):
    s = s.strip()
    i = s.find(r"\frac")
    while i >= 0:
        a, b, end = frac_args(s, i)
        s = s[:i] + f"(({to_py(a)})/({to_py(b)}))" + s[end:]
        i = s.find(r"\frac")
    s = s.replace("^", "**")
    s = re.sub(r"(\d)\s*(x|\()", r"\1*\2", s)
    s = re.sub(r"(x|\))\s*\(", r"\1*(", s)
    s = re.sub(r"\)\s*(x|\d)", r")*\1", s)
    if not re.fullmatch(r"[0-9x+\-*/() ]+", s):
        raise ValueError(f"unreadable expression {s!r}")
    return s


def expr(s):
    return sympify(to_py(s), locals={"x": x})


def value(t):
    t = t.strip()
    if t in (r"+\infty", r"\infty"):
        return oo
    if t == r"-\infty":
        return -oo
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        return Rational(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    if re.fullmatch(r"-?\d+", t):
        return Rational(int(t))
    raise ValueError(f"unreadable value {t!r}")


def split_rel(tex):
    parts = re.split(r" (<|>|\\leq|\\geq) ", tex)
    if len(parts) != 3:
        raise ValueError(f"not one inequality: {tex!r}")
    return parts[0], parts[1], parts[2]


def solve(lhs, op, rhs):
    """Rational inequality over the reals (SymPy's solver for rational inequalities, which drops the zeros of
    the denominator)."""
    return reduce_rational_inequalities([[REL[op](lhs, rhs)]], x, relational=False)


def key(a):
    """A union of intervals as a sorted tuple; SymPy keeps unions disjoint and merged."""
    parts = a.args if isinstance(a, Union) else (a,)
    out = []
    for p in parts:
        if isinstance(p, Interval):
            out.append((p.start, p.end, bool(p.left_open), bool(p.right_open)))
        elif isinstance(p, FiniteSet):
            out += [(v, v, False, False) for v in p.args]
        elif p == EmptySet:
            continue
        else:
            raise ValueError(f"unexpected set {p}")
    return tuple(sorted(out, key=lambda t: (t[0], t[1])))


def same(a, b):
    return key(a) == key(b)


# ---------------------------------------------------------------------------
# Options: values and LaTeX


def from_values(vals):
    out = []
    for v in vals:
        m = re.fullmatch(r"([\[(])([^,]+),([^,]+)([\])])", v)
        if not m:
            raise ValueError(f"bad option value {v!r}")
        lo = -oo if m.group(2) == "-oo" else Rational(m.group(2))
        hi = oo if m.group(3) == "oo" else Rational(m.group(3))
        out.append(Interval(lo, hi, m.group(1) == "(", m.group(4) == ")"))
    return Union(*out)


def read_intervals(tex):
    """S = \\,\\mathopen{]}-\\infty, -3\\mathclose{[}\\, \\cup [1, 4] ... -> (set, style errors)."""
    errs = []
    if not tex.startswith("S = "):
        raise ValueError(f"not a set of intervals: {tex!r}")
    pieces = tex[4:].split(r" \cup ")
    out = []
    for p in pieces:
        raw = p.strip()
        frac = r"\frac" in raw
        if frac and not re.sub(r"^\\,", "", raw).startswith(r"\left"):
            errs.append(f"interval with a fraction without \\left: {raw!r}")
        if not frac and r"\left" in raw:
            errs.append(f"\\left without a fraction: {raw!r}")
        if raw.startswith(r"\mathopen") or re.search(r"(?<!\\,)\\mathopen", raw):
            errs.append(f"missing \\, before \\mathopen: {raw!r}")
        t = raw.replace(r"\,", "").strip()
        for a, b in ((r"\mathopen{]}", "]"), (r"\mathclose{[}", "["), (r"\left]", "]"), (r"\left[", "["), (r"\right[", "["), (r"\right]", "]")):
            t = t.replace(a, b)
        m = re.fullmatch(r"([\[\]])(.+), (.+)([\[\]])", t.strip())
        if not m:
            raise ValueError(f"unreadable interval {p!r}")
        out.append(Interval(value(m.group(2)), value(m.group(3)), m.group(1) == "]", m.group(4) == "["))
    return Union(*out), errs


def read_inequalities(tex):
    """x < -3 \\ \\text{ oppure } \\ -1 \\leq x < 4 -> set."""
    out = []
    for p in tex.split(r" \ \text{ oppure } \ "):
        p = p.strip()
        m = re.fullmatch(r"x (<|\\leq) (.+)", p)
        if m:
            out.append(Interval(-oo, value(m.group(2)), True, m.group(1) == "<"))
            continue
        m = re.fullmatch(r"x (>|\\geq) (.+)", p)
        if m:
            out.append(Interval(value(m.group(2)), oo, m.group(1) == ">", True))
            continue
        m = re.fullmatch(r"(.+) (<|\\leq) x (<|\\leq) (.+)", p)
        if m:
            out.append(Interval(value(m.group(1)), value(m.group(4)), m.group(2) == "<", m.group(3) == "<"))
            continue
        raise ValueError(f"unreadable piece {p!r}")
    return Union(*out)


def read_option(tex, notation):
    if notation == "intervalli":
        return read_intervals(tex)
    if notation == "disequazioni":
        return read_inequalities(tex), []
    raise ValueError(f"unknown notation {notation!r}")


# ---------------------------------------------------------------------------
# The problem


def written_factors(side):
    """A product written as the lesson writes it, 2x(x - 3)(3 - x) -> (number, [factors]); None if it is not one."""
    m = re.fullmatch(r"(\d*)(x?)((?:\([^()]*\))*)", side.strip())
    if not m or not (m.group(2) or m.group(3)):
        return None
    pre = int(m.group(1)) if m.group(1) else 1
    fs = [x] if m.group(2) else []
    fs += [expr(g) for g in re.findall(r"\(([^()]*)\)", m.group(3))]
    if len(fs) < 2:
        return None
    return pre, fs


def linear(f):
    P = Poly(expand(f), x)
    if P.degree() != 1:
        raise ValueError(f"factor {f} is not of first degree")
    return P.coeff_monomial(x), P.coeff_monomial(1)


def factors_of(p):
    """(pre, [(factor, is_den)]) of the reduced form, as the steps study them."""
    lvl, lhs, rhs = p["level"], p["lhs_tex"], p["rhs_tex"]
    w = written_factors(lhs)
    if w and rhs == "0":
        return w[0], [(f, False) for f in w[1]]
    if lvl in (2, 4):
        P = expand(expr(lhs) - expr(rhs))
        c, fl = factor_list(P)
        fs = []
        for f, k in fl:
            if k != 1:
                raise ValueError(f"repeated factor {f}")
            fs.append((f, False))
        return c, fs
    fr = re.fullmatch(r"\\frac\{(.+)\}\{(.+)\}", lhs)
    if lvl == 5:
        return 1, [(expr(fr.group(1)), False), (expr(fr.group(2)), True)]
    if lvl == 6:
        k = value(rhs)
        num, den = expr(fr.group(1)), expr(fr.group(2))
        return 1, [(expand(num - k * den), False), (den, True)]
    if lvl == 7:
        a, da, _ = frac_args(lhs, 0)
        b, db, _ = frac_args(rhs, 0)
        num = expand(expr(a) * expr(db) - expr(b) * expr(da))
        return 1, [(num, False), (expr(da), True), (expr(db), True)]
    raise ValueError("no factors")


def solve_factors(pre, fs, op):
    e = S(pre)
    for f, den in fs:
        e = e / f if den else e * f
    return solve(e, op, 0)


def system(fs, op):
    """Where every factor has the sign asked (all positive for > and >=, all negative for < and <=)."""
    out = S.Reals
    for f, _ in fs:
        out = Intersection(out, solve(f, op, 0))
    return out


def cross(lhs, op, rhs):
    """The fraction multiplied by its denominator as if it were positive: A/B op C/D -> A·D op C·B."""
    a, b, _ = frac_args(lhs, 0)
    if rhs.startswith(r"\frac"):
        c, d, _ = frac_args(rhs, 0)
    else:
        c, d = rhs, "1"
    return solve(expr(a) * expr(d), op, expr(c) * expr(b))


def expected_wrong(tag, ctx):
    lhs, op, rhs, pre, fs, truth = ctx["lhs"], ctx["op"], ctx["rhs"], ctx["pre"], ctx["fs"], ctx["truth"]
    L, R = expr(lhs), expr(rhs)
    if tag == "scambiati":
        return [solve(L, FLIP[op], R)]
    if tag == "estremi":
        return [solve(L, TOGGLE[op], R)]
    if tag == "scambiati ed estremi":
        return [solve(L, TOGGLE[FLIP[op]], R)]
    if tag == "sistema":
        return [system(fs, op)]
    if tag == "dividi":
        return [solve(cancel((L - R) / x), op, 0)]
    if tag == "radice":
        return [solve(x, op, sqrt(R))]
    if tag == "verso":
        out = []
        for i, (f, den) in enumerate(fs):
            a, b = linear(f)
            if a < 0:
                out.append(solve_factors(pre, [((-a * x + b) if j == i else g, d) for j, (g, d) in enumerate(fs)], op))
        return out
    if tag.startswith("zero:"):
        out = []
        for i, (f, den) in enumerate(fs):
            a, b = linear(f)
            if b != 0:
                out.append(solve_factors(pre, [((a * x - b) if j == i else g, d) for j, (g, d) in enumerate(fs)], op))
        return out
    if tag == "denominatore":
        zs = [z for f, den in fs if den for z in solveset(f, x, S.Reals)]
        return [Union(truth, FiniteSet(*zs))]
    if tag in ("moltiplica", "in croce"):
        return [cross(lhs, op, rhs)]
    if tag == "senza zero":
        return [solve(L, op, 0)]
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
    lhs, op, rhs = split_rel(tex)
    truth = solve(expr(lhs), op, expr(rhs))
    pre, fs = factors_of({"level": lvl, "lhs_tex": lhs, "rhs_tex": rhs})
    if not same(solve_factors(pre, fs, op), truth):
        errs.append("the reduced form has other solutions than the problem")

    # zeros: first degree, distinct, small
    zeros = []
    for f, den in fs:
        a, b = linear(f)
        zeros.append((-b / a, den))
    zs = [z for z, _ in zeros]
    if len(set(zs)) != len(zs):
        errs.append(f"two factors with the same zero: {zs}")
    for z in zs:
        if z.q > 3 or abs(z.p) > 12:
            errs.append(f"zero {z} not small")
    for z, den in zeros:
        if den and z in truth:
            errs.append(f"zero of the denominator {z} in the solutions")
        if not den and (op in LARGE) != (z in truth):
            errs.append(f"zero of the numerator {z}: included must match the sign {op}")

    # the answer
    ans = sample["answer"]
    notation = p.get("notation")
    if ans.get("kind") != "choice":
        return errs + ["answer must be a choice"], None
    opts = ans["options"]
    tags = p.get("optionTags", [])
    if len(opts) != 4 or len(tags) != 4:
        errs.append("need four options with their tags")
    sets = []
    for o in opts:
        val = from_values(o["values"])
        shown, style = read_option(o["latex"], notation)
        errs += style
        if not same(val, shown):
            errs.append(f"option latex {o['latex']!r} != values {o['values']}")
        sets.append(val)
    for i in range(len(sets)):
        for j in range(i):
            if same(sets[i], sets[j]):
                errs.append(f"options {j} and {i} are the same set")
    right = [i for i, s in enumerate(sets) if same(s, truth)]
    if right != [ans.get("correct")]:
        errs.append(f"right options {right}, correct = {ans.get('correct')}, truth {truth}")
    ctx = {"lhs": lhs, "op": op, "rhs": rhs, "pre": pre, "fs": fs, "truth": truth}
    for i, (t, s) in enumerate(zip(tags, sets)):
        if i == ans.get("correct"):
            if t != "giusta":
                errs.append(f"correct option tagged {t!r}")
            continue
        if t == "giusta":
            errs.append("wrong option tagged giusta")
            continue
        if not any(same(s, w) for w in expected_wrong(t, ctx)):
            errs.append(f"option {i} tagged {t!r} is not that mistake: {opts[i]['values']}")
        if s == EmptySet or same(s, S.Reals):
            errs.append(f"option {i} is empty or all of R")

    # solution and last step
    try:
        sol, style = read_intervals(sample["solution"])
        errs += style
        if not same(sol, truth):
            errs.append(f"solution {sample['solution']!r} != {truth}")
        if not same(read_inequalities(sample["steps"][-1]), truth):
            errs.append("last step is not the solution")
    except (ValueError, IndexError) as e:
        errs.append(f"solution or last step unreadable: {e}")

    # levels
    w = written_factors(lhs)
    nums = [f for f, den in fs if not den]
    dens = [f for f, den in fs if den]
    kind = None
    if lvl == 1:
        if not (w and rhs == "0" and w[0] == 1 and len(w[1]) == 2):
            errs.append("level 1: a product of two factors, zero on the right")
        elif any(linear(f)[0] != 1 or not (-linear(f)[1]).is_integer or abs(linear(f)[1]) > 9 for f in w[1]):
            errs.append("level 1: factors x - a with a integer in [-9, 9]")
        if op in LARGE:
            errs.append("level 1: strict sign")
    elif lvl == 2:
        if op not in LARGE:
            errs.append("level 2: wide sign")
        if dens or len(nums) != 2:
            errs.append("level 2: two factors")
        if w and rhs == "0":
            kind = "prodotto"
        else:
            P = Poly(expand(expr(lhs) - expr(rhs)), x)
            if P.degree() != 2 or P.coeff_monomial(1) != 0 or P.coeff_monomial(x) == 0:
                errs.append("level 2: ax^2 + bx to collect")
            kind = "raccoglimento" if rhs == "0" else "x^2 e kx"
            if kind == "x^2 e kx" and lhs != "x^2":
                errs.append("level 2: x^2 op kx")
    elif lvl == 3:
        if not (w and rhs == "0" and len(w[1]) == 2):
            errs.append("level 3: a product of two factors, zero on the right")
        elif not any(linear(f)[0] < 0 for f in w[1]):
            errs.append("level 3: a factor with negative coefficient of x")
        if all(z.is_integer for z in zs):
            errs.append("level 3: at least one fractional zero")
        if not re.search(r"\(\d+ - \d*x\)", lhs):
            errs.append("level 3: the negative factor written b - mx")
    elif lvl == 4:
        if dens:
            errs.append("level 4: no denominator")
        if w and rhs == "0":
            kind = "tre fattori"
            if len(w[1]) != 3:
                errs.append("level 4: three factors")
        elif lhs == "x^2":
            kind = "x^2 e k^2"
            k = sqrt(value(rhs))
            if not (k.is_integer and 1 <= k <= 9):
                errs.append("level 4: x^2 op k^2")
        else:
            kind = "x^3 - k^2x" if rhs == "0" else "x^3 e k^2x"
            if len(nums) != 3 or 0 not in zs or sorted(zs) != [-max(zs), 0, max(zs)]:
                errs.append("level 4: x^3 - k^2 x")
    elif lvl in (5, 6, 7):
        if not lhs.startswith(r"\frac"):
            errs.append("levels 5-7: a fraction on the left")
        if lvl == 5:
            if rhs != "0" or len(dens) != 1:
                errs.append("level 5: N/D op 0")
            kind = "largo" if op in LARGE else "stretto"
        if lvl == 6:
            k = value(rhs)
            if k == 0 or not k.is_integer or len(dens) != 1:
                errs.append("level 6: N/D op k, k integer not zero")
            num = expr(re.fullmatch(r"\\frac\{(.+)\}\{(.+)\}", lhs).group(1))
            if solveset(num, x) == solveset(dens[0], x):
                errs.append("level 6: the fraction simplifies")
        if lvl == 7:
            if not rhs.startswith(r"\frac") or len(dens) != 2:
                errs.append("level 7: two fractions, two factors in the denominator")
    else:
        errs.append(f"unknown level {lvl}")

    if not sample.get("steps"):
        errs.append("no steps")
    for st in sample.get("steps", []) + [sample.get("solution", "")]:
        if re.search(r"\\begin\{", st) and r"\text" in st:
            errs.append(f"environment with text in a step: {st!r}")
    return errs, kind
