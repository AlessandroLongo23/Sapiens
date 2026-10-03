"""Checker for inf-funzioni-foglio, "Le funzioni del foglio di calcolo" (specs/exercises/inf-funzioni-foglio.md).

Written from the spec and the lesson, with the spreadsheet of _inf_foglio.py (its own parser and evaluator on exact
fractions). The table and the formula are read back from the page and the value is recomputed; then the formula is
checked against its level: which functions, what kind of arguments, whether the range holds empty cells or texts,
whether the rounding changes the number.
"""
import re
from fractions import Fraction

from checkers._inf_foglio import (
    Evaluator,
    SheetError,
    address,
    check_number_answer,
    common,
    decimals,
    function_names,
    parse,
    range_cells,
    read_problem,
    refs_of,
    round_half_away,
    sheet_matches_params,
    walk,
)

TEXTS = {"assente", "n.d.", "rinviato"}


def holes_in(sheet, cells):
    return [c for c in cells if not isinstance(sheet.get(c), Fraction)]


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    if len(sample["steps"]) < 2:
        errs.append("at least two steps")
    prose, tables = read_problem(sample["problem"])
    m = re.fullmatch(r"In un foglio di calcolo ci sono questi dati\. Nella cella `([A-Z]\d+)` scrivi la formula `(=[^`]+)`\. Che valore mostra la cella\?", prose)
    if not m or len(tables) != 1:
        return errs + [f"text not recognised: {prose!r}"], None
    target, formula = m.group(1), m.group(2)
    sheet, n_cols, n_rows = tables[0]
    lvl = sample["level"]
    p = sample["params"]
    if not sheet_matches_params(sheet, p.get("sheet", {})) or p.get("formula") != formula:
        errs.append("params do not match the page")
    all_cells = [address(c, r) for c in range(n_cols) for r in range(1, n_rows + 1)]
    if target in all_cells:
        errs.append("the formula goes outside the table")
    tree = parse(formula)
    refs = refs_of(tree)
    if any(ac or ar for _, _, ac, ar in refs) or any(address(c, r) not in all_cells for c, r, _, _ in refs):
        errs.append("references must be plain cells of the table")
    for v in sheet.values():
        if isinstance(v, str) and v not in TEXTS:
            errs.append(f"unexpected text {v!r} in the table")
    names = function_names(tree)
    try:
        value = Evaluator(sheet).value(tree)
    except SheetError as e:
        return errs + [f"the formula gives {e.name}"], None
    if not isinstance(value, Fraction) or decimals(value) is None or decimals(value) > 2:
        return errs + [f"value {value} is not a number with at most two decimals"], None
    holes = holes_in(sheet, all_cells)
    if lvl not in (3, 6) and holes:
        errs.append("empty cells or texts outside levels 3 and 6")
    ranges = [n for n in walk(tree) if n[0] == "range"]
    top = tree if tree[0] == "call" else None
    whole_numbers = all(v.denominator == 1 for v in sheet.values() if isinstance(v, Fraction))
    if lvl in (1, 2, 3):
        allowed = {1: {"SOMMA", "MEDIA"}, 2: {"MIN", "MAX", "CONTA.NUMERI"}, 3: {"SOMMA", "MEDIA", "MIN", "CONTA.NUMERI"}}[lvl]
        if not top or len(names) != 1 or names[0] not in allowed or len(top[2]) != 1 or top[2][0][0] != "range":
            errs.append(f"level {lvl}: one function of {sorted(allowed)} on one range")
        else:
            a, b = top[2][0][1], top[2][0][2]
            cells = range_cells(a, b)
            if (a[0] != b[0] and a[1] != b[1]) or len(cells) < 3:
                errs.append("the range is a piece of a column or of a row, at least three cells")
            inside = holes_in(sheet, cells)
            if lvl == 3 and not (1 <= len(inside) <= 2 and len(cells) >= 4 and len(holes) == len(inside)):
                errs.append("level 3: one or two empty cells or texts, all inside a range of at least four cells")
        if not whole_numbers:
            errs.append("whole numbers only")
    elif lvl == 4:
        if not top or len(names) != 1 or names[0] == "ARROTONDA":
            errs.append("level 4: one function, not ARROTONDA")
        else:
            args = top[2]
            rect = len(args) == 1 and args[0][0] == "range" and args[0][1][0] != args[0][2][0] and args[0][1][1] != args[0][2][1]
            two = len(args) == 2 and all(a[0] == "range" for a in args)
            plus = len(args) == 2 and args[0][0] == "range" and args[1][0] == "num"
            if not (rect or two or plus):
                errs.append("level 4: a rectangle, two ranges, or a range and a number")
            if two and set(range_cells(*args[0][1:])) & set(range_cells(*args[1][1:])):
                errs.append("level 4: the two ranges overlap")
    elif lvl == 5:
        if not top or names != ["ARROTONDA"] or len(top[2]) != 2 or top[2][1][0] != "num" or top[2][1][1] not in (0, 1, 2):
            errs.append("level 5: ARROTONDA with 0, 1 or 2 digits")
        else:
            inner = Evaluator(sheet).value(top[2][0])
            if round_half_away(inner, int(top[2][1][1])) == inner:
                errs.append("level 5: the rounding changes nothing")
            if value != round_half_away(inner, int(top[2][1][1])):
                errs.append("level 5: the value is not the rounded argument")
    elif lvl == 6:
        if len(names) < 2:
            errs.append("level 6: at least two functions")
        for n in walk(tree):
            if n[0] == "call" and n[1] == "ARROTONDA":
                inner = Evaluator(sheet).value(n[2][0])
                if round_half_away(inner, int(n[2][1][1])) == inner:
                    errs.append("level 6: the rounding changes nothing")
        if len(holes) > 1:
            errs.append("level 6: at most one empty cell or text")
    else:
        errs.append(f"unknown level {lvl}")
    if not ranges and lvl != 5:
        errs.append("no range in the formula")
    check_number_answer(sample, value, errs, positive_whole=names == ["CONTA.NUMERI"])
    return errs, None
