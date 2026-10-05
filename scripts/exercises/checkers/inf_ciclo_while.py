"""Checker for inf-ciclo-while (specs/exercises/inf-ciclo-while.md).

Written from the spec. Every loop is run by Python (checkers/_inf_programmi.py), not by the site's interpreter:
- level 1: the right option is what the loop writes; the others are different;
- level 2: the turns of the body are counted here, by running the loop with a counter put in its body;
- levels 3 and 4: of the four programs or charts, only the right one writes what the reference loop writes;
- level 5: the chart of the solution passes its tests, and the multiple choice is as in level 4;
- level 6: the Python of the solution passes its tests, and the multiple choice is as in level 3;
- levels 5 and 6: the loop reads n, its two runs write different things, and the answer must have a loop (a while
  in level 6).
"""
import re

from checkers._inf_programmi import choice_of, common, run_python, to_python, written

CASE_RANGES = {n: {"rovescia": (0.25, 0.42), "salita": (0.25, 0.42), "somma": (0.25, 0.42)} for n in range(1, 7)}


def turns(source, typed=()):
    """How many times the body of the only loop of `source` runs, with `typed` at its keyboard."""
    lines = to_python(source).split("\n")
    out = ["__n = 0"]
    for line in lines:
        out.append(line)
        if line.startswith("while "):
            out.append("    __n += 1")
    out.append("print('TURNS', __n)")
    printed = run_python("\n".join(out) + "\n", typed)
    return int(printed[-1].split()[1])


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    source = params["source"]
    choice = choice_of(sample)
    right = choice["options"][choice["correct"]]
    tests = params["tests"]
    # the open levels read the number the loop stops at, and are tried on two: the second may take a turn or two more
    for typed in tests:
        n = turns(source, typed)
        if not 2 <= n <= (7 if level <= 4 else 10):
            errors.append(f"a loop of {n} turns")
    n = turns(source, tests[0])
    if level <= 4 and tests != [[]]:
        errors.append("a loop that is shown reads nothing")
    if not re.search(r"^finché ", source, re.M):
        errors.append("no loop")
    if level == 1:
        if right["values"][0] != "\n".join(written(sample)):
            errors.append("the right option is not what the loop writes")
        if "code" not in sample:
            errors.append("the program is not shown")
    if level == 2:
        if right["values"][0] != str(n) or params["turns"] != n:
            errors.append(f"the body runs {n} times")
    if level == 3 and ("chart" not in sample or not all("code" in o for o in choice["options"])):
        errors.append("level 3 shows a chart and offers programs")
    if level == 4 and ("code" not in sample or not all("chart" in o for o in choice["options"])):
        errors.append("level 4 shows a program and offers charts")
    if level >= 5:
        answer = sample["answer"]
        if answer["kind"] != ("chart" if level == 5 else "program"):
            errors.append("level 5 asks for a chart, level 6 for a program")
        if not source.startswith("leggi n\n") or len(tests) != 2 or tests[0] == tests[1]:
            errors.append("an open level reads n and is tried on two different numbers")
        elif run_python(to_python(source), tests[0]) == run_python(to_python(source), tests[1]):
            errors.append("the two runs write the same")
        if answer.get("needs") != (["ciclo"] if level == 5 else ["while"]):
            errors.append("level 5 needs a loop, level 6 a while")
    return errors, params["family"]
