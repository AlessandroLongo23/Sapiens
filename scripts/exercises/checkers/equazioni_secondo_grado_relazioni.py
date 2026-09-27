"""Checker for equazioni-secondo-grado-relazioni, from specs/exercises/equazioni-secondo-grado-relazioni.md
and lesson 77 (Relazioni tra soluzioni e coefficienti).

Written from the spec, not from the generator. Every level reads the exercise back from the problem
LaTeX (the equation, the given solution, the two solutions, the sum and the product in the prose, the
trinomial, the symmetric expression), recomputes the truth with SymPy (solve, factor, expand, radsimp)
and checks the answer, every option of the multiple choice (its LaTeX read back and compared with its
values; exactly one right; the distractors really wrong, including those that are "right but not in
the requested form"), the per-level constraints and the share of each case.
"""
import re

from sympy import Poly, Rational, S, Symbol, expand, gcd_list, ilcm, radsimp, solveset, sqrt, sympify
from sympy.parsing.sympy_parser import convert_xor, implicit_multiplication_application, parse_expr, standard_transformations

from verify import FORBIDDEN, canon, exact, rat, x

X1, X2 = Symbol("x1"), Symbol("x2")
TRANSFORMS = standard_transformations + (implicit_multiplication_application, convert_xor)
MAX_COEF = 100

CASE_RANGES = {
    1: {"reali": (0.70, 0.90), "delta<0": (0.10, 0.30)},
    3: {"intere": (0.30, 0.50), "frazionarie": (0.25, 0.45), "irrazionali": (0.15, 0.35)},
    4: {"numeri": (0.35, 0.55), "non esistono": (0.12, 0.28), "rettangolo": (0.25, 0.45)},
    5: {"frazionarie": (0.22, 0.38), "a negativo": (0.13, 0.27), "irrazionali": (0.13, 0.27), "delta=0": (0.09, 0.21), "irriducibile": (0.09, 0.21)},
    6: {"pp": (0.13, 0.27), "nn": (0.13, 0.27), "disc+": (0.13, 0.27), "disc-": (0.13, 0.27), "none": (0.13, 0.27)},
}

SIGN_TEXT = {
    "pp": r"\text{Due soluzioni positive}",
    "nn": r"\text{Due soluzioni negative}",
    "disc+": r"\begin{gathered} \text{Discordi, ha valore assoluto} \\ \text{maggiore la positiva} \end{gathered}",
    "disc-": r"\begin{gathered} \text{Discordi, ha valore assoluto} \\ \text{maggiore la negativa} \end{gathered}",
    "none": r"\text{Nessuna soluzione reale}",
}

SYMMETRIC = {
    "x_1^2 + x_2^2": X1**2 + X2**2,
    r"\frac{1}{x_1} + \frac{1}{x_2}": 1 / X1 + 1 / X2,
    "(x_1 - x_2)^2": (X1 - X2) ** 2,
    r"\frac{1}{x_1^2} + \frac{1}{x_2^2}": 1 / X1**2 + 1 / X2**2,
    "x_1^2x_2 + x_1x_2^2": X1**2 * X2 + X1 * X2**2,
    "x_1^3 + x_2^3": X1**3 + X2**3,
}

FRAC = re.compile(r"\\frac\{([^{}]*)\}\{([^{}]*)\}")


def tex(s, evaluate=True):
    """A formula as the lesson writes it (6x^2 - x - 2, \\left(x + \\frac{1}{2}\\right), 2\\sqrt{3}) to SymPy."""
    t = s.replace(r"\left(", "(").replace(r"\right)", ")").replace(r"\cdot", "*")
    t = re.sub(r"\\sqrt\{([^{}]*)\}", r"sqrt(\1)", t)
    while FRAC.search(t):
        t = FRAC.sub(r"((\1)/(\2))", t)
    if re.search(r"[\\{}]", t):
        raise ValueError(f"unreadable formula {s!r}")
    return parse_expr(t, local_dict={"x": x, "sqrt": sqrt}, transformations=TRANSFORMS, evaluate=evaluate)


def as_written(value):
    """The expression exactly as written, without SymPy distributing a number into a sum (3*(x + 1/3))."""
    return parse_expr(value, local_dict={"x": x, "sqrt": sqrt}, evaluate=False)


def equation(s):
    left, zero = s.split(" = ")
    if zero.strip() != "0":
        raise ValueError(f"not an equation = 0: {s!r}")
    return expand(tex(left))


def coeffs(e):
    P = Poly(e, x)
    if P.degree() != 2:
        raise ValueError(f"degree {P.degree()}")
    return P.coeff_monomial(x**2), P.coeff_monomial(x), P.coeff_monomial(1)


def real_roots(e):
    sol = solveset(e, x, S.Reals)
    return sorted(sol, key=float) if sol != S.EmptySet else []


def integer_ok(cs):
    return all(c.is_integer and abs(c) <= MAX_COEF for c in cs)


def prose(problem):
    """The prose of a textBlock problem (every \\text{} line joined), and the formula lines after it."""
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", problem)
    rows = m.group(1).split(r" \\ ") if m else [problem]
    words, rest = [], []
    for r in rows:
        tm = re.fullmatch(r"\\text\{(.*)\}", r)
        (words if tm else rest).append(tm.group(1) if tm else r)
    return " ".join(words), rest


def choice_basic(ch, errs):
    if ch is None:
        errs.append("no choice variant")
        return False
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"choice has {len(opts)} options, expected 4")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("choice options with the same latex")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts):
        errs.append(f"choice.correct {idx} out of range")
        return False
    return True


def number_choice(ch, truth, errs):
    if not choice_basic(ch, errs):
        return
    vals = []
    for o in ch["options"]:
        v = rat(o["values"][0])
        if tex(o["latex"]) != v:
            errs.append(f"option latex {o['latex']!r} != value {v}")
        vals.append(v)
    if len(set(vals)) != len(vals):
        errs.append(f"repeated options {vals}")
    if [i for i, v in enumerate(vals) if v == truth] != [ch["correct"]]:
        errs.append(f"choice: right option is not exactly the index {ch['correct']} ({vals}, truth {truth})")


# ---------------------------------------------------------------------------


def level1(sample, errs):
    e = equation(sample["problem"])
    a, b, c = coeffs(e)
    if not integer_ok((a, b, c)) or a <= 0 or b == 0 or c == 0 or not 1 <= a <= 5 or abs(b) > 10 or abs(c) > 10:
        errs.append(f"coefficients out of spec: {a}, {b}, {c}")
    if gcd_list([a, b, c]) != 1:
        errs.append("coefficients with a common factor")
    delta = b**2 - 4 * a * c
    roots = real_roots(e)
    truth = None if delta < 0 else (canon(sum(roots) if len(roots) == 2 else 2 * roots[0]), canon(roots[0] * roots[-1]))
    if truth is not None and truth != (-b / a, c / a):
        errs.append("sympy's roots do not give -b/a and c/a")
    ch = sample["answer"]
    if ch.get("kind") != "choice":
        errs.append("answer.kind must be choice")
        return None
    if not choice_basic(ch, errs):
        return None
    right = []
    for i, o in enumerate(ch["options"]):
        if o["values"] == ["nessuna"]:
            if o["latex"] != r"\text{Nessuna soluzione reale}":
                errs.append(f"option 'nessuna' written {o['latex']!r}")
            val = None
        else:
            m = re.fullmatch(r"s = (.+),\\ p = (.+)", o["latex"])
            val = (rat(o["values"][0]), rat(o["values"][1]))
            if not m or (tex(m.group(1)), tex(m.group(2))) != val:
                errs.append(f"option latex {o['latex']!r} != values {o['values']}")
        if val == truth:
            right.append(i)
    if right != [ch["correct"]]:
        errs.append(f"right options {right}, correct {ch['correct']}")
    return "delta<0" if delta < 0 else "reali"


def level2(sample, errs):
    words, rest = prose(sample["problem"])
    m = re.fullmatch(r"Il numero \$(-?\d+)\$ è una soluzione di", words)
    if not m or len(rest) != 1:
        errs.append(f"problem not in the expected form: {sample['problem']!r}")
        return None
    given = Rational(m.group(1))
    e = equation(rest[0])
    a, b, c = coeffs(e)
    if not integer_ok((a, b, c)) or a <= 0:
        errs.append(f"coefficients out of spec: {a}, {b}, {c}")
    if e.subs(x, given) != 0:
        errs.append(f"{given} is not a solution")
    if given == 0 or abs(given) > 6:
        errs.append(f"given solution {given} out of [-6, 6] or zero")
    roots = real_roots(e)
    others = [r for r in roots if r != given]
    if len(roots) != 2 or len(others) != 1:
        errs.append(f"need two distinct solutions, got {roots}")
        return None
    other = others[0]
    if not other.is_rational or other.q > 3 or abs(other.p) > 9 or other == -given:
        errs.append(f"other solution {other} out of spec")
    ans = sample["answer"]
    if ans.get("kind") != "number" or rat(ans["value"]) != other:
        errs.append(f"answer {ans.get('value')} != {other}")
    number_choice(sample.get("choice"), other, errs)
    return None


def level3(sample, errs):
    m = re.fullmatch(r"x_1 = (.+) \\quad x_2 = (.+)", sample["problem"])
    if not m:
        errs.append(f"problem not in the expected form: {sample['problem']!r}")
        return None
    r1, r2 = tex(m.group(1)), tex(m.group(2))
    if not float(r1) < float(r2):
        errs.append("solutions not in increasing order")
    if canon(r1 + r2) == 0 or canon(r1 * r2) == 0:
        errs.append("opposite solutions or a zero solution")
    monic = expand(radsimp(expand((x - r1) * (x - r2))))
    P = Poly(monic, x)
    if not all(c.is_rational for c in P.all_coeffs()):
        errs.append("x^2 - sx + p has irrational coefficients")
        return None
    den = ilcm(*[c.q for c in P.all_coeffs()])
    truth = [c * den for c in P.all_coeffs()]  # a, b, c: integer, primitive, a > 0
    if gcd_list(truth) != 1 or not integer_ok(truth):
        errs.append(f"expected equation {truth} not primitive or too large")
    kind = "irrazionali" if not r1.is_rational else "intere" if r1.is_integer and r2.is_integer else "frazionarie"
    if kind == "irrazionali":
        m, d = canon((r1 + r2) / 2), canon((r2 - r1) / 2)
        if not m.is_integer or m == 0 or abs(m) > 5 or canon(d**2) not in (2, 3, 5, 6, 7):
            errs.append("irrational solutions not of the form m ± √n with m in [-5, 5], n in {2, 3, 5, 6, 7}")
    elif kind == "intere" and not all(abs(r) <= 9 for r in (r1, r2)):
        errs.append("integer solutions out of [-9, 9]")
    elif kind == "frazionarie" and not all(r.q <= 5 and abs(r.p) <= 7 for r in (r1, r2)):
        errs.append("fractional solutions out of spec")
    ch = sample["answer"]
    if ch.get("kind") != "choice" or not choice_basic(ch, errs):
        errs.append("answer must be a choice")
        return kind
    right = []
    for i, o in enumerate(ch["options"]):
        e = equation(o["latex"])
        cs = [rat(v) for v in o["values"]]  # by degree: c, b, a
        if expand(e - (cs[2] * x**2 + cs[1] * x + cs[0])) != 0:
            errs.append(f"option latex {o['latex']!r} != values {o['values']}")
        A, B, C = coeffs(e)
        if [A, B, C] == truth:
            right.append(i)
        else:
            sols = real_roots(e)
            if len(sols) == 2 and {canon(s) for s in sols} == {canon(r1), canon(r2)}:
                errs.append(f"distractor {o['latex']} has the given solutions")
    if right != [ch["correct"]]:
        errs.append(f"right options {right}, correct {ch['correct']}")
    return kind


def pair_of(latex, unit):
    if latex == r"\text{Non esistono}":
        return ()
    u = r"\\ \\text\{cm\}" if unit else ""
    m = re.fullmatch(rf"(.+?){u} \\text\{{ e \}} (.+?){u}", latex) or re.fullmatch(
        rf"\\begin\{{gathered\}} (.+?){u} \\\\ \\text\{{e \}} (.+?){u} \\end\{{gathered\}}", latex
    )
    if m and "sqrt" not in latex and latex.startswith("\\begin"):
        raise ValueError(f"rational pair on two lines {latex!r}")
    if m and "sqrt" in latex and not latex.startswith("\\begin"):
        raise ValueError(f"pair with radicals on one line {latex!r}")
    if not m:
        raise ValueError(f"unreadable pair {latex!r}")
    return (canon(tex(m.group(1))), canon(tex(m.group(2))))


def level4(sample, errs):
    words, rest = prose(sample["problem"])
    if rest:
        errs.append("level 4 problem must be prose only")
    m = re.fullmatch(r"Trova, se esistono, due numeri reali che hanno somma \$(-?\d+)\$ e prodotto \$(-?\d+)\$\.", words)
    r = re.fullmatch(
        r"Un rettangolo ha perimetro \$(\d+)\\ \\text\{cm\}\$ e area \$(\d+)\\ \\text\{cm\}\^2\$\. Quanto misurano i lati\?", words
    )
    if m:
        s, p = Rational(m.group(1)), Rational(m.group(2))
        unit = False
    elif r:
        s, p = Rational(r.group(1)) / 2, Rational(r.group(2))
        unit = True
    else:
        errs.append(f"prose not recognised: {words!r}")
        return None
    sols = real_roots(x**2 - s * x + p)
    if len(sols) == 1:
        errs.append("the two numbers coincide")
    if any(not v.is_integer for v in sols):
        errs.append(f"numbers {sols} not integers")
    if unit and (not s.is_integer or any(v <= 0 for v in sols) or not sols):
        errs.append("rectangle without two positive integer sides")
    if not unit and sols and (s == 0 or any(v == 0 for v in sols)):
        errs.append("zero sum or a zero number")
    kind = "rettangolo" if unit else "numeri" if sols else "non esistono"
    ans = sample["answer"]
    if ans.get("kind") != "set" or [exact(v) for v in ans["values"]] != sols:
        errs.append(f"answer {ans.get('values')} != {sols}")
    truth = tuple(canon(v) for v in sols)
    ch = sample.get("choice")
    if not choice_basic(ch, errs):
        return kind
    right = []
    for i, o in enumerate(ch["options"]):
        shown = pair_of(o["latex"], unit)
        vals = tuple(canon(exact(v)) for v in o["values"])
        if shown != vals:
            errs.append(f"option latex {o['latex']!r} != values {o['values']}")
        if vals == truth:
            right.append(i)
    if right != [ch["correct"]]:
        errs.append(f"right options {right}, correct {ch['correct']}")
    return kind


def flat_factors(e):
    """The factors of a product written without evaluation, nested products opened."""
    if e.is_Mul:
        for a in e.args:
            yield from flat_factors(a)
    else:
        yield e


def is_factored(e, trinomial):
    """Same value, and a product of a number and first-degree factors (or the square of one), with
    integer primitive coefficients when the factor is rational: fully factored over the reals."""
    if expand(e - trinomial) != 0:
        return False, "different value"
    parts = list(flat_factors(e))
    lead = S.One
    linear = []
    for f in parts:
        base, k = (f.base, f.exp) if f.is_Pow else (f, 1)
        if not base.has(x):
            lead *= f
            continue
        if Poly(base, x).degree() != 1:
            return False, f"factor {base} is not of first degree"
        linear.append((base, k))
    if not lead.is_integer:
        return False, f"number in front {lead} is not an integer"
    for base, _ in linear:
        cs = Poly(base, x).all_coeffs()
        if all(v.is_rational for v in cs):
            if not all(v.is_integer for v in cs) or gcd_list(cs) != 1:
                return False, f"factor {base} not integer and primitive"
        elif cs[0] != 1:
            return False, f"factor with a radical {base} must be x - root"
    return True, ""


def level5(sample, errs):
    T = expand(tex(sample["problem"]))
    a, b, c = coeffs(T)
    if not integer_ok((a, b, c)) or b == 0 or c == 0:
        errs.append(f"trinomial out of spec: {T}")
    delta = b**2 - 4 * a * c
    roots = real_roots(T)
    if delta < 0:
        kind = "irriducibile"
    elif delta == 0:
        kind = "delta=0"
    elif not roots[0].is_rational:
        kind = "irrazionali"
        if a != 1:
            errs.append("irrational case needs a = 1")
    else:
        kind = "a negativo" if a < 0 else "frazionarie"
        if kind == "frazionarie" and all(r.is_integer for r in roots):
            errs.append("fractional case with integer roots")
        if kind == "a negativo" and abs(a) < 2:
            errs.append("a negativo needs |a| >= 2")
    ans = sample["answer"]
    irr = delta < 0
    if ans.get("kind") != "expression" or ans.get("form") != "factored":
        errs.append("answer must be an expression in factored form")
    if bool(sample["params"].get("irreducible")) != irr:
        errs.append("params.irreducible disagrees with the discriminant")
    val = sympify(ans["value"], locals={"x": x})
    if expand(val - T) != 0:
        errs.append(f"answer {ans['value']} != trinomial")
    if not irr:
        for form in (as_written(ans["value"]), tex(ans["latex"], evaluate=False)):
            ok, why = is_factored(form, T)
            if not ok:
                errs.append(f"answer not fully factored: {why}")
        if expand(tex(ans["latex"]) - val) != 0:
            errs.append("answer latex != value")
    ch = sample.get("choice")
    if not choice_basic(ch, errs):
        return kind
    right = []
    for i, o in enumerate(ch["options"]):
        if o["values"] == ["irriducibile"]:
            if o["latex"] != r"\text{Irriducibile}":
                errs.append(f"option irriducibile written {o['latex']!r}")
            good = irr
        else:
            v = sympify(o["values"][0], locals={"x": x})
            if expand(tex(o["latex"]) - v) != 0:
                errs.append(f"option latex {o['latex']!r} != value {o['values']}")
            good = not irr and is_factored(as_written(o["values"][0]), T)[0] and is_factored(tex(o["latex"], evaluate=False), T)[0]
            if not good and expand(v - T) == 0:
                errs.append(f"distractor {o['latex']} equal to the trinomial (right but not in the requested form)")
        if good:
            right.append(i)
    if right != [ch["correct"]]:
        errs.append(f"right options {right}, correct {ch['correct']}")
    return kind


def level6(sample, errs):
    e = equation(sample["problem"])
    a, b, c = coeffs(e)
    if not integer_ok((a, b, c)) or 0 in (a, b, c):
        errs.append(f"coefficients out of spec: {a}, {b}, {c}")
    roots = real_roots(e)
    if len(roots) == 1:
        errs.append("double root")
    if not roots:
        truth = "none"
    else:
        neg = [r for r in roots if r < 0]
        pos = [r for r in roots if r > 0]
        if len(pos) == 2:
            truth = "pp"
        elif len(neg) == 2:
            truth = "nn"
        else:
            truth = "disc+" if abs(pos[0]) > abs(neg[0]) else "disc-"
    ch = sample["answer"]
    if ch.get("kind") != "choice" or not choice_basic(ch, errs):
        errs.append("answer must be a choice")
        return truth
    right = []
    for i, o in enumerate(ch["options"]):
        lab = o["values"][0]
        if SIGN_TEXT.get(lab) != o["latex"]:
            errs.append(f"option {lab} written {o['latex']!r}")
        if lab == truth:
            right.append(i)
    if right != [ch["correct"]]:
        errs.append(f"right options {right}, correct {ch['correct']}")
    return truth


def level7(sample, errs):
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.+) \\\\ (.+) = \\ \? \\end\{array\}", sample["problem"])
    if not m:
        errs.append(f"problem not in the expected form: {sample['problem']!r}")
        return None
    e = equation(m.group(1))
    a, b, c = coeffs(e)
    if not integer_ok((a, b, c)) or not 1 <= a <= 3 or 0 in (b, c) or abs(b) > 9 or abs(c) > 9:
        errs.append(f"coefficients out of spec: {a}, {b}, {c}")
    expr = SYMMETRIC.get(m.group(2))
    if expr is None:
        errs.append(f"unknown expression {m.group(2)!r}")
        return None
    roots = real_roots(e)
    if len(roots) != 2:
        errs.append("need delta > 0")
        return None
    truth = canon(radsimp(expr.subs({X1: roots[0], X2: roots[1]})))
    if not truth.is_rational:
        errs.append(f"value {truth} not rational")
    ans = sample["answer"]
    if ans.get("kind") != "number" or rat(ans["value"]) != truth:
        errs.append(f"answer {ans.get('value')} != {truth}")
    if truth.is_rational and (truth.q > 81 or abs(truth.p) > 400 or truth == 0):
        errs.append(f"value {truth} out of spec")
    number_choice(sample.get("choice"), truth, errs)
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}


def check(sample):
    errs = []
    lvl = sample["level"]
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    problem_math = re.sub(r"\\text\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}", "", sample["problem"])
    for name, rx in FORBIDDEN:
        if name in ("^{1}", "^{0}"):
            continue
        if rx.search(problem_math):
            errs.append(f"problem contains forbidden '{name}': {sample['problem']}")
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("steps or solution missing")
    for line in [sample.get("solution", "")] + sample.get("steps", []):
        if re.search(r"\\begin\{(aligned|gathered|array)\}", line) and r"\text" in line:
            errs.append(f"environment with text in a step: {line[:60]}")
        if "—" in line or "piuttosto che" in line:
            errs.append("forbidden words in the steps")
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, TypeError, SyntaxError) as e:
        errs.append(f"unreadable: {e}")
        kind = None
    if lvl == 5 and kind and sample["params"].get("case") != kind:
        errs.append(f"params.case {sample['params'].get('case')} but the trinomial is {kind}")
    if lvl in (1, 3, 4, 6) and kind and sample["params"].get("case") != kind:
        errs.append(f"params.case {sample['params'].get('case')} but the exercise is {kind}")
    return errs, kind
