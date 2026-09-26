"""Checker for polinomi-espressioni, from specs/exercises/polinomi-espressioni.md and lesson 31.

The expression is parsed from the problem LaTeX with the textbook order of operations (the parser
of monomi_common: juxtaposition before \\cdot and :, then + and -), expanded with SymPy and
compared with the answer, which must be an expanded polynomial in normal form, ordered by
decreasing powers of the first letter (then of the second). The structure of each level (which
notable products appear and in which form) is read again from the text: top-level terms, their
factors and the terms written inside each bracket.
"""
import copy
import re

from sympy import Poly, Rational, expand, igcd, sympify

from checkers.monomi_common import (
    SYMS,
    ParseError,
    bracket_errors,
    check_choice,
    check_steps,
    forbidden,
    parse,
    parse_tokens,
    poly_normal_form_errors,
    same,
    tokenize,
    val,
)

CASES6 = [
    "somma per differenza in disordine",
    "quadrato con i segni negativi",
    "fattori opposti",
    "tre fattori",
    "binomio al posto di un termine",
]

CASE_RANGES = {
    1: {"due prodotti": (0.5, 0.8), "due prodotti e un monomio": (0.2, 0.5)},
    2: {"numero davanti": (0.3, 0.7), "meno davanti": (0.3, 0.7)},
    3: {"due lettere": (0.6, 0.9), "grado più alto": (0.1, 0.4)},
    5: {"monomio davanti alla potenza": (0.5, 0.8), "numero davanti alla potenza": (0.2, 0.5)},
    6: {c: (0.1, 0.32) for c in CASES6},
}

MAX_WIDTH = {1: 32, 2: 40, 3: 44, 4: 36, 5: 36, 6: 32, 7: 56}
MAX_ANSWER_WIDTH = {1: 22, 2: 22, 3: 22, 4: 22, 5: 22, 6: 22, 7: 26}
MAX_OPTION_WIDTH = 30
# Lines for the phone: a problem wider than LINE (estimated) is written as
# \begin{aligned}&line 1\\&\quad line 2 ...\end{aligned}, a new line before a + or a -.
LINE = 26
# Answer buttons: an option wider than OPTION_LINE is written as
# \begin{gathered}line 1 \\ line 2\end{gathered}, a new line before a + or a -.
OPTION_LINE = 20
GATHERED = re.compile(r"^\\begin\{gathered\}(.*)\\end\{gathered\}$", re.S)
ALIGNED = re.compile(r"^\\begin\{aligned\}&(.*)\\end\{aligned\}$", re.S)
PROMPT = "Semplifica l'espressione e ordina il risultato."

OPENERS = ("(", "[", "\\{")
CLOSERS = (")", "]", "\\}")


def width(latex):
    """Visible width as the spec defines it."""
    s = re.sub(r"\\left|\\right", "", latex)
    s = re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", lambda m: "#" * max(len(m.group(1)), len(m.group(2))), s)
    s = s.replace("\\cdot", "*").replace("\\{", "{").replace("\\}", "}")
    s = re.sub(r"\^\{([^{}]*)\}", r"\1", s).replace("^", "")
    return len(re.sub(r"\s", "", s))


# ---------------------------------------------------------------------------
# Reading the structure of the text


def split_terms(toks):
    """Top-level algebraic terms: [(sign, tokens)]."""
    out, cur, sign, depth = [], [], 1, 0
    for t in toks:
        if depth == 0 and t in ("+", "-"):
            if cur:
                out.append((sign, cur))
                cur = []
                sign = 1
            sign = -sign if t == "-" else sign
            continue
        if t in OPENERS or t == "{":
            depth += 1
        elif t in CLOSERS or t == "}":
            depth -= 1
        cur.append(t)
    if cur:
        out.append((sign, cur))
    return out


def items_of(toks):
    """Factors of a term: ("mono", tokens) for a run of loose tokens, ("br", kind, inner tokens,
    exponent) for a bracket, ("op", op) for \\cdot and :."""
    items, i, loose = [], 0, []

    def flush():
        if loose:
            items.append(("mono", list(loose)))
            loose.clear()

    while i < len(toks):
        t = toks[i]
        if t in OPENERS:
            flush()
            depth, j = 1, i + 1
            while depth:
                if toks[j] in OPENERS:
                    depth += 1
                elif toks[j] in CLOSERS:
                    depth -= 1
                j += 1
            inner = toks[i + 1 : j - 1]
            exp = 1
            if j < len(toks) and toks[j] == "^":
                exp = int(toks[j + 1])
                j += 2
            items.append(("br", t, inner, exp))
            i = j
        elif t in ("\\cdot", ":"):
            flush()
            items.append(("op", t))
            i += 1
        else:
            loose.append(t)
            i += 1
    flush()
    return items


def written_terms(inner):
    """Values of the terms written inside a bracket, in the written order."""
    return [s * parse_tokens(t) for s, t in split_terms(inner)]


def is_monomial(e):
    e = expand(e)
    return e != 0 and not e.is_Add


def lex(e, gens):
    """Exponent tuple of a monomial along the letters in alphabetical order."""
    return Poly(e, *gens).monoms()[0] if gens else ()


def is_canonical_binomial(ts, gens):
    """First written term positive and first in the ordering: (x - 3), (2x + y), not (3 - x) or (-x - 3)."""
    lead = max(ts, key=lambda t: lex(t, gens))
    return same(ts[0], lead) and Poly(ts[0], *gens).coeffs()[0] > 0 if gens else ts[0] > 0


def sd_kind(f1, f2, gens):
    """Two binomials: 'std' sum times difference with the common term first and positive,
    'disordine' a sum times difference written otherwise, 'opposti', 'uguali' or None."""
    if len(f1) != 2 or len(f2) != 2:
        return None
    a, b = sum(f1), sum(f2)
    if same(a + b, 0):
        return "opposti"
    if same(a, b):
        return "uguali"
    if not (is_monomial(a + b) and is_monomial(a - b)):
        return None
    s = expand((a + b) / 2)
    pos = Poly(s, *gens).coeffs()[0] > 0 if gens and s.free_symbols else s > 0
    if same(f1[0], s) and same(f2[0], s) and pos:
        return "std"
    return "disordine"


def describe(term_toks, gens):
    """A summary of a top-level term: coefficient tokens, list of (inner terms, exponent), ops."""
    its = items_of(term_toks)
    brs = [(written_terms(it[2]), it[3], it[1], it[2]) for it in its if it[0] == "br"]
    monos = [it[1] for it in its if it[0] == "mono"]
    ops = [it[1] for it in its if it[0] == "op"]
    lead_mono = its[0][1] if its and its[0][0] == "mono" else None
    return {"brs": brs, "monos": monos, "ops": ops, "coef": lead_mono}


# ---------------------------------------------------------------------------


def check(sample):
    errs = []
    lvl = sample["level"]
    prob, line_errs = unfold(sample["problem"])
    errs += line_errs
    if sample.get("prompt") != PROMPT:
        errs.append(f"unexpected prompt {sample.get('prompt')!r}")
    errs += forbidden(prob)
    try:
        truth = expand(parse(prob))
    except (ParseError, ZeroDivisionError) as e:
        return [f"problem does not parse ({e}): {prob}"], None
    gens = sorted(truth.free_symbols | parse(prob).free_symbols, key=lambda s: s.name)
    if not truth.is_polynomial(*gens):
        return errs + [f"result {truth} is not a polynomial"], None
    P = Poly(truth, *gens)
    if len(P.terms()) < 2:
        errs.append(f"result has fewer than two terms: {truth}")
    for c in P.coeffs():
        c = Rational(c)
        if abs(c.p) > 60 or c.q > 36:
            errs.append(f"result coefficient out of range: {c}")

    # answer: value, LaTeX, normal form, order
    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "expanded":
        errs.append("answer must be an expression in expanded form")
    try:
        if not same(val(ans["value"]), truth):
            errs.append(f"answer {ans.get('value')} != {truth}")
        if not same(parse(ans["latex"]), truth):
            errs.append(f"answer latex {ans['latex']} != {truth}")
    except (ParseError, ValueError) as e:
        errs.append(f"answer does not parse ({e})")
    errs += poly_normal_form_errors(ans.get("latex", ""))
    errs += forbidden(ans.get("latex", ""), "answer")
    errs += order_errors(ans.get("latex", ""), gens, "answer")
    res = sample["params"].get("result", [])
    got = sum(Rational(m["c"]) * sympify("*".join(f"{v}**{k}" for v, k in m["e"].items()) or "1", locals=SYMS) for m in res)
    if not same(got, truth):
        errs.append(f"params.result {got} != {truth}")

    # numbers written in the text
    for m in re.finditer(r"\\frac\{(\d+)\}\{(\d+)\}|(?<![\^\d{])(\d+)", prob):
        if m.group(3):
            n = int(m.group(3))
            if n > (36 if lvl == 7 else 12):
                errs.append(f"number out of range in the problem: {n}")
        elif int(m.group(2)) > 4 or int(m.group(1)) > 12:
            errs.append(f"fraction out of range in the problem: {m.group(0)}")
    w = width(prob)
    if w > MAX_WIDTH.get(lvl, 0):
        errs.append(f"problem too wide for a phone: {w} > {MAX_WIDTH.get(lvl)}")

    if width(ans.get("latex", "")) > MAX_ANSWER_WIDTH.get(lvl, 0):
        errs.append(f"answer too wide for a phone: {ans.get('latex')}")
    # options: layout for the answer button, then read back on one line
    flat_sample = copy.deepcopy(sample)
    for o in (flat_sample.get("choice") or {}).get("options", []):
        o["latex"], oerrs = unfold_option(o.get("latex", ""))
        errs += oerrs
        if width(o["latex"]) > MAX_OPTION_WIDTH:
            errs.append(f"option too wide for a phone: {o['latex']}")

    berrs, top = bracket_errors(prob)
    errs += berrs
    toks = tokenize(prob)
    terms = [(s, describe(t, gens)) for s, t in split_terms(toks)]
    powers = [e for _, d in terms for (_, e, _, _) in d["brs"] if e > 1]
    errs += common_factor_errors(prob)
    has_frac = "\\frac" in prob
    nlet = len(gens)

    kind = None
    if lvl in (1, 2, 3, 4, 5, 6):
        if top > 1 or ":" in toks:
            errs.append(f"level {lvl}: only round brackets, no division")
        if any(d["ops"] for _, d in terms):
            errs.append(f"level {lvl}: no \\cdot or : between factors")
    if lvl == 1:
        if powers or has_frac or nlet != 1:
            errs.append("level 1: no powers, no fractions, one letter")
        pairs = [d for _, d in terms if len(d["brs"]) == 2]
        if not pairs or not any(len(d["brs"]) == 1 and d["coef"] for _, d in terms):
            errs.append("level 1: a product of two binomials and a monomial times a binomial")
        for d in pairs:
            if sd_kind(d["brs"][0][0], d["brs"][1][0], gens) is not None:
                errs.append("level 1: a notable product where there should be none")
        kind = "due prodotti e un monomio" if any(not d["brs"] for _, d in terms) else "due prodotti"
    elif lvl == 2:
        if has_frac or nlet != 1 or any(e != 2 for e in powers) or not powers:
            errs.append("level 2: squares of binomials in one letter, no fractions")
        numbered = False
        minus_notable = False
        for s, d in terms:
            notable = False
            if len(d["brs"]) == 2:
                if sd_kind(d["brs"][0][0], d["brs"][1][0], gens) != "std":
                    errs.append("level 2: a product of two binomials that is not a sum times a difference in standard form")
                notable = True
            elif len(d["brs"]) == 1 and d["brs"][0][1] == 2:
                if not is_canonical_binomial(d["brs"][0][0], gens):
                    errs.append("level 2: square of a binomial not in standard form")
                notable = True
            if notable and d["coef"]:
                numbered = True
            if notable and s < 0:
                minus_notable = True
        if not minus_notable:
            errs.append("level 2: no minus in front of a notable product")
        kind = "numero davanti" if numbered else "meno davanti"
    elif lvl == 3:
        if has_frac or any(e != 2 for e in powers) or not powers:
            errs.append("level 3: squares only, no fractions")
        high = any(Poly(t, *gens).total_degree() >= 2 for _, d in terms for (ts, _, _, _) in d["brs"] for t in ts)
        if nlet == 1 and not high:
            errs.append("level 3: two letters or a monomial of degree 2 or more in a bracket")
        if nlet > 2:
            errs.append("level 3: at most two letters")
        kind = "due lettere" if nlet == 2 else "grado più alto"
    elif lvl == 4:
        if not has_frac or nlet != 1 or any(e != 2 for e in powers) or not powers:
            errs.append("level 4: squares with fractions, one letter")
        if not any(e == 2 and any(not Rational(Poly(t, *gens).coeffs()[0]).is_integer for t in ts) for _, d in terms for (ts, e, _, _) in d["brs"]):
            errs.append("level 4: the squared binomial has no fraction")
    elif lvl == 5:
        if has_frac or nlet != 1 or powers.count(3) != 1:
            errs.append("level 5: exactly one cube of a binomial, one letter, no fractions")
        inside = [d for _, d in terms if d["coef"] and len(d["brs"]) == 1 and d["brs"][0][1] == 2]
        if not inside:
            errs.append("level 5: no power inside a product")
        else:
            c = parse_tokens(inside[0]["coef"])
            kind = "monomio davanti alla potenza" if c.free_symbols else "numero davanti alla potenza"
    elif lvl == 6:
        if has_frac or 3 in powers:
            errs.append("level 6: no fractions, no cubes")
        found = []
        for _, d in terms:
            brs = d["brs"]
            if len(brs) == 3:
                ok = any(sd_kind(brs[i][0], brs[j][0], gens) in ("std", "disordine") for i in range(3) for j in range(i + 1, 3))
                found.append("tre fattori" if ok else "tre fattori senza somma per differenza")
            elif len(brs) == 2 and len(brs[0][0]) == 3 and len(brs[1][0]) == 3:
                found.append("binomio al posto di un termine" if block_ok(brs[0][0], brs[1][0]) else "trinomi senza blocco")
            elif len(brs) == 2:
                k = sd_kind(brs[0][0], brs[1][0], gens)
                if k == "disordine":
                    found.append("somma per differenza in disordine")
                elif k == "opposti":
                    found.append("fattori opposti")
                elif k != "std" or d["coef"]:
                    found.append(f"prodotto inatteso ({k})")
            elif len(brs) == 1 and brs[0][1] == 2 and not is_canonical_binomial(brs[0][0], gens):
                found.append("quadrato con i segni negativi")
        if len(found) != 1 or found[0] not in CASES6:
            errs.append(f"level 6: expected exactly one notable product to recognise, found {found}")
        else:
            kind = found[0]
    elif lvl == 7:
        if top != 3:
            errs.append("level 7: round, square and curly brackets")
        if ":" not in toks or "\\cdot" not in toks:
            errs.append("level 7: a division by a monomial and a product by a monomial")
        if not re.search(r"\((?:[^()]*[+-]){2}[^()]*\)\^2", prob):
            errs.append("level 7: the square of a trinomial")
        if has_frac and not re.search(r"\\cdot \\left\(-?\\frac\{\d\}\{\d\}[a-z]\\right\)$", prob):
            errs.append("level 7: a fraction only in the final monomial")
    else:
        errs.append(f"unknown level {lvl}")

    case = sample["params"].get("case")
    if kind is not None and case != kind:
        errs.append(f"params.case {case!r} but the text is {kind!r}")

    errs += check_steps(sample)
    errs += check_choice(flat_sample, truth)
    for o in (flat_sample.get("choice") or {}).get("options", []):
        errs += order_errors(o.get("latex", ""), gens, "option")
    return errs, kind


def block_ok(f1, f2):
    """(a + b)(a - b) with a or b a binomial: the two trinomials have a common part and an opposite part."""
    a, b = sum(f1), sum(f2)
    common, opposite = expand((a + b) / 2), expand((a - b) / 2)
    return common != 0 and opposite != 0 and (common.is_Add or opposite.is_Add)


def order_errors(latex, gens, where):
    """Terms written by decreasing powers of the first letter, then of the second."""
    try:
        ts = [s * parse_tokens(t) for s, t in split_terms(tokenize(latex))]
    except ParseError as e:
        return [f"{where} does not parse ({e}): {latex}"]
    keys = [lex(t, gens) if t.free_symbols else tuple(0 for _ in gens) for t in ts]
    if any(k1 <= k2 for k1, k2 in zip(keys, keys[1:])):
        return [f"{where} not ordered by decreasing powers: {latex}"]
    return []


def common_factor_errors(latex):
    """A bracket that contains only monomials with integer coefficients has no common numeric
    factor, as in the lesson's examples; the dividend of a division by a monomial is excepted."""
    errs = []
    toks = tokenize(latex)
    stack = []
    for i, t in enumerate(toks):
        if t in OPENERS:
            stack.append(i)
        elif t in CLOSERS:
            j = stack.pop()
            inner = toks[j + 1 : i]
            if any(x in OPENERS for x in inner) or "\\frac" in inner:
                continue
            if i + 1 < len(toks) and toks[i + 1] == ":":
                continue
            try:
                ts = [s * parse_tokens(tt) for s, tt in split_terms(inner)]
            except ParseError:
                continue
            if len(ts) < 2:
                continue
            coeffs = [abs(Rational(Poly(t, *sorted(t.free_symbols, key=lambda s: s.name)).coeffs()[0])) if t.free_symbols else abs(Rational(t)) for t in ts]
            g = coeffs[0]
            for c in coeffs[1:]:
                g = igcd(g, c)
            if g > 1:
                errs.append(f"bracket with a common factor {g}: {latex}")
    return errs


def est_width(latex):
    """Width in character units as the spec defines it: visible width plus 0.6 per fraction."""
    return width(latex) + 0.6 * latex.count("\\frac")


def unfold(problem):
    """The problem on one line, and the errors of its layout. An aligned block must be needed (the
    expression does not fit LINE), each line must fit (LINE - 2 after the \\quad), every line after
    the first starts with + or -, and no \\left ... \\right pair is cut."""
    errs = []
    m = ALIGNED.match(problem)
    if not m:
        if est_width(problem) > LINE:
            errs.append(f"problem wider than {LINE} on one line: {problem}")
        if re.search(r"aligned|&|\\\\|\\quad", problem):
            errs.append(f"malformed layout: {problem}")
        return problem, errs
    lines = m.group(1).split("\\\\&\\quad ")
    if len(lines) < 2 or len(lines) > 3:
        errs.append(f"{len(lines)} lines")
    for i, ln in enumerate(lines):
        if re.search(r"aligned|&|\\\\|\\quad", ln):
            errs.append(f"malformed line {i + 1}: {ln}")
        if i > 0 and not re.match(r"[+-] ", ln):
            errs.append(f"line {i + 1} does not start with + or -: {ln}")
        if ln.count("\\left") != ln.count("\\right"):
            errs.append(f"a \\left ... \\right pair is cut at line {i + 1}: {ln}")
        if est_width(ln) > (LINE if i == 0 else LINE - 2):
            errs.append(f"line {i + 1} too wide for a phone: {ln}")
    flat = " ".join(lines)
    if est_width(flat) <= LINE:
        errs.append(f"problem split although it fits one line: {flat}")
    return flat, errs


def unfold_option(latex):
    """An option on one line, and the errors of its layout: two or three lines only when one does
    not fit OPTION_LINE, each line within it, every line after the first starting with + or -."""
    errs = []
    m = GATHERED.match(latex)
    if not m:
        if est_width(latex) > OPTION_LINE:
            errs.append(f"option wider than {OPTION_LINE} on one line: {latex}")
        if re.search(r"gathered|\\\\", latex):
            errs.append(f"malformed option: {latex}")
        return latex, errs
    lines = m.group(1).split(" \\\\ ")
    if not 2 <= len(lines) <= 3:
        errs.append(f"option with {len(lines)} lines: {latex}")
    for i, ln in enumerate(lines):
        if re.search(r"gathered|\\\\", ln):
            errs.append(f"malformed option line: {ln}")
        if i > 0 and not re.match(r"[+-] ", ln):
            errs.append(f"option line {i + 1} does not start with + or -: {ln}")
        if ln.count("\\left") != ln.count("\\right"):
            errs.append(f"option cuts a \\left ... \\right pair: {ln}")
        if est_width(ln) > OPTION_LINE:
            errs.append(f"option line too wide for the button: {ln}")
    flat = " ".join(lines)
    if est_width(flat) <= OPTION_LINE:
        errs.append(f"option split although it fits one line: {flat}")
    return flat, errs
