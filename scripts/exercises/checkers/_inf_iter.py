"""Shared checks for the generators of lessons 61-64 of informatica (src/lib/exercises/v2/inf-iter.ts).

On top of checkers/_inf_programmi.py. The programs of these lessons are shown with a `for`, which the language of
the flowcharts does not have: the site rewrites the counted `while` of the reference program. Here the two lines are
read back on their own: the values Python's `range` gives are compared with the values the C++ `for` walks, so a
`for` that does not say the same in the two languages is caught without running any C++.
"""
import re

from checkers._inf_programmi import run_python, to_python

PY_FOR = re.compile(r"^\s*for (\w+) in range\((.*)\):$", re.M)
CPP_FOR = re.compile(r"^\s*for \(int (\w+) = (.+?); (\w+) (<=|<|>=|>) (.+?); (\w+)(\+\+|--| \+= \d+| -= \d+)\) \{$", re.M)
NAME = re.compile(r"[A-Za-z_]\w*")


def turns(source, inputs=()):
    """How many times the body of each loop of `source` runs, by depth: {0: outer loops, 1: loops inside them}."""
    out = ["__n = {}"]
    for line in to_python(source).split("\n"):
        out.append(line)
        m = re.match(r"( *)while ", line)
        if m:
            depth = len(m.group(1)) // 4
            out.append(f"{m.group(1)}    __n[{depth}] = __n.get({depth}, 0) + 1")
    out.append("print('TURNS', sorted(__n.items()))")
    printed = run_python("\n".join(out) + "\n", inputs)
    return dict(eval(printed[-1][6:])) if printed else None


def is_for(code):
    return bool(PY_FOR.search(code["python"])) and bool(CPP_FOR.search(code["cpp"])) and "while" not in code["python"] and "while" not in code["cpp"]


def is_while(code):
    return "while" in code["python"] and "while" in code["cpp"] and "for " not in code["python"] and "for (" not in code["cpp"]


def cpp_values(start, op, limit, step, env):
    i = eval(start, {}, env)
    end = eval(limit, {}, env)
    by = {"++": 1, "--": -1}.get(step) or int(step.replace(" ", "").replace("=", ""))
    out = []
    while {"<": i < end, "<=": i <= end, ">": i > end, ">=": i >= end}[op] and len(out) < 200:
        out.append(i)
        i += by
    return out


def same_heads(code):
    """Errors when a `for` of the Python and the `for` at the same place in the C++ do not walk the same values."""
    py = PY_FOR.findall(code["python"])
    cpp = CPP_FOR.findall(code["cpp"])
    if len(py) != len(cpp):
        return [f"{len(py)} for in Python and {len(cpp)} in C++"]
    errors = []
    for (name, args), (cname, start, c2, op, limit, c3, step) in zip(py, cpp):
        if not (name == cname == c2 == c3):
            errors.append(f"the counter of a for has two names: {name}, {cname}")
            continue
        names = sorted(set(NAME.findall(args + " " + start + " " + limit)) - {name})
        for base in range(0, 21):
            env = {n: base + k for k, n in enumerate(names)}
            if list(eval(f"range({args})", {}, env))[:200] != cpp_values(start, op, limit, step, env):
                errors.append(f"range({args}) and the C++ for do not walk the same values with {env}")
                break
    return errors


def fits(code):
    """The width an option that is a program may have (see `fits` in inf-iter.ts)."""
    py = code["python"].rstrip("\n").split("\n")
    cpp = code["cpp"].rstrip("\n").split("\n")
    return len(py) <= 9 and all(len(r) <= 34 for r in py) and all(len(r) <= (38 if re.match(r"\s*for \(", r) else 34) for r in cpp)


def codes_of(sample, choice):
    """Every program a sample carries, with what it is."""
    out = []
    if "code" in sample:
        out.append(("the program shown", sample["code"]))
    if "solutionCode" in sample:
        out.append(("the program of the solution", sample["solutionCode"]))
    if sample["answer"]["kind"] == "program":
        out.append(("the solution to write", sample["answer"]["solution"]))
    for i, o in enumerate(choice["options"]):
        if "code" in o:
            out.append((f"option {i}", o["code"]))
    return out


def heads_and_width(sample, choice):
    """What holds for every sample of these generators: each `for` says the same in the two languages, options fit."""
    errors = []
    for what, code in codes_of(sample, choice):
        errors += [f"{what}: {e}" for e in same_heads(code)]
        if what.startswith("option") and not fits(code):
            errors.append(f"{what} is too wide or too long")
    return errors


def typed(test):
    """The values of a test of a program to write, as the list its `input` gives."""
    return test["input"].split("\n")[:-1] if test["input"] else []


def open_tests(sample, expected):
    """Errors when the tests of an open answer are not `expected`: a list of (inputs, lines written)."""
    answer = sample["answer"]
    errors = []
    if answer["kind"] == "chart":
        got = [([str(x) for x in t["inputs"]], t["output"]) for t in answer["tests"]]
    elif answer["kind"] == "program":
        got = [(typed(t), t["output"].split("\n")[:-1]) for t in answer["tests"]]
    else:
        return ["the answer is not open"]
    want = [([str(x) for x in inputs], [str(x) for x in lines]) for inputs, lines in expected]
    if got != want:
        errors.append(f"the tests are {got}, and they should be {want}")
    return errors
