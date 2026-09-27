"""Independent checker for equazioni-parametriche (specs/exercises/equazioni-parametriche.md).

Written from the spec, not from the generator. The equation a*x^2 + b*x + c = 0 is rebuilt from params and
from the problem LaTeX (parsed again here), and every answer is recomputed with SymPy from the definitions:
the value of k that makes a zero and the solution of the equation of first degree left (level 1), the set of
k with two distinct real solutions or the k with a double root (level 2), the k for which the given number is
a solution and the other root (level 3), and for levels 4-6 the set of k for which the equation is of second
degree, has real solutions, and its actual roots (solved with SymPy) have the property asked. Each option is
read back from its LaTeX and must say the same thing as its values; exactly one option equals the truth.
"""
import re

from sympy import (
    Complement,
    EmptySet,
    FiniteSet,
    Interval,
    Poly,
    Rational,
    S,
    Symbol,
    expand,
    oo,
    roots,
    solve,
    solveset,
    sympify,
    together,
)

from verify import FORBIDDEN, rat, x

k = Symbol("k", real=True)
MAX_COEF = 12

CASE_RANGES = {
    2: {"distinte": (0.35, 0.65), "coincidenti": (0.35, 0.65)},
    4: {
        "opposte": (0.12, 0.30),
        "opposte scartato": (0.07, 0.24),
        "reciproche": (0.12, 0.30),
        "reciproche scartato": (0.07, 0.24),
        "reciproche impossibile": (0.04, 0.17),
        "nulla": (0.12, 0.30),
    },
    5: {"somma": (0.20, 0.40), "somma scartato": (0.12, 0.30), "prodotto": (0.20, 0.40), "prodotto scartato": (0.12, 0.30)},
    6: {"uno scartato": (0.55, 0.75), "due accettati": (0.15, 0.35), "nessuno": (0.04, 0.17)},
}

PROMPTS = {
    1: "Trova il valore di k per cui l'equazione è di primo grado e risolvila.",
    "distinte": "Per quali valori di k l'equazione ha due soluzioni reali distinte?",
    "coincidenti": "Per quale valore di k l'equazione ha due soluzioni coincidenti? Trova anche la soluzione doppia.",
    3: "Trova il valore di k per cui il numero dato è una soluzione dell'equazione, e trova l'altra soluzione.",
    "opposte": "Trova k in modo che le soluzioni siano opposte.",
    "reciproche": "Trova k in modo che le soluzioni siano reciproche.",
    "nulla": "Trova k in modo che una soluzione sia nulla.",
    "somma": "Trova k in modo che la somma delle soluzioni sia quella indicata.",
    "prodotto": "Trova k in modo che il prodotto delle soluzioni sia quello indicato.",
    "quadrati": "Trova k in modo che la somma dei quadrati delle soluzioni sia quella indicata.",
}


# ---------------------------------------------------------------------------
# LaTeX readers


def latex_expr(s):
    """An expression in x and k as the problem writes it: (k - 1)x^2 - 2kx + k + 3, x_1^2 + x_2^2."""
    t = s.replace("\\cdot", "*").replace("x_1", "X").replace("x_2", "Y")
    t = re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", r"((\1)/(\2))", t)
    t = t.replace("^", "**")
    t = re.sub(r"(?<=[\dkxXY)])\s*(?=[kxXY(])", "*", t)
    if not re.fullmatch(r"[0-9kxXY+\-*/() ]+", t):
        raise ValueError(f"unreadable expression {s!r}")
    return sympify(t, locals={"k": k, "x": x, "X": Symbol("X"), "Y": Symbol("Y")})


def latex_num(s):
    s = s.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", s)
    if m:
        return Rational(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    if re.fullmatch(r"-?\d+", s):
        return Rational(int(s))
    raise ValueError(f"unreadable number {s!r}")


REL = {"<": "<", "\\leq": "<=", ">": ">", "\\geq": ">="}


def cond_set(rel, h, ex):
    region = {
        "<": Interval.open(-oo, h),
        "<=": Interval(-oo, h),
        ">": Interval.open(h, oo),
        ">=": Interval(h, oo),
    }[rel]
    return Complement(region, FiniteSet(ex)) if ex is not None else region


def read_values(values):
    """An option's values as a comparable object."""
    if values == ["none"]:
        return ("set", frozenset())
    if all(v.startswith("k=") for v in values) and not any(v.startswith("x=") for v in values):
        ks = [rat(v[2:]) for v in values]
        if len(set(ks)) != len(ks) or ks != sorted(ks):
            raise ValueError(f"values not distinct and sorted: {values}")
        return ("set", frozenset(ks))
    if len(values) == 2 and values[0].startswith("k=") and values[1].startswith("x="):
        return ("pair", rat(values[0][2:]), rat(values[1][2:]))
    m = re.fullmatch(r"(<=|>=|<|>)(-?\d+(?:/\d+)?)", values[0])
    if m and len(values) <= 2:
        ex = None
        if len(values) == 2:
            if not values[1].startswith("!="):
                raise ValueError(f"bad exclusion {values}")
            ex = rat(values[1][2:])
        return ("cond", cond_set(m.group(1), rat(m.group(2)), ex))
    raise ValueError(f"unreadable values {values}")


def read_latex_option(latex, level, case):
    """The same object, read from what the student sees."""
    if latex == r"\text{nessun valore di } k":
        return ("set", frozenset())
    parts = [p.strip() for p in latex.split(r",\ ")]
    m = re.fullmatch(r"k = (.+)", parts[0])
    if m and len(parts) == 2 and re.match(r"x", parts[1]):
        name = {1: "x", 3: "x_2"}.get(level, "x_1 = x_2")
        m2 = re.fullmatch(re.escape(name) + r" = (.+)", parts[1])
        if not m2:
            raise ValueError(f"pair option names the solution wrongly: {latex!r}")
        return ("pair", latex_num(m.group(1)), latex_num(m2.group(1)))
    if all(re.fullmatch(r"k = [^,]+", p) for p in parts):
        return ("set", frozenset(latex_num(p[4:]) for p in parts))
    m = re.fullmatch(r"k (<|>|\\leq|\\geq) (.+)", parts[0])
    if m and len(parts) <= 2:
        ex = None
        if len(parts) == 2:
            m2 = re.fullmatch(r"k \\neq (.+)", parts[1])
            if not m2:
                raise ValueError(f"bad exclusion in {latex!r}")
            ex = latex_num(m2.group(1))
        return ("cond", cond_set(REL[m.group(1)], latex_num(m.group(2)), ex))
    raise ValueError(f"unreadable option {latex!r}")


def same(u, v):
    if u[0] != v[0]:
        return False
    if u[0] == "cond":
        return Complement(u[1], v[1]) == EmptySet and Complement(v[1], u[1]) == EmptySet
    return u == v


# ---------------------------------------------------------------------------


def lin(ps):
    if not isinstance(ps, list) or len(ps) != 2:
        raise ValueError(f"bad coefficient {ps!r}")
    return rat(ps[0]) + rat(ps[1]) * k, [rat(ps[0]), rat(ps[1])]


def real_roots(expr):
    """Real roots of a polynomial in x, each repeated by its multiplicity, sorted."""
    out = []
    for r, mult in roots(Poly(expand(expr), x)).items():
        if r.is_real:
            out += [r] * mult
    return sorted(out, key=float)


def check(sample):
    errs = []
    p = sample["params"]
    lvl = sample["level"]
    A, ca = lin(p["a"])
    B, cb = lin(p["b"])
    C, cc = lin(p["c"])
    for c in ca + cb + cc:
        if not c.is_integer or abs(c) > MAX_COEF:
            errs.append(f"coefficient {c} not an integer up to {MAX_COEF}")
    if C == 0:
        errs.append("constant term is zero")
    E = A * x**2 + B * x + C

    # the problem: the equation, and on a second line the given datum (levels 3, 5, 6)
    prob = sample["problem"]
    g = re.fullmatch(r"\\begin\{gathered\} (.+) \\\\ (.+) \\end\{gathered\}", prob)
    eq_tex, given_tex = (g.group(1), g.group(2)) if g else (prob, None)
    m = re.fullmatch(r"(.+) = 0", eq_tex)
    if not m:
        return errs + [f"problem is not an equation = 0: {prob!r}"], None
    if expand(latex_expr(m.group(1)) - E) != 0:
        errs.append(f"problem {eq_tex!r} is not {E} = 0")
    for name, rx in FORBIDDEN + [("1k", re.compile(r"(?<!\d)1\s*k")), ("0k", re.compile(r"(?<!\d)0\s*k"))]:
        if rx.search(eq_tex):
            errs.append(f"problem contains forbidden '{name}': {eq_tex}")
    needs_given = lvl in (3, 5, 6)
    if needs_given != (given_tex is not None):
        errs.append(f"given datum present: {given_tex is not None}, expected {needs_given}")

    if lvl <= 5 and Poly(A, k).degree() != 1:
        errs.append("a must depend on k")
    if lvl == 6 and A != 1:
        errs.append("level 6 needs a = 1")
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("no steps or no solution")
    for t in [sample.get("solution", "")] + sample.get("steps", []):
        if "\\begin" in t:
            errs.append("environment in solution or steps")

    D = expand(B**2 - 4 * A * C)
    case = p.get("case")
    kind = None
    truth = None
    prompt_key = lvl

    if lvl == 1:
        zs = solve(A, k)
        if len(zs) != 1:
            return errs + [f"a = {A} has roots {zs}"], None
        r = zs[0]
        lin_x = expand(E.subs(k, r))
        if Poly(lin_x, x).degree() != 1:
            errs.append(f"for k = {r} the equation is {lin_x} = 0, not of first degree")
            return errs, None
        xs = solve(lin_x, x)
        truth = ("pair", r, xs[0])
        if not (xs[0].q <= 6 and abs(xs[0].p) <= 12):
            errs.append(f"solution {xs[0]} not simple")
    elif lvl == 2:
        if Poly(D, k).degree() != 1:
            return errs + [f"discriminant {D} is not of first degree in k"], None
        r = solve(A, k)[0]
        h = solve(D, k)[0]
        if h.q > 2 or abs(h) > 12:
            errs.append(f"h = {h} out of spec")
        kind = case
        prompt_key = case
        if case == "distinte":
            region = solveset(D > 0, k, S.Reals)
            if r not in region:
                errs.append(f"k = {r} (a = 0) is not in the region {region}: nothing to exclude")
            truth = ("cond", Complement(region, FiniteSet(r)))
        elif case == "coincidenti":
            if A.subs(k, h) == 0:
                errs.append("a = 0 at the double root")
            roots = real_roots(E.subs(k, h))
            if len(roots) != 2 or roots[0] != roots[1]:
                errs.append(f"for k = {h} roots {roots}, expected a double root")
            else:
                truth = ("pair", h, roots[0])
        else:
            errs.append(f"unknown case {case}")
    elif lvl == 3:
        x1 = latex_num(re.fullmatch(r"x_1 = (.+)", given_tex).group(1)) if given_tex else None
        if x1 is None or x1 != rat(p["x1"]) or x1 == 0:
            errs.append(f"given solution {given_tex!r} vs params {p.get('x1')}")
        else:
            ks = solve(E.subs(x, x1), k)
            if len(ks) != 1:
                return errs + [f"x = {x1} gives k in {ks}"], None
            k0 = ks[0]
            if A.subs(k, k0) == 0:
                errs.append(f"a = 0 for k = {k0}")
            roots = real_roots(E.subs(k, k0))
            if x1 not in roots or len(roots) != 2 or roots[0] == roots[1]:
                errs.append(f"for k = {k0} roots {roots}")
            else:
                x2 = roots[1] if roots[0] == x1 else roots[0]
                truth = ("pair", k0, x2)
                if not (k0.q <= 3 and abs(k0.p) <= 12 and x2.q <= 5 and abs(x2.p) <= 12):
                    errs.append(f"k = {k0}, x2 = {x2} out of spec")
    else:
        cond_name = p.get("condition")
        prompt_key = cond_name
        t = None
        if lvl == 5 or lvl == 6:
            want = {"somma": r"x_1 \+ x_2 = (.+)", "prodotto": r"x_1 \\cdot x_2 = (.+)", "quadrati": r"x_1\^2 \+ x_2\^2 = (.+)"}.get(cond_name)
            mm = re.fullmatch(want, given_tex or "") if want else None
            if not mm:
                return errs + [f"given {given_tex!r} does not match condition {cond_name}"], None
            t = latex_num(mm.group(1))
            if t != rat(p["given"]):
                errs.append("given datum differs from params")
        if lvl == 4 and cond_name not in ("opposte", "reciproche", "nulla"):
            return errs + [f"level 4 condition {cond_name}"], None
        if lvl == 5 and cond_name not in ("somma", "prodotto"):
            return errs + [f"level 5 condition {cond_name}"], None
        if lvl == 6 and cond_name != "quadrati":
            return errs + [f"level 6 condition {cond_name}"], None
        # candidates: the equation in k of the table of the lesson
        if cond_name == "opposte":
            eqk = B
        elif cond_name == "reciproche":
            eqk = expand(C - A)
        elif cond_name == "nulla":
            eqk = C
        elif cond_name == "somma":
            eqk = together(-B / A - t)
        elif cond_name == "prodotto":
            eqk = together(C / A - t)
        else:
            eqk = together((-B / A) ** 2 - 2 * C / A - t)
        if eqk == 0:
            return errs + ["condition true for every k"], None
        cands = solveset(eqk, k, S.Reals)
        if not isinstance(cands, FiniteSet) and cands != EmptySet:
            return errs + [f"candidates {cands}"], None
        cands = sorted(cands)
        good = []
        for kv in cands:
            if A.subs(k, kv) == 0:
                continue
            dv = D.subs(k, kv)
            if dv == 0:
                errs.append(f"discriminant zero for k = {kv} (edge case the spec avoids)")
            roots = real_roots(E.subs(k, kv))
            if dv < 0:
                if roots:
                    errs.append("negative discriminant but real roots")
                continue
            two = len(roots) == 2
            if cond_name == "opposte":
                ok = two and expand(roots[0] + roots[1]) == 0 and roots[0] != 0
            elif cond_name == "reciproche":
                ok = two and expand(roots[0] * roots[1] - 1) == 0
            elif cond_name == "nulla":
                ok = two and 0 in roots
            elif cond_name == "somma":
                ok = two and expand(roots[0] + roots[1] - t) == 0
            elif cond_name == "prodotto":
                ok = two and expand(roots[0] * roots[1] - t) == 0
            else:
                ok = two and expand(roots[0] ** 2 + roots[1] ** 2 - t) == 0
            if not ok:
                errs.append(f"k = {kv} passes the checks but roots {roots} fail {cond_name}")
                continue
            good.append(kv)
        truth = ("set", frozenset(good))
        if [rat(v) for v in p.get("values", [])] != sorted(good):
            errs.append(f"params.values {p.get('values')} != {good}")
        for kv in cands:
            if not (kv.q <= 3 and abs(kv.p) <= 12):
                errs.append(f"candidate k = {kv} not simple")
        if lvl == 4:
            if not cands:
                kind = "reciproche impossibile" if cond_name == "reciproche" else "?"
            elif good:
                kind = cond_name
            else:
                kind = f"{cond_name} scartato"
            if cond_name == "nulla" and not good:
                errs.append("zero solution with no value")
        elif lvl == 5:
            if len(cands) != 1:
                errs.append(f"level 5 needs one candidate, got {cands}")
            kind = cond_name if good else f"{cond_name} scartato"
        else:
            if len(cands) != 2 or not all(c.is_integer for c in cands):
                errs.append(f"level 6 needs two integer values of k, got {cands}")
            kind = {1: "uno scartato", 2: "due accettati", 0: "nessuno"}[len(good)]
        if case != kind:
            errs.append(f"params.case {case!r} but the exercise is {kind!r}")

    if sample.get("prompt") != PROMPTS.get(prompt_key):
        errs.append(f"prompt {sample.get('prompt')!r} does not match {prompt_key}")

    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return errs + ["answer must be a choice"], kind
    opts = ans.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    objs = []
    for o in opts:
        try:
            v = read_values(o["values"])
            shown = read_latex_option(o["latex"], lvl, case)
        except Exception as e:  # noqa: BLE001
            errs.append(f"option unreadable: {e}")
            return errs, kind
        if not same(v, shown):
            errs.append(f"option latex {o['latex']!r} != values {o['values']}")
        objs.append(v)
    for i in range(len(objs)):
        for j in range(i + 1, len(objs)):
            if same(objs[i], objs[j]):
                errs.append(f"options {i} and {j} say the same thing")
    if truth is not None:
        hits = [i for i, o in enumerate(objs) if same(o, truth)]
        if len(hits) != 1:
            errs.append(f"{len(hits)} options equal the truth {truth}")
        elif ans.get("correct") != hits[0]:
            errs.append(f"correct = {ans.get('correct')}, truth is option {hits[0]}")
    ch = sample.get("choice")
    if ch is not None and ch != ans:
        errs.append("choice variant differs from the answer")
    return errs, kind
