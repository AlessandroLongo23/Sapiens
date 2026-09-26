"""Checker for polinomi-divisione, from specs/exercises/polinomi-divisione.md.

Dividend and divisor are read from the problem LaTeX "(A) : (B)", quotient and remainder are
recomputed with SymPy's polynomial division, and every option "Q(x) = ..., R(x) = ..." is parsed
back from its LaTeX. The correct option must satisfy A = B*Q + R with deg R < deg B; every other
option must break one of the two (the lesson's point: an identity with a remainder of degree too
high is not the division)."""
import re

from sympy import Poly, Rational, div, expand

from checkers.monomi_common import (
    ParseError,
    check_steps,
    forbidden,
    parse,
    poly_normal_form_errors,
    same,
    val,
)

X = parse("x")

PROMPT = "Trova il quoziente e il resto della divisione."

CASE_RANGES = {
    3: {"divisibile": (0.2, 0.5), "con resto": (0.5, 0.8)},
    4: {"quoziente di primo grado": (0.25, 0.55), "quoziente di secondo grado": (0.45, 0.75)},
    6: {"x^2 + c": (0.55, 0.85), "x^2 + bx": (0.15, 0.45)},
}

PROBLEM = re.compile(r"^\((.+)\) : \((.+)\)$")
OPTION = re.compile(r"^Q\(x\) = (.+),\\ \\ R\(x\) = (.+)$")


ALIGNED = re.compile(r"^\\begin\{aligned\}&(\(.+\)) \\\\ &\\quad : (\(.+\))\\end\{aligned\}$")


def unfold(prob):
    """The problem on one line. A long division is written on two lines (phone width), breaking
    before the ":"; both lines must be there, each with one polynomial in parentheses."""
    if not prob.startswith("\\begin{aligned}"):
        return prob
    m = ALIGNED.match(prob)
    if not m or m.group(1).count("(") != 1 or m.group(2).count("(") != 1:
        return None
    return f"{m.group(1)} : {m.group(2)}"


def poly(e):
    return Poly(expand(e), X, domain="QQ")


def deg(p):
    """Degree, -1 for the zero polynomial."""
    return -1 if p.is_zero else p.degree()


def written_degrees(latex):
    """Degrees of the terms of a polynomial as they are written, left to right."""
    parts = re.split(r"\s[+-]\s", latex.strip())
    out = []
    for t in parts:
        t = t.lstrip("-")
        m = re.search(r"x(?:\^(\d))?$", t)
        out.append(0 if not m else int(m.group(1) or 1))
    return out


def descending_order_errors(latex, where):
    ds = written_degrees(latex)
    if ds != sorted(ds, reverse=True) or len(set(ds)) != len(ds):
        return [f"{where} not in decreasing powers: {latex}"]
    return []


def coeffs(p):
    return [Rational(c) for c in p.all_coeffs()]


OPTION_2 = re.compile(r"^\\begin\{gathered\}Q\(x\) = (.+) \\\\ R\(x\) = (.+)\\end\{gathered\}$")


def parse_option(latex, level=None):
    """(Q latex, R latex). Level 1 writes the pair on one line; from level 2 on (answer button of
    about 252 px) every option is on two lines, Q(x) above and R(x) below, both lines present."""
    two = latex.startswith("\\begin{gathered}")
    if level is not None and two != (level >= 2):
        raise ParseError(f"option on {'two lines' if two else 'one line'} at level {level}: {latex}")
    m = (OPTION_2 if two else OPTION).match(latex)
    if not m or "\\\\" in m.group(1) or "\\\\" in m.group(2):
        raise ParseError(f"option not of the form Q(x) = ..., R(x) = ...: {latex}")
    return m.group(1), m.group(2)


def check_options(ch, A, B, Q, R, where, level):
    errs = []
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{where}: {len(opts)} options, expected 4")
    pairs = []
    for o in opts:
        lt = o.get("latex", "")
        errs += forbidden(lt, where)
        try:
            ql, rl = parse_option(lt, level)
            qp, rp = poly(parse(ql)), poly(parse(rl))
        except ParseError as e:
            errs.append(f"{where}: {e}")
            return errs
        for part, name in ((ql, "Q"), (rl, "R")):
            errs += poly_normal_form_errors(part, f"{where} {name}")
            errs += descending_order_errors(part, f"{where} {name}")
        vs = o.get("values", [])
        if len(vs) != 2 or not same(val(vs[0]), qp.as_expr()) or not same(val(vs[1]), rp.as_expr()):
            errs.append(f"{where}: values {vs} do not match latex {lt}")
        pairs.append((qp, rp))
    for i in range(len(pairs)):
        for j in range(i + 1, len(pairs)):
            if pairs[i] == pairs[j]:
                errs.append(f"{where}: options {i} and {j} are equal")
    right = [i for i, (qp, rp) in enumerate(pairs) if qp == Q and rp == R]
    if len(right) != 1:
        errs.append(f"{where}: {len(right)} options equal the true pair")
    if ch.get("correct") not in right:
        errs.append(f"{where}: correct index {ch.get('correct')} does not point at Q = {Q.as_expr()}, R = {R.as_expr()}")
    for i, (qp, rp) in enumerate(pairs):
        if i in right:
            continue
        identity = (B * qp + rp) == A
        if identity and deg(rp) < deg(B):
            errs.append(f"{where}: distractor {i} is a valid division")
    return errs


def check(sample):
    errs = []
    lvl = sample["level"]
    prob = sample["problem"]
    if sample.get("prompt") != PROMPT:
        errs.append(f"prompt {sample.get('prompt')!r}")
    errs += forbidden(prob)
    flat = unfold(prob)
    if flat is None:
        return [f"problem on several lines is not '&(A) \\\\ &\\quad : (B)': {prob}"], None
    m = PROBLEM.match(flat)
    if not m:
        return [f"problem is not (A) : (B): {prob}"], None
    al, bl = m.group(1), m.group(2)
    try:
        A, B = poly(parse(al)), poly(parse(bl))
    except ParseError as e:
        return [f"problem does not parse ({e}): {prob}"], None
    errs += poly_normal_form_errors(al, "dividend") + poly_normal_form_errors(bl, "divisor")
    Q, R = div(A, B)
    if B * Q + R != A or deg(R) >= deg(B):
        errs.append("sympy division inconsistent")

    ca, cb, cq, cr = coeffs(A), coeffs(B), coeffs(Q), coeffs(R) if not R.is_zero else []
    dA, dB = deg(A), deg(B)
    if any(not c.is_integer for c in ca + cb):
        errs.append("dividend and divisor must have integer coefficients")
    if max(abs(c) for c in ca) > 40 or max(abs(c) for c in cb) > 5:
        errs.append("dividend or divisor coefficients too large")
    if any(abs(c.p) > 12 or c.q > 3 for c in cq) or any(abs(c.p) > 30 or c.q > 3 for c in cr):
        errs.append(f"quotient or remainder out of size: {Q.as_expr()}, {R.as_expr()}")
    if any(c == 0 for c in cq):
        errs.append(f"quotient must have every power: {Q.as_expr()}")
    if A.eval(0) == 0:
        errs.append("dividend without constant term")
    complete_A = all(c != 0 for c in ca)
    ordered = written_degrees(al) == sorted(written_degrees(al), reverse=True)
    lcB = cb[0]
    nz_B = sum(1 for c in cb if c != 0)
    if lvl != 5:
        if not ordered:
            errs.append("dividend must be in decreasing powers")
        if lcB != 1 or any(not c.is_integer for c in cq):
            errs.append("monic divisor and integer quotient required")
    kind = None
    if lvl == 1:
        if dB != 1 or dA != 2 or not complete_A:
            errs.append("level 1: complete second-degree dividend by x + b")
    elif lvl == 2:
        if dB != 1 or dA != 3 or not complete_A:
            errs.append("level 2: complete third-degree dividend by x + b")
    elif lvl == 3:
        if dB != 1 or dA not in (3, 4) or complete_A:
            errs.append("level 3: incomplete dividend of degree 3 or 4 by x + b")
        kind = "divisibile" if R.is_zero else "con resto"
    elif lvl == 4:
        if dB != 2 or nz_B != 3 or dA not in (3, 4) or deg(R) != 1:
            errs.append("level 4: complete second-degree divisor, first-degree remainder")
        kind = "quoziente di primo grado" if dA == 3 else "quoziente di secondo grado"
    elif lvl == 5:
        if dB != 1 or lcB not in (2, 3) or dA != 3 or ordered or len(written_degrees(al)) < 3:
            errs.append("level 5: (ax + b), a = 2 or 3, third-degree dividend in disorder")
        if all(c.is_integer for c in cq):
            errs.append("level 5: the quotient must have a fraction")
    elif lvl == 6:
        if dB != 2 or nz_B != 2 or lcB != 1 or dA != 4 or R.is_zero:
            errs.append("level 6: incomplete monic second-degree divisor, fourth-degree dividend, nonzero remainder")
        kind = "x^2 + c" if cb[1] == 0 else "x^2 + bx"
    else:
        errs.append(f"unknown level {lvl}")
    if lvl != 5:
        errs += descending_order_errors(al, "dividend")
    errs += descending_order_errors(bl, "divisor")

    ans = sample.get("answer", {})
    if ans.get("kind") != "choice":
        errs.append("answer must be a choice")
    else:
        errs += check_options(ans, A, B, Q, R, "answer", lvl)
    if sample.get("choice") is None:
        errs.append("no choice variant")
    elif sample["choice"] != ans:
        errs += check_options(sample["choice"], A, B, Q, R, "choice", lvl)

    # the solution names the true pair; the steps are consistent and end with the check
    try:
        ql, rl = parse_option(sample.get("solution", ""), lvl)
        if poly(parse(ql)) != Q or poly(parse(rl)) != R:
            errs.append("solution is not the true pair")
    except ParseError as e:
        errs.append(f"solution: {e}")
    errs += check_steps(sample)
    steps = sample.get("steps") or []
    if not steps or not steps[-1].startswith("\\text{Verifica: }"):
        errs.append("the last step must be the check B*Q + R = A")
    else:
        lhs, rhs = steps[-1][len("\\text{Verifica: }"):].split(" = ")
        if poly(parse(lhs)) != A or poly(parse(rhs)) != A:
            errs.append("the check step does not give the dividend")
    n_steps = sum(1 for s in steps if s.startswith("\\text{Passo "))
    if n_steps != len(cq):
        errs.append(f"{n_steps} division steps for a quotient with {len(cq)} terms")
    return errs, kind
