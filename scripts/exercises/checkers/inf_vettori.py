"""Checker for inf-vettori (specs/exercises/inf-vettori.md), the exercises of the lesson "I vettori".

Written from the spec. Every program is run by Python (checkers/_inf_codice.py), and with INF_CPP=1 by the C++
compiler too. What is proper to each level is worked out again here, from the numbers in `params`:
- level 1: the index, the size or the element asked for in words;
- level 2: the rows of the program on single elements, followed here on the vector;
- level 3: the value the loop leaves, from where it starts and where it stops;
- level 4: four loops shown alone; the right one leaves the sum, the count or the largest element;
- level 5: what is written after a function has received the vector, or one of its elements;
- level 6: the program to write passes its three runs, worked out here, and must have a vector.
"""
import re

from checkers._inf_codice import choice_of, common, has

CASE_RANGES = {
    1: {"ultimo": (0.18, 0.32), "dimensione": (0.18, 0.32), "fuori": (0.18, 0.32), "posto": (0.18, 0.32)},
    2: {"leggi": (0.25, 0.42), "scrivi": (0.25, 0.42), "ultimo": (0.25, 0.42)},
    3: {"somma": (0.25, 0.42), "conta": (0.25, 0.42), "massimo": (0.25, 0.42)},
    4: {"somma": (0.25, 0.42), "conta": (0.25, 0.42), "massimo": (0.25, 0.42)},
    5: {"modifica": (0.25, 0.42), "numero": (0.25, 0.42), "restituisce": (0.25, 0.42)},
    6: {"rovescia": (0.25, 0.42), "sopra-ultimo": (0.25, 0.42), "differenze": (0.25, 0.42)},
}

NAMES = {"voti", "punti", "passi", "tempi", "pesi", "gol"}
ORDINALS = ["primo", "secondo", "terzo", "quarto", "quinto", "sesto", "settimo", "ottavo"]


def label(option):
    return option.get("text") or option.get("latex")


def check_words(sample, errors):
    params = sample["params"]
    choice = choice_of(sample)
    case, name, n = params["case"], params["name"], params["n"]
    labels = [label(o) for o in choice["options"]]
    right = labels[choice["correct"]]
    problem = sample["problem"]
    if name not in NAMES or name not in problem:
        errors.append("the vector of the question has no name")
    if "program" in params or "code" in sample:
        errors.append("level 1 is in words")
    if case == "ultimo":
        want = str(n - 1)
        if f"dimensione {n}" not in problem:
            errors.append("the size is not in the question")
    elif case == "dimensione":
        want = str(n)
        if f"da 0 a {n - 1}" not in problem:
            errors.append("the last index is not in the question")
    elif case == "fuori":
        want = f"{name}[{n}]"
        if f"dimensione {n}" not in problem:
            errors.append("the size is not in the question")
        # the other three exist: their indices are inside the vector
        for i, text in enumerate(labels):
            m = re.fullmatch(rf"{name}\[(\d+)\]", text)
            if not m:
                errors.append(f"option {i} is not an element of the vector")
            elif i != choice["correct"] and not 0 <= int(m.group(1)) < n:
                errors.append(f"option {i}: a wrong option that does not exist either")
    elif case == "posto":
        place = params["place"]
        want = f"{name}[{place - 1}]"
        if not 2 <= place <= 8 or f"suo {ORDINALS[place - 1]} elemento" not in problem or place > n:
            errors.append("the place asked for is not in the question, or not in the vector")
    else:
        errors.append(f"unknown case {case}")
        return
    if right != want:
        errors.append(f"the right option is {right}, and it should be {want}")
    if sample["solution"] != want:
        errors.append("the solution is not the right option")
    if not 3 <= n <= 60:
        errors.append("a size out of range")


def follow(vector, ops):
    """What the rows of a program on single elements print, followed here: None when an index is outside."""
    w = list(vector)
    index = lambda ix: len(w) - 1 if ix == "last" else ix
    rows = []
    for o in ops:
        used = (o["terms"] if o["op"] == "print" else [o["at"], o["from"]])
        if any(not 0 <= index(ix) < len(w) for ix in used):
            return None
        if o["op"] == "print":
            rows.append(str(sum(w[index(ix)] for ix in o["terms"])))
        else:
            w[index(o["at"])] = w[index(o["from"])] + o["plus"]
    return rows


def loop_value(case, vector, k, start=0, short=False):
    """The value left by the loop of a family that goes from index `start` to the end, or to one element before it."""
    stop = len(vector) - (1 if short else 0)
    if case == "somma":
        return sum(vector[start:stop])
    if case == "conta":
        return sum(1 for x in vector[start:stop] if x > k)
    if case == "massimo":
        # it starts from the first element, whatever the first index of the loop
        return max([vector[0]] + vector[max(start, 1):stop])
    raise ValueError(case)


def good_vector(v, lo, hi, sizes):
    return len(v) in sizes and len(set(v)) == len(v) and all(isinstance(x, int) and lo <= x <= hi for x in v)


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    case = params.get("case")
    choice = choice_of(sample)
    if not choice:
        return errors, case
    options = choice["options"]
    if level == 1:
        check_words(sample, errors)
        return errors, case
    program = params.get("program")
    if not program:
        return errors + ["a level with programs has no reference program"], case
    expected = params["expected"]

    # the vector of `params` is the one written in the program, in the two languages
    if "vector" in params:
        v = params["vector"]
        if str(v) not in program["python"] or "{" + ", ".join(map(str, v)) + "}" not in program["cpp"]:
            errors.append("the vector of params is not the one of the program")
        if f"const int N = {len(v)};" not in program["cpp"]:
            errors.append("the size of the array is not the constant N")

    if level in (2, 3, 5):
        if "code" not in sample or params.get("ask") != "output" or sample["code"] != program:
            errors.append("the level shows a whole program and asks what it writes")
        if params["tests"] != [[]]:
            errors.append("a program that is read reads nothing")
        for language in ("python", "cpp"):
            if not has("vettore", program[language], language):
                errors.append(f"the program in {language} has no vector")
        if params.get("name") not in NAMES:
            errors.append("the vector has no name of the list")

    if level == 2:
        v = params["vector"]
        if not good_vector(v, 2, 9, (4, 5)):
            errors.append("a vector of 4 or 5 different numbers from 2 to 9")
        rows = follow(v, params["ops"])
        if rows is None:
            errors.append("an index falls outside the vector")
        elif expected != [rows]:
            errors.append(f"on {v} the rows write {rows}, and the sample says {expected}")
        kinds = [o["op"] for o in params["ops"]]
        if kinds != {"leggi": ["print", "print"], "scrivi": ["set", "print", "print"], "ultimo": ["set", "print", "print"]}.get(case):
            errors.append(f"the rows are not those of {case}")
        if case == "ultimo" and "N - 1" not in program["cpp"]:
            errors.append("the last element is not written with the size")

    if level == 3:
        v, k = params["vector"], params["k"]
        if not good_vector(v, 2, 12, (5, 6)):
            errors.append("a vector of 5 or 6 different numbers from 2 to 12")
        start, short = params["from"], params["short"]
        if case == "massimo" and (start != 1 or short):
            errors.append("the loop of the largest goes from 1 to the end")
        if start not in (0, 1) or (start == 1 and short):
            errors.append("the loop starts from 0 or 1, or stops one element early")
        value = loop_value(case, v, k, start, short)
        if expected != [[str(value)]]:
            errors.append(f"the loop leaves {value}, and the sample says {expected}")
        if not has("ciclo", program["python"], "python"):
            errors.append("no loop")
        if case == "conta" and k not in v:
            errors.append("k is one of the elements")

    if level == 4:
        v, k = params["vector"], params["k"]
        if not good_vector(v, 2, 12, (4, 5, 6)):
            errors.append("a vector of 4 to 6 different numbers from 2 to 12")
        if ", ".join(map(str, v)) not in sample["problem"] or params.get("name") not in sample["problem"]:
            errors.append("the vector is not in the question")
        value = loop_value(case, v, k)
        if expected != [[str(value)]]:
            errors.append(f"the right loop leaves {value}, and the sample says {expected}")
        if not all("code" in o for o in options):
            errors.append("level 4 offers programs")
        for i, o in enumerate(options):
            shown = o.get("code", {})
            if "print" in shown.get("python", "print") or "cout" in shown.get("cpp", "cout") or "main" in shown.get("cpp", "main"):
                errors.append(f"option {i} does not show the loop alone")
            elif not has("ciclo", shown["python"], "python") or not has("ciclo", shown["cpp"], "cpp"):
                errors.append(f"option {i} has no loop")
        if sample.get("solutionCode") != options[choice["correct"]].get("code"):
            errors.append("the loop of the solution is not the right option")

    if level == 5:
        v, k = params["vector"], params["k"]
        if not good_vector(v, 2, 12, (4, 5)):
            errors.append("a vector of 4 or 5 different numbers")
        for language in ("python", "cpp"):
            if not has("funzione", program[language], language):
                errors.append(f"the program in {language} has no function")
        if case == "restituisce":
            value = sum(1 for x in v if x > k)
        elif case in ("modifica", "numero"):
            x = v[params["index"]]
            changed = x * k if params["operation"] == "*" else x + k
            value = changed if case == "modifica" else x
            # the function receives the whole vector, or one element of it
            call = re.search(r"^\w+\((\w+)(\[\d+\])?\)$", program["python"], re.M)
            if not call or bool(call.group(2)) != (case == "numero"):
                errors.append(f"the call is not that of {case}")
            if str(changed) == str(x):
                errors.append("the function changes nothing")
        else:
            errors.append(f"unknown case {case}")
            value = None
        if value is not None and expected != [[str(value)]]:
            errors.append(f"the program writes {value}, and the sample says {expected}")

    if level == 6:
        answer = sample["answer"]
        n = params.get("n")
        if answer["kind"] != "program" or answer.get("needs") != ["vettore"]:
            errors.append("level 6 asks for a program with a vector")
        elif n not in (5, 6) or f"legge {n} numeri" not in sample["problem"]:
            errors.append("the program reads 5 or 6 numbers, and the exercise says how many")
        else:
            tests = [[int(x) for x in t] for t in params["tests"]]
            if len(tests) != 3 or not all(len(t) == n and len(set(t)) == n for t in tests):
                errors.append("three runs of n different numbers")
            else:
                work = {
                    "rovescia": lambda t: [str(x) for x in reversed(t)],
                    "sopra-ultimo": lambda t: [str(sum(1 for x in t if x > t[-1]))],
                    "differenze": lambda t: [str(max(t) - x) for x in t],
                }.get(case)
                if not work:
                    errors.append(f"unknown case {case}")
                elif [work(t) for t in tests] != expected:
                    errors.append(f"the program of {case} does not write {expected} on {tests}")
                if len({" ".join(rows) for rows in expected}) != 3:
                    errors.append("the three runs do not write three different things")
            for language in ("python", "cpp"):
                if has("vettore", answer["start"][language], language) or has("ciclo", answer["start"][language], language):
                    errors.append(f"the {language} to start from is not empty")
        if not all("code" in o for o in options):
            errors.append("the multiple choice of level 6 offers programs")
        for i, o in enumerate(options):
            if "input" in o.get("code", {}).get("python", "input") or "cin" in o.get("code", {}).get("cpp", "cin"):
                errors.append(f"option {i} shows the reading too")
    return errors, case
