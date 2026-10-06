"""Checker for funzioni-logaritmiche, written from specs/exercises/funzioni-logaritmiche.md.

Points of the graph and integer parts come from SymPy's logarithm; the sign and the order of logarithms from their
numeric value; a domain from SymPy's solution of "argument > 0", tried again on numbers beside every end; the
asymptote and the zero of a moved graph from the equation solved with SymPy. See _logaritmi.py.
"""
from sympy import Integer, Rational, S, Symbol, floor, log, solve_univariate_inequality, solveset
from sympy import Interval, Union, oo

from checkers._logaritmi import (
    R,
    above,
    below,
    between,
    iv_cand,
    lin,
    log_head,
    log_str,
    log_tex,
    num_cand,
    outside,
    poly_tex,
    pow_tex,
    probe,
    rs,
    rtex,
    text,
    val,
    val_tex,
    verify_sample,
)

CASE_RANGES = {
    1: {"ordinata": (0.40, 0.60), "ascissa": (0.40, 0.60)},
    2: {"argomento 1": (0.05, 0.16), "argomento non positivo": (0.05, 0.16), "base maggiore di 1": (0.30, 0.56), "base minore di 1": (0.26, 0.50)},
    3: {"base maggiore di 1": (0.40, 0.60), "base minore di 1": (0.40, 0.60)},
    4: {"argomento maggiore di 1": (0.55, 0.75), "argomento minore di 1": (0.25, 0.45)},
    5: {"coefficiente positivo": (0.40, 0.60), "coefficiente negativo": (0.40, 0.60)},
    6: {"secondo grado": (0.40, 0.60), "fratto": (0.40, 0.60)},
    7: {"verso destra": (0.40, 0.60), "verso sinistra": (0.40, 0.60)},
}

t = Symbol("t", real=True)
BASES1 = (2, 3, 4, 5, 10, Rational(1, 2), Rational(1, 3))


def head(base):
    return r"\ln" if base == "e" else log_head(R(base))


def fn(base, arg, paren=True):
    return f"{head(base)} {'(' + arg + ')' if paren else arg}"


def exact_int_log(arg, base):
    for n in range(-12, 13):
        if Rational(base) ** n == arg:
            return n
    raise ValueError("not an integer power")


def level1(p, errs):
    base, n = R(p["base"]), p["n"]
    X = base**n
    if base not in BASES1 or not -3 <= n <= 4 or n == 0 or max(X.p, X.q) > (1000 if base == 10 else 130):
        errs.append("out of the specification")
    curve = f"y = {log_tex(base, 'x')}"
    if p["form"] == "ordinata":
        v = exact_int_log(X, base)
        if v != n:
            errs.append("the ordinate is not the logarithm of the abscissa")
        pt = f"P({rtex(X)}, k)" if X.q == 1 else rf"P\left({rtex(X)}, k\right)"
        exp = {"giusta": num_cand(v), "opposto": num_cand(-v), "ascissa": num_cand(X), "vicino+": num_cand(v + 1), "vicino-": num_cand(v - 1)}
        if v >= 2 and base.q == 1:
            exp["quoziente"] = num_cand(X / base)
        if abs(v) > 1:
            exp["reciproco"] = num_cand(Rational(1, v))
        return rf"{curve} \qquad {pt}", exp, "number", f"k = {v}", "Il punto P appartiene al grafico della funzione. Trova k."
    if n == 1:
        errs.append("abscissa equal to the base")
    if log(X) / log(base) != n and exact_int_log(X, base) != n:
        errs.append("the abscissa does not give the ordinate")
    exp = {"giusta": num_cand(X), "prodotto": num_cand(base * n), "segno": num_cand(base ** (-n)), "ordinata": num_cand(n), "vicino+": num_cand(X + 1)}
    if base.q == 1 and n > 0 and n**base <= 1000:
        exp["scambiati"] = num_cand(Integer(n) ** base)
    return rf"{curve} \qquad P(h, {n})", exp, "number", f"h = {rtex(X)}", "Il punto P appartiene al grafico della funzione. Trova h."


SIGNS = ("positivo", "negativo", "nullo", "non esiste")


def level2(p, errs):
    base, arg = R(p["base"]), R(p["arg"])
    if base not in (2, 3, 5, 10, Rational(1, 2), Rational(1, 3), Rational(1, 5)):
        errs.append("base out of the specification")
    if arg <= 0:
        sign, form = "non esiste", "argomento non positivo"
    else:
        v = float(log(arg) / log(base))
        sign = "nullo" if arg == 1 else "positivo" if v > 0 else "negativo"
        form = "argomento 1" if arg == 1 else "base maggiore di 1" if base > 1 else "base minore di 1"
        if arg != 1 and (arg == base or arg * base == 1):
            errs.append("the logarithm is 1 or -1 at sight")
    if p["form"] != form:
        errs.append(f"form {p['form']!r}, the data say {form!r}")
    exp = {s: (text(s), [s]) for s in SIGNS if s != sign}
    exp["giusta"] = (text(sign), [sign])
    return log_tex(base, rtex(arg), arg < 0), exp, "choice", text(sign), "Senza calcolarlo, stabilisci il segno del logaritmo."


def level3(p, errs):
    base, args = R(p["base"]), p["args"]
    if base not in (2, 3, 5, Rational(1, 2), Rational(1, 3)) or len(set(args)) != 3 or not all(isinstance(a, int) and 2 <= a <= 40 for a in args):
        errs.append("out of the specification")
    if (p["form"] == "base maggiore di 1") != (base > 1):
        errs.append("form against the base")
    strs = [log_str(base, a) for a in args]
    order = sorted(strs, key=lambda s: float(val(s)))

    def chain(idx):
        return (" < ".join(val_tex(order[i]) for i in idx), [order[i] for i in idx])

    exp = {"giusta": chain([0, 1, 2]), "verso": chain([2, 1, 0]), "primi scambiati": chain([1, 0, 2]), "ultimi scambiati": chain([0, 2, 1])}
    return r" \qquad ".join(val_tex(s) for s in strs), exp, "choice", exp["giusta"][0], "Ordina i tre logaritmi dal minore al maggiore."


def level4(p, errs):
    a, arg = p["a"], R(p["arg"])
    big = arg > 1
    d = arg.p if big else arg.q
    if a not in (2, 3, 5, 10) or (big and arg.q != 1) or (not big and arg.p != 1) or not a < d <= (2000 if a == 10 else 200 if a == 2 else 500):
        errs.append("out of the specification")
    if (p["form"] == "argomento maggiore di 1") != big:
        errs.append("form against the argument")
    n = int(floor(log(arg) / log(a)))
    if not (Rational(a) ** n < arg < Rational(a) ** (n + 1)):
        errs.append("the argument is a power of the base, or the integer part is wrong")
    exp = {"giusta": num_cand(n), "superiore": num_cand(n + 1), "inferiore": num_cand(n - 1)}
    if n != 0:
        exp["opposto"] = num_cand(-n)
    if big and d // a != n:
        exp["quoziente"] = num_cand(d // a)
    return f"n < {log_tex(a, rtex(arg))} < n + 1", exp, "number", f"n = {n}", "Il logaritmo sta tra due interi consecutivi. Trova n."


def to_ivs(sset):
    """A SymPy set of reals as intervals with string ends (rational ends only)."""
    if sset == S.EmptySet:
        return []
    parts = sset.args if isinstance(sset, Union) else [sset]
    out = []
    for iv in parts:
        if not isinstance(iv, Interval):
            raise ValueError(f"not an interval: {iv}")
        lo = None if iv.start == -oo else rs(iv.start)
        hi = None if iv.end == oo else rs(iv.end)
        out.append((lo, hi, not iv.left_open and lo is not None, not iv.right_open and hi is not None))
    return out


def domain(arg):
    return to_ivs(solve_univariate_inequality(arg > 0, t, relational=False))


def dom(ivs):
    return iv_cand(ivs, "D")


def positive(arg):
    def holds(v):
        try:
            return float(arg.subs(t, Rational(str(v)))) > 0
        except (TypeError, ZeroDivisionError):
            return False
    return holds


DOM = "Trova il dominio della funzione."


def level5(p, errs):
    base, m, n = p["base"], p["m"], p["n"]
    if base not in ("2", "3", "10", "e", "1/2") or m == 0 or n == 0 or abs(m) > 4 or abs(n) > 9 or Rational(-n, m).q > 4:
        errs.append("out of the specification")
    if (p["form"] == "coefficiente positivo") != (m > 0):
        errs.append("form against the coefficient")
    truth = domain(m * t + n)
    errs += probe(truth, positive(m * t + n))
    b = rs(Rational(-n, m))
    up = m > 0
    side = lambda v, closed, u: above(v, closed) if u else below(v, closed)  # noqa: E731
    exp = {
        "giusta": dom(truth),
        "chiuso": dom(side(b, True, up)),
        "verso": dom(side(b, False, not up)),
        "segno": dom(side(rs(Rational(n, m)), False, up)),
        "verso chiuso": dom(side(b, True, not up)),
    }
    return f"f(x) = {fn(base, lin(m, n))}", exp, "choice", exp["giusta"][0], DOM


def level6(p, errs):
    base, s, r1, r2 = p["base"], p["s"], p["r1"], p["r2"]
    if base not in ("2", "3", "10", "e", "1/2") or s not in (1, -1) or r1 == r2:
        errs.append("out of the specification")
    if p["form"] == "secondo grado":
        if not -6 <= r1 < r2 <= 6:
            errs.append("zeros out of the specification")
        arg = s * (t - r1) * (t - r2)
        truth = domain(arg)
        errs += probe(truth, positive(arg))
        a, b = f"{r1}", f"{r2}"
        zone = lambda inside, closed: between(a, b, closed, closed) if inside else outside(a, b, closed)  # noqa: E731
        exp = {"giusta": dom(truth), "scambiati": dom(zone(s > 0, False)), "chiuso": dom(zone(s < 0, True)), "scambiati chiuso": dom(zone(s > 0, True))}
        text_arg = poly_tex([s * r1 * r2, -s * (r1 + r2), s])
        return f"f(x) = {fn(base, text_arg)}", exp, "choice", exp["giusta"][0], DOM
    if r1 == 0 or r2 == 0 or abs(r1) > 7 or abs(r2) > 7 or (s < 0 and r1 < 0):
        errs.append("zeros out of the specification")
    arg = s * (t - r1) / (t - r2)
    truth = domain(arg)
    errs += probe(truth, positive(arg))
    lo, hi = f"{min(r1, r2)}", f"{max(r1, r2)}"
    if s > 0:
        swapped, only = between(lo, hi), above(f"{r1}")
        with_zero = below(lo, min(r1, r2) == r1) + above(hi, max(r1, r2) == r1)
    else:
        swapped, only = outside(lo, hi), below(f"{r1}")
        with_zero = between(lo, hi, min(r1, r2) == r1, max(r1, r2) == r1)
    exp = {"giusta": dom(truth), "scambiati": dom(swapped), "solo numeratore": dom(only), "zero compreso": dom(with_zero)}
    numer = lin(1, -r1) if s > 0 else lin(-1, r1)
    frac = rf"\frac{{{numer}}}{{{lin(1, -r2)}}}"
    return f"f(x) = {fn(base, frac, False)}", exp, "choice", exp["giusta"][0], DOM


def level7(p, errs):
    a, h, k = p["a"], p["h"], p["k"]
    if a not in (2, 3) or h == 0 or k == 0 or abs(h) > 6 or abs(k) > 2:
        errs.append("out of the specification")
    if (p["form"] == "verso destra") != (h > 0):
        errs.append("form against h")
    x = Symbol("x", real=True)
    zeros = solveset(log(x - h) / log(a) + k, x, S.Reals)
    if len(zeros) != 1:
        errs.append(f"zeros of the function: {zeros}")
    zero = Rational(list(zeros)[0])

    def pair(asym, z):
        asym, z = Rational(asym), Rational(z)
        pt = f"({rtex(z)}, 0)" if z.q == 1 else rf"\left({rtex(z)}, 0\right)"
        return (rf"\begin{{gathered}} x = {rtex(asym)} \\ {pt} \end{{gathered}}", [rs(asym), rs(z)])

    A = Rational(a)
    exp = {"giusta": pair(h, zero), "segno": pair(-h, -h + A ** (-k)), "senza k": pair(h, h + 1), "esponente": pair(h, h + A**k)}
    problem = f"y = {log_tex(a, lin(1, -h), True)} {'+' if k > 0 else '-'} {abs(k)}"
    return problem, exp, "choice", exp["giusta"][0], "Trova l'asintoto verticale del grafico e il punto in cui il grafico taglia l'asse x."


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
