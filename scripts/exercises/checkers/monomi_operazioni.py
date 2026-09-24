"""Checker for monomi-operazioni, from specs/exercises/monomi-operazioni.md.

The result is recomputed by parsing the problem LaTeX into SymPy; the structure of each level
(similar terms, number of factors, divisibility, exponent of the power) is read from the text."""
import re

from sympy import Poly, expand

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
    1: {"somma": (0.55, 0.85), "meno davanti a un negativo": (0.1, 0.3), "opposti": (0.04, 0.18)},
    4: {"due fattori": (0.45, 0.75), "tre fattori": (0.25, 0.55)},
    5: {"una lettera sparisce": (0.25, 0.55), "nessuna lettera sparisce": (0.45, 0.75)},
}

PROMPTS = {
    1: "Calcola la somma algebrica dei monomi.",
    2: "Calcola la somma algebrica dei monomi.",
    3: "Riduci i monomi simili.",
    4: "Calcola il prodotto.",
    5: "Calcola il quoziente.",
    6: "Calcola la potenza.",
}

PAREN = r"(?:\((?:[^()]*)\)|\\left\((?:(?!\\right\)).)*\\right\))"


def split_sum(latex):
    """Top-level terms of a sum as written: [('+', '3x^2y'), ('-', '(-2x^2y)'), ...]."""
    parts = re.split(r"\s([+-])\s", latex.strip())
    return [("+", parts[0])] + [(parts[i], parts[i + 1]) for i in range(1, len(parts), 2)]


def check(sample):
    errs = []
    lvl = sample["level"]
    prob = sample["problem"]
    errs += forbidden(prob)
    if sample.get("prompt") != PROMPTS.get(lvl):
        errs.append(f"prompt {sample.get('prompt')!r} does not match level {lvl}")
    try:
        truth = expand(parse(prob))
    except ParseError as e:
        return [f"problem does not parse ({e}): {prob}"], None

    ans = sample["answer"]
    if ans.get("kind") != "expression":
        return ["answer.kind must be expression"], None
    if not same(val(ans["value"]), truth):
        errs.append(f"answer value {ans['value']} != {truth}")
    try:
        if not same(parse(ans["latex"]), truth):
            errs.append(f"answer latex {ans['latex']} != {truth}")
    except ParseError as e:
        errs.append(f"answer latex does not parse ({e})")
    errs += forbidden(ans["latex"], "answer")
    errs += poly_normal_form_errors(ans["latex"])

    syms = symbols_of(truth)
    nterms = len(Poly(truth, *syms).terms()) if syms else (0 if truth == 0 else 1)
    kind = None
    if lvl in (1, 2, 3):
        terms = split_sum(prob)
        monos = []
        for sign, t in terms:
            try:
                p = mono_parts(parse(t))
            except ParseError as e:
                errs.append(f"term {t!r} does not parse ({e})")
                continue
            if p is None or not p[1]:
                errs.append(f"term {t!r} is not a monomial with letters")
                continue
            monos.append((sign, t, p))
        lits = {tuple(sorted(p[1].items())) for _, _, p in monos}
        coefs = [p[0] for _, _, p in monos]
        if any(abs(c.p) > 100 or c.q > 12 for c in coefs):
            errs.append("coefficient out of range")
        if lvl in (1, 2):
            if len(lits) != 1 or not 2 <= len(terms) <= 3:
                errs.append(f"level {lvl}: 2 or 3 similar monomials")
            if lvl == 1:
                if any(not c.is_integer for c in coefs):
                    errs.append("level 1: integer coefficients")
                if truth == 0:
                    kind = "opposti"
                elif any(sign == "-" and t.startswith("(-") for sign, t, _ in monos):
                    kind = "meno davanti a un negativo"
                else:
                    kind = "somma"
            else:
                if all(c.is_integer for c in coefs):
                    errs.append("level 2: at least one fractional coefficient")
                if truth == 0:
                    errs.append("level 2: result must be nonzero")
        else:
            if len(lits) != 2 or not 3 <= len(terms) <= 4 or any(not c.is_integer for c in coefs):
                errs.append("level 3: 3 or 4 integer monomials with exactly two literal parts")
            if nterms != 2:
                errs.append(f"level 3: the result must have two terms, got {truth}")
    elif lvl == 4:
        facs = re.findall(PAREN, prob)
        if "\\cdot".join(facs) != prob or not 2 <= len(facs) <= 3:
            errs.append(f"level 4: 2 or 3 factors in parentheses: {prob}")
        kind = "due fattori" if len(facs) == 2 else "tre fattori"
    elif lvl == 5:
        m = re.fullmatch(rf"({PAREN}) : ({PAREN})", prob)
        if not m:
            errs.append(f"level 5: (A) : (B) expected: {prob}")
        else:
            A, B = mono_parts(parse(m.group(1))), mono_parts(parse(m.group(2)))
            if A is None or B is None:
                errs.append("level 5: dividend and divisor must be monomials")
            else:
                if abs(B[0]) == 1:
                    errs.append("level 5: divisor coefficient 1")
                if any(A[1].get(v, 0) < e for v, e in B[1].items()):
                    errs.append("level 5: not divisible")
                vanished = any(A[1].get(v, 0) == e for v, e in B[1].items())
                kind = "una lettera sparisce" if vanished else "nessuna lettera sparisce"
    elif lvl == 6:
        if not re.fullmatch(rf"{PAREN}\^[2-4]", prob):
            errs.append(f"level 6: (A)^n with n in 2..4 expected: {prob}")
    else:
        errs.append(f"unknown level {lvl}")

    if lvl != 3:
        if truth != 0 and mono_parts(truth) is None:
            errs.append(f"result is not a monomial: {truth}")
        if lvl != 1 and truth == 0:
            errs.append("result is zero")
    p = mono_parts(truth) if truth != 0 and lvl != 3 else None
    if p:
        c, e = p
        if abs(c.p) > 1000 or c.q > 125 or max(e.values(), default=0) > 16:
            errs.append(f"result out of range: {truth}")
        if lvl in (4, 5, 6) and not e:
            errs.append("result without letters")

    errs += check_steps(sample)
    errs += check_choice(sample, truth)
    return errs, kind
