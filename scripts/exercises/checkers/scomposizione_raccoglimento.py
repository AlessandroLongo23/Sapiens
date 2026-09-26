"""Checker for scomposizione-raccoglimento, from specs/exercises/scomposizione-raccoglimento.md and
lesson 34 (Raccoglimento totale e parziale).

Everything is recomputed from the LaTeX the student sees: the problem is parsed into an exact
SymPy expression, the answer and every option are parsed twice, once as a value and once as a
structure (sign, monomial in front, brackets). An expression counts as "scomposta" in the lesson's
sense when:

- the last operation is a multiplication: an optional integer monomial in front and one or more
  brackets, possibly raised to a power, with nothing added after them;
- there are at least two factors besides a sign (3(2x - 3) yes, -(x^2 - 5x + 7) no);
- every bracket holds a polynomial with integer coefficients and at least two terms that is
  primitive (no number and no letter common to all its terms) and irreducible over the integers
  (SymPy factor_list gives a single factor, with multiplicity 1 and content +-1).

A number in front does not count as a factor that makes the polynomial reducible, but it has to be
collected: 3(2x - 3) is complete, (x - 2)(2x^2 + 6) is not. The sign may sit in front or inside a
bracket (the lesson accepts both -2x(2x^2 - 4x + 1) and 2x(-2x^2 + 4x - 1)); the expected answer of
the generator also follows the lesson's convention, checked separately: the opposite of the MCD in
front when the first term is negative, every bracket starting with a positive term.
"""
import re
from functools import reduce

from sympy import Integer, Poly, expand, factor_list, gcd

from checkers.monomi_common import (
    ParseError,
    check_steps,
    forbidden,
    mono_parts,
    parse,
    parse_tokens,
    poly_normal_form_errors,
    same,
    tokenize,
    val,
)

CASE_RANGES = {
    1: {"numero": (0.28, 0.52), "lettera": (0.18, 0.42), "numero e lettera": (0.18, 0.42)},
    2: {"uno": (0.35, 0.65), "senza uno": (0.35, 0.65)},
    3: {"numero": (0.18, 0.42), "monomio": (0.58, 0.82)},
    4: {"uguali": (0.22, 0.48), "quadrato": (0.18, 0.42), "opposti": (0.22, 0.48)},
    5: {"una lettera": (0.35, 0.65), "più lettere": (0.35, 0.65)},
    6: {"riordino": (0.22, 0.45), "sei termini": (0.22, 0.45), "totale poi parziale": (0.22, 0.45)},
}

MAX_COEF = 60


class NotProduct(Exception):
    pass


# ---------------------------------------------------------------------------
# Structure of a factored expression


def _match(toks, i):
    """Index of the ')' closing the '(' at i."""
    depth = 0
    for j in range(i, len(toks)):
        if toks[j] == "(":
            depth += 1
        elif toks[j] == ")":
            depth -= 1
            if depth == 0:
                return j
    raise NotProduct("unbalanced brackets")


def structure(latex):
    """sign * front * prod(group_k ** power_k) -> (front, [(group, power, group_latex_tokens)]).
    Raises NotProduct when the top level is not a product of that shape."""
    toks = tokenize(latex)
    i = 0
    sign = 1
    if toks and toks[0] == "-":
        sign, i = -1, 1
    front = []
    while i < len(toks) and toks[i] != "(":
        if toks[i] in ("+", "-", "[", "]", "\\{", "\\}", ":", "\\cdot", "\\frac", "="):
            raise NotProduct(f"token {toks[i]!r} outside the brackets")
        front.append(toks[i])
        i += 1
    groups = []
    while i < len(toks):
        if toks[i] != "(":
            raise NotProduct(f"token {toks[i]!r} after a bracket")
        j = _match(toks, i)
        inner = toks[i + 1 : j]
        i = j + 1
        power = 1
        if i < len(toks) and toks[i] == "^":
            if i + 1 >= len(toks) or not toks[i + 1].isdigit():
                raise NotProduct("bad exponent")
            power = int(toks[i + 1])
            i += 2
        groups.append((parse_tokens(inner), power, inner))
    f = parse_tokens(front) if front else Integer(1)
    return sign * f, groups


def completeness(latex):
    """(True, "") when latex is a complete factorization in the lesson's sense, else (False, why)."""
    try:
        front, groups = structure(latex)
    except NotProduct as e:
        return False, f"non è un prodotto ({e})"
    except ParseError as e:
        return False, f"non si legge ({e})"
    mp = mono_parts(front)
    if mp is None or not mp[0].is_integer:
        return False, f"davanti non c'è un monomio a coefficiente intero: {front}"
    if not groups:
        return False, "nessuna parentesi"
    nontrivial = (0 if (not mp[1] and abs(mp[0]) == 1) else 1) + len(groups)
    if nontrivial < 2:
        return False, "un solo fattore"
    for g, _, _ in groups:
        syms = sorted(g.free_symbols, key=lambda s: s.name)
        if not syms:
            return False, f"parentesi senza lettere: {g}"
        P = Poly(expand(g), *syms)
        if len(P.terms()) < 2:
            return False, f"parentesi con un solo termine: {g}"
        if not all(c.is_integer for c in P.coeffs()):
            return False, f"coefficienti non interi: {g}"
        c, fl = factor_list(expand(g))
        if abs(c) != 1:
            return False, f"fattore numerico {abs(c)} non raccolto in {g}"
        if len(fl) != 1 or fl[0][1] != 1:
            return False, f"la parentesi {g} si scompone ancora: {fl}"
    return True, ""


# ---------------------------------------------------------------------------
# Helpers on the problem


def terms_of(latex):
    """A polynomial written as a sum of monomials -> list of SymPy monomials, in written order."""
    s = latex.strip()
    parts = re.split(r"\s([+-])\s", s)
    out = [parse(parts[0])]
    for k in range(1, len(parts), 2):
        t = parse(parts[k + 1])
        out.append(-t if parts[k] == "-" else t)
    return out


def content(ts):
    """MCD of the terms: positive gcd of the integer coefficients, common letters with the minimum exponent."""
    return reduce(gcd, ts)


def bracket_of_pair(a, b):
    g = gcd(a, b)
    return expand((a + b) / g)


def pair_works(a, b, c, d):
    A, B = bracket_of_pair(a, b), bracket_of_pair(c, d)
    return expand(A - B) == 0 or expand(A + B) == 0


def top_terms(latex):
    """Split at +/- outside brackets -> list of (sign, latex)."""
    out, depth, cur, sign = [], 0, "", 1
    k = 0
    s = latex.strip()
    if s.startswith("-"):
        sign, s = -1, s[1:]
    while k < len(s):
        ch = s[k]
        if ch in "([":
            depth += 1
        elif ch in ")]":
            depth -= 1
        if depth == 0 and ch in "+-" and k > 0 and s[k - 1] == " ":
            out.append((sign, cur.strip()))
            sign = -1 if ch == "-" else 1
            cur = ""
        else:
            cur += ch
        k += 1
    out.append((sign, cur.strip()))
    return out


def group_leads_positive(inner_toks):
    return bool(inner_toks) and inner_toks[0] != "-"


def univariate_decreasing(ts):
    syms = set().union(*[t.free_symbols for t in ts])
    if len(syms) != 1:
        return True
    v = next(iter(syms))
    degs = [Poly(t, v).degree() for t in ts]
    return all(a > b for a, b in zip(degs, degs[1:]))


# ---------------------------------------------------------------------------


def check(sample):
    errs = []
    lvl = sample["level"]
    prob = sample["problem"]
    params = sample.get("params", {})
    if sample.get("prompt") != "Scomponi in fattori.":
        return [f"unexpected prompt {sample.get('prompt')!r}"], None
    errs += forbidden(prob)
    try:
        E = parse(prob)
    except ParseError as e:
        return [f"problem does not parse ({e}): {prob}"], None
    truth = expand(E)
    syms = sorted(truth.free_symbols, key=lambda s: s.name)
    TP = Poly(truth, *syms)
    if any(abs(c) > MAX_COEF or not c.is_integer for c in TP.coeffs()):
        errs.append(f"coefficient out of range in {truth}")

    # answer
    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "factored":
        errs.append("answer is not a factored expression")
    try:
        if not same(val(ans["value"]), truth):
            errs.append(f"answer value {ans['value']} != {truth}")
        if not same(parse(ans["latex"]), truth):
            errs.append(f"answer latex {ans['latex']} != {truth}")
    except (ParseError, ValueError) as e:
        return errs + [f"answer does not parse ({e})"], None
    errs += forbidden(ans["latex"], "answer")
    ok, why = completeness(ans["latex"])
    if not ok:
        errs.append(f"answer is not a complete factorization: {why}")
        return errs, None
    front, groups = structure(ans["latex"])
    for g, _, inner in groups:
        if not group_leads_positive(inner):
            errs.append(f"answer bracket starts with a minus: {g}")
    for text in bracket_texts(ans["latex"]):
        errs += poly_normal_form_errors(text, "answer bracket")

    # the problem, level by level
    kind = None
    if lvl in (1, 2, 3, 5, 6):
        errs += poly_normal_form_errors(prob, "problem")
        ts = terms_of(prob)
        if not same(sum(ts), truth):
            errs.append("problem terms do not add up")
        if not univariate_decreasing(ts):
            errs.append(f"problem not in decreasing powers: {prob}")
        M = content(ts)
        first_neg = ts[0].as_coeff_Mul()[0] < 0
        n = len(ts)
        nv = len(syms)
        if lvl <= 3:
            if len(groups) != 1:
                errs.append("total factoring must give one bracket")
            want = -M if lvl == 3 else M
            if expand(front - want) != 0:
                errs.append(f"front {front} is not {'the opposite of ' if lvl == 3 else ''}the MCD {M}")
            if first_neg != (lvl == 3):
                errs.append("sign of the first term does not match the level")
            if M == 1:
                errs.append("no common factor")
            if not 2 <= n <= 3:
                errs.append(f"{n} terms")
            Mc, Me = mono_parts(M)
            if lvl == 1:
                if nv != 1:
                    errs.append("level 1 has one letter")
                kind = "numero" if not Me else "lettera" if Mc == 1 else "numero e lettera"
            elif lvl == 2:
                if nv != 2 or n != 3 or not Me:
                    errs.append("level 2: two letters, three terms, MCD with letters")
                kind = "uno" if any(same(t, M) or same(t, -M) for t in ts) else "senza uno"
            else:
                if nv > 2:
                    errs.append("level 3: at most two letters")
                kind = "monomio" if Me else "numero"
        else:
            if len(groups) != 2:
                errs.append("partial factoring must give two brackets")
            if first_neg:
                errs.append("first term negative")
            if n == 6:
                kind = "sei termini"
                if M != 1 or not all(pair_works(ts[0], ts[1], ts[2 * i], ts[2 * i + 1]) for i in (1, 2)):
                    errs.append("six terms: the three pairs must give the same bracket")
            elif n == 4 and M != 1:
                kind = "totale poi parziale"
                if not (M.is_Integer and M >= 2) or expand(front - M) != 0:
                    errs.append(f"total factoring first: MCD {M}, front {front}")
                inner = [expand(t / M) for t in ts]
                if not pair_works(*inner):
                    errs.append("after the total factoring the pairs do not give the same bracket")
            elif n == 4:
                if front != 1:
                    errs.append(f"front {front} without a common factor")
                if pair_works(*ts):
                    kind = "una lettera" if nv == 1 else "più lettere"
                    if lvl == 6:
                        errs.append("level 6 with four terms needs a reordering")
                else:
                    kind = "riordino"
                    if gcd(ts[0], ts[1]) != 1:
                        errs.append("reordering: the first two terms have a common factor")
                    if not (pair_works(ts[0], ts[2], ts[1], ts[3]) or pair_works(ts[0], ts[3], ts[1], ts[2])):
                        errs.append("no grouping works")
                    if nv < 2:
                        errs.append("reordering with one letter")
            else:
                errs.append(f"{n} terms")
            if lvl == 5 and kind not in ("una lettera", "più lettere"):
                errs.append(f"level 5 with case {kind}")
            if lvl == 6 and kind not in ("riordino", "sei termini", "totale poi parziale"):
                errs.append(f"level 6 with case {kind}")
    elif lvl == 4:
        tt = top_terms(prob)
        if len(tt) != 2:
            return errs + [f"level 4 needs two terms: {prob}"], None
        parts = []
        for sg, t in tt:
            try:
                f, gs = structure(t)
            except NotProduct as e:
                return errs + [f"level 4 term {t!r} is not a product ({e})"], None
            if len(gs) != 1:
                return errs + [f"level 4 term {t!r} has {len(gs)} brackets"], None
            parts.append((sg * f, gs[0][0], gs[0][1]))
        (f1, g1, k1), (f2, g2, k2) = parts
        if k1 == 2 and k2 == 1 and f1 == 1 and f2.is_Integer and same(g1, g2):
            kind = "quadrato"
        elif k1 == 1 and k2 == 1 and same(g1, g2):
            kind = "uguali"
        elif k1 == 1 and k2 == 1 and same(g1, -g2):
            kind = "opposti"
        else:
            errs.append(f"level 4 shape not recognised: {prob}")
        if front != 1 or len(groups) != 2:
            errs.append("level 4 answer: two brackets, nothing in front")
        elif not same(groups[0][0], g1):
            errs.append("level 4: the first bracket of the answer is not the common factor as written first")
        if f1.as_coeff_Mul()[0] < 0:
            errs.append("level 4: first term negative")
    else:
        return [f"unknown level {lvl}"], None

    if kind and params.get("case") != kind:
        errs.append(f"params.case {params.get('case')!r} but the problem is {kind!r}")

    # choice
    ch = sample.get("choice")
    if ch is None:
        errs.append("no choice variant")
    else:
        opts = ch.get("options", [])
        if len(opts) != 4:
            errs.append(f"choice has {len(opts)} options")
        lat = [o.get("latex", "") for o in opts]
        if len(set(lat)) != len(lat):
            errs.append("choice options with the same latex")
        right = []
        for i, o in enumerate(opts):
            try:
                lines = option_lines(o.get("latex", ""))
            except ValueError as e:
                errs.append(str(e))
                continue
            for line in lines:
                errs += forbidden(line, "option line")
            lt = " ".join(lines)
            try:
                v = val(o["values"][0])
                pv = parse(lt)
            except (ParseError, ValueError, KeyError, IndexError) as e:
                errs.append(f"option {lt!r} does not parse ({e})")
                continue
            if not same(pv, v):
                errs.append(f"option latex {lt} != value {o['values'][0]}")
            equal = same(pv, truth)
            complete, why = completeness(lt)
            if equal and complete:
                right.append(i)
        if len(right) != 1:
            errs.append(f"{len(right)} options are complete factorizations of {truth}: {[lat[i] for i in right]}")
        if ch.get("correct") not in right or lat[ch.get("correct")] != ans["latex"]:
            errs.append(f"choice.correct {ch.get('correct')} does not point at the answer")

    errs += check_steps(sample)
    return errs, kind


_GATHERED = re.compile(r"\\begin\{gathered\}(.*)\\end\{gathered\}", re.S)


def option_lines(latex):
    """The lines of an option: one, or two or three inside \\begin{gathered} ... \\end{gathered},
    separated by \\\\. A line after the first must start with a sign (the break goes before a + or a
    - at the outer level), and the joined lines are read as one expression."""
    m = _GATHERED.fullmatch(latex.strip())
    if not m:
        if "gathered" in latex or "\\\\" in latex:
            raise ValueError(f"malformed multi-line option: {latex}")
        return [latex]
    lines = [x.strip() for x in m.group(1).split("\\\\")]
    if not 2 <= len(lines) <= 3 or any(not x for x in lines):
        raise ValueError(f"option with {len(lines)} lines: {latex}")
    for x in lines[1:]:
        if x[0] not in "+-":
            raise ValueError(f"line break not before a sign: {latex}")
    for x in lines[:-1]:
        depth = 0
        for chh in x:
            depth += chh in "([" 
            depth -= chh in ")]"
        if depth != 0:
            raise ValueError(f"line break inside a bracket: {latex}")
    return lines


def bracket_texts(latex):
    """Contents of the top-level round brackets."""
    out, depth, start = [], 0, 0
    for k, ch in enumerate(latex):
        if ch == "(":
            if depth == 0:
                start = k + 1
            depth += 1
        elif ch == ")":
            depth -= 1
            if depth == 0:
                out.append(latex[start:k])
    return out
