"""Checker for disequazioni-esponenziali, written from specs/exercises/disequazioni-esponenziali.md.

It reads the inequality from the LaTeX of the problem and checks the right option without the lesson's methods:
on a fine grid of numbers the inequality must be true exactly where the number is in the intervals of the answer,
every finite end must make the two members equal (40 digits) and must be included only with ≤ and ≥. The terms in
`params` must say the same inequality as the text. Every option is written again from its values in the notation
of the sample and compared with its LaTeX. Then the constraints of each level, the share of each case and the
mistakes that must be among the wrong options (the sign turned or not turned, the values of t).
"""
import re

from sympy import Integer

from checkers._esponenziali import check_choice, forbidden, grid, intervals_tex, is_all, is_zero, member, number_fn, parse_iv, to_expr, x

CASE_RANGES = {
    3: {"secondo membro positivo": (0.20, 0.40), "sempre vera": (0.25, 0.45), "impossibile": (0.25, 0.45)},
    4: {
        "base maggiore di 1, m positivo": (0.20, 0.42),
        "base tra 0 e 1, m positivo": (0.20, 0.42),
        "base maggiore di 1, m negativo": (0.10, 0.30),
        "base tra 0 e 1, m negativo": (0.10, 0.30),
    },
    5: {
        "base maggiore di 1, valori interni": (0.15, 0.35),
        "base maggiore di 1, valori esterni": (0.15, 0.35),
        "base tra 0 e 1, valori interni": (0.15, 0.35),
        "base tra 0 e 1, valori esterni": (0.15, 0.35),
    },
    6: {"fattore negativo": (0.35, 0.65), "fattore positivo": (0.35, 0.65)},
    7: {
        "due valori positivi, valori interni": (0.15, 0.40),
        "due valori positivi, valori esterni": (0.15, 0.40),
        "un valore negativo, valori interni": (0.12, 0.35),
        "un valore negativo, valori esterni": (0.12, 0.35),
    },
}

OPS = [(r"\leq", "<="), (r"\geq", ">="), ("<", "<"), (">", ">")]
FLIP = {"<": ">", ">": "<", "<=": ">=", ">=": "<="}
HOLDS = {"<": lambda d: d < 0, ">": lambda d: d > 0, "<=": lambda d: d <= 0, ">=": lambda d: d >= 0}


def split(problem):
    for tex, op in OPS:
        if problem.count(tex) == 1:
            left, right = problem.split(tex)
            return to_expr(left), op, to_expr(right)
    raise ValueError(f"not one inequality: {problem}")


def side(a, terms):
    out = Integer(0)
    for t in terms:
        e = sum(Integer(c) * x**i for i, c in enumerate(t["e"]))
        out += Integer(t["c"]) * Integer(a) ** (Integer(t["p"]) * e)
    return out


def ray_key(r, op):
    r = str(r)
    return {"<": f"(-oo,{r})", "<=": f"(-oo,{r}]", ">": f"({r},oo)", ">=": f"[{r},oo)"}[op]


def check(sample):
    errs = []
    lvl = sample["level"]
    p = sample["params"]
    problem = sample["problem"]
    left, op, right = split(problem)
    if op != p.get("op"):
        errs.append("params.op is not the sign of the problem")
    f = left - right
    a = p["a"]
    notation = p.get("notation")
    if notation not in ("disequazioni", "intervalli"):
        errs.append("unknown notation")

    ans = sample["answer"]
    if ans.get("kind") != "choice":
        return [f"answer.kind is {ans.get('kind')}, expected choice"], None
    truth_vals = p.get("truth", [])
    truth_key = "|".join(truth_vals)
    opts = check_choice(ans, truth_key, errs)
    if sample.get("choice") and sample["choice"] != ans:
        errs.append("choice differs from the answer")
    ivs = [parse_iv(v) for v in ans["options"][ans["correct"]]["values"]]

    # the answer, on a grid and at its ends
    fn = number_fn(f)
    holds = HOLDS[op]
    bad = [v for v in grid(-9.0, 9.0, 1 / 16) if holds(fn(v)) != member(ivs, v)]
    if bad:
        errs.append(f"the answer is wrong at x = {bad[0]:.4f} ({len(bad)} points)")
    for lo, hi, lc, hc in ivs:
        for e, c in ((lo, lc), (hi, hc)):
            if e is None:
                continue
            if not is_zero(f.subs(x, e)):
                errs.append(f"the end {e} does not make the two members equal")
            if c != (op in ("<=", ">=")):
                errs.append(f"the end {e} is included or left out against the sign")
            if e.q > 4 or abs(e.p) > 9:
                errs.append(f"the end {e} is out of range")
    for (_, hi, _, _), (lo, _, _, _) in zip(ivs, ivs[1:]):
        if hi is None or lo is None or hi >= lo:
            errs.append("intervals not in order")

    # every option written as the specification says
    for o in opts:
        try:
            want = intervals_tex(o["values"], notation)
        except ValueError as e:
            errs.append(str(e))
            continue
        if o["latex"] != want:
            errs.append(f"option {o['values']} is written {o['latex']}, expected {want}")
    if sample.get("solution") != intervals_tex(truth_vals, "intervalli"):
        errs.append("solution is not the answer written with the intervals")
    last = sample["steps"][-1] if sample.get("steps") else ""
    want_last = r"\text{Nessun } x \text{ è soluzione.}" if not ivs else r"\text{Ogni } x \text{ è soluzione.}" if is_all(ivs) else intervals_tex(truth_vals, "disequazioni")
    if last != want_last:
        errs.append("the last step is not the answer written with the inequalities")
    if sample.get("prompt") != "Risolvi la disequazione.":
        errs.append("wrong prompt")
    errs += forbidden(problem)
    if re.search(r"\\text\{[^}]*-\d", " ".join(sample.get("steps", []))):
        errs.append("a negative number inside \\text in the steps")

    lhs, rhs = p["lhs"], p["rhs"]
    g = number_fn(side(a, lhs) - side(a, rhs) - f)
    if any(abs(g(v)) > 1e-9 * max(1.0, abs(fn(v))) for v in (-1.3, -0.4, 0.3, 0.9, 1.7)):
        errs.append("params do not say the inequality of the problem")

    case = p.get("case")
    keys = {"|".join(o["values"]) for o in opts}
    special = not ivs or is_all(ivs)
    if lvl != 3 and special:
        errs.append("empty set or all the reals out of level 3")
    if lvl in (1, 2, 3):
        if a not in (2, 3, 5, 10):
            errs.append("base must be 2, 3, 5 or 10")
        want_p = {1: (1,), 2: (-1,), 3: (1, -1)}[lvl]
        if len(lhs) != 1 or lhs[0]["c"] != 1 or lhs[0]["e"] != [0, 1] or lhs[0]["p"] not in want_p:
            errs.append(f"level {lvl}: first member must be the power of the level with exponent x")
        if not right.is_number:
            errs.append(f"level {lvl}: second member must be a number")
        elif lvl < 3 and right <= 0:
            errs.append(f"level {lvl}: second member must be positive")
        elif lvl == 1 and case != ("esponente negativo" if right < 1 else "esponente non negativo"):
            errs.append("level 1: wrong case")
        elif lvl == 2 and (right == 1 or case != ("secondo membro frazione" if right < 1 else "secondo membro intero")):
            errs.append("level 2: wrong case")
        elif lvl == 3:
            if right <= 0:
                if not special or case != ("sempre vera" if op in (">", ">=") else "impossibile"):
                    errs.append("level 3: b <= 0 gives all the reals or the empty set")
            elif special or case != "secondo membro positivo":
                errs.append("level 3: b > 0 gives a half-line")
            if not {"(-oo,oo)", ""} <= keys:
                errs.append("level 3: all the reals and the empty set must be among the options")
    else:
        if a not in (2, 3, 5):
            errs.append("base must be 2, 3 or 5")
    if lvl in (1, 2, 4, 6) and len(ivs) == 1:
        # the same end with the sign turned: the mistake of the base, or of the negative factor
        lo, hi, lc, hc = ivs[0]
        e = lo if lo is not None else hi
        mine = ">" if lo is not None else "<"
        mine += "=" if (lc or hc) else ""
        if ray_key(e, FLIP[mine]) not in keys:
            errs.append("the half-line with the sign turned is not among the options")
    if lvl == 4:
        (t,) = lhs
        k, m = t["e"]
        if t["p"] not in (1, -1) or m == 0 or not -3 <= m <= 4 or abs(k) > 5 or (m == 1 and k == 0):
            errs.append("level 4: exponent out of the specification")
        if case != f"{'base maggiore di 1' if t['p'] == 1 else 'base tra 0 e 1'}, {'m positivo' if m > 0 else 'm negativo'}":
            errs.append("level 4: wrong case")
    if lvl == 5:
        (t,) = lhs
        if t["p"] not in (1, -1) or len(t["e"]) != 3 or t["e"][2] != 1:
            errs.append("level 5: exponent must be x^2 + b x + c")
        ends = sorted({e for iv in ivs for e in iv[:2] if e is not None})
        if len(ends) != 2 or any(e.q != 1 or abs(e) > 5 for e in ends):
            errs.append("level 5: two integer zeros between -5 and 5")
        else:
            inner = len(ivs) == 1
            if case != f"{'base maggiore di 1' if t['p'] == 1 else 'base tra 0 e 1'}, valori {'interni' if inner else 'esterni'}":
                errs.append("level 5: wrong case")
            c = "]" if op in ("<=", ">=") else ")"
            o = "[" if op in ("<=", ">=") else "("
            other = f"(-oo,{ends[0]}{c}|{o}{ends[1]},oo)" if inner else f"{o}{ends[0]},{ends[1]}{c}"
            if other not in keys:
                errs.append("level 5: the complementary answer is not among the options")
    if lvl == 6:
        if len(lhs) != 2 or any(t["p"] != 1 or abs(t["c"]) != 1 or t["e"][1] != 1 or not -2 <= t["e"][0] <= 3 for t in lhs):
            errs.append("level 6: two powers a^(x + k) expected")
        else:
            F = lhs[0]["c"] * a ** (lhs[0]["e"][0] - lhs[1]["e"][0]) + lhs[1]["c"]
            if lhs[0]["e"][0] <= lhs[1]["e"][0] or case != ("fattore negativo" if F < 0 else "fattore positivo"):
                errs.append("level 6: wrong order or case")
        if not right.is_Integer or abs(right) > 2000:
            errs.append("level 6: second member must be an integer up to 2000")
    if lvl == 7:
        if [t["p"] for t in lhs] != [2, 1, 0] or lhs[0]["c"] != 1 or right != 0:
            errs.append("level 7: (a^2)^x + s a^x + p op 0 expected")
        else:
            s, pr = lhs[1]["c"], lhs[2]["c"]
            disc = s * s - 4 * pr
            r = int(round(max(disc, 0) ** 0.5))
            if disc <= 0 or r * r != disc:
                errs.append("level 7: the trinomial in t must have two distinct rational zeros")
            else:
                t1, t2 = (-s - r) // 2, (-s + r) // 2
                inner = op in ("<", "<=")
                want = f"{'due valori positivi' if t1 > 0 else 'un valore negativo'}, valori {'interni' if inner else 'esterni'}"
                if t1 == 0 or case != want:
                    errs.append("level 7: wrong case")
                c = "]" if op in ("<=", ">=") else ")"
                o = "[" if op in ("<=", ">=") else "("
                if t1 > 0:
                    tk = f"{o}{t1},{t2}{c}" if inner else f"(-oo,{t1}{c}|{o}{t2},oo)"
                    if tk not in keys:
                        errs.append("level 7: the values of t are not among the options")
                elif ("" if inner else "(-oo,oo)") not in keys:
                    errs.append("level 7: the answer of who throws away the negative value is not among the options")
    if lvl in (4, 5) and not (right.is_number and right > 0):
        errs.append(f"level {lvl}: second member must be a positive number")
    return errs, case
