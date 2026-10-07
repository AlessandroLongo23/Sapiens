"""Checker for inf-passaggio-parametri (specs/exercises/inf-passaggio-parametri.md).

Written from the spec. Every program is run by Python (checkers/_inf_codice.py), and with INF_CPP=1 by the C++
compiler too: here the two texts of a program are often different (a parameter with & in C++, a value given back
and assigned in Python), so the C++ run matters more than elsewhere.

What is worked out again here, from the numbers in `params` and never from the texts of the generator:
- level 1: the caller's two variables are written as they were, and the answer of who thinks they changed is
  among the wrong options;
- level 2: only the variable the change reaches has its new value; C++ has one & and Python one assigned call;
- level 3: the element of the vector has its new value and the number its old one;
- level 4: after the call the variables are swapped, in order, doubled or increased, on every test;
- level 5: the same for the function to write (in order, carried, capped), on three tests that write different
  things; the answer must have a function of its own, and the program to start from has no call.
"""
import re

from checkers._inf_codice import bare, choice_of, common, has

CASE_RANGES = {
    1: {"raddoppia": (0.18, 0.32), "azzera": (0.18, 0.32), "aumenta": (0.18, 0.32), "scambia": (0.18, 0.32)},
    2: {"due": (0.40, 0.60), "una": (0.40, 0.60)},
    3: {"assegna": (0.25, 0.42), "aumenta": (0.25, 0.42), "raddoppia": (0.25, 0.42)},
    4: {"scambia": (0.18, 0.32), "ordina": (0.18, 0.32), "raddoppia": (0.18, 0.32), "aumenta": (0.18, 0.32)},
    5: {"ordina": (0.25, 0.42), "riporto": (0.25, 0.42), "tetto": (0.25, 0.42)},
}

# what each function does to a number, said again here
OPS = {
    "raddoppia": lambda n, k: n * 2,
    "triplica": lambda n, k: n * 3,
    "aumenta": lambda n, k: n + k,
    "riduci": lambda n, k: n - k,
    "azzera": lambda n, k: 0,
}


def row(values):
    return " ".join(str(v) for v in values)


def in_order(a, b, sign):
    """The two numbers as `ordina` leaves them: swapped when the first is larger (">") or smaller ("<")."""
    swap = a > b if sign == ">" else a < b
    return [b, a] if swap else [a, b]


def rows_of(params, values):
    """What the caller writes of its variables: on one row, or each on its own where the level stacks them."""
    return [str(v) for v in values] if params["case"] == "riporto" else [row(values)]


def offered(choice):
    return [o["values"][0] for o in choice["options"]]


def check_reading(sample, errors, want, mistakes):
    """Levels 1 to 3: the whole program is shown, it reads nothing, and it writes `want` on one row."""
    params = sample["params"]
    choice = choice_of(sample)
    if params.get("ask") != "output" or sample.get("code") != params["program"]:
        errors.append("the level shows the whole program and asks what it writes")
    if params["tests"] != [[]]:
        errors.append("a program that is read reads nothing")
    if params["expected"] != [[row(want)]]:
        errors.append(f"the program should write {row(want)}, and the sample says {params['expected']}")
    if sample["solution"] != row(want):
        errors.append("the solution is not what the program writes")
    values = offered(choice)
    for what, wrong in mistakes.items():
        if row(wrong) == row(want):
            errors.append(f"{what}: the mistake gives the right answer")
        elif row(wrong) not in values:
            errors.append(f"the answer of {what} is not offered: {row(wrong)}")
    for language in ("python", "cpp"):
        if not has("funzione", params["program"][language], language):
            errors.append(f"the program in {language} has no function that is called")
    if "[" in "".join(values):
        errors.append("a whole vector is written")


def check_level1(sample, errors):
    params = sample["params"]
    case = params["case"]
    a, b = params["values"]
    u, w = params["names"]
    program = params["program"]
    if not (2 <= a <= 9 and 2 <= b <= 9 and a != b):
        errors.append("two different numbers from 2 to 9")
    if case == "scambia":
        believed = [b, a]
        if (a, b) == (3, 8):
            errors.append("the numbers of the lesson's example")
    else:
        k = params["k"]
        believed = [OPS[case](a, k), b] if params["which"] == 0 else [a, OPS[case](b, k)]
        if f"def {case}(" not in program["python"] or f"void {case}(" not in program["cpp"]:
            errors.append("the function has not the name of what it does")
    # by value in both: no reference in C++, nothing given back in Python
    if "&" in program["cpp"] or re.search(r"\breturn\b", program["python"]):
        errors.append("level 1 passes by value and gives nothing back")
    for name, value in ((u, a), (w, b)):
        if not re.search(rf"^{name} = {value}$", program["python"], re.M) or not re.search(rf"^    int {name} = {value};$", program["cpp"], re.M):
            errors.append(f"{name} does not start from {value} in both programs")
    check_reading(sample, errors, [a, b], {"who thinks the variable changed": believed})


def check_level2(sample, errors):
    params = sample["params"]
    values = params["values"]
    ops = params["ops"]
    reaches = params["reaches"]
    program = params["program"]
    after = [OPS[o["id"]](v, o["k"]) for v, o in zip(values, ops)]
    if len(set(values)) != 2 or not all(3 <= v <= 9 for v in values):
        errors.append("two different numbers from 3 to 9")
    if ops[0]["id"] == ops[1]["id"]:
        errors.append("the two variables go through the same change")
    if any(x == v or x < 0 for x, v in zip(after, values)):
        errors.append("a change leaves the number as it was, or makes it negative")
    want = [after[i] if i == reaches else values[i] for i in range(2)]
    # one parameter by reference in C++; in Python one call whose result is assigned
    if program["cpp"].count("&") != 1:
        errors.append("the C++ has not exactly one parameter by reference")
    assigned = re.findall(r"^(\w+) = \w+\(.*\)$", program["python"], re.M)
    if assigned != [params["names"][reaches]]:
        errors.append(f"in Python the result is assigned to {assigned}, not to {params['names'][reaches]}")
    functions = len(re.findall(r"^def ", program["python"], re.M))
    if functions != {"due": 2, "una": 1}[params["case"]]:
        errors.append(f"{functions} functions in the case {params['case']}")
    check_reading(sample, errors, want, {"who thinks everything changed": after, "who thinks nothing changed": values})


def check_level3(sample, errors):
    params = sample["params"]
    v = params["vector"]
    i = params["index"]
    n = params["n"]
    program = params["program"]
    if not 3 <= len(v) <= 4 or len(set(v + [n])) != len(v) + 1:
        errors.append("a vector of 3 or 4 different numbers, and a number that is none of them")
    fresh = {"assegna": n, "aumenta": v[i] + n, "raddoppia": v[i] * 2}[params["case"]]
    if params["number"] not in ("azzera", "incrementa", "raddoppia"):
        errors.append("the function does not change its number")
    for language in ("python", "cpp"):
        if not has("vettore", program[language], language):
            errors.append(f"the program in {language} has no vector")
    if "&" in program["cpp"] or re.search(r"\breturn\b", program["python"]):
        errors.append("level 3 has no reference and gives nothing back")
    if not re.search(rf"^v = \[{', '.join(map(str, v))}\]$", program["python"], re.M) or f"int v[{len(v)}] = {{{', '.join(map(str, v))}}};" not in program["cpp"]:
        errors.append("the vector of params is not the one of the programs")
    if re.search(r"print\(\s*v\s*[,)]", program["python"]):
        errors.append("the whole vector is written")
    check_reading(sample, errors, [fresh, n], {"who takes the vector for a copy": [v[i], n]})


def wanted(params, typed):
    """What the caller's variables hold after the call, for the numbers typed."""
    case = params["case"]
    numbers = [int(x) for x in typed]
    if case == "scambia":
        return numbers[::-1]
    if case == "ordina":
        return in_order(numbers[0], numbers[1], params["sign"])
    if case == "raddoppia":
        return [numbers[0] * 2]
    if case == "aumenta":
        return [numbers[0] + params["k"]]
    if case == "riporto":
        return [numbers[0] + numbers[1] // params["per"], numbers[1] % params["per"]]
    if case == "tetto":
        return [min(numbers[0] + params["k"], params["top"])]
    raise ValueError(f"unknown case {case}")


def check_function(sample, errors, variables):
    """Levels 4 and 5: the reference leaves in the caller what the task asks, and the options are functions alone."""
    params = sample["params"]
    choice = choice_of(sample)
    tests = params["tests"]
    if not all(len(t) == variables and all(re.fullmatch(r"\d+", x) for x in t) for t in tests):
        errors.append(f"every test types {variables} numbers that are not negative")
        return
    want = [rows_of(params, wanted(params, t)) for t in tests]
    if params["expected"] != want:
        errors.append(f"the function of {params['case']} should leave {want} on {tests}, and the sample says {params['expected']}")
    # at least one test on which a function that changes nothing is seen
    if not any(rows_of(params, [int(x) for x in t]) != rows for t, rows in zip(tests, want)):
        errors.append("no test tells a function that changes nothing")
    if not all("code" in o for o in choice["options"]):
        errors.append("the options are programs")
        return
    for i, o in enumerate(choice["options"]):
        shown = o["code"]
        if not shown["python"].startswith("def ") or "print" in shown["python"] or "input" in shown["python"] or "main" in shown["cpp"] or not shown["cpp"].startswith("void "):
            errors.append(f"option {i} does not show the function alone")
    right = choice["options"][choice["correct"]]["code"]
    # every parameter by reference in C++, the new values given back in Python
    if right["cpp"].count("&") != variables or right["cpp"].count("int ") < variables:
        errors.append("the right function in C++ has not every parameter by reference")
    if not re.search(r"\breturn\b", right["python"]):
        errors.append("the right function in Python gives nothing back")
    if not any(o["code"]["cpp"].count("&") == 0 for o in choice["options"]):
        errors.append("no option forgets the & on every parameter")


def check_level4(sample, errors):
    params = sample["params"]
    case = params["case"]
    variables = 2 if case in ("scambia", "ordina") else 1
    if sample["answer"]["kind"] != "choice":
        errors.append("level 4 is a multiple choice")
    check_function(sample, errors, variables)
    tests = params["tests"]
    if len(tests) != 2:
        errors.append("level 4 is tried on two inputs")
    elif variables == 2:
        signs = sorted((int(a) > int(b)) - (int(a) < int(b)) for a, b in tests)
        if signs != [-1, 1]:
            errors.append("one pair in each order")
    call = "a, b" if variables == 2 else "a"
    for said in (f"è {case}({call}),", f"è {call} = {case}({call})", "In C++", "in Python"):
        if said not in sample["problem"]:
            errors.append(f"the question does not say how the function is called: {said}")


def check_level5(sample, errors):
    params = sample["params"]
    case = params["case"]
    answer = sample["answer"]
    name = params["name"]
    variables = 1 if case == "tetto" else 2
    if answer["kind"] != "program" or answer.get("needs") != ["funzione"]:
        errors.append("level 5 asks for a program with a function of its own")
        return
    check_function(sample, errors, variables)
    tests = params["tests"]
    if len(tests) != 3 or len({tuple(rows) for rows in params["expected"]}) != 3:
        errors.append("three tests that write three different things")
    elif case == "ordina":
        if sorted((int(a) > int(b)) - (int(a) < int(b)) for a, b in tests) != [-1, 0, 1]:
            errors.append("a pair in each order and one of two equal numbers")
    elif case == "riporto":
        if sorted(min(int(b) // params["per"], 2) for _a, b in tests) != [0, 1, 2] and sorted(int(b) // params["per"] > 0 for _a, b in tests) != [False, True, True]:
            errors.append("one test with nothing to carry and two with something")
    elif case == "tetto":
        if sorted(int(t[0]) + params["k"] > params["top"] for t in tests) != [False, False, True]:
            errors.append("two tests under the ceiling and one over")
    # the first test is one the program to start from does not pass as it is
    if tests and rows_of(params, [int(x) for x in tests[0]]) == params["expected"][0]:
        errors.append("the first test changes nothing")
    for language in ("python", "cpp"):
        given = bare(answer["start"][language], language)
        if re.search(rf"\b{name}\s*\(", given):
            errors.append(f"the {language} to start from already calls the function")
        if answer["start"][language].count("scrivi qui") != 2:
            errors.append(f"the {language} to start from has not a place for the function and one for the call")
        # the editor of a phone shows about 38 characters of a row
        if max(len(r) for r in answer["start"][language].split("\n")) > 38:
            errors.append(f"the {language} to start from has a row of more than 38 characters")
    if "input()" not in answer["start"]["python"] or "cin >>" not in answer["start"]["cpp"] or not re.search(r"Lettura e scrittura(, un numero per riga,)? ci sono già", sample["problem"]):
        errors.append("reading and writing are given, and the exercise says so")
    for said in (f"funzione {name}", "In C++", "in Python", "per riferimento", "restituisce"):
        if said not in sample["problem"]:
            errors.append(f"the exercise does not say: {said}")
    if "&" not in answer["solution"]["cpp"] or not re.search(r"\breturn [^;\n]", answer["solution"]["python"]):
        errors.append("the solution has a reference in C++ and gives back values in Python")


def check(sample):
    errors = common(sample)
    params = sample["params"]
    case = params.get("case")
    choice = choice_of(sample)
    if not choice or "program" not in params or not isinstance(choice.get("correct"), int):
        return errors + ["a sample of this generator has a multiple choice and a reference program"], case
    level = sample["level"]
    if len(sample["steps"]) not in (2, 3):
        errors.append("two or three steps")
    if "\n" in sample["solution"]:
        errors.append("the solution is one row")
    try:
        {1: check_level1, 2: check_level2, 3: check_level3, 4: check_level4, 5: check_level5}[level](sample, errors)
    except (KeyError, IndexError, TypeError, ValueError) as e:
        errors.append(f"params cannot be read: {e!r}")
    return errors, case
