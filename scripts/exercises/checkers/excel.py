"""Checker for excel, "Celle, valori e formule" (specs/exercises/excel.md).

Written from the spec and the lesson, with the spreadsheet of _inf_foglio.py (its own parser and evaluator on exact
fractions). The sheet and the formula are read back from the page, not from params:
- level 1: the range is read from the question; the cells are counted, or the options are tested one by one;
- levels 2-4: the table and the formula are parsed and the value recomputed; the shape of the formula is checked
  against the level (two cells; no brackets, with the wrong reading orders giving another value; brackets or powers
  that change the value);
- level 5: the formulas of the table are evaluated before and after the change;
- level 6: the formula is put in its cell and evaluated: the error it raises is the answer.
"""
import re
from fractions import Fraction

from checkers._inf_foglio import (
    ERROR_NAMES,
    Evaluator,
    SheetError,
    check_code_options,
    check_number_answer,
    common,
    decimals,
    evaluate,
    flat_value,
    parse,
    parse_num,
    parse_ref,
    range_cells,
    read_problem,
    refs_of,
    sheet_matches_params,
    walk,
    address,
)

CASE_RANGES = {
    1: {"conta": (0.40, 0.60), "appartiene": (0.40, 0.60)},
    5: {"catena": (0.38, 0.62), "totale": (0.38, 0.62)},
    6: {k: (0.18, 0.32) for k in ["div0", "valore", "nome", "circolare"]},
}

GRID = [f"{c}{r}" for c in "ABC" for r in (1, 2, 3)]


def level1(sample, prose, tables, errs):
    if tables:
        errs.append("level 1 has no table")
    m = re.fullmatch(r"(Quante celle contiene l'intervallo|Quale di queste celle appartiene all'intervallo) `([A-Z]\d+):([A-Z]\d+)`\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    a, b = parse_ref(m.group(2)), parse_ref(m.group(3))
    cells = range_cells(a, b)
    if a[0] > b[0] or a[1] > b[1] or len(cells) < 2 or b[0] > 8 or b[1] > 17:
        errs.append(f"range {m.group(2)}:{m.group(3)} outside the spec")
    if m.group(1).startswith("Quante"):
        check_number_answer(sample, Fraction(len(cells)), errs, positive_whole=True)
        return "conta"
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        errs.append("answer must be a choice")
        return "appartiene"
    for o in ans["options"]:
        if not re.fullmatch(r"[A-Z]\d+", o["values"][0]):
            errs.append(f"option {o['values']} is not an address")
            return "appartiene"
    inside = [o["values"][0] for o in ans["options"] if o["values"][0] in cells]
    if len(inside) != 1:
        errs.append(f"{len(inside)} options inside the range")
        return "appartiene"
    check_code_options(ans, inside[0], errs)
    if sample.get("solution") != "\\texttt{" + inside[0] + "}":
        errs.append("solution is not the cell inside")
    return "appartiene"


def value_level(sample, prose, tables, errs):
    lvl = sample["level"]
    m = re.fullmatch(r"In un foglio di calcolo ci sono questi numeri\. Nella cella `([A-Z]\d+)` scrivi la formula `(=[^`]+)`\. Che valore mostra la cella\?", prose)
    if not m or len(tables) != 1:
        errs.append(f"text not recognised: {prose!r}")
        return
    target, formula = m.group(1), m.group(2)
    sheet, n_cols, n_rows = tables[0]
    if (n_cols, n_rows) != (3, 3) or sorted(sheet) != sorted(GRID):
        errs.append("the sheet is not a full 3 x 3 table")
    if any(not isinstance(v, Fraction) or v.denominator != 1 or not 1 <= v <= 12 for v in sheet.values()):
        errs.append("cells must be whole numbers from 1 to 12")
    if not sheet_matches_params(sheet, sample["params"].get("sheet", {})) or sample["params"].get("formula") != formula:
        errs.append("params do not match the page")
    tree = parse(formula)
    refs = refs_of(tree)
    names = {address(c, r) for c, r, _, _ in refs}
    if any(ac or ar for _, _, ac, ar in refs) or not names <= set(GRID) or target in GRID:
        errs.append("references must be plain cells of the table, and the formula outside it")
    if len(names) != len(refs):
        errs.append("a cell is used twice")
    kinds = {n[0] for n in walk(tree)}
    if kinds & {"call", "name", "range", "neg"}:
        errs.append("only cells, numbers, operations and brackets")
    ev = Evaluator(sheet)
    try:
        value = ev.value(tree)
    except SheetError as e:
        errs.append(f"the formula gives {e.name}")
        return
    if any(decimals(x) is None or decimals(x) > 1 for x in ev.trace):
        errs.append(f"an intermediate result has more than one decimal: {ev.trace}")
    if not -50 <= value <= 200:
        errs.append(f"value {value} out of range")
    ops = [n[1] for n in walk(tree) if n[0] == "bin"]
    has_par = "par" in kinds
    ltr = flat_value(formula, sheet)
    rtl = flat_value(formula, sheet, right_to_left=True)
    if lvl == 2:
        if len(refs) != 2 or len(ops) != 1 or ops[0] == "^" or has_par or "num" in kinds:
            errs.append("level 2: two cells and one operation")
    elif lvl == 3:
        if has_par or "^" in ops or "num" in kinds or not 3 <= len(refs) <= 4:
            errs.append("level 3: three or four cells, no brackets, no powers")
        mixed = bool(set(ops) & {"+", "-"}) and bool(set(ops) & {"*", "/"})
        if mixed and ltr == value:
            errs.append("level 3: read from left to right the value is the same")
        if not mixed and rtl == value:
            errs.append("level 3: read from right to left the value is the same")
    elif lvl == 4:
        if not has_par and "^" not in ops:
            errs.append("level 4: brackets or a power")
        for n in walk(tree):
            if n[0] == "bin" and n[1] == "^" and (n[3][0] != "num" or n[3][1] not in (2, 3)):
                errs.append("level 4: exponent 2 or 3")
        if has_par:
            try:
                if evaluate(formula.replace("(", "").replace(")", ""), sheet) == value:
                    errs.append("level 4: without the brackets the value is the same")
            except SheetError:
                errs.append("level 4: without the brackets the formula gives an error")
        if "^" in ops:
            try:
                if evaluate(formula.replace("^", "*"), sheet) == value:
                    errs.append("level 4: with * for ^ the value is the same")
            except SheetError:
                pass
    check_number_answer(sample, value, errs)


def level5(sample, prose, tables, errs):
    m = re.fullmatch(
        r"In questo foglio le celle che cominciano con = contengono formule\. Nella cella `([A-Z]\d+)`, al posto di \$(\d+)\$, scrivi \$(\d+)\$\. Che valore mostra ora la cella `([A-Z]\d+)`\?",
        prose,
    )
    if not m or len(tables) != 1:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    changed, old, new, asked = m.group(1), parse_num(m.group(2)), parse_num(m.group(3)), m.group(4)
    sheet = tables[0][0]
    if not sheet_matches_params(sheet, sample["params"].get("sheet", {})):
        errs.append("params.sheet does not match the table")
    if sheet.get(changed) != old or new == old:
        errs.append("the changed cell must hold the old number, and the new one must differ")
    formulas = {a for a, v in sheet.items() if isinstance(v, str) and v.startswith("=")}
    if asked not in formulas or len(formulas) < 2:
        errs.append("the asked cell must be one of at least two formulas")
    if any(isinstance(v, str) and not v.startswith("=") for v in sheet.values()):
        errs.append("no texts at level 5")
    before = evaluate("=" + asked, sheet)
    after_sheet = dict(sheet)
    after_sheet[changed] = new
    after = evaluate("=" + asked, after_sheet)
    if before == after:
        errs.append("the asked value does not change")
    # the asked formula uses another formula, which uses the changed cell
    used = {address(c, r) for c, r, _, _ in refs_of(parse(sheet[asked]))} if asked in formulas else set()
    middle = [a for a in used & formulas if changed in {address(c, r) for c, r, _, _ in refs_of(parse(sheet[a]))}]
    if not middle:
        errs.append("the asked cell does not depend on the changed one through another formula")
    if after.denominator != 1 or abs(after) > 300:
        errs.append(f"value {after} out of range")
    check_number_answer(sample, after, errs)
    return "totale" if len(formulas) == 4 else "catena"


def level6(sample, prose, tables, errs):
    m = re.fullmatch(r"In un foglio di calcolo ci sono questi dati\. Nella cella `([A-Z]\d+)` scrivi la formula `(=[^`]+)`\. Quale errore segnala il foglio\?", prose)
    if not m or len(tables) != 1:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    target, formula = m.group(1), m.group(2)
    sheet = dict(tables[0][0])
    if not sheet_matches_params(sheet, sample["params"].get("sheet", {})) or sample["params"].get("formula") != formula:
        errs.append("params do not match the page")
    if target in sheet:
        errs.append("the formula goes in an empty cell")
    sheet[target] = formula
    try:
        v = Evaluator(sheet).cell(target)
        errs.append(f"the formula gives no error: {v}")
        return None
    except SheetError as e:
        name = e.name
    ans = sample["answer"]
    if ans.get("kind") != "choice" or sorted(o["values"][0] for o in ans["options"]) != sorted(ERROR_NAMES):
        errs.append("the options must be the four errors of the lesson")
        return None
    check_code_options(ans, name, errs)
    # one mistake at a time: a formula that divides is only in the division by zero
    if name != "#DIV/0!" and "/" in formula:
        errs.append("a division in a formula with another error")
    return {"#DIV/0!": "div0", "#VALORE!": "valore", "#NOME?": "nome", "riferimento circolare": "circolare"}[name]


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose, tables = read_problem(sample["problem"])
    lvl = sample["level"]
    kind = None
    if lvl == 1:
        kind = level1(sample, prose, tables, errs)
    elif lvl in (2, 3, 4):
        value_level(sample, prose, tables, errs)
    elif lvl == 5:
        kind = level5(sample, prose, tables, errs)
    elif lvl == 6:
        kind = level6(sample, prose, tables, errs)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
