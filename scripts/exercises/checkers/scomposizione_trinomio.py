"""Checker for scomposizione-trinomio, from specs/exercises/scomposizione-trinomio.md and lesson 36.

Written from the spec, not from the generator: the trinomial is read back from the problem LaTeX,
SymPy factors it over the integers (factor_list), and the answer is accepted only if it has the
same value AND is factored to the end: an integer (or monomial) in front and then factors that are
each primitive and irreducible over Z. The level shape and the case are recomputed from the
trinomial itself. In the multiple choice exactly one option is right in this sense; an option
equal in value to the trinomial but not factored to the end ("stopped too early") is a legitimate
distractor, and is counted as such.
"""
import re

from sympy import Poly, factor_list, sqrt

from checkers.monomi_common import (
    SYMS,
    ParseError,
    check_steps,
    forbidden,
    parse,
    poly_normal_form_errors,
    same,
    val,
)

MAX_COEF = 100

CASE_RANGES = {
    2: {"negativi": (0.23, 0.43), "p negativo, s positivo": (0.23, 0.43), "p negativo, s negativo": (0.23, 0.43)},
    3: {"fattore numerico": (0.23, 0.43), "fattore con la lettera": (0.23, 0.43), "segno meno": (0.23, 0.43)},
    4: {"irriducibile": (0.30, 0.50), "scomponibile": (0.50, 0.70)},
    5: {"a positivo": (0.60, 0.80), "a negativo": (0.08, 0.23), "fattore comune": (0.08, 0.23)},
    6: {"primo coefficiente 1": (0.35, 0.55), "primo coefficiente diverso da 1": (0.25, 0.45), "monomio al posto della lettera": (0.12, 0.30)},
    7: {"due differenze di quadrati": (0.25, 0.45), "una differenza di quadrati": (0.35, 0.55), "nessun fattore si scompone": (0.12, 0.30)},
}

IRR_LATEX = "\\text{irriducibile}"

# Options equal in value to the trinomial but not factored to the end, seen so far (for reports).
STOPPED_EARLY = []

_PREFIX = re.compile(r"^(-?)([^()]*)((?:\([^()]*\)(?:\^\d)?)+)$")
_GROUP = re.compile(r"\(([^()]*)\)(?:\^(\d))?")


def split_factored(latex):
    """"-2x(x - 5)(x + 3)^2" -> (prefix value, [(factor value, exponent), ...]).
    Raises ParseError if the string is not a prefix followed by parenthesised factors."""
    m = _PREFIX.fullmatch(latex.strip())
    if not m:
        raise ParseError(f"not a factored form: {latex}")
    sign, pre, groups = m.groups()
    pre = pre.strip()
    pv = parse(pre) if pre else 1
    if sign:
        pv = -pv
    fs = [(parse(g), int(k) if k else 1) for g, k in _GROUP.findall(groups)]
    return pv, fs


def complete_errors(latex):
    """Why a factored form is not factored to the end over Z (empty list: it is)."""
    try:
        pv, fs = split_factored(latex)
    except ParseError as e:
        return [str(e)]
    errs = []
    pc, pf = factor_list(pv)
    if not pc.is_Integer:
        errs.append(f"non-integer coefficient in front: {latex}")
    for f, k in fs:
        syms = sorted(f.free_symbols, key=lambda s: s.name)
        if not syms or Poly(f, *syms).total_degree() < 1:
            errs.append(f"constant factor in parentheses: {latex}")
            continue
        c, lst = factor_list(f)
        if abs(c) != 1:
            errs.append(f"factor {f} still has the integer factor {abs(c)}: {latex}")
        if sum(e for _, e in lst) != 1:
            errs.append(f"factor {f} is not irreducible: {latex}")
    return errs


def poly_of(e):
    syms = sorted(e.free_symbols, key=lambda s: s.name)
    return Poly(e, *syms), syms


def classify(level, e):
    """Level shape and case, recomputed from the trinomial. Returns (errors, case)."""
    errs = []
    P, syms = poly_of(e)
    terms = P.terms()
    names = [s.name for s in syms]
    coeffs = [int(c) for _, c in terms]
    if len(terms) != 3:
        return [f"not a trinomial: {e}"], None
    if any(abs(c) > MAX_COEF for c in coeffs):
        errs.append(f"coefficient over {MAX_COEF}: {e}")
    content, facs = factor_list(e)
    nfac = sum(k for _, k in facs)
    case = None
    if level in (1, 2, 4) or level == 7:
        if len(syms) != 1:
            return errs + ["one letter expected"], None
        v = syms[0]
        deg = 4 if level == 7 else 2
        exps = sorted((m[0] for m, _ in terms), reverse=True)
        if exps != [deg, deg // 2, 0] or P.LC() != 1:
            return errs + [f"expected {v}^{deg} + s{v}^{deg // 2} + p with leading 1: {e}"], None
        s, p = P.coeff_monomial(v ** (deg // 2)), P.coeff_monomial(1)
        if level in (1, 2):
            if nfac != 2 or len(facs) != 2:
                errs.append(f"levels 1-2 need two distinct linear factors: {e}")
            if level == 1:
                case = "positivi"
                if not (s > 0 and p > 0):
                    errs.append("level 1: s and p positive")
            else:
                case = "negativi" if p > 0 and s < 0 else "p negativo, s positivo" if p < 0 and s > 0 else "p negativo, s negativo" if p < 0 else None
                if case is None:
                    errs.append("level 2: not s > 0 with p > 0")
        elif level == 4:
            case = "irriducibile" if nfac == 1 else "scomponibile"
            if nfac not in (1, 2) or (nfac == 2 and len(facs) != 2):
                errs.append(f"level 4: irreducible or two distinct factors: {e}")
            if case == "irriducibile" and sqrt(s**2 - 4 * p).is_Integer:
                errs.append("irreducible trinomial with a square discriminant")
        else:
            # x^4 + s x^2 + p = (x^2 + m)(x^2 + n): the two numbers are integers, m != n
            disc = s**2 - 4 * p
            if not (disc > 0 and sqrt(disc).is_Integer):
                return errs + [f"level 7: no integer pair with sum {s} and product {p}"], None
            lin = sum(k for f, k in facs if Poly(f, v).degree() == 1)
            case = {4: "due differenze di quadrati", 2: "una differenza di quadrati", 0: "nessun fattore si scompone"}.get(lin)
            if case is None or any(k != 1 for _, k in facs):
                errs.append(f"level 7: unexpected factorization {facs}")
    elif level == 3:
        if len(syms) != 1:
            return errs + ["one letter expected"], None
        v = syms[0]
        mono_part = [f for f, _ in facs if f == v]
        rest = [(f, k) for f, k in facs if f != v]
        if len(rest) != 2 or any(Poly(f, v).degree() != 1 or k != 1 for f, k in rest):
            errs.append(f"level 3: after collecting, two distinct linear factors: {e}")
        if mono_part:
            case = "fattore con la lettera"
        elif content == -1:
            case = "segno meno"
        elif content >= 2:
            case = "fattore numerico"
        else:
            errs.append(f"level 3: nothing to collect: {e}")
        if case != "segno meno" and content < 0:
            errs.append("level 3: negative factor in front only in the minus case")
    elif level == 5:
        if len(syms) != 1:
            return errs + ["one letter expected"], None
        v = syms[0]
        if P.degree() != 2:
            errs.append("level 5: degree 2")
        lin = [(f, k) for f, k in facs]
        if len(lin) != 2 or any(Poly(f, v).degree() != 1 or k != 1 for f, k in lin):
            errs.append(f"level 5: two distinct linear factors: {facs}")
        elif all(abs(Poly(f, v).LC()) == 1 for f, _ in lin):
            errs.append("level 5: a factor with leading coefficient other than 1 is needed")
        case = "a negativo" if content == -1 else "fattore comune" if content >= 2 else "a positivo" if content == 1 else None
        if case is None:
            errs.append(f"level 5: unexpected content {content}")
    elif level == 6:
        if len(syms) != 2 or names not in (["x", "y"], ["a", "b"]):
            return errs + [f"level 6: letters x, y or a, b: {e}"], None
        u, w = syms
        if content != 1 or len(facs) != 2 or any(k != 1 for _, k in facs):
            errs.append(f"level 6: two distinct primitive factors: {e}")
        if all(P.degree(u) == 2 and P.degree(w) == 2 and m[0] == m[1] for m, _ in terms) and sorted(m[0] for m, _ in terms) == [0, 1, 2]:
            case = "monomio al posto della lettera"
            if P.coeff_monomial(u**2 * w**2) != 1:
                errs.append("level 6: (xy)^2 with coefficient 1")
        elif all(sum(m) == 2 for m, _ in terms) and sorted(m[0] for m, _ in terms) == [0, 1, 2]:
            case = "primo coefficiente 1" if P.coeff_monomial(u**2) == 1 else "primo coefficiente diverso da 1"
            if P.coeff_monomial(u**2) < 1:
                errs.append("level 6: positive first coefficient")
        else:
            errs.append(f"level 6: unexpected shape {e}")
    else:
        errs.append(f"unknown level {level}")
    return errs, case


def order_errors(latex):
    """Terms by decreasing powers of the first letter (alphabetically)."""
    parts = re.split(r"\s[+-]\s", latex.strip())
    try:
        vals = [parse(t.lstrip("-")) for t in parts]
    except ParseError as e:
        return [f"problem term does not parse ({e})"]
    syms = sorted(set().union(*[v.free_symbols for v in vals]), key=lambda s: s.name)
    if not syms:
        return ["no letters"]
    v = syms[0]
    degs = [Poly(t, v).degree() if t.has(v) else 0 for t in vals]
    return [] if degs == sorted(degs, reverse=True) and len(set(degs)) == len(degs) else [f"terms not by decreasing powers of {v}: {latex}"]


def check(sample):
    errs = []
    lvl = sample["level"]
    prob = sample["problem"]
    want_prompt = "Scomponi in fattori, se possibile." if lvl == 4 else "Scomponi in fattori."
    if sample.get("prompt") != want_prompt:
        errs.append(f"prompt {sample.get('prompt')!r}, expected {want_prompt!r}")
    errs += forbidden(prob)
    errs += poly_normal_form_errors(prob, "problem")
    errs += order_errors(prob)
    try:
        e = parse(prob)
    except ParseError as ex:
        return [f"problem does not parse ({ex})"], None
    cerrs, case = classify(lvl, e)
    errs += cerrs
    if sample["params"].get("case") != case:
        errs.append(f"params.case {sample['params'].get('case')!r}, the trinomial is {case!r}")
    content, facs = factor_list(e)
    irreducible = abs(content) == 1 and sum(k for _, k in facs) == 1

    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "factored":
        errs.append("answer must be an expression with form 'factored'")
    else:
        if not same(val(ans["value"]), e):
            errs.append(f"answer value {ans['value']} != problem")
        if irreducible:
            if ans["latex"] != prob:
                errs.append("irreducible trinomial: the answer is the trinomial itself")
            if "irriducibile" not in sample.get("solution", ""):
                errs.append("irreducible trinomial: the solution must say so")
        else:
            try:
                if not same(parse(ans["latex"]), e):
                    errs.append(f"answer latex {ans['latex']} != problem")
            except ParseError as ex:
                errs.append(f"answer latex does not parse ({ex})")
            errs += complete_errors(ans["latex"])
            errs += forbidden(ans["latex"], "answer")
    if irreducible and lvl != 4:
        errs.append("irreducible trinomial outside level 4")

    errs += check_steps(sample)
    errs += check_choice(sample, e, irreducible)
    return errs, case


def check_choice(sample, e, irreducible):
    errs = []
    ch = sample.get("choice")
    if ch is None:
        return ["no choice variant"]
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"choice has {len(opts)} options, expected 4")
    right = []
    forms = []
    for i, o in enumerate(opts):
        lt = o.get("latex", "")
        vals = o.get("values", [])
        if len(vals) != 1:
            errs.append(f"option without exactly one value: {o}")
            continue
        if lt == IRR_LATEX:
            if vals[0] != "irriducibile":
                errs.append("'irriducibile' option with a value")
            if sample["level"] != 4:
                errs.append("'irriducibile' option outside level 4")
            forms.append(("irr",))
            if irreducible:
                right.append(i)
            continue
        errs += forbidden(lt, "option")
        try:
            v = parse(lt)
            pv, fs = split_factored(lt)
        except ParseError as ex:
            errs.append(f"option does not parse ({ex}): {lt}")
            continue
        if not same(v, val(vals[0])):
            errs.append(f"option latex {lt} != value {vals[0]}")
        forms.append((pv, tuple(sorted(str(f.expand()) + f"^{k}" for f, k in fs))))
        if same(v, e):
            if complete_errors(lt):
                STOPPED_EARLY.append(lt)  # a real "not factored to the end" distractor, wrong for that reason
            elif not irreducible:
                right.append(i)
    if len(set(forms)) != len(forms):
        errs.append(f"choice options not distinct: {[o.get('latex') for o in opts]}")
    if len(right) != 1:
        errs.append(f"{len(right)} right options: {[o.get('latex') for o in opts]}")
    elif ch.get("correct") != right[0]:
        errs.append(f"choice.correct {ch.get('correct')} but the right option is {right[0]}")
    return errs
