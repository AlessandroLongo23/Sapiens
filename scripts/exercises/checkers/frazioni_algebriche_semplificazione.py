"""Checker for frazioni-algebriche-semplificazione, from specs/exercises/frazioni-algebriche-semplificazione.md
and lesson 47.

Numerator and denominator are parsed from the problem LaTeX (\\frac{P}{Q}); the truth is cancel(P/Q)
with SymPy. The answer must have that value and be the lesson's irreducible form: the sign in front
of the fraction, numerator and denominator in factored form (positive integer numeric factor, letters
in alphabetical order, each irreducible factor in parentheses once with its exponent, in increasing
degree, a single factor alone without parentheses), no common factor left, checked with SymPy's gcd
over the integers (which also sees a common number). The conditions of existence in the solution
are compared with the factors of the denominator of the problem, not of the answer.

Multiple choice: exactly one option equal to the truth and irreducible; an option with the same value
but a common factor left (not simplified completely) is allowed once, and must really have one.
"""
import re

from sympy import Integer, Poly, cancel, expand, factor_list, gcd, real_roots

from checkers.monomi_common import SYMS, ParseError, check_steps, forbidden, parse, val

CASE_RANGES = {
    1: {"binomio sopra": (0.55, 0.85), "binomio sotto": (0.15, 0.45)},
    3: {"resta un numero sopra": (0.35, 0.65), "risultato polinomio": (0.35, 0.65)},
    4: {"resta il segno meno": (0.75, 0.95), "segni che si annullano": (0.05, 0.25)},
    5: {"raccoglimento parziale": (0.25, 0.55), "prodotti notevoli": (0.45, 0.75)},
    6: {"cubi": (0.35, 0.65), "Ruffini": (0.35, 0.65)},
}

PROMPT = "Semplifica la frazione algebrica."
FRAC = re.compile(r"(-?)\\frac\{([^{}]*)\}\{([^{}]*)\}")


# ---------------------------------------------------------------------------
# Written form


def split_terms(latex):
    """'x^2 - 4x + 4' -> ['x^2', '-4x', '4'] (problem polynomials have no brackets)."""
    parts = re.split(r"\s([+-])\s", latex.strip())
    return [parts[0]] + [("-" if parts[i] == "-" else "") + parts[i + 1] for i in range(1, len(parts), 2)]


def monom(term, gens):
    P = Poly(parse(term), *gens)
    (m, c), = P.terms()
    return m, c


def order_errors(latex, gens, where, allow_ascending):
    """Terms in decreasing powers (lex on the letters in alphabetical order), first term positive; a
    polynomial whose leading term is negative is written in increasing powers (6 - 3x, 1 - x^2)."""
    errs = []
    terms = split_terms(latex)
    if terms[0].startswith("-"):
        errs.append(f"{where} starts with a minus: {latex}")
    try:
        info = [monom(t, gens) for t in terms]
    except (ParseError, ValueError) as e:
        return [f"{where}: term does not parse ({e}): {latex}"]
    ms = [m for m, _ in info]
    if len(set(ms)) != len(ms):
        errs.append(f"{where}: similar terms not collected: {latex}")
    desc = all(a > b for a, b in zip(ms, ms[1:]))
    asc = all(a < b for a, b in zip(ms, ms[1:]))
    if max(info)[1] < 0:
        if not (allow_ascending and asc):
            errs.append(f"{where}: negative leading term must be written in increasing powers: {latex}")
    elif not desc:
        errs.append(f"{where}: not in decreasing powers: {latex}")
    return errs


def tdeg(f, gens):
    return Poly(f, *gens).total_degree()


def group_errors(body, gens):
    """A factor in parentheses: two or more terms, irreducible in Z, primitive, first term positive in
    decreasing powers (x - 2, not 2 - x)."""
    try:
        f = parse(body)
    except ParseError as e:
        return [f"factor does not parse ({e}): {body}"], None
    if len(Poly(f, *gens).terms()) < 2:
        return [f"factor {body} has one term"], f
    errs = []
    c, fl = factor_list(f, *gens)
    if c != 1 or len(fl) != 1 or fl[0][1] != 1:
        errs.append(f"factor {body} is not irreducible and primitive with positive first term ({c}, {fl})")
    errs += order_errors(body, gens, f"factor {body}", allow_ascending=False)
    return errs, f


def factored_errors(latex, gens, where):
    """Numerator or denominator of the answer: '1', '5', '5x', '2x(2x - 3)', '(x - 2)^2(x + 1)',
    'x + 3' alone. Returns (errors, value)."""
    s = latex.strip()
    if "(" not in s and re.search(r"\s[+-]\s", s):
        errs, f = group_errors(s, gens)
        return errs, f
    m = re.fullmatch(r"(?P<num>\d+)?(?P<lit>(?:[a-z](?:\^\d)?)*)(?P<groups>(?:\([^()]*\)(?:\^\d)?)*)", s)
    if not m or not s:
        return [f"{where} is not in factored form: {latex}"], None
    num, lit, groups = m.group("num"), m.group("lit"), m.group("groups")
    errs = []
    if num is not None and (num.startswith("0") or (num == "1" and (lit or groups))):
        errs.append(f"{where}: numeric factor written badly: {latex}")
    value = Integer(int(num)) if num else Integer(1)
    letters = re.findall(r"([a-z])(?:\^(\d))?", lit)
    names = [v for v, _ in letters]
    if names != sorted(names) or len(set(names)) != len(names):
        errs.append(f"{where}: letters not in alphabetical order or repeated: {latex}")
    for v, k in letters:
        if k and int(k) < 2:
            errs.append(f"{where}: exponent {k}: {latex}")
        value *= SYMS[v] ** (int(k) if k else 1)
    gs = re.findall(r"\(([^()]*)\)(?:\^(\d))?", groups)
    if len(gs) == 1 and not num and not lit and not gs[0][1]:
        errs.append(f"{where}: a single factor goes without parentheses: {latex}")
    seen, degs = [], []
    for body, k in gs:
        if k and int(k) < 2:
            errs.append(f"{where}: exponent {k}: {latex}")
        ferrs, f = group_errors(body, gens)
        errs += ferrs
        if f is None:
            continue
        if any(expand(f - g) == 0 for g in seen):
            errs.append(f"{where}: factor {body} written twice")
        seen.append(f)
        degs.append(tdeg(f, gens))
        value *= f ** (int(k) if k else 1)
    if degs != sorted(degs):
        errs.append(f"{where}: factors not in increasing degree: {latex}")
    return errs, value


def split_answer(latex):
    """(sign, numerator latex, denominator latex or None). A negative polynomial is '-(x + 2)' when
    it is a single bare factor, '-3(x - 2)' or '-x' otherwise."""
    m = FRAC.fullmatch(latex.strip())
    if m:
        return m.group(1), m.group(2), m.group(3)
    s = latex.strip()
    sign = ""
    if s.startswith("-"):
        sign, s = "-", s[1:]
        mm = re.fullmatch(r"\(([^()]*)\)", s)
        if mm and re.search(r"\s[+-]\s", mm.group(1)):
            s = mm.group(1)
    return sign, s, None


def form_errors(latex, truth, gens, where="answer"):
    """The only accepted written form of the simplified fraction, and that it has the truth's value."""
    sign, a, b = split_answer(latex)
    errs, av = factored_errors(a, gens, f"{where} numerator")
    if av is None:
        return errs
    bv = Integer(1)
    if b is not None:
        berrs, bv = factored_errors(b, gens, f"{where} denominator")
        errs += berrs
        if bv is None:
            return errs
        if bv == 1:
            errs.append(f"{where}: denominator 1 written: {latex}")
    if a.strip().startswith("-") or (b or "").strip().startswith("-"):
        errs.append(f"{where}: the minus goes in front of the fraction: {latex}")
    if gcd(expand(av), expand(bv)) not in (1, -1):
        errs.append(f"{where} is not irreducible: {latex}")
    value = (-1 if sign else 1) * av / bv
    if cancel(value - truth) != 0:
        errs.append(f"{where} {latex} = {value} != {truth}")
    return errs


# ---------------------------------------------------------------------------
# Conditions of existence


def ce_errors(ce_latex, Q, gens):
    """'\\text{C.E.: } x \\neq 0,\\ x \\neq -3' must list one condition for each linear factor of the
    denominator of the problem; '\\text{per ogni } x' when it never vanishes."""
    _, fl = factor_list(Q, *gens)
    linear = [f for f, _ in fl if tdeg(f, gens) == 1]
    errs = []
    for f, _ in fl:
        if tdeg(f, gens) >= 2:
            if len(gens) != 1 or real_roots(Poly(f, gens[0])):
                errs.append(f"denominator factor {f} vanishes but has no C.E. rule")
    if not linear:
        if not re.fullmatch(r"\\text\{per ogni \} [a-z](, [a-z])*", ce_latex):
            errs.append(f"the denominator never vanishes, expected 'per ogni': {ce_latex}")
        return errs, []
    m = re.fullmatch(r"\\text\{C\.E\.: \} (.*)", ce_latex)
    if not m:
        return errs + [f"C.E. not written: {ce_latex}"], []
    entries = m.group(1).split(",\\ ")
    exprs = []
    for e in entries:
        mm = re.fullmatch(r"([a-z]) \\neq (.+)", e)
        if not mm:
            errs.append(f"C.E. entry not understood: {e}")
            continue
        try:
            exprs.append(SYMS[mm.group(1)] - parse(mm.group(2)))
        except ParseError as ex:
            errs.append(f"C.E. entry does not parse ({ex}): {e}")
    used = set()
    for ex in exprs:
        hit = [i for i, f in enumerate(linear) if cancel(ex / f).is_number]
        if not hit:
            errs.append(f"C.E. {ex} != 0 is not a zero of the denominator")
        elif hit[0] in used:
            errs.append(f"C.E. {ex} written twice")
        else:
            used.add(hit[0])
    if len(used) != len(linear):
        errs.append(f"C.E. has {len(used)} conditions, the denominator {len(linear)} linear factors")
    return errs, entries


# ---------------------------------------------------------------------------
# Check


def check(sample):
    errs = []
    lvl = sample["level"]
    if sample.get("prompt") != PROMPT:
        return [f"unexpected prompt {sample.get('prompt')!r}"], None
    prob = sample["problem"]
    errs += forbidden(prob)
    m = FRAC.fullmatch(prob)
    if not m or m.group(1):
        return [f"problem is not one fraction: {prob}"], None
    ptex, qtex = m.group(2), m.group(3)
    try:
        P, Q = parse(ptex), parse(qtex)
    except ParseError as e:
        return [f"problem does not parse ({e})"], None
    gens = sorted(P.free_symbols | Q.free_symbols, key=lambda s: s.name)
    names = [g.name for g in gens]
    if names not in (["x"], ["x", "y"], ["a", "b", "x", "y"]):
        return [f"letters {names}"], None
    truth = cancel(P / Q)

    polys = [(ptex, P), (qtex, Q)]
    negative = []
    for t, e in polys:
        errs += order_errors(t, gens, "problem polynomial", allow_ascending=(lvl == 4))
        Pp = Poly(e, *gens)
        lead = Pp.coeffs()[0]
        negative.append(bool(lead < 0))
        for co in Pp.coeffs():
            if not co.is_Integer or abs(co) > 60:
                errs.append(f"coefficient {co} in {t}")
        if Pp.total_degree() > 3:
            errs.append(f"degree over 3: {t}")
    G = gcd(P, Q)
    if G in (1, -1):
        errs.append("the fraction is already irreducible")
    proportional = cancel(P / Q).is_number
    if proportional and not (lvl == 4 and sum(negative) == 1):
        errs.append("numerator and denominator proportional")

    # answer
    ans = sample["answer"]
    if ans.get("kind") != "expression" or ans.get("form") != "irriducibile":
        errs.append("answer must be an expression with form 'irriducibile'")
        return errs, None
    try:
        if cancel(val(ans["value"]) - truth) != 0:
            errs.append(f"answer value {ans['value']} != {truth}")
    except ValueError as e:
        errs.append(str(e))
    alatex = ans.get("latex", "")
    errs += forbidden(alatex, "answer")
    try:
        if cancel(parse(alatex) - truth) != 0:
            errs.append(f"answer latex {alatex} != {truth}")
    except ParseError as e:
        errs.append(f"answer latex does not parse ({e})")
    errs += form_errors(alatex, truth, gens)
    sign, a_tex, b_tex = split_answer(alatex)
    try:
        a_deg = tdeg(parse(a_tex), gens)
        b_deg = tdeg(parse(b_tex), gens) if b_tex else None
    except ParseError:
        return errs, None
    a_one = a_tex.strip() == "1"

    # solution and C.E.
    sol = sample.get("solution", "")
    head = alatex + ",\\quad "
    if not sol.startswith(head):
        errs.append(f"solution does not start with the answer: {sol}")
        ce_part = ""
    else:
        ce_part = sol[len(head):]
    cerrs, entries = ce_errors(ce_part, Q, gens)
    errs += cerrs
    if entries != sample["params"].get("ce"):
        errs.append(f"params.ce {sample['params'].get('ce')} != solution {entries}")

    # levels
    one = names == ["x"]
    facs = [factor_list(e, *gens)[1] for _, e in polys]
    kind = None
    if lvl == 1:
        mons = [len(Poly(e, *gens).terms()) == 1 for _, e in polys]
        if not one or any(negative) or sum(mons) != 1:
            errs.append("level 1: a monomial and a binomial in x")
        else:
            mono_side = polys[0][1] if mons[0] else polys[1][1]
            other = polys[1][1] if mons[0] else polys[0][1]
            if Poly(mono_side, *gens).degree() < 1 or len(Poly(other, *gens).terms()) != 2:
                errs.append("level 1: the monomial contains x, the other side is a binomial")
            kind = "binomio sotto" if mons[0] else "binomio sopra"
        if b_tex is None or a_one:
            errs.append("level 1: a fraction is left, not 1 on top")
    elif lvl == 2:
        if not one or any(negative) or tdeg(P, gens) != 2 or tdeg(Q, gens) != 2:
            errs.append("level 2: numerator and denominator of degree 2 in x")
        if any(tdeg(f, gens) != 1 for fl in facs for f, _ in fl):
            errs.append("level 2: products of linear factors")
        if tdeg(G, gens) != 1 or any(k != 1 for fl in facs for _, k in fl):
            errs.append("level 2: one common factor, exponents 1")
        if a_deg != 1 or b_deg != 1:
            errs.append("level 2: the answer has degree 1 on top and below")
        kind = "un fattore comune"
    elif lvl == 3:
        if not one or any(negative):
            errs.append("level 3: positive polynomials in x")
        if a_deg == 0 and b_deg:
            kind = "resta un numero sopra"
        elif b_tex is None and a_deg > 0:
            kind = "risultato polinomio"
        else:
            errs.append("level 3: a number on top or a polynomial")
    elif lvl == 4:
        if not one or not any(negative):
            errs.append("level 4: a polynomial written in increasing powers with a negative leading term")
        x = gens[0]
        ok = False
        for (t, e), neg, fl in zip(polys, negative, facs):
            if not neg:
                continue
            for f, k in fl:
                Pf = Poly(f, x)
                if Pf.degree() == 1 and Pf.coeff_monomial(1) < 0 and k % 2 == 1 and Poly(G, x).rem(Pf).is_zero:
                    ok = True
        if not ok:
            errs.append("level 4: no common factor written as a - x")
        kind = "segni che si annullano" if all(negative) else "resta il segno meno"
        if (sign == "-") == all(negative):
            errs.append(f"level 4: sign {sign or '+'} with {sum(negative)} negative polynomials")
        if sign == "-" and b_tex is None and a_deg > 0:
            errs.append("level 4: a polynomial with a minus in front")
        if not any("Fattori opposti" in st for st in sample.get("steps", [])):
            errs.append("level 4: no step on the opposite factors")
    elif lvl == 5:
        if any(negative) or "x" not in names or "y" not in names:
            errs.append("level 5: letters x and y")
        for _, e in polys:
            if not {SYMS["x"], SYMS["y"]} <= e.free_symbols:
                errs.append("level 5: numerator and denominator contain x and y")
        _, gl = factor_list(G, *gens)
        if not any(len(Poly(f, *gens).terms()) == 2 and f.free_symbols == {SYMS["x"], SYMS["y"]} for f, _ in gl):
            errs.append("level 5: the common factor is a binomial in x and y")
        kind = "raccoglimento parziale" if "a" in names else "prodotti notevoli"
    elif lvl == 6:
        if not one or any(negative):
            errs.append("level 6: positive polynomials in x")
        cubic = any(tdeg(e, gens) == 3 and Poly(e, *gens).coeff_monomial(1) != 0 for _, e in polys)
        if not cubic:
            errs.append("level 6: a cubic with a constant term")
        quad = any(tdeg(f, gens) == 2 for fl in facs for f, _ in fl)
        if quad:
            kind = "cubi"
            if not any(len(Poly(e, *gens).terms()) == 2 and tdeg(e, gens) == 3 for _, e in polys):
                errs.append("level 6: the false square comes from a sum or difference of cubes")
        else:
            kind = "Ruffini"
    else:
        errs.append(f"unknown level {lvl}")
    if (a_deg == 0 and b_tex is None) and lvl != 4:
        errs.append("a number as the result outside level 4")
    if b_tex is not None and b_deg == 0:
        errs.append("the denominator of the answer is only a number")
    if kind and sample["params"].get("case") != kind:
        errs.append(f"params.case {sample['params'].get('case')} != {kind}")

    errs += check_steps(sample)
    errs += step_errors(sample, ptex, qtex, alatex, ce_part)
    errs += check_choice(sample, truth, gens, alatex)
    return errs, kind


def step_errors(sample, ptex, qtex, alatex, ce_part):
    errs = []
    steps = sample.get("steps") or []
    if not steps or not steps[0].startswith(f"\\text{{Denominatore: }} {qtex}"):
        errs.append("the first step does not factor the denominator")
    if not any(st.startswith(f"\\text{{Numeratore: }} {ptex}") for st in steps):
        errs.append("no step factoring the numerator")
    ce_step = next((st for st in steps if st.startswith("\\text{C.E.") or "nessuna C.E." in st), None)
    if ce_step is None:
        errs.append("no C.E. step")
    elif ce_part.startswith("\\text{C.E.") and ce_step != ce_part:
        errs.append(f"C.E. step {ce_step} != solution {ce_part}")
    elif ce_part.startswith("\\text{per ogni") and "nessuna C.E." not in ce_step:
        errs.append("C.E. step should say there are none")
    if steps and steps[-1] != f"\\text{{Risultato: }} {alatex},\\quad {ce_part}":
        errs.append(f"last step is not the result: {steps[-1] if steps else ''}")
    if not any(st.endswith(f" = {alatex}") and st.startswith("\\frac{") for st in steps):
        errs.append("no step with the simplified fraction")
    return errs


def check_choice(sample, truth, gens, alatex):
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
        lt = o.get("latex", "")
        errs += forbidden(lt, "option")
        try:
            if cancel(parse(lt) - v) != 0:
                errs.append(f"option latex {lt} != value {o['values'][0]}")
        except ParseError as e:
            errs.append(f"option latex does not parse ({e}): {lt}")
    latexes = [o.get("latex") for o in opts]
    if len(set(latexes)) != len(latexes):
        errs.append("two options written the same way")
    good = []
    same_value = []
    for i, (o, v) in enumerate(zip(opts, vals)):
        if cancel(v - truth) != 0:
            continue
        if not form_errors(o["latex"], truth, gens, "option"):
            good.append(i)
        else:
            same_value.append(i)
            m = FRAC.fullmatch(o["latex"])
            if not m:
                errs.append(f"option {o['latex']} equals the answer but is not a fraction left unsimplified")
            elif gcd(parse(m.group(2)), parse(m.group(3))) in (1, -1):
                errs.append(f"option {o['latex']} equals the answer and has no common factor")
    if len(good) != 1:
        errs.append(f"{len(good)} options are the simplified answer")
    if len(same_value) > 1:
        errs.append("more than one unsimplified option with the value of the answer")
    for i in range(len(vals)):
        for j in range(i + 1, len(vals)):
            if cancel(vals[i] - vals[j]) == 0 and not (i in same_value + good and j in same_value + good):
                errs.append(f"choice options {i} and {j} are equal")
    idx = ch.get("correct")
    if not isinstance(idx, int) or idx not in good:
        errs.append(f"choice.correct {idx} does not point at the simplified answer")
    elif opts[idx]["latex"] != alatex:
        errs.append("the correct option is written differently from the answer")
    return errs
