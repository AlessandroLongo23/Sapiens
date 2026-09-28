"""Independent checker for equazioni-irrazionali (specs/exercises/equazioni-irrazionali.md).

Written from the spec and from lesson 92, not from the generator. Every sample is read back from its text: the
equation or inequality is parsed from `problem` (radicals \\sqrt{..} and \\sqrt[3]{..}, polynomials), and solved
here on its own.

Equations: the radicals are removed by hand from the parsed expression (one square root: A = Q^2; two square
roots: the two squarings of the lesson in closed form; a cube root: A = Q^3), the real roots of the polynomial
come from SymPy, and each one is put back into the equation as written. SymPy's sqrt lives in the complex
numbers (sqrt(-3) = sqrt(-3) would pass), so a candidate is thrown away as soon as a square-root radicand is
negative there; cube roots are taken with real_root. What is left is the truth.

Inequalities: the definition, region by region. The critical points are the real zeros of the radicand, of
the second member and of their difference A - B^2; every open region is tested at an interior point and every
critical point on its own, with the root defined only where the radicand is not negative. The result must
agree with the systems of the lesson, solved with reduce_rational_inequalities.

Then the answer, the solution and the last step; the multiple choice (four options, different as sets, one
right, each written as its values); every wrong option is redone here from the mistake it names (the
extraneous solutions kept, the condition put on x, the square without the double product, the existence
forgotten, one system only, ...); the constraints and the share of the cases of each level.
"""
import re

from sympy import (
    EmptySet,
    FiniteSet,
    Function,
    Interval,
    Intersection,
    Poly,
    Rational,
    S,
    Union,
    expand,
    real_root,
    sqrt,
    sympify,
)
from sympy.core.relational import Eq, Ge, Gt, Le, Lt
from sympy.solvers.inequalities import reduce_rational_inequalities

from checkers.disequazioni_secondo_grado import end_value, from_values, read_inequalities, read_set, same, same_pieces, to_set
from verify import x

CASE_RANGES = {
    1: {"k positivo": (0.50, 0.70), "k negativo": (0.12, 0.28), "k nullo": (0.12, 0.28)},
    2: {"una estranea": (0.70, 0.90), "due accettate": (0.10, 0.30)},
    3: {"termine prima": (0.40, 0.60), "termine dopo": (0.40, 0.60)},
    4: {"soluzione negativa": (0.50, 0.70), "primo grado": (0.30, 0.50)},
    5: {"radici uguali": (0.40, 0.60), "somma": (0.40, 0.60)},
    6: {"binomio": (0.60, 0.80), "numero": (0.20, 0.40)},
    7: {"k positivo": (0.50, 0.70), "k negativo": (0.17, 0.33), "k nullo": (0.08, 0.22)},
    8: {"primo grado": (0.60, 0.80), "secondo grado": (0.20, 0.40)},
}

FORBIDDEN = [r"(?<![\d}])1\s*x", r"(?<![\d}])0\s*x", r"\+\s*-", r"-\s*-", r"\+\s*\+", r"\^\{?1(?!\d)", r"[+-]\s*0(?!\d)"]
REL = {"<": Lt, ">": Gt, r"\leq": Le, r"\geq": Ge, "=": Eq}
FLIP = {"<": ">", ">": "<", r"\leq": r"\geq", r"\geq": r"\leq"}
TOGGLE = {"<": r"\leq", ">": r"\geq", r"\leq": "<", r"\geq": ">"}
LESS = {"<", r"\leq"}

SQ = Function("SQ")
CB = Function("CB")


# ---------------------------------------------------------------------------
# Reading the problem


def brace(s, i):
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


def to_py(tex):
    """A side of the problem as a SymPy expression: SQ(A) for \\sqrt{A}, CB(A) for \\sqrt[3]{A}."""
    out = ""
    i = 0
    while i < len(tex):
        if tex.startswith(r"\sqrt[3]", i):
            body, i = brace(tex, i + 8)
            out += f"CB({to_py(body)})"
        elif tex.startswith(r"\sqrt", i):
            body, i = brace(tex, i + 5)
            out += f"SQ({to_py(body)})"
        else:
            out += tex[i]
            i += 1
    out = out.replace("^", "**")
    out = re.sub(r"(\d)\s*x", r"\1*x", out)
    if not re.fullmatch(r"[0-9x+\-*/() SQCB]+", out):
        raise ValueError(f"unreadable side {tex!r}")
    return out


def side(tex):
    return sympify(to_py(tex), locals={"x": x, "SQ": SQ, "CB": CB})


def parse(tex):
    parts = re.split(r" (=|<|>|\\leq|\\geq) ", tex)
    if len(parts) != 3:
        raise ValueError(f"not one relation: {tex!r}")
    return side(parts[0]), parts[1], side(parts[2]), parts[0], parts[2]


def poly_of(e):
    e = expand(e)
    if e.has(SQ) or e.has(CB):
        raise ValueError(f"radical left in {e}")
    return e


def split_radicals(E):
    """E = sum of c_i * radical_i + Q: [(c, kind, radicand)], Q."""
    E = expand(E)
    rads = []
    rest = E
    for f in sorted(E.atoms(SQ) | E.atoms(CB), key=str):
        c = E.coeff(f)
        rads.append((c, "sq" if f.func == SQ else "cb", f.args[0]))
        rest = rest - c * f
    return rads, poly_of(rest)


def real_roots(p):
    p = expand(p)
    if p == 0:
        raise ValueError("the resolvent is identically zero")
    if not p.has(x):
        return []
    rs = []
    for r in Poly(p, x).real_roots():
        if not any(r == s for s in rs):
            rs.append(r)
    return sorted(rs, key=lambda v: float(v))


def eliminate(rads, Q):
    """The polynomial whose real roots contain every solution of sum c_i R_i + Q = 0."""
    if len(rads) == 1:
        c, kind, A = rads[0]
        R = -Q / c
        return A - R**2 if kind == "sq" else A - R**3
    if len(rads) == 2 and all(k == "sq" for _, k, _ in rads):
        (c1, _, A1), (c2, _, A2) = rads
        # c1 R1 = -(c2 R2 + Q) => c1^2 A1 = c2^2 A2 + 2 c2 Q R2 + Q^2 => (2 c2 Q)^2 A2 = (c1^2 A1 - c2^2 A2 - Q^2)^2
        return expand((2 * c2 * Q) ** 2 * A2 - (c1**2 * A1 - c2**2 * A2 - Q**2) ** 2)
    raise ValueError("unexpected radicals")


def value_at(e, v):
    """The exact value of e at x = v, or None when a square-root radicand is negative there."""
    for f in e.atoms(SQ):
        if f.args[0].subs(x, v) < 0:
            return None
    e = e.replace(SQ, lambda a: sqrt(a)).replace(CB, lambda a: real_root(a, 3))
    return e.subs(x, v)


def solve_equation(L, R):
    E = L - R
    rads, Q = split_radicals(E)
    roots = real_roots(eliminate(rads, Q))
    truth = []
    for r in roots:
        v = value_at(E, r)
        if v is not None and abs(v.evalf(60)) < Rational(1, 10**40):
            truth.append(r)
    return roots, truth


# ---------------------------------------------------------------------------
# Sets


def sol(e, op):
    """e op 0 over the reals, for a polynomial e."""
    e = expand(e)
    if not e.has(x):
        return S.Reals if REL[op](e, 0) else EmptySet
    if op == "=":
        return FiniteSet(*real_roots(e))
    return reduce_rational_inequalities([[REL[op](e, 0)]], x, relational=False)


def by_definition(A, op, B):
    """{x : sqrt(A) op B}, the root defined only where A >= 0: region by region."""
    crit = []
    for p in (A, B, expand(A - B**2)):
        if expand(p).has(x):
            crit += real_roots(p)
    zs = []
    for z in sorted(crit, key=float):
        if not zs or z != zs[-1]:
            zs.append(z)

    def holds(v):
        a = A.subs(x, v)
        if a < 0:
            return False
        return bool(REL[op](sqrt(a), B.subs(x, v)))

    parts = []
    pts = [None] + zs + [None]
    for j in range(len(zs) + 1):
        lo, hi = pts[j], pts[j + 1]
        if lo is None and hi is None:
            probe = Rational(0)
        elif lo is None:
            probe = hi - 1
        elif hi is None:
            probe = lo + 1
        else:
            probe = (lo + hi) / 2
        if holds(probe):
            parts.append(Interval.open(-S.Infinity if lo is None else lo, S.Infinity if hi is None else hi))
    parts += [FiniteSet(z) for z in zs if holds(z)]
    return Union(*parts) if parts else EmptySet


def pieces(st):
    """A set as ordered pieces (lo, hi, lo closed, hi closed), a point as [v, v]."""
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
    return sorted(out, key=lambda t: float(t[0]) if t[0] != -S.Infinity else -1e9)


# ---------------------------------------------------------------------------
# Writing: sets of values


def read_values(tex):
    """S = \\emptyset, S = \\{a, b\\} (integers), S = \\left\\{a, b\\right\\} (a fraction) -> (values, style errors)."""
    if tex == r"S = \emptyset":
        return [], []
    m = re.fullmatch(r"S = \\\{(.+)\\\}", tex)
    left = False
    if not m:
        m = re.fullmatch(r"S = \\left\\\{(.+)\\right\\\}", tex)
        left = True
    if not m:
        raise ValueError(f"unreadable set {tex!r}")
    vals, errs = [], []
    for t in m.group(1).split(", "):
        v, e = end_value(t)
        vals.append(v)
        errs += e
    if any(not v.is_integer for v in vals) != left:
        errs.append(f"\\left\\{{ only with a fraction: {tex!r}")
    if vals != sorted(vals) or len(set(vals)) != len(vals):
        errs.append(f"values not ascending and distinct: {tex!r}")
    return vals, errs


def rat(s):
    if not isinstance(s, str) or not re.fullmatch(r"-?\d+(/\d+)?", s):
        raise ValueError(f"bad value {s!r}")
    return Rational(s)


def same_values(a, b):
    return sorted(a) == sorted(b) and len(set(a)) == len(a)


# ---------------------------------------------------------------------------
# Equations


def equation_structure(lt, rt, L, R):
    """What the problem is, from its text."""
    rads_l, Ql = split_radicals(L)
    rads_r, Qr = split_radicals(R)
    info = {"L": L, "R": R, "rads_l": rads_l, "rads_r": rads_r, "Ql": Ql, "Qr": Qr}
    if len(rads_l) == 1 and not rads_r:
        c, kind, A = rads_l[0]
        if c != 1:
            raise ValueError("coefficient in front of the radical")
        info["kind"] = kind
        info["A"] = A
        info["B"] = expand(Qr - Ql)
        info["T"] = Ql
        info["N"] = Qr
    elif len(rads_l) == 1 and len(rads_r) == 1:
        info["kind"] = "rr"
        info["A"], info["C"] = rads_l[0][2], rads_r[0][2]
    elif len(rads_l) == 2 and not rads_r:
        info["kind"] = "sum"
        info["A"], info["C"] = rads_l[0][2], rads_l[1][2]
        info["B"] = Qr
    else:
        raise ValueError("unexpected shape")
    return info


def roots_of(e):
    """Rational real roots of a polynomial, or None if one is irrational (the mistake cannot be written)."""
    e = expand(e)
    if e == 0:
        return None
    rs = real_roots(e)
    if any(not r.is_rational for r in rs):
        return None
    return rs


def expected_values(tag, info, lvl, roots, truth):
    A, B = info.get("A"), info.get("B")
    if tag == "tutte":
        return roots
    if tag == "estranee":
        return [r for r in roots if r not in truth]
    if tag == "x positive":
        return [r for r in roots if r >= 0]
    if tag == "vuoto":
        return []
    if tag == "opposti":
        return [-r for r in roots]
    if tag == "senza doppio prodotto":
        if info["kind"] == "sum":
            return roots_of(info["A"] + info["C"] - B**2)
        P = Poly(B, x)
        m, n = P.coeff_monomial(x), P.coeff_monomial(1)
        return roots_of(A - m**2 * x**2 - n**2)
    if tag == "doppio prodotto a metà":
        n = Poly(B, x).coeff_monomial(1)
        return roots_of(A - x**2 - n * x - n**2)
    if tag == "una sola":
        if lvl == 1:
            k = B
            if k == 0:
                return [max(truth)]
            return [r for r in roots_of(A - k**2) if r >= 0]
        if lvl == 6:
            return [r for r in truth if r >= 0]
        return [max(roots)]
    if tag in ("senza quadrato", "senza radice"):
        return roots_of(A - B)
    if tag == "doppio":
        return roots_of(A - 2 * B)
    if tag == "triplo":
        return roots_of(A - 3 * B)
    if tag == "quadrato":
        return roots_of(A - B**2)
    if tag == "modulo":
        return roots_of(A + B)
    if tag == "segno":
        wrong = info["N"] + info["T"]
        rs = roots_of(A - wrong**2)
        return None if rs is None else [r for r in rs if wrong.subs(x, r) >= 0]
    if tag == "condizione":
        return [r for r in truth if B.subs(x, r) >= 0]
    if tag == "cubo senza termini":
        n = Poly(B, x).coeff_monomial(1)
        return roots_of(A - x**3 - n**3)
    raise ValueError(f"unknown tag {tag!r}")


def check_equation(sample, info, roots, truth):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    ans = sample["answer"]
    if ans.get("kind") != "set" or ans.get("universal"):
        return ["answer must be a set"], None
    given = [rat(v) for v in ans["values"]]
    if given != sorted(truth) or not all(g.is_rational for g in given):
        errs.append(f"answer {ans['values']} != truth {truth}")
    try:
        shown, style = read_values(ans["latex"])
        errs += style
        if shown != sorted(truth):
            errs.append(f"answer latex {ans['latex']!r} != truth")
        if sample["solution"] != ans["latex"] or sample["steps"][-1] != ans["latex"]:
            errs.append("solution or last step differ from the answer")
    except ValueError as e:
        errs.append(str(e))

    # the multiple choice and its distractors
    ch = sample.get("choice")
    if not ch:
        errs.append("no choice variant")
    else:
        opts = ch["options"]
        sets = []
        for o in opts:
            vals = [rat(v) for v in o["values"]]
            try:
                shown, style = read_values(o["latex"])
                errs += style
                if shown != vals:
                    errs.append(f"option latex {o['latex']!r} != values {o['values']}")
            except ValueError as e:
                errs.append(str(e))
            sets.append(frozenset(vals))
        if len(opts) != 4 or len(set(sets)) != 4:
            errs.append("need four options, different as sets")
        right = [i for i, s in enumerate(sets) if s == frozenset(truth)]
        if right != [ch.get("correct")]:
            errs.append(f"right options {right}, correct = {ch.get('correct')}")
        wrong_sets = {s for i, s in enumerate(sets) if i != ch.get("correct")}
        named = set()
        for d in p.get("distractors", []):
            vals = [rat(v) for v in d["values"]]
            want = expected_values(d["tag"], info, lvl, roots, truth)
            if want is None or sorted(set(want)) != sorted(vals):
                errs.append(f"distractor {d['tag']!r} = {d['values']} is not that mistake ({want})")
            named.add(frozenset(vals))
        if not wrong_sets <= named:
            errs.append("an option does not come from a named mistake")

    # the levels
    kind = info["kind"]
    extraneous = len(roots) - len(truth)
    A = info.get("A")
    dA = Poly(A, x).degree() if A is not None else None
    case = None
    if lvl in (1, 2, 3, 4) and kind != "sq":
        errs.append(f"level {lvl}: one square root")
    if lvl == 1:
        k = info["B"]
        if k.has(x) or info["T"] != 0 or dA not in (1, 2):
            errs.append("level 1: sqrt(A) = k")
        else:
            case = "k positivo" if k > 0 else "k negativo" if k < 0 else "k nullo"
            if abs(k) > 7:
                errs.append("level 1: small k")
    elif lvl == 2:
        B = info["B"]
        if dA != 1 or info["T"] != 0 or Poly(B, x).degree() != 1 or Poly(B, x).LC() <= 0:
            errs.append("level 2: sqrt(ax + b) = mx + n, m > 0")
        if len(roots) != 2:
            errs.append("level 2: two candidates")
        case = "una estranea" if extraneous == 1 else "due accettate" if extraneous == 0 else None
        if case == "due accettate" and all(r >= 0 for r in roots):
            errs.append("level 2: with two accepted, one of them negative")
        if case is None:
            errs.append("level 2: one extraneous or none")
    elif lvl == 3:
        T = info["T"]
        if dA != 1 or not T.has(x) or Poly(T, x).degree() != 1 or T.subs(x, 0) != 0 or info["N"].has(x):
            errs.append("level 3: px + sqrt(A) = n")
        if len(roots) != 2 or extraneous != 1:
            errs.append("level 3: two candidates, one extraneous")
        case = "termine prima" if not sample["problem"].startswith(r"\sqrt") else "termine dopo"
    elif lvl == 4:
        B = info["B"]
        if info["T"] != 0 or Poly(B, x).degree() != 1:
            errs.append("level 4: sqrt(A) = mx + n")
        elif dA == 1:
            case = "soluzione negativa"
            if Poly(B, x).LC() >= 0 or len(truth) != 1 or truth[0] >= 0 or extraneous != 1 or not any(r > 0 for r in roots):
                errs.append("level 4: a negative solution kept, a positive one thrown away")
        elif dA == 2:
            case = "primo grado"
            if Poly(A, x).LC() != 1 or Poly(B, x).LC() != 1 or len(roots) != 1 or Poly(expand(A - B**2), x).degree() != 1:
                errs.append("level 4: the x^2 cancel")
        else:
            errs.append("level 4: radicand of degree 1 or 2")
    elif lvl == 5:
        if kind == "rr":
            case = "radici uguali"
            if sorted([Poly(A, x).degree(), Poly(info["C"], x).degree()]) != [1, 2]:
                errs.append("level 5: one radicand of second degree, one of first")
        elif kind == "sum":
            case = "somma"
            if info["B"].has(x) or info["B"] <= 0:
                errs.append("level 5: a positive number on the right")
        else:
            errs.append("level 5: two radicals")
        if len(roots) != 2 or extraneous != 1:
            errs.append("level 5: two candidates, one extraneous")
    elif lvl == 6:
        if kind != "cb":
            errs.append("level 6: a cube root")
        elif info["T"] != 0:
            errs.append("level 6: the cube root alone")
        else:
            B = info["B"]
            if B.has(x):
                case = "binomio"
                if dA != 3 or Poly(A, x).LC() != 1 or Poly(B, x).LC() != 1:
                    errs.append("level 6: x^3 + ... = (x + n)^3")
                if len(truth) != 2 or not any(B.subs(x, r) < 0 for r in truth):
                    errs.append("level 6: two solutions, one with a negative second member")
            else:
                case = "numero"
                if not truth:
                    errs.append("level 6: some solution")
        if extraneous:
            errs.append("level 6: a cube root adds no solutions")
    if case is not None and p.get("case") != case:
        errs.append(f"params.case {p.get('case')!r} but the problem is {case!r}")
    for v in roots:
        if not v.is_rational or v.q > 4 or abs(v) > 150:
            errs.append(f"candidate {v} too big")
    return errs, case


# ---------------------------------------------------------------------------
# Inequalities


def rule(A, op, B):
    """The systems of the lesson."""
    if not B.has(x):
        k = B
        if op in LESS:
            if k < 0 or (k == 0 and op == "<"):
                return EmptySet
            if k == 0:
                return sol(A, "=")
            return Intersection(sol(A, r"\geq"), sol(A - k**2, op))
        if k < 0:
            return sol(A, r"\geq")
        if k == 0:
            return sol(A, ">" if op == ">" else r"\geq")
        return sol(A - k**2, op)
    if op in LESS:
        return Intersection(sol(A, r"\geq"), sol(B, ">" if op == "<" else r"\geq"), sol(A - B**2, op))
    return Union(Intersection(sol(B, "<"), sol(A, r"\geq")), Intersection(sol(B, r"\geq"), sol(A - B**2, op)))


def expected_set(tag, A, op, B):
    k = B
    if tag == "senza esistenza":
        if not B.has(x):
            return sol(A - k**2, op)
        return Intersection(sol(B, ">" if op == "<" else r"\geq"), sol(A - B**2, op))
    if tag == "estremi":
        return by_definition(A, TOGGLE[op], B)
    if tag == "senza quadrato":
        base = sol(A - k, op)
        return Intersection(sol(A, r"\geq"), base) if op in LESS else base
    if tag == "verso":
        return by_definition(A, FLIP[op], B)
    if tag == "esistenza":
        return sol(A, r"\geq")
    if tag in ("quadrato", "solo quadrato"):
        return sol(A - B**2, op)
    if tag in ("vuoto", "intersezione"):
        return EmptySet
    if tag == "positivo":
        return sol(A, ">")
    if tag == "punto":
        return sol(A, "=")
    if tag == "senza segno":
        return Intersection(sol(A, r"\geq"), sol(A - B**2, op))
    if tag == "un sistema solo":
        return Intersection(sol(B, r"\geq"), sol(A - B**2, op))
    if tag == "solo primo":
        return Intersection(sol(B, "<"), sol(A, r"\geq"))
    raise ValueError(f"unknown tag {tag!r}")


def read_option(tex, notation):
    if tex.startswith("S = ") or tex.startswith(r"\begin{gathered} S = "):
        return read_set(tex)
    if notation != "disequazioni":
        raise ValueError(f"inequalities in notation {notation!r}: {tex!r}")
    return read_inequalities(tex)


def check_inequality(sample, L, op, R):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    rads, Ql = split_radicals(L)
    if len(rads) != 1 or rads[0][:2] != (1, "sq") or Ql != 0 or R.has(SQ):
        return ["an inequality sqrt(A) op B"], None
    A = rads[0][2]
    B = expand(R)
    truth = by_definition(A, op, B)
    if not same(truth, rule(A, op, B)):
        errs.append(f"definition {truth} and systems {rule(A, op, B)} disagree")
    tp = pieces(truth)
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["answer must be a choice"], None
    opts = ans["options"]
    tags = p.get("optionTags", [])
    notation = p.get("notation")
    if len(opts) != 4 or len(tags) != 4:
        errs.append("four options with their tags")
    sets, raws = [], []
    for o in opts:
        val = from_values(o["values"])
        try:
            shown, style = read_option(o["latex"], notation)
            errs += style
            if not same_pieces(val, shown):
                errs.append(f"option latex {o['latex']!r} != values {o['values']}")
        except ValueError as e:
            errs.append(str(e))
        raws.append(val)
        sets.append(to_set(val))
    for i in range(len(sets)):
        for j in range(i):
            if same(sets[i], sets[j]):
                errs.append(f"options {j} and {i} are the same set")
    right = [i for i, s in enumerate(sets) if same(s, truth)]
    if right != [ans.get("correct")]:
        errs.append(f"right options {right}, correct = {ans.get('correct')}, truth {truth}")
    elif not same_pieces(raws[ans["correct"]], tp):
        errs.append("the right option is not written as the ordered intervals")
    for i, (t, s) in enumerate(zip(tags, sets)):
        if i == ans.get("correct"):
            if t != "giusta":
                errs.append(f"correct option tagged {t!r}")
            continue
        if t == "giusta":
            errs.append(f"wrong option {i} tagged giusta")
            continue
        if not same(s, expected_set(t, A, op, B)):
            errs.append(f"option {i} tagged {t!r} is not that mistake: {opts[i]['values']}")
        if s == S.Reals:
            errs.append("an option is all of R")
    try:
        sol_p, style = read_set(sample["solution"])
        errs += style
        if not same_pieces(sol_p, tp):
            errs.append(f"solution {sample['solution']!r} != {truth}")
        last = sample["steps"][-1]
        got = EmptySet if last == r"\text{Nessun } x \text{ è soluzione.}" else to_set(read_inequalities(last)[0])
        if not same(got, truth):
            errs.append("last step is not the solution")
    except (ValueError, IndexError) as e:
        errs.append(f"solution or last step unreadable: {e}")

    dA = Poly(A, x).degree()
    case = None
    if lvl == 7:
        if B.has(x):
            errs.append("level 7: a number on the right")
        else:
            case = "k positivo" if B > 0 else "k negativo" if B < 0 else "k nullo"
            if dA == 2 and B <= 0:
                errs.append("level 7: second degree only with k positive")
    elif lvl == 8:
        if op not in LESS or not B.has(x) or Poly(B, x).degree() != 1:
            errs.append("level 8: sqrt(A) < mx + n")
        case = "primo grado" if dA == 1 else "secondo grado"
        if truth == EmptySet:
            errs.append("level 8: some solution")
    elif lvl == 9:
        if op in LESS or not B.has(x) or Poly(B, x).degree() != 1 or dA != 1:
            errs.append("level 9: sqrt(ax + b) > mx + n")
        if Intersection(sol(B, "<"), sol(A, r"\geq")) == EmptySet or Intersection(sol(B, r"\geq"), sol(A - B**2, op)) == EmptySet:
            errs.append("level 9: both systems give solutions")
    if case is not None and p.get("case") != case:
        errs.append(f"params.case {p.get('case')!r} but the problem is {case!r}")
    return errs, case


# ---------------------------------------------------------------------------


def check(sample):
    errs = []
    tex = sample["problem"]
    for rx in FORBIDDEN:
        if re.search(rx, tex):
            errs.append(f"forbidden pattern {rx} in {tex!r}")
    if sample.get("prompt") not in ("Risolvi l'equazione.", "Risolvi la disequazione."):
        errs.append("prompt")
    if not sample.get("steps"):
        errs.append("no steps")
    L, op, R, lt, rt = parse(tex)
    polys = []
    for e in (L, R):
        rads, Q = split_radicals(e)
        polys += [Q] + [a for _, _, a in rads]
    for e in polys:
        for c in Poly(e, x).all_coeffs():
            if not c.is_integer or abs(c) > 70:
                errs.append(f"coefficient {c} in {e}")
    lvl = sample["level"]
    if lvl <= 6:
        if op != "=":
            return errs + ["levels 1-6: an equation"], None
        info = equation_structure(lt, rt, L, R)
        roots, truth = solve_equation(L, R)
        e, case = check_equation(sample, info, roots, truth)
        return errs + e, case
    if op == "=":
        return errs + ["levels 7-9: an inequality"], None
    e, case = check_inequality(sample, L, op, R)
    return errs + e, case
