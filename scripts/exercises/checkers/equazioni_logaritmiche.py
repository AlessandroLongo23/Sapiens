"""Checker for equazioni-logaritmiche, written from specs/exercises/equazioni-logaritmiche.md.

Each equation is solved forwards: the logarithms are removed with the definition or the properties, the equation
without logarithms is solved with SymPy, and each of its roots is kept only if every argument of the equation of
the problem is positive there. Then every kept root is put back in the equation of the problem, with the
logarithms, and must make it true. Levels 6 and 7, whose solutions are logarithms, are a multiple choice from the
start (answer.kind is "choice"), because an open answer with a logarithm cannot be graded; levels 1 to 5 have a set
as their answer. See _logaritmi.py.
"""
from sympy import Rational, S, Symbol, log, solveset

from checkers._logaritmi import R, lin, log_head, log_str, log_tex, poly_tex, rs, set_cand, val, verify_sample

CASE_RANGES = {
    2: {"segni opposti": (0.60, 0.80), "stesso segno": (0.20, 0.40)},
    3: {"una scartata": (0.50, 0.70), "due accettabili": (0.15, 0.35), "nessuna accettabile": (0.08, 0.22)},
    4: {"somma": (0.30, 0.50), "differenza": (0.25, 0.45), "numero": (0.15, 0.35)},
    6: {"esponente x": (0.20, 0.40), "esponente x + k": (0.45, 0.65), "impossibile": (0.08, 0.22)},
    7: {"un logaritmo": (0.55, 0.75), "un valore scartato": (0.25, 0.45)},
}

x = Symbol("x", real=True)
PROMPT = "Risolvi l'equazione."
FREE = (2, 3, 5, 6, 7)


def lg(arg, base):
    return log(arg) / log(base)


def roots(poly):
    sol = solveset(poly, x, S.Reals)
    out = sorted(sol, key=float)
    if not all(r.is_rational for r in out):
        raise ValueError(f"irrational roots {out}")
    return [Rational(r) for r in out]


def kept(cands, args):
    """The roots where every argument is positive."""
    return [r for r in cands if all(a.subs(x, r) > 0 for a in args)]


def satisfied(equation, sols):
    """Errors if a solution does not make the equation (an expression that must vanish) true."""
    return [f"x = {r} does not satisfy the equation" for r in sols if abs(float(equation.subs(x, r))) > 1e-9]


def sets(*vals):
    return set_cand([rs(v) for v in vals])


def is_power(a, v):
    return any(Rational(a) ** n == v for n in range(-12, 13))


def arg_log(base, m, n):
    return log_tex(base, "x") if (m, n) == (1, 0) else log_tex(base, lin(m, n), True)


def small(r, mx=200):
    return abs(r.p) <= mx and r.q <= 12


def level1(p, errs):
    base, c, m, n = R(p["base"]), p["c"], p["m"], p["n"]
    K = base**c
    if base not in (2, 3, 5, 10, Rational(1, 2), Rational(1, 3)) or not -2 <= c <= 3 or m not in (1, 2, 3, -1, -2) or n == 0 or abs(n) > 9 or max(K.p, K.q) > 125:
        errs.append("out of the specification")
    arg = m * x + n
    sols = kept(roots(arg - K), [arg])
    errs += satisfied(lg(arg, base) - c, sols)
    if len(sols) != 1 or sols[0] == 0 or abs(sols[0].p) > 60 or sols[0].q > 12:
        errs.append(f"solutions {sols} out of the specification")
        return "", {}, "set", None, PROMPT
    x0 = sols[0]
    if (p["form"] == "soluzione positiva") != (x0 > 0):
        errs.append("form against the sign of the solution")
    other = lambda v: (Rational(v) - n) / m  # noqa: E731
    exp = {"giusta": sets(x0), "senza potenza": sets(other(c)), "prodotto": sets(other(base * c)), "esponente opposto": sets(other(base ** (-c))), "opposto": sets(-x0)}
    if x0 < 0:
        exp["scartata perché negativa"] = sets()
    return f"{log_tex(base, lin(m, n), True)} = {c}", exp, "set", exp["giusta"][0], PROMPT


def level2(p, errs):
    a, k, r1, r2 = p["a"], p["k"], p["r1"], p["r2"]
    K = a**k
    if a not in (2, 3, 5, 10) or not 0 <= k <= 3 or K > 125 or not -9 <= r1 < r2 <= 9 or r1 == 0 or r2 == 0 or r1 == -r2:
        errs.append("out of the specification")
    b, c = -(r1 + r2), r1 * r2 + K
    if abs(c) > 150:
        errs.append("constant term too large")
    arg = x**2 + b * x + c
    sols = kept(roots(arg - K), [arg])
    errs += satisfied(lg(arg, a) - k, sols)
    if sols != [r1, r2]:
        errs.append(f"solutions {sols}, params say {[r1, r2]}")
    if (p["form"] == "segni opposti") != (r1 < 0 < r2):
        errs.append("form against the signs of the solutions")
    exp = {"giusta": sets(*sols), "solo la maggiore": sets(r2), "segni cambiati": sets(-r1, -r2), "vuoto": sets(), "solo la minore": sets(r1)}
    return f"{log_tex(a, poly_tex([c, b, 1]), True)} = {k}", exp, "set", exp["giusta"][0], PROMPT


def level3(p, errs):
    base, r1, r2, m, n = R(p["base"]), p["r1"], p["r2"], p["m"], p["n"]
    if base not in (2, 3, 5, 10) or not -8 <= r1 < r2 <= 8 or m not in (1, 2, 3, 4, -1, -2, -3) or abs(n) > 9:
        errs.append("out of the specification")
    b, c = m - (r1 + r2), n + r1 * r2
    if abs(b) > 20 or abs(c) > 60 or (b == 0 and c == 0):
        errs.append("coefficients out of the specification")
    f, g = x**2 + b * x + c, m * x + n
    all_roots = roots(f - g)
    if all_roots != [r1, r2]:
        errs.append(f"roots {all_roots}, params say {[r1, r2]}")
    if any(g.subs(x, r) == 0 for r in all_roots):
        errs.append("an argument vanishes at a root")
    sols = kept(all_roots, [f, g])
    errs += satisfied(lg(f, base) - lg(g, base), sols)
    form = {1: "una scartata", 2: "due accettabili", 0: "nessuna accettabile"}[len(sols)]
    if p["form"] != form:
        errs.append(f"form {p['form']!r}, the equation is {form!r}")
    exp = {"giusta": sets(*sols), "senza condizioni": sets(r1, r2), "solo la minore": sets(r1), "solo la maggiore": sets(r2), "vuoto": sets()}
    return f"{log_tex(base, poly_tex([c, b, 1]), True)} = {log_tex(base, lin(m, n), True)}", exp, "set", exp["giusta"][0], PROMPT


def level4(p, errs):
    a, c = p["a"], p["c"]
    K = a**c
    if p["form"] == "somma":
        pp, qq = p["p"], p["q"]
        if a not in (2, 3, 6, 10, 12) or not 1 <= c <= 3 or K > 150 or abs(pp) > 15 or abs(qq) > 15 or pp == qq:
            errs.append("out of the specification")
        f, g = x + pp, x + qq
        all_roots = roots(f * g - K)
        sols = kept(all_roots, [f, g])
        errs += satisfied(lg(f, a) + lg(g, a) - c, sols)
        if len(all_roots) != 2 or len(sols) != 1:
            errs.append(f"roots {all_roots}, accepted {sols}: need two roots and one accepted")
            return "", {}, "set", None, PROMPT
        v = sols[0]
        other = [r for r in all_roots if r != v][0]
        exp = {"giusta": sets(v), "senza condizioni": sets(v, other), "scartata la buona": sets(other), "argomenti sommati": sets(Rational(K - pp - qq, 2)), "vuoto": sets()}
        return f"{arg_log(a, 1, pp)} + {arg_log(a, 1, qq)} = {c}", exp, "set", exp["giusta"][0], PROMPT
    if a not in (2, 3, 5) or not 1 <= c <= (3 if a == 2 else 2):
        errs.append("out of the specification")
    if p["form"] == "differenza":
        pp, qq = p["p"], p["q"]
        if qq == 0 or pp == 0 or abs(qq) > 8 or abs(pp) > 30:
            errs.append("out of the specification")
        f, g = x + pp, x + qq
        sols = kept(roots(f - K * g), [f, g])
        errs += satisfied(lg(f, a) - lg(g, a) - c, sols)
        if len(sols) != 1 or sols[0].q != 1:
            errs.append(f"solutions {sols}: need one integer solution")
            return "", {}, "set", None, PROMPT
        x0 = sols[0]
        exp = {"giusta": sets(x0), "vuoto": sets(), "vicino": sets(x0 + 1)}
        wrong = Rational(qq - K * pp, K - 1)
        if small(wrong):
            exp["potenza dalla parte sbagliata"] = sets(wrong)
        if c != 1 and small(Rational(pp - c * qq, c - 1)):
            exp["senza potenza"] = sets(Rational(pp - c * qq, c - 1))
        if x0 != 0:
            exp["opposto"] = sets(-x0)
        return f"{arg_log(a, 1, pp)} - {arg_log(a, 1, qq)} = {c}", exp, "set", exp["giusta"][0], PROMPT
    m, n, qq = p["m"], p["n"], p["q"]
    if not 1 <= m <= 5 or m == K or n == 0 or qq == 0 or abs(n) > 30:
        errs.append("out of the specification")
    f, g = m * x + n, x + qq
    sols = kept(roots(f - K * g), [f, g])
    errs += satisfied(lg(f, a) - c - lg(g, a), sols)
    if len(sols) != 1 or sols[0].q != 1 or sols[0] == 0:
        errs.append(f"solutions {sols}: need one integer solution, not zero")
        return "", {}, "set", None, PROMPT
    x0 = sols[0]
    exp = {"giusta": sets(x0), "vuoto": sets(), "opposto": sets(-x0), "vicino": sets(x0 + 1)}
    if m != 1 and small(Rational(c + qq - n, m - 1)):
        exp["numero sommato"] = sets(Rational(c + qq - n, m - 1))
    if m != c and small(Rational(c * qq - n, m - c)):
        exp["senza potenza"] = sets(Rational(c * qq - n, m - c))
    return f"{arg_log(a, m, n)} = {c} + {arg_log(a, 1, qq)}", exp, "set", exp["giusta"][0], PROMPT


def log_trinomial(base, B, C):
    head = log_head(base)
    out = r"\log^2 x" if head == r"\log" else f"{head}^2 x"
    if B != 0:
        out += f" {'-' if B < 0 else '+'} {'' if abs(B) == 1 else abs(B)}{head} x"
    if C != 0:
        out += f" {'-' if C < 0 else '+'} {abs(C)}"
    return out


def level5(p, errs):
    a, t1, t2 = p["a"], p["t1"], p["t2"]
    if a not in (2, 3, 10) or not -3 <= t1 < t2 <= 3 or t1 == -t2:
        errs.append("out of the specification")
    B, C = -(t1 + t2), t1 * t2
    ts = roots(x**2 + B * x + C)
    sols = sorted(Rational(a) ** t for t in ts)
    xp = Symbol("xp", positive=True)
    for r in sols:
        if abs(float((lg(xp, a) ** 2 + B * lg(xp, a) + C).subs(xp, r))) > 1e-9:
            errs.append(f"x = {r} does not satisfy the equation")
    if len(sols) != 2 or max(sols[1].p, sols[0].q) > 1000:
        errs.append("solutions out of the specification")
    if (p["form"] == "un valore negativo") != (t1 < 0):
        errs.append("form against the values of t")
    A = Rational(a)
    exp = {"giusta": sets(*sols), "non torna alla x": sets(t1, t2), "prodotto": sets(a * t1, a * t2), "esponenti opposti": sets(A ** (-t1), A ** (-t2)), "solo il maggiore": sets(A**t2)}
    if t1 < 0:
        exp["valore negativo scartato"] = sets(A**t2)
    return f"{log_trinomial(a, B, C)} = 0", exp, "set", exp["giusta"][0], PROMPT


def exp_tex(a, k):
    return f"{a}^x" if k == 0 else f"{a}^{{{lin(1, k)}}}"


def level6(p, errs):
    a, k, b = p["a"], p["k"], p["b"]
    if a not in (2, 3, 5, 7, 10) or abs(k) > 4:
        errs.append("out of the specification")
    problem = f"{exp_tex(a, k)} = {b}"
    if b <= 0:
        if p["form"] != "impossibile" or -b not in FREE or is_power(a, -b):
            errs.append("impossible form out of the specification")
        exp = {"giusta": set_cand([]), "segno ignorato": set_cand([log_str(a, -b, -k)]), "logaritmo del reciproco": set_cand([log_str(a, Rational(1, -b), -k)]), "quoziente": sets(Rational(b, a) - k)}
        return problem, exp, "choice", exp["giusta"][0], PROMPT
    if not 2 <= b <= 40 or b == a or is_power(a, b):
        errs.append("b out of the specification")
    if p["form"] != ("esponente x" if k == 0 else "esponente x + k"):
        errs.append("form against k")
    right = log_str(a, b, -k)
    if abs(float(Rational(a) ** (val(right) + k) - b)) > 1e-9:
        errs.append("the solution does not satisfy the equation")
    exp = {"giusta": set_cand([right]), "base e argomento scambiati": set_cand([log_str(b, a, -k)]), "quoziente": sets(Rational(b, a) - k), "vuoto": sets()}
    if k != 0:
        exp["segno di k"] = set_cand([log_str(a, b, k)])
    return problem, exp, "choice", exp["giusta"][0], PROMPT


def level7(p, errs):
    a, j, v = p["a"], p["j"], p["v"]
    u = a**j
    if a not in (2, 3) or not 0 <= j <= 3 or abs(v) not in FREE or is_power(a, abs(v)) or u + v == 0 or abs(u * v) > 200:
        errs.append("out of the specification")
    s, pr = u + v, u * v
    ts = roots(x**2 - s * x + pr)
    if sorted(ts) != sorted([Rational(u), Rational(v)]):
        errs.append("the values of t are not those of params")
    sols = [rs(Rational(j))] + ([log_str(a, v)] if v > 0 else [])
    for sv in sols:
        e = val(sv)
        if abs(float(Rational(a * a) ** e - s * Rational(a) ** e + pr)) > 1e-9:
            errs.append(f"{sv} does not satisfy the equation")
    if (p["form"] == "un valore scartato") != (v < 0):
        errs.append("form against the sign of v")
    mid = f"{'-' if s > 0 else '+'} {'' if abs(s) == 1 else str(abs(s)) + ' ' + chr(92) + 'cdot '}{a}^x"
    problem = f"{a * a}^x {mid} {'+' if pr > 0 else '-'} {abs(pr)} = 0"
    exp = {"giusta": set_cand(sols), "non torna alla x": sets(u, v), "quoziente": sets(j, Rational(v, a))}
    if v < 0:
        exp["valore negativo non scartato"] = set_cand([rs(Rational(j)), log_str(a, -v)])
        exp["vuoto"] = sets()
    else:
        exp["solo la soluzione intera"] = sets(j)
        exp["base e argomento scambiati"] = set_cand([rs(Rational(j)), log_str(v, a)])
    return problem, exp, "choice", exp["giusta"][0], PROMPT


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}


def check(sample):
    p = sample["params"]
    f = LEVELS.get(sample["level"])
    if f is None:
        return [f"unknown level {sample['level']}"], None
    errs = []
    problem, exp, kind, solution, prompt = f(p, errs)
    if not exp:
        return errs, p.get("form")
    errs += verify_sample(sample, problem, exp, kind, solution, prompt)
    return errs, p.get("form")
