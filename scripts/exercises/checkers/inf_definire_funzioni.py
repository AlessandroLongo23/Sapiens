"""Checker for inf-definire-funzioni (specs/exercises/inf-definire-funzioni.md), lesson 65 of informatica.

Written from the spec. Every program is run by Python (checkers/_inf_codice.py), and with INF_CPP=1 by the C++
compiler too. On top of that, what each level asks is worked out again here from the data in `params`:
- level 1: the body of the function is written once for each call, and never before the first row of the main
  program; the right option is what Python prints;
- level 2: the right number is how many times the first row of the body is in what Python prints;
- level 3: the rows shown are what the reference writes, the options are programs shown from the function down, and
  one of the wrong ones never runs its function;
- level 4: the rows are the symbol repeated as many times as each argument is worth;
- level 5: what the solution writes for each n, rebuilt from the task, and the answer must have a function.
"""
import re

from checkers._inf_codice import choice_of, common, has, run_python

CASE_RANGES = {
    1: {"una": (0.40, 0.60), "due": (0.40, 0.60)},
    2: {"solo-ciclo": (0.25, 0.42), "anche-fuori": (0.25, 0.42), "due-nel-ciclo": (0.25, 0.42)},
    3: {"una": (0.40, 0.60), "due": (0.40, 0.60)},
    4: {"numeri": (0.25, 0.42), "variabile": (0.25, 0.42), "espressione": (0.25, 0.42)},
    5: {"ripeti": (0.25, 0.42), "cornice": (0.25, 0.42), "alterna": (0.25, 0.42)},
}


def written_by_task(case, body, word, n):
    """What the program of level 5 must write for n, said again here."""
    if case == "ripeti":
        return body * n
    if case == "cornice":
        return body + [word] * n + body
    return (([word] + body) * n) if case == "alterna" else None


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
    fn = params.get("fn", "")
    for language in ("python", "cpp"):
        if not has("funzione", program[language], language):
            errors.append(f"the program in {language} has no function that is defined and called")
    if not re.search(rf"^def {fn}\(", program["python"], re.M) or not re.search(rf"^void {fn}\(", program["cpp"], re.M):
        errors.append(f"the function {fn} is not defined before the main program, without a value to give back")
    printed = run_python(program["python"], params["tests"][0]) or []

    if level in (1, 2, 3, 4) and params["tests"] != [[]]:
        errors.append("a program that is read reads nothing")
    if level in (1, 2, 4) and sample.get("code") != program:
        errors.append("the whole program is shown")

    if level == 1:
        body = params["body"]
        calls = len(re.findall(rf"^{fn}\(\)$", program["python"], re.M))
        if params.get("ask") != "output" or not all("listing" in o for o in options):
            errors.append("level 1 asks what the program writes, in rows")
        if calls != params["calls"] or calls != {"una": 1, "due": 2}[case]:
            errors.append(f"{calls} calls for the case {case}")
        if printed.count(body[0]) != calls:
            errors.append("the body is not written once for each call")
        if printed[: len(body)] == body:
            errors.append("the function is called before anything else is written")
        # the mistake of the lesson is among the options: the function run where it is defined
        rest = [row for row in printed if row not in body]
        if not any(o["values"][0] in ("\n".join(body + rest), "\n".join(rest)) for o in options if o is not right):
            errors.append("no option for the function run at its definition, or never run")
    elif level == 2:
        count = printed.count(params["body"][0])
        if right["values"] != [str(count)] or params["count"] != count:
            errors.append(f"the body runs {count} times, and the right option says {right['values']}")
        if not 2 <= params["turns"] <= 5 or f"range({params['turns']})" not in program["python"]:
            errors.append("a loop of 2 to 5 turns")
        expected = {"solo-ciclo": params["turns"], "anche-fuori": params["turns"] + 1, "due-nel-ciclo": 2 * params["turns"]}[case]
        if count != expected:
            errors.append(f"the case {case} with {params['turns']} turns has {expected} calls, not {count}")
        if fn not in sample["problem"]:
            errors.append("the question does not name the function")
        if not all(re.fullmatch(r"\d+", o["values"][0]) for o in options):
            errors.append("the options of level 2 are numbers")
    elif level == 3:
        if sample.get("listing", "").rstrip("\n").split("\n") != printed or params["target"] != printed:
            errors.append("the rows shown are not what the right program writes")
        if not all("code" in o for o in options):
            errors.append("level 3 offers programs")
        else:
            for i, o in enumerate(options):
                if "#include" in o["code"]["cpp"] or "main" not in o["code"]["cpp"] or "def " not in o["code"]["python"]:
                    errors.append(f"option {i} is not shown from the function down")
            silent = [o for o in options if params["body"][0] not in (run_python(o["values"][0]) or [])]
            if not silent:
                errors.append("no option with a function that is never called")
        if printed.count(params["body"][0]) != {"una": 1, "due": 2}[case]:
            errors.append(f"the body is not written as many times as the case {case} says")
    elif level == 4:
        values = params["values"]
        if not all(1 <= v <= 10 for v in values) or not 2 <= len(values) <= 3:
            errors.append("two or three arguments from 1 to 10")
        if printed != [params["symbol"] * v for v in values]:
            errors.append(f"the rows are not the symbol repeated {values} times")
        if params.get("ask") != "output" or not re.search(rf"^def {fn}\(n\):", program["python"], re.M) or f"void {fn}(int n)" not in program["cpp"]:
            errors.append("level 4 shows a function with the parameter n and asks what it writes")
        calls = re.findall(rf"^{fn}\((.+)\)$", program["python"], re.M)
        kinds = {"numeri": all(c.isdigit() for c in calls), "variabile": any(re.fullmatch(r"[a-z]+", c) for c in calls), "espressione": any(re.fullmatch(r"\d+ [*+] \d+", c) for c in calls)}
        if not kinds[case]:
            errors.append(f"the calls {calls} are not of the case {case}")
    elif level == 5:
        answer = sample["answer"]
        if answer["kind"] != "program" or answer.get("needs") != ["funzione"]:
            errors.append("level 5 asks for a program with a function of its own")
        else:
            ns = [int(t[0]) for t in params["tests"]]
            if len(ns) != 3 or len(set(ns)) != 3 or not all(1 <= n <= 4 for n in ns):
                errors.append("level 5 is tried on three different values of n from 1 to 4")
            elif [written_by_task(case, params["body"], params["word"], n) for n in ns] != params["expected"]:
                errors.append(f"the task {case} does not write {params['expected']}")
            if "La lettura c’è già" not in sample["problem"] or f"{fn}()" not in sample["problem"] or "input()" not in answer["start"]["python"] or "cin >>" not in answer["start"]["cpp"]:
                errors.append("the reading is given, the function is named, and the exercise says so")
            if not all(row in sample["problem"] for row in params["body"]):
                errors.append("the exercise does not say what the function writes")
        if not all("code" in o for o in options):
            errors.append("the multiple choice of level 5 offers programs")
    return errors, case
