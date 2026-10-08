"""Checker for inf-selection-sort (specs/exercises/inf-selection-sort.md): selection sort, lesson 75.

Written from the spec. Every program is run by Python (checkers/_inf_codice.py), and with INF_CPP=1 by the C++
compiler too. What is proper to each level is worked out again here, from the vector in `params`:
- level 1: the index of the minimum from place i on, and its value;
- level 2: what a swap with temp leaves, and what each of the two wrong swaps leaves;
- level 3: the vector after the first turns of the sort;
- level 4: all the comparisons on n elements, those of one turn, the swaps on a vector;
- level 5: four bodies of the outer loop, shown alone; the right one sorts the vector in the order asked for;
- level 6: the solution passes its six tests, worked out here, and the answer must have a function of its own.
"""
import re

from checkers._inf_codice import choice_of, common, has


CASE_RANGES = {
    1: {"inizio": (0.42, 0.58), "da i": (0.42, 0.58)},
    2: {"con temp": (0.42, 0.58), "senza temp": (0.18, 0.32), "ordine sbagliato": (0.18, 0.32)},
    3: {"un giro": (0.25, 0.42), "due giri": (0.25, 0.42), "tre giri": (0.25, 0.42)},
    4: {"confronti": (0.14, 0.26), "giro": (0.32, 0.48), "scambi": (0.32, 0.48)},
    5: {"crescente": (0.42, 0.58), "decrescente": (0.42, 0.58)},
    6: {"crescente": (0.42, 0.58), "decrescente": (0.42, 0.58)},
}


def selection(values, turns=None):
    """Selection sort in increasing order as the lesson does it: (the vector after `turns` turns, the vector after
    each turn, the turns that swap, the comparisons made)."""
    v = list(values)
    n = len(v)
    after, swapping, comparisons = [], [], 0
    for i in range(n - 1 if turns is None else min(turns, n - 1)):
        least = i
        for j in range(i + 1, n):
            comparisons += 1
            if v[j] < v[least]:
                least = j
        if least != i:
            v[i], v[least] = v[least], v[i]
            swapping.append(i)
        after.append(list(v))
    return v, after, swapping, comparisons


def numbers_in(text):
    return [int(n) for n in re.findall(r"\d+", text)]


def right_of(sample):
    choice = choice_of(sample)
    return choice["options"][choice["correct"]]


def check_text(sample, errors):
    params = sample["params"]
    level, case = sample["level"], params["case"]
    right = right_of(sample)["values"][0]
    if "program" in params or any("code" in o for o in choice_of(sample)["options"]):
        errors.append("a level of text has no program")
    if level == 3:
        v, turns = params["vector"], params["turns"]
        if not 5 <= len(v) <= 6 or len(set(v)) != len(v):
            errors.append("level 3 wants a vector of 5 or 6 different numbers")
        if turns != {"un giro": 1, "due giri": 2, "tre giri": 3}[case]:
            errors.append("the case does not say how many turns")
        done, after, swapping, _ = selection(v, turns)
        if right != ", ".join(str(x) for x in done):
            errors.append(f"after {turns} turns the vector is {done}")
        if turns - 1 not in swapping:
            errors.append("the last turn asked for does not swap")
        if done == sorted(v):
            errors.append("the vector is sorted already after those turns")
        if numbers_in(sample["problem"])[: len(v)] != v or "crescente" not in sample["problem"]:
            errors.append("the question does not give the vector and the order")
        return
    if case == "confronti":
        n = params["n"]
        if right != str(sum(range(1, n))) or sum(range(1, n)) != n * (n - 1) // 2:
            errors.append(f"{n} elements take {n * (n - 1) // 2} comparisons")
        if numbers_in(sample["problem"])[:1] != [n]:
            errors.append("the question does not give the size")
    elif case == "giro":
        n, i = params["n"], params["i"]
        if not 1 <= i <= n - 3:
            errors.append("a turn that is neither the first nor one of the last two")
        if right != str(len(range(i + 1, n))):
            errors.append(f"the turn with i = {i} on {n} elements makes {n - 1 - i} comparisons")
        if numbers_in(sample["problem"])[:2] != [n, i]:
            errors.append("the question does not give the size and the turn")
    else:
        v = params["vector"]
        if not 5 <= len(v) <= 7 or len(set(v)) != len(v):
            errors.append("the swaps are counted on a vector of 5 to 7 different numbers")
        swaps = len(selection(v)[2])
        if right != str(swaps):
            errors.append(f"the sort swaps {swaps} times")
        if swaps in (0, len(v) - 1):
            errors.append("every turn swaps, or none")
        if numbers_in(sample["problem"])[: len(v)] != v or "imin è diverso da i" not in sample["problem"]:
            errors.append("the question gives the vector and says when the sort swaps")


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    case = params.get("case")
    choice = choice_of(sample)
    if not choice:
        return errors, case
    options = choice["options"]
    if level in (3, 4):
        check_text(sample, errors)
        return errors, case
    if "program" not in params:
        return errors + ["a level with programs has no reference program"], case
    program = params["program"]
    v = params["vector"]
    if len(set(v)) != len(v):
        errors.append("the numbers of the vector are all different")
    written = ", ".join(str(x) for x in v)
    if f"[{written}]" not in program["python"] or f"{{{written}}}" not in program["cpp"]:
        errors.append("the vector of the program is not the vector of params")
    if level in (1, 2):
        if sample.get("code") != program or params.get("ask") != "output" or params["tests"] != [[]]:
            errors.append(f"level {level} shows the whole program, which reads nothing, and asks what it writes")
        for language in ("python", "cpp"):
            if not has("vettore", program[language], language):
                errors.append(f"the program in {language} has no vector")
    if level == 1:
        i = params["i"]
        if not 5 <= len(v) <= 6:
            errors.append("level 1 wants a vector of 5 or 6 numbers")
        if (i == 0) != (case == "inizio") or not 0 <= i <= len(v) - 3:
            errors.append("the case does not say where the search starts")
        least = min(range(i, len(v)), key=lambda k: v[k])
        if params["expected"] != [[str(least), str(v[least])]]:
            errors.append(f"from place {i} the minimum is {v[least]} at {least}")
        if case == "da i" and v.index(min(v)) >= i:
            errors.append("the smallest of all is not before i")
        if least == i or any(x < v[i] for x in v[i + 1 : least]):
            errors.append("the minimum is where the search starts, or the first smaller element met")
        for language in ("python", "cpp"):
            if "imin" not in program[language] or not has("ciclo", program[language], language):
                errors.append(f"the program in {language} has no loop on imin")
    if level == 2:
        a, b = params["a"], params["b"]
        if not 4 <= len(v) <= 5 or not 0 <= a < b < len(v):
            errors.append("level 2 swaps two places of a vector of 4 or 5 numbers")
        left = list(v)
        if case == "con temp":
            left[a], left[b] = v[b], v[a]
        elif case == "senza temp":
            left[a] = v[b]
        else:
            left[b] = v[a]
        if params["expected"] != [[str(x) for x in left]]:
            errors.append(f"the swap of the case {case} leaves {left}")
        if ("temp" in program["python"]) != (case != "senza temp"):
            errors.append("the case does not say whether the program has temp")
    if level in (5, 6):
        for language in ("python", "cpp"):
            for need in ("funzione", "annidati", "selezione"):
                if not has(need, program[language], language):
                    errors.append(f"the program in {language} has no {need}")
            for name in ("temp", "imin" if case == "crescente" else "imax"):
                if name not in program[language]:
                    errors.append(f"the program in {language} has no {name}")
        if f"ordine {case}" not in sample["problem"]:
            errors.append("the exercise does not say the order asked for")
        if not all("code" in o for o in options):
            errors.append(f"level {level} offers programs")
        for i, o in enumerate(options):
            shown = o.get("code", {})
            if "def " in shown.get("python", "def ") or "main" in shown.get("cpp", "main") or "range(n - 1)" in shown["python"] or not re.match(r"im(in|ax) = ", shown["python"]):
                errors.append(f"option {i} does not show the body of the outer loop alone")
    ordered = sorted(v, reverse=case == "decrescente")
    if level == 5:
        if not 6 <= len(v) <= 7:
            errors.append("level 5 sorts a vector of 6 or 7 numbers")
        if case == "crescente" and selection(v)[0] != ordered:
            errors.append("the sort of the checker does not sort")
        if params["expected"] != [[str(x) for x in ordered]] or params["tests"] != [[]]:
            errors.append(f"the function does not leave {ordered}")
        if sample.get("solutionCode") != options[choice["correct"]].get("code"):
            errors.append("the body of the solution is not the right option")
    if level == 6:
        answer = sample["answer"]
        if answer["kind"] != "program" or answer.get("needs") != ["funzione"]:
            errors.append("level 6 asks for a program with a function of its own")
        else:
            if len(v) != 6 or params["tests"] != [[str(k)] for k in range(6)]:
                errors.append("level 6 is tried on the six indices of a vector of 6 numbers")
            elif params["expected"] != [[str(x)] for x in ordered]:
                errors.append(f"the sorted vector is {ordered}")
            if v == sorted(v) or v == sorted(v, reverse=True):
                errors.append("the vector is in order already")
            if "La lettura c'è già" not in sample["problem"]:
                errors.append("the exercise says that the reading is given")
            for language, reading in (("python", "input()"), ("cpp", "cin >>")):
                start = answer["start"][language]
                if reading not in start or ", ".join(str(x) for x in v) not in start:
                    errors.append(f"the {language} to start from has the vector and the reading")
    return errors, case
