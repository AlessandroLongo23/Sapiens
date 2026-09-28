"""Independent checker for equazioni-binomie-trinomie (specs/exercises/equazioni-binomie-trinomie.md).

Written from the spec and from lesson 90, not from the generator. Every sample is read back from its text: the
equation or inequality is parsed from `problem`, its real solutions come from SymPy (`Poly.real_roots`, exact,
with algebraic numbers compared to 50 digits) and the inequalities from `reduce_rational_inequalities`. The set
S is read back from its LaTeX (`S = \\{...\\}`, `S = \\left\\{...\\right\\}`, `S = \\emptyset`), every element in
its simplified form (square-free radicands, one fraction, n-th roots of square-free integers), in ascending
order and without repetitions, and compared with the answer values, the solution and the last step.

Multiple choice: four options, different as sets of numbers (as unions of intervals at level 7), exactly one
equal to the truth, at the index `correct`. Every wrong option carries the mistake it comes from
(`params.distractors` for the equations, `params.optionTags` for the inequalities), and the mistake is redone
here from the problem: dividing by x, forgetting a root, the values of t taken as solutions, the rule of even
exponents applied to odd ones and the other way round, and so on. Only the fallback options (`altro`) are
checked just for being different.

Then the constraints of each level and the share of the forms.
"""
import re

from sympy import Poly, Rational, S, factorint, quo, real_root, root, sqrt, sympify

from checkers.disequazioni_secondo_grado import (
    FLIP,
    LARGE,
    OPPURE,
    TOGGLE,
    end_value,
    from_values,
    pieces_of,
    poly_expr,
    read_inequalities,
    read_set,
    same,
    same_pieces,
    solve,
    to_set,
)
from verify import x

CASE_RANGES = {
    1: {"differenza di quadrati": (0.30, 0.50), "trinomio": (0.25, 0.45), "x^2 raccolto": (0.15, 0.35)},
    2: {"differenza di quadrati": (0.55, 0.75), "somma di quadrati": (0.25, 0.45)},
    3: {"quoziente con due soluzioni": (0.50, 0.70), "quoziente senza soluzioni": (0.30, 0.50)},
    4: {"pari positivo": (0.22, 0.38), "pari negativo": (0.13, 0.27), "dispari": (0.22, 0.38), "irrazionale": (0.13, 0.27)},
    5: {
        "quattro soluzioni intere": (0.27, 0.43),
        "soluzioni irrazionali": (0.09, 0.21),
        "t di segno opposto": (0.27, 0.43),
        "t negativi": (0.09, 0.21),
    },
    6: {"t di segno opposto": (0.40, 0.60), "t positivi": (0.17, 0.33), "t negativi": (0.17, 0.33)},
    7: {"terzo grado": (0.50, 0.70), "biquadratica": (0.30, 0.50)},
}

FORBIDDEN = [r"(?<![\d}])1\s*x", r"(?<![\d}])0\s*x", r"\+\s*-", r"-\s*-", r"\+\s*\+", r"\^\{?1(?!\d)", r"[+-]\s*0(?!\d)"]
OPS = {"<", ">", r"\leq", r"\geq"}


# ---------------------------------------------------------------------------
# Numbers and sets


def eqn(a, b):
    """Equality of two real algebraic numbers of small height: 50 digits."""
    return abs((a - b).evalf(50)) < Rational(1, 10**40)


def same_numbers(a, b):
    """Two lists of numbers are the same set (each list without repetitions)."""
    return len(a) == len(b) and all(any(eqn(u, v) for v in b) for u in a)


def distinct(vals):
    return all(not eqn(vals[i], vals[j]) for i in range(len(vals)) for j in range(i))


def value(s):
    if not isinstance(s, str) or not re.fullmatch(r"[0-9sqrt+\-*/() ]+", s):
        raise ValueError(f"bad value {s!r}")
    for n in re.findall(r"sqrt\((\d+)\)", s):
        if int(n) < 2 or any(e > 1 for e in factorint(int(n)).values()):
            raise ValueError(f"radicand {n} not square-free in {s!r}")
    return sympify(s)


def element(t):
    """One element of S, with style errors: an n-th root of a square-free integer, or what end_value reads."""
    m = re.fullmatch(r"(-?)\\sqrt\[(\d+)\]\{(\d+)\}", t)
    if m:
        n, k = int(m.group(2)), int(m.group(3))
        errs = []
        if n < 3 or k < 2 or any(e > 1 for e in factorint(k).values()):
            errs.append(f"root {t!r} not simplified")
        v = root(k, n)
        return (-v if m.group(1) else v), errs
    if "[" in t:
        raise ValueError(f"unreadable element {t!r}")
    return end_value(t)


def read_solution_set(tex):
    """S = ... -> (values in the written order, style errors)."""
    if tex == r"S = \emptyset":
        return [], []
    m = re.fullmatch(r"S = \\\{(.+)\\\}", tex)
    plain = bool(m)
    if not m:
        m = re.fullmatch(r"S = \\left\\\{(.+)\\right\\\}", tex)
    if not m:
        raise ValueError(f"not a set: {tex!r}")
    out, errs = [], []
    for t in m.group(1).split(", "):
        v, e = element(t.strip())
        out.append(v)
        errs += e
    integers = all(v.is_integer for v in out)
    if plain != integers:
        errs.append(f"\\left\\{{ \\right\\}} only around fractions and radicals: {tex!r}")
    fl = [float(v) for v in out]
    if any(fl[i] >= fl[i + 1] for i in range(len(fl) - 1)):
        errs.append(f"elements not ascending or repeated: {tex!r}")
    return out, errs


def roots_real(P):
    """The real solutions of P = 0, distinct, exact."""
    out = []
    for r in Poly(P, x).real_roots():
        if not any(eqn(r, s) for s in out):
            out.append(r)
    return out


def xroot(t, n):
    """Real solutions of x^n = t."""
    t = sympify(t)
    if t == 0:
        return [S(0)]
    if n % 2 == 0:
        return [] if t < 0 else [-root(t, n), root(t, n)]
    return [real_root(t, n)]


def positive_root(t, n):
    return root(abs(sympify(t)), n)


# ---------------------------------------------------------------------------
# The mistakes, redone from the problem


def coeffs(P):
    """Coefficients by ascending degree."""
    c = Poly(P, x).all_coeffs()[::-1]
    return c


def ruffini_zero(P):
    """The first zero among the lesson's candidates: divisors of the constant term by size (1 before -1), then fractions."""
    c = coeffs(P)
    a0, an = int(c[0]), int(c[-1])
    divs = lambda n: [d for d in range(1, abs(n) + 1) if n % d == 0]  # noqa: E731
    cands = []
    for d in divs(a0):
        cands += [Rational(d), Rational(-d)]
    fr = sorted({Rational(p, qq) for qq in divs(an) if qq > 1 for p in divs(a0) if Rational(p, qq).q > 1})
    for f in fr:
        cands += [f, -f]
    for i, z in enumerate(cands):
        if P.subs(x, z) == 0:
            return z, i + 1
    return None, len(cands)


def expected(tag, lvl, P, truth):
    c = coeffs(P)
    if lvl == 1:
        m = next(i for i, v in enumerate(c) if v != 0)
        Q = [c[m], c[m + 1], c[m + 2]]
        if tag == "dividi":
            return [v for v in truth if v != 0]
        if tag == "radice":
            if Q[1] != 0:
                raise ValueError("radice with a trinomial")
            return [S(0), -Q[0] / Q[2]]
        if tag == "positive":
            return [v for v in truth if v >= 0]
        if tag == "segno":
            return [S(0)] + [-v for v in truth if v != 0]
    if lvl == 2:
        lin, K = -c[2] / c[3], -c[1] / c[3]
        if tag == "dimentica":
            return [lin, sqrt(K)]
        if tag == "segno":
            return [-lin] + xroot(K, 2)
        if tag == "radice":
            return [lin, K, -K]
        if tag == "solo quadrato":
            return xroot(K, 2)
        if tag == "differenza":
            return [lin] + xroot(-K, 2)
        if tag == "nessuna":
            return []
    if lvl == 3:
        z, _ = ruffini_zero(P)
        Q = quo(Poly(P, x), Poly(x - z, x))
        qr = roots_real(Q.as_expr())
        a, b, cc = Q.all_coeffs()
        if tag == "segno":
            return [-z] + qr
        if tag == "quoziente":
            return [z]
        if tag == "segno quoziente":
            return [z] + [-r for r in qr]
        if tag == "nessuna":
            return []
        if tag == "delta assoluto":
            d = sqrt(-(b * b - 4 * a * cc))
            return [z, (-b - d) / (2 * a), (-b + d) / (2 * a)]
    if lvl == 4:
        n = len(c) - 1
        K = -c[0] / c[n]
        if tag == "solo positiva":
            return [positive_root(K, n)]
        if tag == "quadrata":
            return xroot(K, 2)
        if tag == "impossibile":
            return []
        if tag in ("assoluto", "pari"):
            return [-positive_root(K, n), positive_root(K, n)]
        if tag == "dispari":
            return [-positive_root(K, n)]
        if tag == "positiva":
            return [positive_root(K, n)]
        if tag == "segno":
            return [real_root(-K, n)]
    if lvl in (5, 6):
        n = lvl - 3
        ts = sorted(roots_real(x**2 + c[n] * x + c[0]), key=float)  # t^2 + b t + c, in the letter x
        if tag == "valori di t":
            return ts
        if lvl == 5:
            if tag == "assoluto":
                return [v for t in ts for v in xroot(abs(t), 2)]
            if tag == "solo positive":
                return [sqrt(abs(t)) for t in ts]
            if tag == "piu meno t":
                return [v for t in ts for v in (-t, t)]
        else:
            pos = [t for t in ts if t > 0]
            if tag == "scarta negativo":
                return [real_root(t, 3) for t in pos]
            if tag == "pari":
                return [v for t in pos for v in (-real_root(t, 3), real_root(t, 3))]
            if tag == "come biquadratica":
                return [v for t in pos for v in xroot(t, 2)]
            if tag == "segno":
                return [real_root(-t, 3) for t in ts]
    raise ValueError(f"unknown tag {tag!r} at level {lvl}")


# ---------------------------------------------------------------------------
# Equations (levels 1-6)


def classify(lvl, P, truth):
    """Level constraints and the form, from the polynomial alone."""
    errs = []
    c = coeffs(P)
    deg = len(c) - 1
    nz = [i for i, v in enumerate(c) if v != 0]
    kind = None
    if any(not v.is_integer for v in c) or c[-1] <= 0:
        errs.append("integer coefficients and a positive leading one")
    if lvl == 1:
        if c[0] != 0 or deg not in (3, 4) or nz[0] != deg - 2:
            errs.append("level 1: x or x^2 times a trinomial of degree two")
        elif len(truth) != 3 or not all(v.is_integer for v in truth):
            errs.append("level 1: three integer solutions")
        kind = "x^2 raccolto" if deg == 4 else ("trinomio" if c[2] != 0 else "differenza di quadrati")
    elif lvl == 2:
        if deg != 3 or c[0] == 0 or c[3] * c[0] != c[2] * c[1]:
            errs.append("level 2: degree three, a partial grouping")
        else:
            K = -c[1] / c[3]
            kind = "differenza di quadrati" if K > 0 else "somma di quadrati"
            if len(truth) != (3 if K > 0 else 1) or not all(v.is_rational for v in truth):
                errs.append("level 2: rational solutions, three or one")
    elif lvl == 3:
        if deg != 3 or c[0] == 0 or c[3] * c[0] == c[2] * c[1]:
            errs.append("level 3: degree three, no grouping")
        z, tried = ruffini_zero(P)
        if z is None or not z.is_integer or tried > 6:
            errs.append("level 3: an integer zero among the first six candidates")
        else:
            Q = quo(Poly(P, x), Poly(x - z, x))
            a, b, cc = Q.all_coeffs()
            if b * b - 4 * a * cc < 0:
                kind = "quoziente senza soluzioni"
                if len(truth) != 1:
                    errs.append("level 3: one solution")
            else:
                kind = "quoziente con due soluzioni"
                if len(truth) != 3 or not all(v.is_rational for v in truth):
                    errs.append("level 3: three rational solutions")
    elif lvl == 4:
        if len(nz) != 2 or nz[0] != 0 or deg < 3:
            errs.append("level 4: a x^n + b with n >= 3")
        else:
            K = -c[0] / c[deg]
            perfect = all(root(abs(v), deg).is_rational for v in (K.p, K.q))
            if deg % 2 == 0 and K < 0:
                kind = "pari negativo"
                if truth:
                    errs.append("even exponent and negative right-hand side: S must be empty")
            elif perfect:
                kind = "pari positivo" if deg % 2 == 0 else "dispari"
            else:
                kind = "irrazionale"
            if len(truth) != (0 if deg % 2 == 0 and K < 0 else 2 if deg % 2 == 0 else 1):
                errs.append("level 4: the number of solutions of the table")
    elif lvl in (5, 6):
        n = lvl - 3
        if nz != [0, n, 2 * n] or c[-1] != 1:
            errs.append(f"level {lvl}: x^{2 * n} + b x^{n} + c")
        else:
            ts = roots_real(x**2 + c[n] * x + c[0])
            if len(ts) != 2 or not all(t.is_integer for t in ts):
                errs.append(f"level {lvl}: two distinct integer values of t")
            else:
                t1, t2 = sorted(ts)
                if lvl == 5:
                    if t1 > 0:
                        kind = "quattro soluzioni intere" if all(sqrt(t).is_integer for t in ts) else "soluzioni irrazionali"
                    else:
                        kind = "t di segno opposto" if t2 > 0 else "t negativi"
                else:
                    kind = "t positivi" if t1 > 0 else "t di segno opposto" if t2 > 0 else "t negativi"
    return errs, kind


def check_equation(sample, lvl, P):
    errs = []
    truth = roots_real(P)
    ans = sample["answer"]
    if ans.get("kind") != "set":
        return ["answer must be a set"], None
    vals = [value(v) for v in ans["values"]]
    if not distinct(vals) or not same_numbers(vals, truth):
        errs.append(f"answer {ans['values']} != {truth}")
    if [float(v) for v in vals] != sorted(float(v) for v in vals):
        errs.append("answer values not ascending")
    shown, style = read_solution_set(ans["latex"])
    errs += style
    if not same_numbers(shown, vals) or len(shown) != len(vals):
        errs.append(f"answer latex {ans['latex']!r} != values")
    if sample["solution"] != ans["latex"]:
        errs.append("solution differs from the answer")
    if not sample.get("steps") or sample["steps"][-1] != ans["latex"]:
        errs.append("the last step is not S")
    e2, kind = classify(lvl, P, truth)
    errs += e2

    # multiple choice: the answer and the three distractors, each the mistake it names
    ds = sample["params"].get("distractors", [])
    if len(ds) != 3:
        errs.append("three distractors")
    for d in ds:
        dv = [value(v) for v in d["values"]]
        got, style = read_solution_set(d["latex"])
        errs += style
        if not distinct(dv) or not same_numbers(got, dv):
            errs.append(f"distractor latex {d['latex']!r} != values {d['values']}")
        if same_numbers(dv, truth):
            errs.append(f"distractor {d['tag']!r} equals the answer")
        if d["tag"] != "altro":
            try:
                want = expected(d["tag"], lvl, P, truth)
            except (ValueError, StopIteration, IndexError) as e:
                errs.append(f"distractor {d['tag']!r} cannot be redone at level {lvl}: {e}")
                continue
            uniq = []
            for w in want:
                if not any(eqn(w, u) for u in uniq):
                    uniq.append(w)
            if not same_numbers(dv, uniq):
                errs.append(f"distractor {d['tag']!r} is not that mistake: {d['values']} vs {uniq}")
    sets = [[value(v) for v in ans["values"]]] + [[value(v) for v in d["values"]] for d in ds]
    for i in range(len(sets)):
        for j in range(i):
            if same_numbers(sets[i], sets[j]):
                errs.append(f"options {j} and {i} are the same set")
    ch = sample.get("choice")
    if not ch or len(ch["options"]) != 4:
        errs.append("the multiple choice needs four options")
    else:
        right = []
        for i, o in enumerate(ch["options"]):
            ov = [value(v) for v in o["values"]]
            got, style = read_solution_set(o["latex"])
            errs += style
            if not same_numbers(got, ov):
                errs.append(f"choice option {o['latex']!r} != values")
            if same_numbers(ov, truth):
                right.append(i)
            if not any(same_numbers(ov, s) for s in sets):
                errs.append(f"choice option {o['latex']!r} is neither the answer nor a distractor")
        if right != [ch.get("correct")]:
            errs.append(f"right choice options {right}, correct = {ch.get('correct')}")
    return errs, kind


# ---------------------------------------------------------------------------
# Inequalities (level 7)


def read_option(tex):
    m = re.fullmatch(r"\\begin\{gathered\} (S = .+) \\\\ \\cup (.+) \\end\{gathered\}", tex)
    if m:
        first, last = m.group(1), m.group(2)
        pieces, errs = read_set(f"{first} \\cup {last}")
        if len(pieces) < 3:
            errs.append(f"two lines for fewer than three intervals: {tex!r}")
        return pieces, errs
    pieces, errs = read_set(tex)
    if len(pieces) >= 3 and not all(lo == hi for lo, hi, _, _ in pieces):
        errs.append(f"three intervals on one line: {tex!r}")
    return pieces, errs


def check_inequality(sample, P, op):
    errs = []
    c = coeffs(P)
    deg = len(c) - 1
    zs = roots_real(P)
    kind = None
    if deg == 3:
        kind = "terzo grado"
        if len(zs) != 3 or not all(z.is_integer for z in zs):
            errs.append("level 7: three distinct integer zeros")
    elif deg == 4:
        kind = "biquadratica"
        if c[1] != 0 or c[3] != 0 or c[4] != 1:
            errs.append("level 7: x^4 + b x^2 + c")
        ts = roots_real(x**2 + c[2] * x + c[0])
        if len(ts) != 2 or not all(t.is_integer for t in ts) or not any(t > 0 and sqrt(t).is_integer for t in ts):
            errs.append("level 7: integer values of t, one a positive square")
    else:
        errs.append(f"level 7: degree {deg}")
    truth = solve(P, op)
    tpieces = pieces_of(P, op)
    for lo, hi, lc, hc in tpieces:
        for e, closed in ((lo, lc), (hi, hc)):
            if e.is_finite and closed != (op in LARGE):
                errs.append("an end included or excluded against the sign")
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["answer must be a choice"], kind
    opts, tags = ans["options"], sample["params"].get("optionTags", [])
    if len(opts) != 4 or len(tags) != 4:
        errs.append("four options with their tags")
    raws, sets = [], []
    for o in opts:
        val = from_values(o["values"])
        shown, style = read_option(o["latex"])
        errs += style
        if not same_pieces(val, shown):
            errs.append(f"option latex {o['latex']!r} != values {o['values']}")
        raws.append(val)
        sets.append(to_set(val))
    for i in range(len(sets)):
        for j in range(i):
            if same(sets[i], sets[j]):
                errs.append(f"options {j} and {i} are the same set")
    right = [i for i, s in enumerate(sets) if same(s, truth)]
    if right != [ans.get("correct")]:
        errs.append(f"right options {right}, correct = {ans.get('correct')}")
    elif not same_pieces(raws[ans["correct"]], tpieces):
        errs.append("the right option is not written as the ordered intervals")
    from sympy import EmptySet, FiniteSet

    for i, (t, s) in enumerate(zip(tags, sets)):
        if i == ans.get("correct"):
            if t != "giusta":
                errs.append(f"correct option tagged {t!r}")
            continue
        if t == "scambiati":
            want = solve(P, FLIP[op])
        elif t == "estremi":
            want = solve(P, TOGGLE[op])
        elif t == "scambiati ed estremi":
            want = solve(P, TOGGLE[FLIP[op]])
        elif t == "equazione":
            want = FiniteSet(*zs)
        elif t == "t" and deg == 4:
            # the values of t read as values of x: t^2 + b t + c op 0 in the letter x
            want = solve(x**2 + c[2] * x + c[0], op)
        else:
            errs.append(f"option {i}: unknown tag {t!r}")
            continue
        if not same(s, want):
            errs.append(f"option {i} tagged {t!r} is not that mistake")
        if s == EmptySet or s == S.Reals:
            errs.append(f"option {i} is empty or all of R")
    try:
        sol, style = read_option(sample["solution"])
        errs += style
        if not same_pieces(sol, tpieces):
            errs.append("solution differs from the truth")
        last = sample["steps"][-1]
        if not same(to_set(read_inequalities(last)[0]), truth):
            errs.append("last step is not the solution")
    except (ValueError, IndexError) as e:
        errs.append(f"solution or last step unreadable: {e}")
    return errs, kind


# ---------------------------------------------------------------------------


def check(sample):
    lvl = sample["level"]
    tex = sample["problem"]
    errs = [f"forbidden pattern {rx} in {tex!r}" for rx in FORBIDDEN if re.search(rx, tex)]
    if lvl == 7:
        parts = re.split(r" (<|>|\\leq|\\geq) ", tex)
        if len(parts) != 3:
            return [f"not one inequality: {tex!r}"], None
        lhs, op, rhs = parts
        P = (poly_expr(lhs) - poly_expr(rhs)).expand()
        e, kind = check_inequality(sample, P, op)
    elif lvl in range(1, 7):
        parts = tex.split(" = ")
        if len(parts) != 2:
            return [f"not one equation: {tex!r}"], None
        P = (poly_expr(parts[0]) - poly_expr(parts[1])).expand()
        if Poly(P, x).LC() < 0:
            P = -P
        e, kind = check_equation(sample, lvl, P)
    else:
        return [f"unknown level {lvl}"], None
    if not sample.get("steps"):
        e.append("no steps")
    return errs + e, kind


__all__ = ["check", "CASE_RANGES", "OPPURE", "OPS"]
