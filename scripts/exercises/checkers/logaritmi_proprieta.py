"""Checker for logaritmi-proprieta, written from specs/exercises/logaritmi-proprieta.md.

For every form it writes the problem again from the data in `params`, computes the answer with SymPy (the
logarithm itself, simplified to a rational, or the expanded and the collected expression, compared with the
problem as functions of x and y), and makes each mistake of the specification again. See _logaritmi.py.
"""
from sympy import E, Integer, Rational, log, nsimplify, simplify

from checkers._logaritmi import R, X, Y, expr, log_head, log_str, log_tex, num_cand, pow_tex, rs, rtex, verify_sample

CASE_RANGES = {
    1: {"ln": (0.08, 0.24), "esponente negativo": (0.25, 0.50), "esponente non negativo": (0.35, 0.62)},
    2: {"base maggiore di 1": (0.40, 0.60), "base minore di 1": (0.40, 0.60)},
    3: {"argomento": (0.40, 0.60), "base": (0.40, 0.60)},
    4: {"somma": (0.30, 0.50), "differenza": (0.25, 0.45), "coefficiente": (0.15, 0.35)},
    5: {"quoziente": (0.50, 0.70), "radice": (0.30, 0.50)},
    6: {"quoziente": (0.50, 0.70), "radice": (0.30, 0.50)},
    7: {"prodotto": (0.25, 0.45), "somma": (0.30, 0.50), "calcolatrice": (0.15, 0.35)},
}

CALC = "Calcola il logaritmo."
NOCALC = "Calcola senza calcolatrice."


def exact_log(arg, base):
    """log_base(arg) as a rational, or an error if it is not one."""
    v = nsimplify(simplify(log(arg) / log(base)))
    if not v.is_Rational or Rational(base) ** v != arg:
        raise ValueError(f"log_{base}({arg}) is not a rational")
    return v


def is_power(a, v):
    v = Rational(v)
    return any(Rational(a) ** n == v for n in range(-12, 13))


def lab(latex, value):
    return (latex, [value])


def lg(arg, base):
    return f"log({arg},{base})"


def level1(p, errs):
    n = p["n"]
    if p["form"] == "ln":
        if n in (0, 1) or not -3 <= n <= 5:
            errs.append("ln: exponent out of range")
        arg = f"e^{n}" if n > 0 else r"\frac{1}{e}" if n == -1 else rf"\frac{{1}}{{e^{-n}}}"
        if simplify(log(E**n)) != n:
            errs.append("ln e^n is not n")
        exp = {"giusta": num_cand(n), "opposto": num_cand(-n), "vicino+": num_cand(n + 1), "vicino-": num_cand(n - 1)}
        if abs(n) > 1:
            exp["reciproco"] = num_cand(Rational(1, n))
        return rf"\ln {arg}", exp, "number", f"{n}", CALC
    b = R(p["base"])
    span = {2: (-5, 8), 3: (-4, 5), 4: (-3, 4), 5: (-3, 4), 10: (-3, 4)}.get(int(b))
    if span is None or not span[0] <= n <= span[1]:
        errs.append("base or exponent out of the specification")
    if (p["form"] == "esponente negativo") != (n < 0):
        errs.append("form against the sign of the exponent")
    arg = b**n
    v = exact_log(arg, b)
    exp = {"giusta": num_cand(v), "base": num_cand(b), "vicino+": num_cand(v + 1), "vicino-": num_cand(v - 1)}
    if v >= 2:
        exp["quoziente"] = num_cand(arg / b)
    if v != 0:
        exp["opposto"] = num_cand(-v)
    if abs(v) > 1:
        exp["reciproco"] = num_cand(1 / v)
    return log_tex(b, rtex(arg)), exp, "number", f"{v}", CALC


BASES2 = {2: ([2, 3, -1, -2], (-5, 6)), 3: ([2, 3, -1, -2], (-4, 5)), 5: ([2, -1], (-3, 3))}


def pair_ok(b, m, n):
    return b in BASES2 and m in BASES2[b][0] and n != 0 and BASES2[b][1][0] <= n <= BASES2[b][1][1]


def level2(p, errs):
    b, m, n = p["b"], p["m"], p["n"]
    if not pair_ok(b, m, n):
        errs.append("base or argument out of the specification")
    base, arg = Rational(b) ** m, Rational(b) ** n
    v = exact_log(arg, base)
    if v.is_integer and (m > 0 or v > 0):
        errs.append("the result is an integer read as in level 1")
    if (p["form"] == "base maggiore di 1") != (base > 1):
        errs.append("form against the base")
    exp = {
        "giusta": num_cand(v),
        "reciproco": num_cand(1 / v),
        "opposto": num_cand(-v),
        "solo argomento": num_cand(n),
        "differenza": num_cand(n - m),
        "vicino+": num_cand(v + 1),
        "vicino-": num_cand(v - 1),
    }
    return log_tex(base, rtex(arg)), exp, "number", rtex(v), CALC


def level3(p, errs):
    prompt = "Trova il valore di x."
    if p["form"] == "argomento":
        base, c = R(p["base"]), p["c"]
        if base not in (2, 3, 4, 5, 10, Rational(1, 2), Rational(1, 3)) or c in (0, 1) or not -3 <= c <= 4:
            errs.append("base or exponent out of the specification")
        xv = base**c
        if max(xv.p, xv.q) > 1000:
            errs.append("argument too large")
        if exact_log(xv, base) != c:
            errs.append("the argument does not give back the logarithm")
        exp = {"giusta": num_cand(xv), "prodotto": num_cand(base * c), "segno": num_cand(base ** (-c)), "vicino+": num_cand(xv + 1), "vicino-": num_cand(xv - 1)}
        if base.q == 1 and c > 0 and c**base <= 1000:
            exp["scambiati"] = num_cand(Integer(c) ** base)
        return f"{log_tex(base, 'x')} = {c}", exp, "number", f"x = {rtex(xv)}", prompt
    b, c = p["b"], p["c"]
    if not 2 <= b <= 9 or c not in (2, 3, -1, -2, -3):
        errs.append("base or exponent out of the specification")
    B = Rational(b) ** c
    if max(B.p, B.q) > 729:
        errs.append("argument too large")
    if exact_log(B, b) != c:
        errs.append("the base does not give back the logarithm")
    exp = {"giusta": num_cand(b), "reciproco": num_cand(Rational(1, b)), "negativa": num_cand(-b), "divisione": num_cand(B / c), "prodotto": num_cand(B * c), "vicino+": num_cand(b + 1)}
    return rf"\log_x {rtex(B)} = {c}", exp, "number", f"x = {b}", prompt


def level4(p, errs):
    a, pp, qq, k = p["a"], p["p"], p["q"], p["k"]
    L = lambda v: log_tex(a, f"{v}")  # noqa: E731
    if is_power(a, pp) or (p["form"] != "coefficiente" and is_power(a, qq)):
        errs.append("a single logarithm is already an integer")
    if p["form"] == "somma":
        if a not in (6, 10, 12, 15) or pp < 2 or qq < 2 or pp == qq or pp * qq > 1000:
            errs.append("out of the specification")
        v = exact_log(pp * qq, a)
        exp = {"senza logaritmo": num_cand(pp * qq), "argomenti sommati": lab(L(pp + qq), lg(pp + qq, a)), "prodotto dei logaritmi": lab(rf"{L(pp)} \cdot {L(qq)}", f"{lg(pp, a)}*{lg(qq, a)}")}
        problem = f"{L(pp)} + {L(qq)}"
    elif p["form"] == "differenza":
        if a not in (2, 3, 5) or pp > 500 or qq not in (3, 5, 6, 7, 11):
            errs.append("out of the specification")
        v = exact_log(Rational(pp, qq), a)
        exp = {"senza logaritmo": num_cand(Rational(pp, qq)), "argomenti sottratti": lab(L(pp - qq), lg(pp - qq, a)), "quoziente dei logaritmi": lab(rf"\frac{{{L(pp)}}}{{{L(qq)}}}", f"{lg(pp, a)}/{lg(qq, a)}")}
        problem = f"{L(pp)} - {L(qq)}"
    else:
        m = p["m"]
        if a not in (6, 10, 12) or m not in (2, 3) or qq not in (2, 3, 5) or pp < 2:
            errs.append("out of the specification")
        v = exact_log(pp * qq**m, a)
        exp = {"senza logaritmo": num_cand(pp * qq**m), "esponente dimenticato": lab(L(pp * qq), lg(pp * qq, a)), "argomenti sommati": lab(L(pp + qq**m), lg(pp + qq**m, a))}
        problem = f"{L(pp)} + {m}{L(qq)}"
    if v != k or not (v.is_integer and 1 <= v <= 5):
        errs.append(f"the result {v} is not the positive integer {k} of params")
    exp["giusta"] = num_cand(v)
    exp["vicino+"] = num_cand(v + 1)
    return problem, exp, "number", f"{v}", NOCALC


def term(c, base, v):
    c = Rational(c)
    return f"{'' if c == 1 else rtex(c)}{log_tex(base, v)}"


def y_power(e):
    e = Rational(e)
    if e.q == 1:
        return "y" if e == 1 else f"y^{e.p}"
    return r"\sqrt{y}" if e.q == 2 else rf"\sqrt[{e.q}]{{y}}"


def y_exp(e):
    e = Rational(e)
    return f"y**{e.p}" if e.q == 1 else f"y**({rs(e)})"


def same_function(u, v):
    """Two expressions in x and y equal at three points with x, y > 0."""
    for xv, yv in ((Rational(23, 10), Rational(37, 10)), (Rational(1, 3), 5), (7, Rational(2, 7))):
        if abs(complex((u - v).subs({X: xv, Y: yv}))) > 1e-9:
            return False
    return True


def level5(p, errs):
    a, k, m, e = p["a"], p["k"], p["m"], R(p["e"])
    root = p["form"] == "radice"
    if a not in (2, 3, 5, 10) or not 1 <= k <= 3 or not 2 <= m <= 5 or (root and e not in (Rational(1, 2), Rational(1, 3))) or (not root and (e.q != 1 or not 2 <= e <= 5 or e == m)):
        errs.append("out of the specification")
    c = a**k
    lx, ly = lg("x", a), lg("y", a)

    def cand(first, mx, sign, ny):
        return (f"{first} + {term(mx, a, 'x')} {sign} {term(ny, a, 'y')}", [f"{first}+{rs(mx)}*{lx}{sign}({rs(ny)})*{ly}"])

    right = cand(k, m, "-", e)
    given = log(c * X**m / Y**e) / log(a)
    if not same_function(expr(right[1][0]), given):
        errs.append("the expansion is not equal to the logarithm")
    exp = {"giusta": right, "numero senza logaritmo": cand(c, m, "-", e), "segno": cand(k, m, "+", e), "esponenti dimenticati": cand(k, 1, "-", 1)}
    for tag in ("numero senza logaritmo", "segno", "esponenti dimenticati"):
        if same_function(expr(exp[tag][1][0]), given):
            errs.append(f"the mistake {tag} is right")
    problem = log_tex(a, rf"\frac{{{c}x^{m}}}{{{y_power(e)}}}")
    return problem, exp, "choice", right[0], "Sviluppa il logaritmo con le proprietà, con x > 0 e y > 0."


def level6(p, errs):
    a, c, m, e = p["a"], p["c"], p["m"], R(p["e"])
    root = p["form"] == "radice"
    if a not in (2, 3, 5, 10) or c not in (2, 3, 5, 6, 7) or c == a or not 2 <= m <= 4 or (root and e != Rational(1, 2)) or (not root and (e.q != 1 or not 2 <= e <= 4 or e == m)):
        errs.append("out of the specification")
    head = log_head(a)
    problem = f"{term(m, a, 'x')} + {log_tex(a, f'{c}')} - {term(e, a, 'y')}"
    given = (m * log(X) + log(c) - e * log(Y)) / log(a)
    right = (rf"{head} \frac{{{c}x^{m}}}{{{y_power(e)}}}", [f"log({c}*x**{m}/{y_exp(e)},{a})"])
    if not same_function(expr(right[1][0]), given):
        errs.append("the single logarithm is not equal to the sum")
    up = 2 * m * c if root else m * c
    exp = {
        "giusta": right,
        "coefficienti come fattori": (rf"{head} \frac{{{up}x}}{{{'y' if root else f'{e.p}y'}}}", [f"log({up}*x/({'y' if root else f'{e.p}*y'}),{a})"]),
        "segno": (f"{head} ({c}x^{m}{y_power(e)})", [f"log({c}*x**{m}*{y_exp(e)},{a})"]),
        "somma": (f"{head} (x^{m} + {c} - {y_power(e)})", [f"log(x**{m}+{c}-{y_exp(e)},{a})"]),
    }
    for tag in ("coefficienti come fattori", "segno", "somma"):
        if same_function(expr(exp[tag][1][0]), given):
            errs.append(f"the mistake {tag} is right")
    return problem, exp, "choice", right[0], "Scrivi come un solo logaritmo, con x > 0 e y > 0."


def level7(p, errs):
    if p["form"] == "prodotto":
        a, b, k = p["a"], p["b"], p["k"]
        A = a**k
        if a not in (2, 3, 5) or b not in (3, 5, 6, 7) or a == b or not 2 <= k <= 4 or A > 125:
            errs.append("out of the specification")
        v = nsimplify(simplify(log(b) / log(a) * log(A) / log(b)))
        if v != k:
            errs.append("the product is not k")
        exp = {"giusta": num_cand(v), "uno": num_cand(1), "argomento": num_cand(A), "argomenti moltiplicati": lab(log_tex(a, f"{b * A}"), lg(b * A, a)), "vicino+": num_cand(v + 1)}
        return rf"{log_tex(a, f'{b}')} \cdot {log_tex(b, f'{A}')}", exp, "number", f"{v}", NOCALC
    if p["form"] == "somma":
        b, m1, n1, m2, n2 = p["b"], p["m1"], p["n1"], p["m2"], p["n2"]
        if b not in (2, 3) or not pair_ok(b, m1, n1) or not pair_ok(b, m2, n2) or m1 == m2 or m1 < 0:
            errs.append("out of the specification")
        tex = lambda m, n: log_tex(Rational(b) ** m, rtex(Rational(b) ** n))  # noqa: E731
        r1 = exact_log(Rational(b) ** n1, Rational(b) ** m1)
        r2 = exact_log(Rational(b) ** n2, Rational(b) ** m2)
        v = r1 + r2
        exp = {"giusta": num_cand(v), "differenza": num_cand(r1 - r2), "reciproci": num_cand(1 / r1 + 1 / r2), "senza basi": num_cand(n1 + n2), "vicino+": num_cand(v + 1)}
        if m1 + m2 != 0:
            exp["esponenti sommati"] = num_cand(Rational(n1 + n2, m1 + m2))
        return f"{tex(m1, n1)} + {tex(m2, n2)}", exp, "number", rtex(v), NOCALC
    a, b = p["a"], p["b"]
    if a not in (2, 3, 5, 7) or not 2 <= b <= 30 or b == a or b % 10 == 0 or is_power(a, b):
        errs.append("out of the specification")
    lb, la = log_tex(10, f"{b}"), log_tex(10, f"{a}")
    right = lab(rf"\frac{{{lb}}}{{{la}}}", f"{lg(b, 10)}/{lg(a, 10)}")
    if abs(float(expr(right[1][0]) - log(b) / log(a))) > 1e-12:
        errs.append("the expression is not the logarithm")
    exp = {
        "giusta": right,
        "rovesciata": lab(rf"\frac{{{la}}}{{{lb}}}", f"{lg(a, 10)}/{lg(b, 10)}"),
        "logaritmo del quoziente": lab(log_tex(10, rf"\frac{{{b}}}{{{a}}}"), lg(f"{b}/{a}", 10)),
        "prodotto": lab(rf"{lb} \cdot {la}", f"{lg(b, 10)}*{lg(a, 10)}"),
    }
    return log_tex(a, f"{b}"), exp, "choice", right[0], "La calcolatrice ha solo il tasto log, in base 10. Quale espressione è uguale al logaritmo?"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}


def check(sample):
    p = sample["params"]
    f = LEVELS.get(sample["level"])
    if f is None:
        return [f"unknown level {sample['level']}"], None
    errs = []
    problem, exp, kind, solution, prompt = f(p, errs)
    errs += verify_sample(sample, problem, exp, kind, solution, prompt)
    return errs, p.get("form")
