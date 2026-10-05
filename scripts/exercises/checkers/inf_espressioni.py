"""Checker for inf-espressioni (specs/exercises/inf-espressioni.md).

Written from the spec. Every program is run by Python (checkers/_inf_programmi.py), and the answer is worked out a
second time from what the exercise says:
- level 1: the expression is read from the program and worked out here with the values of the two variables; without
  its brackets (or with the other grouping) it gives another value;
- level 2: the two numbers are read from the program: the quotient or the remainder, and the remainder is not zero;
- level 3: the digits of a number, or a total and its divisor, are read from the program and split here;
- level 4: the instruction is read from the text, with its language. In Python `/` always gives a number with the
  point, `//` the quotient, `**` the power; in C++ `/` between two integers gives the quotient, and with a number
  written with `.0` the result is printed as cout does (six figures, no final zeros);
- levels 5 and 6: what the program must write is rebuilt from the words of the task, for every test; of the four
  charts or programs only the right one does (common checks).
"""
import re

from checkers._inf_primi import check_choice, check_widths, outputs, text_only
from checkers._inf_programmi import choice_of, common, run_python

CASE_RANGES = {
    1: {"senza parentesi": (0.45, 0.70), "con parentesi": (0.30, 0.55)},
    2: {"quoziente": (0.40, 0.60), "resto": (0.40, 0.60)},
    3: {"cifre": (0.32, 0.48), "parti": (0.52, 0.68)},
    4: {k: (0.09, 0.20) for k in ["py-divisione", "py-esatta", "py-quoziente", "cpp-interi", "cpp-virgola", "cpp-esatta", "py-potenza"]},
    5: {"parti": (0.25, 0.42), "cifre": (0.10, 0.23), "perimetro": (0.10, 0.23), "resto": (0.10, 0.23), "sconto": (0.10, 0.23)},
    6: {"parti": (0.25, 0.42), "cifre": (0.10, 0.23), "perimetro": (0.10, 0.23), "resto": (0.10, 0.23), "sconto": (0.10, 0.23)},
}

# What is split, by what: the words of the task decide the divisor.
DIVISORS = {
    "una durata in minuti": 60,
    "un numero di uova": 6,
    "un numero di giorni": 7,
    "una durata in secondi": 60,
    "una somma in centesimi": 100,
    "un numero di pastelli": 12,
}


def said(rows):
    return ", ".join(str(r) for r in rows)


def rows_of(source):
    return [r.strip() for r in source.split("\n") if r.strip()]


def value_of(expr, names):
    """An expression of whole numbers, names, + - * // % and brackets, worked out by Python."""
    if not re.fullmatch(r"[\w\s+\-*/%()]+", expr) or re.search(r"(?<!/)/(?!/)", expr):
        raise ValueError(f"not an expression of whole numbers: {expr}")
    return eval(expr, {"__builtins__": {}}, dict(names))  # noqa: S307 - checked above: numbers, names and operators only


def assignments(rows):
    """The variables set to a number by the first rows of a program, and the rows left."""
    names = {}
    i = 0
    while i < len(rows) and (m := re.fullmatch(r"(\w+) = (\d+)", rows[i])):
        names[m.group(1)] = int(m.group(2))
        i += 1
    return names, rows[i:]


def level1(rows, right, errors):
    names, rest = assignments(rows)
    if len(names) != 2 or len(rest) != 1 or not rest[0].startswith("scrivi "):
        errors.append("level 1 program not recognised")
        return None
    expr = rest[0][7:]
    value = value_of(expr, names)
    if right["values"][0] != str(value):
        errors.append(f"the expression is worth {value}")
    if len(re.findall(r"[+\-*]", expr)) != 2:
        errors.append("level 1 has two operations")
    brackets = "(" in expr
    if brackets:
        other = value_of(expr.replace("(", "").replace(")", ""), names)
    else:
        # the same three operands grouped the other way: the first two together, or the last two
        x, op1, y, op2, z = re.fullmatch(r"(\w+) ([+\-*]) (\w+) ([+\-*]) (\w+)", expr).groups()
        other = value_of(f"({x} {op1} {y}) {op2} {z}" if op2 == "*" else f"{x} {op1} ({y} {op2} {z})", names)
    if other == value:
        errors.append("the order of the calculations does not change the value")
    return "con parentesi" if brackets else "senza parentesi"


def level2(rows, right, errors):
    names, rest = assignments(rows)
    m = re.fullmatch(r"scrivi (\w+) (//|%) (\w+)", rest[0]) if len(rest) == 1 else None
    if len(names) != 2 or not m:
        errors.append("level 2 program not recognised")
        return None
    n, d = names[m.group(1)], names[m.group(3)]
    if n % d == 0 or n // d == n % d:
        errors.append("the remainder is zero, or equal to the quotient")
    want = n // d if m.group(2) == "//" else n % d
    if right["values"][0] != str(want):
        errors.append(f"the program writes {want}")
    return "quoziente" if m.group(2) == "//" else "resto"


def level3(rows, right, errors):
    names, rest = assignments(rows)
    if len(names) != 1:
        errors.append("level 3 program not recognised")
        return None
    (total, n), = names.items()
    if rest[:2] == [f"decine = {total} // 10", f"unita = {total} % 10"] and len(rest) == 3 and 10 <= n <= 99:
        want = [value_of(rest[2][7:], {"decine": n // 10, "unita": n % 10})]
        kind = "cifre"
    else:
        m = re.fullmatch(rf"(\w+) = {total} // (\d+)", rest[0])
        if not m or len(rest) != 4:
            errors.append("level 3 program not recognised")
            return None
        k = int(m.group(2))
        r = re.fullmatch(rf"(\w+) = {total} % {k}", rest[1])
        if not r or rest[2:] != [f"scrivi {m.group(1)}", f"scrivi {r.group(1)}"] or k not in DIVISORS.values():
            errors.append("level 3 program not recognised")
            return None
        want = [n // k, n % k]
        if n % k == 0 or n // k == n % k:
            errors.append("the remainder is zero, or equal to the quotient")
        kind = "parti"
    if right["values"][0] != "\n".join(str(v) for v in want) or right["latex"] != said(want):
        errors.append(f"the program writes {want}")
    return kind


def level4(sample, errors):
    if not text_only(sample, errors):
        return None
    py = re.fullmatch(r"In Python, che cosa stampa l'istruzione «print\((\d+) (/|//|\*\*) (\d+)\)»\?", sample["problem"])
    cpp = re.fullmatch(r"In C\+\+, che cosa stampa l'istruzione «cout << (\d+)(\.0)? / (\d+) << endl;»\?", sample["problem"])
    if py:
        a, op, b = int(py.group(1)), py.group(2), int(py.group(3))
        if op == "/":
            want, kind = str(a / b), "py-esatta" if a % b == 0 else "py-divisione"
        elif op == "//":
            want, kind = str(a // b), "py-quoziente"
            if a % b == 0:
                errors.append("the quotient is exact")
        else:
            want, kind = str(a**b), "py-potenza"
            if a**b == a * b:
                errors.append("the power is the product")
    elif cpp:
        a, b = int(cpp.group(1)), int(cpp.group(3))
        if cpp.group(2):
            want, kind = "%g" % (a / b), "cpp-esatta" if a % b == 0 else "cpp-virgola"
        else:
            want, kind = str(a // b), "cpp-interi"
            if a % b == 0:
                errors.append("the quotient is exact")
    else:
        errors.append("level 4 text not recognised")
        return None
    check_choice(sample["answer"], lambda o: o["latex"] == want and o["values"][0] == want, errors)
    if sample["params"].get("language") != ("python" if py else "cpp"):
        errors.append("params.language is not the language of the text")
    return kind


def expected_of(task):
    """What the program of a task writes for the numbers read, from the words of the task. Returns (family, readings, function)."""
    m = re.search(r"legge (.+), un numero intero, e scrive su due righe ", task)
    if m and m.group(1) in DIVISORS:
        k = DIVISORS[m.group(1)]
        if (k in (6, 12)) != (f"scatole da {k} si riempiono" in task):
            return None, 0, None
        return "parti", 1, lambda t: [t[0] // k, t[0] % k]
    if "legge un numero intero n di due cifre e scrive " in task:
        if "la somma delle sue cifre" in task:
            return "cifre", 1, lambda t: [t[0] // 10 + t[0] % 10]
        if "il numero con le due cifre scambiate di posto" in task:
            return "cifre", 1, lambda t: [t[0] % 10 * 10 + t[0] // 10]
        if "su due righe la cifra delle decine e quella delle unità" in task:
            return "cifre", 1, lambda t: [t[0] // 10, t[0] % 10]
    if "di un rettangolo, due numeri interi, e scrive il perimetro" in task:
        return "perimetro", 2, lambda t: [2 * (t[0] + t[1])]
    m = re.search(r"il resto che ricevi dopo aver comprato (\d+) quaderni", task)
    if m:
        return "resto", 2, lambda t: [t[0] - t[1] * int(m.group(1))]
    m = re.search(r"quanto si paga per (\d+) biglietti scontati", task)
    if m:
        return "sconto", 2, lambda t: [(t[0] - t[1]) * int(m.group(1))]
    return None, 0, None


def calculation(sample, source, tests, choice, errors):
    family, n_reads, expected = expected_of(sample["problem"])
    if not family:
        errors.append("task not recognised")
        return None
    reads = [r for r in rows_of(source) if r.startswith("leggi ")]
    if len(reads) != n_reads or any(len(t) != n_reads for t in tests):
        errors.append(f"{len(reads)} readings for a task of {n_reads}")
    if len(tests) < 2 or len({tuple(t) for t in tests}) != len(tests):
        errors.append("at least two different tests are needed")
    if any(not isinstance(v, int) or v < 0 for t in tests for v in t):
        errors.append("a value read is not a whole number")
    if family == "cifre" and any(not 10 <= t[0] <= 99 for t in tests):
        errors.append("a number that is not of two figures")
    written = outputs(source, tests)
    if any([str(v) for v in expected(t)] != w for t, w in zip(tests, written)):
        errors.append("the reference does not write what the task says")
    if any(v < 0 for t in tests for v in expected(t)):
        errors.append("a negative result")
    if f"Con {' e '.join(str(v) for v in tests[0])} deve scrivere {said(expected(tests[0]))}." not in sample["problem"]:
        errors.append("the example of the text is not the first test")
    options = choice["options"]
    answer = sample["answer"]
    if sample["level"] == 5 and (answer["kind"] != "chart" or not all("chart" in o for o in options)):
        errors.append("level 5 asks for a chart and offers charts")
    if sample["level"] == 6:
        if answer["kind"] != "program" or not all("code" in o for o in options):
            errors.append("level 6 asks for a program and offers programs")
        else:
            if answer["start"]["python"].count("int(input())") != n_reads or answer["start"]["cpp"].count("cin >>") != n_reads:
                errors.append("the program to start from does not have the readings")
            if run_python(answer["start"]["python"], tests[0]) == written[0]:
                errors.append("the program to start from already passes")
    return family


def check(sample):
    errors = common(sample)
    check_widths(sample, errors)
    params = sample["params"]
    level = sample["level"]
    if level == 4:
        kind = level4(sample, errors)
    else:
        source = params["source"]
        rows = rows_of(source)
        if any(re.match(r"(se|finché|altrimenti)\b", r) for r in rows):
            errors.append("the program is not a sequence")
        # the division of the calculator and the decimals are for level 4 only
        if re.search(r"(?<!/)/(?!/)", source) or re.search(r"\d\.\d", source):
            errors.append("a program uses / or a decimal")
        choice = choice_of(sample)
        right = choice["options"][choice["correct"]]
        if level in (1, 2, 3):
            if "code" not in sample or sample["answer"]["kind"] != "choice":
                errors.append("the program is shown and the answer is a choice")
            if right["values"][0] != "\n".join(outputs(source, [[]])[0] or ["?"]):
                errors.append("the right option is not what the program writes")
        try:
            if level == 1:
                kind = level1(rows, right, errors)
            elif level == 2:
                kind = level2(rows, right, errors)
            elif level == 3:
                kind = level3(rows, right, errors)
            elif level in (5, 6):
                kind = calculation(sample, source, params["tests"], choice, errors)
            else:
                errors.append(f"unknown level {level}")
                kind = None
        except ValueError as e:
            errors.append(str(e))
            kind = None
    if kind is not None and params.get("case") != kind:
        errors.append(f"params.case is {params.get('case')!r}, the exercise is {kind!r}")
    return errors, kind
