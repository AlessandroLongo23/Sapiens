"""Checker for inf-sistemi-posizionali, from specs/exercises/inf-sistemi-posizionali.md.

Everything is read back from the text of the exercise, not from the generator's params: the Roman numeral, the
strings of digits of the options, the underlined digit, the terms of each polynomial form, the number in its base.
The values are recomputed with int(x, base).
"""
import re

from checkers._inf_basi import array_rows, table_index, check_choice, check_number_answer, common, digits_of, num_tex, parse_num

CASE_RANGES = {
    1: {"sottrattivo": (0.50, 0.90), "additivo": (0.10, 0.50)},
    2: {"non-valida": (0.55, 0.78), "valida": (0.22, 0.45)},
}

ROMAN = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
CANONICAL = re.compile(r"M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})")


def roman_value(s):
    total = 0
    for i, c in enumerate(s):
        v = ROMAN[c]
        nxt = ROMAN[s[i + 1]] if i + 1 < len(s) else 0
        total += -v if v < nxt else v
    return total


def level1(sample, errs):
    m = re.fullmatch(r"\\mathrm\{([IVXLCDM]+)\}", sample["problem"])
    if not m:
        errs.append("problem is not a Roman numeral")
        return None
    roman = m.group(1)
    if not CANONICAL.fullmatch(roman):
        errs.append(f"{roman} is not a canonical Roman numeral")
    n = roman_value(roman)
    if not 4 <= n <= 2100 or not 2 <= len(roman) <= 7:
        errs.append(f"{roman} = {n} out of size")
    check_number_answer(sample, n, errs)
    if not sample["solution"].endswith(f"= {n}"):
        errs.append("solution does not end with the value")
    return "sottrattivo" if re.search(r"IV|IX|XL|XC|CD|CM", roman) else "additivo"


def level2(sample, errs):
    m = re.fullmatch(r"Quale di queste scritture (non può|può) essere un numero in base (\d)\?", sample["prompt"])
    if not m:
        errs.append("prompt not recognised")
        return None
    want_invalid, base = m.group(1) == "non può", int(m.group(2))
    if not 2 <= base <= 8:
        errs.append(f"base {base} out of range")

    def is_right(o):
        s = o["latex"]
        if not re.fullmatch(r"[1-9]\d{2,3}", s) or o["values"] != [s]:
            raise ValueError(f"option {s!r} is not a string of 3 or 4 digits")
        valid = all(int(c) < base for c in s)
        return valid != want_invalid

    check_choice(sample["answer"], is_right, errs, "answer")
    if sample.get("choice") is not None and sample["choice"] != sample["answer"]:
        errs.append("choice differs from the answer")
    return "non-valida" if want_invalid else "valida"


def level3(sample, errs):
    m = re.fullmatch(r"(.+?)(?:_(\d))?", sample["problem"])
    body, base = m.group(1), int(m.group(2) or 10)
    u = re.findall(r"\\underline\{(\d)\}", body)
    if len(u) != 1:
        errs.append("need exactly one underlined digit")
        return
    plain = re.sub(r"\\underline\{(\d)\}", r"\1", body)
    digits = digits_of(plain)
    # position from the right of the underlined digit
    before = re.sub(r"\\,", "", body.split("\\underline{")[0])
    pos = len(digits) - 1 - len(before)
    d = int(u[0])
    if any(int(c) >= base for c in digits) or digits[0] == "0":
        errs.append("digits do not fit the base")
    if base == 2 and len(digits) > 4:
        # thin spaces every four digits from the right
        marks = [len(re.sub(r"\\underline\{(\d)\}", r"\1", part)) for part in body.split("\\,")]
        if any(k != 4 for k in marks[1:]) or not 1 <= marks[0] <= 4:
            errs.append("binary digits not grouped by four")
    if d == 0:
        errs.append("underlined digit is 0")
    if base**pos > 5000:
        errs.append("weight above 5000")
    if (base == 10) != ("base dieci" not in sample["prompt"]):
        errs.append("prompt does not match the base")
    check_number_answer(sample, d * base**pos, errs)


TERM = re.compile(r"(\d+) \\cdot (\d+)\^(\d+)")


def read_poly(latex):
    """The terms of a polynomial form, on one line or on two lines of a gathered."""
    s = latex
    g = re.fullmatch(r"\\begin\{gathered\} (.+) \+ \{\} \\\\ (.+) \\end\{gathered\}", s)
    if g:
        s = f"{g.group(1)} + {g.group(2)}"
    parts = s.split(" + ")
    terms = []
    for p in parts:
        m = TERM.fullmatch(p)
        if not m:
            raise ValueError(f"term {p!r} unreadable")
        terms.append(tuple(int(x) for x in m.groups()))
    if (len(terms) == 4) != bool(g):
        raise ValueError("four terms go on two lines, three on one")
    return terms


def level4(sample, errs):
    problem = sample["problem"]
    if re.fullmatch(r"\d+", problem):
        digits, base = problem, 10
    else:
        digits, base = parse_num(problem)
        if num_tex(digits, base) != problem:
            errs.append("number not written in the canonical way")
    n = len(digits)
    if n not in (3, 4) or digits[0] == "0" or digits == digits[::-1]:
        errs.append("need 3 or 4 digits, no leading zero, not a palindrome")
    truth = [(int(c), base, n - 1 - k) for k, c in enumerate(digits)]

    def is_right(o):
        terms = read_poly(o["latex"])
        if o["values"] != [f"{c}*{b}^{e}" for c, b, e in terms]:
            raise ValueError("values do not match the text of the option")
        return terms == truth

    check_choice(sample["answer"], is_right, errs, "answer")
    # no distractor may be worth the same as the number
    value = int(digits, base)
    for o in sample["answer"]["options"]:
        try:
            terms = read_poly(o["latex"])
        except ValueError:
            continue
        if terms != truth and sum(c * b**e for c, b, e in terms) == value:
            errs.append("a distractor has the same value as the number")
    if sample.get("choice") is not None and sample["choice"] != sample["answer"]:
        errs.append("choice differs from the answer")


def level5(sample, errs):
    digits, base = parse_num(sample["problem"])
    if num_tex(digits, base) != sample["problem"]:
        errs.append("number not written in the canonical way")
    value = int(digits, base)
    if not 2 <= base <= 9 or not 3 <= len(digits) <= 5 or digits[0] == "0":
        errs.append("base or length out of range")
    if value > 1000:
        errs.append(f"value {value} above 1000")
    if sum(c != "0" for c in digits) < 2:
        errs.append("fewer than two non-zero digits")
    check_number_answer(sample, value, errs)
    if sample["solution"] != f"{sample['problem']} = {value}_{{10}}":
        errs.append("solution is not number = value")
    # the table of weights in the first step
    ti = table_index(sample["steps"])
    weights = [str(base ** (len(digits) - 1 - k)) for k in range(len(digits))]
    if ti is None or array_rows(sample["steps"][ti]) != [weights, list(digits)]:
        errs.append("weights table wrong")
    if not sample["steps"][-1].rstrip("\\text{.}").endswith(f"= {value}"):
        errs.append("last step does not end with the value")


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample["level"]
    kind = None
    if lvl == 1:
        kind = level1(sample, errs)
    elif lvl == 2:
        kind = level2(sample, errs)
    elif lvl == 3:
        level3(sample, errs)
    elif lvl == 4:
        level4(sample, errs)
    elif lvl == 5:
        level5(sample, errs)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
