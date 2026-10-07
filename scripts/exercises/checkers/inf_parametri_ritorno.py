"""Checker for inf-parametri-ritorno (specs/exercises/inf-parametri-ritorno.md), lesson 66 of informatica.

Written from the spec. Every program is run by Python (checkers/_inf_codice.py), and with INF_CPP=1 by the C++
compiler too. What each function gives back is said again here, in FUNCTIONS, and every answer is worked out from
the numbers in `params`:
- level 1: the number written is the function of the two values passed, in the order of the call, and the result
  with the two swapped is another number;
- level 2: the sum of two calls, a call kept in a variable and used in a sum, or a call inside a call;
- level 3: the rows written when a value is returned and dropped, printed inside the function, printed and
  returned, or followed by a print that is never reached;
- level 4: two selections on a function that returns true or false and calls another: the two words written;
- level 5: four functions shown alone, of which only the right one gives the numbers of its family;
- level 6: the solution passes three tests worked out here, and the answer must have a function of its own.
"""
import re

from checkers._inf_codice import choice_of, common, has, run_python

CASE_RANGES = {
    1: {"numeri": (0.25, 0.42), "variabili": (0.25, 0.42), "espressione": (0.25, 0.42)},
    2: {"somma": (0.25, 0.42), "variabile": (0.25, 0.42), "annidata": (0.25, 0.42)},
    3: {"perso": (0.18, 0.32), "stampa-dentro": (0.18, 0.32), "entrambe": (0.18, 0.32), "dopo-return": (0.18, 0.32)},
    4: {"vero-vero": (0.18, 0.32), "vero-falso": (0.18, 0.32), "falso-vero": (0.18, 0.32), "falso-falso": (0.18, 0.32)},
    5: {"punti": (0.18, 0.32), "durata": (0.18, 0.32), "voto": (0.18, 0.32), "resto": (0.18, 0.32)},
    6: {"punti": (0.18, 0.32), "durata": (0.18, 0.32), "voto": (0.18, 0.32), "maggiore": (0.18, 0.32)},
}

# what each function gives back for its two arguments and the number of its formula
FUNCTIONS = {
    "punti": lambda a, b, k: k * a + b,
    "durata": lambda a, b, k: 60 * a + b,
    "voto": lambda a, b, k: k * a - b,
    "netto": lambda a, b, k: a - b,
    "diff": lambda a, b, k: a - b,
    "totale": lambda a, b, k: a + b,
    "resto": lambda a, b, k: a - k * b,
    "maggiore": lambda a, b, k: max(a, b),
    "minore": lambda a, b, k: min(a, b),
}


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    case = params.get("case")
    choice = choice_of(sample)
    if not choice:
        return errors, case
    options = choice["options"]
    right = options[choice["correct"]]
    program = params.get("program")
    if not program:
        return errors + ["a level of this generator has no reference program"], case
    fn = params.get("fn")
    if fn not in FUNCTIONS:
        return errors + [f"unknown function {fn}"], case
    k = params.get("k", 1)
    of = lambda a, b: FUNCTIONS[fn](a, b, k)
    for language in ("python", "cpp"):
        if not has("funzione", program[language], language):
            errors.append(f"the program in {language} has no function that is defined and called")

    if level <= 4:
        if params["tests"] != [[]] or params.get("ask") != "output" or sample.get("code") != program:
            errors.append("the whole program is shown, reads nothing, and the question is what it writes")
    if level == 1:
        a, b = params["passed"]
        if params["expected"] != [[str(of(a, b))]]:
            errors.append(f"{fn}({a}, {b}) is {of(a, b)}, not {params['expected']}")
        if of(a, b) == of(b, a):
            errors.append("swapping the arguments does not change the result")
        elif str(of(b, a)) not in [o["values"][0] for o in options] and case != "espressione":
            errors.append("no option for the arguments taken in the other order")
        if "return" not in program["python"] or f"int {fn}(" not in program["cpp"]:
            errors.append("the function of level 1 returns its result")
    elif level == 2:
        calls = params["calls"]
        if case == "somma":
            want = of(*calls[0]) + of(*calls[1])
        elif case == "variabile":
            want = of(*calls[0]) * 2 + params["extra"] if params["times"] else of(*calls[0]) - params["extra"]
        else:
            want = of(of(*calls[0]), params["extra"])
            if "diff(diff(" not in program["python"]:
                errors.append("the case annidata has a call inside a call")
        if params["expected"] != [[str(want)]]:
            errors.append(f"the program should write {want}, not {params['expected']}")
        if program["python"].count("print(") != 1:
            errors.append("the result is written once, by the main program")
    elif level == 3:
        (a, b), (c, d) = params["calls"]
        r1, r2 = str(of(a, b)), str(of(c, d))
        want = {"perso": ["Fine"], "stampa-dentro": [r1, r2], "entrambe": ["Calcolo", "Calcolo", str(of(a, b) + of(c, d))], "dopo-return": [r1]}[case]
        if params["expected"] != [want]:
            errors.append(f"the case {case} writes {want}, not {params['expected']}")
        body = program["python"].split("\n\n")[0]
        shape = {
            "perso": "return" in body and "print" not in body,
            "stampa-dentro": "return" not in body and "print" in body and f"void {fn}(" in program["cpp"],
            "entrambe": body.index("print") < body.index("return") if "print" in body and "return" in body else False,
            "dopo-return": body.index("return") < body.index("print") if "print" in body and "return" in body else False,
        }[case]
        if not shape:
            errors.append(f"the function is not that of the case {case}")
        if r1 == r2:
            errors.append("the two calls give the same number")
    elif level == 4:
        limit, op, (yes, no) = params["limit"], params["op"], params["words"]
        holds = lambda x: x >= limit if op == ">=" else x > limit
        want = [yes if holds(of(a, b)) else no for a, b in params["pairs"]]
        if params["expected"] != [want]:
            errors.append(f"the two selections write {want}, not {params['expected']}")
        if "-".join("vero" if w == yes else "falso" for w in want) != case:
            errors.append(f"the answers {want} are not the case {case}")
        test = params["test"]
        if not re.search(rf"^def {test}\(.*\):\n    return {fn}\(.*\) {re.escape(op)} {limit}$", program["python"], re.M) or f"bool {test}(" not in program["cpp"]:
            errors.append("the second function returns the comparison of a call of the first")
        if sorted(o["values"][0] for o in options) != sorted("\n".join(p) for p in ([yes, yes], [yes, no], [no, yes], [no, no])):
            errors.append("the options are not the four pairs of answers")
    elif level == 5:
        pairs = params["pairs"]
        if params["expected"] != [[str(of(a, b)) for a, b in pairs]] or len(pairs) != 2:
            errors.append(f"the function {fn} does not give {params['expected']} on {pairs}")
        if not all("code" in o for o in options):
            errors.append("level 5 offers programs")
        else:
            for i, o in enumerate(options):
                if "print" in o["code"]["python"] or "main" in o["code"]["cpp"] or not o["code"]["python"].startswith("def "):
                    errors.append(f"option {i} does not show the function alone")
                if "return" not in o["code"]["python"]:
                    errors.append(f"option {i} does not return a value")
        if params["tests"] != [[]]:
            errors.append("a program that is read reads nothing")
    elif level == 6:
        answer = sample["answer"]
        if answer["kind"] != "program" or answer.get("needs") != ["funzione"]:
            errors.append("level 6 asks for a program with a function of its own")
        else:
            tests = params["tests"]
            if len(tests) != 3 or not all(len(t) == 2 for t in tests):
                errors.append("level 6 is tried on three pairs of numbers")
            elif [[str(of(int(a), int(b)))] for a, b in tests] != params["expected"]:
                errors.append(f"the function {fn} does not give {params['expected']} on {tests}")
            elif len({rows[0] for rows in params["expected"]}) != 3:
                errors.append("the three runs do not write three different numbers")
            elif case == "maggiore" and len({int(a) > int(b) for a, b in tests}) != 2:
                errors.append("the larger number is always on the same side")
            if "La lettura c’è già" not in sample["problem"] or f"{fn}(" not in sample["problem"] or "restituisce" not in sample["problem"]:
                errors.append("the reading is given, the function is named, and the exercise says so")
            if "input()" not in answer["start"]["python"] or "cin >>" not in answer["start"]["cpp"]:
                errors.append("the program to start from reads the two numbers")
            if "return" not in answer["solution"]["python"]:
                errors.append("the solution returns its result")
        if not all("code" in o for o in options):
            errors.append("the multiple choice of level 6 offers programs")
    return errors, case
