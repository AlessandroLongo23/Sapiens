"""Checker for inf-cicli-annidati (specs/exercises/inf-cicli-annidati.md).

Written from the spec. What two nested loops do is worked out here with Python's own `for` from the numbers in
`params` (sizes, starts, the kind of drawing), and compared with the right option and with what the reference
program writes when Python runs it (checkers/_inf_programmi.py):
- levels 1 and 3: the turns of the inner body, also counted by running the reference with a counter in it;
- level 2: the lines of a double loop of at most 3 by 3; level 4: the rows of a drawing;
- level 5: the lines of a table, four programs with two `while`, and a chart to build when it is open;
- level 6: a program to write, on two inputs.
"""
import re

from checkers._inf_iter import heads_and_width, is_for, is_while, open_tests, turns
from checkers._inf_programmi import choice_of, common, run_chart

TABLES = ["tavola", "aree", "dadi", "menu"]
TASKS = ["prodotti", "somme", "rettangolo", "triangolo", "quadrato"]
DRAWINGS = ["rettangolo", "triangolo", "rovesciato", "scala"]
CASE_RANGES = {
    1: {"da-zero": (0.4, 0.6), "da-uno": (0.4, 0.6)},
    2: {"2x2": (0.17, 0.33), "2x3": (0.17, 0.33), "3x2": (0.17, 0.33), "3x3": (0.17, 0.33)},
    3: {"fino-a-i": (0.25, 0.42), "sotto-i": (0.25, 0.42), "da-i": (0.25, 0.42)},
    4: {d: (0.18, 0.32) for d in DRAWINGS},
    5: {t: (0.18, 0.32) for t in TABLES},
    6: {t: (0.13, 0.27) for t in TASKS},
}
BODY = {"i, j": lambda i, j: f"{i} {j}", "i * j": lambda i, j: str(i * j), "i + j": lambda i, j: str(i + j), "10 * i + j": lambda i, j: str(10 * i + j)}


def drawing(p):
    """The rows of the drawing of level 4."""
    kind, mark = p["case"], p["mark"]
    if kind == "rettangolo":
        return [mark * p["c"] for _ in range(p["r"])]
    if kind == "scala":
        return [mark * (2 * i) for i in range(1, p["n"] + 1)]
    rows = [mark * i for i in range(p["a"], p["b"] + 1)]
    return rows if kind == "triangolo" else rows[::-1]


def task(kind, p, inputs):
    """What the program of level 6 writes on its inputs."""
    n = inputs[0]
    if kind == "prodotti":
        return [i * j for i in range(1, n + 1) for j in range(1, p["k"] + 1)]
    if kind == "somme":
        return [i + j for i in range(1, n + 1) for j in range(1, i + 1)]
    if kind == "rettangolo":
        return ["*" * inputs[1] for _ in range(n)]
    if kind == "triangolo":
        return ["*" * i for i in range(1, n + 1)]
    return ["*" * n for _ in range(n)]


def check(sample):
    errors = common(sample)
    p = sample["params"]
    level = sample["level"]
    case = p["case"]
    source = p["source"]
    choice = choice_of(sample)
    right = choice["options"][choice["correct"]]
    errors += heads_and_width(sample, choice)
    shown = sample.get("code")
    if level <= 4 and not (shown and is_for(shown)):
        errors.append("the program is not shown with two for")
    for code in [shown, sample.get("solutionCode")]:
        if code and "riga" in code["python"] + code["cpp"]:
            errors.append("a drawing is shown as a text built a row at a time")
    if len(re.findall(r"^\s*finché ", source, re.M)) != 2 or not re.search(r"^    finché j ", source, re.M):
        errors.append("the reference is not two loops, one inside the other")

    if level == 1:
        m, n = p["m"], p["n"]
        if not (2 <= m <= 9 and 2 <= n <= 9):
            errors.append("from 2 to 9 turns each")
        if turns(source) != {0: m, 1: m * n}:
            errors.append(f"the loops do not make {m} and {m * n} turns")
        if right["values"][0] != str(m * n):
            errors.append(f"the right option is not {m * n}")
    if level == 2:
        m, n, a, b = p["m"], p["n"], p["a"], p["b"]
        if not (2 <= m <= 3 and 2 <= n <= 3):
            errors.append("at most 3 by 3")
        want = [BODY[p["expr"]](i, j) for i in range(a, a + m) for j in range(b, b + n)]
        if run_chart(source, []) != want:
            errors.append("the reference does not write what the two loops should")
        if right["values"][0] != "\n".join(want):
            errors.append("the right option is not what the two loops write")
    if level == 3:
        a, last = p["a"], p["a"] + p["turns"] - 1
        each = [last - i + 1 if case == "da-i" else i for i in range(a, last + 1)]
        if turns(source) != {0: p["turns"], 1: sum(each)}:
            errors.append(f"the inner body does not run {sum(each)} times")
        if right["values"][0] != str(sum(each)):
            errors.append(f"the right option is not {sum(each)}")
        if not re.search(r"^    finché j \S+ i$|^    j = i$", source, re.M):
            errors.append("the inner loop does not depend on i")
    if level == 4:
        want = drawing(p)
        if max(len(r) for r in want) > 8 or not 2 <= len(want) <= 5:
            errors.append("a drawing of 2 to 5 rows of at most 8 characters")
        if run_chart(source, []) != want:
            errors.append("the reference does not draw what it should")
        if right["values"][0] != "\n".join(want):
            errors.append("the right option is not the drawing")
        if 'end=""' not in shown["python"] or "print()" not in shown["python"] or "cout << endl;" not in shown["cpp"]:
            errors.append("the drawing is not written a character at a time")
    if level == 5:
        m, n = p["m"], p["n"]
        if case not in TABLES or m == n:
            errors.append("a table with two different sizes")
        want = [str(i + j if case in ("dadi", "menu") else i * j) for i in range(1, m + 1) for j in range(1, n + 1)]
        if run_chart(source, []) != want:
            errors.append("the reference does not write the table")
        if not all("code" in o and is_while(o["code"]) for o in choice["options"]):
            errors.append("level 5 offers programs with two while")
        if sample["answer"]["kind"] == "chart":
            errors += open_tests(sample, [([], want)])
        elif sample["answer"]["kind"] != "choice":
            errors.append("level 5 is a choice or a chart to build")
    if level == 6:
        if case not in TASKS:
            errors.append(f"unknown task {case}")
        want = [(t, task(case, p, t)) for t in p["tests"]]
        errors += open_tests(sample, want)
        if len(want) < 2 or want[0][1] == want[1][1]:
            errors.append("two tests that write different things are needed")
        if sample["answer"]["kind"] != "program" or not is_for(sample["answer"]["solution"]):
            errors.append("level 6 asks for a program, solved with two for")
        if not all("code" in o and is_for(o["code"]) for o in choice["options"]):
            errors.append("level 6 offers programs with two for")
    return errors, case
