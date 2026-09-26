#!/usr/bin/env python3
"""Independent verifier for v2 exercise samples (JSONL on stdin).

For "equazioni-secondo-grado" it rebuilds lhs and rhs from params with exact
SymPy Rationals, solves lhs - rhs = 0 over the reals and compares the result
with answer.values. It also checks the problem LaTeX for forbidden patterns,
the per-level constraints of specs/exercises/equazioni-secondo-grado.md (written
again here from the spec, not imported from the generator), the share of each
case per level and the choice variant, if present. Answers may be radicals,
e.g. "(3-sqrt(5))/2"; they are compared with SymPy's roots exactly.

    node node_modules/jiti/lib/jiti-cli.mjs scripts/exercises/sample.mts \
        equazioni-secondo-grado 1000 all | python3 scripts/exercises/verify.py

Exit code 1 if any sample fails.
"""
import json
import re
import sys
from collections import defaultdict

from sympy import FiniteSet, Poly, Rational, S, Symbol, expand, factorint, gcd, radsimp, solveset, sympify

x = Symbol("x", real=True)

FORBIDDEN = [
    ("1x", re.compile(r"(?<!\d)1\s*x")),
    ("0x", re.compile(r"(?<!\d)0\s*x")),
    ("+ -", re.compile(r"\+\s*-")),
    ("- -", re.compile(r"-\s*-")),
    ("+ +", re.compile(r"\+\s*\+")),
    ("^{1}", re.compile(r"\^\{1\}|\^1(?!\d)")),
    ("^{0}", re.compile(r"\^\{0\}|\^0(?!\d)")),
    ("zero term", re.compile(r"[+-]\s*0(?!\d)")),
]

MAX_COEF = 100

# Share of each case per level, from the spec, with slack for rejection sampling.
# Checked only with at least 100 samples of that level.
CASE_RANGES = {
    1: {"pura": (0.25, 0.55), "pura impossibile": (0.05, 0.30), "spuria": (0.30, 0.60)},
    3: {"frazionarie": (0.60, 0.90), "intere": (0.10, 0.40)},
    4: {"pura": (0.10, 0.35), "completa": (0.65, 0.90)},
    6: {"delta=0": (0.35, 0.65), "delta<0": (0.35, 0.65)},
}


LINEAR_CASE_RANGES = {6: {"impossibile": (0.25, 0.55), "indeterminata": (0.25, 0.55), "determinata": (0.10, 0.35)}}
# Level 7 (word problems): each of the nine stories about 1/9 of the samples.
LINEAR_STORIES = ["consecutivi", "eta", "divisione", "rettangolo", "biglietti", "monete", "spesa", "risparmi", "tariffe"]
LINEAR_CASE_RANGES[7] = {s: (0.06, 0.17) for s in LINEAR_STORIES}


def rat(s):
    if not isinstance(s, str) or not re.fullmatch(r"-?\d+(/-?\d+)?", s.strip()):
        raise ValueError(f"not an exact rational string: {s!r}")
    return Rational(s)


def exact(s):
    """A rational "p/q" or a radical such as "(3-sqrt(5))/2", with square-free radicands."""
    if not isinstance(s, str) or not re.fullmatch(r"(?:[0-9+\-*/() ]|sqrt)+", s):
        raise ValueError(f"not an exact value string: {s!r}")
    for n in re.findall(r"sqrt\((\d+)\)", s):
        n = int(n)
        if n < 2 or any(e > 1 for e in factorint(n).values()):
            raise ValueError(f"radicand {n} is not square-free in {s!r}")
    return sympify(s)


def canon(v):
    return expand(radsimp(v))


def same_set(values, truth):
    a = {canon(v) for v in values}
    return len(a) == len(values) and a == {canon(t) for t in truth}


def poly_from(coeffs):
    return sum(rat(c) * x**i for i, c in enumerate(coeffs))


def nice(roots, max_den):
    return all(r.is_rational and r.q <= max_den and abs(r.p) <= 9 for r in roots)


def check_quadratic(sample):
    errs = []
    p = sample["params"]
    lhs_c = [rat(c) for c in p["lhs"]]
    rhs_c = [rat(c) for c in p["rhs"]]
    expr = poly_from(p["lhs"]) - poly_from(p["rhs"])
    P = Poly(expr, x)
    if P.degree() != 2:
        return [f"degree of lhs - rhs is {P.degree()}, expected 2"], None

    sol = solveset(expr, x, S.Reals)
    if not isinstance(sol, FiniteSet) and sol != S.EmptySet:
        return [f"unexpected solution set {sol}"], None
    truth = list(sol) if sol != S.EmptySet else []

    ans = sample["answer"]
    if ans.get("kind") != "set":
        errs.append(f"answer.kind is {ans.get('kind')}, expected set")
    else:
        given = [exact(v) for v in ans["values"]]
        if not same_set(given, truth):
            errs.append(f"answer {ans['values']} != sympy {truth}")
        if [float(g) for g in given] != sorted(float(g) for g in given):
            errs.append(f"answer values not sorted: {ans['values']}")
        if not ans.get("latex"):
            errs.append("answer.latex empty")
    if not same_set([exact(v) for v in p.get("roots", [])], truth):
        errs.append(f"params.roots {p.get('roots')} != sympy {truth}")

    for name, rx in FORBIDDEN:
        if rx.search(sample["problem"]):
            errs.append(f"problem contains forbidden '{name}': {sample['problem']}")
    for c in lhs_c + rhs_c:
        if not c.is_integer:
            errs.append(f"non-integer coefficient {c}")
        elif abs(c) > MAX_COEF:
            errs.append(f"coefficient {c} > {MAX_COEF}")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")

    a, b, c = P.coeff_monomial(x**2), P.coeff_monomial(x), P.coeff_monomial(1)
    delta = b**2 - 4 * a * c
    rhs_zero = all(v == 0 for v in rhs_c)
    complete = b != 0 and c != 0
    roots = sorted(truth, key=float)
    lvl = sample["level"]
    case = p.get("case")
    kind = None
    if lvl == 1:
        # incomplete: pura (b = 0) or spuria (c = 0), rational roots p/q with q <= 3
        if not rhs_zero:
            errs.append("rhs must be 0")
        if a <= 0:
            errs.append(f"a = {a}, expected > 0")
        if (b == 0) == (c == 0):
            errs.append("need exactly one of b = 0, c = 0")
        if not nice(roots, 3):
            errs.append(f"roots {roots}: need rationals p/q with q <= 3, |p| <= 9")
        kind = "spuria" if c == 0 else "pura" if roots else "pura impossibile"
        if b == 0 and roots and len(roots) != 2:
            errs.append(f"pura with roots {roots}")
    elif lvl == 2:
        if not rhs_zero:
            errs.append("rhs must be 0")
        if a != 1:
            errs.append(f"a = {a}, expected 1")
        if not complete:
            errs.append("incomplete equation (b = 0 or c = 0)")
        if len(roots) != 2 or not nice(roots, 1) or 0 in roots:
            errs.append(f"roots {roots}: need two distinct nonzero integers in [-9,9]")
    elif lvl == 3:
        if not rhs_zero:
            errs.append("rhs must be 0")
        if not (a.is_integer and a >= 2):
            errs.append(f"a = {a}, expected >= 2")
        if not complete:
            errs.append("incomplete equation (b = 0 or c = 0)")
        if len(roots) != 2 or not nice(roots, 5) or 0 in roots:
            errs.append(f"roots {roots}: need two distinct nonzero p/q, q <= 5, |p| <= 9")
        integer_roots = all(r.is_integer for r in roots)
        if integer_roots and gcd(gcd(a, b), c) < 2:
            errs.append("integer roots but no common factor to divide")
        kind = "intere" if integer_roots else "frazionarie"
    elif lvl == 4:
        if not rhs_zero:
            errs.append("rhs must be 0")
        if a <= 0:
            errs.append(f"a = {a}, expected > 0")
        if delta <= 0 or len(roots) != 2 or any(r.is_rational for r in roots):
            errs.append(f"roots {roots}: need two irrational roots")
        if b == 0 and c != 0:
            kind = "pura"
        elif complete:
            kind = "completa"
            if a > 3 or abs(b) > 10 or abs(c) > 10:
                errs.append(f"complete level 4 needs a <= 3, |b|, |c| <= 10: {a}, {b}, {c}")
        else:
            errs.append("level 4 must be complete or pura")
    elif lvl == 5:
        if not any(v != 0 for v in rhs_c[1:]):
            errs.append("rhs has no x terms")
        if not any(v != 0 for v in lhs_c[1:]):
            errs.append("lhs has no x terms")
        if not complete:
            errs.append("incomplete equation (b = 0 or c = 0)")
        if len(roots) != 2 or not nice(roots, 5) or 0 in roots:
            errs.append(f"roots {roots}: need two distinct nonzero p/q, q <= 5, |p| <= 9")
    elif lvl == 6:
        if not rhs_zero:
            errs.append("rhs must be 0")
        if not complete:
            errs.append("incomplete equation (b = 0 or c = 0)")
        if delta > 0:
            errs.append(f"delta = {delta} > 0")
        if delta == 0 and (len(roots) != 1 or not nice(roots, 3)):
            errs.append(f"double root {roots} out of spec")
        if delta < 0 and roots:
            errs.append("delta < 0 but roots present")
        kind = "delta<0" if delta < 0 else "delta=0" if delta == 0 else "delta>0"
    else:
        errs.append(f"unknown level {lvl}")
    if case is not None and kind is not None and lvl in (1, 4, 6) and case != kind:
        errs.append(f"params.case {case!r} but the equation is {kind!r}")

    ch = sample.get("choice")
    if ch is not None:
        opts = ch.get("options", [])
        keys = [frozenset(canon(exact(v)) for v in o["values"]) for o in opts]
        truth_key = frozenset(canon(t) for t in truth)
        if len(opts) < 2:
            errs.append("choice has < 2 options")
        if len(set(keys)) != len(keys):
            errs.append(f"choice options not distinct: {[o['values'] for o in opts]}")
        idx = ch.get("correct")
        if not isinstance(idx, int) or not (0 <= idx < len(opts)):
            errs.append(f"choice.correct {idx} out of range")
        elif keys[idx] != truth_key:
            errs.append(f"choice.correct points to {opts[idx]['values']}, truth {roots}")
        matching = [i for i, k in enumerate(keys) if k == truth_key]
        if len(matching) != 1:
            errs.append(f"{len(matching)} choice options equal the truth")
        for o in opts:
            if not o.get("latex"):
                errs.append("choice option without latex")
        # The option text must say the same values. Two values with a radical are too wide for the
        # answer button on a phone: when any option has a radical, every two-value option is
        # "\begin{gathered} x_1 = ... \\ x_2 = ... \end{gathered}", otherwise "x_1 = ...,\ x_2 = ...".
        radical = any(not canon(exact(v)).is_rational for o in opts for v in o["values"])
        for o in opts:
            if o.get("latex"):
                errs += quadratic_option_errors(o["latex"], o["values"], radical)

    return errs, kind


def latex_value(t):
    """A root as the generator writes it: -3, \\frac{7}{2}, -\\frac{\\sqrt{5}}{2}, \\frac{-1 + 2\\sqrt{3}}{4}."""
    s = t.strip()
    s = re.sub(r"(\d)\s*\\sqrt", r"\1*\\sqrt", s)
    s = re.sub(r"\\sqrt\{(\d+)\}", r"sqrt(\1)", s)
    s = re.sub(r"\\frac\{([^{}]*(?:\([^()]*\))?[^{}]*)\}\{(\d+)\}", r"((\1)/(\2))", s)
    if not re.fullmatch(r"[0-9+\-*/() ]*(?:sqrt\(\d+\)[0-9+\-*/() ]*)*", s) or not s.strip():
        raise ValueError(f"unreadable value {t!r}")
    return sympify(s)


def quadratic_option_errors(latex, values, radical):
    errs = []
    if not values:
        return [] if latex == r"\text{Nessuna soluzione reale}" else [f"empty option written {latex!r}"]
    if len(values) == 1:
        m = re.fullmatch(r"x = (.+)", latex)
        parts = [m.group(1)] if m else None
    else:
        g = re.fullmatch(r"\\begin\{gathered\} x_1 = (.+) \\\\ x_2 = (.+) \\end\{gathered\}", latex)
        one = re.fullmatch(r"x_1 = (.+),\\ x_2 = (.+)", latex)
        if radical and not g:
            errs.append(f"option with radicals not on two lines: {latex!r}")
        if not radical and not one:
            errs.append(f"rational option not on one line: {latex!r}")
        m = g or one
        parts = [m.group(1), m.group(2)] if m else None
    if parts is None:
        return errs + [f"option latex not in the expected form: {latex!r}"]
    try:
        shown = [canon(latex_value(t)) for t in parts]
    except Exception as e:  # noqa: BLE001 - any parse failure is an error of the option
        return errs + [f"option latex unreadable: {e}"]
    if shown != [canon(exact(v)) for v in values]:
        errs.append(f"option latex {latex!r} != values {values}")
    return errs


def terms_expr(terms):
    return sum(Rational(int(t["k"])) * (Rational(int(t["a"])) * x + Rational(int(t["b"]))) / Rational(int(t["d"])) for t in terms)


def exact_or_R(v):
    return "R" if v == "R" else canon(exact(v))


def check_linear(sample):
    """equazioni-primo-grado, from specs/exercises/equazioni-primo-grado.md."""
    if sample["level"] == 7:
        # Word problems: the story is checked in its own module, levels 1-6 below are unchanged.
        from checkers.equazioni_primo_grado_problemi import check_problem

        return check_problem(sample)
    errs = []
    p = sample["params"]
    lhs, rhs = p["lhs"], p["rhs"]
    expr = expand(terms_expr(lhs) - terms_expr(rhs))
    P = Poly(expr, x) if expr.has(x) else None
    A = P.coeff_monomial(x) if P else Rational(0)
    if P and P.degree() > 1:
        return [f"degree {P.degree()}"], None
    if A != 0:
        kind, truth = "determinata", [sympy_solve_linear(expr)]
    else:
        kind, truth = ("indeterminata" if expr == 0 else "impossibile"), []
    ans = sample["answer"]
    if ans.get("kind") != "set":
        errs.append("answer.kind must be set")
    elif kind == "indeterminata":
        if not ans.get("universal") or ans["values"]:
            errs.append("indeterminate equation needs universal answer")
    else:
        if ans.get("universal"):
            errs.append("universal answer on a non-indeterminate equation")
        if not same_set([exact(v) for v in ans["values"]], truth):
            errs.append(f"answer {ans['values']} != sympy {truth}")
    if p.get("case") != kind:
        errs.append(f"params.case {p.get('case')} but equation is {kind}")
    for name, rx in FORBIDDEN + [("1(", re.compile(r"(?<![\d.])1\("))]:
        if rx.search(sample["problem"]):
            errs.append(f"problem contains forbidden '{name}': {sample['problem']}")
    allterms = lhs + rhs
    for t in allterms:
        k, a, b, d = (int(t[c]) for c in "kabd")
        if abs(k * a) > 60 or abs(k * b) > 60:
            errs.append("coefficient > 60")
    has_x = lambda side: any(int(t["a"]) != 0 for t in side)
    paren = any(int(t["k"]) != 1 and int(t["d"]) == 1 for t in allterms)
    dens = {int(t["d"]) for t in allterms if int(t["d"]) > 1}
    s = truth[0] if truth else None
    int_ok = s is not None and s.is_integer and abs(s) <= 12
    lvl = sample["level"]
    if lvl <= 5 and kind != "determinata":
        errs.append("levels 1-5 must be determinate")
    if lvl == 1:
        if has_x(rhs) or sum(1 for t in lhs if int(t["a"]) != 0) != 1 or paren or dens or not int_ok:
            errs.append("level 1: ax + b = c with integer solution in [-12, 12]")
    elif lvl == 2:
        if not has_x(lhs) or not has_x(rhs) or paren or dens or not int_ok:
            errs.append("level 2: x on both sides, no parentheses, integer solution")
    elif lvl == 3:
        if not paren or dens or not int_ok:
            errs.append("level 3: parentheses, integer solution")
    elif lvl == 4:
        if dens or s is None or s.is_integer or s.q > 9 or abs(s.p) > 30:
            errs.append("level 4: fractional solution p/q, q <= 9")
    elif lvl == 5:
        if len(dens) < 2 or max(dens, default=0) > 6:
            errs.append("level 5: at least two different denominators up to 6")
    ch = sample.get("choice")
    if ch is not None:
        opts = ch.get("options", [])
        keys = [frozenset(exact_or_R(v) for v in o["values"]) for o in opts]
        tkey = frozenset(["R"]) if kind == "indeterminata" else frozenset(canon(t) for t in truth)
        if len(set(keys)) != len(keys):
            errs.append("choice options not distinct")
        if not isinstance(ch.get("correct"), int) or keys[ch["correct"]] != tkey:
            errs.append("choice.correct is wrong")
        if sum(1 for k in keys if k == tkey) != 1:
            errs.append("not exactly one correct option")
    return errs, (kind if lvl == 6 else None)


def sympy_solve_linear(expr):
    sol = solveset(expr, x, S.Reals)
    return list(sol)[0]


CHECKERS = {"equazioni-secondo-grado": check_quadratic, "equazioni-primo-grado": check_linear}
RANGES = {"equazioni-secondo-grado": CASE_RANGES, "equazioni-primo-grado": LINEAR_CASE_RANGES}


def checker_for(gid):
    """Built-in checkers above, or scripts/exercises/checkers/<id with _>.py, which must define
    check(sample) -> (errors, kind) and may define CASE_RANGES = {level: {kind: (lo, hi)}}.
    Checker modules import the shared helpers with `from verify import ...`."""
    if gid in CHECKERS:
        return CHECKERS[gid]
    if not gid or not re.fullmatch(r"[a-z0-9-]+", gid):
        return None
    import importlib
    try:
        mod = importlib.import_module("checkers." + gid.replace("-", "_"))
    except ModuleNotFoundError:
        return None
    CHECKERS[gid] = mod.check
    RANGES[gid] = getattr(mod, "CASE_RANGES", {})
    return mod.check


def main():
    stats = defaultdict(lambda: {"n": 0, "fail": 0, "seeds": [], "kinds": defaultdict(int)})
    examples = []
    parse_errors = 0
    for lineno, line in enumerate(sys.stdin, 1):
        line = line.strip()
        if not line:
            continue
        try:
            sample = json.loads(line)
        except json.JSONDecodeError as e:
            parse_errors += 1
            print(f"line {lineno}: invalid JSON ({e})", file=sys.stderr)
            continue
        gid = sample.get("generatorId")
        key = (gid, sample.get("level"))
        st = stats[key]
        st["n"] += 1
        checker = checker_for(gid)
        try:
            if "error" in sample:
                errs, kind = [f"generator crashed: {sample['error']}"], None
            else:
                errs, kind = checker(sample) if checker else ([f"no checker for {gid}"], None)
        except Exception as e:  # noqa: BLE001 - any crash is a failure of that sample
            errs, kind = [f"verifier exception: {e!r}"], None
        if kind:
            st["kinds"][kind] += 1
        if errs:
            st["fail"] += 1
            st["seeds"].append(sample.get("seed"))
            if len(examples) < 30:
                examples.append((key, sample.get("seed"), errs))

    failed = parse_errors > 0
    total = 0
    for (gid, lvl), st in sorted(stats.items(), key=lambda kv: (str(kv[0][0]), kv[0][1])):
        total += st["n"]
        line = f"{gid} level {lvl}: {st['n']} samples, {st['n'] - st['fail']} ok, {st['fail']} failed"
        if st["kinds"]:
            line += "  [" + ", ".join(f"{k}: {v}" for k, v in sorted(st["kinds"].items())) + "]"
        ranges = RANGES.get(gid, {}).get(lvl)
        if ranges and st["n"] >= 100:
            off = [k for k, (lo, hi) in ranges.items() if not lo <= st["kinds"].get(k, 0) / st["n"] <= hi]
            if off:
                line += f"  UNBALANCED ({', '.join(off)})"
                failed = True
        print(line)
        if st["fail"]:
            failed = True
            print(f"  failing seeds: {st['seeds'][:50]}{' ...' if len(st['seeds']) > 50 else ''}")
    for (gid, lvl), seed, errs in examples:
        print(f"  - {gid} L{lvl} seed {seed}: {'; '.join(errs)}")
    if parse_errors:
        print(f"{parse_errors} lines were not valid JSON")
    if total == 0:
        print("no samples read")
        failed = True
    print("FAIL" if failed else "PASS")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
