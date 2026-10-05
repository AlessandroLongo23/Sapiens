"""Checker for inf-condizioni (specs/exercises/inf-condizioni.md).

Written from the spec. Conditions are evaluated here by Python, programs are run by Python
(checkers/_inf_programmi.py), the words of a task are read here (checkers/_inf_sel.py):
- level 1: of four conditions exactly one has the value asked for, with the values the problem gives;
- level 2: the condition of a threshold said in words; the value where two conditions differ; the value that makes
  a condition true or false;
- level 3: a chart with one selection; what it writes on an input, or the only input of four that makes it write a
  given text;
- level 4: a comparison of texts, = and ==, what the two languages print for a condition, decimals;
- level 5: a chart to build from a task in words, with a multiple choice of charts;
- level 6: a boolean variable to give its condition to, in a program written by hand in the two languages and
  printed as 1 or 0: the Python is run here on every test.
"""
import re

from checkers._inf_programmi import choice_of, common, run_python
from checkers._inf_sel import RULE, WORDS, all_options, check_edges, check_input_choice, check_open, check_options, check_said, check_tariff, check_written, one_of_four, selections, value

CASE_RANGES = {
    1: {"una": (0.55, 0.75), "due": (0.25, 0.45)},
    2: {"frase": (0.37, 0.53), "confine": (0.18, 0.32), "valori": (0.22, 0.38)},
    4: {"testi": (0.22, 0.38), "assegna": (0.18, 0.32), "stampa": (0.18, 0.32), "virgola": (0.13, 0.27)},
    6: {"una": (0.50, 0.70), "due": (0.30, 0.50)},
}

# the rule of a comparison between two variables, as the task says it
TWO = {
    "i punti superano il record": ">",
    "i punti raggiungono o superano il record": ">=",
    "le monete sono almeno quanto il prezzo": ">=",
    "le monete sono più del prezzo": ">",
    "il peso non supera il limite": "<=",
    "il peso è sotto il limite": "<",
    "il tentativo è uguale al numero segreto": "==",
    "i due prezzi sono diversi": "!=",
}


def plain(text):
    return text.replace("\\", "")


def level1(sample, params, choice):
    env = params["env"]
    errors = one_of_four(choice, params["ask"], lambda c: value(c, env)) + check_said(sample, env, params["ask"])
    if (len(env) == 1) != (params["case"] == "una"):
        errors.append("the case does not match the variables")
    if len(env) == 1:
        (x,) = env.values()
        if not any(re.search(rf" {x}$", o["values"][0]) for o in choice["options"]):
            errors.append("no option compares the variable with its own value")
    return errors


def level2(sample, params, choice):
    case, name = params["case"], params["name"]
    right = choice["options"][choice["correct"]]["values"][0]
    problem = plain(sample["problem"])
    errors = []
    if case == "frase":
        rules = RULE.findall(problem)
        if len(rules) != 1 or int(rules[0][1]) != params["k"]:
            return ["the problem does not say one threshold"]
        k = params["k"]
        expected = f"{name} {WORDS[rules[0][0]][0]} {k}"
        if right != expected:
            errors.append(f"the condition of the words is {expected}")
        around = [{name: n} for n in (k - 1, k, k + 1)]
        for i, o in enumerate(choice["options"]):
            truths = [value(o["values"][0], env) for env in around]
            if i != choice["correct"] and truths == [value(expected, env) for env in around]:
                errors.append(f"option {i} says the same as the right one")
    elif case == "confine":
        c1, c2 = params["conditions"]
        if c1 not in problem or c2 not in problem:
            errors.append("the problem does not show the two conditions")
        for i, o in enumerate(choice["options"]):
            v = o["values"][0]
            differ = v != "nessuno" and value(c1, {name: int(v)}) != value(c2, {name: int(v)})
            if differ != (i == choice["correct"]):
                errors.append(f"option {i}: the two conditions {'differ' if differ else 'agree'} there")
    else:
        if params["condition"] not in problem or f"è {'vera' if params['ask'] else 'falsa'}?" not in problem:
            errors.append("the problem does not show the condition and the value asked for")
        errors += one_of_four(choice, params["ask"], lambda v: value(params["condition"], {name: int(v)}))
    return errors


def level4(sample, params, choice):
    case = params["case"]
    right = choice["options"][choice["correct"]]
    errors = []
    if case == "testi":
        env = params["env"]
        errors += one_of_four(choice, params["ask"], lambda c: value(c, env)) + check_said(sample, env, params["ask"])
    elif case == "assegna":
        a, b = params["names"]
        p, q = params["env"][a], params["env"][b]
        line = params["line"]
        if line not in plain(sample["problem"]) or f"{a} vale {p} e {b} vale {q}" not in sample["problem"]:
            errors.append("the problem does not show the line and the values")
        if line == f"{a} == {b}":
            expected = f"{p},{q},{'vero' if p == q else 'falso'}"
        elif line == f"{a} = {b}":
            expected = f"{q},{q},-"
            if right["text"] != f"{a} vale {q} e {b} vale {q}":
                errors.append("the right option does not say the values after the assignment")
        else:
            return ["the line is neither an assignment nor a comparison"]
        if right["values"][0] != expected:
            errors.append(f"after the line: {expected}")
    elif case == "stampa":
        v = value(params["condition"], params["env"])
        expected = "True|1" if v else "False|0"
        if right["values"][0] != expected or right["text"] != ("True in Python, 1 in C++" if v else "False in Python, 0 in C++"):
            errors.append(f"the two languages write {expected}")
        if run_python(sample["code"]["python"]) != [str(v)]:
            errors.append("the Python shown does not print that")
        if f"cout << ({params['condition']}) << endl;" not in sample["code"]["cpp"]:
            errors.append("the C++ shown does not print the condition")
    elif case == "virgola":
        if params["ask"] == "valore":
            p, q, r = (float(x) for x in params["sum"])
            if p + q == r:
                errors.append("this sum is exact: the comparison is true")
            if right["values"][0] != "falso:memoria":
                errors.append("the comparison is false, for the error of the binary writing")
        elif right["values"][0] != "distanza":
            errors.append("decimals are compared by their distance")
    else:
        errors.append("unknown case")
    return errors


def level6(sample, params, choice):
    answer = sample["answer"]
    if answer["kind"] != "program":
        return ["level 6 asks for a program"]
    names, flag, tests = params["names"], params["flag"], params["tests"]
    problem = plain(sample["problem"])
    errors = []
    if params["case"] == "una":
        rules = RULE.findall(problem)
        if len(rules) != 1 or int(rules[0][1]) != params["k"]:
            return ["the problem does not say one threshold"]
        condition = f"{names[0]} {WORDS[rules[0][0]][0]} {params['k']}"
    else:
        said = [op for words, op in TWO.items() if f"quando {words}," in problem]
        if len(said) != 1:
            return ["the problem does not say the rule"]
        condition = f"{names[0]} {said[0]} {names[1]}"
    expected = ["1" if value(condition, dict(zip(names, t))) else "0" for t in tests]
    if set(expected) != {"0", "1"}:
        errors.append("the tests do not take both values")
    if [t["input"] for t in answer["tests"]] != ["".join(f"{x}\n" for x in t) for t in tests] or [t["output"] for t in answer["tests"]] != [e + "\n" for e in expected]:
        errors.append("the tests of the answer are not those of the rule")
    if [run_python(answer["solution"]["python"], t) for t in tests] != [[e] for e in expected]:
        errors.append("the Python of the solution does not pass the tests")
    started = [run_python(answer["start"]["python"], t) for t in tests]
    if started != [["0"]] * len(tests):
        errors.append("the Python to start from does not always print 0")
    for lang, false in (("python", "False"), ("cpp", "false")):
        if "scrivi qui" not in answer["start"][lang] or f"{flag} = {false}" not in answer["start"][lang]:
            errors.append(f"the {lang} to start from has no place to write")
    if f"bool {flag} = {condition};" not in answer["solution"]["cpp"] or f"cout << {flag} << endl;" not in answer["solution"]["cpp"] or f"cin >> {' >> '.join(names)};" not in answer["solution"]["cpp"]:
        errors.append("the C++ of the solution is not the same program")
    right = choice["options"][choice["correct"]]["values"][0]
    if right != condition:
        errors.append(f"the condition of the rule is {condition}")
    for i, o in enumerate(choice["options"]):
        got = [value(o["values"][0], dict(zip(names, t))) for t in tests]
        if i != choice["correct"] and None not in got and ["1" if g else "0" for g in got] == expected:
            errors.append(f"option {i} passes the tests too")
    return errors


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    choice = choice_of(sample)
    if level == 1:
        return errors + level1(sample, params, choice), params["case"]
    if level == 2:
        return errors + level2(sample, params, choice), params["case"]
    if level == 4:
        return errors + level4(sample, params, choice), params["case"]
    if level == 6:
        return errors + level6(sample, params, choice), params["case"]
    source = params["source"]
    if selections(source) != 1:
        errors.append("the reference program has not one selection")
    errors += check_edges(sample) + check_options(sample)
    if level == 3:
        if "chart" not in sample or "code" in sample:
            errors.append("level 3 shows a chart")
        errors += check_written(sample) if params["ask"] == "scrive" else check_input_choice(sample)
        return errors, None
    errors += check_tariff(sample["problem"], source) + check_open(sample, "chart")
    if not all_options(sample, "chart"):
        errors.append("level 5 offers charts")
    return errors, None
