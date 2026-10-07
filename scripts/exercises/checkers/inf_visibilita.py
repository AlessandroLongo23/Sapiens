"""Checker for inf-visibilita (specs/exercises/inf-visibilita.md), lesson 67 "Variabili locali e globali".

Written from the spec. Every program is run by Python (checkers/_inf_codice.py), and with INF_CPP=1 by the C++
compiler too. What is proper to each level is worked out here again:
- where a variable lives is read from the Python text with `ast`: the parameters and the names assigned in a
  function are its locals, a name assigned above the first function is a global;
- level 1: the right option is the set of locals, the only name that stops the program when written at its end, or
  the part of the program where the name can be used;
- levels 2 and 3: what is written is worked out from the numbers in `params`, and the answers of who makes the
  mistakes of the lesson (the function changes the variable of the main program, the local remembers, the global is
  taken for a local) are among the options;
- level 4: only the right function works from its parameters alone, and one wrong function reads the global;
- level 5: the solution has a function with a local variable and a return and no global, and passes three runs
  worked out here from the formula of its family.
"""
import ast

from checkers._inf_codice import choice_of, common, run_python

THIRDS = (0.25, 0.42)
CASE_RANGES = {
    1: {"locali": THIRDS, "fuori": THIRDS, "dove": THIRDS},
    2: {"nascosta": THIRDS, "rinasce": THIRDS, "somma": THIRDS},
    3: {"cambia": THIRDS, "nasconde": THIRDS, "modifica": THIRDS},
    4: {"paga": THIRDS, "spesa": THIRDS, "tempo": THIRDS},
    5: {"punti": THIRDS, "sconto": THIRDS, "contatore": THIRDS},
}


def outline(code):
    """Where the names of a Python program live.

    functions: name -> params, locals (params and names assigned, but those declared global), loaded, declared,
    returns; main: how many times each name is assigned outside the functions; above: the names assigned before the
    first function; calls: how many times each function is called outside the functions.
    """
    tree = ast.parse(code)
    functions, main, above, calls = {}, {}, set(), {}
    for stmt in tree.body:
        if isinstance(stmt, ast.FunctionDef):
            params = [a.arg for a in stmt.args.args]
            assigned, loaded, declared, returns = set(), set(), set(), False
            for node in ast.walk(stmt):
                if isinstance(node, ast.Name):
                    (assigned if isinstance(node.ctx, ast.Store) else loaded).add(node.id)
                elif isinstance(node, ast.Global):
                    declared.update(node.names)
                elif isinstance(node, ast.Return) and node.value is not None:
                    returns = True
            functions[stmt.name] = {"params": params, "locals": set(params) | (assigned - declared), "loaded": loaded, "declared": declared, "returns": returns}
            continue
        for node in ast.walk(stmt):
            if isinstance(node, ast.Name) and isinstance(node.ctx, ast.Store):
                main[node.id] = main.get(node.id, 0) + 1
                if not functions:
                    above.add(node.id)
            elif isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
                calls[node.func.id] = calls.get(node.func.id, 0) + 1
    return functions, main, above, calls


def rows(*numbers):
    return "\n".join(str(n) for n in numbers)


def linear(k, sign, a, b):
    return k * a + sign * b


def alone(option):
    """Whether an option that is a program shows a function and nothing else."""
    code = option["code"]
    return code["python"].startswith("def ") and "print" not in code["python"] and "main" not in code["cpp"] and "cout" not in code["cpp"]


def own(function, names):
    """Whether a function works from its parameters alone: a local beside them, a return, nothing read from outside."""
    builtin = {"print", "int", "input"}
    return function["returns"] and function["locals"] - set(function["params"]) and not (function["loaded"] - function["locals"] - builtin - names)


def check_where(sample, errors):
    params = sample["params"]
    case = params["case"]
    choice = choice_of(sample)
    options = choice["options"]
    right = options[choice["correct"]]
    code = params["program"]["python"]
    functions, main, above, _calls = outline(code)
    everywhere = set().union(*(f["locals"] for f in functions.values()))
    if sample.get("code") != params["program"] or params.get("ask") or any("code" in o for o in options):
        errors.append("level 1 shows the whole program and offers texts")
    if case == "locali":
        fn = params["function"]
        if f"funzione {fn}" not in sample["problem"]:
            errors.append("the question does not name the function")
        said = [set(o["values"][0].split(", ")) for o in options]
        if [names == functions[fn]["locals"] for names in said] != [i == choice["correct"] for i in range(len(options))]:
            errors.append(f"the right option is not the locals of {fn}: {sorted(functions[fn]['locals'])}")
        if len(functions[fn]["locals"]) <= len(functions[fn]["params"]):
            errors.append("the function has no local beside its parameters")
    elif case == "fuori":
        for i, o in enumerate(options):
            name = o["values"][0]
            stops = run_python(f"{code}print({name})\n") is None
            if stops != (i == choice["correct"]):
                errors.append(f"writing {name} at the end {'stops' if stops else 'does not stop'} the program")
            if (name in everywhere) != (i == choice["correct"]) or (name in main) == (i == choice["correct"]):
                errors.append(f"{name} is not where its option says")
        if right["values"][0] != params["name"]:
            errors.append("the right option is not the name in params")
    elif case == "dove":
        name = params["name"]
        if len(functions) != 2 or f"variabile {name}?" not in sample["problem"]:
            errors.append("two functions and a question about one name")
        homes = [fn for fn, f in functions.items() if name in f["locals"]]
        if name in above and not homes:
            where = "tutto"
            # a global is read by both functions: it really is used everywhere
            if not all(name in f["loaded"] for f in functions.values()):
                errors.append("the global is not read by both functions")
        elif len(homes) == 1 and name not in main:
            where = f"funzione:{homes[0]}"
        else:
            where = None
        if right["values"][0] != where:
            errors.append(f"{name} can be used in {where}, and the right option says {right['values'][0]}")
        labels = {f"funzione:{fn}": f"solo nella funzione {fn}" for fn in functions}
        labels.update({"funzioni": "nelle due funzioni, ma non nel programma principale", "principale": "solo nel programma principale", "tutto": "nelle due funzioni e nel programma principale"})
        for o in options:
            if labels.get(o["values"][0]) != o["latex"]:
                errors.append(f"the option {o['latex']!r} does not say {o['values'][0]}")
        if where and where != "tutto" and "tutto" not in [o["values"][0] for o in options]:
            errors.append("the answer of who takes a local for a global is not offered")
    else:
        errors.append(f"unknown case {case}")


def check_output(sample, errors, expected, mistakes):
    """A level on what a program writes: the rows worked out here, and the mistakes of the lesson among the options."""
    params = sample["params"]
    choice = choice_of(sample)
    values = [o["values"][0] for o in choice["options"]]
    if sample.get("code") != params["program"] or params.get("ask") != "output":
        errors.append("the level shows the whole program and asks what it writes")
    if params["tests"] != [[]]:
        errors.append("a program that is read reads nothing")
    if params["expected"] != [expected.split("\n")]:
        errors.append(f"the program should write {expected.split()}, and the sample says {params['expected']}")
    if values[choice["correct"]] != expected:
        errors.append("the right option is not what is worked out from the numbers")
    for what, wrong in mistakes.items():
        if wrong == expected:
            errors.append(f"the mistake '{what}' writes what the program does")
        elif wrong not in values:
            errors.append(f"the answer of the mistake '{what}' is not offered")


def check_same_name(sample, errors):
    params = sample["params"]
    case, name = params["case"], params["name"]
    functions, main, above, calls = outline(params["program"]["python"])
    if len(functions) != 1:
        errors.append("level 2 has one function")
        return
    (fn, f), = functions.items()
    if name not in f["locals"] or name in f["declared"] or name not in main or name in above:
        errors.append(f"{name} is not a local of the function and a variable of the main program")
    if calls.get(fn) != 2:
        errors.append("the function is not called twice")
    start = params["start"]
    if case == "rinasce":
        base, (x, y) = params["from"], params["added"]
        check_output(sample, errors, rows(base + x, base + y, start), {"ricorda": rows(base + x, base + x + y, start), "cambia": rows(base + x, base + y, base + y)})
        return
    r1, r2 = (linear(params["k"], params["sign"], a, b) for a, b in params["calls"])
    if case == "nascosta":
        check_output(sample, errors, rows(start, r1, r2), {"cambia": rows(r2, r1, r2)})
    elif case == "somma":
        check_output(sample, errors, rows(start + r1 + r2), {"persa": rows(r1 + r2)})
    else:
        errors.append(f"unknown case {case}")


def check_global(sample, errors):
    params = sample["params"]
    case, name = params["case"], params["name"]
    program = params["program"]
    functions, main, above, calls = outline(program["python"])
    if len(functions) != 1:
        errors.append("level 3 has one function")
        return
    (fn, f), = functions.items()
    if name not in above:
        errors.append(f"{name} is not declared above the function")
    cpp_above = program["cpp"].split(f" {fn}(")[0]
    if f"int {name} = " not in cpp_above:
        errors.append(f"{name} is not declared above the function in C++")
    if case == "cambia":
        if name in f["locals"] or name not in f["loaded"] or main.get(name) != 2 or calls.get(fn) != 2:
            errors.append("the function reads a global that the main program changes between two calls")
        (g1, g2), (a, b), sign = params["values"], params["call"], params["sign"]
        r1, r2 = linear(g1, sign, a, b), linear(g2, sign, a, b)
        check_output(sample, errors, rows(r1, r2), {"uguale": rows(r1, r1)})
    elif case == "nasconde":
        if name not in f["locals"] or name in f["params"] or main.get(name) != 1:
            errors.append("the function has a local with the name of the global, and nobody changes the global")
        value = lambda b: linear(params["k"], params["sign"], params["a"], b)
        outer, inner = params["global"], params["local"]
        check_output(sample, errors, rows(value(inner), outer), {"cambia": rows(value(inner), inner), "legge": rows(value(outer), outer)})
    elif case == "modifica":
        if name not in f["declared"] or "global" in program["cpp"] or f"void {fn}(" not in program["cpp"] or calls.get(fn) != 2:
            errors.append("the function changes the global: with `global` in Python, without in C++")
        start, (x, y) = params["start"], params["added"]
        check_output(sample, errors, rows(start + x + y), {"locale": rows(start), "dimentica": rows(start + y)})
    else:
        errors.append(f"unknown case {case}")


def check_options(sample, errors):
    """Options that are programs, each shown by its function: only the right one works from its parameters alone."""
    params = sample["params"]
    choice = choice_of(sample)
    options = choice["options"]
    fn = params["function"]
    if not all("code" in o for o in options):
        errors.append("the options are not programs")
        return []
    found = []
    for i, o in enumerate(options):
        if not alone(o):
            errors.append(f"option {i} does not show the function alone")
        functions, _main, above, _calls = outline(o["values"][0])
        if list(functions) != [fn]:
            errors.append(f"option {i} is not a program with the function {fn}")
            continue
        found.append((i, functions[fn], above))
    return found


def check_without(sample, errors):
    params = sample["params"]
    choice = choice_of(sample)
    spare, value = params["global"]["name"], params["global"]["value"]
    if "code" in sample or params.get("ask") or sample["answer"]["kind"] != "choice":
        errors.append("level 4 is a choice among functions")
    if f"variabile globale {spare}, che vale {value}" not in sample["problem"] or "solo la funzione" not in sample["problem"]:
        errors.append("the question does not say what the global is and what is shown")
    calls = params["calls"]
    wanted = [[str(linear(params["k"], params["sign"], a, b)) for a, b in calls]]
    if len(calls) != 2 or params["tests"] != [[]] or params["expected"] != wanted:
        errors.append(f"the function of {params['case']} should give {wanted} on {calls}")
    reading = 0
    for i, f, above in check_options(sample, errors):
        if spare not in above or f"{spare} = {value}\n" not in choice["options"][i]["values"][0] or f"int {spare} = {value};" not in choice["options"][i]["values"][1]:
            errors.append(f"option {i}: the global is not above the function with its value")
        if i == choice["correct"]:
            if not own(f, set()):
                errors.append("the right function does not work from its parameters alone")
        elif spare in f["loaded"]:
            reading += 1
    if reading != 1:
        errors.append(f"{reading} wrong functions read the global")
    if sample.get("solutionCode") != choice["options"][choice["correct"]]["code"]:
        errors.append("the function of the solution is not the right option")


def check_write(sample, errors):
    params = sample["params"]
    case = params["case"]
    answer = sample["answer"]
    fn = params["function"]
    if answer["kind"] != "program" or answer.get("needs") != ["funzione"]:
        errors.append("level 5 asks for a program with a function of its own")
        return
    tests = params["tests"]
    if len(tests) != 3 or not all(len(t) == 2 for t in tests):
        errors.append("level 5 is tried on three pairs of numbers")
        return
    pairs = [(int(a), int(b)) for a, b in tests]
    if case == "contatore":
        least = params["least"]
        value = lambda a, b: (a >= least) + (b >= least)
        if f"almeno {least}" not in sample["problem"]:
            errors.append("the question does not say the threshold")
        # a mark equal to the threshold is tried: `>` in place of `>=` must fail
        if not any(least in pair for pair in pairs):
            errors.append("no run has a mark equal to the threshold")
    elif case in ("punti", "sconto"):
        k, sign = params["k"], params["sign"]
        if sign != {"punti": 1, "sconto": -1}[case] or str(k) not in sample["problem"]:
            errors.append("the question does not say the formula of its family")
        value = lambda a, b: linear(k, sign, a, b)
    else:
        errors.append(f"unknown case {case}")
        return
    if [[str(value(a, b))] for a, b in pairs] != params["expected"]:
        errors.append(f"the function of {case} does not give {params['expected']} on {tests}")
    elif len({r[0] for r in params["expected"]}) != 3:
        errors.append("the three runs do not write three different numbers")
    if any(int(r[0]) < 0 for r in params["expected"]):
        errors.append("a run writes a negative number")
    if "La lettura c'è già" not in sample["problem"] or f"funzione {fn}(" not in sample["problem"] or "variabile locale" not in sample["problem"]:
        errors.append("the exercise names the function, its local variable and the reading that is given")
    start = answer["start"]
    if start["python"].count("input()") != 2 or start["cpp"].count("cin >>") != 2 or f"{fn}(" in start["python"] or f"{fn}(" in start["cpp"]:
        errors.append("the program to start from reads the two numbers, one per row, and nothing else")
    functions, _main, above, calls = outline(answer["solution"]["python"])
    if list(functions) != [fn] or above or not own(functions[fn], set()) or calls.get(fn) != 1:
        errors.append("the solution is a function that works from its parameters alone, with a local and a return, called once")
    if sample.get("solutionCode") != params["program"]:
        errors.append("the solution shown is not the whole program")
    for i, f, above in check_options(sample, errors):
        if above or f["loaded"] - f["locals"]:
            errors.append(f"option {i} reads something from outside the function")


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    case = params.get("case")
    if not choice_of(sample) or len(choice_of(sample)["options"]) != 4:
        return errors, case
    if "program" not in params:
        return errors + ["no reference program"], case
    if case not in CASE_RANGES.get(level, {}):
        return errors + [f"the case {case} is not of level {level}"], case
    try:
        {1: check_where, 2: check_same_name, 3: check_global, 4: check_without, 5: check_write}[level](sample, errors)
    except (KeyError, SyntaxError, TypeError, ValueError) as e:
        errors.append(f"the sample cannot be read: {e!r}")
    return errors, case
