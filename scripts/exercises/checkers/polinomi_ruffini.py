"""Checker for polinomi-ruffini, from specs/exercises/polinomi-ruffini.md and lesson 33.

Everything is recomputed from the LaTeX the student sees: the dividend and the divisor are read
from the problem, quotient and remainder come from SymPy's polynomial division (not from a
Ruffini table), the remainder of level 5 from `rem`, the divisor of level 6 by dividing by each
option, the k of level 7 by solving rem(P, x - a) = 0. The Ruffini table in the steps is read
back and compared with the division; every choice option is parsed from its LaTeX."""
import re

from sympy import Poly, Rational, Symbol, SympifyError, div, rem, solve, sympify

from checkers.monomi_common import forbidden

X = Symbol("x")
K = Symbol("k")
LOCALS = {"x": X, "k": K}

# Exact divisions (remainder 0) are about a quarter of levels 1-3, by construction.
CASE_RANGES = {lvl: {"esatta": (0.10, 0.45), "con resto": (0.55, 0.90)} for lvl in (1, 2, 3)}

PROMPTS = {
    1: "Dividi con la regola di Ruffini: trova il quoziente Q(x) e il resto R.",
    5: "Trova il resto della divisione senza eseguirla.",
    6: "Per quale di questi binomi il polinomio è divisibile?",
    7: "Trova il valore di k per cui la divisione è esatta.",
}


class TexError(Exception):
    pass


class _Pair:
    """(quotient LaTeX, remainder LaTeX) with the interface of a regex match."""

    def __init__(self, parts):
        self.parts = parts

    def group(self, i):
        return self.parts[i - 1]


def tex(s):
    """LaTeX of a polynomial or number in x (and k) -> SymPy. Only what the lesson writes."""
    t = s.replace("\\left(", "(").replace("\\right)", ")").replace("\\cdot", "*")
    for _ in range(5):
        t = re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", r"((\1)/(\2))", t)
    t = re.sub(r"\^\{([^{}]*)\}", r"**(\1)", t)
    t = re.sub(r"\^(\d)", r"**\1", t)
    if "\\" in t or "{" in t or not re.fullmatch(r"[0-9xk+\-*/() ]+", t):
        raise TexError(f"cannot read {s!r}")
    t = re.sub(r"(?<=[0-9xk)])\s*(?=[xk(])", "*", t)
    try:
        return sympify(t, locals=LOCALS)
    except (SympifyError, SyntaxError, TypeError) as e:
        raise TexError(f"cannot read {s!r}") from e


def poly_desc(e, gen=X):
    return Poly(e, gen).all_coeffs()


def split_division(problem):
    m = re.fullmatch(r"\((.*)\) : (\(x [+-] [^()]*\)|\\left\(x [+-] .*\\right\))", problem)
    if not m:
        raise TexError(f"problem is not '(P) : (x - a)': {problem}")
    P = tex(m.group(1))
    D = tex(m.group(2))
    Dp = Poly(D, X)
    if Dp.degree() != 1 or Dp.LC() != 1:
        raise TexError(f"divisor {D} is not x - a")
    return P, D, -Dp.nth(0)


def is_int_list(cs, lim):
    return all(Rational(c).is_integer and abs(c) <= lim for c in cs)


def numeric_choice(sample, truth, errs):
    ch = sample.get("choice") or (sample["answer"] if sample["answer"].get("kind") == "choice" else None)
    if not ch:
        errs.append("no choice variant")
        return []
    opts = ch.get("options", [])
    vals = []
    for o in opts:
        lt = o.get("latex", "")
        errs.extend(forbidden(lt, "option"))
        try:
            v = Rational(o["values"][0])
            if tex(lt) != v or len(o["values"]) != 1:
                errs.append(f"option latex {lt} != value {o['values']}")
        except (TexError, TypeError, ValueError, KeyError, IndexError) as e:
            errs.append(f"option unreadable ({e}): {o}")
            return []
        vals.append(v)
    if len(opts) != 4 or len(set(vals)) != len(vals):
        errs.append(f"need 4 distinct options: {vals}")
    if vals.count(truth) != 1:
        errs.append(f"{vals.count(truth)} options equal the truth {truth}")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(vals) or vals[idx] != truth:
        errs.append(f"choice.correct {idx} does not point at {truth}")
    return vals


def check_division(sample, errs):
    lvl = sample["level"]
    P, D, a = split_division(sample["problem"])
    Q, R = div(P, D, X)
    if not R.is_Rational:
        return errs + [f"remainder {R} is not a number"], None
    pc = poly_desc(P)
    qc = poly_desc(Q)
    n = len(pc) - 1
    missing = sum(1 for c in pc if c == 0)

    # the answer: four pairs "Q(x) = ..., R = ..."
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["levels 1-4 answer with a choice of pairs"], None
    pairs = []
    for o in ans.get("options", []):
        # a gathered environment: "Q(x) = ..." (possibly continued on a line "\\quad + ..."), then "R = ..."
        m = None
        g = re.fullmatch(r"\\begin\{gathered\} (.*) \\end\{gathered\}", o.get("latex", ""))
        if g:
            lines = g.group(1).split(" \\\\ ")
            conts = lines[1:-1]
            if 2 <= len(lines) <= 3 and all(re.fullmatch(r"\\quad [+-] .*", c) for c in conts):
                q_tex = " ".join([lines[0]] + [c[len("\\quad "):] for c in conts])
                m = re.fullmatch(r"Q\(x\) = (.*)()", q_tex)
                r = re.fullmatch(r"R = (.*)", lines[-1])
                if m and r:
                    m = (m.group(1), r.group(1))
                else:
                    m = None
        if not m:
            errs.append(f"option is not a pair on two lines: {o.get('latex')}")
            continue
        m = _Pair(m)
        errs.extend(forbidden(m.group(1), "option"))
        errs.extend(forbidden(m.group(2), "option"))
        try:
            oq, orr = tex(m.group(1)), tex(m.group(2))
            vq, vr = sympify(o["values"][0], locals=LOCALS), Rational(o["values"][1])
        except (TexError, TypeError, ValueError, KeyError, IndexError) as e:
            errs.append(f"option unreadable ({e})")
            continue
        if (oq - vq).expand() != 0 or orr != vr or len(o["values"]) != 2:
            errs.append(f"option latex differs from its values: {o}")
        if Poly(oq, X).degree() < 0:
            errs.append(f"option with zero quotient: {o['latex']}")
        pairs.append((Poly(oq, X), orr))
    truth = (Poly(Q, X), R)
    if len(pairs) != 4 or len(set(pairs)) != 4:
        errs.append("need four distinct pairs")
    if pairs.count(truth) != 1:
        errs.append(f"{pairs.count(truth)} options equal quotient {Q} and remainder {R}")
    idx = ans.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(pairs) or pairs[idx] != truth:
        errs.append(f"answer.correct {idx} does not point at Q = {Q}, R = {R}")
    # the sign-of-a mistake (lesson's ad-warning) must be among the options when it differs
    Qw, Rw = div(P, X + a, X)
    if (Poly(Qw, X), Rw) != truth and (Poly(Qw, X), Rw) not in pairs:
        errs.append("the option with the sign of a changed is missing")

    # numbers of the lesson
    if not is_int_list(pc, 20) or pc[0] == 0:
        errs.append(f"dividend coefficients {pc} not integers up to 20")
    if not is_int_list(qc, 30):
        errs.append(f"quotient coefficients {qc} not integers up to 30")
    if abs(R.p) > 60:
        errs.append(f"remainder {R} too large")
    if lvl == 1:
        if not (a.is_integer and 1 <= a <= 5) or missing or n not in (2, 3):
            errs.append(f"level 1: a in 1..5, complete dividend of degree 2-3 (a = {a}, {pc})")
    elif lvl == 2:
        if not (a.is_integer and 1 <= a <= 4) or not 1 <= missing <= 2 or n not in (3, 4):
            errs.append(f"level 2: a in 1..4, degree 3-4 with 1 or 2 missing terms (a = {a}, {pc})")
    elif lvl == 3:
        if not (a.is_integer and -5 <= a <= -1) or missing > 1 or n not in (3, 4) or pc[-1] == 0:
            errs.append(f"level 3: a in -5..-1, degree 3-4, at most one missing term (a = {a}, {pc})")
    elif lvl == 4:
        if a.is_integer or a.q > 3 or abs(a.p) > 3 or missing or n not in (2, 3):
            errs.append(f"level 4: fractional a, complete dividend of degree 2-3 (a = {a}, {pc})")

    # steps: the table read back, the result, the check P(a) = R
    steps = sample.get("steps", [])
    tables = [s for s in steps if s.startswith("\\begin{array}")]
    if len(tables) != 1:
        errs.append("no Ruffini table in the steps")
    else:
        body = re.fullmatch(r"\\begin\{array\}\{r\|(r+)\|r\} (.*) \\end\{array\}", tables[0])
        if not body:
            errs.append("table not readable")
        else:
            rows = [r.replace("\\hline", "").strip() for r in body.group(2).split("\\\\")]
            cells = [[c.strip() for c in r.split("&")] for r in rows]
            try:
                top = [tex(c) for c in cells[0][1:]]
                left = tex(cells[1][0])
                bottom = [tex(c) for c in cells[2][1:]]
                if len(body.group(1)) != n or top != pc or left != a or bottom != qc + [R]:
                    errs.append(f"table differs from the division: {tables[0]}")
                if cells[0][0] or cells[2][0] or cells[1][1]:
                    errs.append("table cells out of place")
            except (TexError, IndexError) as e:
                errs.append(f"table not readable ({e})")
    if not any(s == sample["solution"] for s in steps):
        errs.append("solution not among the steps")
    m = re.fullmatch(r"Q\(x\) = (.*) \\qquad R = (.*)", sample["solution"])
    try:
        if not m or (tex(m.group(1)) - Q).expand() != 0 or tex(m.group(2)) != R:
            errs.append(f"solution {sample['solution']} != Q = {Q}, R = {R}")
    except TexError as e:
        errs.append(f"solution unreadable ({e})")
    errs.extend(value_chain_errors(steps[-1], P, a, R))

    p = sample["params"]
    if [Rational(c) for c in p.get("dividend", [])] != pc or Rational(p.get("a")) != a:
        errs.append("params differ from the problem")
    kind = "esatta" if R == 0 else "con resto"
    if p.get("case") != kind:
        errs.append(f"params.case {p.get('case')} but the division is {kind}")
    return errs, kind


def value_chain_errors(step, P, a, want):
    """'... P(a) = t1 + t2 + ... = v': every member equals P(a), and P(a) equals want."""
    m = re.search(r"P(\(.*?\)|\\left\(.*?\\right\)) = (.*)$", step)
    if not m:
        return [f"no value step: {step}"]
    try:
        if tex(m.group(1)) != a:
            return [f"value step at the wrong point: {step}"]
        members = [tex(part) for part in m.group(2).split(" = ")]
    except TexError as e:
        return [f"value step unreadable ({e}): {step}"]
    truth = P.subs(X, a)
    if any(v != truth for v in members) or truth != want:
        return [f"value step {step}: P({a}) = {truth}, expected {want}"]
    return []


def check_rest(sample, errs):
    P, D, a = split_division(sample["problem"])
    truth = rem(P, D, X)
    pc = poly_desc(P)
    n = len(pc) - 1
    ans = sample["answer"]
    if ans.get("kind") != "number" or Rational(ans.get("value")) != truth:
        errs.append(f"answer {ans.get('value')} != remainder {truth}")
    vals = numeric_choice(sample, truth, errs)
    wrong = P.subs(X, -a)
    if wrong != truth and vals and wrong not in vals:
        errs.append("the option P(-a) (zero with the sign changed) is missing")
    if not (a.is_integer and 1 <= abs(a) <= 3):
        errs.append(f"a = {a} not an integer in -3..3")
    max_deg = {1: 6, 2: 4, 3: 3}.get(abs(a), 0)
    if not 3 <= n <= max_deg:
        errs.append(f"degree {n} with a = {a}")
    if not is_int_list(pc, 5) or sum(1 for c in pc if c != 0) < 3:
        errs.append(f"coefficients {pc}: at least three terms, up to 5")
    if abs(truth) > 99:
        errs.append(f"remainder {truth} over 99")
    steps = sample.get("steps", [])
    for st in steps[1:3]:
        errs.extend(value_chain_errors(st, P, a, truth))
    if sample["solution"] != f"R = {sympy_latex(truth)}" or steps[-1] != sample["solution"]:
        errs.append(f"solution {sample['solution']} != R = {truth}")
    return errs, "a positivo" if a > 0 else "a negativo"


def sympy_latex(r):
    r = Rational(r)
    if r.q == 1:
        return str(r.p)
    return f"{'-' if r < 0 else ''}\\frac{{{abs(r.p)}}}{{{r.q}}}"


def check_divisibility(sample, errs):
    m = re.fullmatch(r"P\(x\) = (.*)", sample["problem"])
    if not m:
        return errs + ["problem is not 'P(x) = ...'"], None
    P = tex(m.group(1))
    pc = poly_desc(P)
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["level 6 answers with a choice"], None
    zeros = []
    divisors = []
    for i, o in enumerate(ans.get("options", [])):
        try:
            D = tex(o["latex"])
            if (D - sympify(o["values"][0], locals=LOCALS)).expand() != 0:
                errs.append(f"option latex differs from its value: {o}")
        except (TexError, KeyError, IndexError, TypeError) as e:
            errs.append(f"option unreadable ({e})")
            continue
        Dp = Poly(D, X)
        if Dp.degree() != 1 or Dp.LC() != 1:
            errs.append(f"option {o['latex']} is not x - c")
            continue
        zeros.append(-Dp.nth(0))
        if rem(P, D, X) == 0:
            divisors.append(i)
    if len(zeros) != 4 or len(set(zeros)) != 4:
        errs.append(f"need four distinct binomials: {zeros}")
    elif set(zeros) != {-z for z in zeros} or 0 in zeros:
        errs.append(f"options must be x - r, x + r, x - s, x + s: {zeros}")
    if len(divisors) != 1 or divisors[0] != ans.get("correct"):
        errs.append(f"divisors among the options: {divisors}, correct = {ans.get('correct')}")
    if len(pc) != 4 or not is_int_list(pc, 30):
        errs.append(f"need a third-degree polynomial with coefficients up to 30: {pc}")
    if zeros and not all(z.is_integer and 1 <= abs(z) <= 3 for z in zeros):
        errs.append(f"zeros {zeros} outside -3..3")
    for st in sample.get("steps", []):
        mm = re.match(r"(x [+-] \d+)\\text\{: \}(.*)\\text\{, (non divisibile|divisibile)\}$", st)
        if mm:
            c = -Poly(tex(mm.group(1)), X).nth(0)
            errs.extend(value_chain_errors(mm.group(2), P, c, P.subs(X, c)))
            if (P.subs(X, c) == 0) != (mm.group(3) == "divisibile"):
                errs.append(f"wrong verdict: {st}")
    r = zeros[ans["correct"]] if divisors and isinstance(ans.get("correct"), int) and ans["correct"] < len(zeros) else 0
    return errs, "zero positivo" if r > 0 else "zero negativo"


def check_param(sample, errs):
    P, D, a = split_division(sample["problem"])
    Pk = Poly(P, X)
    ks = [c for c in Pk.all_coeffs() if c.has(K)]
    if len(ks) != 1 or ks[0] != K:
        errs.append(f"k must be the whole coefficient of one power: {P}")
    rest = rem(P, D, X)
    sol = solve(rest, K)
    if len(sol) != 1:
        return errs + [f"k not determined: {sol}"], None
    k = sol[0]
    ans = sample["answer"]
    if ans.get("kind") != "number" or Rational(ans.get("value")) != k:
        errs.append(f"answer {ans.get('value')} != k = {k}")
    numeric_choice(sample, k, errs)
    full = poly_desc(P.subs(K, k))
    if len(full) != 4 or not is_int_list(full, 30) or any(c == 0 for c in full):
        errs.append(f"with k = {k} the polynomial {full} is not a complete cubic with coefficients up to 30")
    if not (k.is_integer and k != 0):
        errs.append(f"k = {k} is not a nonzero integer")
    if not (a.is_integer and 1 <= abs(a) <= 3):
        errs.append(f"a = {a} outside -3..3")
    if sample["solution"] != f"k = {sympy_latex(k)}":
        errs.append(f"solution {sample['solution']} != k = {k}")
    return errs, "k termine noto" if Pk.nth(0) == K else "k coefficiente"


def check(sample):
    lvl = sample.get("level")
    errs = []
    want = PROMPTS[1] if lvl in (1, 2, 3, 4) else PROMPTS.get(lvl)
    if sample.get("prompt") != want:
        errs.append(f"unexpected prompt {sample.get('prompt')!r}")
    errs.extend(forbidden(sample["problem"]))
    try:
        if lvl in (1, 2, 3, 4):
            return check_division(sample, errs)
        if lvl == 5:
            return check_rest(sample, errs)
        if lvl == 6:
            return check_divisibility(sample, errs)
        if lvl == 7:
            return check_param(sample, errs)
    except TexError as e:
        return errs + [str(e)], None
    return errs + [f"unknown level {lvl}"], None
