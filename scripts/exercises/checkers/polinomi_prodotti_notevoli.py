"""Checker for polinomi-prodotti-notevoli, from specs/exercises/polinomi-prodotti-notevoli.md.

Written from the spec, not from the generator. The product is read back from the problem LaTeX
(two factors for the sum times difference, a bracket raised to a power otherwise), expanded with
SymPy and compared with the answer. The answer must be expanded, reduced and ordered by decreasing
powers of the first letter in alphabetical order (then of the next letter). The level and its case
are recognised from the text, and at least two of the three distractors must be the expansion that
one of the mistakes named in the lesson gives."""
import re
from itertools import combinations

from sympy import Integer, Rational, binomial, expand

from checkers.monomi_common import (
    ParseError,
    check_choice,
    check_steps,
    forbidden,
    mono_parts,
    parse,
    poly_normal_form_errors,
    same,
    val,
)
from checkers.monomi_common import SYMS

PROMPT = "Sviluppa il prodotto notevole."

CASE_RANGES = {
    2: {"termine uguale primo": (0.35, 0.55), "termine uguale negativo": (0.15, 0.35), "termine uguale secondo": (0.2, 0.4)},
    3: {"somma": (0.25, 0.45), "differenza": (0.25, 0.45), "numero primo": (0.08, 0.22), "due negativi": (0.08, 0.22)},
    4: {"interi": (0.5, 0.7), "frazione": (0.3, 0.5)},
    5: {"tre termini diversi": (0.3, 0.5), "termini simili": (0.25, 0.45), "frazione": (0.15, 0.35)},
    6: {"con un numero": (0.3, 0.5), "due lettere": (0.15, 0.35), "segni": (0.12, 0.28), "frazione": (0.08, 0.22)},
    7: {"con un numero": (0.45, 0.65), "due lettere": (0.2, 0.4), "numero primo": (0.08, 0.22)},
}

PAREN = r"(?:\([^()]*\)|\\left\((?:(?!\\right\)).)*\\right\))"


def inner(par):
    if par.startswith("\\left("):
        return par[len("\\left(") : -len("\\right)")]
    return par[1:-1]


def split_terms(latex):
    """Signed terms of a sum written with folded signs: "2x - 3" -> [2*x, -3]."""
    parts = re.split(r"\s([+-])\s", latex.strip())
    raw = [parts[0]] + [("-" if parts[i] == "-" else "") + parts[i + 1] for i in range(1, len(parts), 2)]
    return [parse(t) for t in raw]


def parts(t):
    p = mono_parts(t)
    if p is None:
        raise ParseError(f"not a monomial: {t}")
    return p


def lit_of(t):
    c, e = parts(t)
    out = Integer(1)
    for v, k in e.items():
        out *= SYMS[v] ** k
    return c, out


def nocoef_pow(t, k):
    """t^k with only the letters raised, the coefficient left as it is (the lesson's warning)."""
    if k == 0:
        return Integer(1)
    c, L = lit_of(t)
    return c * L**k


def is_number(t):
    return parts(t)[1] == {}


def has_frac(ts):
    return any(parts(t)[0].q != 1 for t in ts)


def plain_letter(t):
    """±v: coefficient ±1, one letter with exponent 1."""
    c, e = parts(t)
    return abs(c) == 1 and len(e) == 1 and list(e.values()) == [1]


def terms_of(e):
    """Nonzero monomials of an expanded polynomial."""
    e = expand(e)
    return list(e.as_ordered_terms()) if e != 0 else []


def order_errors(latex, truth):
    """The terms as written: exponent vectors (letters in alphabetical order) strictly decreasing."""
    letters = sorted({s.name for s in truth.free_symbols})
    try:
        ts = split_terms(latex)
    except ParseError as e:
        return [f"answer does not split into terms ({e})"]
    vecs = []
    for t in ts:
        p = mono_parts(t)
        if p is None:
            return [f"answer term is not a monomial: {t}"]
        vecs.append(tuple(p[1].get(v, 0) for v in letters))
    if any(a <= b for a, b in zip(vecs, vecs[1:])):
        return [f"answer not ordered by decreasing powers: {latex}"]
    return []


def mistakes(kind, ts, n):
    """Expansions given by the mistakes the lesson names, recomputed here from the terms."""
    out = []
    if kind == "sd":
        A, B = ts
        out += [B**2 - A**2, A**2 + B**2, nocoef_pow(A, 2) - nocoef_pow(B, 2), A**2 - 2 * A * B + B**2]
    elif kind == "sq":
        A, B = ts
        out += [A**2 + B**2, nocoef_pow(A, 2) + 2 * A * B + nocoef_pow(B, 2), A**2 - 2 * A * B + B**2, A**2 - B**2, A**2 + A * B + B**2]
    elif kind == "tri":
        A, B, C = ts
        sq = A**2 + B**2 + C**2
        out += [
            sq + 2 * A * B + 2 * A * C,
            sq + 2 * A * B + 2 * B * C,
            sq + 2 * A * C + 2 * B * C,
            sq,
            sq + 2 * A * B + 2 * A * C - 2 * B * C,
            sq - 2 * A * B + 2 * A * C + 2 * B * C,
            sq + 2 * A * B - 2 * A * C + 2 * B * C,
            nocoef_pow(A, 2) + nocoef_pow(B, 2) + nocoef_pow(C, 2) + 2 * (A * B + A * C + B * C),
            sq + A * B + A * C + B * C,
        ]
    else:
        A, B = ts
        right = [binomial(n, k) * A ** (n - k) * B**k for k in range(n + 1)]
        sB = 1 if parts(B)[0] > 0 else -1
        out += [
            A**n + B**n,
            -sum(right),
            right[0] + sB * sum(abs(parts(expand(t))[0]) * lit_of(expand(t))[1] for t in right[1:]),
            sum(binomial(n, k) * nocoef_pow(A, n - k) * nocoef_pow(B, k) for k in range(n + 1)),
            sum(A ** (n - k) * B**k for k in range(n + 1)),
            sum(binomial(n, k) * A ** (n - k) * B ** min(k, 1) for k in range(n + 1)),
        ]
    return [expand(m) for m in out]


def classify(lvl, kind, ts, n, same_first, same_term):
    """The case of the level, read from the terms as written. Returns (case, errors)."""
    errs = []
    if lvl == 1:
        A = same_term
        c, e = parts(A)
        B = [t for t in ts if not same(t, A)][0]
        if not (same_first and c.q == 1 and 1 <= c <= 5 and len(e) == 1 and list(e.values()) == [1]):
            errs.append("level 1: equal term kx first, k from 1 to 5")
        if not (is_number(B) and parts(B)[0].q == 1 and 1 <= abs(parts(B)[0]) <= 12):
            errs.append("level 1: the term that changes sign is an integer from 1 to 12")
        return ("lettera" if c == 1 else "coefficiente"), errs
    if lvl == 2:
        if all(plain_letter(t) for t in ts):
            errs.append("level 2: something more than ±x and ±y")
        if not same_first:
            return "termine uguale secondo", errs
        return ("termine uguale negativo" if parts(same_term)[0] < 0 else "termine uguale primo"), errs
    if lvl == 3:
        nums = [t for t in ts if is_number(t)]
        mons = [t for t in ts if not is_number(t)]
        if len(nums) != 1 or len(mons) != 1:
            return None, ["level 3: a monomial and a number"]
        N, M = nums[0], mons[0]
        c, e = parts(M)
        if not (c.q == 1 and 1 <= abs(c) <= 4 and len(e) == 1 and list(e.values()) == [1]):
            errs.append("level 3: the monomial is kx, k from 1 to 4")
        if not (parts(N)[0].q == 1 and 1 <= abs(parts(N)[0]) <= 9):
            errs.append("level 3: the number is an integer from 1 to 9")
        sM, sN = parts(M)[0] > 0, parts(N)[0] > 0
        if is_number(ts[0]):
            if not (sN and not sM):
                errs.append("level 3: number first only as (n - kx)")
            return "numero primo", errs
        if sM:
            return ("somma" if sN else "differenza"), errs
        if sN:
            errs.append("level 3: (-kx + n) not expected")
        return "due negativi", errs
    if lvl == 4:
        if all(is_number(t) for t in ts):
            errs.append("level 4: at least one letter")
        if all(plain_letter(t) or (is_number(t) and parts(t)[0].q == 1) for t in ts):
            errs.append("level 4: two monomials, not (x ± y)^2 or (x ± n)^2")
        return ("frazione" if has_frac(ts) else "interi"), errs
    if lvl == 5:
        if has_frac(ts):
            return "frazione", errs
        prods = [t * t for t in ts] + [a * b for a, b in combinations(ts, 2)]
        lits = [lit_of(expand(p))[1] for p in prods]
        return ("termini simili" if len(set(lits)) < len(lits) else "tre termini diversi"), errs
    if lvl == 6:
        if has_frac(ts):
            return "frazione", errs
        if all(not is_number(t) for t in ts):
            return "due lettere", errs
        if is_number(ts[0]) or all(parts(t)[0] < 0 for t in ts):
            return "segni", errs
        if parts(ts[0])[0] < 0:
            errs.append("level 6: (-kx + n) not expected")
        return "con un numero", errs
    if lvl == 7:
        if has_frac(ts):
            errs.append("level 7: no fractions")
        if all(not is_number(t) for t in ts):
            return "due lettere", errs
        if is_number(ts[0]):
            return "numero primo", errs
        return "con un numero", errs
    return None, [f"unknown level {lvl}"]


GATHERED = re.compile(r"\\begin\{gathered\}(.*)\\end\{gathered\}", re.S)


def unwrap(latex):
    """An option on more lines -> (the same polynomial on one line, errors about the lines)."""
    m = GATHERED.fullmatch(latex.strip())
    if not m:
        if "gathered" in latex or "\\\\" in latex:
            return latex, [f"malformed multi-line option: {latex}"]
        return latex, []
    lines = [ln.strip() for ln in m.group(1).split("\\\\")]
    errs = []
    if not 2 <= len(lines) <= 3 or any(not ln for ln in lines):
        errs.append(f"multi-line option must have 2 or 3 non-empty lines: {latex}")
    if any(not re.match(r"[+-] ", ln) for ln in lines[1:]):
        errs.append(f"a new line must start with + or - of the sum: {latex}")
    return " ".join(lines), errs


LEVEL_KIND = {1: ("sd", {2}), 2: ("sd", {2}), 3: ("sq", {2}), 4: ("sq", {2}), 5: ("tri", {2}), 6: ("cube", {3}), 7: ("pow", {4, 5, 6})}


def check(sample):
    errs = []
    lvl = sample["level"]
    prob = sample["problem"]
    errs += forbidden(prob)
    if sample.get("prompt") != PROMPT:
        errs.append(f"prompt {sample.get('prompt')!r}")
    if lvl not in LEVEL_KIND:
        return [f"unknown level {lvl}"], None
    want_kind, want_n = LEVEL_KIND[lvl]

    same_first, same_term = True, None
    m_sd = re.fullmatch(rf"({PAREN})({PAREN})", prob)
    m_pw = re.fullmatch(rf"({PAREN})\^(\d)", prob)
    try:
        if m_sd:
            kind, n = "sd", 2
            f1, f2 = split_terms(inner(m_sd.group(1))), split_terms(inner(m_sd.group(2)))
            if len(f1) != 2 or len(f2) != 2:
                return [f"sum times difference: two binomials expected: {prob}"], None
            # one term equal in both factors, the other opposite
            found = None
            for i in range(2):
                for j in range(2):
                    if same(f1[i], f2[j]) and same(f1[1 - i], -f2[1 - j]):
                        found = (i, j)
            if found is None:
                return [f"not a sum times difference: {prob}"], None
            i, j = found
            same_term, change = f1[i], f1[1 - i]
            same_first = i == 0 and j == 0
            ts = [same_term, change]
        elif m_pw:
            n = int(m_pw.group(2))
            ts = split_terms(inner(m_pw.group(1)))
            kind = {2: "sq" if len(ts) == 2 else "tri", 3: "cube"}.get(n, "pow")
            if len(ts) != (3 if kind == "tri" else 2):
                return [f"wrong number of terms in {prob}"], None
        else:
            return [f"problem is neither (A)(B) nor (A)^n: {prob}"], None
        for t in ts:
            parts(t)
        truth = expand(parse(prob))
    except ParseError as e:
        return [f"problem does not parse ({e}): {prob}"], None

    if kind != want_kind or n not in want_n:
        errs.append(f"level {lvl}: expected {want_kind} with n in {want_n}, got {kind}^{n}")
    lits = [lit_of(t)[1] for t in ts]
    if len(set(lits)) != len(lits):
        errs.append(f"similar terms inside the bracket: {prob}")
    for t in ts:
        c, e = parts(t)
        if abs(c.p) > 12 or c.q > 4 or max(e.values(), default=0) > 3:
            errs.append(f"term out of range: {t}")

    case, cerrs = classify(lvl, kind, ts, n, same_first, same_term)
    errs += cerrs
    if case is not None and sample.get("params", {}).get("case") != case:
        errs.append(f"params.case {sample.get('params', {}).get('case')!r} != {case!r}")

    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "expanded":
        return errs + ["answer must be an expanded expression"], case
    if not same(val(ans["value"]), truth):
        errs.append(f"answer value {ans['value']} != {truth}")
    try:
        if not same(parse(ans["latex"]), truth):
            errs.append(f"answer latex {ans['latex']} != {truth}")
    except ParseError as e:
        errs.append(f"answer latex does not parse ({e})")
    errs += forbidden(ans["latex"], "answer")
    errs += poly_normal_form_errors(ans["latex"])
    errs += order_errors(ans["latex"], truth)
    if sample.get("solution") != ans["latex"]:
        errs.append("solution differs from the answer")
    for t in terms_of(truth):
        c, e = parts(t)
        if abs(c.p) > 250 or c.q > 81 or max(e.values(), default=0) > 12:
            errs.append(f"result term out of range: {t}")

    errs += check_steps(sample)
    # options may be broken on two or three lines (\\begin{gathered} ... \\\\ ... \\end{gathered}):
    # each line is checked for shape, then the lines are joined back and checked as one polynomial
    flat = dict(sample)
    ch = dict(sample.get("choice") or {})
    opts = []
    for o in ch.get("options", []):
        lt, lerrs = unwrap(o.get("latex", ""))
        errs += lerrs
        opts.append({**o, "latex": lt})
    ch["options"] = opts
    flat["choice"] = ch
    errs += check_choice(flat, truth)
    opts = ch.get("options", [])
    if len(opts) == 4:
        known = mistakes(kind, ts, n)
        hits = 0
        for k, o in enumerate(opts):
            if k == ch.get("correct"):
                continue
            v = val(o["values"][0])
            if any(same(v, m) for m in known):
                hits += 1
            try:
                errs += order_errors(o["latex"], expand(v))
            except Exception as e:  # noqa: BLE001
                errs.append(f"option order not checked ({e})")
        if hits < 2:
            errs.append(f"only {hits} distractors come from the named mistakes")
    return errs, case
