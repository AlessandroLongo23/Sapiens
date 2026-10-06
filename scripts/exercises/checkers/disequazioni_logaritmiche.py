"""Checker for disequazioni-logaritmiche, written from specs/exercises/disequazioni-logaritmiche.md.

The solution is computed forwards on intervals: the conditions of existence, the inequality between the arguments
with the sign kept or turned by the base, their common part. It is then tried against the inequality of the
problem itself, logarithms included, evaluated on numbers between the ends, beside them and far away, and each
finite end is tried exactly: an end where an argument vanishes is out, any other is in only with ≥ and ≤. Each
mistake of the specification is made again on the same intervals. See _logaritmi.py.
"""
import math

from sympy import Rational

from checkers._logaritmi import (
    ALL,
    FLIP,
    LARGE,
    OP_TEX,
    TOGGLE,
    R,
    above,
    between,
    iv_cand,
    lin,
    log_head,
    log_str,
    log_tex,
    meet,
    normal,
    outside,
    poly_tex,
    probe,
    ray,
    rs,
    rtex,
    val,
    verify_sample,
)

CASE_RANGES = {
    1: {"verso maggiore": (0.40, 0.60), "verso minore": (0.40, 0.60)},
    2: {"verso maggiore": (0.40, 0.60), "verso minore": (0.40, 0.60)},
    3: {"valori esterni": (0.40, 0.60), "due intervalli": (0.40, 0.60)},
    4: {"base maggiore di 1": (0.40, 0.60), "base minore di 1": (0.40, 0.60)},
    5: {"somma": (0.45, 0.65), "differenza": (0.35, 0.55)},
    6: {"valori esterni": (0.40, 0.60), "valori interni": (0.40, 0.60)},
    7: {"base maggiore di 1": (0.35, 0.55), "base minore di 1": (0.25, 0.45), "secondo membro negativo": (0.12, 0.28)},
}

PROMPT = "Risolvi la disequazione."
OPS = ("<", ">", "<=", ">=")


def compare(op, u, v):
    return {"<": u < v, ">": u > v, "<=": u <= v, ">=": u >= v}[op]


def lin_ray(m, n, op, v):
    """m x + n op v."""
    return ray(op if m > 0 else FLIP[op], rs((Rational(v) - n) / m))


def positive(m, n):
    return lin_ray(m, n, ">", 0)


def lg(v, base):
    return math.log(v) / math.log(float(base))


def nice(ivs, max_den=6):
    for iv in ivs:
        for e in iv[:2]:
            if e is not None:
                r = Rational(e)
                if r.q > max_den or abs(r.p) > 150:
                    return False
    return True


def ends_ok(truth, args, op):
    """Errors on the ends: an end where an argument (a function of a Rational) is not positive is out, any other
    end is in only if the sign is ≥ or ≤."""
    errs = []
    for lo, hi, lc, hc in truth:
        for e, closed in ((lo, lc), (hi, hc)):
            if e is None:
                continue
            x0 = Rational(e)
            want = op in LARGE and all(a(x0) > 0 for a in args)
            if closed != want:
                errs.append(f"end {e}: closed {closed}, expected {want}")
    return errs


def cands_of(truth, pairs):
    exp = {"giusta": iv_cand(truth)}
    for tag, ivs in pairs:
        exp[tag] = iv_cand(ivs)
    return exp


def arg_log(base, m, n):
    return log_tex(base, "x") if (m, n) == (1, 0) else log_tex(base, lin(m, n), True)


def one_log(p, errs, level):
    base, c, m, n, op = R(p["base"]), p["c"], p["m"], p["n"], p["op"]
    big = base > 1
    K = base**c
    allowed = (2, 3, 5, 10) if level == 1 else tuple(Rational(1, d) for d in (2, 3, 4, 5, 10))
    if base not in allowed or not -3 <= c <= 3 or max(K.p, K.q) > 125 or m not in (1, 2, 3, -1, -2) or n == 0 or abs(n) > 9 or op not in OPS:
        errs.append("out of the specification")
    eff = op if big else FLIP[op]
    D = positive(m, n)
    truth = meet(D, lin_ray(m, n, eff, K))
    f = lambda t: m * t + n  # noqa: E731
    errs += probe(truth, lambda t: f(t) > 0 and compare(op, lg(f(t), base), c))
    errs += ends_ok(truth, [f], op)
    pairs = [
        ("senza C.E.", lin_ray(m, n, eff, K)),
        ("verso", meet(D, lin_ray(m, n, FLIP[eff], K))),
        ("estremi", meet(D, lin_ray(m, n, TOGGLE[eff], K))),
        ("senza potenza", lin_ray(m, n, eff, c)),
        ("verso senza C.E.", lin_ray(m, n, FLIP[eff], K)),
        ("solo C.E.", D),
    ]
    if not truth or not nice(truth + [iv for _, ivs in pairs for iv in ivs]):
        errs.append("empty solution or ends out of the specification")
    if (p["form"] == "verso maggiore") != (op in (">", ">=")):
        errs.append("form against the sign")
    return f"{log_tex(base, lin(m, n), True)} {OP_TEX[op]} {c}", cands_of(truth, pairs)


def zone(op, a, b):
    """(x - a)(x - b) op 0 with a < b."""
    a, b = rs(a), rs(b)
    return outside(a, b, op == ">=") if op in (">", ">=") else between(a, b, op == "<=", op == "<=")


def level3(p, errs):
    base, c, r1, r2, d, op = R(p["base"]), p["c"], p["r1"], p["r2"], p["d"], p["op"]
    K = base**c
    if base not in (2, 3, 5, 10, Rational(1, 2), Rational(1, 3), Rational(1, 4)) or K.q != 1 or K > 30 or not 1 <= d <= 3 or not -8 <= r1 <= 6 or r2 > 10:
        errs.append("out of the specification")
    s1, s2 = r1 + d, r2 - d
    if not s1 < s2 or s1 * s2 - r1 * r2 != K:
        errs.append("the zeros of params do not give the argument")
    b, c0 = -(s1 + s2), s1 * s2
    eff = op if base > 1 else FLIP[op]
    D = outside(rs(s1), rs(s2))
    truth = meet(D, zone(eff, r1, r2))
    f = lambda t: t * t + b * t + c0  # noqa: E731
    errs += probe(truth, lambda t: f(t) > 0 and compare(op, lg(f(t), base), c))
    errs += ends_ok(truth, [f], op)
    pairs = [("senza C.E.", zone(eff, r1, r2)), ("verso", meet(D, zone(FLIP[eff], r1, r2))), ("estremi", meet(D, zone(TOGGLE[eff], r1, r2))), ("verso senza C.E.", zone(FLIP[eff], r1, r2)), ("solo C.E.", D)]
    if (p["form"] == "valori esterni") != (eff in (">", ">=")):
        errs.append("form against the sign")
    return f"{log_tex(base, poly_tex([c0, b, 1]), True)} {OP_TEX[op]} {c}", cands_of(truth, pairs)


def level4(p, errs):
    base, m1, n1, m2, n2, op = R(p["base"]), p["m1"], p["n1"], p["m2"], p["n2"], p["op"]
    big = base > 1
    if base not in (2, 3, 5, 10, Rational(1, 2), Rational(1, 3), Rational(1, 5)) or m1 not in (1, 2, 3, -1) or m2 not in (1, 2, 3, -1, -2) or m1 == m2 or n1 == 0 or n2 == 0 or abs(n1) > 9 or abs(n2) > 9:
        errs.append("out of the specification")
    eff = op if big else FLIP[op]
    D1 = positive(m1, n1)
    D = meet(D1, positive(m2, n2))
    Rr = lambda o: lin_ray(m1 - m2, n1 - n2, o, 0)  # noqa: E731
    truth = meet(D, Rr(eff))
    f = lambda t: m1 * t + n1  # noqa: E731
    g = lambda t: m2 * t + n2  # noqa: E731
    errs += probe(truth, lambda t: f(t) > 0 and g(t) > 0 and compare(op, lg(f(t), base), lg(g(t), base)))
    errs += ends_ok(truth, [f, g], op)
    pairs = [("senza C.E.", Rr(eff)), ("verso", meet(D, Rr(FLIP[eff]))), ("estremi", meet(D, Rr(TOGGLE[eff]))), ("una sola C.E.", meet(D1, Rr(eff))), ("solo C.E.", D)]
    if not truth or not nice(truth + [iv for _, ivs in pairs for iv in ivs], 4):
        errs.append("empty solution or ends out of the specification")
    if (p["form"] == "base maggiore di 1") != big:
        errs.append("form against the base")
    return f"{log_tex(base, lin(m1, n1), True)} {OP_TEX[op]} {log_tex(base, lin(m2, n2), True)}", cands_of(truth, pairs)


def level5(p, errs):
    a, c, pp, qq, op = p["a"], p["c"], p["p"], p["q"], p["op"]
    K = a**c
    if a not in (2, 3, 5, 10) or not 1 <= c <= 3 or K > 125 or pp == qq:
        errs.append("out of the specification")
    f = lambda t: t + pp  # noqa: E731
    g = lambda t: t + qq  # noqa: E731
    D = meet(positive(1, pp), positive(1, qq))
    if p["form"] == "somma":
        # (x + p)(x + q) - K = x^2 + (p + q)x + pq - K, with integer zeros
        disc = (pp + qq) ** 2 - 4 * (pp * qq - K)
        root = math.isqrt(disc)
        if root * root != disc or (root - pp - qq) % 2:
            errs.append("the zeros are not integers")
            return "", {}
        z1, z2 = (-(pp + qq) - root) // 2, (-(pp + qq) + root) // 2
        if abs(pp) > 15 or abs(qq) > 15:
            errs.append("out of the specification")
        truth = meet(D, zone(op, z1, z2))
        errs += probe(truth, lambda t: f(t) > 0 and g(t) > 0 and compare(op, lg(f(t), a) + lg(g(t), a), c))
        errs += ends_ok(truth, [f, g], op)
        pairs = [
            ("senza C.E.", zone(op, z1, z2)),
            ("verso", meet(D, zone(FLIP[op], z1, z2))),
            ("estremi", meet(D, zone(TOGGLE[op], z1, z2))),
            ("argomenti sommati", meet(D, lin_ray(2, pp + qq, op, K))),
            ("solo C.E.", D),
        ]
        return f"{arg_log(a, 1, pp)} + {arg_log(a, 1, qq)} {OP_TEX[op]} {c}", cands_of(truth, pairs)
    if pp == 0 or qq == 0 or not -9 <= pp <= 12 or abs(qq) > 9:
        errs.append("out of the specification")
    Rr = lambda o: lin_ray(1 - K, pp - K * qq, o, 0)  # noqa: E731
    truth = meet(D, Rr(op))
    errs += probe(truth, lambda t: f(t) > 0 and g(t) > 0 and compare(op, lg(f(t), a) - lg(g(t), a), c))
    errs += ends_ok(truth, [f, g], op)
    pairs = [
        ("senza C.E.", Rr(op)),
        ("verso", meet(D, Rr(FLIP[op]))),
        ("estremi", meet(D, Rr(TOGGLE[op]))),
        ("potenza dalla parte sbagliata", meet(D, lin_ray(K - 1, K * pp - qq, op, 0))),
        ("solo C.E.", D),
    ]
    if not truth or not nice(truth + [iv for _, ivs in pairs for iv in ivs], 4):
        errs.append("empty solution or ends out of the specification")
    if iv_cand(truth) == iv_cand(Rr(op)) or iv_cand(truth) == iv_cand(D) or op not in (">", ">="):
        errs.append("the answer must need both the conditions of existence and the inequality (signs > and >= only)")
    return f"{arg_log(a, 1, pp)} - {arg_log(a, 1, qq)} {OP_TEX[op]} {c}", cands_of(truth, pairs)


def log_trinomial(base, B, C):
    head = log_head(base)
    out = r"\log^2 x" if head == r"\log" else f"{head}^2 x"
    if B != 0:
        out += f" {'-' if B < 0 else '+'} {'' if abs(B) == 1 else abs(B)}{head} x"
    if C != 0:
        out += f" {'-' if C < 0 else '+'} {abs(C)}"
    return out


def level6(p, errs):
    base, t1, t2, op = R(p["base"]), p["t1"], p["t2"], p["op"]
    if base not in (2, 3, 10, Rational(1, 2)) or not -3 <= t1 < t2 <= 3 or t1 == -t2:
        errs.append("out of the specification")
    B, C = -(t1 + t2), t1 * t2
    lo, hi = sorted([base**t1, base**t2])
    if max(hi.p, lo.q) > 1000:
        errs.append("ends too large")
    D = above("0")
    truth = meet(D, zone(op, lo, hi))

    def holds(t):
        if t <= 0:
            return False
        u = lg(t, base)
        return compare(op, u * u + B * u + C, 0)

    errs += probe(truth, holds)
    errs += ends_ok(truth, [lambda t: t], op)
    pairs = [
        ("non torna alla x", zone(op, t1, t2)),
        ("senza C.E.", zone(op, lo, hi)),
        ("verso", meet(D, zone(FLIP[op], lo, hi))),
        ("estremi", meet(D, zone(TOGGLE[op], lo, hi))),
        ("verso senza C.E.", zone(FLIP[op], lo, hi)),
    ]
    if (p["form"] == "valori esterni") != (op in (">", ">=")):
        errs.append("form against the sign")
    return f"{log_trinomial(base, B, C)} {OP_TEX[op]} 0", cands_of(truth, pairs)


def exp_tex(base, k):
    b = f"{base.p}" if base.q == 1 else rf"\left({rtex(base)}\right)"
    return f"{b}^x" if k == 0 else f"{b}^{{{lin(1, k)}}}"


def level7(p, errs):
    base, k, b, op = R(p["base"]), p["k"], p["b"], p["op"]
    big = base > 1
    free = abs(b)
    if base not in (2, 3, 5, 10, Rational(1, 2), Rational(1, 3)) or abs(k) > 4 or not 2 <= free <= 30 or any(base**e == free for e in range(-12, 13)):
        errs.append("out of the specification")
    eff = op if big else FLIP[op]
    v = log_str(base, free, -k)
    holds = lambda t: compare(op, float(base) ** (t + k), b)  # noqa: E731
    problem = f"{exp_tex(base, k)} {OP_TEX[op]} {b}"
    if b < 0:
        truth = ALL if op in (">", ">=") else []
        errs += probe(truth, holds, extra=(float(val(v)),))
        if p["form"] != "secondo membro negativo":
            errs.append("form against the second member")
        pairs = [("caso opposto", [] if truth else ALL), ("segno ignorato", ray(eff, v)), ("segno ignorato e verso", ray(FLIP[eff], v))]
        return problem, cands_of(truth, pairs)
    truth = ray(eff, v)
    errs += probe(truth, holds)
    if abs(float(base) ** (float(val(v)) + k) - b) > 1e-9:
        errs.append("the end does not make the two members equal")
    if (truth[0][2] or truth[0][3]) != (op in LARGE):
        errs.append("end closed against the sign")
    if (p["form"] == "base maggiore di 1") != big:
        errs.append("form against the base")
    pairs = [
        ("verso", ray(FLIP[eff], v)),
        ("estremi", ray(TOGGLE[eff], v)),
        ("base e argomento scambiati", ray(eff, log_str(free, base, -k))),
        ("quoziente", ray(eff, rs(Rational(free) / base - k))),
        ("segno di k", ray(eff, log_str(base, free, k))),
    ]
    return problem, cands_of(truth, pairs)


LEVELS = {1: lambda p, e: one_log(p, e, 1), 2: lambda p, e: one_log(p, e, 2), 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}


def check(sample):
    p = sample["params"]
    f = LEVELS.get(sample["level"])
    if f is None:
        return [f"unknown level {sample['level']}"], None
    errs = []
    problem, exp = f(p, errs)
    if not exp:
        return errs, p.get("form")
    errs += verify_sample(sample, problem, exp, "choice", exp["giusta"][0], PROMPT)
    return errs, p.get("form")
