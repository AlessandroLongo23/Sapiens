"""Checker for inf-riferimenti-celle, "Riferimenti relativi e assoluti" (specs/exercises/inf-riferimenti-celle.md).

Written from the spec and the lesson, with the spreadsheet of _inf_foglio.py. Everything is read back from the page:
- levels 1-4: the cell, its formula and the cell it is copied to; the copy is done here (only the parts of a
  reference without a dollar move) and compared with the options; the references are checked against the level;
- level 5: the table is parsed, the formula of B1 is copied down to the asked cell and evaluated there;
- level 6: each option is copied into every cell of the area to fill and must point, in each of them, to the cells
  the text asks for; exactly one option does.
"""
import re
from fractions import Fraction

from checkers._inf_foglio import (
    SheetError,
    address,
    check_code_options,
    check_number_answer,
    col_index,
    common,
    copy_formula,
    decimals,
    evaluate,
    parse,
    parse_num,
    parse_ref,
    range_cells,
    read_problem,
    refs_of,
    sheet_matches_params,
    walk,
)

CASE_RANGES = {
    5: {"bloccato": (0.55, 0.85), "non bloccato": (0.15, 0.45)},
    6: {"colonna": (0.30, 0.50), "riga": (0.20, 0.40), "tabellina": (0.20, 0.40)},
}

CELL = r"`([A-Z]\d+)`"


def dollars(ref):
    return int(ref[2]) + int(ref[3])


def copy_level(sample, prose, tables, errs):
    lvl = sample["level"]
    m = re.fullmatch(
        CELL.join([r"La cella ", r" contiene la formula `(=[^`]+)`\. (La trascini fino alla cella|La copi e la incolli nella cella) ", r"\. Che formula compare in ", r"\?"]),
        prose,
    )
    if not m or tables:
        errs.append(f"text not recognised: {prose!r}")
        return
    source, formula, how, target, again = m.groups()
    if target != again:
        errs.append("the question asks about another cell")
    s, t = parse_ref(source), parse_ref(target)
    d_col, d_row = t[0] - s[0], t[1] - s[1]
    if (d_col, d_row) == (0, 0):
        errs.append("the formula is not moved")
    if how.startswith("La trascini") and d_col != 0 and d_row != 0:
        errs.append("a drag stays in the row or in the column")
    tree = parse(formula)
    if {n[0] for n in walk(tree)} & {"call", "name", "range", "neg"}:
        errs.append("only cells, numbers, operations and brackets")
    refs = refs_of(tree)
    if any((c, r) == (s[0], s[1]) for c, r, _, _ in refs):
        errs.append("the formula refers to its own cell")
    expected = copy_formula(formula, d_col, d_row)
    if expected is None:
        errs.append("a reference leaves the sheet")
        return
    if expected == formula:
        errs.append("the copy does not change the formula")
    if any((c, r) == (t[0], t[1]) for c, r, _, _ in refs_of(parse(expected))):
        errs.append("the copied formula refers to its own cell")
    if lvl == 1 and (d_col != 0 or d_row == 0):
        errs.append("level 1: the copy stays in its column")
    if lvl == 2 and d_col == 0:
        errs.append("level 2: the copy changes column")
    if lvl <= 2 and any(dollars(r) for r in refs):
        errs.append("levels 1 and 2: relative references only")
    if lvl == 3 and not (any(dollars(r) == 2 for r in refs) and any(dollars(r) == 0 for r in refs) and all(dollars(r) != 1 for r in refs)):
        errs.append("level 3: one absolute reference, at least one relative, none mixed")
    if lvl == 4 and not (any(dollars(r) == 1 for r in refs) and d_col != 0 and d_row != 0):
        errs.append("level 4: a mixed reference and a copy that changes row and column")
    p = sample["params"]
    if (p.get("source"), p.get("formula"), p.get("target")) != (source, formula, target):
        errs.append("params do not match the page")
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        errs.append("answer must be a choice")
        return
    for o in ans["options"]:
        try:
            parse(o["values"][0])
        except ValueError as e:
            errs.append(f"option is not a formula: {e}")
    check_code_options(ans, expected, errs)
    if sample.get("solution") != ans["options"][ans["correct"]]["latex"]:
        errs.append("solution is not the right option")


def level5(sample, prose, tables, errs):
    m = re.fullmatch(
        r"Nella colonna `A` ci sono (.+), e nella cella `([A-Z]\d+)` c'è (.+)\. La formula di `B1` viene copiata nelle celle da `B2` a `B(\d+)`\. Che valore mostra `B(\d+)`\?",
        prose,
    )
    if not m or len(tables) != 1:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    fixed, last, k = m.group(2), int(m.group(4)), int(m.group(5))
    sheet, n_cols, n_rows = tables[0]
    if not sheet_matches_params(sheet, sample["params"].get("sheet", {})):
        errs.append("params.sheet does not match the table")
    if n_rows != last or not 3 <= last <= 5 or not 2 <= k <= last:
        errs.append("rows of the table, of the copy and of the question do not agree")
    expected_cells = {f"A{r}" for r in range(1, last + 1)} | {"B1", fixed}
    if set(sheet) != expected_cells or fixed[0] in "AB":
        errs.append(f"cells of the table {sorted(sheet)}: expected column A, B1 and {fixed}")
        return None
    data = [sheet[f"A{r}"] for r in range(1, last + 1)]
    if any(not isinstance(v, Fraction) or v.denominator != 1 or not 2 <= v <= 40 for v in data) or len(set(data)) != len(data):
        errs.append("column A: different whole numbers from 2 to 40")
    f = sheet["B1"]
    fm = re.fullmatch(r"=A1([*/])(\$?[A-Z]\$?\d+)", f) if isinstance(f, str) else None
    if not fm or address(*parse_ref(fm.group(2))[:2]) != fixed or not isinstance(sheet[fixed], Fraction):
        errs.append(f"B1 must be A1 times or divided by the cell {fixed}")
        return None
    copied = copy_formula(f, 0, k - 1)
    moved = parse_ref(copied.split(fm.group(1))[1])
    stays = address(moved[0], moved[1]) == fixed
    if fm.group(1) == "/" and not stays:
        errs.append("a division by a cell that moves away gives #DIV/0!, not a number")
        return None
    try:
        value = evaluate(copied, sheet)
    except SheetError as e:
        errs.append(f"the copied formula gives {e.name}")
        return None
    if decimals(value) is None or decimals(value) > 2:
        errs.append(f"value {value} with more than two decimals")
    if not stays and value != 0:
        errs.append("a factor that moves to an empty cell gives 0")
    check_number_answer(sample, value, errs)
    if any(o["values"][0].startswith("-") for o in sample["choice"]["options"]):
        errs.append("negative option")
    return "bloccato" if stays else "non bloccato"


def works(option, cells, wanted, op):
    """The option is `=ref op ref` and, copied from the first cell into each cell, points to what `wanted` says."""
    m = re.fullmatch(r"=(\$?[A-Z]\$?\d+)([-+*/])(\$?[A-Z]\$?\d+)", option)
    if not m or m.group(2) != op:
        return False
    first = parse_ref(cells[0])
    for a in cells:
        c, r, _, _ = parse_ref(a)
        copied = copy_formula(option, c - first[0], r - first[1])
        if copied is None:
            return False
        got = [(x[0], x[1]) for x in refs_of(parse(copied))]
        if got != wanted(c, r):
            return False
    return True


def level6(sample, prose, tables, errs):
    if tables:
        errs.append("level 6 has no table")
    line = re.fullmatch(
        r"Nelle celle da `([A-Z]\d+)` a `([A-Z]\d+)` ci sono (?:dei|delle) [a-zà]+, e nella cella `([A-Z]\d+)` c'è un(?:'| )[a-z ]+\. In `([A-Z]\d+)` vuoi una formula da copiare fino a `([A-Z]\d+)`: "
        r"ogni cella deve (moltiplicare|dividere) il valore della sua (riga|colonna) per `([A-Z]\d+)`\. Quale formula scrivi in `([A-Z]\d+)`\?",
        prose,
    )
    table = re.fullmatch(
        r"Nelle celle da `([A-Z]\d+)` a `([A-Z]\d+)` ci sono dei numeri, e altri numeri nelle celle da `([A-Z]\d+)` a `([A-Z]\d+)`\. In `([A-Z]\d+)` vuoi una formula da copiare in tutte le celle da `([A-Z]\d+)` a `([A-Z]\d+)`: "
        r"ogni cella deve (moltiplicare|sommare) il numero della sua riga che sta nella colonna `([A-Z])` (per il|e il) numero della sua colonna che sta nella riga \$(\d+)\$\. Quale formula scrivi in `([A-Z]\d+)`\?",
        prose,
    )
    if line:
        d1, d2, fixed, first, last, verb, along, fixed2, first2 = line.groups()
        if fixed != fixed2 or first != first2:
            errs.append("the text names two different cells for the same thing")
        a, b, f, l, x = (parse_ref(s) for s in (d1, d2, first, last, fixed))
        op = "*" if verb == "moltiplicare" else "/"
        cells = range_cells(f, l)
        if along == "riga":
            # a column of data, the formulas in the column next to it, copied down
            if not (a[0] == b[0] and f[0] == l[0] == a[0] + 1 and (a[1], b[1]) == (f[1], l[1]) and b[1] - a[1] >= 2):
                errs.append("the data and the formulas are not two columns side by side with the same rows")
            wanted = lambda c, r: [(a[0], r), (x[0], x[1])]  # noqa: E731
            kind = "colonna"
        else:
            if not (a[1] == b[1] and f[1] == l[1] == a[1] + 1 and (a[0], b[0]) == (f[0], l[0]) and b[0] - a[0] >= 2):
                errs.append("the data and the formulas are not two rows one under the other with the same columns")
            wanted = lambda c, r: [(c, a[1]), (x[0], x[1])]  # noqa: E731
            kind = "riga"
        if fixed in cells or fixed in range_cells(a, b):
            errs.append("the fixed cell is inside the data or the formulas")
    elif table:
        r1, r2, c1, c2, first, first2, last, verb, col, joiner, row, first3 = table.groups()
        if not first == first2 == first3 or (verb == "moltiplicare") != (joiner == "per il"):
            errs.append("the text is not consistent")
        a, b, c, d, f, l = (parse_ref(s) for s in (r1, r2, c1, c2, first, last))
        hc, hr = col_index(col), int(row)
        op = "*" if verb == "moltiplicare" else "+"
        cells = range_cells(f, l)
        if not (a[0] == b[0] == hc and c[1] == d[1] == hr and f == (hc + 1, hr + 1, False, False) and (a[1], b[1]) == (f[1], l[1]) and (c[0], d[0]) == (f[0], l[0]) and l[0] > f[0] and l[1] > f[1]):
            errs.append("the two headers and the area to fill do not make a table")
        wanted = lambda cc, rr: [(hc, rr), (cc, hr)]  # noqa: E731
        kind = "tabellina"
    else:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        errs.append("answer must be a choice")
        return kind
    good = [o["values"][0] for o in ans["options"] if works(o["values"][0], cells, wanted, op)]
    if len(good) != 1:
        errs.append(f"{len(good)} options work in every cell: {good}")
        return kind
    check_code_options(ans, good[0], errs)
    if sample.get("solution") != ans["options"][ans["correct"]]["latex"]:
        errs.append("solution is not the right option")
    return kind


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose, tables = read_problem(sample["problem"])
    lvl = sample["level"]
    kind = None
    if lvl in (1, 2, 3, 4):
        copy_level(sample, prose, tables, errs)
    elif lvl == 5:
        kind = level5(sample, prose, tables, errs)
    elif lvl == 6:
        kind = level6(sample, prose, tables, errs)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
