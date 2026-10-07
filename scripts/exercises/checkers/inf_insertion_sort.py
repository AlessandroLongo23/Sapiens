"""Checker for inf-insertion-sort (specs/exercises/inf-insertion-sort.md), lesson 77 "L'ordinamento per inserimento".

Written from the spec. Every program is run by Python (checkers/_inf_codice.py), and with INF_CPP=1 by the C++
compiler too. What is proper to each level is worked out here from the vectors in `params`, without following the
loops of the function: an element inserted among sorted ones moves the ones larger than it, so
- the shifts of an insertion are the elements before it that are larger, and the comparisons one more unless all
  of them are larger (the lesson: the comparison that stops the search is missing at the start of the vector);
- the shifts of a whole sort are the pairs out of order;
- after the insertion of the element of index i the first i + 1 elements are those elements, sorted.

- level 1: the right option is the vector after the insertion; the other three are vectors of the same length;
- level 2: the right option is the number of comparisons or of shifts, of one insertion or of the whole sort;
- level 3: the whole program is shown and the right option is what it writes, worked out here for each case;
- level 4: four loops of `ordina`, shown alone; the right one leaves the two vectors in the order asked for;
- level 5: the solution passes its three tests, worked out here from the lines typed, and the answer must have a
  function of its own.
"""
import re

from checkers._inf_codice import choice_of, common, has

QUARTER = (0.19, 0.31)
HALF = (0.43, 0.57)
CASE_RANGES = {
    1: {"inizio": QUARTER, "mezzo": HALF, "fermo": QUARTER},
    2: {"inserimento: confronti": QUARTER, "inserimento: spostamenti": QUARTER, "vettore: confronti": QUARTER, "vettore: spostamenti": QUARTER},
    3: {"posti": QUARTER, "conta": QUARTER, "giri": QUARTER, "senza x": QUARTER},
    4: {"crescente": HALF, "decrescente": HALF},
    5: {"crescente": QUARTER, "decrescente": QUARTER, "spostamenti": QUARTER, "inserisci": QUARTER},
}


def larger_before(v, i):
    """The elements before the one of index i that are larger than it: the ones its insertion shifts."""
    return [y for y in v[:i] if y > v[i]]


def one_insertion(v, k):
    """The vector after the element of index k is inserted among the k before it, with comparisons and shifts."""
    shifts = len(larger_before(v, k))
    comparisons = shifts + (1 if shifts < k else 0)
    return sorted(v[: k + 1]) + v[k + 1 :], comparisons, shifts


def whole_sort(v):
    """Comparisons and shifts of the whole sort."""
    each = [one_insertion(sorted(v[:i]) + v[i:], i) for i in range(1, len(v))]
    return sum(c for _, c, _ in each), sum(s for _, _, s in each)


def pairs_out_of_order(v):
    return sum(1 for a in range(len(v)) for b in range(a + 1, len(v)) if v[a] > v[b])


def listed(v):
    return ", ".join(str(x) for x in v)


def numbers(text):
    return [int(x) for x in re.findall(r"-?\d+", text)]


def check_vector(sample, errors, options, choice):
    params = sample["params"]
    v, k, case = params["vector"], params["k"], params["case"]
    n = len(v)
    if n not in (5, 6) or len(set(v)) != n or not all(1 <= x <= 20 for x in v):
        errors.append("a vector of 5 or 6 different numbers from 1 to 20")
    if not 2 <= k <= n - 1 or v[:k] != sorted(v[:k]):
        errors.append("the first k elements are not in order")
        return
    after, _c, shifts = one_insertion(v, k)
    where = "inizio" if shifts == k else "fermo" if shifts == 0 else "mezzo"
    if where != case:
        errors.append(f"the case is {where}, not {case}")
    if listed(v) not in sample["problem"] or f"indice {k}," not in sample["problem"] or f"primi {k} elementi" not in sample["problem"]:
        errors.append("the question does not give the vector and the index")
    right = options[choice["correct"]]
    if right["values"] != [listed(after)] or right["latex"] != listed(after):
        errors.append(f"the vector after the insertion is {after}")
    if sample["solution"] != listed(after):
        errors.append("the solution is not the vector after the insertion")
    for i, o in enumerate(options):
        if "code" in o or "listing" in o or len(numbers(o["latex"])) != n or o["latex"] != listed(numbers(o["latex"])):
            errors.append(f"option {i} is not a vector of {n} numbers")


def check_count(sample, errors, options, choice):
    params = sample["params"]
    v, case, what = params["vector"], params["case"], params["what"]
    if case != f"{'inserimento' if 'k' in params else 'vettore'}: {what}" or what not in ("confronti", "spostamenti"):
        errors.append("the case does not say what is counted")
        return
    if len(set(v)) != len(v) or not all(1 <= x <= 20 for x in v):
        errors.append("a vector of different numbers from 1 to 20")
    if "k" in params:
        k = params["k"]
        if len(v) not in (5, 6) or not 2 <= k <= len(v) - 1 or v[:k] != sorted(v[:k]):
            errors.append("the first k elements are not in order")
            return
        _after, comparisons, shifts = one_insertion(v, k)
        if f"indice {k}," not in sample["problem"]:
            errors.append("the question does not give the index")
    else:
        if not 4 <= len(v) <= 6:
            errors.append("a vector of 4 to 6 numbers")
        comparisons, shifts = whole_sort(v)
        if shifts != pairs_out_of_order(v):
            errors.append("the shifts are not the pairs out of order")
    value = comparisons if what == "confronti" else shifts
    if listed(v) not in sample["problem"] or f"Quanti {what} " not in sample["problem"]:
        errors.append("the question does not give the vector and what to count")
    right = options[choice["correct"]]
    if right["values"] != [str(value)] or right["latex"] != str(value):
        errors.append(f"the {what} are {value}")
    if numbers(sample["solution"]) != [value] or what[:-1] not in sample["solution"]:
        errors.append("the solution is not the number counted")
    for i, o in enumerate(options):
        if "code" in o or not re.fullmatch(r"\d+", o["latex"]):
            errors.append(f"option {i} is not a number")


def check_written(sample, errors, options):
    params = sample["params"]
    v, case, program = params["vector"], params["case"], params["program"]
    n = len(v)
    sizes = {"posti": (5, 6), "conta": (5, 6), "giri": (4, 4), "senza x": (4, 5)}[case]
    if not sizes[0] <= n <= sizes[1] or len(set(v)) != n or not all(1 <= x <= 9 for x in v) or v == sorted(v):
        errors.append("a vector of different digits, of the size of its case, not in order")
    if "code" not in sample or sample["code"] != program or params.get("ask") != "output" or params["tests"] != [[]]:
        errors.append("level 3 shows a whole program that reads nothing and asks what it writes")
    if f"= [{listed(v)}]" not in program["python"] or f"= {{{listed(v)}}};" not in program["cpp"]:
        errors.append("the vector of params is not the one of the program")
    for language in ("python", "cpp"):
        for need in ("funzione", "while", "vettore"):
            if not has(need, program[language], language):
                errors.append(f"the program in {language} has no {need}")
    kept = "x = v[i]" in program["python"]
    if kept != ("int x = v[i];" in program["cpp"]) or kept == (case == "senza x") or (case == "senza x") != ("non viene copiato" in sample["problem"]):
        errors.append("only the case without x leaves the element uncopied, and its question says so")
    if case == "posti":
        # the index where each element goes in: after the elements before it that are not larger
        wanted = [str(i - len(larger_before(v, i))) for i in range(1, n)]
        if len(set(wanted)) < 3:
            errors.append("fewer than three different places")
    elif case == "conta":
        wanted = [str(pairs_out_of_order(v))]
        if pairs_out_of_order(v) < 2:
            errors.append("fewer than two shifts")
    elif case == "giri":
        wanted = [" ".join(str(x) for x in sorted(v[: i + 1]) + v[i + 1 :]) for i in range(1, n)]
    else:
        # without x a smaller element is overwritten by the one before it: each cell ends with the largest so far
        wanted = [str(max(v[: i + 1])) for i in range(n)]
    if params["expected"] != [wanted]:
        errors.append(f"the program of {case} writes {wanted}, and the sample says {params['expected']}")
    if any("code" in o for o in options):
        errors.append("level 3 offers outputs, not programs")
    if (case == "giri") != all("listing" in o for o in options):
        errors.append("only the rows of the case giri are shown one under the other")


def check_loops(sample, errors, options, first):
    """Options that are programs and show only the rows inside the function, from its loop on."""
    if not all("code" in o for o in options):
        errors.append("the options are programs")
        return
    for i, o in enumerate(options):
        python, cpp = o["code"]["python"], o["code"]["cpp"]
        if "def " in python or "print" in python or "main" in cpp or "cout" in cpp or not any(python.startswith(f) for f in first["python"]) or not any(cpp.startswith(f) for f in first["cpp"]):
            errors.append(f"option {i} does not show the rows of the function alone")
    if len({o["code"]["python"] for o in options}) != 4 or len({o["code"]["cpp"] for o in options}) != 4:
        errors.append("two options show the same rows")


LOOP = {"python": ("for i in range(",), "cpp": ("for (int i = ",)}
COUNTING = {"python": ("s = ",), "cpp": ("int s = ",)}
INSERTING = {"python": ("v.append(x)",), "cpp": ("int j = n - 1;", "v[n] = x;")}


def check_which(sample, errors, options):
    params = sample["params"]
    vectors, case = params["vectors"], params["case"]
    if [len(v) for v in vectors] != [5, 6] or not all(len(set(v)) == len(v) and all(1 <= x <= 9 for x in v) for v in vectors):
        errors.append("two vectors of 5 and of 6 different digits")
    wanted = [str(x) for v in vectors for x in sorted(v, reverse=case == "decrescente")]
    if params["expected"] != [wanted] or params["tests"] != [[]]:
        errors.append(f"the right function leaves {wanted}, and the sample says {params['expected']}")
    if f"ordine {case} " not in sample["problem"]:
        errors.append("the question does not say the order")
    check_loops(sample, errors, options, LOOP)
    if "solutionCode" not in sample or "ordina" not in sample["solutionCode"]["python"] or "ordina" not in sample["solutionCode"]["cpp"]:
        errors.append("the solution shows the function ordina")
    sign = "<" if case == "decrescente" else ">"
    right = options[sample["answer"]["correct"]]
    if "code" in right and (f"v[j] {sign} x" not in right["code"]["python"] or f"v[j] {sign} x" not in right["code"]["cpp"]):
        errors.append("the right loop does not compare as the order asks")


def check_write(sample, errors, options):
    params = sample["params"]
    case, tests = params["case"], params["tests"]
    answer = sample["answer"]
    if answer["kind"] != "program" or answer.get("needs") != ["funzione"]:
        errors.append("level 5 asks for a program with a function of its own")
        return
    if len(tests) != 3:
        errors.append("level 5 is tried on three inputs")
        return
    runs = []
    for typed in tests:
        typed = [int(x) for x in typed]
        n, values, more = typed[0], typed[1 : typed[0] + 1], typed[typed[0] + 1 :]
        if len(values) != n or len(more) != (1 if case == "inserisci" else 0) or not 3 <= n <= 6:
            errors.append("a test does not type n and then n numbers")
            return
        runs.append((values, more))
    name = "inserisci" if case == "inserisci" else "ordina"
    if case == "inserisci":
        wanted = [[str(x) for x in sorted(values + more)] for values, more in runs]
        if not all(values == sorted(values) and more[0] not in values for values, more in runs):
            errors.append("the vector of inserisci is typed in order, and the new number is not in it")
        # the new number in the middle with two shifts at least, before all, after all
        places = [len(values) - len([y for y in values if y > more[0]]) for values, more in runs]
        if not (1 <= places[0] <= len(runs[0][0]) - 2 and places[1] == 0 and places[2] == len(runs[2][0])):
            errors.append("the three tests of inserisci are: in the middle, before all, after all")
    elif case == "spostamenti":
        wanted = [[str(pairs_out_of_order(values))] for values, _ in runs]
        if len({rows[0] for rows in wanted}) != 3:
            errors.append("the three runs do not write three different numbers")
    else:
        down = case == "decrescente"
        wanted = [[str(x) for x in sorted(values, reverse=down)] for values, _ in runs]
        first, second, third = (values for values, _ in runs)
        if first == sorted(first, reverse=down) or len(set(second)) == len(second) or third != sorted(third, reverse=down):
            errors.append("the tests are: a vector out of order, one with a number twice, one already in order")
        if f"ordine {case} " not in sample["problem"]:
            errors.append("the exercise does not say the order")
    if params["expected"] != wanted:
        errors.append(f"the program of {case} writes {wanted}, and the sample says {params['expected']}")
    problem = sample["problem"]
    if f"funzione {name} " not in problem or "c'è già" not in problem and "ci sono già" not in problem:
        errors.append("the exercise names the function and says that the reading is given")
    if case == "spostamenti" and "numero di spostamenti" not in problem:
        errors.append("the exercise does not ask for the number of shifts")
    start = answer["start"]
    if "input()" not in start["python"] or "cin >>" not in start["cpp"] or f"{name}(" in start["python"] or f"{name}(" in start["cpp"]:
        errors.append("the program to start from reads, and has neither the function nor its call")
    if "vector<" in params["program"]["cpp"] or "#include <vector>" in params["program"]["cpp"]:
        errors.append("the lesson uses arrays, not vector")
    check_loops(sample, errors, options, INSERTING if case == "inserisci" else COUNTING if case == "spostamenti" else LOOP)


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    case = params.get("case")
    choice = choice_of(sample)
    if not choice or not isinstance(choice.get("correct"), int) or not 0 <= choice["correct"] < len(choice["options"]):
        return errors, case
    options = choice["options"]
    if level in (1, 2):
        if "program" in params or sample["answer"]["kind"] != "choice":
            errors.append("a level of text has no program")
        elif level == 1:
            check_vector(sample, errors, options, choice)
        else:
            check_count(sample, errors, options, choice)
        return errors, case
    if "program" not in params:
        return errors + ["a level with programs has no reference program"], case
    if "vector<" in params["program"]["cpp"]:
        errors.append("the lesson uses arrays, not vector")
    if level == 3:
        check_written(sample, errors, options)
    elif level == 4:
        if sample["answer"]["kind"] != "choice":
            errors.append("level 4 is a multiple choice")
        else:
            check_which(sample, errors, options)
    elif level == 5:
        check_write(sample, errors, options)
    else:
        errors.append(f"unknown level {level}")
    if len(sample["steps"]) not in (2, 3):
        errors.append("the steps are two or three")
    return errors, case
