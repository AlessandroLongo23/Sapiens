"""Checker for distribuzioni-doppie, from specs/exercises/distribuzioni-doppie.md.

The table is read back from the problem LaTeX and the cell or the line the question is about from the
prompt (the labels of the table appear in it). Totals, percentages, conditional means, theoretical
frequencies and contingencies are recomputed with Fractions.
"""
import re
from fractions import Fraction as F

from checkers._bivariata import array_rows, body_lines, check_number_choice, finite_digits, frac, round_to, text_of

CASE_RANGES = {
    1: {"riga": (0.40, 0.60), "colonna": (0.40, 0.60)},
    3: {"esatta": (0.50, 0.70), "arrotondata": (0.30, 0.50)},
    5: {"intera": (0.30, 0.50), "con la virgola": (0.50, 0.70)},
    6: {"positiva": (0.30, 0.50), "negativa": (0.30, 0.50), "zero": (0.12, 0.28)},
}

N_PERCENT = {20, 25, 40, 50, 100}
N_THEORY = {20, 25, 30, 40, 50, 60, 80, 100}
LABELS = {
    ("centro", "periferia"): {"a piedi", "autobus", "moto"},
    ("3A", "3B"): {"mare", "monti", "lago"},
    ("biennio", "triennio"): {"calcio", "basket", "nuoto"},
}


def has(label, text):
    return re.search(r"(?<!\w)" + re.escape(label) + r"(?!\w)", text) is not None


def read_table(problem, totals, errs):
    """Row labels, column labels and cells of the two-way table; the totals shown are checked and dropped."""
    spec, rows = array_rows(body_lines(problem)[-1])
    head, body = rows[0], rows[1:]
    if head[0] != "":
        errs.append("la prima casella dell'intestazione non è vuota")
    cols = [text_of(c) for c in head[1:]]
    labels = [text_of(r[0]) for r in body]
    cells = [[int(c) for c in r[1:]] for r in body]
    if totals:
        if cols[-1] != "tot." or labels[-1] != "tot.":
            errs.append("mancano i totali")
        cols, labels = cols[:-1], labels[:-1]
        shown_col, shown_row = cells[-1], [r[-1] for r in cells[:-1]]
        cells = [r[:-1] for r in cells[:-1]]
        if shown_row != [sum(r) for r in cells]:
            errs.append("totali di riga sbagliati")
        if shown_col != [sum(c) for c in zip(*cells)] + [sum(map(sum, cells))]:
            errs.append("totali di colonna sbagliati")
        if spec != "l|" + "c" * len(cols) + "|c":
            errs.append("colonne della tabella")
    elif "tot." in cols or "tot." in labels:
        errs.append("totali non attesi")
    if len(labels) != 2 or len(cols) not in (2, 3) or any(len(r) != len(cols) for r in cells):
        errs.append("servono due righe e due o tre colonne")
    if tuple(labels) not in LABELS or not set(cols) <= LABELS.get(tuple(labels), set()):
        errs.append("modalità non previste")
    if any(c < 1 for r in cells for c in r):
        errs.append("casella vuota o negativa")
    return labels, cols, cells


def same_params(p, labels, cols, cells, errs):
    if p.get("rows") != labels or p.get("cols") != cols or p.get("cells") != [[str(c) for c in r] for r in cells]:
        errs.append("params diversi dalla tabella del testo")


def check(sample):
    errs = []
    lvl = sample["level"]
    p = sample.get("params", {})
    prompt = sample["prompt"]
    if not sample.get("steps"):
        errs.append("mancano i passaggi")
    kind = None

    if lvl == 4:
        spec, rows = array_rows(body_lines(sample["problem"])[-1])
        head, body = rows[0], rows[1:]
        if text_of(head[0]) != "voto" or text_of(head[-1]) != "tot.":
            errs.append("intestazione della tabella dei voti")
        ys = [int(c) for c in head[1:-1]]
        if len(ys) != 4 or ys != list(range(ys[0], ys[0] + 4)) or not 4 <= ys[0] <= 6:
            errs.append("servono quattro voti consecutivi a partire da 4, 5 o 6")
        labels = [text_of(r[0]) for r in body]
        cells = [[int(c) for c in r[1:-1]] for r in body]
        tots = [int(r[-1]) for r in body]
        if len(labels) != 2 or tots != [sum(r) for r in cells]:
            errs.append("servono due righe con i totali giusti")
        if not set(tots) <= {5, 8, 10, 20} or tots[0] == tots[1]:
            errs.append("totali di riga non ammessi")
        found = [i for i, l in enumerate(labels) if has(l, prompt)]
        if len(found) != 1:
            errs.append("la domanda non indica una riga sola")
            return errs, kind
        i = found[0]
        if not prompt.startswith("Calcola il voto medio"):
            errs.append("consegna inattesa")
        sums = [sum(y * f for y, f in zip(ys, r)) for r in cells]
        mean = F(sums[i], tots[i])
        d = finite_digits(mean)
        if d is None or d > 2:
            errs.append("media con più di due decimali")
        if F(sums[1 - i], tots[1 - i]) == mean:
            errs.append("le due righe hanno la stessa media")
        if sum(1 for f in cells[i] if f > 0) < 3:
            errs.append("riga con meno di tre voti presenti")
        must = [F(sum(sums), sum(tots)), F(sums[i], sum(tots))]
        must = [m for m in must if finite_digits(m) is not None and finite_digits(m) <= 2]
        check_number_choice(sample, mean, errs, must, lo=F(0))
        if p.get("cells") != [[str(c) for c in r] for r in cells] or p.get("target") != i:
            errs.append("params diversi dal testo")
        return errs, p.get("case")

    labels, cols, cells = read_table(sample["problem"], lvl != 1, errs)
    same_params(p, labels, cols, cells, errs)
    rt = [sum(r) for r in cells]
    ct = [sum(c) for c in zip(*cells)]
    n = sum(rt)
    in_rows = [i for i, l in enumerate(labels) if has(l, prompt)]
    in_cols = [j for j, l in enumerate(cols) if has(l, prompt)]

    if lvl == 1:
        flat = [c for r in cells for c in r]
        if not all(2 <= c <= 18 for c in flat) or len(set(flat)) != len(flat):
            errs.append("caselle da 2 a 18, tutte diverse")
        if len(set(rt + ct)) != len(rt + ct):
            errs.append("due totali uguali")
        if len(in_rows) + len(in_cols) != 1 or not prompt.startswith("Quanti studenti in tutto"):
            errs.append("la domanda non indica una sola riga o colonna")
            return errs, kind
        kind = "riga" if in_rows else "colonna"
        right = rt[in_rows[0]] if in_rows else ct[in_cols[0]]
        if kind != p.get("case"):
            errs.append("caso sbagliato")
        check_number_choice(sample, F(right), errs, [F(n)], lo=F(0))
        return errs, kind

    if len(in_rows) != 1 or len(in_cols) != 1:
        errs.append("la domanda non indica una casella sola")
        return errs, kind
    i, j = in_rows[0], in_cols[0]
    f = cells[i][j]
    if p.get("target") != [i, j]:
        errs.append("params.target diverso dalla domanda")
    if rt[0] == rt[1]:
        errs.append("righe con lo stesso totale")
    theory = F(rt[i] * ct[j], n)

    if lvl == 2:
        if n not in N_PERCENT:
            errs.append("totale non ammesso")
        if not prompt.startswith("Che percentuale di tutti gli studenti"):
            errs.append("consegna inattesa")
        right = F(100 * f, n)
        if finite_digits(right) is None or finite_digits(right) > 1:
            errs.append("percentuale con più di un decimale")
        must = [round_to(F(100 * f, rt[i]), 1), round_to(F(100 * f, ct[j]), 1)]
        check_number_choice(sample, right, errs, must, percent=True, lo=F(0), hi=F(100))
        kind = f"{len(cols)} colonne"

    elif lvl == 3:
        if n not in N_PERCENT:
            errs.append("totale non ammesso")
        m = re.fullmatch(r"Tra chi (.+), che percentuale (.+)\?( Arrotonda al decimo\.)?", prompt)
        if not m:
            errs.append("consegna inattesa")
            return errs, kind
        given_row = has(labels[i], m.group(1))
        if given_row == has(cols[j], m.group(1)):
            errs.append("non si capisce il gruppo della domanda")
        T, other = (rt[i], ct[j]) if given_row else (ct[j], rt[i])
        if (p.get("direction") == "riga") != given_row:
            errs.append("params.direction diverso dalla domanda")
        exact = F(100 * f, T)
        d = finite_digits(exact)
        kind = "esatta" if d is not None and d <= 1 else "arrotondata"
        if kind != p.get("case"):
            errs.append("caso sbagliato")
        if bool(m.group(3)) != (kind == "arrotondata"):
            errs.append("la consegna chiede l'arrotondamento solo quando serve")
        if T < 8 or exact == 100:
            errs.append("gruppo troppo piccolo o percentuale 100")
        right = exact if kind == "esatta" else round_to(exact, 1)
        check_number_choice(sample, right, errs, [F(100 * f, n)], percent=True, digits=1 if kind == "arrotondata" else None, lo=F(0), hi=F(100))
        if (kind == "arrotondata") != ("\\approx" in sample["solution"]):
            errs.append("≈ nella soluzione solo se arrotondata")

    elif lvl == 5:
        if n not in N_THEORY:
            errs.append("totale non ammesso")
        if not re.search(r"frequenza teorica di indipendenza della casella \((.+), (.+)\)\.$", prompt):
            errs.append("consegna inattesa")
        d = finite_digits(theory)
        if d is None or d > 2:
            errs.append("frequenza teorica con più di due decimali")
        if theory == f:
            errs.append("frequenza teorica uguale a quella osservata")
        kind = "intera" if theory.denominator == 1 else "con la virgola"
        if kind != p.get("case"):
            errs.append("caso sbagliato")
        must = [F(f)] + ([round_to(theory, 0)] if kind == "con la virgola" else [])
        check_number_choice(sample, theory, errs, must, lo=F(0))

    elif lvl == 6:
        if not re.search(r"contingenza della casella \((.+), (.+)\)\.$", prompt):
            errs.append("consegna inattesa")
        cont = f - theory
        d = finite_digits(cont)
        if d is None or d > 2:
            errs.append("contingenza con più di due decimali")
        kind = "positiva" if cont > 0 else "negativa" if cont < 0 else "zero"
        if kind != p.get("case"):
            errs.append("caso sbagliato")
        if kind == "zero":
            if any(F(rt[a] * ct[b], n) != cells[a][b] for a in range(2) for b in range(len(cols))):
                errs.append("contingenza zero in una tabella non indipendente")
        elif n not in N_THEORY:
            errs.append("totale non ammesso")
        check_number_choice(sample, cont, errs, [-cont, theory] if cont != 0 else [theory])
    else:
        errs.append(f"livello sconosciuto {lvl}")
    return errs, kind
