"""Checker for inf-binario-decimale, from specs/exercises/inf-binario-decimale.md.

The number is read from the problem and converted again with int(x, 2) and format(n, "b"); the tables of the
solution (weights, successive divisions, powers of two subtracted) are read back and checked row by row.
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
)

CASE_RANGES = {5: {"bit-necessari": (0.50, 0.70), "massimo": (0.12, 0.28), "quanti": (0.12, 0.28)}}


def to_decimal(sample, errs):
    lvl = sample["level"]
    digits, base = parse_num(sample["problem"])
    if base != 2 or num_tex(digits, 2) != sample["problem"] or digits[0] != "1":
        errs.append("problem is not a canonical binary number")
    n = int(digits, 2)
    lo, hi = (8, 127) if lvl == 1 else (128, 1023)
    if not lo <= n <= hi:
        errs.append(f"{n} outside {lo}..{hi}")
    if digits.count("1") < 2:
        errs.append("fewer than two ones")
    check_number_answer(sample, n, errs)
    if sample["solution"] != f"{sample['problem']} = {n}_{{10}}":
        errs.append("solution is not number = value")
    rows = array_rows(sample["steps"][1])
    weights = [str(2 ** (len(digits) - 1 - k)) for k in range(len(digits))]
    if rows != [weights, list(digits)]:
        errs.append("weights table wrong")
    m = re.search(r"\}([\d +]+) = (\d+)\\text\{\.\}$", sample["steps"][-1])
    used = [2 ** (len(digits) - 1 - k) for k, c in enumerate(digits) if c == "1"]
    if not m or [int(x) for x in m.group(1).split(" + ")] != used or int(m.group(2)) != n:
        errs.append("sum of the weights wrong")


def to_binary(sample, errs):
    lvl = sample["level"]
    if not re.fullmatch(r"[1-9]\d*", sample["problem"]):
        errs.append("problem is not a decimal number")
        return
    n = int(sample["problem"])
    lo, hi = (8, 127) if lvl == 3 else (128, 1023)
    if not lo <= n <= hi:
        errs.append(f"{n} outside {lo}..{hi}")
    bits = format(n, "b")
    check_choice(sample["answer"], base_option_is(n, 2), errs, "answer")
    distinct_values(sample["answer"], 2, errs)
    if sample.get("choice") is not None and sample["choice"] != sample["answer"]:
        errs.append("choice differs from the answer")
    if sample["solution"] != f"{n}_{{10}} = {num_tex(bits, 2)}":
        errs.append("solution is not value = binary")
    steps = sample["steps"]
    if lvl == 3:
        rems = division_rows(steps[1], 2, errs)
        if rems is not None:
            if "".join(str(r) for r in reversed(rems)) != bits:
                errs.append("remainders do not give the number")
            if "\\ ".join(str(r) for r in reversed(rems)) not in steps[2]:
                errs.append("remainders not listed from the bottom")
    else:
        walk = re.findall(r"(\d+)\\text\{ (sì, resta \}(\d+)|no)", steps[1])
        rest, got = n, ""
        for w, what, left in walk:
            w = int(w)
            if what == "no":
                if w <= rest:
                    errs.append(f"{w} fits in {rest} but is skipped")
                got += "0"
            else:
                if w > rest or int(left) != rest - w:
                    errs.append(f"wrong subtraction at {w}")
                rest -= w
                got += "1"
        if [int(w) for w, _, _ in walk] != [2 ** (len(bits) - 1 - k) for k in range(len(bits))]:
            errs.append("powers of two not all listed, largest first")
        if got != bits or rest != 0:
            errs.append("the walk along the powers does not give the number")
    if num_tex(bits, 2) not in steps[-2]:
        errs.append("the result is not in the steps")
    used = " + ".join(str(2 ** (len(bits) - 1 - k)) for k, c in enumerate(bits) if c == "1")
    if f"{used} = {n}" not in steps[-1]:
        errs.append("final check with the weights wrong")


def how_many(sample, errs):
    prompt, problem = sample["prompt"], sample["problem"]
    if prompt.startswith("Quanti bit servono"):
        n = int(problem)
        if not 5 <= n <= 1023:
            errs.append(f"{n} out of range")
        k = len(format(n, "b"))
        if not (2 ** (k - 1) <= n <= 2**k - 1):
            errs.append("bit count wrong")
        check_number_answer(sample, k, errs)
        return "bit-necessari"
    m = re.fullmatch(r"(\d+)\\ \\text\{bit\}", problem)
    if not m or not 2 <= int(m.group(1)) <= 10:
        errs.append("problem is not a number of bits from 2 to 10")
        return None
    n = int(m.group(1))
    if prompt.startswith("Qual è il numero più grande"):
        check_number_answer(sample, int("1" * n, 2), errs)
        return "massimo"
    if prompt.startswith("Quanti numeri diversi"):
        check_number_answer(sample, len(range(int("1" * n, 2) + 1)), errs)
        return "quanti"
    errs.append("prompt not recognised")
    return None


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample["level"]
    kind = None
    if lvl in (1, 2):
        to_decimal(sample, errs)
    elif lvl in (3, 4):
        to_binary(sample, errs)
    elif lvl == 5:
        kind = how_many(sample, errs)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
