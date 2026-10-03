"""Checker for inf-funzioni-logiche (specs/exercises/inf-funzioni-logiche.md).

Written from the spec, not from the generator. The sheet and the formula are read back from the problem, the
formula is parsed and evaluated by the small evaluator of _inf_foglio_dati (Italian function names, `;` between
arguments), and the result is compared with the answer:
- level 1: the two cells and their numbers come from the prose; each option is a single comparison, evaluated; one
  option only gives the logical value asked;
- levels 2, 3, 4: the formula in the cell named by the prose is a SE (plain, nested, with E/O/NON) on the row of
  that cell; its value picks the option;
- levels 5, 6: a CONTA.SE or a SOMMA.SE on the six data rows, whose value is the number answer; or four formulas as
  options, one of which gives the number asked.
"""
import re

from checkers._inf_foglio_dati import check_choice, check_number, common, evaluate, option_value, parse_formula, parse_problem, plain, shape, shown, value_of

CASE_RANGES = {
    1: {"vero": (0.40, 0.60), "falso": (0.40, 0.60)},
    3: {"decrescente": (0.32, 0.48), "crescente": (0.32, 0.48), "trappola": (0.13, 0.27)},
    5: {"formula": (0.25, 0.45)},
    6: {"formula": (0.25, 0.45)},
}

CMP_OPS = ("=", "<>", "<", "<=", ">", ">=")


def level1(sample, items, errs):
    if shape(items) != ["text"]:
        errs.append("level 1 is prose only")
        return None
    m = re.fullmatch(r"In un foglio di calcolo la cella ([A-E]\d) contiene (\d+) e la cella ([A-E]\d) contiene (\d+)\. Quale di queste formule dà come risultato (VERO|FALSO)\?", plain(items[0][1]))
    if not m:
        errs.append(f"level 1 text not recognised: {items[0][1]!r}")
        return None
    cells = {m.group(1): int(m.group(2)), m.group(3): int(m.group(4))}
    if len(cells) != 2 or not all(2 <= v <= 12 for v in cells.values()):
        errs.append(f"cells {cells}: two different cells with numbers from 2 to 12 expected")
    want = m.group(5) == "VERO"

    def value(o):
        kind, f = option_value(o)
        if kind != "formula":
            raise ValueError("option is not a formula")
        e = parse_formula(f)
        if e[0] != "cmp" or e[1] not in CMP_OPS or e[2][0] != "ref" or e[3][0] not in ("ref", "num"):
            raise ValueError("option is not one comparison of a cell with a cell or a number")
        return evaluate(e, cells)

    check_choice(sample["answer"], lambda o: value(o) is want, errs)
    if sample.get("solution") != sample["answer"]["options"][sample["answer"]["correct"]]["latex"]:
        errs.append("solution is not the right option")
    return "vero" if want else "falso"


def se_problem(sample, items, errs, rows):
    """The common layout of levels 2-4. Returns (sheet, parsed formula, row of the formula) or None."""
    if shape(items) != ["text", "sheet", "text", "formula", "text"]:
        errs.append(f"layout {shape(items)}")
        return None
    sheet = items[1][1]
    if len(sheet.rows) != rows:
        errs.append(f"{len(sheet.rows)} data rows, expected {rows}")
    m1 = re.fullmatch(r"Nella cella ([A-E])(\d) c'è la formula", plain(items[2][1]))
    m2 = re.fullmatch(r"Che cosa compare nella cella ([A-E]\d)\?", plain(items[4][1]))
    if not m1 or not m2 or m1.group(1) + m1.group(2) != m2.group(1):
        errs.append("the cell of the formula is not named, or named in two ways")
        return None
    row = int(m1.group(2))
    if not 2 <= row <= rows + 1:
        errs.append(f"formula in row {row}, outside the table")
    if m1.group(1) != "ABCDE"[len(sheet.header)]:
        errs.append("the formula is not in the first free column")
    formula = items[3][1]
    e = parse_formula(formula)
    refs = set(re.findall(r"[A-E]\d+", re.sub(r'"[^"]*"', "", formula)))
    if not refs or any(int(r[1:]) != row for r in refs):
        errs.append(f"the formula reads cells {sorted(refs)} outside its own row {row}")
    if e[0] != "call" or e[1] != "SE":
        errs.append("the formula is not a SE")
        return None
    return sheet, e, row


def answer_by_value(sample, sheet, e, errs):
    right = shown(evaluate(e, sheet.cells))
    check_choice(sample["answer"], lambda o: option_value(o) == right, errs)
    ans = sample["answer"]
    if ans.get("kind") == "choice" and sample.get("solution") != ans["options"][ans["correct"]]["latex"]:
        errs.append("solution is not the right option")
    return right


def level2(sample, items, errs):
    got = se_problem(sample, items, errs, 4)
    if not got:
        return None
    sheet, e, _ = got
    cond = e[2][0]
    if cond[0] != "cmp" or cond[1] not in ("<", "<=", ">", ">=") or cond[2][0] != "ref" or cond[3][0] != "num":
        errs.append("the condition is not a cell compared with a threshold")
        return None
    if any(a[0] == "call" for a in e[2][1:]):
        errs.append("level 2 has no nested function")
    right = answer_by_value(sample, sheet, e, errs)
    truth = evaluate(cond, sheet.cells)
    then_v, else_v = evaluate(e[2][1], sheet.cells), evaluate(e[2][2], sheet.cells)
    if then_v == else_v:
        errs.append("the two branches give the same value")
    labels = {option_value(o) for o in sample["answer"]["options"]}
    if labels != {shown(then_v), shown(else_v), ("text", "VERO"), ("text", "FALSO")}:
        errs.append(f"options {labels}: the two branches, VERO and FALSO expected")
    return f"{'numero' if right[0] == 'num' else 'testo'}-{'vero' if truth else 'falso'}"


def level3(sample, items, errs):
    got = se_problem(sample, items, errs, 3)
    if not got:
        return None
    sheet, e, _ = got
    c1, a, inner = e[2]
    if inner[0] != "call" or inner[1] != "SE" or a[0] != "str":
        errs.append("level 3 is SE(condition; text; SE(...))")
        return None
    c2, b, c = inner[2]
    if b[0] != "str" or c[0] != "str" or len({a[1], b[1], c[1]}) != 3:
        errs.append("three different labels expected")
    for cond in (c1, c2):
        if cond[0] != "cmp" or cond[2][0] != "ref" or cond[3][0] != "num":
            errs.append("a condition is not a cell compared with a threshold")
            return None
    if c1[2] != c2[2] or c1[1] != c2[1] or c1[3][1] == c2[3][1]:
        errs.append("the two conditions must read the same cell with the same operator and different thresholds")
    answer_by_value(sample, sheet, e, errs)
    labels = {option_value(o) for o in sample["answer"]["options"]}
    if labels != {("text", a[1]), ("text", b[1]), ("text", c[1]), ("text", "VERO")}:
        errs.append(f"options {labels}: the three labels and VERO expected")
    t1, t2 = c1[3][1], c2[3][1]
    if c1[1] == ">=":
        return "decrescente" if t1 > t2 else "trappola"
    if c1[1] == "<" and t1 < t2:
        return "crescente"
    errs.append(f"thresholds {t1}, {t2} with {c1[1]}: not one of the three shapes of the spec")
    return None


def level4(sample, items, errs):
    got = se_problem(sample, items, errs, 4)
    if not got:
        return None
    sheet, e, _ = got
    if len(sheet.header) != 3:
        errs.append("level 4 needs two columns of numbers")
    cond, a, b = e[2]
    if cond[0] != "call" or cond[1] not in ("E", "O", "NON") or a[0] != "str" or b[0] != "str" or a[1] == b[1]:
        errs.append("level 4 is SE(E/O/NON(...); text; text)")
        return None
    n = len(cond[2])
    if (cond[1] == "NON" and n != 1) or (cond[1] != "NON" and n != 2):
        errs.append(f"{cond[1]} with {n} conditions")
    for c in cond[2]:
        if c[0] != "cmp" or c[2][0] != "ref" or c[3][0] != "num":
            errs.append("a condition is not a cell compared with a threshold")
            return None
    answer_by_value(sample, sheet, e, errs)
    labels = {option_value(o) for o in sample["answer"]["options"]}
    if labels != {("text", a[1]), ("text", b[1]), ("text", "VERO"), ("text", "FALSO")}:
        errs.append(f"options {labels}: the two labels, VERO and FALSO expected")
    truth = evaluate(cond, sheet.cells)
    kind = cond[1]
    if kind == "E" and cond[2][0][2] == cond[2][1][2]:
        kind = "intervallo"
        lo, hi = cond[2][0], cond[2][1]
        if lo[1] != ">=" or hi[1] != "<=" or not lo[3][1] < hi[3][1]:
            errs.append("an interval is E(cell>=a;cell<=b) with a < b")
    return f"{kind}-{'vero' if truth else 'falso'}"


def level56(sample, items, errs, fn):
    if shape(items)[:2] != ["text", "sheet"]:
        errs.append(f"layout {shape(items)}")
        return None
    sheet = items[1][1]
    if len(sheet.rows) != 6 or len(sheet.header) != 3:
        errs.append("a table of six rows and three columns expected")
        return None
    if not all(isinstance(r[1], str) and isinstance(r[2], int) and r[2] >= 0 for r in sheet.rows):
        errs.append("column B must hold texts and column C non-negative whole numbers")
        return None

    def well_formed(f, allowed):
        e = parse_formula(f)
        if e[0] != "call" or e[1] not in allowed:
            raise ValueError(f"formula {f} is not one of {allowed}")
        for a in e[2]:
            if a[0] == "range" and (a[1], a[2]) not in (("B2", "B7"), ("C2", "C7")):
                raise ValueError(f"range {a[1]}:{a[2]} is not a whole column of the table")
        if e[1] == "SOMMA.SE" and (e[2][-1] if len(e[2]) == 3 else e[2][0])[1:] != ("C2", "C7"):
            raise ValueError("SOMMA.SE must sum column C")
        return e

    rest = items[2:]
    if shape(rest) == ["text", "formula", "text"]:
        m1 = re.fullmatch(r"Nella cella (C9) c'è la formula", plain(rest[0][1]))
        m2 = re.fullmatch(r"Quale numero compare nella cella (C9)\?", plain(rest[2][1]))
        if not m1 or not m2:
            errs.append("the cell of the formula must be C9, below the table")
            return None
        e = well_formed(rest[1][1], (fn,))
        v = shown(evaluate(e, sheet.cells))
        if v[0] != "num":
            errs.append("the formula does not give a number")
            return None
        check_number(sample, v[1], errs)
        return "valore-testo" if e[2][0][1:] == ("B2", "B7") else "valore-numero"
    if shape(rest) == ["text"]:
        m = re.fullmatch(r"Quale di queste formule dà come risultato (\d+)\?", plain(rest[0][1]))
        if not m:
            errs.append(f"question not recognised: {rest[0][1]!r}")
            return None
        target = int(m.group(1))
        allowed = ("CONTA.SE",) if fn == "CONTA.SE" else ("SOMMA.SE", "CONTA.SE", "SOMMA")
        results = []

        def value(o):
            kind, f = option_value(o)
            if kind != "formula":
                raise ValueError("option is not a formula")
            v = evaluate(well_formed(f, allowed), sheet.cells)
            results.append(v)
            return v == target

        check_choice(sample["answer"], value, errs)
        if len(set(results)) != len(results):
            errs.append(f"two formulas give the same result: {results}")
        ans = sample["answer"]
        if ans.get("kind") == "choice" and sample.get("solution") != ans["options"][ans["correct"]]["latex"]:
            errs.append("solution is not the right option")
        return "formula"
    errs.append(f"layout {shape(items)}")
    return None


def check(sample):
    errs = []
    common(sample, errs)
    try:
        items = parse_problem(sample["problem"])
    except ValueError as e:
        return errs + [f"problem unreadable: {e}"], None
    lvl = sample["level"]
    kind = None
    if lvl == 1:
        kind = level1(sample, items, errs)
    elif lvl == 2:
        kind = level2(sample, items, errs)
    elif lvl == 3:
        kind = level3(sample, items, errs)
    elif lvl == 4:
        kind = level4(sample, items, errs)
    elif lvl == 5:
        kind = level56(sample, items, errs, "CONTA.SE")
    elif lvl == 6:
        kind = level56(sample, items, errs, "SOMMA.SE")
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
