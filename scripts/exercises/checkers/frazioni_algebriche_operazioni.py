"""Checker for frazioni-algebriche-operazioni, from specs/exercises/frazioni-algebriche-operazioni.md
and lesson 48.

Written from the spec, not from the generator. The problem LaTeX (an aligned problem is put back
on one line) is parsed into an exact SymPy expression, and every fraction in it is read on its
own: the truth is the expression reduced with `cancel`, the conditions of existence are the roots
of every denominator and of the numerator of every fraction that follows ":" (the divisor). The
answer must have the same value and the lesson's form: sign in front, the denominator a product of
primitive irreducible factors over Z (a number and a power of x without parentheses first), the
numerator the same kind of product or an expanded polynomial, and no factor left to simplify
between them. The level shape and the case are recomputed from the text.
"""
import re

from sympy import Poly, Rational, cancel, degree, factor_list, fraction, gcd, lcm, roots, sympify, together

from checkers.monomi_common import (
    SYMS,
    ParseError,
    check_steps,
    forbidden,
    parse,
    parse_tokens,
    poly_normal_form_errors,
    tokenize,
)

x = SYMS["x"]
MAX_COEF = 60

PROMPT_CALC = "Calcola e semplifica il risultato."
PROMPT_CE = "Scrivi le condizioni di esistenza dell'espressione."

CASE_RANGES = {
    1: {"si semplifica": (0.45, 0.75), "non si semplifica": (0.25, 0.55)},
    2: {"numeratori numeri": (0.55, 0.85), "un numeratore con la x": (0.15, 0.45)},
    3: {
        "fattore comune, si semplifica": (0.10, 0.38),
        "fattore comune, non si semplifica": (0.10, 0.38),
        "fattori opposti, si semplifica": (0.10, 0.38),
        "fattori opposti, non si semplifica": (0.10, 0.38),
    },
    4: {"monomi": (0.15, 0.50), "fattori opposti": (0.20, 0.50), "trinomi": (0.15, 0.45)},
    5: {"risultato": (0.45, 0.75), "condizioni": (0.25, 0.55)},
    6: {"numeri": (0.35, 0.70), "quadrati": (0.30, 0.65)},
    7: {"si semplifica": (0.30, 0.70), "non si semplifica": (0.30, 0.70)},
}


def flatten(latex):
    """An aligned problem back on one line."""
    s = latex.strip()
    m = re.fullmatch(r"\\begin\{aligned\}(.*)\\end\{aligned\}", s, re.S)
    if m:
        s = m.group(1).replace("\\\\", " ").replace("&", " ")
    return s


def fractions_of(toks):
    """[(numerator tokens, denominator tokens, token before \\frac)] for every \\frac."""
    out = []
    i = 0
    while i < len(toks):
        if toks[i] != "\\frac":
            i += 1
            continue
        prev = toks[i - 1] if i > 0 else None
        parts = []
        j = i + 1
        for _ in range(2):
            if j >= len(toks) or toks[j] != "{":
                raise ParseError("\\frac without braces")
            depth, k = 0, j
            while True:
                if toks[k] == "{":
                    depth += 1
                elif toks[k] == "}":
                    depth -= 1
                    if depth == 0:
                        break
                k += 1
            parts.append(toks[j + 1 : k])
            j = k + 1
        out.append((parts[0], parts[1], prev))
        i = j
    return out


def poly(e):
    return Poly(e, x)


def rat_roots(e):
    """Rational roots of a polynomial in x, each once."""
    if not e.has(x):
        return set()
    return {r for r in roots(poly(e)) if r.is_rational}


def is_const(e):
    return not cancel(e).has(x)


def coprime(a, b):
    return is_const(gcd(poly(a), poly(b)).as_expr()) if a.has(x) and b.has(x) else True


def lc(e):
    return poly(e).LC() if e.has(x) else e


def is_monomial(e):
    return e.has(x) and len(poly(e).terms()) == 1


# ---------------------------------------------------------------------------
# The lesson's form of a result

_PROD = re.compile(r"^(\d*)(x(?:\^\d)?)?((?:\([^()]*\)(?:\^\d)?)*)$")
_GROUP = re.compile(r"\(([^()]*)\)(?:\^(\d))?")


def factor_errors(f, where):
    errs = []
    if not f.has(x):
        return [f"{where}: constant factor in parentheses"]
    c, lst = factor_list(f)
    if c != 1:
        errs.append(f"{where}: factor {f} not primitive with positive leading coefficient")
    if sum(k for _, k in lst) != 1:
        errs.append(f"{where}: factor {f} is not irreducible")
    if f == x:
        errs.append(f"{where}: x written in parentheses")
    return errs


def product_errors(s, where, allow_expanded=False):
    """A product in the lesson's form: "2x(x - 2)", "(x - 3)(x + 3)", "x + 1", "4x^2", "3".
    With allow_expanded, an expanded polynomial in normal form is also accepted (numerator)."""
    s = s.strip()
    if "(" not in s and re.search(r" [+-] ", s):
        e = parse(s)
        if not poly_normal_form_errors(s, where) and lc(e) > 0:
            c, lst = factor_list(e)
            if c == 1 and sum(k for _, k in lst) == 1:
                return []
            if allow_expanded:
                return []
        return [f"{where}: not a product of irreducible factors: {s}"]
    m = _PROD.fullmatch(s)
    if not m:
        return [f"{where}: not a product: {s}"]
    num, xp, groups = m.groups()
    errs = []
    if num in ("0", "1") and (xp or groups):
        errs.append(f"{where}: coefficient {num} written: {s}")
    if num.startswith("0"):
        errs.append(f"{where}: leading zero: {s}")
    if not (num or xp or groups):
        errs.append(f"{where}: empty")
    seen = set()
    for g, k in _GROUP.findall(groups):
        f = parse(g)
        errs += factor_errors(f, where)
        key = str(f.expand())
        if key in seen:
            errs.append(f"{where}: factor {g} repeated instead of a power")
        seen.add(key)
        if k == "1":
            errs.append(f"{where}: exponent 1")
    if xp and xp.endswith("^1"):
        errs.append(f"{where}: exponent 1")
    return errs


def form_errors(latex, where="answer"):
    """Sign in front, denominator factored, numerator factored or expanded, nothing to simplify."""
    s = latex.strip()
    neg = s.startswith("-")
    if neg:
        s = s[1:]
    m = re.fullmatch(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", s)
    if m:
        N, D = m.group(1), m.group(2)
    else:
        N, D = s, "1"
        if neg and s.startswith("(") and s.endswith(")") and s.count("(") == 1:
            N = s[1:-1]
    errs = product_errors(N, where + " numerator", allow_expanded=True)
    if D != "1":
        errs += product_errors(D, where + " denominator")
        if D.strip() == "1":
            errs.append(f"{where}: denominator 1")
    if errs:
        return errs
    n, d = parse(N), parse(D)
    if n.has(x) and lc(n) < 0:
        errs.append(f"{where}: minus sign inside the numerator")
    if n.has(x) and d.has(x) and not coprime(n, d):
        errs.append(f"{where}: numerator and denominator still have a common factor: {latex}")
    if not n.has(x) and not d.has(x) and d != 1:
        if Rational(n, d).q != d:
            errs.append(f"{where}: numbers not simplified: {latex}")
    if n.has(x) and d.has(x):
        cn = factor_list(n)[0]
        cd = factor_list(d)[0]
        if gcd(cn, cd) != 1:
            errs.append(f"{where}: numbers not simplified: {latex}")
    elif d.has(x) and gcd(n, factor_list(d)[0]) != 1:
        errs.append(f"{where}: numbers not simplified: {latex}")
    elif n.has(x) and d != 1 and gcd(factor_list(n)[0], d) != 1:
        errs.append(f"{where}: numbers not simplified: {latex}")
    return errs


def val(s):
    if not isinstance(s, str) or not re.fullmatch(r"[0-9x+\-*/() ]+", s):
        raise ValueError(f"not a simple expression string: {s!r}")
    return sympify(s, locals={"x": x})


def same(a, b):
    return cancel(together(a - b)) == 0


# ---------------------------------------------------------------------------
# Level shapes


def shape(level, fr, toks, prob, truth):
    """(errors, case) from the text alone."""
    errs = []
    nums = [parse_tokens(n) for n, _, _ in fr]
    dens = [parse_tokens(d) for _, d, _ in fr]
    written = ["(" not in "".join(d) for _, d, _ in fr]
    tden = fraction(truth)[1]
    case = None
    for n, d in zip(nums, dens):
        if level < 7 and n.has(x) and d.has(x) and not coprime(n, d):
            errs.append(f"a fraction of the text simplifies by itself: {n}/{d}")
        if not n.has(x) and n <= 0:
            errs.append("non-positive numeric numerator")
        if n.has(x) and lc(n) < 0:
            errs.append("numerator with a negative first term")
    ops = [t for t in toks if t in ("\\cdot", ":")]

    def lcm_deg():
        return degree(lcm(poly(dens[0]), poly(dens[1])).as_expr(), x)

    if level in (1, 2, 3):
        if len(fr) != 2 or ops:
            return errs + ["two fractions added or subtracted expected"], None
        if level == 1:
            if not same(dens[0], dens[1]) or degree(dens[0], x) != 1 or lc(dens[0]) != 1:
                errs.append("level 1: the same denominator x - a")
            if any(degree(n, x) != 1 for n in nums):
                errs.append("level 1: first-degree numerators")
            case = "si semplifica" if degree(tden, x) < 1 else "non si semplifica"
        elif level == 2:
            if any(degree(d, x) != 1 or lc(d) != 1 for d in dens) or same(dens[0], dens[1]):
                errs.append("level 2: two different denominators x - a")
            if any(degree(n, x) > 1 for n in nums):
                errs.append("level 2: numerators of degree 0 or 1")
            case = "numeratori numeri" if all(not n.has(x) for n in nums) else "un numeratore con la x"
        else:
            if not all(written):
                errs.append("level 3: denominators written expanded")
            if max(degree(d, x) for d in dens) != 2:
                errs.append("level 3: a second-degree denominator to factor")
            if coprime(dens[0], dens[1]):
                errs.append("level 3: the denominators share a factor")
            opp = any(lc(d) < 0 for d in dens)
            simp = degree(tden, x) < lcm_deg()
            case = f"{'fattori opposti' if opp else 'fattore comune'}, {'si semplifica' if simp else 'non si semplifica'}"
    elif level in (4, 5):
        want = "\\cdot" if level == 4 else ":"
        if len(fr) != 2 or ops != [want]:
            return errs + [f"level {level}: two fractions and {want}"], None
        A, C = nums
        B, D = dens
        if level == 4:
            if coprime(A, D) and coprime(C, B):
                errs.append("level 4: nothing to simplify crosswise")
            if lc(B) < 0 or lc(D) < 0:
                case = "fattori opposti"
            elif (B.has(x) and is_monomial(B)) or (C.has(x) and is_monomial(C)):
                case = "monomi"
            else:
                case = "trinomi"
        else:
            if not C.has(x):
                errs.append("level 5: the divisor's numerator must contain x")
            if coprime(A, C) and coprime(D, B):
                errs.append("level 5: nothing to simplify after the reciprocal")
    elif level == 6:
        if not prob.startswith("\\left(") or len(fr) != 3 or ops != [":"]:
            return errs + ["level 6: (a/b ± c/d) : e/f"], None
        if not all(degree(d, x) == 1 for d in dens[:2]) or same(dens[0], dens[1]):
            errs.append("level 6: two different first-degree denominators in the bracket")
        case = "quadrati" if all(n.has(x) for n in nums[:2]) else "numeri"
        if case == "numeri" and any(n.has(x) for n in nums[:2]):
            errs.append("level 6: numbers or binomials in the bracket")
    elif level == 7:
        if not re.search(r"\\right\)\^2 : \\frac", prob) or len(fr) != 3 or ops != [":"] or fr[2][2] not in ("+", "-"):
            return errs + ["level 7: (1 ± c/(x - b))^2 : P/Q ± k/W"], None
        if lc(dens[2]) >= 0:
            errs.append("level 7: the last denominator is written as an opposite")
        case = "si semplifica" if degree(tden, x) < 2 else "non si semplifica"
    else:
        errs.append(f"unknown level {level}")
    return errs, case


CE_RE = re.compile(r"x \\neq (-?\\frac\{\d+\}\{\d+\}|-?\d+)")


def ce_value(s):
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", s)
    if m:
        v = Rational(int(m.group(2)), int(m.group(3)))
        return -v if m.group(1) else v
    return Rational(int(s))


def check(sample):
    errs = []
    lvl = sample["level"]
    prob = sample["problem"]
    errs += forbidden(prob)
    flat = flatten(prob)
    try:
        toks = tokenize(flat)
        expr = parse_tokens(toks)
        fr = fractions_of(toks)
    except ParseError as ex:
        return [f"problem does not parse ({ex})"], None
    for n in re.findall(r"\d+", flat):
        if int(n) > MAX_COEF:
            errs.append(f"number {n} over {MAX_COEF}")
    truth = cancel(together(expr))
    if truth == 0:
        errs.append("result 0")

    ce = set()
    for n, d, prev in fr:
        ce |= rat_roots(parse_tokens(d))
        if prev == ":":
            ce |= rat_roots(parse_tokens(n))
    if not ce:
        errs.append("no conditions of existence")

    serrs, case = shape(lvl, fr, toks, flat, truth)
    errs += serrs
    ask_ce = sample["answer"].get("kind") == "choice"
    if lvl == 5:
        case = "condizioni" if ask_ce else "risultato"
    elif ask_ce:
        errs.append("C.E. question outside level 5")
    if sample["params"].get("case") != case:
        errs.append(f"params.case {sample['params'].get('case')!r}, the text is {case!r}")

    # conditions of existence written in the solution
    sol = sample.get("solution", "")
    found = [ce_value(v) for v in CE_RE.findall(sol)]
    if "C.E." not in sol or set(found) != ce or len(found) != len(ce):
        errs.append(f"solution C.E. {found} != {sorted(ce)}")

    want_prompt = PROMPT_CE if ask_ce else PROMPT_CALC
    if sample.get("prompt") != want_prompt:
        errs.append(f"prompt {sample.get('prompt')!r}")

    if ask_ce:
        errs += check_ce_choice(sample, ce)
        if sample.get("choice") != sample["answer"]:
            errs.append("the choice of a C.E. question must be the answer itself")
    else:
        ans = sample["answer"]
        if ans.get("kind") != "expression" or ans.get("form") != "factored":
            errs.append("answer must be an expression with form 'factored'")
        else:
            if not same(val(ans["value"]), truth):
                errs.append(f"answer value {ans['value']} != {truth}")
            try:
                if not same(parse(ans["latex"]), truth):
                    errs.append(f"answer latex {ans['latex']} != {truth}")
                errs += form_errors(ans["latex"])
            except ParseError as ex:
                errs.append(f"answer latex does not parse ({ex})")
            errs += forbidden(ans["latex"], "answer")
            if ans["latex"] not in sol:
                errs.append("the solution does not show the result")
        errs += check_choice(sample, truth)
    errs += check_steps(sample)
    return errs, case


def check_choice(sample, truth):
    errs = []
    ch = sample.get("choice")
    if ch is None:
        return ["no choice variant"]
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"choice has {len(opts)} options, expected 4")
    vals = []
    for o in opts:
        lt = o.get("latex", "")
        if len(o.get("values", [])) != 1:
            errs.append(f"option without exactly one value: {o}")
            return errs
        v = val(o["values"][0])
        vals.append(v)
        errs += forbidden(lt, "option")
        try:
            if not same(parse(lt), v):
                errs.append(f"option latex {lt} != value {o['values'][0]}")
            errs += form_errors(lt, "option")
        except ParseError as ex:
            errs.append(f"option does not parse ({ex}): {lt}")
    for i in range(len(vals)):
        for j in range(i + 1, len(vals)):
            if same(vals[i], vals[j]):
                errs.append(f"options {i} and {j} have the same value")
    right = [i for i, v in enumerate(vals) if same(v, truth)]
    if len(right) != 1:
        errs.append(f"{len(right)} options equal the result")
    elif ch.get("correct") != right[0]:
        errs.append(f"choice.correct {ch.get('correct')} but the right option is {right[0]}")
    return errs


def ce_latex(vs):
    def one(v):
        if v.q == 1:
            return str(v.p)
        return f"{'-' if v < 0 else ''}\\frac{{{abs(v.p)}}}{{{v.q}}}"

    return ",\\ ".join(f"x \\neq {one(v)}" for v in sorted(vs))


def check_ce_choice(sample, ce):
    errs = []
    ch = sample["answer"]
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"choice has {len(opts)} options, expected 4")
    sets = []
    for o in opts:
        vs = [Rational(v) for v in o.get("values", [])]
        if not vs or len(set(vs)) != len(vs):
            errs.append(f"C.E. option with no or repeated values: {o}")
        sets.append(frozenset(vs))
        if o.get("latex") != ce_latex(vs):
            errs.append(f"C.E. option latex {o.get('latex')!r} != values {vs}")
    if len(set(sets)) != len(sets):
        errs.append("C.E. options not distinct")
    right = [i for i, s in enumerate(sets) if s == frozenset(ce)]
    if len(right) != 1:
        errs.append(f"{len(right)} C.E. options are right")
    elif ch.get("correct") != right[0]:
        errs.append(f"choice.correct {ch.get('correct')} but the right C.E. option is {right[0]}")
    return errs
