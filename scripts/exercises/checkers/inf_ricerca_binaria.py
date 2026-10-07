"""Checker for inf-ricerca-binaria (specs/exercises/inf-ricerca-binaria.md): binary search, lesson 74.

Written from the spec. Every program is run by Python (checkers/_inf_codice.py), and with INF_CPP=1 by the C++
compiler too. What is proper to each level is worked out again here, from the vector and the values in `params`:
- level 1: the middle of the turn and the half that is kept, from `sinistra` and `destra`;
- level 2: the two indices the program of the lesson writes;
- level 3: how many elements the search looks at, and at most on n elements;
- level 4: four bodies of the loop, shown alone; the right one gives back what its family says on every value;
- level 5: the solution passes its four tests, worked out here, and the answer must have a function of its own.
"""
import re

from checkers._inf_codice import choice_of, common, has

CASE_RANGES = {
    1: {"destra": (0.32, 0.48), "sinistra": (0.32, 0.48), "trovato": (0.14, 0.26)},
    2: {"presente": (0.42, 0.58), "assente": (0.42, 0.58)},
    3: {"trovato": (0.32, 0.48), "assente": (0.32, 0.48), "massimo": (0.14, 0.26)},
    4: {"crescente": (0.25, 0.42), "decrescente": (0.25, 0.42), "confronti": (0.25, 0.42)},
    5: {"crescente": (0.42, 0.58), "decrescente": (0.42, 0.58)},
}


def search(v, x, decreasing=False):
    """Binary search as the lesson does it: (index or -1, the indices looked at in order)."""
    left, right = 0, len(v) - 1
    looked = []
    while left <= right:
        mid = (left + right) // 2
        looked.append(mid)
        if v[mid] == x:
            return mid, looked
        if (v[mid] > x) if decreasing else (v[mid] < x):
            left = mid + 1
        else:
            right = mid - 1
    return -1, looked


def increasing(v):
    return all(a < b for a, b in zip(v, v[1:]))


def table(v):
    return "indice" + "".join(f"{i:3d}" for i in range(len(v))) + "\nvalore" + "".join(f"{x:3d}" for x in v) + "\n"


def numbers_in(text):
    return [int(n.replace(" ", "")) for n in re.findall(r"\d[\d ]*\d|\d", text)]


def check_turn(sample, errors):
    params = sample["params"]
    v, x, left, right = params["vector"], params["x"], params["sinistra"], params["destra"]
    choice = choice_of(sample)
    if not (7 <= len(v) <= 11 and increasing(v)):
        errors.append("level 1 wants an increasing vector of 7 to 11 numbers")
    if sample.get("listing") != table(v):
        errors.append("the vector shown is not the vector of params")
    if not 0 <= left <= right < len(v) or right - left < 2:
        errors.append("a turn with at least three elements left")
    # the turn must be one the search of x really gets to
    l, r, reached = 0, len(v) - 1, False
    while l <= r:
        if (l, r) == (left, right):
            reached = True
            break
        m = (l + r) // 2
        if v[m] == x:
            break
        if v[m] < x:
            l = m + 1
        else:
            r = m - 1
    if not reached:
        errors.append("the search of x never has those two indices")
    mid = (left + right) // 2
    if v[mid] == x:
        want, case = f"{mid}|trovato", "trovato"
    elif v[mid] < x:
        want, case = f"{mid}|sinistra|{mid + 1}", "destra"
    else:
        want, case = f"{mid}|destra|{mid - 1}", "sinistra"
    if choice["options"][choice["correct"]]["values"] != [want]:
        errors.append(f"the right outcome is {want}")
    if params["case"] != case:
        errors.append(f"the case is {case}")
    if [x, left, right] != numbers_in(sample["problem"])[:3]:
        errors.append("the question does not give x, sinistra and destra")
    for i, o in enumerate(choice["options"]):
        parts = o["values"][0].split("|")
        said = [int(n) for n in re.findall(r"\d+", o["text"])]
        if said != [int(n) for n in parts if re.fullmatch(r"-?\d+", n)] or (parts[1] != "trovato" and parts[1] not in o["text"]):
            errors.append(f"option {i} does not say what its value holds")


def check_count(sample, errors):
    params = sample["params"]
    choice = choice_of(sample)
    right = choice["options"][choice["correct"]]["values"][0]
    if params["case"] == "massimo":
        n = params["n"]
        most, m = 0, n
        while m >= 1:
            most, m = most + 1, m // 2
        if most != n.bit_length() or right != str(most):
            errors.append(f"at most {most} comparisons on {n} elements")
        if numbers_in(sample["problem"])[:1] != [n] or "listing" in sample:
            errors.append("the question gives the size and no vector")
        return
    v, x = params["vector"], params["x"]
    if not (7 <= len(v) <= 12 and increasing(v)):
        errors.append("level 3 wants an increasing vector of 7 to 12 numbers")
    if sample.get("listing") != table(v):
        errors.append("the vector shown is not the vector of params")
    at, looked = search(v, x)
    if (at >= 0) != (params["case"] == "trovato"):
        errors.append("the case does not say whether x is there")
    if right != str(len(looked)):
        errors.append(f"the search looks at {len(looked)} elements")
    if len(looked) == (at + 1 if at >= 0 else len(v)):
        errors.append("the linear search needs as many comparisons")
    if numbers_in(sample["problem"])[:1] != [x]:
        errors.append("the question does not name x")


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    case = params.get("case")
    choice = choice_of(sample)
    if not choice:
        return errors, case
    options = choice["options"]
    if level in (1, 3):
        if "program" in params or any("code" in o for o in options):
            errors.append("a level of text has no program")
        (check_turn if level == 1 else check_count)(sample, errors)
        return errors, case
    if "program" not in params:
        return errors + ["a level with programs has no reference program"], case
    program = params["program"]
    v = params["vector"]
    decreasing = case == "decrescente"
    if not increasing(v[::-1] if decreasing else v):
        errors.append(f"the vector is not in {'decreasing' if decreasing else 'increasing'} order")
    written = ", ".join(str(x) for x in v)
    if f"[{written}]" not in program["python"] or f"{{{written}}}" not in program["cpp"]:
        errors.append("the vector of the program is not the vector of params")
    for language in ("python", "cpp"):
        for need in ("funzione", "while", "selezione"):
            if not has(need, program[language], language):
                errors.append(f"the program in {language} has no {need}")
        for name in ("sinistra", "destra", "centro"):
            if name not in program[language]:
                errors.append(f"the program in {language} has no {name}")
    if level == 2:
        xs = params["xs"]
        if not 6 <= len(v) <= 7 or len(xs) != 2:
            errors.append("level 2 calls the function twice on a vector of 6 or 7 numbers")
        if params["expected"] != [[str(search(v, x)[0]) for x in xs]]:
            errors.append(f"the search does not write {params['expected']} for {xs}")
        if len(search(v, xs[0])[1]) < 2 or xs[0] not in v:
            errors.append("the first value is found, and not at the first look")
        if (xs[1] in v) != (case == "presente"):
            errors.append("the case does not say whether the second value is there")
        if sample.get("code") != program or params.get("ask") != "output" or params["tests"] != [[]]:
            errors.append("level 2 shows the whole program, which reads nothing, and asks what it writes")
    if level == 4:
        xs = params["xs"]
        if not 7 <= len(v) <= 9 or len(xs) != 4:
            errors.append("level 4 tries the function on four values of a vector of 7 to 9 numbers")
        found = [search(v, x, decreasing) for x in xs]
        want = [str(len(looked)) if case == "confronti" else str(at) for at, looked in found]
        if params["expected"] != [want]:
            errors.append(f"the function of {case} does not give {params['expected']} on {xs}")
        if sum(1 for x in xs if x in v) != 3:
            errors.append("three of the four values are in the vector")
        if not all("code" in o for o in options):
            errors.append("level 4 offers programs")
        for i, o in enumerate(options):
            shown = o.get("code", {})
            if "def " in shown.get("python", "def ") or "while" in shown.get("python", "") or "main" in shown.get("cpp", "main") or not shown["python"].startswith("centro = "):
                errors.append(f"option {i} does not show the body of the loop alone")
        if sample.get("solutionCode") != options[choice["correct"]].get("code"):
            errors.append("the body of the solution is not the right option")
        if ("confronti(v, x)" if case == "confronti" else f"ordine {case}") not in sample["problem"]:
            errors.append("the question does not say what the function does")
    if level == 5:
        answer = sample["answer"]
        if answer["kind"] != "program" or answer.get("needs") != ["funzione"]:
            errors.append("level 5 asks for a program with a function of its own")
        else:
            tests = params["tests"]
            if len(v) != 6 or len(tests) != 4 or not all(len(t) == 1 for t in tests):
                errors.append("level 5 is tried on four values of a vector of 6 numbers")
            elif [[str(search(v, int(t[0]), decreasing)[0])] for t in tests] != params["expected"]:
                errors.append(f"the search does not give {params['expected']} on {tests}")
            if f"ordine {case}" not in sample["problem"] or "La lettura c'è già" not in sample["problem"]:
                errors.append("the exercise says the order of the vector and that the reading is given")
            for language, reading in (("python", "input()"), ("cpp", "cin >>")):
                start = answer["start"][language]
                if reading not in start or ", ".join(str(x) for x in v) not in start:
                    errors.append(f"the {language} to start from has the vector and the reading")
        if not all("code" in o for o in options):
            errors.append("the multiple choice of level 5 offers programs")
    return errors, case
