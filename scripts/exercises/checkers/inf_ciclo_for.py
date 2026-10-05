"""Checker for inf-ciclo-for (specs/exercises/inf-ciclo-for.md).

Written from the spec. Nothing is taken from the generator's interpreter:
- levels 1-4: the counter is read from the reference loop and walked here; what it writes, and how many turns it
  makes, come from that walk. The `for` shown is read back in the two languages (checkers/_inf_iter.py);
- level 3: the right option is the number of turns;
- level 4: a `while` is shown and the four options are programs with a `for`, only one of which does the same;
- levels 5 and 6: what the program must write for each value of n is computed from the task (its kind and its
  numbers in `params`), and the tests of the open answer must say the same.
"""
import re

from checkers._inf_iter import heads_and_width, is_for, is_while, open_tests, turns
from checkers._inf_programmi import choice_of, common, run_chart

FORMS = ["uno", "due", "passo", "indietro"]
TASKS = ["multipli", "fino", "indietro", "somma", "quadrati"]
CASE_RANGES = {
    1: {"uno": (0.4, 0.6), "due": (0.4, 0.6)},
    2: {"passo": (0.4, 0.6), "indietro": (0.4, 0.6)},
    3: {f: (0.18, 0.32) for f in FORMS},
    4: {f: (0.15, 0.35) for f in FORMS},
    5: {t: (0.13, 0.27) for t in TASKS},
    6: {t: (0.13, 0.27) for t in TASKS},
}

LOOP = re.compile(r"i = (\d+)\nfinché i (<=|<|>=|>) (\d+)\n    scrivi (.+)\n    i = i ([+-]) (\d+)\n")


def walk(source):
    """The counter of a loop of levels 1-4 and the lines it writes, worked out here."""
    m = LOOP.fullmatch(source)
    if not m:
        return None
    start, op, limit, body, sign, size = m.groups()
    i, limit, step = int(start), int(limit), int(size) * (1 if sign == "+" else -1)
    lines = []
    while {"<": i < limit, "<=": i <= limit, ">": i > limit, ">=": i >= limit}[op] and len(lines) < 100:
        lines.append(str(eval(body, {}, {"i": i})))
        i += step
    return {"start": int(start), "step": step, "lines": lines}


def expected(kind, p, n):
    """What the program of a task writes for n."""
    if kind == "multipli":
        return [n * i for i in range(1, p["m"] + 1)]
    if kind == "fino":
        return list(range(p["from"], n + 1, p["step"]))
    if kind == "indietro":
        return list(range(n, p["to"] - 1, -p["step"]))
    if kind == "somma":
        return [sum(range(p["from"], n + 1, p["step"]))]
    return [i * i for i in range(1, n + 1)]


def check(sample):
    errors = common(sample)
    p = sample["params"]
    level = sample["level"]
    case = p["case"]
    choice = choice_of(sample)
    right = choice["options"][choice["correct"]]
    errors += heads_and_width(sample, choice)

    if level <= 4:
        if case not in FORMS:
            return errors + [f"unknown form {case}"], case
        loop = walk(p["source"])
        if not loop:
            return errors + ["the reference is not a loop with a counter"], case
        n = len(loop["lines"])
        if not 3 <= n <= 7:
            errors.append(f"a loop of {n} turns")
        if turns(p["source"]) != {0: n}:
            errors.append("the turns counted by running the loop are not those of the counter")
        plain = loop["step"] == 1
        if (case in ("uno", "due")) != plain or (case == "uno") != (plain and loop["start"] == 0) or (case == "indietro") != (loop["step"] < 0):
            errors.append(f"the loop is not of the form {case}")
        if level in (1, 2):
            if (level == 1) != plain:
                errors.append("level 1 has a step of one, level 2 another step")
            if right["values"][0] != "\n".join(loop["lines"]):
                errors.append("the right option is not what the loop writes")
        if level == 3 and (right["values"][0] != str(n) or p["turns"] != n):
            errors.append(f"the body runs {n} times")
        if level in (1, 2, 3) and not is_for(sample.get("code", {"python": "", "cpp": ""})):
            errors.append("the program shown has no for")
        if level == 4:
            if not is_while(sample.get("code", {"python": "", "cpp": ""})):
                errors.append("level 4 shows a while")
            if not all("code" in o and is_for(o["code"]) for o in choice["options"]):
                errors.append("level 4 offers programs with a for")
        return errors, case

    if case not in TASKS:
        return errors + [f"unknown task {case}"], case
    tests = p["tests"]
    want = [(t, expected(case, p, t[0])) for t in tests]
    for inputs, lines in want:
        if run_chart(p["source"], inputs) != [str(x) for x in lines]:
            errors.append(f"with {inputs[0]} the reference does not write {lines}")
        if not 1 <= len(lines) <= 12:
            errors.append(f"{len(lines)} lines written")
    if len(tests) < 2 or want[0][1] == want[1][1]:
        errors.append("two tests that write different things are needed")
    errors += open_tests(sample, want)
    if level == 5:
        if sample["answer"]["kind"] != "chart" or not is_for(sample.get("code", {"python": "", "cpp": ""})):
            errors.append("level 5 shows a for and asks for its chart")
        if not all("chart" in o for o in choice["options"]):
            errors.append("level 5 offers charts")
    if level == 6:
        if sample["answer"]["kind"] != "program" or not is_for(sample["answer"]["solution"]):
            errors.append("level 6 asks for a program, solved with a for")
        if not all("code" in o and is_for(o["code"]) for o in choice["options"]):
            errors.append("level 6 offers programs with a for")
    return errors, case
