"""Checker for regressione-correlazione, from specs/exercises/regressione-correlazione.md.

The pairs of data, or the indices, are read back from the problem LaTeX; covariance, variances, slope,
intercept, estimate and r are recomputed with Fractions, and r from the data is rounded with SymPy's exact
square root. The lines of level 3 are read back from the option LaTeX.
"""
import re
from fractions import Fraction as F
from math import isqrt

from checkers._bivariata import array_rows, body_lines, check_choice_shape, check_number_choice, finite_digits, frac, num, round_to, sqrt_round100

CASE_RANGES = {
    3: {"m positivo": (0.50, 0.70), "m negativo": (0.30, 0.50)},
    4: {"m positivo": (0.50, 0.70), "m negativo": (0.30, 0.50)},
    5: {"scarti": (0.40, 0.60), "varianze": (0.40, 0.60)},
    7: {"positiva": (0.27, 0.43), "negativa": (0.27, 0.43), "nulla": (0.22, 0.38)},
}

SLOPES = {F(1, 4), F(1, 2), F(3, 4), F(3, 2), F(2), F(5, 2), F(3), F(2, 5), F(3, 5), F(4, 5), F(6, 5)}
RS = {F(9, 10), F(4, 5), F(3, 4), F(7, 10), F(3, 5), F(1, 2), F(2, 5), F(3, 10), F(1, 4)}
# story → (x range, y range, sign the covariance must have)
STORIES = [
    ("studenti", (1, 12), (3, 10), 1),
    ("auto usate", (1, 12), (2, 20), -1),
    ("giocatori", (2, 16), (0, 12), 1),
    ("coppie di valori", (0, 12), (0, 20), 0),
]
STATEMENTS = {"cresce", "diminuisce", "nessun legame lineare", "causa"}


def read_pairs(problem, errs):
    lines = body_lines(problem)
    spec, rows = array_rows(lines[-1])
    if len(rows) != 2 or rows[0][0] != "x" or rows[1][0] != "y":
        raise ValueError("tabella delle coppie non riconosciuta")
    xs, ys = [int(c) for c in rows[0][1:]], [int(c) for c in rows[1][1:]]
    n = len(xs)
    if n not in (4, 5) or len(ys) != n or spec != "c|" + "c" * n:
        errs.append("servono 4 o 5 coppie")
    prose = " ".join(lines[:-1])
    if ("quattro" in prose) != (n == 4) or ("cinque" in prose) != (n == 5):
        errs.append("il testo non dice il numero giusto di coppie")
    story = next((s for s in STORIES if s[0] in prose), None)
    if not story:
        errs.append("storia sconosciuta")
    if xs != sorted(xs) or len(set(xs)) != n:
        errs.append("x non crescenti o ripetuti")
    if sum(xs) % n or sum(ys) % n:
        errs.append("medie non intere")
    mx, my = F(sum(xs), n), F(sum(ys), n)
    dx, dy = [x - mx for x in xs], [y - my for y in ys]
    P, A, B = sum(a * b for a, b in zip(dx, dy)), sum(a * a for a in dx), sum(b * b for b in dy)
    if story:
        _, (xl, xh), (yl, yh), sign = story
        if not all(xl <= x <= xh for x in xs) or not all(yl <= y <= yh for y in ys):
            errs.append("dati fuori dall'intervallo della storia")
        if sign and P * sign <= 0:
            errs.append("segno della covarianza contrario alla storia")
    if max(abs(a) for a in dx) > 5 or max(abs(b) for b in dy) > 4 or len(set(dy)) < 3:
        errs.append("scarti fuori dai limiti")
    if P == 0:
        errs.append("covarianza nulla")
    return xs, ys, n, P, A, B


def given(problem, name):
    """The value of an index written in the problem as `name = value`."""
    m = re.search(re.escape(name) + r" = (-?\d+(?:\{,\}\d+)?)(?![\d{])", problem)
    if not m:
        raise ValueError(f"manca {name}")
    return num(m.group(1))


def read_line(latex):
    """(m, q) of an option written y = mx + q."""
    m = re.fullmatch(r"y = (-?(?:\d+(?:\{,\}\d+)?)?)x(?: ([+-]) (\d+(?:\{,\}\d+)?))?", latex)
    if not m:
        raise ValueError(f"retta non riconosciuta: {latex!r}")
    slope = {"": F(1), "-": F(-1)}.get(m.group(1))
    if slope is None:
        slope = num(m.group(1))
        if abs(slope) == 1:
            raise ValueError("coefficiente 1 scritto")
    k = F(0) if m.group(2) is None else num(m.group(3)) * (1 if m.group(2) == "+" else -1)
    if m.group(2) is not None and k == 0:
        raise ValueError("termine noto zero scritto")
    return slope, k


def check(sample):
    errs = []
    lvl = sample["level"]
    p = sample.get("params", {})
    prompt, problem = sample["prompt"], sample["problem"]
    if not sample.get("steps"):
        errs.append("mancano i passaggi")
    kind = None

    if lvl in (1, 2, 6):
        xs, ys, n, P, A, B = read_pairs(problem, errs)
        if p.get("xs") != [str(x) for x in xs] or p.get("ys") != [str(y) for y in ys]:
            errs.append("params diversi dal testo")
        kind = f"{n} coppie"
        if lvl == 1:
            if prompt != "Calcola la covarianza.":
                errs.append("consegna inattesa")
            cov = P / n
            check_number_choice(sample, cov, errs, [P])
        elif lvl == 2:
            if "coefficiente angolare della retta di regressione di y rispetto a x" not in prompt:
                errs.append("consegna inattesa")
            m = P / A
            d = finite_digits(m)
            if d is None or d > 2 or abs(m) == 1:
                errs.append("m con più di due decimali, oppure 1 o -1")
            check_number_choice(sample, m, errs, [P / n])
        else:
            if prompt != "Calcola il coefficiente di correlazione lineare, arrotondato al centesimo.":
                errs.append("consegna inattesa")
            mag, exact = sqrt_round100(F(P * P, A * B))
            if exact:
                errs.append("r esatto: non va arrotondato")
            if not F(20, 100) <= mag <= F(98, 100):
                errs.append("r fuori da 0,20..0,98")
            right = mag if P > 0 else -mag
            kind = "positivo" if P > 0 else "negativo"
            check_number_choice(sample, right, errs, [-right], digits=2, lo=F(-1), hi=F(1))
            if "\\approx" not in sample["solution"]:
                errs.append("manca ≈ nella soluzione")
        if p.get("case") != kind:
            errs.append("caso sbagliato")

    elif lvl == 3:
        mx, my, sx, cov = given(problem, r"\bar{x}"), given(problem, r"\bar{y}"), given(problem, r"\sigma_x"), given(problem, r"\sigma_{xy}")
        if not (2 <= sx <= 5 and sx.denominator == 1 and 2 <= mx <= 12 and 5 <= my <= 40):
            errs.append("indici fuori dai limiti")
        m = cov / (sx * sx)
        k = my - m * mx
        if abs(m) not in SLOPES or k == 0 or k == m:
            errs.append("m non previsto, oppure q nullo o uguale a m")
        kind = "m positivo" if m > 0 else "m negativo"
        if kind != p.get("case"):
            errs.append("caso sbagliato")
        ch = sample["answer"]
        if sample.get("choice") != ch:
            errs.append("la scelta multipla deve essere la risposta")
        if check_choice_shape(ch, errs):
            lines = [read_line(o["latex"]) for o in ch["options"]]
            for o, l in zip(ch["options"], lines):
                if [frac(v) for v in o["values"]] != list(l):
                    errs.append(f"opzione {o['latex']} con valori {o['values']}")
            if lines[ch["correct"]] != (m, k):
                errs.append("la retta giusta non è l'opzione giusta")
            if sum(1 for l in lines if l == (m, k)) != 1:
                errs.append("retta giusta ripetuta")
            bad = cov / sx
            wrong = [(bad, my - bad * mx), (m, my + m * mx)]
            for w in wrong:
                if all(finite_digits(v) is not None and finite_digits(v) <= 2 for v in w) and w != (m, k) and w not in lines:
                    errs.append(f"manca il distrattore {w}")

    elif lvl == 4:
        mx, my, vx, cov = given(problem, r"\bar{x}"), given(problem, r"\bar{y}"), given(problem, r"\sigma_x^2"), given(problem, r"\sigma_{xy}")
        m0 = re.fullmatch(r"Stima il valore di y per x = (\d+) con la retta di regressione di y rispetto a x\.", prompt)
        if not m0:
            errs.append("consegna inattesa")
            return errs, kind
        x0 = int(m0.group(1))
        if vx not in (4, 5, 8, 10, 16, 20, 25) or not (4 <= mx <= 20 and 10 <= my <= 60) or not 1 <= abs(x0 - mx) <= 4:
            errs.append("indici fuori dai limiti")
        m = cov / vx
        k = my - m * mx
        est = m * x0 + k
        if abs(m) not in SLOPES or k == 0 or est <= 0:
            errs.append("m non previsto, q nullo o stima non positiva")
        kind = "m positivo" if m > 0 else "m negativo"
        if kind != p.get("case"):
            errs.append("caso sbagliato")
        check_number_choice(sample, est, errs, [m * x0, my + m * x0])

    elif lvl == 5:
        cov = given(problem, r"\sigma_{xy}")
        if r"\sigma_x^2" in problem:
            kind = "varianze"
            vx, vy = given(problem, r"\sigma_x^2"), given(problem, r"\sigma_y^2")
            sx, sy = F(isqrt(int(vx))), F(isqrt(int(vy)))
            if sx * sx != vx or sy * sy != vy:
                errs.append("varianze non quadrati perfetti")
        else:
            kind = "scarti"
            sx, sy = given(problem, r"\sigma_x"), given(problem, r"\sigma_y")
        if kind != p.get("case"):
            errs.append("caso sbagliato")
        if not (2 <= sx <= 6 and 2 <= sy <= 6) or sx == sy:
            errs.append("scarti quadratici medi fuori dai limiti o uguali")
        r = cov / (sx * sy)
        if abs(r) not in RS:
            errs.append("r non previsto")
        if prompt != "Calcola il coefficiente di correlazione lineare.":
            errs.append("consegna inattesa")
        check_number_choice(sample, r, errs, [-r], lo=F(-1), hi=F(1))

    elif lvl == 7:
        r = given(problem, "r")
        if not re.search(r"r = -?\d\{,\}\d\d \\end\{array\}$", problem):
            errs.append("r va scritto con due decimali")
        if r >= F(80, 100) and r <= F(98, 100):
            kind, want = "positiva", "cresce"
        elif -F(98, 100) <= r <= -F(80, 100):
            kind, want = "negativa", "diminuisce"
        elif abs(r) <= F(9, 100):
            kind, want = "nulla", "nessun legame lineare"
        else:
            errs.append("r fuori dagli intervalli previsti")
            return errs, kind
        if kind != p.get("case"):
            errs.append("caso sbagliato")
        ch = sample["answer"]
        if sample.get("choice") != ch:
            errs.append("la scelta multipla deve essere la risposta")
        if check_choice_shape(ch, errs):
            if {o["values"][0] for o in ch["options"]} != STATEMENTS:
                errs.append("le quattro affermazioni non sono quelle previste")
            if ch["options"][ch["correct"]]["values"][0] != want:
                errs.append(f"affermazione giusta: {want}")
            texts = {"cresce": "in genere cresce", "diminuisce": "in genere diminuisce", "nessun legame lineare": "un legame lineare", "causa": "la causa di"}
            for o in ch["options"]:
                if texts.get(o["values"][0], "?") not in o["latex"]:
                    errs.append(f"opzione {o['values'][0]} con un testo diverso")
    else:
        errs.append(f"livello sconosciuto {lvl}")
    return errs, kind
