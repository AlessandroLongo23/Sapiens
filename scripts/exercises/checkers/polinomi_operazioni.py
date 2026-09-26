"""Checker for polinomi-operazioni, from specs/exercises/polinomi-operazioni.md.

The truth is recomputed by parsing the problem LaTeX into SymPy and expanding it; the operation,
the shape of each polynomial and the case of each level are read from the text, not from params.
The answer and every option must be written reduced and ordered by decreasing powers of the
first letter (lexicographic on the letters in alphabetical order)."""
import re

from sympy import Poly, Rational, expand

from checkers.monomi_common import (
    ParseError,
    check_choice,
    check_steps,
    forbidden,
    mono_parts,
    parse,
    poly_normal_form_errors,
    same,
    symbols_of,
    val,
)

CASE_RANGES = {
    2: {"un termine si annulla": (0.35, 0.65), "nessun termine si annulla": (0.35, 0.65)},
    3: {"differenza": (0.45, 0.75), "somma": (0.25, 0.55)},
    4: {"coefficienti frazionari": (0.15, 0.40), "monomio negativo": (0.25, 0.50), "monomio positivo": (0.20, 0.45)},
    6: {"binomio per trinomio": (0.25, 0.55), "due lettere": (0.20, 0.45), "coefficienti frazionari": (0.15, 0.40)},
    7: {"divisore frazionario": (0.15, 0.40), "un termine diventa 1": (0.20, 0.50), "divisore intero": (0.20, 0.50)},
}

PROMPTS = {
    1: "Calcola la somma algebrica dei polinomi.",
    2: "Calcola la somma algebrica dei polinomi.",
    3: "Calcola la somma algebrica dei polinomi.",
    4: "Calcola il prodotto.",
    5: "Calcola il prodotto.",
    6: "Calcola il prodotto.",
    7: "Calcola il quoziente.",
}

# a bracket: (...) without nested round brackets, or \left( ... \right)
BR = r"(?:\(([^()]*)\)|\\left\(((?:(?!\\right\)).)*)\\right\))"


def inner(m, i):
    return m.group(i) if m.group(i) is not None else m.group(i + 1)


def split_terms(latex):
    """Top-level terms of a polynomial as written, each with its sign: ['3x^2', '-5x', '2']."""
    parts = re.split(r"\s([+-])\s", latex.strip())
    return [parts[0]] + [("-" if parts[i] == "-" else "") + parts[i + 1] for i in range(1, len(parts), 2)]


def terms_of(latex, where):
    """Parsed monomials of a written polynomial; errors if a term is not a monomial or two are similar."""
    errs, out = [], []
    for t in split_terms(latex):
        try:
            p = mono_parts(parse(t))
        except ParseError as e:
            errs.append(f"{where}: term {t!r} does not parse ({e})")
            continue
        if p is None:
            errs.append(f"{where}: term {t!r} is not a nonzero monomial")
            continue
        out.append(p)
    lits = [tuple(sorted(e.items())) for _, e in out]
    if len(set(lits)) != len(lits):
        errs.append(f"{where}: similar terms not reduced: {latex}")
    return out, errs


def order_errors(latex, where):
    """Terms in decreasing powers of the first letter, then of the second, and so on."""
    ts, errs = terms_of(latex, where)
    if errs:
        return errs
    ls = sorted({v for _, e in ts for v in e})
    keys = [tuple(e.get(v, 0) for v in ls) for _, e in ts]
    if keys != sorted(keys, reverse=True):
        return [f"{where}: not ordered by decreasing powers of {ls[0] if ls else '?'}: {latex}"]
    return []


def coefs(ts):
    return [c for c, _ in ts]


def lit(e):
    return tuple(sorted(e.items()))


def similar_pairs(ts1, ts2):
    return [(a, b) for a in ts1 for b in ts2 if lit(a[1]) == lit(b[1])]


def notable(ts1, ts2):
    """Two binomials with the same literal parts and the same coefficients up to the sign."""
    if len(ts1) != 2 or len(ts2) != 2:
        return False
    k1 = sorted((lit(e), abs(c)) for c, e in ts1)
    k2 = sorted((lit(e), abs(c)) for c, e in ts2)
    return k1 == k2


ALIGNED = re.compile(r"\\begin\{aligned\} &(.+?) \\\\ &\\quad ([+\-:]) (.+?) \\end\{aligned\}")


def one_line(prob):
    """A problem broken over two lines for the phone, "\\begin{aligned} &(A) \\\\ &\\quad - (B) \\end{aligned}",
    back on one line: "(A) - (B)". Exactly two lines, the second starting with \\quad and the operator.
    Returns (text, errors)."""
    if "aligned" not in prob and "\\\\" not in prob and "&" not in prob:
        return prob, []
    m = ALIGNED.fullmatch(prob)
    if not m:
        return prob, [f"problem on several lines not in the form '&(A) \\\\ &\\quad op (B)': {prob}"]
    a, op, b = m.groups()
    if "\\\\" in a + b or "&" in a + b:
        return prob, [f"problem with more than two lines: {prob}"]
    return f"{a} {op} {b}", []


def check(sample):
    errs = []
    lvl = sample["level"]
    errs += forbidden(sample["problem"])
    prob, e = one_line(sample["problem"])
    if e:
        return e, None
    if sample.get("prompt") != PROMPTS.get(lvl):
        errs.append(f"prompt {sample.get('prompt')!r} does not match level {lvl}")
    try:
        truth = expand(parse(prob))
    except ParseError as e:
        return [f"problem does not parse ({e}): {prob}"], None

    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "expanded":
        return ["answer must be an expression in expanded form"], None
    if not same(val(ans["value"]), truth):
        errs.append(f"answer value {ans['value']} != {truth}")
    try:
        if not same(parse(ans["latex"]), truth):
            errs.append(f"answer latex {ans['latex']} != {truth}")
    except ParseError as e:
        errs.append(f"answer latex does not parse ({e})")
    errs += forbidden(ans["latex"], "answer")
    errs += poly_normal_form_errors(ans["latex"])
    errs += order_errors(ans["latex"], "answer")

    syms = symbols_of(truth)
    if syms and not truth.is_polynomial(*syms):
        return errs + [f"the result is not a polynomial (a term is not divisible?): {truth}"], None
    res_terms = Poly(truth, *syms).terms() if syms else []
    if len(res_terms) < 2:
        errs.append(f"result must have at least two terms: {truth}")
    for _, c in res_terms:
        c = Rational(c)
        if abs(c.p) > 100 or c.q > 12:
            errs.append(f"result coefficient out of range: {c}")
    if any(max(m) > 8 for m, _ in res_terms):
        errs.append("result exponent > 8")

    kind = None
    if lvl in (1, 2, 3):
        m = re.fullmatch(rf"{BR} ([+-]) {BR}", prob)
        if not m:
            return errs + [f"level {lvl}: (A) + (B) or (A) - (B) expected: {prob}"], None
        A, B, op = inner(m, 1), inner(m, 4), m.group(3)
        tA, e1 = terms_of(A, "first polynomial")
        tB, e2 = terms_of(B, "second polynomial")
        errs += e1 + e2 + order_errors(A, "first polynomial") + order_errors(B, "second polynomial")
        cs = coefs(tA) + coefs(tB)
        if any(abs(c.p) > 60 or c.q > 12 for c in cs):
            errs.append("coefficient out of range")
        letters = {v for _, e in tA + tB for v in e}
        pairs = similar_pairs(tA, tB)
        if lvl == 1:
            if op != "+" or len(letters) != 1 or any(not c.is_integer for c in cs) or len(pairs) < 2:
                errs.append("level 1: sum of two integer polynomials in one letter, two pairs of similar terms")
        elif lvl == 2:
            if op != "-" or any(not c.is_integer for c in cs) or len(tB) < 2:
                errs.append("level 2: difference, integer coefficients, at least two terms subtracted")
            cancel = any(a[0] == b[0] for a, b in pairs)
            kind = "un termine si annulla" if cancel else "nessun termine si annulla"
        else:
            good = any(not a[0].is_integer and not b[0].is_integer and a[0].q != b[0].q for a, b in pairs)
            if not good or len(pairs) < 2 or not all(c.q in (1, 2, 3, 4, 6) for c in cs):
                errs.append("level 3: two pairs of similar terms, one with two fractions over different denominators")
            kind = "differenza" if op == "-" else "somma"
    elif lvl == 4:
        m = re.fullmatch(rf"(.+?)(?:\\,)?{BR}", prob)
        if not m:
            return errs + [f"level 4: M(P) expected: {prob}"], None
        try:
            M = mono_parts(parse(m.group(1)))
        except ParseError as e:
            return errs + [f"level 4: monomial does not parse ({e})"], None
        P = inner(m, 2)
        tP, e1 = terms_of(P, "polynomial")
        errs += e1 + order_errors(P, "polynomial")
        if M is None or not M[1] or abs(M[0]) == 1 or not 2 <= len(tP) <= 3:
            errs.append("level 4: a monomial with letters and coefficient not 1, times 2 or 3 terms")
        else:
            cs = [M[0]] + coefs(tP)
            if any(abs(c.p) > 60 or c.q > 12 for c in cs):
                errs.append("coefficient out of range")
            kind = "coefficienti frazionari" if any(not c.is_integer for c in cs) else "monomio negativo" if M[0] < 0 else "monomio positivo"
    elif lvl in (5, 6):
        m = re.fullmatch(rf"{BR}{BR}", prob)
        if not m:
            return errs + [f"level {lvl}: (A)(B) expected: {prob}"], None
        A, B = inner(m, 1), inner(m, 3)
        tA, e1 = terms_of(A, "first factor")
        tB, e2 = terms_of(B, "second factor")
        errs += e1 + e2 + order_errors(A, "first factor") + order_errors(B, "second factor")
        cs = coefs(tA) + coefs(tB)
        letters = {v for _, e in tA + tB for v in e}
        if notable(tA, tB):
            errs.append(f"level {lvl}: a notable product (square or sum times difference)")
        if len(res_terms) < 3:
            errs.append(f"level {lvl}: the product must have at least three terms")
        if lvl == 5:
            if len(tA) != 2 or len(tB) != 2 or len(letters) != 1 or any(not c.is_integer or abs(c) > 9 for c in cs):
                errs.append("level 5: two integer binomials in one letter")
        else:
            if len(letters) == 2:
                kind = "due lettere"
            elif any(not c.is_integer for c in cs):
                kind = "coefficienti frazionari"
                if len(tA) != 2 or len(tB) != 2:
                    errs.append("level 6: fractions only in binomial times binomial")
            else:
                kind = "binomio per trinomio"
                if sorted([len(tA), len(tB)]) != [2, 3]:
                    errs.append("level 6: binomial times trinomial expected")
    elif lvl == 7:
        m = re.fullmatch(rf"{BR} : {BR}", prob)
        if not m:
            return errs + [f"level 7: (P) : (M) expected: {prob}"], None
        P, Ml = inner(m, 1), inner(m, 3)
        tP, e1 = terms_of(P, "dividend")
        errs += e1 + order_errors(P, "dividend")
        try:
            M = mono_parts(parse(Ml))
        except ParseError as e:
            return errs + [f"level 7: divisor does not parse ({e})"], None
        if M is None or not M[1] or abs(M[0]) == 1 or len(tP) < 2:
            errs.append("level 7: a divisor with letters and coefficient not 1")
        else:
            # divisible: every letter of the divisor in every term, with exponent at least as large
            for c, e in tP:
                if any(e.get(v, 0) < k for v, k in M[1].items()):
                    errs.append(f"level 7: term not divisible by the divisor: {c} {e}")
            if any(abs(c.p) > 60 or c.q > 12 for c in coefs(tP)):
                errs.append("coefficient out of range")
            unit = any(m_ == (0,) * len(syms) and abs(Rational(c)) == 1 for m_, c in res_terms)
            kind = "divisore frazionario" if not M[0].is_integer else "un termine diventa 1" if unit else "divisore intero"
            # degree of the quotient = degree of the dividend - degree of the divisor
            dP = max(sum(e.values()) for _, e in tP)
            dQ = max(sum(m_) for m_, _ in res_terms)
            if dQ != dP - sum(M[1].values()):
                errs.append("level 7: degree of the quotient is not the difference of the degrees")
    else:
        errs.append(f"unknown level {lvl}")

    if sample.get("params", {}).get("case") != kind and kind is not None:
        errs.append(f"params.case {sample.get('params', {}).get('case')!r} but the text is {kind!r}")

    errs += check_steps(sample)
    errs += check_choice(sample, truth)
    for o in (sample.get("choice") or {}).get("options", []):
        errs += order_errors(o.get("latex", ""), "option")
    return errs, kind
