"""Checker for inf-esadecimale, from specs/exercises/inf-esadecimale.md.

The number is read from the problem and converted again with int(x, base) and format(); the tables of the solution
(weights, divisions by 16, groups of bits) are read back and checked.
"""
import re

from checkers._inf_basi import (
    array_rows,
    base_option_is,
    check_choice,
    check_number_answer,
    common,
    distinct_values,
    division_rows,
    num_tex,
    parse_num,
    prose_and_extra,
)

CASE_RANGES = {5: {"ott-dec": (0.25, 0.42), "bin-ott": (0.25, 0.42), "ott-bin": (0.25, 0.42)}}

COMPONENTS = {"rossa": 0, "verde": 1, "blu": 2}


def canonical(sample, base, errs):
    digits, b = parse_num(sample["problem"])
    if b != base or num_tex(digits, b) != sample["problem"] or digits[0] == "0":
        errs.append(f"problem is not a canonical number in base {base}")
    return digits


def cell_digits(cells):
    return "".join(re.sub(r"\\mathrm\{([A-F])\}", r"\1", c) for c in cells)


def choice_answer(sample, value, base, errs):
    check_choice(sample["answer"], base_option_is(value, base), errs, "answer")
    distinct_values(sample["answer"], base, errs)
    if sample.get("choice") is not None and sample["choice"] != sample["answer"]:
        errs.append("choice differs from the answer")


def hex_to_dec(sample, errs):
    digits = canonical(sample, 16, errs)
    n = int(digits, 16)
    if not 16 <= n <= 4095:
        errs.append(f"{n} out of range")
    check_number_answer(sample, n, errs)
    if sample["solution"] != f"{sample['problem']} = {n}_{{10}}":
        errs.append("solution is not number = value")
    k = len(digits)
    table = next((array_rows(s) for s in sample["steps"] if "\\begin{array}" in s), None)
    if not table or table[0] != [str(16 ** (k - 1 - i)) for i in range(k)] or cell_digits(table[1]) != digits:
        errs.append("weights table wrong")
    products = " + ".join(f"{int(c, 16)} \\cdot {16 ** (k - 1 - i)}" for i, c in enumerate(digits))
    if products not in sample["steps"][-1] or f"= {n}\\text{{.}}" not in sample["steps"][-1]:
        errs.append("products or sum wrong in the last step")
    letters = sorted(set(c for c in digits if c in "ABCDEF"))
    for c in letters:
        if f"\\mathrm{{{c}}} = {int(c, 16)}" not in sample["steps"][0]:
            errs.append(f"value of {c} not given")


def dec_to_hex(sample, errs):
    if not re.fullmatch(r"[1-9]\d*", sample["problem"]):
        errs.append("problem is not a decimal number")
        return
    n = int(sample["problem"])
    if not 26 <= n <= 4095:
        errs.append(f"{n} out of range")
    hexs = format(n, "X")
    choice_answer(sample, n, 16, errs)
    if sample["solution"] != f"{n}_{{10}} = {num_tex(hexs, 16)}":
        errs.append("solution is not value = hexadecimal")
    rems = division_rows(sample["steps"][1], 16, errs)
    if rems is not None and "".join(format(r, "X") for r in reversed(rems)) != hexs:
        errs.append("remainders do not give the number")
    if num_tex(hexs, 16) not in sample["steps"][-1]:
        errs.append("result not in the last step")


def groups_ok(rows, bits_row, digit_row, size, base, value, errs):
    gs, ds = rows[bits_row], rows[digit_row]
    if any(not re.fullmatch(rf"[01]{{{size}}}", g) for g in gs) or len(gs) != len(ds):
        errs.append("groups table malformed")
        return
    digits = cell_digits(ds)
    if any(int(g, 2) != int(d, base) for g, d in zip(gs, digits)):
        errs.append("a group does not match its digit")
    if int("".join(gs), 2) != value or int(digits, base) != value:
        errs.append("groups do not give the number")
    if len(gs) > 1 and gs[0] == "0" * size:
        errs.append("a whole group of zeros on the left")


def bin_to_hex(sample, errs):
    digits = canonical(sample, 2, errs)
    n = int(digits, 2)
    if not 5 <= len(digits) <= 12:
        errs.append("need 5 to 12 bits")
    choice_answer(sample, n, 16, errs)
    if sample["solution"] != f"{sample['problem']} = {num_tex(format(n, 'X'), 16)}":
        errs.append("solution wrong")
    rows = array_rows(sample["steps"][1])
    if not rows or len(rows) != 2:
        errs.append("no groups table")
    else:
        groups_ok(rows, 0, 1, 4, 16, n, errs)


def hex_to_bin(sample, errs):
    digits = canonical(sample, 16, errs)
    n = int(digits, 16)
    if not 16 <= n <= 4095:
        errs.append(f"{n} out of range")
    choice_answer(sample, n, 2, errs)
    if sample["solution"] != f"{sample['problem']} = {num_tex(format(n, 'b'), 2)}":
        errs.append("solution wrong")
    rows = array_rows(sample["steps"][1])
    if not rows or len(rows) != 2:
        errs.append("no groups table")
    else:
        groups_ok(rows, 1, 0, 4, 16, n, errs)
    zeros = 4 * len(digits) - len(format(n, "b"))
    if (zeros > 0) != ("togli" in sample["steps"][2]):
        errs.append("leading zeros: the step does not say what happens")


def octal(sample, errs):
    prompt = sample["prompt"]
    digits, base = parse_num(sample["problem"])
    if num_tex(digits, base) != sample["problem"] or digits[0] == "0":
        errs.append("problem is not canonical")
    n = int(digits, base)
    if not 9 <= n <= 511:
        errs.append(f"{n} out of range")
    octs, bits = format(n, "o"), format(n, "b")
    if base == 8 and prompt == "Converti in base dieci.":
        check_number_answer(sample, n, errs)
        rows = array_rows(sample["steps"][1])
        k = len(digits)
        if rows != [[str(8 ** (k - 1 - i)) for i in range(k)], list(digits)]:
            errs.append("weights table wrong")
        if f"= {n}\\text{{.}}" not in sample["steps"][-1]:
            errs.append("sum wrong")
        return "ott-dec"
    if base == 2 and prompt == "Converti in ottale.":
        choice_answer(sample, n, 8, errs)
        if sample["solution"] != f"{sample['problem']} = {num_tex(octs, 8)}":
            errs.append("solution wrong")
        rows = array_rows(sample["steps"][2])
        if not rows or len(rows) != 2:
            errs.append("no groups table")
        else:
            groups_ok(rows, 0, 1, 3, 8, n, errs)
        return "bin-ott"
    if base == 8 and prompt == "Converti in binario.":
        choice_answer(sample, n, 2, errs)
        if sample["solution"] != f"{sample['problem']} = {num_tex(bits, 2)}":
            errs.append("solution wrong")
        rows = array_rows(sample["steps"][1])
        if not rows or len(rows) != 2:
            errs.append("no groups table")
        else:
            groups_ok(rows, 1, 0, 3, 8, n, errs)
        return "ott-bin"
    errs.append("prompt and problem do not match a case")
    return None


def colour(sample, errs):
    prose, extra = prose_and_extra(sample["problem"])
    m = re.fullmatch(r"Nel colore \$\\texttt\{\\#([0-9A-F]{6})\}\$ quanto vale la componente (rossa|verde|blu)\?", prose)
    if not m or extra:
        errs.append(f"text not recognised: {prose!r}")
        return
    code, k = m.group(1), COMPONENTS[m.group(2)]
    pairs = [code[0:2], code[2:4], code[4:6]]
    values = [int(p, 16) for p in pairs]
    if len(set(values)) != 3:
        errs.append("two components are the same")
    check_number_answer(sample, values[k], errs)
    if sample["solution"] != f"{num_tex(pairs[k], 16)} = {values[k]}":
        errs.append("solution wrong")
    hi, lo = int(pairs[k][0], 16), int(pairs[k][1], 16)
    if f"{hi} \\cdot 16 + {lo} = {values[k]}" not in sample["steps"][-1]:
        errs.append("conversion step wrong")
    where = ["sta nelle prime due cifre", "sta nelle due cifre centrali", "sta nelle ultime due cifre"][k]
    if where not in sample["steps"][0]:
        errs.append("the step points to the wrong digits")


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample["level"]
    kind = None
    if lvl == 1:
        hex_to_dec(sample, errs)
    elif lvl == 2:
        dec_to_hex(sample, errs)
    elif lvl == 3:
        bin_to_hex(sample, errs)
    elif lvl == 4:
        hex_to_bin(sample, errs)
    elif lvl == 5:
        kind = octal(sample, errs)
    elif lvl == 6:
        colour(sample, errs)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
