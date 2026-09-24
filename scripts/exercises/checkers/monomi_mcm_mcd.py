"""Checker for monomi-mcm-mcd, from specs/exercises/monomi-mcm-mcd.md and lesson 14.

The monomials are parsed from the problem LaTeX and MCD or MCM is recomputed with the lesson's
convention: integer coefficients -> MCD/MCM of the absolute values, any fraction -> 1; the MCD
takes the common letters with the lowest exponent, the MCM all letters with the highest."""
import re
from functools import reduce

from sympy import Integer, Mul, Rational, igcd, ilcm

from checkers.monomi_common import (
    SYMS,
    ParseError,
    check_choice,
    check_steps,
    forbidden,
    mono_parts,
    normal_form_errors,
    parse,
    same,
    val,
)

CASE_RANGES = {lvl: {"MCD": (0.35, 0.65), "MCM": (0.35, 0.65)} for lvl in range(1, 6)}


def expected(parts, kind):
    coefs = [c for c, _ in parts]
    if all(c.is_integer for c in coefs):
        f = igcd if kind == "MCD" else ilcm
        coef = Integer(reduce(f, [abs(int(c)) for c in coefs]))
    else:
        coef = Integer(1)
    letters = sorted({v for _, e in parts for v in e})
    exps = {}
    for v in letters:
        es = [e.get(v, 0) for _, e in parts]
        if kind == "MCD":
            if min(es) > 0:
                exps[v] = min(es)
        else:
            exps[v] = max(es)
    return coef * Mul(*[SYMS[v] ** k for v, k in exps.items()])


def check(sample):
    errs = []
    lvl = sample["level"]
    prob = sample["problem"]
    m = re.fullmatch(r"Calcola il (MCD|MCM) dei monomi\.", sample.get("prompt", ""))
    if not m:
        return [f"unexpected prompt {sample.get('prompt')!r}"], None
    kind = m.group(1)
    errs += forbidden(prob)
    texts = prob.split(",\\quad ")
    parts = []
    for t in texts:
        errs += normal_form_errors(t, "problem monomial")
        try:
            p = mono_parts(parse(t))
        except ParseError as e:
            return [f"monomial {t!r} does not parse ({e})"], None
        if p is None or not p[1]:
            return [f"{t!r} is not a monomial with letters"], None
        parts.append(p)
    truth = expected(parts, kind)

    ans = sample["answer"]
    if ans.get("kind") != "expression" or not same(val(ans["value"]), truth):
        errs.append(f"answer {ans.get('value')} != {kind} {truth}")
    try:
        if not same(parse(ans["latex"]), truth):
            errs.append(f"answer latex {ans['latex']} != {truth}")
    except ParseError as e:
        errs.append(f"answer latex does not parse ({e})")
    errs += normal_form_errors(ans["latex"])
    errs += forbidden(ans["latex"], "answer")
    if sample["params"].get("case") != kind:
        errs.append("params.case differs from the prompt")

    coefs = [c for c, _ in parts]
    ints = all(c.is_integer for c in coefs)
    positive = all(c > 0 for c in coefs)
    letter_sets = {tuple(sorted(e)) for _, e in parts}
    if any(abs(c.p) > 60 or c.q > 9 for c in coefs):
        errs.append("coefficient out of range")
    if len({tuple(sorted(e.items())) for _, e in parts}) != len(parts):
        errs.append("two monomials with the same literal part")
    if ints and len({abs(c) for c in coefs}) != len(coefs):
        errs.append("integer coefficients must differ in absolute value")
    if kind == "MCD" and truth == 1:
        errs.append("MCD equal to 1")
    n = len(parts)
    if lvl == 1:
        if n != 2 or len(letter_sets) != 1 or not ints or not positive or any(c == 1 for c in coefs):
            errs.append("level 1: two monomials, same letters, positive integer coefficients >= 2")
    elif lvl == 2:
        if n != 2 or len(letter_sets) == 1 or not ints or not positive:
            errs.append("level 2: two monomials with different letters, positive integer coefficients")
    elif lvl == 3:
        if n != 2 or not ints or positive:
            errs.append("level 3: two integer monomials, at least one negative")
    elif lvl == 4:
        if n != 3 or not ints:
            errs.append("level 4: three integer monomials")
    elif lvl == 5:
        if n not in (2, 3) or ints:
            errs.append("level 5: 2 or 3 monomials with at least one fraction")
    else:
        errs.append(f"unknown level {lvl}")

    try:
        pm = [Rational(m["c"]) * Mul(*[SYMS[k] ** int(n) for k, n in m["e"].items()]) for m in sample["params"]["monomials"]]
        if len(pm) != len(parts) or not all(same(a, parse(t)) for a, t in zip(pm, texts)):
            errs.append("params.monomials differ from the problem")
    except (KeyError, TypeError, ValueError) as e:
        errs.append(f"params not readable: {e!r}")

    errs += check_steps(sample)
    errs += text_steps(sample["steps"], parts, texts, kind, truth)
    errs += check_choice(sample, truth)
    return errs, kind


def text_steps(steps, parts, texts, kind, truth):
    """The MCD/MCM steps are mostly text: read their claims and check them against the problem."""
    errs = []
    coefs = [c for c, _ in parts]
    seen_letters = set()
    final = False
    for st in steps:
        m = re.search(r"\\text\{(MCD|MCM)\}\(([\d,\\ ]+)\) = (\d+)$", st)
        if m:
            nums = [int(n) for n in re.findall(r"\d+", m.group(2))]
            f = igcd if m.group(1) == "MCD" else ilcm
            if m.group(1) != kind or nums != [abs(int(c)) for c in coefs] or int(m.group(3)) != reduce(f, nums):
                errs.append(f"wrong coefficient step: {st}")
            continue
        m = re.match(r"\\text\{Lettera \} ([a-z])\\text\{: (.*)$", st)
        if m:
            v, rest = m.group(1), m.group(2)
            seen_letters.add(v)
            es = [e.get(v, 0) for _, e in parts]
            present = [k for k in es if k > 0]
            mm = re.search(r"esponenti \} (.*)\\text\{, il (minimo|massimo) è \} (\d+)$", rest)
            if mm:
                listed = [int(n) for n in re.findall(r"\d+", mm.group(1))]
                want = min(present) if mm.group(2) == "minimo" else max(present)
                if listed != present or int(mm.group(3)) != want or (mm.group(2) == "minimo") != (kind == "MCD"):
                    errs.append(f"wrong letter step: {st}")
                if kind == "MCD" and 0 in es:
                    errs.append(f"letter {v} is not common but the step takes its minimum: {st}")
            elif "manca in" in rest:
                if kind != "MCD" or 0 not in es:
                    errs.append(f"wrong 'manca' step: {st}")
            elif "compare solo in" in rest:
                if kind != "MCM" or len(present) != 1 or not rest.endswith(f"con esponente }} {present[0]}"):
                    errs.append(f"wrong 'compare solo' step: {st}")
            else:
                errs.append(f"unrecognised letter step: {st}")
            continue
        m = re.fullmatch(r"\\text\{(MCD|MCM)\} = (.*)", st)
        if m:
            final = True
            try:
                if m.group(1) != kind or not same(parse(m.group(2)), truth):
                    errs.append(f"final step {st} != {truth}")
            except ParseError as e:
                errs.append(f"final step does not parse ({e})")
    all_letters = {v for _, e in parts for v in e}
    if seen_letters != all_letters:
        errs.append(f"steps discuss letters {sorted(seen_letters)}, the monomials have {sorted(all_letters)}")
    if not final:
        errs.append("no final step")
    return errs
