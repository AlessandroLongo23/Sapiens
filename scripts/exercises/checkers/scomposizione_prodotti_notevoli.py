"""Checker for scomposizione-prodotti-notevoli, from specs/exercises/scomposizione-prodotti-notevoli.md
and lesson 35 (docs/lezioni/riscritte/35-scomposizione-prodotti-notevoli.md).

The polynomial is parsed from the problem LaTeX; the answer and every option are parsed from their
LaTeX as a product k·(f1)^e1·(f2)^e2... . An answer is right when the product equals the polynomial
and the factorization is complete in Z: every bracket is primitive (no integer or letter common to
its terms) and irreducible (SymPy's factor_list finds a single factor). The case of each level is
read from SymPy's own factorization of the problem, not from params. In the multiple-choice variant
exactly one option is right; every other one is either a different polynomial ("sbagliata") or the
same polynomial not factored to the end ("incompleta"), and levels 5 and 6 must offer at least one
"incompleta" (the lesson's "fermarsi troppo presto")."""
import re

from sympy import Poly, cancel, expand, factor_list, igcd

from checkers.monomi_common import (
    ParseError,
    check_steps,
    forbidden,
    mono_parts,
    parse,
    poly_normal_form_errors,
    symbols_of,
    val,
)

MAX_COEF = 250
MAX_OPTION_COEF = 700

CASE_RANGES = {
    1: {"lettera e numero": (0.40, 0.70), "due lettere": (0.30, 0.60)},
    2: {"lettera e numero": (0.45, 0.75), "due lettere": (0.25, 0.55)},
    3: {"lettera e numero": (0.50, 0.80), "due lettere": (0.20, 0.50)},
    4: {"cubo di un binomio": (0.45, 0.75), "quadrato di un trinomio": (0.25, 0.55)},
    5: {"differenza di quadrati": (0.20, 0.50), "quadrato di un binomio": (0.20, 0.50), "somma o differenza di cubi": (0.15, 0.45)},
    6: {"due differenze di quadrati": (0.20, 0.50), "base binomia": (0.20, 0.50), "sesta potenza": (0.03, 0.20), "raccoglimento parziale": (0.10, 0.30)},
}

EXPECTED_TERMS = {1: {2}, 2: {3}, 3: {2}, 4: {4, 6}, 5: {2, 3}, 6: {2, 4}}


class FormError(Exception):
    pass


def parse_factored(latex):
    """"-2x(x + 2)(x - 2)", "(3a - 2b)^2" -> (k, [(bracket latex, bracket expr, exponent)]).
    k is the monomial in front (1 or -1 when nothing or only a sign is written)."""
    s = latex.strip()
    i = s.find("(")
    if i < 0:
        raise FormError(f"no bracket: {latex}")
    prefix = s[:i].strip()
    if prefix in ("", "-"):
        k = -1 if prefix == "-" else 1
    else:
        k = parse(prefix)
        if mono_parts(k) is None:
            raise FormError(f"prefix {prefix!r} is not a monomial")
    factors = []
    while i < len(s):
        if s[i] != "(":
            raise FormError(f"unexpected {s[i:]!r} in {latex}")
        depth, j = 0, i
        while True:
            if s[j] == "(":
                depth += 1
            elif s[j] == ")":
                depth -= 1
                if depth == 0:
                    break
            j += 1
            if j >= len(s):
                raise FormError(f"unbalanced brackets: {latex}")
        inner = s[i + 1 : j]
        if "(" in inner:
            raise FormError(f"nested bracket in a factor: {latex}")
        e = 1
        j += 1
        m = re.match(r"\^(\d)", s[j:])
        if m:
            e = int(m.group(1))
            if e < 2:
                raise FormError(f"exponent {e}: {latex}")
            j += 2
        factors.append((inner, parse(inner), e))
        i = j
    return k, factors


GATHERED = re.compile(r"^\\begin\{gathered\}(.*)\\end\{gathered\}$", re.S)


def unwrap_option(latex):
    """An option too wide for the answer button is written on 2 or 3 lines,
    \\begin{gathered} A \\\\ B \\end{gathered}, broken between two factors: every line after the
    first starts with a bracket. Returns the one-line product and the list of problems."""
    m = GATHERED.match(latex.strip())
    if not m:
        return latex, []
    lines = [l.strip() for l in m.group(1).split("\\\\")]
    errs = []
    if not 2 <= len(lines) <= 3:
        errs.append(f"option on {len(lines)} lines: {latex}")
    if any(not l for l in lines):
        errs.append(f"empty line in option: {latex}")
    for l in lines[1:]:
        if l and not (l.startswith("(") or l.startswith("\\cdot")):
            errs.append(f"line not starting with a factor: {l!r}")
    joined = "".join(re.sub(r"^\\cdot\s*", "", l) if i else l for i, l in enumerate(lines))
    return joined, errs


def product(k, factors):
    out = k
    for _, f, e in factors:
        out = out * f**e
    return expand(out)


def bracket_problems(factors):
    """Why a written factorization is not complete in Z: a bracket with a common factor, a bracket
    that still splits, a factor repeated instead of raised to a power."""
    probs = []
    for lt, f, _ in factors:
        syms = symbols_of(f)
        if not syms:
            probs.append(f"bracket without letters: ({lt})")
            continue
        P = Poly(f, *syms)
        if len(P.terms()) < 2:
            probs.append(f"bracket with a single term: ({lt})")
            continue
        coefs = [int(c) for c in P.coeffs()]
        g = 0
        for c in coefs:
            g = igcd(g, c)
        if g != 1:
            probs.append(f"bracket with common factor {g}: ({lt})")
        mins = [min(m[i] for m in P.monoms()) for i in range(len(syms))]
        if any(mins):
            probs.append(f"bracket with a common letter: ({lt})")
        c, fl = factor_list(f)
        if len(fl) != 1 or fl[0][1] != 1:
            probs.append(f"bracket that still splits: ({lt}) = {c}*{fl}")
    for a in range(len(factors)):
        for b in range(a + 1, len(factors)):
            r = cancel(factors[a][1] / factors[b][1])
            if r.is_number:
                probs.append(f"factor repeated: ({factors[a][0]}) and ({factors[b][0]})")
    return probs


def grlex_key(e, syms):
    m = Poly(e, *syms).monoms()[0]
    return (sum(m), m)


def tdeg(e):
    syms = symbols_of(e)
    return Poly(e, *syms).total_degree() if syms else 0


def style_errors(k, factors, latex, where):
    """The lesson's way of writing: terms of each bracket in normal form, by decreasing degree,
    first term positive; a negative polynomial has the minus sign in front."""
    errs = forbidden(latex, where)
    for lt, f, _ in factors:
        errs += poly_normal_form_errors(lt, where)
        terms = [t for t in re.split(r"\s[+-]\s", lt.strip())]
        if lt.strip().startswith("-"):
            errs.append(f"{where}: bracket starts with a minus: ({lt})")
        degs = [tdeg(parse(t)) for t in terms]
        if degs != sorted(degs, reverse=True):
            errs.append(f"{where}: bracket not ordered by decreasing degree: ({lt})")
    return errs


def problem_terms(latex):
    """The signed terms of the problem, as written."""
    s = latex.strip()
    parts = re.split(r"\s([+-])\s", s)
    terms = [parts[0]] + [("-" if parts[i] == "-" else "") + parts[i + 1] for i in range(1, len(parts), 2)]
    return terms


def classify(level, truth_list, nterms, has_content):
    """The case of the exercise from SymPy's factorization of the problem."""
    fs = [(f, e) for f, e in truth_list]
    polys = [(f, e) for f, e in fs if len(Poly(f, *symbols_of(f)).terms()) >= 2]
    nletters = None
    if level in (1, 2, 3):
        f = polys[0][0]
        nletters = len(symbols_of(f))
        return "due lettere" if nletters >= 2 else "lettera e numero"
    if level == 4:
        return "cubo di un binomio" if nterms == 4 else "quadrato di un trinomio"
    if level == 5:
        if len(polys) == 1 and polys[0][1] == 2:
            return "quadrato di un binomio"
        tdeg = sorted(Poly(f, *symbols_of(f)).total_degree() for f, _ in polys)
        if tdeg == [1, 2] or (len(polys) == 2 and len(set(tdeg)) == 2):
            return "somma o differenza di cubi"
        return "differenza di quadrati"
    n = sum(e for _, e in polys)
    if len(polys) == 4:
        return "sesta potenza"
    if any(e == 2 for _, e in polys):
        return "raccoglimento parziale"
    if len(polys) == 3:
        return "due differenze di quadrati"
    if len(polys) == 2 and nterms == 4:
        return "base binomia"
    return f"sconosciuto ({n} fattori)"


def shape_errors(level, kind, k, factors, P_lead_negative):
    """What the answer must look like at each level."""
    errs = []
    exps = sorted(e for _, _, e in factors)
    n = len(factors)
    kc = mono_parts(k)[0] if not isinstance(k, int) else k
    has_k = not (k == 1)
    if level in (1, 2, 3, 4) and has_k:
        errs.append(f"level {level}: no common factor expected, found {k}")
    if level == 1 and not (n == 2 and exps == [1, 1]):
        errs.append("level 1: two factors (sum and difference) expected")
    if level == 2 and not (n == 1 and exps == [2]):
        errs.append("level 2: one squared binomial expected")
    if level == 3 and not (n == 2 and exps == [1, 1]):
        errs.append("level 3: a binomial and a false square expected")
    if level == 4 and not (n == 1 and exps in ([3], [2])):
        errs.append("level 4: a cube or a squared trinomial expected")
    if level == 5 and not has_k:
        errs.append("level 5: a common factor expected")
    if P_lead_negative and not (kc < 0):
        errs.append("first term negative: the minus sign goes in front")
    if not P_lead_negative and kc < 0:
        errs.append("minus sign in front of a positive-leading polynomial")
    if level == 6 and has_k and kind != "due differenze di quadrati":
        errs.append("level 6: common factor only with the fourth powers")
    return errs


def check(sample):
    errs = []
    lvl = sample["level"]
    if sample.get("prompt") != "Scomponi in fattori il polinomio.":
        errs.append(f"unexpected prompt {sample.get('prompt')!r}")
    prob = sample["problem"]
    errs += forbidden(prob)
    errs += poly_normal_form_errors(prob, "problem")
    try:
        P = expand(parse(prob))
    except ParseError as e:
        return [f"problem does not parse ({e})"], None
    syms = symbols_of(P)
    PP = Poly(P, *syms)
    terms = problem_terms(prob)
    nterms = len(terms)
    if nterms != len(PP.terms()):
        errs.append("problem has similar terms not reduced")
    if nterms not in EXPECTED_TERMS.get(lvl, set()):
        errs.append(f"level {lvl}: {nterms} terms in the problem")
    if any(abs(int(c)) > MAX_COEF for c in PP.coeffs()):
        errs.append(f"coefficient over {MAX_COEF}: {prob}")
    lead_negative = prob.strip().startswith("-")

    c0, truth_list = factor_list(P)
    content_mono = c0
    for f, e in truth_list:
        if len(Poly(f, *symbols_of(f)).terms()) == 1:
            content_mono = content_mono * f**e
    has_content = content_mono != 1
    if lvl in (1, 2, 3, 4) and content_mono != 1:
        errs.append(f"level {lvl}: the problem has a common factor {content_mono}")
    if lvl == 5 and content_mono == 1:
        errs.append("level 5: the problem has no common factor")
    kind = classify(lvl, truth_list, nterms, has_content)
    # graded order: higher total degree first, then higher powers of the earlier letter; with a
    # binomial base the square trinomial comes first and -c^2 last, as in the lesson
    keyed = [grlex_key(parse(t), syms) for t in terms]
    if kind == "base binomia":
        keyed = keyed[:3]
        if not terms[3].startswith("-"):
            errs.append(f"base binomia: the last term must be -c^2: {prob}")
    if keyed != sorted(keyed, reverse=True):
        errs.append(f"problem not in decreasing graded order: {prob}")
    if sample["params"].get("case") != kind:
        errs.append(f"params.case {sample['params'].get('case')!r} != {kind!r}")

    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "factored":
        errs.append("answer is not a factored expression")
    try:
        k, factors = parse_factored(ans["latex"])
    except (FormError, ParseError) as e:
        return errs + [f"answer latex is not a product ({e})"], kind
    if expand(product(k, factors) - P) != 0:
        errs.append(f"answer {ans['latex']} != problem {prob}")
    if expand(val(ans["value"]) - product(k, factors)) != 0:
        errs.append("answer value differs from its latex")
    errs += [f"answer not complete: {p}" for p in bracket_problems(factors)]
    errs += style_errors(k, factors, ans["latex"], "answer")
    errs += shape_errors(lvl, kind, k, factors, lead_negative)
    # the number of irreducible factors matches SymPy's
    n_truth = sum(e for f, e in truth_list if len(Poly(f, *symbols_of(f)).terms()) >= 2)
    if sum(e for _, _, e in factors) != n_truth:
        errs.append(f"answer has {sum(e for _, _, e in factors)} irreducible factors, SymPy {n_truth}")
    if sample.get("solution") != f"{prob} = {ans['latex']}":
        errs.append("solution differs from problem = answer")

    errs += check_steps(sample)
    errs += check_choice(sample, P, lvl)
    return errs, kind


def check_choice(sample, P, lvl):
    errs = []
    ch = sample.get("choice")
    if ch is None:
        return ["no choice variant"]
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"choice has {len(opts)} options, expected 4")
    right, incomplete, wrong_vals = [], 0, []
    latexes = [unwrap_option(o.get("latex", ""))[0] for o in opts]
    if len(set(latexes)) != len(latexes):
        errs.append("two options with the same latex")
    for i, o in enumerate(opts):
        lt, werrs = unwrap_option(o.get("latex", ""))
        errs += werrs
        try:
            k, factors = parse_factored(lt)
        except (FormError, ParseError) as e:
            errs.append(f"option {lt!r} is not a product ({e})")
            continue
        v = product(k, factors)
        if len(o.get("values", [])) != 1 or expand(val(o["values"][0]) - v) != 0:
            errs.append(f"option value differs from its latex: {lt}")
        errs += style_errors(k, factors, lt, "option")
        if any(abs(int(c)) > MAX_OPTION_COEF for c in Poly(v, *symbols_of(v)).coeffs()):
            errs.append(f"option with huge coefficients: {lt}")
        if expand(v - P) == 0:
            probs = bracket_problems(factors)
            if probs:
                incomplete += 1
            else:
                right.append(i)
        else:
            if any(expand(v - w) == 0 for w in wrong_vals):
                errs.append(f"two wrong options with the same value: {lt}")
            wrong_vals.append(v)
    if len(right) != 1:
        errs.append(f"{len(right)} options are complete factorizations of the problem")
    elif ch.get("correct") != right[0]:
        errs.append(f"choice.correct {ch.get('correct')} does not point at the right option {right[0]}")
    else:
        ans_latex = sample["answer"]["latex"]
        if unwrap_option(opts[right[0]].get("latex", ""))[0] != ans_latex:
            errs.append("the right option is not written as the answer")
    if lvl in (5, 6) and incomplete == 0:
        # base binomia has no natural "stopped too early" product: allowed there only
        kind = sample["params"].get("case")
        if kind != "base binomia":
            errs.append("no 'not factored to the end' option at level 5 or 6")
    return errs
