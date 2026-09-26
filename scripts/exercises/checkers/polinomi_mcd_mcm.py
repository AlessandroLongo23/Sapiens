"""Checker for polinomi-mcd-mcm, from specs/exercises/polinomi-mcd-mcm.md and lesson 38.

The polynomials are parsed from the problem LaTeX and factored again with SymPy's factor_list over
the integers (gens in alphabetical order, so every factor has its first term positive in
decreasing powers of the first letter: x - 3, never 3 - x). MCD and MCM are recomputed with the
lesson's rule: numeric factor = MCD (MCM) of the absolute values when all numeric factors are
integers, 1 when at least one is a fraction; MCD = common factors with the lowest exponent,
MCM = all factors with the highest.

The answer must be the only accepted form: positive integer numeric factor first (omitted when 1),
then the letters in alphabetical order, then each irreducible factor in parentheses once, with its
exponent, in increasing degree; a single factor x - 2 alone is written without parentheses.
"""
import re
from functools import reduce

from sympy import Integer, Poly, Rational, expand, factor_list, igcd, ilcm

from checkers.monomi_common import SYMS, ParseError, check_steps, forbidden, parse, val

CASE_RANGES = {lvl: {"MCD": (0.35, 0.65), "MCM": (0.35, 0.65)} for lvl in range(1, 8)}

ORD = ["primo", "secondo", "terzo"]
PROMPT = re.compile(r"Calcola il (MCD|MCM) dei polinomi e scrivilo scomposto in fattori\.")


def split_problem(prob):
    """The list of polynomials: on one line separated by ',\\quad ', or one per line in
    \\begin{aligned}&P_1, \\\\ &P_2\\end{aligned} (every line but the last ends with a comma)."""
    m = re.fullmatch(r"\\begin\{aligned\}(.*)\\end\{aligned\}", prob, re.S)
    if not m:
        if "aligned" in prob or "\\\\" in prob or "&" in prob:
            return [], [f"malformed multi-line problem: {prob}"]
        return prob.split(",\\quad "), []
    lines = [l.strip() for l in m.group(1).split("\\\\")]
    errs = []
    texts = []
    for i, l in enumerate(lines):
        if not l.startswith("&"):
            errs.append(f"line {i + 1} does not start with &: {l}")
        body = l[1:].strip()
        last = i == len(lines) - 1
        if last == body.endswith(","):
            errs.append(f"line {i + 1}: the comma goes at the end of every line but the last: {l}")
        body = body.rstrip(",").strip()
        if not body or ",\\quad" in body or "&" in body:
            errs.append(f"line {i + 1} must hold exactly one polynomial: {l}")
        texts.append(body)
    if len(lines) < 2:
        errs.append("multi-line problem with one line")
    return texts, errs


def split_terms(latex):
    """'x^2 - 4x + 4' -> ['x^2', '-4x', '4'] (problem polynomials have no brackets)."""
    s = latex.strip()
    parts = re.split(r"\s([+-])\s", s)
    return [parts[0]] + [("-" if parts[i] == "-" else "") + parts[i + 1] for i in range(1, len(parts), 2)]


def exps_of(term, gens):
    P = Poly(term, *gens)
    (monom, coeff), = P.terms()
    return monom, coeff


def order_errors(latex, gens, where, allow_ascending):
    """Terms in decreasing powers (lex on gens), first term positive; a polynomial whose leading
    term is negative is written in increasing powers instead (9 - x^2)."""
    errs = []
    terms = split_terms(latex)
    if terms[0].startswith("-"):
        errs.append(f"{where} starts with a minus: {latex}")
    try:
        info = [exps_of(parse(t), gens) for t in terms]
    except (ParseError, ValueError) as e:
        return [f"{where}: term does not parse ({e}): {latex}"]
    ms = [m for m, _ in info]
    if len(set(ms)) != len(ms):
        errs.append(f"{where}: similar terms not collected: {latex}")
    desc = all(a > b for a, b in zip(ms, ms[1:]))
    asc = all(a < b for a, b in zip(ms, ms[1:]))
    lead_negative = info and max(info)[1] < 0
    if lead_negative:
        if not (allow_ascending and asc):
            errs.append(f"{where}: negative leading term must be written in increasing powers: {latex}")
    elif not desc:
        errs.append(f"{where}: not in decreasing powers: {latex}")
    return errs


def tdeg(f, gens):
    return Poly(f, *gens).total_degree()


def is_letter(f, gens):
    return f in gens


def canonical_errors(latex, truth, gens):
    """The only accepted written form of an MCD or MCM, and its value."""
    errs = []
    s = latex.strip()
    if "(" not in s and re.search(r"\s[+-]\s", s):
        # a single factor, bare: x - 2
        try:
            f = parse(s)
        except ParseError as e:
            return [f"answer does not parse ({e}): {latex}"]
        errs += group_errors(s, f, gens)
        if expand(f - truth) != 0:
            errs.append(f"answer {latex} != {truth}")
        return errs
    m = re.fullmatch(r"(?P<num>\d+)?(?P<lit>(?:[a-z](?:\^\d)?)*)(?P<groups>(?:\([^()]*\)(?:\^\d)?)*)", s)
    if not m:
        return [f"answer is not in factored form: {latex}"]
    num, lit, groups = m.group("num"), m.group("lit"), m.group("groups")
    if num is not None and (num.startswith("0") or (num == "1" and (lit or groups))):
        errs.append(f"numeric factor written badly: {latex}")
    if not num and not lit and not groups:
        errs.append("empty answer")
    value = Integer(int(num)) if num else Integer(1)
    letters = re.findall(r"([a-z])(?:\^(\d))?", lit)
    names = [v for v, _ in letters]
    if names != sorted(names) or len(set(names)) != len(names):
        errs.append(f"letters not in alphabetical order or repeated: {latex}")
    for v, k in letters:
        if k and int(k) < 2:
            errs.append(f"letter exponent {k}: {latex}")
        if SYMS[v] not in gens:
            errs.append(f"letter {v} not in the problem")
        value *= SYMS[v] ** (int(k) if k else 1)
    gs = re.findall(r"\(([^()]*)\)(?:\^(\d))?", groups)
    if len(gs) == 1 and not num and not lit and not gs[0][1]:
        errs.append(f"a single factor must be written without parentheses: {latex}")
    seen = []
    degs = []
    for body, k in gs:
        if k and int(k) < 2:
            errs.append(f"factor exponent {k}: {latex}")
        try:
            f = parse(body)
        except ParseError as e:
            errs.append(f"factor does not parse ({e}): {body}")
            continue
        errs += group_errors(body, f, gens)
        if any(expand(f - g) == 0 for g in seen):
            errs.append(f"factor {body} written twice: {latex}")
        seen.append(f)
        degs.append(tdeg(f, gens))
        value *= f ** (int(k) if k else 1)
    if degs != sorted(degs):
        errs.append(f"factors not in increasing degree: {latex}")
    if expand(value - truth) != 0:
        errs.append(f"answer {latex} = {expand(value)} != {truth}")
    return errs


def group_errors(body, f, gens):
    """A factor in parentheses: at least two terms, irreducible in Z, primitive, first term positive
    in decreasing powers (x - 3, not 3 - x)."""
    errs = []
    P = Poly(f, *gens)
    if len(P.terms()) < 2:
        errs.append(f"factor {body} is not a polynomial with two or more terms")
        return errs
    c, fl = factor_list(f, *gens)
    if c != 1 or len(fl) != 1 or fl[0][1] != 1:
        errs.append(f"factor {body} is not irreducible, primitive, with positive first term (factor_list {c}, {fl})")
    errs += order_errors(body, gens, f"factor {body}", allow_ascending=False)
    return errs


def without_ruffini(fl, gens, level):
    """After the numeric factor and the letters, what is left has degree <= 2, or at level 6 is a
    sum or difference of cubes."""
    rest = [(f, e) for f, e in fl if not is_letter(f, gens)]
    deg = sum(e * tdeg(f, gens) for f, e in rest)
    if deg <= 2:
        return True
    if level != 6 or len(rest) != 2 or any(e != 1 for _, e in rest):
        return False
    prod = Poly(expand(rest[0][0] * rest[1][0]), *gens)
    return len(prod.terms()) == 2 and prod.total_degree() == 3


def check(sample):
    errs = []
    lvl = sample["level"]
    m = PROMPT.fullmatch(sample.get("prompt", ""))
    if not m:
        return [f"unexpected prompt {sample.get('prompt')!r}"], None
    kind = m.group(1)
    prob = sample["problem"]
    errs += forbidden(prob)
    texts, split_errs = split_problem(prob)
    if split_errs:
        return split_errs, kind
    if len(texts) != len(sample["params"].get("polys", [])):
        errs.append(f"problem has {len(texts)} polynomials, params {len(sample['params'].get('polys', []))}")
    try:
        exprs = [parse(t) for t in texts]
    except ParseError as e:
        return [f"problem does not parse ({e})"], None
    gens = sorted(set().union(*[e.free_symbols for e in exprs]), key=lambda s: s.name)
    if [g.name for g in gens] not in (["x"], ["x", "y"], ["a", "b"]):
        errs.append(f"letters {gens}: expected x, or x and y, or a and b")
        return errs, kind

    polys = []  # (c, {factor: exponent})
    for t, e in zip(texts, exprs):
        errs += order_errors(t, gens, "problem polynomial", allow_ascending=True)
        P = Poly(e, *gens)
        if len(P.terms()) < 2:
            errs.append(f"{t} is a monomial")
        for co in P.coeffs():
            co = Rational(co)
            if abs(co.p) > 60 or co.q > 9:
                errs.append(f"coefficient {co} out of range in {t}")
        if P.total_degree() > 4:
            errs.append(f"degree over 4: {t}")
        c, fl = factor_list(e, *gens)
        c = Rational(c)
        if sum(k for _, k in fl) < 2 and abs(c) == 1:
            errs.append(f"{t} is already irreducible")
        if not without_ruffini(fl, gens, lvl):
            errs.append(f"{t} needs Ruffini")
        polys.append((c, {f: k for f, k in fl}))
    for i in range(len(polys)):
        for j in range(i + 1, len(polys)):
            if expand(exprs[i] / polys[i][0] - exprs[j] / polys[j][0]) == 0:
                errs.append("two proportional polynomials")

    cs = [c for c, _ in polys]
    ints = all(c.is_integer for c in cs)
    table = []  # (factor, [exponent in each polynomial])
    for _, fd in polys:
        for f in fd:
            if not any(expand(f - g) == 0 for g, _ in table):
                table.append((f, [next((k for g, k in fd2.items() if expand(g - f) == 0), 0) for _, fd2 in polys]))

    def rule(which):
        if ints:
            coef = Integer(reduce(igcd if which == "MCD" else ilcm, [abs(int(c)) for c in cs]))
        else:
            coef = Integer(1)
        value = coef
        fs = []
        for f, es in table:
            if which == "MCD":
                if min(es) > 0:
                    value *= f ** min(es)
                    fs.append(f)
            else:
                value *= f ** max(es)
                fs.append(f)
        return coef, fs, value

    coef, fs, truth = rule(kind)
    mcd_coef, mcd_fs, _ = rule("MCD")
    mcm_coef, mcm_fs, mcm_val = rule("MCM")
    if len(mcm_fs) > 5 or Poly(mcm_val, *gens).total_degree() > 7 or mcm_coef > 60:
        errs.append("MCM too long")
    if not mcd_fs and lvl != 1:
        errs.append("polynomials without common factors outside level 1")

    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "factored":
        errs.append("answer must be an expression in factored form")
    else:
        try:
            if expand(val(ans["value"]) - truth) != 0:
                errs.append(f"answer value {ans['value']} != {kind} {truth}")
        except ValueError as e:
            errs.append(str(e))
        errs += canonical_errors(ans["latex"], truth, gens)
        errs += forbidden(ans["latex"], "answer")
    if sample["params"].get("case") != kind:
        errs.append("params.case differs from the prompt")

    n = len(polys)
    one = len(gens) == 1
    pos = all(c > 0 for c in cs)
    max_e = max(k for _, fd in polys for k in fd.values())
    quad = any(tdeg(f, gens) == 2 for f, _ in table)
    if lvl == 1:
        if n != 2 or not one or not ints or not pos or max_e != 1 or quad:
            errs.append("level 1: two polynomials in x, exponents 1, positive integer numeric factors")
    elif lvl == 2:
        if n != 2 or not one or not ints or not pos or quad:
            errs.append("level 2: two polynomials in x, positive integer numeric factors")
        if not any(min(es) > 0 and len(set(es)) > 1 for _, es in table):
            errs.append("level 2: no common factor with different exponents")
    elif lvl == 3:
        if n != 3 or not one or not ints or not pos or quad:
            errs.append("level 3: three polynomials in x, positive integer numeric factors")
    elif lvl == 4:
        if n not in (2, 3) or not one or not ints or pos or quad:
            errs.append("level 4: 2 or 3 polynomials, at least one negative numeric factor")
        x = gens[0]
        ok = False
        for c, fd in polys:
            if c < 0:
                for f, k in fd.items():
                    a = -Poly(f, x).coeff_monomial(1)
                    if Poly(f, x).degree() == 1 and a > 0 and k % 2 == 1 and any(expand(f - g) == 0 for g in mcd_fs):
                        ok = True
        if not ok:
            errs.append("level 4: no common factor written as a - x")
    elif lvl == 5:
        if n != 2 or len(gens) != 2 or not ints or not pos:
            errs.append("level 5: two polynomials in two letters")
        for e in exprs:
            if e.free_symbols != set(gens):
                errs.append("level 5: each polynomial has both letters")
    elif lvl == 6:
        if n not in (2, 3) or not one or not ints or not pos or not quad:
            errs.append("level 6: 2 or 3 polynomials, one with a false square")
    elif lvl == 7:
        if n != 2 or not one or ints or not pos or max_e != 1 or quad:
            errs.append("level 7: two polynomials, at least one fractional numeric factor")
    else:
        errs.append(f"unknown level {lvl}")

    errs += check_steps(sample)
    errs += text_steps(sample, texts, polys, table, kind, cs, ints, gens)
    errs += check_choice(sample, truth, gens)
    return errs, kind


def text_steps(sample, texts, polys, table, kind, cs, ints, gens):
    errs = []
    steps = sample.get("steps") or []
    seen_poly = []
    seen_fac = []
    final = False
    for st in steps:
        m = re.match(r"\\text\{(Primo|Secondo|Terzo) polinomio: \} (.*)$", st)
        if m:
            i = ORD.index(m.group(1).lower())
            seen_poly.append(i)
            if i >= len(texts) or not m.group(2).startswith(texts[i] + " = "):
                errs.append(f"factorisation step of a different polynomial: {st}")
            continue
        m = re.search(r"\\text\{(MCD|MCM)\}\(([\d,\\ ]+)\) = (\d+)$", st)
        if m:
            nums = [int(k) for k in re.findall(r"\d+", m.group(2))]
            f = igcd if m.group(1) == "MCD" else ilcm
            if not ints or m.group(1) != kind or nums != [abs(int(c)) for c in cs] or int(m.group(3)) != reduce(f, nums):
                errs.append(f"wrong numeric step: {st}")
            continue
        if "c'è una frazione" in st and ints:
            errs.append(f"fraction step with integer numeric factors: {st}")
        m = re.match(r"\\text\{Fattore \} (.+?)\\text\{: (.*)$", st)
        if m:
            try:
                f = parse(m.group(1))
            except ParseError as e:
                errs.append(f"factor step does not parse ({e}): {st}")
                continue
            row = next((es for g, es in table if expand(g - f) == 0), None)
            if row is None:
                errs.append(f"factor step about a factor that is not in the polynomials: {st}")
                continue
            seen_fac.append(f)
            rest = m.group(2)
            present = [k for k in row if k > 0]
            mm = re.search(r"esponenti \} (.*)\\text\{, il (minimo|massimo) è \} (\d+)$", rest)
            if mm:
                listed = [int(k) for k in re.findall(r"\d+", mm.group(1))]
                want = min(present) if mm.group(2) == "minimo" else max(present)
                if listed != present or int(mm.group(3)) != want or (mm.group(2) == "minimo") != (kind == "MCD"):
                    errs.append(f"wrong factor step: {st}")
                if kind == "MCD" and 0 in row:
                    errs.append(f"factor not common but its minimum is taken: {st}")
                continue
            mm = re.match(r"manca nel (primo|secondo|terzo) polinomio, quindi non entra nel MCD\}$", rest)
            if mm:
                if kind != "MCD" or row[ORD.index(mm.group(1))] != 0:
                    errs.append(f"wrong 'manca' step: {st}")
                continue
            mm = re.match(r"compare solo nel (primo|secondo|terzo) polinomio, con esponente \} (\d+)$", rest)
            if mm:
                i = ORD.index(mm.group(1))
                if kind != "MCM" or len(present) != 1 or row[i] != int(mm.group(2)):
                    errs.append(f"wrong 'compare solo' step: {st}")
                continue
            errs.append(f"unrecognised factor step: {st}")
            continue
        m = re.fullmatch(r"\\text\{(MCD|MCM)\} = (.*)", st)
        if m:
            final = True
            if m.group(1) != kind or m.group(2) != sample["answer"].get("latex"):
                errs.append(f"final step differs from the answer: {st}")
    if sorted(seen_poly) != list(range(len(texts))):
        errs.append("not every polynomial is factored in the steps")
    if len(seen_fac) != len(table):
        errs.append(f"steps discuss {len(seen_fac)} factors, the polynomials have {len(table)}")
    if not final:
        errs.append("no final step")
    return errs


def join_option(latex):
    """An option on one line, or on 2-3 lines in \\begin{gathered} broken only between two factors
    (the lines are then read as one product). Returns (one-line latex, errors)."""
    m = re.fullmatch(r"\\begin\{gathered\}(.*)\\end\{gathered\}", latex, re.S)
    if not m:
        if "gathered" in latex or "\\\\" in latex:
            return latex, [f"malformed multi-line option: {latex}"]
        return latex, []
    lines = [l.strip() for l in m.group(1).split("\\\\")]
    errs = []
    if not 2 <= len(lines) <= 3 or any(not l for l in lines):
        errs.append(f"option on {len(lines)} lines: {latex}")
    for a, b in zip(lines, lines[1:]):
        if not b.startswith("(") or a.count("(") != a.count(")"):
            errs.append(f"option broken inside a factor: {latex}")
    return "".join(lines), errs


def check_choice(sample, truth, gens):
    """4 distinct options; exactly one equal to the truth, written in the accepted form; none equal
    to the opposite of the truth (3 - x instead of x - 3 is not wrong, lesson's ad-note)."""
    errs = []
    ch = sample.get("choice")
    if ch is None:
        return ["no choice variant"]
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"choice has {len(opts)} options, expected 4")
    vals = []
    for o in opts:
        if len(o.get("values", [])) != 1:
            return errs + [f"option without exactly one value: {o}"]
        v = val(o["values"][0])
        vals.append(v)
        lt, jerrs = join_option(o.get("latex", ""))
        errs += jerrs
        errs += forbidden(lt, "option")
        try:
            if expand(parse(lt) - v) != 0:
                errs.append(f"option latex {lt} != value {o['values'][0]}")
        except ParseError as e:
            errs.append(f"option latex does not parse ({e}): {lt}")
        if expand(v + truth) == 0:
            errs.append(f"option {lt} is the opposite of the answer")
    for i in range(len(vals)):
        for j in range(i + 1, len(vals)):
            if expand(vals[i] - vals[j]) == 0:
                errs.append(f"choice options {i} and {j} are equal")
    matching = [i for i, v in enumerate(vals) if expand(v - truth) == 0]
    if len(matching) != 1:
        errs.append(f"{len(matching)} options equal the truth {truth}")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not (0 <= idx < len(opts)) or expand(vals[idx] - truth) != 0:
        errs.append(f"choice.correct {idx} does not point at the truth")
    else:
        errs += [f"correct option: {e}" for e in canonical_errors(join_option(opts[idx]["latex"])[0], truth, gens)]
    return errs
