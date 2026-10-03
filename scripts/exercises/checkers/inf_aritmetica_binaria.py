"""Checker for inf-aritmetica-binaria, from specs/exercises/inf-aritmetica-binaria.md.

The two numbers are read from the problem, added or multiplied as Python integers (int(x, 2)) and written back with
format(n, "b"). The column addition of the solution is checked column by column, carries included; the column
product is checked copy by copy.
"""
import re

from checkers._inf_basi import NUM, array_rows, base_option_is, check_choice, common, distinct_values, num_tex, parse_num

CASE_RANGES = {3: {"trabocca": (0.40, 0.60), "non-trabocca": (0.40, 0.60)}}


def operands(sample, op, errs, canonical=True):
    m = re.fullmatch(rf"({NUM}) {op} ({NUM})", sample["problem"])
    if not m:
        errs.append("problem is not two numbers and an operation")
        return None
    out = []
    for tex in m.groups():
        digits, base = parse_num(tex)
        if base != 2 or num_tex(digits, 2) != tex or (canonical and digits[0] != "1"):
            errs.append(f"{tex} is not a canonical binary number")
        out.append(digits)
    return out


def carry_list(a, b, width):
    c = [0]
    for i in range(width):
        c.append(1 if ((a >> i) & 1) + ((b >> i) & 1) + c[i] >= 2 else 0)
    return c


def has_triple(a, b):
    c = carry_list(a, b, 12)
    return any(c[i] and (a >> i) & 1 and (b >> i) & 1 for i in range(12))


def addition_table(step, a, b, pad, errs):
    """Reads the columns: carries, first addend, second addend, sum; checks each column from the right."""
    rows = array_rows(step)
    if not rows or len(rows) != 4 or rows[2][0] != "+":
        errs.append("addition table not found")
        return
    width = len(rows[0]) - 1
    carry = [1 if c == "\\scriptstyle 1" else 0 if c == "" else None for c in rows[0][1:]]
    if None in carry:
        errs.append("carry row unreadable")
        return

    def number(cells, what):
        s = "".join(cells).strip()
        blanks = len(cells) - len(s)
        if not re.fullmatch(r"[01]+", s) or any(c != "" for c in cells[:blanks]):
            errs.append(f"{what} row unreadable")
            return None
        return s

    ra, rb, rs = number(rows[1][1:], "first"), number(rows[2][1:], "second"), number(rows[3][1:], "sum")
    if None in (ra, rb, rs):
        return
    if int(ra, 2) != a or int(rb, 2) != b or (pad and (len(ra) != pad or len(rb) != pad)):
        errs.append("addends in the table differ from the problem")
    if len(rs) != width:
        errs.append("the sum does not fill the columns")
    # column by column: a_i + b_i + carry in = s_i + 2 * carry out
    cin = 0
    for i in range(width):
        col = width - 1 - i
        ai, bi = (a >> i) & 1, (b >> i) & 1
        if carry[col] != cin:
            errs.append(f"carry into column {i} wrong")
        total = ai + bi + cin
        si = int(rs[len(rs) - 1 - i]) if i < len(rs) else 0
        if si != total % 2:
            errs.append(f"sum digit of column {i} wrong")
        cin = total // 2
    if cin != 0:
        errs.append("a carry leaves the table")
    if int(rs, 2) != a + b:
        errs.append("the sum in the table is wrong")


def binary_answer(sample, value, errs):
    check_choice(sample["answer"], base_option_is(value, 2), errs, "answer")
    distinct_values(sample["answer"], 2, errs)
    if sample.get("choice") is not None and sample["choice"] != sample["answer"]:
        errs.append("choice differs from the answer")
    if sample["solution"] != f"{sample['problem']} = {num_tex(format(value, 'b'), 2)}":
        errs.append("solution is not problem = result")


def addition(sample, errs):
    ops = operands(sample, r"\+", errs)
    if not ops:
        return
    a, b = int(ops[0], 2), int(ops[1], 2)
    lvl = sample["level"]
    if a & b == 0:
        errs.append("no carry in this addition")
    if lvl == 1:
        if not (2 <= a <= 31 and 2 <= b <= 31) or has_triple(a, b):
            errs.append("level 1: addends from 2 to 31, no column 1 + 1 + 1")
    else:
        if not (16 <= a <= 255 and 16 <= b <= 255) or not has_triple(a, b):
            errs.append("level 2: addends from 16 to 255 with a column 1 + 1 + 1")
    binary_answer(sample, a + b, errs)
    addition_table(sample["steps"][1], a, b, 0, errs)
    if f"{a} + {b} = {a + b}" not in sample["steps"][-1]:
        errs.append("decimal check wrong")


def read_register_option(o):
    m = re.fullmatch(r"\\begin\{gathered\} (.+) \\\\ \\text\{(con|senza) traboccamento\} \\end\{gathered\}", o["latex"])
    if not m:
        raise ValueError(f"option {o['latex']!r} unreadable")
    digits, base = parse_num(m.group(1))
    flag = "si" if m.group(2) == "con" else "no"
    if base != 2 or num_tex(digits, 2) != m.group(1) or o["values"] != [digits, flag]:
        raise ValueError(f"option {o['latex']!r}: text and values differ")
    return digits, flag


def overflow(sample, errs):
    m = re.fullmatch(r"Un registro di (4|8) bit somma i due numeri senza segno\. Che cosa contiene alla fine\?", sample["prompt"])
    ops = operands(sample, r"\+", errs, canonical=False)
    if not m or not ops:
        errs.append("prompt or problem not recognised")
        return None
    n = int(m.group(1))
    if any(len(x) != n for x in ops):
        errs.append("addends not written with all the bits of the register")
    a, b = int(ops[0], 2), int(ops[1], 2)
    if a & b == 0:
        errs.append("no carry in this addition")
    s = a + b
    over = s >= 2**n
    kept = format(s % 2**n, "b").rjust(n, "0")
    truth = (kept, "si" if over else "no")
    check_choice(sample["answer"], lambda o: read_register_option(o) == truth, errs, "answer")
    if sample.get("choice") is not None and sample["choice"] != sample["answer"]:
        errs.append("choice differs from the answer")
    opts = sample["answer"]["options"]
    if sample["solution"] != opts[sample["answer"]["correct"]]["latex"]:
        errs.append("solution is not the right option")
    addition_table(sample["steps"][1], a, b, n, errs)
    says_over = "C'è traboccamento" in sample["steps"][2]
    if says_over != over or ("Non c'è traboccamento" in sample["steps"][2]) == over:
        errs.append("the step says the wrong thing about the overflow")
    if num_tex(kept, 2) not in sample["steps"][2]:
        errs.append("the content of the register is not in the step")
    if f"{a} + {b} = {s}" not in sample["steps"][3]:
        errs.append("decimal check wrong")
    if over and f"{s} - {2**n} = {s - 2**n}" not in sample["steps"][3]:
        errs.append("what stays in the register is wrong in decimal")
    return "trabocca" if over else "non-trabocca"


def shift_product(sample, errs):
    ops = operands(sample, r"\\cdot", errs)
    if not ops:
        return
    a, b = int(ops[0], 2), int(ops[1], 2)
    if not re.fullmatch(r"10{1,4}", ops[1]):
        errs.append("multiplier is not 10, 100, 1000 or 10000")
    if not 5 <= a <= 63 or ops[0].count("1") < 2 or a * b > 1023:
        errs.append("multiplicand or product out of range")
    binary_answer(sample, a * b, errs)
    k = len(ops[1]) - 1
    if format(a * b, "b") != ops[0] + "0" * k:
        errs.append("the product is not the multiplicand followed by the zeros")
    if f"2^{k} = {b}" not in sample["steps"][0] or f"{a} \\cdot {b} = {a * b}" not in sample["steps"][-1]:
        errs.append("steps wrong")


def product(sample, errs):
    ops = operands(sample, r"\\cdot", errs)
    if not ops:
        return
    a, b = int(ops[0], 2), int(ops[1], 2)
    if not (5 <= a <= 31 and 5 <= b <= 15) or ops[0].count("1") < 2 or ops[1].count("1") < 2 or a * b > 511:
        errs.append("factors or product out of range")
    binary_answer(sample, a * b, errs)
    rows = array_rows(sample["steps"][2])
    if not rows or any(len(r) != 1 for r in rows):
        errs.append("product column not found")
        return
    cells = [r[0] for r in rows]
    if cells[0] != ops[0] or cells[1] != f"\\cdot\\ {ops[1]}":
        errs.append("factors in the column differ from the problem")
    copies = cells[2:-1]
    expected = [format(a << i, "b") for i in range(len(ops[1])) if (b >> i) & 1]
    if copies != expected:
        errs.append(f"shifted copies {copies} != {expected}")
    if sum(int(c, 2) for c in copies) != a * b or cells[-1] != format(a * b, "b"):
        errs.append("the copies do not add up to the product")
    if f"{a} \\cdot {b} = {a * b}" not in sample["steps"][-1]:
        errs.append("decimal check wrong")


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample["level"]
    kind = None
    if lvl in (1, 2):
        addition(sample, errs)
    elif lvl == 3:
        kind = overflow(sample, errs)
    elif lvl == 4:
        shift_product(sample, errs)
    elif lvl == 5:
        product(sample, errs)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
