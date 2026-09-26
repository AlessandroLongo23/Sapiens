"""Checker for frazioni-algebriche-esistenza, from specs/exercises/frazioni-algebriche-esistenza.md and
lesson 46 (Frazioni algebriche e condizioni di esistenza).

Written from the spec, not from the generator. Every fraction is read back from the problem LaTeX; the
excluded values are recomputed by SymPy from each denominator (solveset over the reals, factor_list for
the shape) and never taken from params. The answer and every option are parsed back from their LaTeX
("x \\neq 0,\\ x \\neq \\pm \\frac{3}{2}", "a \\neq b", "\\text{nessuna condizione}") and compared with
the truth. Level 1 evaluates the fraction at the values written in the problem.
"""
import re

from sympy import Poly, Rational, S, factor_list, real_roots, solveset

from checkers.monomi_common import SYMS, ParseError, forbidden, parse, parse_chain, same

x = SYMS["x"]
MAX_COEF = 100
NONE = "\\text{nessuna condizione}"
NE = "\\text{non esiste}"

CASE_RANGES = {
    1: {"esiste": (0.40, 0.60), "numeratore nullo": (0.12, 0.28), "non esiste": (0.22, 0.38)},
    2: {"x + b": (0.25, 0.45), "ax + b": (0.25, 0.45), "b - ax": (0.20, 0.40)},
    3: {"monomio": (0.17, 0.33), "monomio in due lettere": (0.13, 0.28), "raccoglimento": (0.45, 0.65)},
    4: {"differenza di quadrati": (0.45, 0.65), "quadrato di binomio": (0.35, 0.55)},
    5: {"primo coefficiente 1": (0.60, 0.80), "primo coefficiente diverso da 1": (0.20, 0.40)},
    6: {
        "raccoglimento e differenza di quadrati": (0.12, 0.28),
        "raccoglimento e trinomio": (0.08, 0.22),
        "un fattore mai zero": (0.12, 0.28),
        "nessuna condizione": (0.08, 0.22),
        "due lettere": (0.22, 0.38),
    },
    7: {"valore in comune": (0.25, 0.45), "un denominatore mai zero": (0.20, 0.40), "valori tutti diversi": (0.25, 0.45)},
}

PROMPTS = {1: "Calcola il valore della frazione algebrica, se esiste.", 7: "Scrivi le condizioni di esistenza dell'espressione."}
PROMPT_CE = "Scrivi le condizioni di esistenza della frazione."


class CheckError(Exception):
    pass


# ---------------------------------------------------------------------------
# Reading the problem


def group(s, i):
    """The content of the {...} group starting at s[i], and the index after it."""
    if i >= len(s) or s[i] != "{":
        raise CheckError(f"expected '{{' at {i} in {s!r}")
    depth = 0
    for j in range(i, len(s)):
        if s[j] == "{":
            depth += 1
        elif s[j] == "}":
            depth -= 1
            if depth == 0:
                return s[i + 1 : j], j + 1
    raise CheckError(f"unbalanced braces in {s!r}")


def read_fractions(s):
    """"\\frac{A}{B} - \\frac{C}{D}" -> [(sign, A, B), ...]; the whole string must be fractions."""
    out = []
    i = 0
    s = s.strip()
    while i < len(s):
        m = re.compile(r"\s*([+-]?)\s*\\frac").match(s, i)
        if not m:
            raise CheckError(f"not a sum of fractions: {s!r}")
        sign = -1 if m.group(1) == "-" else 1
        if out and not m.group(1):
            raise CheckError(f"missing operator between fractions: {s!r}")
        num, i = group(s, m.end())
        den, i = group(s, i)
        out.append((sign, num.strip(), den.strip()))
        while i < len(s) and s[i] == " ":
            i += 1
    return out


def rational_zeros(D):
    """Real zeros of a one-letter denominator; every one must be rational (the spec forbids x^2 - 3)."""
    sol = solveset(D, x, S.Reals)
    zs = list(sol)
    if any(not z.is_rational for z in zs):
        raise CheckError(f"denominator {D} has irrational zeros {zs}")
    return sorted(Rational(z) for z in zs)


def norm_factor(f):
    """A factor up to its sign (a - b and b - a are the same condition)."""
    syms = sorted(f.free_symbols, key=lambda s: s.name)
    P = Poly(f, *syms)
    return (-f).expand() if P.LC() < 0 else f.expand()


def two_letter_conds(D):
    """Conditions of a denominator in two letters: its non-constant factors, each a letter or u ± w."""
    _, facs = factor_list(D)
    out = set()
    for f, _k in facs:
        syms = sorted(f.free_symbols, key=lambda s: s.name)
        P = Poly(f, *syms)
        if P.total_degree() != 1 or any(abs(c) != 1 for c in P.coeffs()):
            raise CheckError(f"two-letter factor {f} is not a letter or u ± w")
        out.add(norm_factor(f))
    return out


# ---------------------------------------------------------------------------
# Reading answers and options


def read_value(t):
    v = parse(t.strip())
    if not v.is_Rational:
        raise CheckError(f"not a number: {t!r}")
    return Rational(v)


def read_conditions(latex):
    """"x \\neq 0,\\ x \\neq \\pm \\frac{3}{2}" (one line, or two in gathered) -> list of (letter, [values or letters])."""
    s = latex.strip()
    g = re.fullmatch(r"\\begin\{gathered\} (.+), \\\\ (.+) \\end\{gathered\}", s)
    lines = [g.group(1), g.group(2)] if g else [s]
    parts = []
    for ln in lines:
        parts += ln.split(",\\ ")
    out = []
    for p in parts:
        m = re.fullmatch(r"([a-z]) \\neq (\\pm )?(.+)", p.strip())
        if not m:
            raise CheckError(f"condition not in the form 'x \\neq v': {p!r} in {latex!r}")
        u, pm, rest = m.groups()
        v = parse(rest)
        vals = [v, -v] if pm else [v]
        if pm and (v == 0 or not (v.is_Rational and v > 0 or v.is_Symbol)):
            raise CheckError(f"\\pm before a non-positive value: {p!r}")
        out.append((u, vals, bool(pm)))
    return out, bool(g), len(parts)


def ce_values(latex):
    """One-letter C.E. -> sorted list of excluded values; [] for 'nessuna condizione'."""
    if latex == NONE:
        return []
    conds, gathered, nparts = read_conditions(latex)
    if gathered != (nparts > 3):
        raise CheckError(f"gathered iff more than three conditions: {latex!r}")
    vals = []
    for u, vs, pm in conds:
        if u != "x":
            raise CheckError(f"letter {u} in a one-letter C.E.: {latex!r}")
        for v in vs:
            if not v.is_Rational:
                raise CheckError(f"not a number: {v}")
            vals.append(Rational(v))
    if len(set(vals)) != len(vals):
        raise CheckError(f"value repeated in {latex!r}")
    # opposite values go together with \pm, as the lesson abbreviates them
    for u, vs, pm in conds:
        if not pm and vs[0] != 0 and -vs[0] in vals:
            raise CheckError(f"opposite values not written with \\pm: {latex!r}")
    return sorted(vals)


def cond_factors(latex):
    """Two-letter C.E. -> set of normalized factors (u \\neq 0 -> u, u \\neq b -> u - b, u \\neq -b -> u + b)."""
    if latex == NONE:
        return set()
    conds, _, _ = read_conditions(latex)
    out = set()
    for u, vs, _pm in conds:
        for v in vs:
            out.add(norm_factor(SYMS[u] - v) if v != 0 else SYMS[u])
    return out


def is_oppure(latex):
    return "\\text{ oppure }" in latex


# ---------------------------------------------------------------------------
# The checks


def coef_errors(e, where, max_coef=MAX_COEF):
    syms = sorted(e.free_symbols, key=lambda s: s.name)
    if not syms:
        return []
    P = Poly(e, *syms)
    errs = []
    for c in P.coeffs():
        if not c.is_Integer:
            errs.append(f"{where}: non-integer coefficient {c}")
        elif abs(c) > max_coef:
            errs.append(f"{where}: coefficient {c} over {max_coef}")
    return errs


def zero_free(f):
    return len(real_roots(Poly(f, x))) == 0


def level_case(lvl, fracs, dens):
    """Case of the exercise, recomputed from the denominators. Returns (errors, case)."""
    errs = []
    D = dens[0]
    syms = sorted(D.free_symbols, key=lambda s: s.name)
    if lvl in (2, 3, 4, 5, 6) and len(fracs) != 1:
        return [f"level {lvl}: one fraction"], None
    if lvl == 2:
        P = Poly(D, x)
        if syms != [x] or P.degree() != 1:
            return ["level 2: first-degree denominator in x"], None
        z = rational_zeros(D)[0]
        if z.q > 5:
            errs.append(f"level 2: excluded value {z} with denominator over 5")
        den_latex = fracs[0][2]
        if re.match(r"\d+ [+-] ", den_latex):
            if P.LC() > 0:
                errs.append("level 2: constant first, x with the minus")
            return errs, "b - ax"
        return errs, "x + b" if P.LC() == 1 else "ax + b"
    if lvl == 3:
        P = Poly(D, *syms)
        if len(P.terms()) == 1:
            return errs, "monomio" if syms == [x] else "monomio in due lettere"
        content, facs = factor_list(D)
        if syms != [x]:
            return ["level 3: collecting in x only"], None
        lin = [(f, k) for f, k in facs if f != x]
        if not any(f == x for f, _ in facs) or len(lin) != 1 or Poly(lin[0][0], x).degree() != 1 or lin[0][1] != 1 or content < 1:
            errs.append(f"level 3: expected k x^j (ax + b), got {D}")
        return errs, "raccoglimento"
    if lvl == 4:
        content, facs = factor_list(D)
        if syms != [x] or Poly(D, x).degree() != 2 or abs(content) != 1:
            return [f"level 4: primitive second-degree denominator: {D}"], None
        if len(facs) == 1 and facs[0][1] == 2 and Poly(facs[0][0], x).degree() == 1:
            return errs, "quadrato di binomio"
        z = rational_zeros(D)
        if len(z) == 2 and z[0] == -z[1] and Poly(D, x).coeff_monomial(x) == 0:
            return errs, "differenza di quadrati"
        return [f"level 4: neither a difference of squares nor a square: {D}"], None
    if lvl == 5:
        P = Poly(D, x)
        content, facs = factor_list(D)
        z = rational_zeros(D) if syms == [x] else []
        if syms != [x] or P.degree() != 2 or len(P.terms()) != 3 or len(z) != 2 or abs(content) != 1:
            return [f"level 5: trinomial with two distinct zeros: {D}"], None
        if 0 in z or z[0] == -z[1]:
            errs.append(f"level 5: zeros {z} must be nonzero and not opposite")
        if abs(P.coeff_monomial(1)) > 60:
            errs.append("level 5: constant term over 60")
        if P.LC() == 1:
            if abs(P.coeff_monomial(x)) > 15:
                errs.append("level 5: sum over 15")
            return errs, "primo coefficiente 1"
        if all(r.is_integer for r in z):
            errs.append("level 5: a != 1 needs a fractional value")
        return errs, "primo coefficiente diverso da 1"
    if lvl == 6:
        if len(syms) == 2:
            two_letter_conds(D)
            return errs, "due lettere"
        if syms != [x] or Poly(D, x).degree() > 4:
            return [f"level 6: one letter, degree up to 4: {D}"], None
        content, facs = factor_list(D)
        z = rational_zeros(D)
        free = [f for f, _ in facs if Poly(f, x).degree() >= 2]
        if not all(zero_free(f) for f in free):
            errs.append(f"level 6: a factor of degree 2 or more vanishes: {facs}")
        if not z:
            return errs, "nessuna condizione"
        if free:
            if len(z) != 1:
                errs.append("level 6: with a factor that never vanishes, one excluded value")
            return errs, "un fattore mai zero"
        if 0 not in z or len(z) != 3:
            return errs + [f"level 6: expected x and two more linear factors: {D}"], None
        a, b = [r for r in z if r != 0]
        return errs, "raccoglimento e differenza di quadrati" if a == -b else "raccoglimento e trinomio"
    if lvl == 7:
        if not 2 <= len(fracs) <= 3:
            errs.append("level 7: two or three fractions")
        if any(sorted(d.free_symbols, key=lambda s: s.name) != [x] for d in dens):
            return errs + ["level 7: one letter x"], None
        if not any(Poly(d, x).degree() >= 2 for d in dens):
            errs.append("level 7: a second-degree denominator is needed")
        zs = [set(rational_zeros(d)) for d in dens]
        never = [d for d, z in zip(dens, zs) if not z]
        allz = [r for z in zs for r in z]
        shared = len(allz) != len(set(allz))
        if never and shared:
            errs.append("level 7: a never-zero denominator and a shared value together")
        return errs, "un denominatore mai zero" if never else "valore in comune" if shared else "valori tutti diversi"
    return [f"unknown level {lvl}"], None


def check_steps(sample):
    """Steps "\\text{label} A = B = C" with no other text: all members equal (factorizations, substitutions)."""
    errs = []
    steps = sample.get("steps") or []
    if not steps:
        return ["no steps"]
    for st in steps:
        m = re.match(r"^\\text\{[^{}]*\}\s*(.*)$", st, re.S)
        body = m.group(1) if m else st
        if "\\text" in body or "=" not in body or "\\neq" in body:
            continue
        try:
            vals = parse_chain(body)
        except ParseError as e:
            errs.append(f"step does not parse ({e}): {st}")
            continue
        for a, b in zip(vals, vals[1:]):
            if not same(a, b):
                errs.append(f"step with unequal members: {st}")
                break
    return errs


def check_level1(sample):
    errs = []
    items = [t.strip() for t in re.split(r"\\quad", sample["problem"])]
    fr = read_fractions(items[0])
    if len(fr) != 1 or fr[0][0] != 1:
        return [f"level 1: one fraction: {sample['problem']}"], None
    N, D = parse(fr[0][1]), parse(fr[0][2])
    at = {}
    for it in items[1:]:
        m = re.fullmatch(r"([a-z]) = (-?\d+)", it)
        if not m:
            return [f"level 1: value not in the form 'x = n': {it!r}"], None
        at[SYMS[m.group(1)]] = Rational(int(m.group(2)))
    letters = (N.free_symbols | D.free_symbols)
    if set(at) != letters or not D.free_symbols:
        errs.append(f"level 1: values {at} for letters {letters}")
    if len(at) == 1 and any(abs(v) > 5 for v in at.values()):
        errs.append("level 1: value of x outside [-5, 5]")
    if len(at) == 2 and any(v == 0 or abs(v) > 9 for v in at.values()):
        errs.append("level 1: two letters with values in [-9, 9], not zero")
    errs += coef_errors(N, "numerator", 40) + coef_errors(D, "denominator", 40)
    n, d = N.subs(at), D.subs(at)
    if abs(n) > 60 or abs(d) > 60:
        errs.append(f"level 1: numerator {n} or denominator {d} over 60")
    case = "non esiste" if d == 0 else "numeratore nullo" if n == 0 else "esiste"
    ans = sample["answer"]
    ch = sample.get("choice")
    if d == 0:
        if ans.get("kind") != "choice":
            errs.append("level 1, non esiste: the answer is the multiple choice")
        elif ch is not None and ch != ans:
            errs.append("level 1: choice differs from the answer")
        truth = "NE"
        if "non esiste" not in sample.get("solution", ""):
            errs.append("level 1: the solution must say 'non esiste'")
    else:
        truth = Rational(n, d)
        if abs(truth.p) > 40 or truth.q > 20:
            errs.append(f"level 1: value {truth} too big")
        if ans.get("kind") != "number" or Rational(ans.get("value", "x")) != truth:
            errs.append(f"level 1: answer {ans} != {truth}")
        if not sample.get("solution", "").endswith(f"vale }} {latex_num(truth)}"):
            errs.append(f"level 1: solution does not end with the value: {sample.get('solution')}")
    # the substitution steps: "\text{Numeratore: } ... = n"
    for label, want in (("Numeratore", n), ("Denominatore", d)):
        st = [s for s in sample.get("steps", []) if s.startswith(f"\\text{{{label}: }}")]
        if len(st) != 1:
            errs.append(f"level 1: no '{label}' step")
            continue
        # "\text{Numeratore: } (-3)^2 - 1 = 8", or just "\text{Numeratore: } 6" when there is nothing to compute
        vals = parse_chain(st[0].split("}", 1)[1])
        if len(vals) not in (1, 2) or vals[0] != vals[-1] or vals[-1] != want:
            errs.append(f"level 1: step {st[0]} != {want}")
    errs += forbidden(items[0])
    opts = choice_options(sample)
    if isinstance(opts, list):
        keys = []
        for o in opts:
            lt, vs = o.get("latex", ""), o.get("values", [])
            if lt == NE:
                if vs != ["non esiste"]:
                    errs.append("'non esiste' option with a value")
                keys.append("NE")
                continue
            try:
                v = read_value(lt)
            except (CheckError, ParseError) as e:
                errs.append(f"option {lt!r}: {e}")
                keys.append(None)
                continue
            if len(vs) != 1 or Rational(vs[0]) != v:
                errs.append(f"option latex {lt} != values {vs}")
            if lt != latex_num(v):
                errs.append(f"option {lt!r} not written as {latex_num(v)!r}")
            keys.append(v)
        errs += choice_errors(sample, keys, truth)
    else:
        errs.append(opts)
    return errs, case


def latex_num(r):
    r = Rational(r)
    if r.q == 1:
        return str(r.p)
    return f"{'-' if r < 0 else ''}\\frac{{{abs(r.p)}}}{{{r.q}}}"


def choice_options(sample):
    ch = sample.get("choice")
    if ch is None:
        return "no choice variant"
    return ch.get("options", [])


def choice_errors(sample, keys, truth):
    """4 options, distinct, exactly one equal to the truth, `correct` pointing at it."""
    errs = []
    ch = sample["choice"]
    if len(keys) != 4:
        errs.append(f"choice has {len(keys)} options, expected 4")
    if len(set(map(repr, keys))) != len(keys):
        errs.append(f"choice options not distinct: {[o.get('latex') for o in ch['options']]}")
    right = [i for i, k in enumerate(keys) if k is not None and k == truth]
    if len(right) != 1:
        errs.append(f"{len(right)} options equal the truth: {[o.get('latex') for o in ch['options']]}")
    elif ch.get("correct") != right[0]:
        errs.append(f"choice.correct {ch.get('correct')} but the right option is {right[0]}")
    return errs


def check(sample):
    lvl = sample["level"]
    want_prompt = PROMPTS.get(lvl, PROMPT_CE)
    errs = []
    if sample.get("prompt") != want_prompt:
        errs.append(f"prompt {sample.get('prompt')!r}, expected {want_prompt!r}")
    try:
        if lvl == 1:
            e1, case = check_level1(sample)
            errs += e1 + check_steps(sample)
            return errs, case
        errs += forbidden(sample["problem"])
        fracs = read_fractions(sample["problem"])
        nums = [parse(n) for _, n, _ in fracs]
        dens = [parse(d) for _, _, d in fracs]
        for N, D in zip(nums, dens):
            if not D.free_symbols:
                errs.append(f"denominator without letters: {D}")
            errs += coef_errors(N, "numerator") + coef_errors(D, "denominator")
            if same(N, D):
                errs.append("numerator equal to the denominator")
        cerrs, case = level_case(lvl, fracs, dens)
        errs += cerrs
        two = any(len(D.free_symbols) == 2 for D in dens)
        ans = sample["answer"]
        if two:
            truth = set()
            for D in dens:
                truth |= two_letter_conds(D)
            if ans.get("kind") != "choice":
                errs.append("two letters: the answer is the multiple choice")
            elif sample.get("choice") is not None and sample["choice"] != ans:
                errs.append("choice differs from the answer")
            sol_truth = cond_factors(sample["solution"].replace("\\text{C.E.: } ", "", 1))
            if sol_truth != truth:
                errs.append(f"solution {sample['solution']} != {truth}")
        else:
            truth = sorted(set(r for D in dens for r in rational_zeros(D)))
            if ans.get("kind") != "set":
                errs.append(f"answer kind {ans.get('kind')}, expected set")
            else:
                if [Rational(v) for v in ans["values"]] != truth:
                    errs.append(f"answer values {ans['values']} != {truth}")
                if ans["values"] != [str(r) for r in sorted(Rational(v) for v in ans["values"])]:
                    errs.append("answer values not sorted")
                if ce_values(ans["latex"]) != truth:
                    errs.append(f"answer latex {ans['latex']} != {truth}")
                if "gathered" in ans["latex"]:
                    errs.append("answer latex on two lines")
                if sample.get("solution") != f"\\text{{C.E.: }} {ans['latex']}":
                    errs.append(f"solution {sample.get('solution')!r} does not state the answer")
            if not sample.get("steps") or not sample["steps"][-1].endswith(ce_line_tail(sample)):
                errs.append("the last step does not state the C.E.")
        errs += check_steps(sample)
        opts = choice_options(sample)
        if not isinstance(opts, list):
            return errs + [opts], case
        keys = []
        for o in opts:
            lt, vs = o.get("latex", ""), o.get("values", [])
            try:
                if lt == NONE:
                    if vs != ["nessuna"]:
                        errs.append("'nessuna condizione' option with values")
                    keys.append(frozenset())
                elif is_oppure(lt):
                    for side in lt.split(" \\text{ oppure } "):
                        cond_factors(side)
                    if not vs or vs[0] != "oppure":
                        errs.append("'oppure' option not labelled")
                    keys.append(("oppure", lt))
                elif two:
                    fs = cond_factors(lt)
                    if {norm_factor(parse_plain(v)) for v in vs} != fs or len(vs) != len(fs):
                        errs.append(f"option latex {lt} != values {vs}")
                    keys.append(frozenset(fs))
                else:
                    zs = ce_values(lt)
                    if [Rational(v) for v in vs] != zs:
                        errs.append(f"option latex {lt} != values {vs}")
                    keys.append(frozenset(zs))
            except (CheckError, ParseError) as e:
                errs.append(f"option {lt!r}: {e}")
                keys.append(None)
        errs += choice_errors(sample, keys, frozenset(truth))
        return errs, case
    except (CheckError, ParseError) as e:
        return errs + [str(e)], None


def ce_line_tail(sample):
    a = sample["answer"]
    if a.get("kind") == "set":
        return a["latex"]
    return sample["solution"].replace("\\text{C.E.: } ", "", 1)


def parse_plain(s):
    """A value string such as "a - b" or "a + b" from the option's values."""
    if not re.fullmatch(r"[a-z +\-]+", s):
        raise CheckError(f"not a factor string: {s!r}")
    return parse(s)
