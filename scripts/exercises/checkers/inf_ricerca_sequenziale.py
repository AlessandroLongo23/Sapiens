"""Checker for inf-ricerca-sequenziale (specs/exercises/inf-ricerca-sequenziale.md), the exercises of the lesson
"La ricerca sequenziale".

Written from the spec. Every program is run by Python (checkers/_inf_codice.py), and with INF_CPP=1 by the C++
compiler too. What is proper to each level is worked out again here, from the numbers in `params`:
- level 1: the comparisons of a search that stops, on the vector written in the question;
- level 2: what the search of the program leaves: the first index, the last, -1, how many;
- level 3: four functions shown alone; the right one gives back what is asked on the four values tried;
- level 4: 1, n, (n + 1) / 2 comparisons, the index from the comparisons, the double;
- level 5: the program to write passes its three runs, worked out here, and must have a vector.
"""
import re

from checkers._inf_codice import choice_of, common, has

THIRDS = (0.25, 0.42)
CASE_RANGES = {
    1: {"presente": THIRDS, "assente": THIRDS, "ripetuto": THIRDS},
    2: {"prima": (0.18, 0.32), "ultima": (0.18, 0.32), "assente": (0.18, 0.32), "conta": (0.18, 0.32)},
    3: {"prima": THIRDS, "ultima": THIRDS, "conta": THIRDS},
    4: {c: (0.14, 0.26) for c in ("migliore", "peggiore", "medio", "indice", "doppio")},
    5: {"posizione": THIRDS, "conta": THIRDS, "presente": THIRDS},
}

NAMES = {"voti", "punti", "passi", "tempi", "pesi", "gol"}


def first(v, x):
    return v.index(x) if x in v else -1


def last(v, x):
    return len(v) - 1 - v[::-1].index(x) if x in v else -1


def label(option):
    return option.get("text") or option.get("latex")


def right_label(sample):
    choice = choice_of(sample)
    return label(choice["options"][choice["correct"]])


def check_count(sample, errors):
    params = sample["params"]
    case, v, x, name = params["case"], params["vector"], params["x"], params["name"]
    if "program" in params or "code" in sample:
        errors.append("level 1 is in words")
    if name not in NAMES or name not in sample["problem"] or ", ".join(map(str, v)) not in sample["problem"] or f"valore {x} " not in sample["problem"]:
        errors.append("the vector and the value are not in the question")
    if not 6 <= len(v) <= 8:
        errors.append("a vector of 6 to 8 numbers")
    there = v.count(x)
    if there != {"presente": 1, "assente": 0, "ripetuto": 2}.get(case):
        errors.append(f"the value is there {there} times, not as in {case}")
    others = [y for y in v if y != x]
    if len(set(others)) != len(others):
        errors.append("another number is repeated")
    want = first(v, x) + 1 if x in v else len(v)
    if right_label(sample) != str(want):
        errors.append(f"the search makes {want} comparisons, and the right option says {right_label(sample)}")
    if not sample["solution"].startswith(f"{want} confront"):
        errors.append("the solution is not the number of comparisons")


def check_cases(sample, errors):
    params = sample["params"]
    case, n = params["case"], params["n"]
    problem = sample["problem"]
    if "program" in params or "code" in sample:
        errors.append("level 4 is in words")
    if f"{n} elementi" not in problem:
        errors.append("the size is not in the question")
    if case == "migliore":
        want, word = 1, "caso migliore"
    elif case == "peggiore":
        want, word = n, "caso peggiore"
    elif case == "medio":
        if n % 2 == 0:
            errors.append("the mean is not a whole number")
        want, word = (n + 1) // 2, "in media"
    elif case == "indice":
        made = params["made"]
        if not 2 <= made <= n - 1 or f"dopo {made} confronti" not in problem:
            errors.append("the comparisons made are not in the question, or not possible")
        want, word = made - 1, "indice"
    elif case == "doppio":
        want, word = 2 * n, "doppio"
    else:
        errors.append(f"unknown case {case}")
        return
    if word not in problem:
        errors.append(f"the question does not ask for the {case} case")
    if right_label(sample) != str(want):
        errors.append(f"the answer is {want}, and the right option says {right_label(sample)}")


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
        check_count(sample, errors)
        return errors, case
    if level == 4:
        check_cases(sample, errors)
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

    if level == 2:
        v, x, way = params["vector"], params["x"], params["way"]
        if "code" not in sample or params.get("ask") != "output" or sample["code"] != program:
            errors.append("level 2 shows a whole program and asks what it writes")
        if params["tests"] != [[]]:
            errors.append("a program that is read reads nothing")
        if not 6 <= len(v) <= 7 or not all(1 <= y <= 9 for y in v):
            errors.append("a vector of 6 or 7 numbers of one digit")
        there = v.count(x)
        if case == "assente" and there != 0 or case in ("prima", "ultima") and there != 2 or case == "conta" and there not in (2, 3):
            errors.append(f"the value is there {there} times, not as in {case}")
        if way != {"prima": "ferma", "ultima": "avanti", "conta": "conta"}.get(case, way) or way not in ("ferma", "avanti", "conta"):
            errors.append(f"the program of {case} does not search as it should")
        # the program must really be of that kind: one that stops has a while, the others a for
        if has("while", program["python"], "python") != (way == "ferma") or ("volte" in program["python"]) != (way == "conta"):
            errors.append("the program shown is not the search the sample says")
        value = first(v, x) if way == "ferma" else last(v, x) if way == "avanti" else there
        if expected != [[str(value)]]:
            errors.append(f"the search leaves {value}, and the sample says {expected}")
        for language in ("python", "cpp"):
            if not has("vettore", program[language], language):
                errors.append(f"the program in {language} has no vector")

    if level == 3:
        v, xs = params["vector"], params["xs"]
        if not 6 <= len(v) <= 7 or len(xs) != 4:
            errors.append("a vector of 6 or 7 numbers and four values to try")
        else:
            x, absent, head, tail = xs
            if v.count(x) != 2 or x in (v[0], v[-1]) or absent in v or head != v[0] or tail != v[-1]:
                errors.append("the four values are: one there twice in the middle, one not there, the first and the last")
            work = {"prima": first, "ultima": last, "conta": lambda w, y: w.count(y)}.get(case)
            if not work:
                errors.append(f"unknown case {case}")
            elif expected != [[str(work(v, y)) for y in xs]]:
                errors.append(f"the function of {case} does not give {expected} on {v} with {xs}")
        word = {"prima": "primo elemento", "ultima": "ultimo elemento", "conta": "quante volte"}.get(case, "?")
        if word not in sample["problem"]:
            errors.append("the question does not say what the function gives back")
        if not all("code" in o for o in options):
            errors.append("level 3 offers programs")
        for i, o in enumerate(options):
            shown = o.get("code", {})
            if "def " not in shown.get("python", "") or "print" in shown.get("python", "") or "main" in shown.get("cpp", "main"):
                errors.append(f"option {i} does not show the function alone")
        for language in ("python", "cpp"):
            if not has("funzione", program[language], language):
                errors.append(f"the program in {language} has no function")
        if sample.get("solutionCode") != options[choice["correct"]].get("code"):
            errors.append("the function of the solution is not the right option")

    if level == 5:
        answer = sample["answer"]
        n = params.get("n")
        if answer["kind"] != "program" or answer.get("needs") != ["vettore"]:
            errors.append("level 5 asks for a program with a vector")
        elif n not in (5, 6) or f"legge {n} numeri" not in sample["problem"]:
            errors.append("the program reads 5 or 6 numbers, and the exercise says how many")
        else:
            tests = [[int(y) for y in t] for t in params["tests"]]
            if len(tests) != 3 or not all(len(t) == n + 1 for t in tests):
                errors.append("three runs of n numbers and the value")
            else:
                work = {
                    "posizione": lambda v, x: [str(first(v, x))],
                    "conta": lambda v, x: [str(v.count(x))],
                    "presente": lambda v, x: ["presente" if x in v else "assente"],
                }.get(case)
                if not work:
                    errors.append(f"unknown case {case}")
                elif [work(t[:-1], t[-1]) for t in tests] != expected:
                    errors.append(f"the program of {case} does not write {expected} on {tests}")
                # the three runs: the value twice in the middle, not there, only at the first place
                (a, b, c) = [(t[:-1], t[-1]) for t in tests]
                if a[0].count(a[1]) != 2 or a[1] in (a[0][0], a[0][-1]) or b[1] in b[0] or c[0].count(c[1]) != 1 or c[0][0] != c[1]:
                    errors.append("the three runs are not the three the spec asks for")
            for language in ("python", "cpp"):
                if has("vettore", answer["start"][language], language) or has("ciclo", answer["start"][language], language):
                    errors.append(f"the {language} to start from is not empty")
        if not all("code" in o for o in options):
            errors.append("the multiple choice of level 5 offers programs")
        for i, o in enumerate(options):
            if "input" in o.get("code", {}).get("python", "input") or "cin" in o.get("code", {}).get("cpp", "cin"):
                errors.append(f"option {i} shows the reading too")
    return errors, case
