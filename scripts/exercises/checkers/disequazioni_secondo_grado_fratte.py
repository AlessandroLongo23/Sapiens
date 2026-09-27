"""Checker for disequazioni-secondo-grado-fratte, written from specs/exercises/disequazioni-secondo-grado-fratte.md.

It reads the exercise back from the LaTeX of the problem (a product, a fraction, a fraction compared with a
binomial, a system in a cases environment, or a word problem with the perimeter and the area), solves it with
SymPy (reduce_rational_inequalities and solve_univariate_inequality over the reals; Intersection for the
system and for the limits of the word problem) and compares the result with the right option, the solution
and the last step. Every option is read back from its LaTeX, in either notation (inequalities joined by
"oppure", or intervals with reversed brackets, points written {s} or x = s), and must say the same set as its
values. Each wrong option carries the tag of the mistake it comes from, and the checker solves that mistake
again on its own. Then the constraints of each level and the share of the forms of levels 3, 4 and 7.
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
    discriminant,
    expand,
    fraction,
    gcd,
    oo,
    solveset,
    sympify,
    together,
)
from sympy.core.relational import Ge, Gt, Le, Lt
from sympy.solvers.inequalities import reduce_rational_inequalities

from verify import x

CASE_RANGES = {
    3: {"punto isolato": (0.40, 0.60), "punto tolto": (0.40, 0.60)},
    4: {"trinomio al numeratore": (0.32, 0.48), "trinomio al denominatore": (0.27, 0.43), "quadrato al numeratore": (0.18, 0.32)},
    7: {"maggiore": (0.40, 0.60), "minore": (0.40, 0.60)},
}

REL = {"<": Lt, ">": Gt, r"\leq": Le, r"\geq": Ge}
FLIP = {"<": ">", ">": "<", r"\leq": r"\geq", r"\geq": r"\leq"}
TOGGLE = {"<": r"\leq", ">": r"\geq", r"\leq": "<", r"\geq": ">"}
STRICT = {"<": "<", ">": ">", r"\leq": "<", r"\geq": ">"}
LARGE = {r"\leq", r"\geq"}
FORBIDDEN = [r"(?<![\d}])1\s*x", r"(?<![\d}])0\s*x", r"\+\s*-", r"-\s*-", r"\+\s*\+", r"\^\{?1(?!\d)", r"[+-]\s*0(?!\d)", r"\\frac\{-"]
OPPURE = r" \ \text{ oppure } \ "


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
    if re.fullmatch(r"-?\d+", t):
        return Rational(int(t))
    raise ValueError(f"unreadable value {t!r}")


def split_rel(tex):
    parts = re.split(r" (<|>|\\leq|\\geq) ", tex.strip())
    if len(parts) != 3:
        raise ValueError(f"not one inequality: {tex!r}")
    return parts[0], parts[1], parts[2]


def solve(e, op, rhs=0):
    return reduce_rational_inequalities([[REL[op](e, rhs)]], x, relational=False)


def key(a):
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
# Options


def from_values(vals):
    out = []
    for v in vals:
        m = re.fullmatch(r"\{(-?\d+)\}", v)
        if m:
            out.append(FiniteSet(Rational(int(m.group(1)))))
            continue
        m = re.fullmatch(r"([\[(])([^,]+),([^,]+)([\])])", v)
        if not m:
            raise ValueError(f"bad option value {v!r}")
        lo = -oo if m.group(2) == "-oo" else Rational(m.group(2))
        hi = oo if m.group(3) == "oo" else Rational(m.group(3))
        out.append(Interval(lo, hi, m.group(1) == "(", m.group(4) == ")"))
    return Union(*out) if out else EmptySet


def special(tex):
    if tex == r"S = \emptyset":
        return EmptySet
    if tex == r"S = \mathbb{R}":
        return S.Reals
    return None


def read_intervals(tex):
    """S = \\,\\mathopen{]}-\\infty, -3\\mathclose{[}\\, \\cup \\{1\\} \\cup [2, 4] -> (set, style errors)."""
    sp = special(tex)
    if sp is not None:
        return sp, []
    errs = []
    if not tex.startswith("S = "):
        raise ValueError(f"not a set of intervals: {tex!r}")
    out = []
    for p in tex[4:].split(r" \cup "):
        raw = p.strip()
        if re.search(r"(?<!\\,)\\mathopen", raw):
            errs.append(f"missing \\, before \\mathopen: {raw!r}")
        t = raw.replace(r"\,", "").strip()
        m = re.fullmatch(r"\\\{(-?\d+)\\\}", t)
        if m:
            out.append(FiniteSet(Rational(int(m.group(1)))))
            continue
        t = t.replace(r"\mathopen{]}", "]").replace(r"\mathclose{[}", "[")
        m = re.fullmatch(r"([\[\]])(.+), (.+)([\[\]])", t)
        if not m:
            raise ValueError(f"unreadable interval {p!r}")
        if (m.group(2) == r"-\infty" and m.group(1) == "[") or (m.group(3) == r"+\infty" and m.group(4) == "]"):
            errs.append(f"closed bracket at infinity: {raw!r}")
        out.append(Interval(value(m.group(2)), value(m.group(3)), m.group(1) == "]", m.group(4) == "["))
    return Union(*out), errs


def recompose(tex):
    """Two bounded intervals on two lines, "oppure" closing the first, back to one line."""
    m = re.fullmatch(r"\\begin\{gathered\} (.+) \\ \\text\{ oppure\} \\\\ (.+) \\end\{gathered\}", tex)
    if not m:
        return tex, []
    one = m.group(1) + OPPURE + m.group(2)
    s = read_inequalities(one)
    parts = s.args if isinstance(s, Union) else (s,)
    if len(parts) != 2 or any(not isinstance(q, Interval) or not (q.start.is_finite and q.end.is_finite) for q in parts):
        return one, [f"two lines for an option that is not two bounded intervals: {tex!r}"]
    return one, []


def read_inequalities(tex):
    sp = special(tex)
    if sp is not None:
        return sp
    out = []
    for p in tex.split(OPPURE):
        p = p.strip()
        m = re.fullmatch(r"x = (-?\d+)", p)
        if m:
            out.append(FiniteSet(Rational(int(m.group(1)))))
            continue
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
        one, errs = recompose(tex)
        if one == tex and not errs and len(tex.split(OPPURE)) == 2:
            parts = [read_inequalities(q) for q in tex.split(OPPURE)]
            if all(isinstance(q, Interval) and q.start.is_finite and q.end.is_finite for q in parts):
                errs = [f"two bounded intervals on one line, too wide: {tex!r}"]
        return read_inequalities(one), errs
    raise ValueError(f"unknown notation {notation!r}")


# ---------------------------------------------------------------------------
# The problem


def product_factors(side):
    """x(x - 2)(x^2 + 1) -> [x, x - 2, x^2 + 1]; None if it is not a written product."""
    m = re.fullmatch(r"(x?)((?:\([^()]*\))+)", side.strip())
    if not m:
        return None
    fs = [x] if m.group(1) else []
    fs += [expr(g) for g in re.findall(r"\(([^()]*)\)", m.group(2))]
    return fs


def degree(f):
    return Poly(f, x).degree()


def zeros(f):
    return sorted(solveset(f, x, S.Reals))


def union_zeros(a, pts):
    return Union(a, FiniteSet(*pts)) if pts else a


def read_problem(sample):
    """A dict with what the level needs: the inequality, its factors, the rows, the story."""
    lvl, tex = sample["level"], sample["problem"]
    if lvl == 7:
        m = re.search(r"perimetro di \$(\d+)\$ cm", tex)
        n = re.search(r"per somma \$(\d+)\$", tex)
        a = re.search(r"è (maggiore|minore) di \$(\d+)(\\ \\text\{cm\}\^2)?\$\?", tex)
        if not a or not (m or n):
            raise ValueError("unreadable word problem")
        p = Rational(int(m.group(1)), 2) if m else Rational(int(n.group(1)))
        story = "rettangolo" if m else "numeri"
        if (story == "rettangolo") != bool(a.group(3)):
            raise ValueError("unit of the area")
        return {"p": p, "A": Rational(int(a.group(2))), "op": ">" if a.group(1) == "maggiore" else "<", "story": story}
    if lvl == 6:
        m = re.fullmatch(r"\\begin\{cases\} (.+) \\\\ (.+) \\end\{cases\}", tex)
        if not m:
            raise ValueError("not a system of two rows")
        rows = []
        for r in (m.group(1), m.group(2)):
            lhs, op, rhs = split_rel(r)
            rows.append((expand(expr(lhs) - expr(rhs)), op, lhs, rhs))
        return {"rows": rows}
    lhs, op, rhs = split_rel(tex)
    out = {"lhs": lhs, "op": op, "rhs": rhs}
    if lhs.startswith(r"\frac"):
        a, b, end = frac_args(lhs, 0)
        if end != len(lhs):
            raise ValueError("more than a fraction on the left")
        D = expr(b)
        if rhs == "0":
            N = expr(a)
        else:
            N = expand(cancel((expr(lhs) - expr(rhs)) * D))
        out.update(N=expand(N), D=expand(D), nums=[expand(N)], dens=[expand(D)], num_written=a)
    else:
        fs = product_factors(lhs)
        if fs is None or rhs != "0":
            raise ValueError(f"not a product compared with zero: {tex!r}")
        out.update(nums=[expand(f) for f in fs], dens=[])
    return out


def truth_of(lvl, pr):
    if lvl == 7:
        p, A, op = pr["p"], pr["A"], pr["op"]
        return Intersection(solve(x * (p - x), op, A), Interval.open(0, p))
    if lvl == 6:
        return Intersection(*[solve(e, op) for e, op, _, _ in pr["rows"]])
    return solve(expr(pr["lhs"]) - expr(pr["rhs"]), pr["op"])


def ratio(nums, dens):
    e = S(1)
    for f in nums:
        e *= f
    for f in dens:
        e /= f
    return e


def expected_wrong(tag, lvl, pr, truth):
    if lvl == 7:
        p, A, op = pr["p"], pr["A"], pr["op"]
        lim = Interval.open(0, p)
        if tag == "senza limitazioni":
            return solve(x * (p - x), op, A)
        if tag == "verso":
            return Intersection(solve(x**2 - p * x + A, op), lim)
        if tag == "verso senza limitazioni":
            return solve(x**2 - p * x + A, op)
        if tag == "estremi":
            return Intersection(solve(x * (p - x), TOGGLE[op], A), lim)
        raise ValueError(f"unknown tag {tag!r}")
    if lvl == 6:
        rows = pr["rows"]
        sets = [solve(e, op) for e, op, _, _ in rows]
        if tag == "unione":
            return Union(*sets)
        if tag == "prodotto":
            return solve(rows[0][0] * rows[1][0], rows[0][1])
        if tag in ("verso:1", "verso:2"):
            i = int(tag[-1]) - 1
            return Intersection(*[solve(e, FLIP[op]) if j == i else sets[j] for j, (e, op, _, _) in enumerate(rows)])
        if tag == "estremi":
            return Intersection(*[solve(e, TOGGLE[op]) for e, op, _, _ in rows])
        raise ValueError(f"unknown tag {tag!r}")
    op, nums, dens = pr["op"], pr["nums"], pr["dens"]
    E = ratio(nums, dens)
    if tag == "scambiati":
        return solve(E, FLIP[op])
    if tag == "estremi":
        return solve(E, TOGGLE[op])
    if tag == "scambiati ed estremi":
        return solve(E, TOGGLE[FLIP[op]])
    if tag == "impossibile":
        return EmptySet
    if tag == "sempre":
        return S.Reals
    if tag == "sistema":
        return Intersection(*[solve(f, op) for f in nums], *[solve(f, STRICT[op]) for f in dens])
    if tag == "radici":
        return solve(ratio([expand(f.subs(x, -x)) if degree(f) == 2 else f for f in nums], dens), op)
    if tag == "zero":
        out = []
        for f in nums:
            if degree(f) == 1:
                a, b = Poly(f, x).all_coeffs()
                out.append(a * x - b)
            else:
                out.append(f)
        return solve(ratio(out, dens), op)
    if tag == "punto":
        rest = [f for f in nums if not (degree(f) == 2 and discriminant(f, x) == 0)]
        return solve(ratio(rest, dens), op)
    if tag == "denominatore":
        return union_zeros(truth, [z for f in dens for z in zeros(f)])
    if tag == "moltiplica":
        return solve(ratio(nums, []), op)
    if tag == "segno a":
        return solve(-E, op)
    raise ValueError(f"unknown tag {tag!r}")


# ---------------------------------------------------------------------------


def check(sample):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    tex = sample["problem"]
    if lvl in (1, 2, 3, 4, 5, 6):
        for rx in FORBIDDEN:
            if re.search(rx, tex):
                errs.append(f"forbidden pattern {rx} in {tex!r}")
    pr = read_problem(sample)
    truth = truth_of(lvl, pr)

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
    for i, (t, s) in enumerate(zip(tags, sets)):
        if i == ans.get("correct"):
            if t != "giusta":
                errs.append(f"correct option tagged {t!r}")
            continue
        if t == "giusta":
            errs.append("wrong option tagged giusta")
            continue
        if not same(s, expected_wrong(t, lvl, pr, truth)):
            errs.append(f"option {i} tagged {t!r} is not that mistake: {opts[i]['values']}")
        if (s == EmptySet and t != "impossibile") or (same(s, S.Reals) and t != "sempre"):
            errs.append(f"option {i} is empty or all of R")
    if truth == EmptySet or same(truth, S.Reals):
        errs.append("the solution is empty or all of R")
    if lvl == 7 and notation != "disequazioni":
        errs.append("level 7: options as inequalities")

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
    kind = None
    if lvl <= 5:
        op, nums, dens = pr["op"], pr["nums"], pr["dens"]
        zn = [z for f in nums for z in zeros(f)]
        zd = [z for f in dens for z in zeros(f)]
        allz = zn + zd
        if len(set(allz)) != len(allz):
            errs.append(f"two factors with a common zero: {allz}")
        if any(not z.is_integer or abs(z) > 9 for z in allz):
            errs.append(f"zeros not small integers: {allz}")
        for z in zd:
            if z in truth:
                errs.append(f"zero of the denominator {z} in the solutions")
        for z in zn:
            if (op in LARGE) != (z in truth):
                errs.append(f"zero of the numerator {z}: included must match the sign {op}")
        if dens and gcd(pr["N"], pr["D"]).free_symbols:
            errs.append("the fraction simplifies")
        quad = [f for f in nums + dens if degree(f) == 2]
        lin = [f for f in nums + dens if degree(f) == 1]
        if len(quad) + len(lin) != len(nums + dens) or not quad:
            errs.append("factors of first and second degree, at least one of second")
        disc = [discriminant(f, x) for f in quad]
        if lvl == 1:
            if op in LARGE:
                errs.append("level 1: strict sign")
            if dens or len(quad) != 1 or len(lin) != 1 or disc[0] <= 0 or Poly(quad[0], x).LC() != 1:
                errs.append("level 1: a monic trinomial with two zeros and a first-degree factor")
        elif lvl == 2:
            if dens or len(quad) != 1 or len(lin) != 1 or disc[0] >= 0 or Poly(quad[0], x).LC() != 1:
                errs.append("level 2: a monic trinomial with negative discriminant and a first-degree factor")
        elif lvl == 3:
            if dens or len(quad) != 1 or len(lin) != 1 or disc[0] != 0 or Poly(quad[0], x).LC() != 1:
                errs.append("level 3: a square written expanded and a first-degree factor")
            else:
                s0 = zeros(quad[0])[0]
                without = solve(lin[0], op)
                if (s0 in without) == (s0 in truth):
                    errs.append("level 3: the zero of the square does not change the solution")
                kind = "punto isolato" if op in LARGE else "punto tolto"
        elif lvl == 4:
            if rhs_not_zero(pr) or len(dens) != 1:
                errs.append("level 4: N/D op 0")
            N, D = pr["N"], pr["D"]
            if degree(N) == 2 and degree(D) == 1 and discriminant(N, x) > 0:
                kind = "trinomio al numeratore"
            elif degree(N) == 1 and degree(D) == 2 and discriminant(D, x) > 0:
                kind = "trinomio al denominatore"
            elif degree(N) == 2 and degree(D) == 2 and discriminant(N, x) == 0 and discriminant(D, x) > 0:
                kind = "quadrato al numeratore"
            else:
                errs.append("level 4: unknown form")
        elif lvl == 5:
            m = re.fullmatch(r"\\frac\{(\d+)\}\{(x|x [+-] \d+)\}", pr["lhs"])
            if not m or not re.fullmatch(r"x|x [+-] \d+", pr["rhs"]):
                errs.append("level 5: p/(x - c) op x - d")
            N = pr["N"]
            if degree(N) != 2 or Poly(N, x).LC() != -1 or discriminant(N, x) <= 0:
                errs.append("level 5: reduced numerator with a = -1 and two zeros")
    elif lvl == 6:
        rows = pr["rows"]
        sets6 = [solve(e, op) for e, op, _, _ in rows]
        for e, op, lhs, rhs in rows:
            if degree(e) != 2 or Poly(e, x).LC() != 1 or discriminant(e, x) <= 0 or any(not z.is_integer or abs(z) > 6 for z in zeros(e)):
                errs.append(f"level 6: row {lhs} {op} {rhs} is not a monic trinomial with integer zeros")
            if rhs != "0" and lhs != "x^2":
                errs.append("level 6: rows written T op 0, x^2 op k^2 or x^2 op kx")
        if any(same(truth, s) for s in sets6):
            errs.append("level 6: one row does not matter")
    elif lvl == 7:
        pp, A = pr["p"], pr["A"]
        if not pp.is_integer:
            errs.append("level 7: half perimeter integer")
        if not A < pp**2 / 4:
            errs.append("level 7: area below the maximum p^2/4")
        if any(not z.is_integer or not 0 < z < pp for z in zeros(x**2 - pp * x + A)):
            errs.append("level 7: zeros integer inside the limits")
        kind = "maggiore" if pr["op"] == ">" else "minore"
    else:
        errs.append(f"unknown level {lvl}")

    if not sample.get("steps"):
        errs.append("no steps")
    for st in sample.get("steps", []) + [sample.get("solution", "")]:
        if re.search(r"\\begin\{", st) and r"\text" in st:
            errs.append(f"environment with text in a step: {st!r}")
    return errs, kind


def rhs_not_zero(pr):
    return pr["rhs"] != "0"
