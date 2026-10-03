"""Checker for inf-analisi-dati (specs/exercises/inf-analisi-dati.md).

Written from the spec, not from the generator. The sheet is read back from the problem, the operation (a sort on one
or two levels, a filter, two filters, subtotals, a pivot table) is read from the prose and carried out here on the
rows, and the result is compared with the answer: the label in a cell, a row number, a count, a sum.
"""
import re

from checkers._inf_foglio_dati import check_choice, check_number, common, option_value, parse_problem, plain, shape

CASE_RANGES = {
    1: {"cella": (0.45, 0.65), "riga": (0.35, 0.55)},
    2: {"cella": (0.45, 0.65), "riga": (0.35, 0.55)},
    5: {"somma": (0.45, 0.65), "conteggio": (0.17, 0.33), "totale": (0.13, 0.27)},
    6: {"incrocio": (0.38, 0.58), "totale-riga": (0.18, 0.36), "totale-colonna": (0.18, 0.36)},
}

ORDERS = {
    "in ordine crescente": ("num", False),
    "in ordine decrescente": ("num", True),
    "in ordine alfabetico dalla A alla Z": ("text", False),
    "in ordine alfabetico dalla Z alla A": ("text", True),
}
NUM_OPS = {
    "maggiore di": lambda a, b: a > b,
    "minore di": lambda a, b: a < b,
    "maggiore o uguale a": lambda a, b: a >= b,
    "minore o uguale a": lambda a, b: a <= b,
}
OPS = "maggiore o uguale a|minore o uguale a|maggiore di|minore di|uguale a|diverso da"
HOW_MANY = r"Quante righe di dati restano visibili, senza contare l'intestazione\?"


def sort_rows(rows, keys):
    """A stable sort on (column, descending) keys, the first being the most important."""
    out = list(rows)
    for col, desc in reversed(keys):
        out.sort(key=lambda r: r[col], reverse=desc)
    return out


def key_of(sheet, letter, name, order, errs):
    col = "ABC".index(letter)
    if sheet.header[col] != name:
        errs.append(f"column {letter} is {sheet.header[col]!r}, the text says {name!r}")
    if order not in ORDERS:
        errs.append(f"order {order!r} not recognised")
        return None
    kind, desc = ORDERS[order]
    if (kind == "num") != isinstance(sheet.rows[0][col], int):
        errs.append(f"{order} on a column of the other kind")
    return (col, desc)


def table_ok(sheet, n, errs, distinct_labels=True):
    rows = sheet.rows
    if len(rows) != n or len(sheet.header) != 3:
        errs.append(f"{len(rows)} rows of {len(sheet.header)} columns, expected {n} of 3")
        return False
    if not all(isinstance(r[0], str) and isinstance(r[1], str) and isinstance(r[2], int) for r in rows):
        errs.append("columns A and B must hold texts, column C numbers")
        return False
    if distinct_labels:
        if len({r[0] for r in rows}) != n:
            errs.append("two rows with the same label in column A")
        if len({r[2] for r in rows}) != n:
            errs.append("two rows with the same number in column C")
        if len({r[1] for r in rows}) != 3:
            errs.append("three groups expected in column B")
    return True


def sorting(sample, sheet, text, errs, level):
    if level == 1:
        m = re.fullmatch(r"Si ordina la tabella secondo la colonna ([ABC]) \((.+?)\), (in ordine [^.;]+)\. Dopo l'ordinamento, (.+)", text)
        if not m:
            errs.append(f"level 1 text not recognised: {text!r}")
            return None
        keys = [key_of(sheet, m.group(1), m.group(2), m.group(3), errs)]
        question = m.group(4)
    else:
        m = re.fullmatch(r"Si ordina la tabella su due livelli: prima secondo la colonna (B) \((.+?)\), (in ordine [^.;]+); poi secondo la colonna ([AC]) \((.+?)\), (in ordine [^.;]+)\. Dopo l'ordinamento, (.+)", text)
        if not m:
            errs.append(f"level 2 text not recognised: {text!r}")
            return None
        keys = [key_of(sheet, m.group(1), m.group(2), m.group(3), errs), key_of(sheet, m.group(4), m.group(5), m.group(6), errs)]
        question = m.group(7)
    if None in keys:
        return None
    rows = sheet.rows
    done = sort_rows(rows, keys)
    forgot = sort_rows(rows, keys[-1:]) if level == 2 else rows
    why = "the first level is forgotten" if level == 2 else "the table is not sorted"
    m = re.fullmatch(r"che cosa c'è nella cella A(\d)\?", question)
    if m:
        pos = int(m.group(1)) - 2
        if not 0 <= pos < len(rows):
            errs.append("the cell asked is outside the table")
            return None
        right = done[pos][0]
        if forgot[pos][0] == right:
            errs.append(f"the answer does not change when {why}")
        labels = {r[0] for r in rows}

        def is_right(o):
            kind, label = option_value(o)
            if kind != "text" or label not in labels:
                raise ValueError("option is not a label of column A")
            return label == right

        check_choice(sample["answer"], is_right, errs)
        return "cella"
    m = re.fullmatch(r"in quale riga del foglio si trova (\w+)\?", question)
    if m:
        where = [i for i, r in enumerate(done) if r[0] == m.group(1)]
        if len(where) != 1:
            errs.append(f"{m.group(1)} is not one row of the table")
            return None
        if [i for i, r in enumerate(forgot) if r[0] == m.group(1)] == where:
            errs.append(f"the answer does not change when {why}")
        check_number(sample, where[0] + 2, errs)
        return "riga"
    errs.append(f"question not recognised: {question!r}")
    return None


def condition(sheet, name, op, value, errs):
    """A test on a row, from 'Punti è maggiore di 12' or 'Classe è uguale a 1B'."""
    if name not in sheet.header[1:]:
        errs.append(f"no column named {name!r} to filter")
        return None
    col = sheet.header.index(name)
    if op in NUM_OPS:
        if col != 2 or not re.fullmatch(r"\d+", value):
            errs.append(f"{op} needs the number column and a number")
            return None
        n = int(value)
        values = sorted(r[2] for r in sheet.rows)
        if n not in values[1:-1]:
            errs.append(f"threshold {n} is not a value of the table (the smallest and the largest excluded)")
        return lambda r: NUM_OPS[op](r[2], n)
    if col != 1 or value not in {r[1] for r in sheet.rows}:
        errs.append(f"{op} needs the group column and one of its groups")
        return None
    return (lambda r: r[1] == value) if op == "uguale a" else (lambda r: r[1] != value)


def level3(sample, sheet, text, errs):
    m = re.fullmatch(rf"Si applica un filtro che mostra solo le righe in cui (.+?) è ({OPS}) (\S+)\. ({HOW_MANY}|Quale di queste righe resta visibile\?)", text)
    if not m:
        errs.append(f"level 3 text not recognised: {text!r}")
        return None
    test = condition(sheet, m.group(1), m.group(2), m.group(3), errs)
    if test is None:
        return None
    visible = [r for r in sheet.rows if test(r)]
    if m.group(4).startswith("Quante"):
        check_number(sample, len(visible), errs)
        return "quante"
    labels = {r[0] for r in sheet.rows}
    seen = {r[0] for r in visible}

    def is_right(o):
        kind, label = option_value(o)
        if kind != "text" or label not in labels:
            raise ValueError("option is not a label of column A")
        return label in seen

    check_choice(sample["answer"], is_right, errs)
    return "quale"


def level4(sample, sheet, text, errs):
    m = re.fullmatch(rf"Si applicano due filtri insieme: (.+?) è (uguale a) (\S+) e (.+?) è ({OPS}) (\d+)\. {HOW_MANY}", text)
    if not m:
        errs.append(f"level 4 text not recognised: {text!r}")
        return None
    a = condition(sheet, m.group(1), m.group(2), m.group(3), errs)
    b = condition(sheet, m.group(4), m.group(5), m.group(6), errs)
    if a is None or b is None:
        return None
    if m.group(5) not in NUM_OPS:
        errs.append("the second filter must be on the numbers")
    both = [r for r in sheet.rows if a(r) and b(r)]
    if len(both) in (sum(1 for r in sheet.rows if a(r)), sum(1 for r in sheet.rows if b(r))):
        errs.append("one of the two filters does not change the result")
    check_number(sample, len(both), errs)
    return "nessuna" if not both else "alcune"


def level5(sample, sheet, text, errs):
    m = re.fullmatch(
        r"Si ordina la tabella secondo la colonna B \((.+?)\) e si inseriscono i subtotali, che a ogni cambio di (.+?) calcolano (la somma della colonna C \((.+?)\)|il conteggio delle righe)\. (Quanto vale il subtotale del gruppo (\S+)\?|Quanto vale il totale complessivo, in fondo alla tabella\?)",
        text,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {text!r}")
        return None
    if m.group(1) != sheet.header[1] or m.group(2) != sheet.header[1] or (m.group(4) and m.group(4) != sheet.header[2]):
        errs.append("the columns named in the text are not those of the table")
    count = m.group(3).startswith("il conteggio")
    group = m.group(6)
    if group is None:
        rows = sheet.rows
        kind = "totale"
    else:
        rows = [r for r in sheet.rows if r[1] == group]
        if not rows:
            errs.append(f"no row in group {group}")
            return None
        kind = "conteggio" if count else "somma"
    check_number(sample, len(rows) if count else sum(r[2] for r in rows), errs)
    return kind


def level6(sample, sheet, text, errs):
    m = re.fullmatch(
        r"Dal foglio si costruisce una tabella pivot con (.+?) nelle righe, (.+?) nelle colonne e la somma di (.+?) nei valori\. (?:Quale numero c'è all'incrocio tra la riga (\S+) e la colonna (\S+)\?|Quale numero c'è nel totale della riga (\S+)\?|Quale numero c'è nel totale della colonna (\S+)\?)",
        text,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {text!r}")
        return None
    if [m.group(1), m.group(2), m.group(3)] != sheet.header:
        errs.append("rows, columns and values of the pivot are not columns A, B, C")
    rows = sheet.rows
    a_values, b_values = {r[0] for r in rows}, {r[1] for r in rows}
    if len(a_values) != 2 or len(b_values) != 3 or len({(r[0], r[1]) for r in rows}) != 6:
        errs.append("two values in column A, three in column B and all six combinations expected")
    if m.group(4):
        a, b, kind = m.group(4), m.group(5), "incrocio"
    elif m.group(6):
        a, b, kind = m.group(6), None, "totale-riga"
    else:
        a, b, kind = None, m.group(7), "totale-colonna"
    if (a is not None and a not in a_values) or (b is not None and b not in b_values):
        errs.append("the row or the column asked is not in the table")
        return None
    picked = [r for r in rows if (a is None or r[0] == a) and (b is None or r[1] == b)]
    check_number(sample, sum(r[2] for r in picked), errs)
    return kind


ROWS = {1: 5, 2: 6, 3: 6, 4: 7, 5: 7, 6: 8}


def check(sample):
    errs = []
    common(sample, errs)
    try:
        items = parse_problem(sample["problem"])
    except ValueError as e:
        return errs + [f"problem unreadable: {e}"], None
    lvl = sample["level"]
    if lvl not in ROWS:
        return errs + [f"unknown level {lvl}"], None
    if shape(items) != ["text", "sheet", "text"]:
        return errs + [f"layout {shape(items)}"], None
    sheet = items[1][1]
    if not table_ok(sheet, ROWS[lvl], errs, distinct_labels=lvl != 6):
        return errs, None
    text = plain(items[2][1])
    if lvl in (1, 2):
        kind = sorting(sample, sheet, text, errs, lvl)
    elif lvl == 3:
        kind = level3(sample, sheet, text, errs)
    elif lvl == 4:
        kind = level4(sample, sheet, text, errs)
    elif lvl == 5:
        kind = level5(sample, sheet, text, errs)
    else:
        kind = level6(sample, sheet, text, errs)
    ans = sample["answer"]
    if ans.get("kind") == "choice" and sample.get("solution") != ans["options"][ans["correct"]]["latex"]:
        errs.append("solution is not the right option")
    return errs, kind
