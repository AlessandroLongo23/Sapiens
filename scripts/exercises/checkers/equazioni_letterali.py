"""Checker for equazioni-letterali, from specs/exercises/equazioni-letterali.md and lesson 50.

Everything is recomputed from the LaTeX the student sees. Levels 1-5: the equation is read from the
problem, lhs - rhs is expanded with SymPy as A(a)*x - B(a); the values of the parameter that cancel A,
the kind of each one (0x = 0 indeterminate, 0x = B(r) != 0 impossible) and the generic solution
cancel(B/A) are the truth. Every discussion offered as an option is parsed back from its LaTeX,
compared with its `values`, and exactly one must say the same as the truth. Level 6: the formula is
read from the problem and solved for the letter with `solve`; every option is parsed and compared.
Level 7: the givens are read from the problem, substituted, and the formula solved for the letter.
"""
import math
import re

from sympy import Eq, Integer, Poly, Rational, Symbol, cancel, expand, pi, simplify, solve, sympify

from checkers.monomi_common import forbidden

A_ = Symbol("a")
X_ = Symbol("x")

# Level 3: about two thirds indeterminate, one third impossible, by construction.
CASE_RANGES = {3: {"indeterminata": (0.52, 0.82), "impossibile": (0.18, 0.48)}}


class TexError(Exception):
    pass


def _match_brace(s, i):
    """s[i] == '{': index of the matching '}'."""
    depth = 0
    for j in range(i, len(s)):
        if s[j] == "{":
            depth += 1
        elif s[j] == "}":
            depth -= 1
            if depth == 0:
                return j
    raise TexError(f"unbalanced braces in {s!r}")


def _fracs(s):
    while True:
        i = s.find("\\frac")
        if i < 0:
            return s
        j = i + len("\\frac")
        if j >= len(s) or s[j] != "{":
            raise TexError("\\frac without braces")
        k = _match_brace(s, j)
        if k + 1 >= len(s) or s[k + 1] != "{":
            raise TexError("\\frac without denominator")
        m = _match_brace(s, k + 1)
        s = s[:i] + f"(({_fracs(s[j + 1:k])})/({_fracs(s[k + 2:m])}))" + s[m + 1:]


def tex2sym(tex, names=None):
    """LaTeX of an expression (monomials with juxtaposition, \\frac, ^, \\cdot, \\pi, s_0, v_0) -> SymPy."""
    s = tex.replace("\\left", "").replace("\\right", "").replace("\\cdot", "*").replace("\\pi", " pi ")
    s = s.replace("\\,", " ").replace("\\ ", " ")
    s = re.sub(r"([sv])_0", r"\g<1>0", s)
    s = _fracs(s)
    s = re.sub(r"\^\{([^{}]*)\}", r"**(\1)", s)
    s = re.sub(r"\^(\d)", r"**\1", s)
    if "\\" in s or "{" in s or "}" in s:
        raise TexError(f"unsupported LaTeX: {tex!r}")
    toks = re.findall(r"\*\*|pi|[sv]0|\d+|[A-Za-z]|[-+*/()]|\S", s)
    out = []
    for tk in toks:
        if not re.fullmatch(r"\*\*|pi|[sv]0|\d+|[A-Za-z]|[-+*/()]", tk):
            raise TexError(f"unexpected {tk!r} in {tex!r}")
        if out:
            prev = out[-1]
            prev_val = prev == ")" or re.fullmatch(r"pi|[sv]0|\d+|[A-Za-z]", prev)
            cur_val = tk == "(" or re.fullmatch(r"pi|[sv]0|[A-Za-z]", tk) or (tk.isdigit() and prev == ")")
            if prev_val and cur_val:
                out.append("*")
        out.append(tk)
    local = {n: Symbol(n) for n in (names or [])}
    local.update({"a": A_, "x": X_, "pi": pi})
    for ch in "ABCDEFGHIJKLMNOPQRSTUVWXYZbcdefghijklmnopqrstuvwyz":
        local.setdefault(ch, Symbol(ch))
    local.update({"s0": Symbol("s0"), "v0": Symbol("v0")})
    return sympify("".join(out), locals=local)


def same(e1, e2):
    return simplify(cancel(e1 - e2)) == 0


# ---------------------------------------------------------------------------
# Discussions


def parse_value_disc(values):
    """["x=...", "a=2:ind", "a=-1:det:1/2"] or ["per_ogni", "x=..."] -> (all, generic, frozenset of cases)."""
    allflag = values[0] == "per_ogni"
    vs = values[1:] if allflag else values
    if not vs or not vs[0].startswith("x="):
        raise TexError(f"bad values {values}")
    gen = sympify(vs[0][2:], locals={"a": A_})
    cases = []
    for c in vs[1:]:
        m = re.fullmatch(r"a=(-?\d+):(imp|ind|det)(?::(-?\d+(?:/\d+)?))?", c)
        if not m:
            raise TexError(f"bad case {c!r}")
        cases.append((int(m.group(1)), m.group(2), Rational(m.group(3)) if m.group(3) else None))
    return allflag, gen, frozenset(cases)


_SET = r"S = \\left\\\{ (.+) \\right\\\}"


def parse_tex_disc(latex):
    m = re.fullmatch(r"\\text\{per ogni \} a\\text\{: \} " + _SET, latex)
    if m:
        return True, tex2sym(m.group(1)), frozenset()
    g = re.fullmatch(r"\\begin\{gathered\} (.+) \\end\{gathered\}", latex)
    if not g:
        raise TexError(f"option not in the expected form: {latex!r}")
    lines = [ln.strip() for ln in g.group(1).split(" \\\\ ")]
    first = re.fullmatch(r"(.+)\\text\{: \} " + _SET, lines[0])
    if not first:
        raise TexError(f"first line not in the expected form: {lines[0]!r}")
    cond = first.group(1).strip()
    pm = re.fullmatch(r"a \\neq \\pm (\d+)", cond)
    if pm:
        excluded = {int(pm.group(1)), -int(pm.group(1))}
    else:
        parts = cond.split(",\\ ")
        excluded = set()
        for p in parts:
            mm = re.fullmatch(r"a \\neq (-?\d+)", p.strip())
            if not mm:
                raise TexError(f"bad condition {cond!r}")
            excluded.add(int(mm.group(1)))
    gen = tex2sym(first.group(2))
    cases = []
    for ln in lines[1:]:
        mm = re.fullmatch(r"a = (-?\d+)\\text\{: \} (.+)", ln)
        if not mm:
            raise TexError(f"bad case line {ln!r}")
        v, rest = int(mm.group(1)), mm.group(2)
        if rest == "S = \\emptyset":
            cases.append((v, "imp", None))
        elif rest == "S = \\mathbb{R}":
            cases.append((v, "ind", None))
        else:
            sv = re.fullmatch(_SET, rest)
            if not sv:
                raise TexError(f"bad case value {rest!r}")
            cases.append((v, "det", Rational(tex2sym(sv.group(1)))))
    if excluded != {c[0] for c in cases}:
        raise TexError(f"excluded values {excluded} differ from the cases {cases}")
    return False, gen, frozenset(cases)


def parse_solution_line(latex):
    """The solution as the page shows it, one line of prose:
    \\text{per } a \\neq 0\\text{: } S = ... \\text{; per } a = 0\\text{: } S = \\emptyset.
    Rebuilt as the gathered form of the options and parsed the same way."""
    if "\\begin" in latex:
        raise TexError(f"solution with an environment: {latex!r}")
    parts = [p.strip() for p in latex.split("\\text{; per } ")]
    if not parts[0].startswith("\\text{per } "):
        raise TexError(f"solution not in the expected form: {latex!r}")
    parts[0] = parts[0][len("\\text{per } "):]
    return parse_tex_disc("\\begin{gathered} " + " \\\\ ".join(parts) + " \\end{gathered}")


def same_disc(d1, d2):
    return d1[0] == d2[0] and same(d1[1], d2[1]) and d1[2] == d2[2]


# ---------------------------------------------------------------------------
# Levels 1-5


def side_terms(e):
    return expand(e).as_ordered_terms()


def check_equation(sample):
    errs = []
    lvl = sample["level"]
    problem = sample["problem"]
    if problem.count("=") != 1:
        return [f"problem is not one equation: {problem}"], None
    ltex, rtex = problem.split("=")
    L, R = tex2sym(ltex), tex2sym(rtex)
    errs += forbidden(problem)
    eq = sample["params"].get("equation", "")
    pl, pr = eq.split(" = ")
    if not same(sympify(pl, locals={"a": A_, "x": X_}) - sympify(pr, locals={"a": A_, "x": X_}), L - R):
        errs.append("params.equation differs from the problem")
    expr = expand(L - R)
    P = Poly(expr, X_)
    if P.degree() != 1:
        return errs + [f"degree in x is {P.degree()}"], None
    A = expand(P.coeff_monomial(X_))
    B = expand(-P.coeff_monomial(1))
    lt, rt = side_terms(L), side_terms(R)
    # Readable on a phone: at most 7 terms as written, 25 visible characters.
    written = len(re.findall(r"(?:^|[=+-])\s*[^=+-]", re.sub(r"\([^()]*\)", "()", problem.replace(" ", ""))))
    if written > 7:
        errs.append(f"{written} terms written, at most 7")
    if len(re.sub(r"\\frac|[{}^ ]", "", problem)) > 25:
        errs.append(f"problem too long: {problem}")
    if not any(t.has(X_) for t in rt) and not any(not t.has(X_) for t in lt):
        errs.append("already in normal form: nothing to move")
    for t in lt + rt:
        c = t.as_coeff_Mul()[0]
        if abs(c) > 12 or Rational(c).q > 12:
            errs.append(f"coefficient {c} too large")
    if not A.has(A_):
        if A == 0:
            return errs + ["coefficient of x is zero"], None
        roots = []
    else:
        roots = solve(A, A_)
        if any(not (r.is_integer) for r in roots):
            return errs + [f"coefficient {A} has non-integer zeros {roots}"], None
        roots = sorted(int(r) for r in roots)
    cases = frozenset((r, "ind" if B.subs(A_, r) == 0 else "imp", None) for r in roots)
    gen = cancel(B / A)
    truth = (False, gen, cases)
    kinds = sorted(k for _, k, _ in cases)
    Apoly = Poly(A, A_)
    Bpoly = Poly(B, A_)
    kind = None
    if lvl == 1:
        if A.has(A_) or A in (1, -1) or Bpoly.degree() != 1:
            errs.append(f"level 1: numeric coefficient other than ±1 and a known term with a: A={A}, B={B}")
        g = Poly(gen, A_)
        if any(not c.is_integer for c in g.all_coeffs()) or abs(g.coeff_monomial(A_)) > 5 or abs(g.coeff_monomial(1)) > 6:
            errs.append(f"level 1: solution {gen} is not ma + n with small integers")
    elif lvl == 2:
        if Apoly.degree() != 1 or Apoly.coeff_monomial(1) != 0 or abs(Apoly.LC()) > 3 or kinds != ["imp"] or roots != [0]:
            errs.append(f"level 2: coefficient ca, impossible for a = 0: A={A}, B={B}")
    elif lvl == 3:
        if Apoly.degree() != 1 or Apoly.LC() != 1 or len(roots) != 1 or roots[0] == 0 or abs(roots[0]) > 5:
            errs.append(f"level 3: coefficient a - r: A={A}")
        if sum(1 for t in lt + rt if t.has(X_)) < 2:
            errs.append("level 3: x must be collected from at least two terms")
        kind = {"ind": "indeterminata", "imp": "impossibile"}.get(kinds[0]) if len(kinds) == 1 else None
    elif lvl == 4:
        if Apoly.degree() != 2 or Apoly.LC() != 1 or len(roots) != 2 or kinds != ["imp", "ind"]:
            errs.append(f"level 4: two factors, three cases: A={A}, B={B}, cases={sorted(cases)}")
        if sum(1 for t in lt + rt if t.has(X_)) < 2:
            errs.append("level 4: x must be collected from at least two terms")
    elif lvl == 5:
        dens = {int(d) for d in re.findall(r"\\frac\{[^{}]*\}\{(\d+)\}", problem)}
        if len({d for d in dens if d > 1}) < 2:
            errs.append(f"level 5: need two different denominators, got {dens}")
        mcm = 1
        for d in dens:
            mcm = mcm * d // math.gcd(mcm, d)
        Ac = Poly(expand(A * mcm), A_)
        if Ac.degree() != 1 or Ac.LC() != -1 or Ac.coeff_monomial(1) <= 0 or kinds != ["imp"]:
            errs.append(f"level 5: after the mcm the coefficient must be r - a with r > 0, impossible: {Ac}")
    else:
        errs.append(f"unknown level {lvl}")

    ans = sample["answer"]
    if lvl == 1:
        if ans.get("kind") != "expression":
            errs.append("level 1 answer must be an expression")
        else:
            if not same(sympify(ans["value"], locals={"a": A_}), gen):
                errs.append(f"answer {ans['value']} != {gen}")
            if not same(tex2sym(ans["latex"]), gen):
                errs.append(f"answer latex {ans['latex']} != {gen}")
        ch = sample.get("choice")
        if ch is None:
            errs.append("no choice variant")
        else:
            errs += check_expr_choice(ch, gen, "x")
    else:
        if ans.get("kind") != "choice":
            errs.append("levels 2-5: the answer is a choice among discussions")
        else:
            errs += check_disc_choice(ans, truth)
            try:
                if not same_disc(parse_solution_line(sample["solution"]), truth):
                    errs.append("solution differs from the truth")
            except TexError as e:
                errs.append(f"solution unreadable: {e}")
        ch = sample.get("choice")
        if ch is not None and ch != ans:
            errs.append("choice differs from the answer")
    return errs, kind


def check_disc_choice(ch, truth):
    errs = []
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    parsed = []
    for o in opts:
        try:
            dt = parse_tex_disc(o["latex"])
            dv = parse_value_disc(o["values"])
        except (TexError, Exception) as e:  # noqa: BLE001 - any parse failure fails the option
            errs.append(f"option unreadable: {e}")
            return errs
        if not same_disc(dt, dv):
            errs.append(f"option latex and values differ: {o['latex']} / {o['values']}")
        parsed.append(dt)
    right = [i for i, d in enumerate(parsed) if same_disc(d, truth)]
    if len(right) != 1:
        errs.append(f"{len(right)} options equal the truth")
    elif ch.get("correct") != right[0]:
        errs.append(f"choice.correct = {ch.get('correct')}, truth is option {right[0]}")
    for i in range(len(parsed)):
        for j in range(i + 1, len(parsed)):
            if same_disc(parsed[i], parsed[j]):
                errs.append(f"options {i} and {j} say the same thing")
    return errs


def check_expr_choice(ch, truth, var, names=None):
    errs = []
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    vals = []
    for o in opts:
        m = re.fullmatch(re.escape(var) + r" = (.+)", o["latex"])
        if not m:
            return errs + [f"option not '{var} = ...': {o['latex']!r}"]
        v = tex2sym(m.group(1), names)
        loc = {n: Symbol(n) for n in (names or [])}
        loc.update({"a": A_, "pi": pi})
        if not same(v, sympify(o["values"][0], locals=loc)):
            errs.append(f"option latex and value differ: {o['latex']} / {o['values']}")
        vals.append(v)
    right = [i for i, v in enumerate(vals) if same(v, truth)]
    if len(right) != 1:
        errs.append(f"{len(right)} options equal the truth {truth}")
    elif ch.get("correct") != right[0]:
        errs.append("choice.correct is wrong")
    for i in range(len(vals)):
        for j in range(i + 1, len(vals)):
            if same(vals[i], vals[j]):
                errs.append(f"options {i} and {j} are equal")
    return errs


# ---------------------------------------------------------------------------
# Levels 6-7: inverse formulas

TEX_OF = {"s0": "s_0", "v0": "v_0"}
PROSE_OF = {"s0": "s₀", "v0": "v₀"}


def formula_parts(tex):
    if tex.count("=") != 1:
        raise TexError(f"formula is not one equation: {tex}")
    l, r = tex.split("=")
    return tex2sym(l), tex2sym(r)


def solve_for(L, R, target):
    sol = solve(Eq(L, R), Symbol(target))
    if len(sol) != 1:
        raise TexError(f"{len(sol)} solutions for {target}")
    return sol[0]


def check_formula(sample):
    errs = []
    p = sample["params"]
    tg = p["target"]
    L, R = formula_parts(sample["problem"])
    if Symbol(tg) not in (L - R).free_symbols:
        return [f"letter {tg} not in the formula"], None
    if not re.search(rf"\b{re.escape(PROSE_OF.get(tg, tg))}\b", sample["prompt"]):
        errs.append(f"prompt does not name {tg}: {sample['prompt']}")
    truth = solve_for(L, R, tg)
    ans = sample["answer"]
    names = [str(s) for s in (L - R).free_symbols]
    loc = {n: Symbol(n) for n in names}
    loc["pi"] = pi
    if ans.get("kind") != "expression" or not same(sympify(ans["value"], locals=loc), truth):
        errs.append(f"answer {ans.get('value')} != {truth}")
    var = TEX_OF.get(tg, tg)
    m = re.fullmatch(re.escape(var) + r" = (.+)", ans.get("latex", ""))
    if not m or not same(tex2sym(m.group(1), names), truth):
        errs.append(f"answer latex {ans.get('latex')} != {truth}")
    ch = sample.get("choice")
    if ch is None:
        errs.append("no choice variant")
    else:
        errs += check_expr_choice(ch, truth, var, names)
    return errs, None


def check_numeric(sample):
    errs = []
    p = sample["params"]
    tg = p["target"]
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.+) \\\\ (.+) \\end\{array\}", sample["problem"])
    if not m:
        return [f"problem not in the expected form: {sample['problem']}"], None
    L, R = formula_parts(m.group(1))
    given = {}
    for item in m.group(2).split(" \\quad "):
        g = re.fullmatch(r"([A-Za-z](?:_0)?) = (\d+)(?:\\ \\text\{[^{}]+\}(?:\^[23])?|\^\\circ\\text\{[CF]\})?", item.strip())
        if not g:
            return errs + [f"given not readable: {item!r}"], None
        given[g.group(1).replace("_0", "0")] = Integer(g.group(2))
    letters = {str(s) for s in (L - R).free_symbols}
    if set(given) | {tg} != letters or tg in given:
        errs.append(f"givens {sorted(given)} + {tg} are not the letters {sorted(letters)}")
    sol = solve(Eq(L, R).subs({Symbol(k): v for k, v in given.items()}), Symbol(tg))
    if len(sol) != 1:
        return errs + [f"{len(sol)} solutions"], None
    val = sol[0]
    if not (val.is_integer and val > 0):
        errs.append(f"value {val} is not a positive integer")
    ans = sample["answer"]
    if ans.get("kind") != "number" or Rational(ans["value"]) != val:
        errs.append(f"answer {ans.get('value')} != {val}")
    if str(val) not in sample["solution"]:
        errs.append("solution does not show the value")
    if not re.search(rf"\b{re.escape(PROSE_OF.get(tg, tg))}\b", sample["prompt"]):
        errs.append(f"prompt does not name {tg}")
    ch = sample.get("choice")
    if ch is None:
        errs.append("no choice variant")
    else:
        vals = [Rational(o["values"][0]) for o in ch["options"]]
        if len(vals) != 4 or len(set(vals)) != 4:
            errs.append(f"options not four distinct numbers: {vals}")
        if [v for v in vals if v == val] != [val] or vals[ch["correct"]] != val:
            errs.append("choice.correct is wrong")
        for o in ch["options"]:
            if Rational(tex2sym(o["latex"])) != Rational(o["values"][0]):
                errs.append(f"option latex {o['latex']} != {o['values']}")
    return errs, None


def check(sample):
    lvl = sample["level"]
    if not sample.get("steps"):
        return ["no steps"], None
    try:
        if lvl <= 5:
            return check_equation(sample)
        if lvl == 6:
            return check_formula(sample)
        if lvl == 7:
            return check_numeric(sample)
    except TexError as e:
        return [f"unreadable: {e}"], None
    return [f"unknown level {lvl}"], None
