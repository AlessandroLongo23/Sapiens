"""Checker for scomposizione-ruffini, from specs/exercises/scomposizione-ruffini.md and lesson 37.

Everything is recomputed from the LaTeX the student sees. The polynomial is read from the problem
with the monomial parser of monomi_common; the complete factorisation over the integers comes from
SymPy's factor_list. A factored answer (or option) is read twice, from its SymPy string without
evaluation and from its LaTeX split into factors, and is "complete" when the product gives the
polynomial, the number in front is the content, every other factor is a primitive polynomial with
integer coefficients and positive leading coefficient, irreducible over the integers, and equal
factors are gathered in a power. Every Ruffini table in the steps is recomputed, and so is every
value P(a) the steps claim. The number of candidates tried is recomputed with the lesson's order
(1, -1, 2, -2, ..., then fractions; the zero just found first; rejected candidates never again)."""
import re
from collections import Counter

from sympy import Integer, Mul, Poly, Pow, Rational, Symbol, divisors, expand, factor_list, igcd
from sympy.parsing.sympy_parser import parse_expr

from checkers.monomi_common import ParseError, forbidden, parse

X = Symbol("x")

CASE_RANGES = {
    1: {"zero": (0.4, 0.6), "fattore": (0.4, 0.6)},
    3: {"tre fattori": (0.35, 0.65), "trinomio irriducibile": (0.35, 0.65)},
    4: {"tre fattori": (0.45, 0.75), "trinomio irriducibile": (0.25, 0.55)},
    5: {"zero ripetuto": (0.45, 0.7), "zeri distinti": (0.3, 0.55)},
}

PROMPT = "Scomponi in fattori il polinomio."
PROMPT_ZERO = "Quale di questi numeri è uno zero del polinomio?"
PROMPT_FACTOR = "Quale di questi binomi è un fattore del polinomio?"


# ---------------------------------------------------------------------------
# Reading products


def poly_of(e):
    return Poly(expand(e), X)


def key_of(p):
    return tuple(p.all_coeffs())


def struct_from_sympy(s):
    """'2*x**2*(x - 1)**3*(x + 2)' -> (2, Counter{coeffs: exp}) without expanding the factors."""
    if not isinstance(s, str) or not re.fullmatch(r"[0-9x+\-*/() ]+", s):
        raise ValueError(f"not a simple product string: {s!r}")
    e = parse_expr(s, local_dict={"x": X}, evaluate=False)
    const = Rational(1)
    fs = Counter()
    for f in Mul.make_args(e):
        base, ex = (f.base, int(f.exp)) if isinstance(f, Pow) else (f, 1)
        b = expand(base)
        if b.is_Number:
            const *= Rational(b) ** ex
            continue
        fs[key_of(poly_of(b))] += ex
    return const, fs


def split_latex(latex):
    """'3x^2(x + 3)(x^2 + x + 2)^2' -> ('3', 'x^2', [('x + 3', 1), ('x^2 + x + 2', 2)]); None if not a product."""
    s = latex.strip()
    m = re.match(r"(\d+)?(x(?:\^\d)?)?", s)
    head_num, head_x = m.group(1), m.group(2)
    rest = s[m.end():]
    groups = []
    while rest:
        if rest.startswith("\\left("):
            end = rest.find("\\right)")
            if end < 0:
                return None
            inner, rest = rest[6:end], rest[end + 7:]
        elif rest.startswith("("):
            end = rest.find(")")
            if end < 0:
                return None
            inner, rest = rest[1:end], rest[end + 1:]
        else:
            return None
        em = re.match(r"\^(\d)", rest)
        ex = 1
        if em:
            ex = int(em.group(1))
            rest = rest[em.end():]
        groups.append((inner, ex))
    return head_num, head_x, groups


def struct_from_latex(latex):
    sp = split_latex(latex)
    if sp is None:
        raise ParseError(f"not a product of factors: {latex}")
    head_num, head_x, groups = sp
    const = Rational(int(head_num)) if head_num else Rational(1)
    fs = Counter()
    if head_x:
        fs[key_of(poly_of(X))] += int(head_x[2:]) if "^" in head_x else 1
    for inner, ex in groups:
        fs[key_of(poly_of(parse(inner)))] += ex
    return const, fs, sp


def struct_value(st):
    const, fs = st[0], st[1]
    v = const
    for k, e in fs.items():
        v *= Poly(list(k), X).as_expr() ** e
    return expand(v)


def completeness_errors(st, P):
    """Why the product st is not the complete factorisation of P over the integers ([] if it is)."""
    const, fs = st[0], st[1]
    errs = []
    if expand(struct_value(st) - P.as_expr()) != 0:
        return ["the product is not the polynomial"]
    content = P.content() if P.LC() > 0 else -P.content()
    if const != content:
        errs.append(f"number in front {const}, content {content}")
    for k, e in fs.items():
        f = Poly(list(k), X)
        if not all(c.is_integer for c in f.all_coeffs()):
            errs.append(f"factor {f.as_expr()} has non-integer coefficients")
            continue
        if f.LC() < 0:
            errs.append(f"factor {f.as_expr()} with negative leading coefficient")
        if f.content() != 1:
            errs.append(f"factor {f.as_expr()} not primitive (a number still to collect)")
        if f.degree() >= 2 and not f.is_irreducible:
            errs.append(f"factor {f.as_expr()} still splits")
    return errs


def truth_struct(P):
    c, fl = factor_list(P.as_expr(), X)
    fs = Counter()
    for f, e in fl:
        p = Poly(f, X)
        if p.LC() < 0:
            p = -p
            c *= (-1) ** e
        fs[key_of(p)] += e
    return Rational(c), fs


# ---------------------------------------------------------------------------
# The lesson's procedure, only to count the candidates tried


def candidates(p):
    c0 = abs(int(p.all_coeffs()[-1]))
    lead = abs(int(p.LC()))
    out = []
    for d in divisors(c0):
        out += [Integer(d), Integer(-d)]
    fr = sorted({Rational(n, d) for d in divisors(lead) if d > 1 for n in divisors(c0) if igcd(n, d) == 1})
    for f in fr:
        out += [f, -f]
    return out


def tried_count(inner):
    p = inner
    rejected = set()
    last = None
    tried = 0
    while p.degree() >= 3 or (p.degree() == 2 and p.LC() != 1):
        cands = [c for c in candidates(p) if c not in rejected]
        if last is not None and last in cands:
            cands.remove(last)
            cands.insert(0, last)
        found = None
        for c in cands:
            tried += 1
            if p.eval(c) == 0:
                found = c
                break
            rejected.add(c)
        if found is None:
            return tried
        q, r = p.div(Poly(X - found, X))
        q = Poly(q.as_expr() / Rational(found.q), X) if found.q > 1 else q
        p = q
        last = found
    return tried


# ---------------------------------------------------------------------------
# Steps

NUM = r"-?(?:\d+|\\frac\{\d+\}\{\d+\})"


def num(s):
    s = s.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", s)
    if m:
        return Rational(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    if re.fullmatch(r"-?\d+", s):
        return Rational(int(s))
    raise ValueError(f"not a number: {s!r}")


TABLE = re.compile(r"\\begin\{array\}\{r\|(r+)\|r\} & (.*?) \\\\ (.*?) & & (.*?) \\\\ \\hline & (.*?) \\end\{array\}")
EVAL = re.compile(r"^([A-Z](?:_\d)?)(?:\((-?\d+)\)|\\left\((-?\\frac\{\d+\}\{\d+\})\\right\)) = (.*)$")
CHAIN_HEAD = re.compile(r"^(?:\\text\{[^{}]*\}\s*)?(.*)$")
DEF = re.compile(r"^([A-Z](?:_\d)?)\(x\) = ([^()]*)$")


def check_steps(sample, P):
    errs = []
    steps = sample.get("steps") or []
    if not steps:
        return ["no steps"], 0
    polys = {"P": P}
    tables = 0
    evals = 0
    for st in steps:
        m = TABLE.fullmatch(st)
        if m:
            tables += 1
            top = [num(t) for t in m.group(2).split("&")]
            a = num(m.group(3))
            prods = [num(t) for t in m.group(4).split("&")]
            bottom = [num(t) for t in m.group(5).split("&")]
            if len(m.group(1)) != len(top) - 1:
                errs.append(f"table columns do not match the coefficients: {st}")
            want = [top[0]]
            wprod = []
            for c in top[1:]:
                wprod.append(want[-1] * a)
                want.append(c + wprod[-1])
            if prods != wprod or bottom != want:
                errs.append(f"wrong Ruffini table: {st}")
            if bottom[-1] != 0:
                errs.append(f"table with remainder {bottom[-1]}: {st}")
            continue
        m = DEF.match(st)
        if m:
            try:
                polys[m.group(1)] = Poly(parse(m.group(2)), X)
            except ParseError:
                pass
        if "\\qquad" not in st and not EVAL.match(st):
            errs += chain_errors(st, polys)
        for part in st.split(" \\qquad "):
            m = EVAL.match(part)
            if not m:
                continue
            name, arg_i, arg_f, rhs = m.groups()
            evals += 1
            if name not in polys:
                errs.append(f"value of an unknown polynomial: {part}")
                continue
            a = num(arg_i or arg_f)
            v = polys[name].eval(a)
            chain = rhs.split(" = ")
            if num(chain[-1]) != v:
                errs.append(f"{name}({a}) is {v}, the step says {chain[-1]}")
            if len(chain) == 2:
                try:
                    if parse(chain[0]) != v:
                        errs.append(f"sum in {part} is not {v}")
                except ParseError as e:
                    errs.append(f"sum in {part} does not parse ({e})")
    if evals == 0:
        errs.append("no value P(a) in the steps")
    return errs, tables


def chain_errors(st, polys):
    """A step "A = B = C" (after an optional leading \\text{...}) whose members are polynomials or
    products: all members must be equal. Steps with text in the middle are not read."""
    body = CHAIN_HEAD.match(st).group(1)
    if "\\text" in body or " = " not in body:
        return []
    vals = []
    for part in body.split(" = "):
        part = part.strip()
        m = re.fullmatch(r"([A-Z](?:_\d)?)\(x\)", part)
        if m:
            if m.group(1) not in polys:
                return [f"unknown polynomial {part} in {st}"]
            vals.append(polys[m.group(1)].as_expr())
            continue
        try:
            vals.append(parse(part))
        except ParseError as e:
            return [f"step member {part!r} does not parse ({e})"]
    if any(expand(v - vals[0]) != 0 for v in vals[1:]):
        return [f"members of the step are not equal: {st}"]
    return []


# ---------------------------------------------------------------------------


def check_level1(sample, P):
    errs = []
    prompt = sample.get("prompt")
    if prompt not in (PROMPT_ZERO, PROMPT_FACTOR):
        return [f"unexpected prompt {prompt!r}"], None
    kind = "zero" if prompt == PROMPT_ZERO else "fattore"
    if P.degree() != 3 or P.LC() != 1:
        errs.append("level 1: cubic with leading coefficient 1")
    c0 = int(P.all_coeffs()[-1])
    if c0 == 0 or abs(c0) > 30:
        errs.append("level 1: constant term between 1 and 30 in absolute value")
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["answer must be a choice"], kind
    opts = ans.get("options", [])
    if len(opts) != 4:
        errs.append("level 1: four options")
    zs = []
    for o in opts:
        lt = o.get("latex", "")
        errs += forbidden(lt, "option")
        if kind == "zero":
            if not re.fullmatch(r"-?\d+", lt) or o["values"] != [lt]:
                errs.append(f"option {lt!r} is not an integer")
                return errs, kind
            zs.append(int(lt))
        else:
            m = re.fullmatch(r"x ([+-]) (\d+)", lt)
            if not m:
                errs.append(f"option {lt!r} is not a binomial x - a")
                return errs, kind
            a = int(m.group(2)) * (1 if m.group(1) == "-" else -1)
            if expand(parse_expr(o["values"][0], local_dict={"x": X}) - (X - a)) != 0:
                errs.append(f"option value {o['values']} differs from {lt}")
            zs.append(a)
    if len(set(zs)) != len(zs):
        errs.append("options not distinct")
    good = [i for i, a in enumerate(zs) if P.eval(a) == 0]
    if len(good) != 1:
        errs.append(f"{len(good)} options are zeros/factors")
    elif ans.get("correct") != good[0]:
        errs.append("choice.correct does not point at the zero")
    if good and -zs[good[0]] not in zs:
        errs.append("the option with the sign changed is missing")
    if any(c0 % a for a in zs if a):
        errs.append("an option does not divide the constant term")
    ch = sample.get("choice")
    if ch is None or ch.get("correct") is None or [o["latex"] for o in ch["options"]] != [o["latex"] for o in opts] or ch["correct"] != ans["correct"]:
        errs.append("choice variant differs from the answer")
    e2, _ = check_steps(sample, P)
    errs += e2
    return errs, kind


def check(sample):
    errs = []
    lvl = sample["level"]
    prob = sample["problem"]
    errs += forbidden(prob)
    try:
        P = Poly(parse(prob), X)
    except ParseError as e:
        return [f"problem does not parse ({e})"], None
    if not all(c.is_integer for c in P.all_coeffs()):
        errs.append("non-integer coefficients")
    if P.LC() <= 0:
        errs.append("leading coefficient not positive")
    if lvl == 1:
        e, kind = check_level1(sample, P)
        return errs + e, kind
    if sample.get("prompt") != PROMPT:
        errs.append(f"unexpected prompt {sample.get('prompt')!r}")

    truth = truth_struct(P)
    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "factored":
        errs.append("answer must be an expression in factored form")
    try:
        sv = struct_from_sympy(ans["value"])
        sl = struct_from_latex(ans["latex"])
    except (ValueError, ParseError) as e:
        return errs + [f"answer does not parse ({e})"], None
    if sv[0] != sl[0] or sv[1] != sl[1]:
        errs.append(f"answer value {ans['value']} and latex {ans['latex']} differ")
    ce = completeness_errors(sv, P)
    if ce:
        errs.append(f"answer is not the complete factorisation: {'; '.join(ce)}")
    if (sv[0], sv[1]) != truth:
        errs.append(f"answer {ans['value']} differs from factor_list {truth}")
    errs += forbidden(ans["latex"], "answer")
    keys = [g[0] for g in sl[2][2]]
    if len(keys) != len(set(keys)):
        errs.append("equal factors not gathered in a power")
    if sample.get("solution") != f"{prob} = {ans['latex']}":
        errs.append("solution is not 'problem = answer'")

    # level constraints
    const, fs = truth
    coeffs = [int(c) for c in P.all_coeffs()]
    d = P.degree()
    xk = key_of(poly_of(X))
    m = fs.get(xk, 0)
    lins = {k: e for k, e in fs.items() if len(k) == 2 and k != xk}
    quads = {k: e for k, e in fs.items() if len(k) == 3}
    n_lin = sum(lins.values())
    zeros = [Rational(-k[1], k[0]) for k in lins]
    repeated = any(e > 1 for e in lins.values())
    inner = Poly(expand(P.as_expr() / (const * X**m)), X)
    tried = tried_count(inner)
    lim = 60 if lvl == 6 else 40
    if max(abs(c) for c in coeffs) > lim:
        errs.append(f"coefficient over {lim}")
    if tried > 8:
        errs.append(f"{tried} candidates to try, more than 8")
    if lvl in (2, 3, 4, 5) and (const != 1 or m):
        errs.append("nothing to collect before level 6")
    kind = None
    if lvl == 2:
        if d != 3 or P.LC() != 1 or 0 in coeffs or n_lin != 3 or repeated or not ({1, -1} & set(zeros)) or any(abs(z) > 7 for z in zeros):
            errs.append("level 2: complete monic cubic, three distinct integer zeros in [-7, 7], one of them 1 or -1")
    elif lvl == 3:
        zc = coeffs[1:3].count(0)
        if d != 3 or P.LC() != 1 or zc != 1 or coeffs[3] == 0 or repeated:
            errs.append("level 3: monic cubic with exactly one of the x^2, x terms missing, distinct zeros")
        if 1 in zeros:
            errs.append("level 3: the first zero found must not be 1")
        kind = "trinomio irriducibile" if quads else "tre fattori"
    elif lvl == 4:
        frac = [k for k in lins if k[0] > 1]
        if d != 3 or P.LC() not in (2, 3, 4) or len(frac) != 1 or repeated or abs(coeffs[-1]) > 24:
            errs.append("level 4: cubic, leading coefficient 2-4, one fractional zero, constant term up to 24")
        kind = "trinomio irriducibile" if quads else "tre fattori"
    elif lvl == 5:
        if d != 4 or P.LC() != 1 or any(k[0] != 1 for k in lins) or abs(coeffs[-1]) > 48 or coeffs[-1] == 0:
            errs.append("level 5: monic quartic, integer zeros, constant term up to 48")
        kind = "zero ripetuto" if repeated or any(e > 1 for e in quads.values()) else "zeri distinti"
    elif lvl == 6:
        if const == 1 and m == 0:
            errs.append("level 6: nothing to collect")
        if d > 5 or inner.degree() not in (3, 4) or inner.LC() != 1:
            errs.append("level 6: monic bracket of degree 3 or 4, total degree at most 5")
    else:
        errs.append(f"unknown level {lvl}")
    if kind and sample["params"].get("case") != kind:
        errs.append(f"params.case {sample['params'].get('case')!r}, the polynomial is {kind!r}")

    e2, tables = check_steps(sample, P)
    errs += e2
    if tables < (2 if lvl in (5,) else 1):
        errs.append(f"only {tables} Ruffini tables")
    if not sample["steps"][-1] == f"{prob} = {ans['latex']}":
        errs.append("last step is not 'problem = answer'")
    if lvl == 6 and not sample["steps"][0].startswith("\\text{Raccolgo"):
        errs.append("level 6 must start by collecting")

    errs += check_choice(sample, P, truth)
    return errs, kind


def check_choice(sample, P, truth):
    errs = []
    ch = sample.get("choice")
    if ch is None:
        return ["no choice variant"]
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"choice has {len(opts)} options, expected 4")
    structs = []
    complete = []
    for o in opts:
        lt = o.get("latex", "")
        errs += forbidden(lt, "option")
        try:
            sv = struct_from_sympy(o["values"][0])
            sl = struct_from_latex(lt)
        except (ValueError, ParseError, KeyError, IndexError) as e:
            errs.append(f"option does not parse ({e}): {lt}")
            return errs
        if sv[0] != sl[0] or sv[1] != sl[1]:
            errs.append(f"option value {o['values']} and latex {lt} differ")
        structs.append((sv[0], frozenset(sv[1].items())))
        ce = completeness_errors(sv, P)
        complete.append(not ce)
        if ce and ce != ["the product is not the polynomial"] and sv[:2] == truth:
            errs.append(f"option {lt} equals the truth but is flagged incomplete")
    if len(set(structs)) != len(structs):
        errs.append("choice options not distinct")
    good = [i for i, c in enumerate(complete) if c]
    if len(good) != 1:
        errs.append(f"{len(good)} options are the complete factorisation")
    elif ch.get("correct") != good[0]:
        errs.append("choice.correct does not point at the complete factorisation")
    return errs
