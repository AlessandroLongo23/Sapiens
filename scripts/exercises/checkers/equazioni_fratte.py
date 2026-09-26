"""Checker for equazioni-fratte, written from specs/exercises/equazioni-fratte.md.

It reads the equation from the LaTeX of the problem (which must fit on one line), checks
that params describe the same terms, finds the excluded values from the written denominators, solves the
equation on its own (multiplying by the product of the denominators and discarding the excluded values)
and classifies it by the integer equation obtained with the MCM, as the lesson does. Then the answer, the
multiple choice (level 6 answers with it), the C.E. and the last line of the steps, the constraints of each
level and the share of each case at level 6.
"""
import re

from sympy import Poly, Rational, cancel, expand, factor_list, gcd, lcm, roots, sympify

from verify import FORBIDDEN, x

# Level 6: share of each case (spec: 3/10, 2/10, 1/4, 1/4), with slack.
CASE_RANGES = {6: {"non accettabile": (0.22, 0.38), "impossibile": (0.13, 0.27), "indeterminata": (0.18, 0.32), "zero": (0.18, 0.32)}}

ALIGNED = re.compile(r"\\begin\{aligned\} &(.*) \\\\ &= (.*) \\end\{aligned\}")
POLY = re.compile(r"-?(?:\d*x(?:\^\d)?|\d+)(?: [+-] (?:\d*x(?:\^\d)?|\d+))*")


def poly_of(s):
    """A polynomial as the generator writes it (2x - 5, x^2 - 4, 3 - x) to SymPy; anything else raises."""
    s = s.strip()
    if not POLY.fullmatch(s):
        raise ValueError(f"not a polynomial: {s!r}")
    t = re.sub(r"(\d)x", r"\1*x", s).replace("^", "**")
    return expand(sympify(t, locals={"x": x}))


def split_top(s):
    """Signed terms of a side, split at + and - outside braces: [(sign, text)]."""
    out, depth, cur, sign, i = [], 0, "", 1, 0
    s = s.strip()
    if s.startswith("-"):
        sign, s = -1, s[1:]
    while i < len(s):
        c = s[i]
        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        if depth == 0 and s[i : i + 3] in (" + ", " - "):
            out.append((sign, cur))
            sign, cur = (1 if s[i + 1] == "+" else -1), ""
            i += 3
            continue
        cur += c
        i += 1
    out.append((sign, cur))
    return out


FRAC = re.compile(r"\\frac\{([^{}]*)\}\{([^{}]*)\}")


def parse_side(s):
    """[(sign, numerator, denominator or None, denominator text)]"""
    terms = []
    for sign, t in split_top(s):
        m = FRAC.fullmatch(t)
        if m:
            terms.append((sign, poly_of(m.group(1)), poly_of(m.group(2)), m.group(2)))
        else:
            terms.append((sign, poly_of(t), None, None))
    return terms


def parse_problem(tex):
    m = ALIGNED.fullmatch(tex)
    if m:
        return parse_side(m.group(1)), parse_side(m.group(2)), True
    parts = tex.split(" = ")
    if len(parts) != 2:
        raise ValueError(f"not an equation: {tex!r}")
    return parse_side(parts[0]), parse_side(parts[1]), False


def value(t):
    t = t.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        return Rational(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    if re.fullmatch(r"-?\d+", t):
        return Rational(int(t))
    raise ValueError(f"unreadable value {t!r}")


def read_answer(latex):
    """An answer as written: ('set', values) / ('R', excluded values)."""
    if latex == r"S = \emptyset":
        return ("set", ())
    if latex == r"S = \mathbb{R}":
        return ("R", ())
    m = re.fullmatch(r"S = \\mathbb\{R\} \\setminus \\left\\\{ (.*) \\right\\\}", latex)
    if m:
        return ("R", tuple(value(v) for v in m.group(1).split(", ")))
    m = re.fullmatch(r"S = \\left\\\{ (.*) \\right\\\}", latex)
    if m:
        return ("set", tuple(value(v) for v in m.group(1).split(", ")))
    raise ValueError(f"unreadable answer {latex!r}")


def from_values(vals):
    if vals and vals[0] == "R":
        return ("R", tuple(Rational(v) for v in vals[1:]))
    return ("set", tuple(Rational(v) for v in vals))


def key(a):
    return (a[0], frozenset(a[1]))


def params_expr(terms):
    out = []
    for t in terms:
        num = sum(Rational(c) * x**i for i, c in enumerate(t["num"]))
        den = Rational(t["den"]["c"])
        for r in t["den"]["roots"]:
            den *= x - Rational(r)
        out.append((int(t["sign"]), expand(num), expand(den)))
    return out


def check(sample):
    errs = []
    p = sample["params"]
    lvl = sample["level"]
    problem = sample["problem"]
    try:
        lhs, rhs, aligned = parse_problem(problem)
    except ValueError as e:
        return [str(e)], None
    for name, rx in FORBIDDEN + [("\\frac{0}", re.compile(r"\\frac\{0\}"))]:
        if rx.search(problem):
            errs.append(f"problem contains forbidden '{name}': {problem}")

    # params describe the same terms as the text
    for side, ps in ((lhs, p["lhs"]), (rhs, p["rhs"])):
        pe = params_expr(ps)
        if len(pe) != len(side):
            errs.append("params and problem have a different number of terms")
            continue
        for (s1, n1, d1, _), (s2, n2, d2) in zip(side, pe):
            if s1 != s2 or expand(n1 - n2) != 0 or expand((d1 if d1 is not None else 1) - d2) != 0:
                errs.append(f"params term {s2}·({n2})/({d2}) differs from the text")

    terms = lhs + rhs
    dens = [d for _, _, d, _ in terms if d is not None]
    # every term: numerator of degree <= 1 with positive first coefficient, small; fractions not simplifiable
    for s, n, d, dtex in terms:
        pn = Poly(n, x)
        if pn.degree() > 1 or pn.LC() <= 0 or any(abs(c) > 30 for c in pn.all_coeffs()):
            errs.append(f"numerator {n} out of spec")
        if d is None:
            if len(Poly(n, x).terms()) != 1:
                errs.append(f"term without denominator with more than one monomial: {n}")
            continue
        if d.is_number:
            if d <= 1 or gcd(Poly(n, x).content(), d) != 1:
                errs.append(f"numeric fraction {n}/{d} not reduced")
            continue
        g = gcd(n, d)
        if not g.is_number:
            errs.append(f"fraction {n}/{d} can be simplified")
        c, fs = factor_list(d)
        if any(Poly(f, x).degree() != 1 or e != 1 for f, e in fs):
            errs.append(f"denominator {d} is not a product of distinct first-degree factors")
        if not d.is_polynomial(x) or Poly(d, x).degree() > 2:
            errs.append(f"denominator {d} of degree > 2")
        # a - x is written by increasing powers, everything else by decreasing powers
        pd = Poly(d, x)
        if pd.LC() < 0 and not re.fullmatch(r"\d+ - x", dtex):
            errs.append(f"negative denominator not written as a - x: {dtex}")

    ce = sorted({r for d in dens if not d.is_number for r in roots(Poly(d, x)).keys()})
    if any(not r.is_integer or abs(r) > 6 for r in ce):
        errs.append(f"excluded values {ce} not integers up to 6")

    L = sum(s * n / (d if d is not None else 1) for s, n, d, _ in lhs)
    R = sum(s * n / (d if d is not None else 1) for s, n, d, _ in rhs)
    prod = 1
    for d in dens:
        prod *= d
    N = expand(cancel((L - R) * prod))
    if N == 0:
        truth = ("R", tuple(ce))
    else:
        truth = ("set", tuple(sorted(r for r in roots(Poly(N, x)).keys() if r.is_real and r not in ce)))
        if Poly(N, x).degree() > 0 and len(roots(Poly(N, x))) == 0:
            errs.append("integer equation has no rational roots")
    # classification with the MCM, as in the lesson
    M = 1
    for d in dens:
        M = lcm(M, d)
    NM = expand(cancel((L - R) * M))
    if not NM.is_polynomial(x) or (NM != 0 and Poly(NM, x).degree() > 1):
        return errs + [f"after multiplying by the MCM the equation is not of first degree: {NM}"], None
    if NM == 0:
        kind = "indeterminata"
    elif Poly(NM, x).degree() == 0:
        kind = "impossibile"
    else:
        sol = -Poly(NM, x).coeff_monomial(1) / Poly(NM, x).coeff_monomial(x)
        kind = "non accettabile" if sol in ce else "accettabile"
    expected_truth = {"indeterminata": ("R", tuple(ce)), "impossibile": ("set", ()), "non accettabile": ("set", ())}.get(kind)
    if kind == "accettabile":
        expected_truth = ("set", (sol,))
    if key(expected_truth) != key(truth):
        errs.append(f"MCM classification {kind} disagrees with the direct solution {truth}")

    # the answer
    ans = sample["answer"]
    if lvl <= 5:
        if kind != "accettabile":
            errs.append(f"levels 1-5 need an accepted solution, the equation is {kind}")
        if ans.get("kind") != "set" or ans.get("universal"):
            errs.append("answer must be a set")
        elif key(from_values(ans["values"])) != key(truth):
            errs.append(f"answer {ans['values']} != truth {truth}")
        else:
            try:
                if key(read_answer(ans["latex"])) != key(truth):
                    errs.append(f"answer latex {ans['latex']} != truth")
            except ValueError as e:
                errs.append(str(e))
    else:
        if ans.get("kind") != "choice":
            errs.append("level 6 answer must be a choice")
    case6 = "zero" if kind == "accettabile" else kind
    if lvl == 6:
        if p.get("case") != case6:
            errs.append(f"params.case {p.get('case')} but the equation is {case6}")
        if kind == "accettabile" and truth[1] != (0,):
            errs.append("level 6 accepted solution must be 0")

    # the choice
    ch = ans if ans.get("kind") == "choice" else sample.get("choice")
    if ch is None:
        errs.append("no choice")
    else:
        opts = ch.get("options", [])
        keys = []
        for o in opts:
            try:
                k = key(from_values(o["values"]))
                if key(read_answer(o["latex"])) != k:
                    errs.append(f"option latex {o['latex']} != values {o['values']}")
            except ValueError as e:
                errs.append(str(e))
                k = None
            keys.append(k)
        if len(opts) != 4:
            errs.append(f"{len(opts)} options, expected 4")
        if len(set(keys)) != len(keys):
            errs.append("choice options not distinct")
        tk = key(truth)
        if sum(1 for k in keys if k == tk) != 1:
            errs.append("not exactly one correct option")
        idx = ch.get("correct")
        if not isinstance(idx, int) or not 0 <= idx < len(keys) or keys[idx] != tk:
            errs.append("choice.correct is wrong")
        if lvl == 6:
            if case6 == "non accettabile" and key(("set", (sol,))) not in keys:
                errs.append("the excluded solution is not among the options")
            if case6 == "indeterminata" and key(("R", ())) not in keys:
                errs.append("S = R (C.E. forgotten) is not among the options")
            if case6 == "zero" and key(("set", ())) not in keys:
                errs.append("S = empty (zero discarded) is not among the options")

    # steps: the C.E. and the final set
    steps = sample.get("steps") or []
    cest = [s for s in steps if s.startswith(r"\text{C.E.: }")]
    if len(cest) != 1:
        errs.append("steps need exactly one C.E. line")
    else:
        shown = [value(v) for v in re.findall(r"x \\neq (-?\d+)", cest[0])]
        if shown != ce:
            errs.append(f"C.E. in the steps {shown} != {ce}")
    if steps:
        try:
            last = read_answer(steps[-1].split(r"\text{L'equazione è impossibile: } ")[-1])
            if key(last) != key(truth):
                errs.append(f"last step {steps[-1]} != truth")
        except ValueError as e:
            errs.append(f"last step: {e}")
    if not sample.get("solution"):
        errs.append("no solution")

    # layout: every problem fits a phone on one line (spec, measured with width.mts)
    if aligned:
        errs.append("problem on two lines, the spec wants one")

    # levels
    s_val = truth[1][0] if kind == "accettabile" else None
    fr = [(s, n, d, t) for s, n, d, t in terms if d is not None and not d.is_number]
    plain = [t for t in terms if t[2] is None]
    nice = lambda v, qmax, pmax: v is not None and v.q <= qmax and abs(v.p) <= pmax
    if lvl == 1:
        if len(lhs) != 1 or len(rhs) != 1 or len(fr) != 2:
            errs.append("level 1: one fraction per side")
        for s, n, d, t in terms:
            if d is None or not n.is_number or Poly(d, x).degree() != 1 or Poly(d, x).LC() != 1:
                errs.append("level 1: k/(x - a), constant numerator")
        if not nice(s_val, 1, 9):
            errs.append(f"level 1: integer solution in [-9, 9], got {s_val}")
    elif lvl == 2:
        xd = set()
        for s, n, d, t in terms:
            if not n.is_number:
                errs.append("level 2: constant numerators")
            if d is not None and not d.is_number:
                if not (Poly(d, x).degree() == 1 and Poly(d, x).coeff_monomial(1) == 0):
                    errs.append(f"level 2: denominator {d} is not a monomial")
                xd.add(d)
        if len(xd) < 2:
            errs.append("level 2: two different denominators with x")
        if not nice(s_val, 3, 6):
            errs.append(f"level 2: solution p/q with q <= 3, got {s_val}")
    elif lvl == 3:
        quad = [d for d in dens if not d.is_number and Poly(d, x).degree() == 2]
        if len(quad) != 1:
            errs.append("level 3: exactly one denominator to factor")
        else:
            pq = Poly(quad[0], x)
            if pq.LC() != 1 or (pq.coeff_monomial(x) != 0 and pq.coeff_monomial(1) != 0):
                errs.append(f"level 3: {quad[0]} is not a difference of squares or x^2 + bx")
            lin = {expand(d) for d in dens if Poly(d, x).degree() == 1}
            fl = {expand(f) for f, _ in factor_list(quad[0])[1]}
            if lin != fl:
                errs.append("level 3: the other denominators must be the factors")
        if not nice(s_val, 5, 9):
            errs.append(f"level 3: solution p/q with q <= 5, got {s_val}")
    elif lvl == 4:
        lcs = [Poly(d, x).LC() for d in dens if not d.is_number]
        if len(ce) != 1 or not any(c < 0 for c in lcs) or not any(c > 0 for c in lcs) or not plain:
            errs.append("level 4: x - a and a - x, and a term without denominator")
        if not nice(s_val, 3, 9):
            errs.append(f"level 4: solution p/q with q <= 3, got {s_val}")
    elif lvl == 5:
        if len(lhs) != 1 or len(rhs) != 1 or len(fr) != 2:
            errs.append("level 5: one fraction per side")
        else:
            (_, n1, d1, _), (_, n2, d2, _) = lhs[0], rhs[0]
            if Poly(n1, x).degree() != 1 or Poly(n1, x).LC() != Poly(n2, x).LC() or Poly(n2, x).degree() != 1:
                errs.append("level 5: numerators mx + a and mx + c")
            if Poly(d1, x).degree() != 1 or Poly(d1, x).LC() != 1 or Poly(d2, x).LC() != 1:
                errs.append("level 5: denominators x + b and x + d")
        if not nice(s_val, 5, 9):
            errs.append(f"level 5: solution p/q with q <= 5, got {s_val}")
    elif lvl != 6:
        errs.append(f"unknown level {lvl}")
    return errs, (case6 if lvl == 6 else None)
