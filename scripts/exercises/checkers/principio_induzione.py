"""principio-induzione, from specs/exercises/principio-induzione.md.

Written from the spec, not from the generator. Statements are read back from the LaTeX of the problem: the
inequality of level 1, the formula "first side = second side" of levels 2-4 and 6 (general term = last addend,
checked against the first addends; the identity itself is checked for n = 1..8), the divisibility claim or the
recursive sequence of level 5, the lines of the proof of level 6. Expressions in k are compared by their exact
values for k = 1..8, so two writings of the same expression count as one.
"""
import re

from sympy import Rational, Symbol

from checkers._successioni import basic, k, label_check, lines, n, number_check, options_check, tex_expr, text_of

CASE_RANGES = {
    5: {"cubo": (0.22, 0.38), "quadrato": (0.13, 0.28), "potenza": (0.18, 0.32), "ricorsiva": (0.18, 0.32)},
    6: {"corretta": (0.18, 0.32), "un solo k": (0.18, 0.32), "dalla tesi": (0.18, 0.32), "base falsa": (0.18, 0.32)},
}

FLAWS = {
    "corretta": r"\text{la dimostrazione è corretta}",
    "un solo k": r"\begin{gathered} \text{il passo è dimostrato} \\ \text{per un solo valore di }k \end{gathered}",
    "dalla tesi": r"\begin{gathered} \text{il passo parte dalla tesi} \\ \text{come se fosse vera} \end{gathered}",
    "base falsa": r"\begin{gathered} \text{manca la base, e per }n = 1 \\ \text{l’enunciato è falso} \end{gathered}",
}
STEP_LINES = {
    "corretta": "Passo: si suppone vera $P(k)$, si aggiunge ai due membri il termine di posto $k + 1$ e si arriva al secondo membro di $P(k + 1)$.",
    "un solo k": "Passo: da $P(1)$ si ricava $P(2)$ con un conto; quindi il passo vale per ogni $k$.",
    "dalla tesi": "Passo: si scrive $P(k + 1)$ come se fosse vera e la si trasforma fino a ottenere $0 = 0$.",
}


def at(expr, sym=k):
    """The exact values of an expression at 1..8: its identity among the options."""
    return tuple(Rational(expr.subs(sym, i)) for i in range(1, 9))


def formula(first, second, errs):
    """The two lines "lhs =" and "= closed": the general term T(n) and the closed form F(n), with the identity checked."""
    if not first.endswith(" =") or not second.startswith("= "):
        raise ValueError("formula not on two lines")
    head, dots, last = first[:-2].partition(r" + \dots + ")
    shown_terms = head.split(" + ")
    if not dots or len(shown_terms) < 2:
        raise ValueError("no dots before the general term")
    T = tex_expr(last)
    F = tex_expr(second[2:])
    for i, shown in enumerate(shown_terms, 1):
        if tex_expr(shown) != T.subs(n, i):
            errs.append(f"addend {i} is not the general term at {i}")
    total = 0
    for i in range(1, 9):
        total += T.subs(n, i)
        if total != F.subs(n, i):
            errs.append(f"the formula is false for n = {i}")
            break
    return T, F


def expr_options(sample, truth, errs):
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        errs.append("answer must be a choice")
        return
    options_check(ans, lambda o: (at(tex_expr(o["latex"])), at(tex_expr_sympy(o["values"][0]))), at(truth), errs)
    right = ans["options"][ans["correct"]]["latex"] if isinstance(ans.get("correct"), int) and ans["correct"] < len(ans["options"]) else None
    if sample.get("solution") != right:
        errs.append("solution is not the right option")


def tex_expr_sympy(s):
    from sympy import sympify

    if not re.fullmatch(r"[0-9k+\-*/() ]+", s):
        raise ValueError(f"unreadable values {s!r}")
    return sympify(s, locals={"k": k})


def check_first_value(s, errs):
    m = re.fullmatch(r"(.+) > (.+)", s["problem"])
    left, right = tex_expr(m.group(1)), tex_expr(m.group(2))
    holds = [bool(left.subs(n, i) > right.subs(n, i)) for i in range(1, 61)]
    n0 = 61
    while n0 > 1 and holds[n0 - 2]:
        n0 -= 1
    gaps = [left.subs(n, i) - right.subs(n, i) for i in range(n0, 61)]
    if not 2 <= n0 <= 8 or any(b <= a for a, b in zip(gaps, gaps[1:])):
        errs.append(f"first value {n0} out of spec, or the gap does not keep growing")
    number_check(s, n0, errs)
    if m.group(1) == "n^2":
        return "quadrato e retta"
    return "esponenziale e quadrato" if "n^2" in m.group(2) else "esponenziale e retta"


def check_proof_step(s, errs):
    ls = lines(s["problem"])
    if len(ls) != 3 or not ls[1].endswith(" ="):
        errs.append("expected the statement and two lines")
        return None
    head = text_of(ls[0])
    lhs_tex = ls[1][:-2]
    div = re.fullmatch(r"Enunciato: \$(.+)\$ è divisibile per \$(\d+)\$\.", head)
    rec = re.fullmatch(r"Enunciato: \$a_n = (.+)\$, con \$a_1 = (-?\d+)\$ e \$a_\{n\+1\} = (.+)\$\.", head)
    if div:
        f, m = tex_expr(div.group(1)), int(div.group(2))
        if any(f.subs(n, i) % m for i in range(1, 31)):
            errs.append("the statement is false")
        lhs = tex_expr(lhs_tex)
        if at(lhs) != at(f.subs(n, k + 1)):
            errs.append("the first line is not the expression at k + 1")
        poly = re.fullmatch(r"= \((.+)\) \+ (\d+) \\cdot \(\\ \?\\ \)", ls[2])
        power = re.fullmatch(r"= (\d+) \\cdot \((.+)\) \+ \\ \?", ls[2])
        if poly:
            A, mm = tex_expr(poly.group(1)), int(poly.group(2))
            truth = ((lhs - A) / mm).expand()
            kind = "cubo" if f.as_poly(n).degree() == 3 else "quadrato"
            if mm != m:
                errs.append("the factor is not the divisor")
        elif power:
            A, mm = tex_expr(power.group(2)), int(power.group(1))
            truth = (lhs - mm * A).simplify()
            kind = "potenza"
            if not truth.is_integer or truth % m:
                errs.append("the missing addend is not a multiple of the divisor")
        else:
            errs.append("unreadable second line")
            return None
        if at(A) != at(f.subs(n, k)):
            errs.append("the bracket is not the inductive hypothesis")
    elif rec:
        A = Symbol("A")
        g, a1 = tex_expr(rec.group(1)), int(rec.group(2))
        law = tex_expr(rec.group(3).replace("a_n", "A"), {"A": A})
        if g.subs(n, 1) != a1 or any(law.subs(A, g.subs(n, i)) != g.subs(n, i + 1) for i in range(1, 9)):
            errs.append("the general term does not satisfy the recursion")
        m1 = re.fullmatch(r"a_\{k\+1\} = (.+)", lhs_tex)
        m2 = re.fullmatch(r"= (.+) = \\ \?", ls[2])
        if not m1 or not m2:
            errs.append("unreadable step")
            return None
        if tex_expr(m1.group(1).replace("a_k", "A"), {"A": A}) != law:
            errs.append("the first line is not the law")
        truth = tex_expr(m2.group(1))
        if at(truth) != at(law.subs(A, g.subs(n, k))) or at(truth) != at(g.subs(n, k + 1)):
            errs.append("the step does not lead to the thesis")
        kind = "ricorsiva"
    else:
        errs.append(f"unreadable statement {head!r}")
        return None
    expr_options(s, truth, errs)
    return kind


def check_proof(s, errs):
    ls = lines(s["problem"])
    head = text_of(ls[0])
    parity = re.fullmatch(r"Enunciato, per ogni \$n \\geq 1\$: \$(.+)\$ è (pari|dispari)\.", head)
    if parity:
        f = tex_expr(parity.group(1))
        step = re.fullmatch(r"Passo: \$(.+) = \((.+)\) \+ 2\(k \+ 1\)\$, e aggiungere un numero pari non cambia la parità\.", text_of(ls[2]) if len(ls) == 3 else "")
        if len(ls) != 3 or text_of(ls[1]) != "Base: non è stata verificata." or not step:
            errs.append("unreadable proof")
            return None
        if at(tex_expr(step.group(1))) != at(f.subs(n, k + 1)) or at(tex_expr(step.group(2))) != at(f.subs(n, k)) or at(f.subs(n, k + 1) - f.subs(n, k)) != at(2 * (k + 1)):
            errs.append("the inductive step of the proof is wrong")
        claimed_even = parity.group(2) == "pari"
        if (f.subs(n, 1) % 2 == 0) == claimed_even:
            errs.append("the statement is true for n = 1")
        truth = "base falsa"
    else:
        if head != r"Enunciato, per ogni $n \geq 1$:" or len(ls) != 5:
            errs.append("unreadable proof")
            return None
        T, F = formula(ls[1], ls[2], errs)
        base = re.fullmatch(r"Base: per \$n = 1\$ i due membri valgono \$(-?\d+)\$\.", text_of(ls[3]))
        if not base or int(base.group(1)) != T.subs(n, 1) or F.subs(n, 1) != T.subs(n, 1):
            errs.append("the base of the proof is wrong")
        found = [key for key, text in STEP_LINES.items() if text_of(ls[4]) == text]
        if len(found) != 1:
            errs.append("unknown inductive step")
            return None
        truth = found[0]
    label_check(s, FLAWS, truth, errs)
    return truth


def check(sample):
    errs = basic(sample)
    lvl, p = sample["level"], sample["params"]
    kind = None
    if lvl == 1:
        kind = check_first_value(sample, errs)
    elif lvl in (2, 3, 4):
        ls = lines(sample["problem"])
        if len(ls) != 2:
            return errs + ["expected the formula on two lines"], None
        T, F = formula(ls[0], ls[1], errs)
        if lvl == 2:
            m = re.fullmatch(r"Verifica l'uguaglianza per n = (\d+): quanto valgono i due membri\?", sample["prompt"])
            if not m or int(m.group(1)) != p.get("n") or not 1 <= int(m.group(1)) <= 4:
                errs.append("the prompt does not give n")
            else:
                number_check(sample, F.subs(n, int(m.group(1))), errs)
        else:
            expr_options(sample, (T if lvl == 3 else F).subs(n, k + 1), errs)
    elif lvl == 5:
        kind = check_proof_step(sample, errs)
    elif lvl == 6:
        kind = check_proof(sample, errs)
    else:
        return [f"unknown level {lvl}"], None
    if kind is not None and kind != p.get("case"):
        errs.append(f"case {p.get('case')!r} but the exercise is {kind!r}")
    return errs, kind
