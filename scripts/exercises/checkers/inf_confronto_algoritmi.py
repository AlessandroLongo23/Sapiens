"""Checker for inf-confronto-algoritmi (specs/exercises/inf-confronto-algoritmi.md).

Written from the spec. The algorithms of the chapter are written here again, each with its counters, and every
answer is worked out from the data in `params`, never from the text of the generator:
- level 1: the program shown is run by Python (checkers/_inf_codice.py) and what it writes is the count of its
  algorithm on its vector, counted here;
- level 2: a count on a vector in order or reversed, counted here on a vector of that length, or three vectors of
  which one alone is the best or the worst case (or none, when the count is the same on all);
- level 3: a count given for n and asked for k times n, a table where n doubles with one row to fill in, or the
  growth read from the table;
- level 4: four bodies of a function, only one of which gives back the count worked out here on each call;
- level 5: comparisons and seconds from n and a speed;
- level 6: a program to write, whose three tests are counted here.
"""
import re

from checkers._inf_codice import choice_of, common, has

CASE_RANGES = {
    1: {k: (0.14, 0.26) for k in ("bolle-confronti", "bolle-scambi", "bandierina-confronti", "selezione-confronti", "selezione-scambi")},
    2: {"conto": (0.42, 0.58), "riconosci": (0.42, 0.58)},
    3: {"scala": (0.32, 0.48), "tabella": (0.22, 0.38), "crescita": (0.22, 0.38)},
    4: {k: (0.19, 0.31) for k in ("giro-confronti", "giro-scambi", "cerca", "dimezza")},
    5: {k: (0.19, 0.31) for k in ("ordinamento", "ricerche", "binaria", "ripaga")},
    6: {k: (0.11, 0.23) for k in ("bandierina-confronti", "bolle-scambi", "selezione-scambi", "inserimento-spostamenti", "sequenziale", "dimezzamenti")},
}

SORT_NAMES = {
    "selezione": "per selezione",
    "bolle": "a bolle senza bandierina",
    "bandierina": "a bolle con la bandierina",
    "inserimento": "per inserimento",
}
SPEEDS = {1_000_000: "$1$ milione", 10_000_000: "$10$ milioni", 100_000_000: "$100$ milioni"}
NEEDS = {
    "bandierina-confronti": ("annidati", "uno dentro l’altro"),
    "bolle-scambi": ("annidati", "uno dentro l’altro"),
    "selezione-scambi": ("annidati", "uno dentro l’altro"),
    "inserimento-spostamenti": ("annidati", "uno dentro l’altro"),
    "sequenziale": ("funzione", "una funzione"),
    "dimezzamenti": ("while", "Usa un ciclo while"),
}


# --- the algorithms of the chapter, with their counters -------------------------------------------------------


def bubble(vector, flag):
    """(comparisons, swaps) of the bubble sort; with the flag it stops after a turn without swaps."""
    v = list(vector)
    n = len(v)
    comparisons = swaps = 0
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            comparisons += 1
            if v[j] > v[j + 1]:
                v[j], v[j + 1] = v[j + 1], v[j]
                swaps += 1
                swapped = True
        if flag and not swapped:
            break
    assert v == sorted(vector)
    return comparisons, swaps


def selection(vector):
    """(comparisons, swaps) of the selection sort, which swaps only when the minimum is not in its place."""
    v = list(vector)
    n = len(v)
    comparisons = swaps = 0
    for i in range(n - 1):
        imin = i
        for j in range(i + 1, n):
            comparisons += 1
            if v[j] < v[imin]:
                imin = j
        if imin != i:
            v[i], v[imin] = v[imin], v[i]
            swaps += 1
    assert v == sorted(vector)
    return comparisons, swaps


def insertion(vector):
    """(comparisons, shifts) of the insertion sort: one comparison for each shift, and the one that stops the search."""
    v = list(vector)
    comparisons = shifts = 0
    for i in range(1, len(v)):
        x = v[i]
        j = i - 1
        while j >= 0:
            comparisons += 1
            if v[j] <= x:
                break
            v[j + 1] = v[j]
            shifts += 1
            j -= 1
        v[j + 1] = x
    assert v == sorted(vector)
    return comparisons, shifts


def halvings(n):
    count = 0
    while n > 0:
        count += 1
        n //= 2
    return count


def pairs(n):
    return n * (n - 1) // 2


def one_turn(vector):
    """(comparisons, swaps) of one turn of the bubble sort over the whole vector."""
    v = list(vector)
    swaps = 0
    for j in range(len(v) - 1):
        if v[j] > v[j + 1]:
            v[j], v[j + 1] = v[j + 1], v[j]
            swaps += 1
    return len(v) - 1, swaps


def sequential(v, x):
    return v.index(x) + 1 if x in v else len(v)


def count_of(sort, quantity, v):
    """What a sort counts on a vector."""
    if sort == "selezione":
        return selection(v)[quantity == "scambi"]
    if sort == "inserimento":
        return insertion(v)[quantity == "spostamenti"]
    return bubble(v, sort == "bandierina")[quantity == "scambi"]


# --- reading a sample --------------------------------------------------------------------------------------------


def plain(text):
    """A text without the marks of its formulas, to look for a number in it."""
    return text.replace("\\,", "").replace("$", "")


def whole(value):
    return int(value) if re.fullmatch(r"-?\d+", value) else None


def right_of(sample):
    choice = choice_of(sample)
    return choice["options"][choice["correct"]]


def expect(errors, sample, value, what):
    got = right_of(sample)["values"][0]
    if got != str(value):
        errors.append(f"{what}: the right option is {got}, and it should be {value}")


def nearest(errors, sample, truth):
    """The right option is the number closest to the exact count."""
    choice = choice_of(sample)
    numbers = [whole(o["values"][0]) for o in choice["options"]]
    if None in numbers:
        errors.append("an option is not a number")
        return
    gaps = [abs(x - truth) for x in numbers]
    if gaps.index(min(gaps)) != choice["correct"] or gaps.count(min(gaps)) > 1:
        errors.append(f"the right option is not the closest to {truth}: {numbers}")


def named(errors, sample, *pieces):
    text = plain(sample["problem"])
    for piece in pieces:
        if not re.search(rf"(?<!\d){re.escape(plain(str(piece)))}(?!\d)", text):
            errors.append(f"the question does not say {piece}")


def read_table(listing):
    rows = [row.split() for row in listing.rstrip("\n").split("\n")]
    return rows[0], rows[1:]


# --- the levels --------------------------------------------------------------------------------------------------


def level1(sample, errors):
    params = sample["params"]
    case = params["case"]
    v = params["vector"]
    program = params["program"]
    if not (4 <= len(v) <= 6 and len(set(v)) == len(v) and all(isinstance(x, int) and 1 <= x <= 99 for x in v)):
        errors.append("a vector of 4 to 6 different numbers of at most two digits")
    algorithm, what = case.split("-")
    counts = selection(v) if algorithm == "selezione" else bubble(v, algorithm == "bandierina")
    count = counts[what == "scambi"]
    if params["expected"] != [[str(count)]]:
        errors.append(f"{case} on {v} counts {count}, and the sample says {params['expected']}")
    expect(errors, sample, count, case)
    if params["tests"] != [[]] or params.get("ask") != "output" or sample.get("code") != program:
        errors.append("level 1 shows the whole program, which reads nothing, and asks what it writes")
    python, cpp = program["python"], program["cpp"]
    for language in ("python", "cpp"):
        for need in ("funzione", "vettore", "annidati"):
            if not has(need, program[language], language):
                errors.append(f"the program in {language} has no {need}")
    if ("scambiato" in python) != (algorithm == "bandierina") or ("imin" in python) != (algorithm == "selezione"):
        errors.append(f"the program is not the sort of {case}")
    if f"return {what}\n" not in python or f"return {what};" not in cpp or python.count(f"{what} = {what} + 1") != 1:
        errors.append(f"the function does not give back one counter called {what}")
    if str(v).replace(" ", "") not in python.replace(" ", "") or "{" + ", ".join(map(str, v)) + "}" not in cpp:
        errors.append("the vector of params is not the one of the program")


def level2(sample, errors):
    params = sample["params"]
    case = params["case"]
    choice = choice_of(sample)
    if case == "conto":
        algorithm, quantity, order, n = params["algorithm"], params["quantity"], params["order"], params["n"]
        if algorithm == "binaria":
            count = halvings(n)
            if order != "peggiore" or not 20 <= n <= 1000 or "ricerca binaria" not in sample["problem"] or "al massimo" not in sample["problem"]:
                errors.append("the binary search is asked for its worst case")
        elif algorithm == "sequenziale":
            v = list(range(1, n + 1))
            count = sequential(v, {"primo": 1, "ultimo": n, "assente": 0}[order])
            said = {"primo": "primo elemento", "ultimo": "ultimo elemento", "assente": "non c’è"}[order]
            if said not in sample["problem"] or "ricerca sequenziale" not in sample["problem"] or not 10 <= n <= 200:
                errors.append("the question does not say where the value is")
        else:
            if not 6 <= n <= 30 or order not in ("ordine", "rovescio"):
                errors.append("a vector of 6 to 30 elements, in order or reversed")
            v = list(range(1, n + 1)) if order == "ordine" else list(range(n, 0, -1))
            if (quantity == "spostamenti") != (algorithm == "inserimento" and quantity != "confronti"):
                errors.append(f"{algorithm} does not count {quantity}")
            count = count_of(algorithm, quantity, v)
            said = "già in ordine" if order == "ordine" else "rovesciato"
            if said not in sample["problem"] or SORT_NAMES[algorithm] not in sample["problem"] or f"Quanti {quantity}" not in sample["problem"]:
                errors.append("the question does not say the vector, the count or the sort")
        named(errors, sample, n)
        expect(errors, sample, count, f"{algorithm} {quantity} {order} {n}")
        if not all(whole(o["values"][0]) is not None for o in choice["options"]):
            errors.append("the options of a count are numbers")
        return
    if case != "riconosci":
        errors.append(f"unknown case {case}")
        return
    algorithm, quantity, direction, vectors = params["algorithm"], params["quantity"], params["direction"], params["vectors"]
    if len(vectors) != 3 or not all(5 <= len(v) <= 6 and len(set(v)) == len(v) for v in vectors):
        errors.append("three vectors of 5 or 6 different numbers")
        return
    up, down, mixed = vectors
    if up != sorted(up) or down != sorted(up, reverse=True) or sorted(mixed) != up or mixed in (up, down):
        errors.append("the three vectors are the same values in order, reversed and in another order")
    counts = [count_of(algorithm, quantity, v) for v in vectors]
    best = min(counts) if direction == "meno" else max(counts)
    labels = [", ".join(map(str, v)) for v in vectors]
    if len(set(counts)) == 1:
        value = "uguali"
    elif counts.count(best) == 1:
        value = labels[counts.index(best)]
    else:
        errors.append(f"two vectors are at the extreme: {counts}")
        return
    if sorted(o["values"][0] for o in choice["options"]) != sorted(labels + ["uguali"]):
        errors.append("the options are the three vectors and the same count on all")
    expect(errors, sample, value, f"{algorithm} {quantity} {direction} {counts}")
    if SORT_NAMES[algorithm] not in sample["problem"] or f"fa {direction} {quantity}" not in sample["problem"]:
        errors.append("the question does not say the sort or the count")


def level3(sample, errors):
    params = sample["params"]
    case = params["case"]
    growth = params["growth"]
    choice = choice_of(sample)
    formula = {"lineare": lambda n: n, "logaritmo": halvings, "quadrato": pairs}[growth]
    if case == "scala":
        n, k, given = params["n"], params["k"], params["given"]
        if given != formula(n):
            errors.append(f"{growth}: on {n} elements the count is {formula(n)}, not {given}")
        exact = formula(k * n)
        if growth == "quadrato":
            right = k * k * given
            if abs(right - exact) > 0.02 * exact or "circa" not in sample["problem"] or k not in (2, 4, 10):
                errors.append("the square growth is asked for about, with a number close to the exact one")
            nearest(errors, sample, exact)
        else:
            right = exact
            if "circa" in sample["problem"] or k not in ((2, 4, 10) if growth == "lineare" else (2, 4, 8)):
                errors.append("the exact count is asked for, for 2, 4 and 8 or 10 times the elements")
        said = {"lineare": "ricerca sequenziale", "logaritmo": "ricerca binaria", "quadrato": "ordinamento"}[growth]
        if said not in sample["problem"] or "caso peggiore" not in sample["problem"]:
            errors.append("the question does not name the algorithm and its worst case")
        named(errors, sample, n, k * n, given)
        expect(errors, sample, right, f"{growth} from {n} to {k * n}")
        return
    table = params["table"]
    ns = [row[0] for row in table]
    if any(b != 2 * a for a, b in zip(ns, ns[1:])):
        errors.append("n does not double from a row to the next")
    scale = table[0][1] // ns[0] if growth == "lineare" else 1
    if growth == "lineare" and scale not in (1, 2, 3):
        errors.append("a linear count is 1, 2 or 3 times n")
    if any(count != scale * formula(n) for n, count in table):
        errors.append(f"the table is not the count of a {growth} growth")
    if "listing" not in sample:
        errors.append("the table is not shown")
        return
    head, rows = read_table(sample["listing"])
    if head != ["n", "confronti"]:
        errors.append("the table has no heading")
    if case == "tabella":
        asked = params["asked"]
        if len(table) != 3 or asked != 2 * ns[-1] or rows != [[str(n), str(count)] for n, count in table] + [[str(asked), "?"]]:
            errors.append("the table shows three rows and asks for the fourth")
        expect(errors, sample, scale * formula(asked), f"{growth} at {asked}")
        if "punto interrogativo" not in sample["problem"]:
            errors.append("the question does not ask for the missing number")
        return
    if case != "crescita":
        errors.append(f"unknown case {case}")
        return
    if len(table) != 4 or rows != [[str(n), str(count)] for n, count in table]:
        errors.append("the table shows its four rows")
    counts = [row[1] for row in table]
    # the growth is read here from the numbers alone
    if all(b == 2 * a for a, b in zip(counts, counts[1:])):
        seen = "lineare"
    elif all(b == a + 1 for a, b in zip(counts, counts[1:])):
        seen = "logaritmo"
    elif all(3.9 < b / a < 4.3 for a, b in zip(counts, counts[1:])):
        seen = "quadrato"
    else:
        seen = None
    if seen != growth:
        errors.append(f"the table reads as {seen}, and the sample says {growth}")
    expect(errors, sample, seen, "the growth of the table")
    labels = {"lineare": "Come $n$", "logaritmo": "Come $\\log_2 n$", "quadrato": "Come $n^2$", "costante": "Non cresce: resta uguale"}
    if {o["values"][0]: o["latex"] for o in choice["options"]} != labels:
        errors.append("the options are the three growths of the lesson and no growth")


def level4(sample, errors):
    params = sample["params"]
    case = params["case"]
    calls = params["calls"]
    choice = choice_of(sample)
    python = params["program"]["python"]
    if case in ("giro-confronti", "giro-scambi"):
        wanted = [one_turn(c["v"])[case == "giro-scambi"] for c in calls]
        lines = [f"print(giro({c['v']}))" for c in calls]
    elif case == "cerca":
        wanted = [sequential(c["v"], c["x"]) for c in calls]
        lines = [f"print(cerca({c['v']}, {c['x']}))" for c in calls]
        if [c["x"] in c["v"] for c in calls] != [True, False]:
            errors.append("the search is tried on a value that is there and on one that is not")
    elif case == "dimezza":
        wanted = [halvings(c["n"]) for c in calls]
        lines = [f"print(confronti_binaria({c['n']}))" for c in calls]
    else:
        errors.append(f"unknown case {case}")
        return
    if len(calls) != 2 or params["tests"] != [[]]:
        errors.append("the function is tried on two calls, and the program reads nothing")
    if params["expected"] != [[str(x) for x in wanted]]:
        errors.append(f"{case} gives {wanted} on {calls}, and the sample says {params['expected']}")
    if not python.endswith("\n" + "\n".join(lines) + "\n"):
        errors.append("the calls of params are not those of the program")
    for i, o in enumerate(choice["options"]):
        if "code" not in o:
            errors.append("level 4 offers programs")
            return
        shown = o["code"]
        if re.search(r"\bdef\b|\bprint\b", shown["python"]) or re.search(r"\bmain\b|\bcout\b|^int \w+\(", shown["cpp"], re.M) or "return" not in shown["python"]:
            errors.append(f"option {i} does not show the body of the function alone")
    if "corpo" not in sample["problem"] or "corpo" not in sample["prompt"]:
        errors.append("the exercise does not say that the options are bodies")
    solution = sample.get("solutionCode")
    if not solution or not solution["python"].startswith("def ") or "print" in solution["python"]:
        errors.append("the solution shows the function alone")
    name = "scambi" if case == "giro-scambi" else "confronti"
    if f"numero di {name}" not in sample["problem"] and case != "dimezza":
        errors.append(f"the question does not ask for the {name}")


def level5(sample, errors):
    params = sample["params"]
    case = params["case"]
    n = params["n"]
    problem = sample["problem"]
    if case in ("ordinamento", "ricerche"):
        speed = params["speed"]
        if SPEEDS.get(speed, "?") + " di confronti al secondo" not in problem:
            errors.append("the question does not say the speed")
            return
        work = n * n // 2 if case == "ordinamento" else params["k"] * n
        if work % speed or not 2 <= work // speed:
            errors.append(f"{work} comparisons at {speed} a second are not a whole number of seconds")
        s = work // speed
        expect(errors, sample, s, f"{case} {n} at {speed}")
        if case == "ordinamento":
            if abs(s - pairs(n) / speed) > 0.01 * s or "circa" not in problem or "ordinamento" not in problem or "\\frac{n^2}{2}" not in problem:
                errors.append("the time of a sort is asked for about, from half of n squared")
            named(errors, sample, n)
        else:
            if "ricerche sequenziali" not in problem or "caso peggiore" not in problem:
                errors.append("the question does not say the searches")
            named(errors, sample, n, params["k"])
        if not all(re.fullmatch(r"(circa )?\$[\d\\,]+\$ second[oi]", o["latex"]) for o in choice_of(sample)["options"]):
            errors.append("the options are times in seconds")
    elif case == "binaria":
        k = params["k"]
        expect(errors, sample, k * halvings(n), f"{k} binary searches on {n}")
        if "ricerche binarie" not in problem or "caso peggiore" not in problem:
            errors.append("the question does not say the searches")
        named(errors, sample, n, k)
    elif case == "ripaga":
        cost, binary = params["cost"], params["binary"]
        if cost != pairs(n) or binary != halvings(n) or n % 2:
            errors.append("the cost of the sort and of a binary search are those of n")
        truth = cost / (n - binary)
        if abs(truth - n / 2) > 0.03 * (n / 2):
            errors.append(f"{n // 2} searches are not about {truth}")
        expect(errors, sample, n // 2, f"the searches that pay back the sort of {n}")
        nearest(errors, sample, truth)
        named(errors, sample, n, cost, binary)
        if "circa" not in problem or not all(o["latex"].startswith("circa ") for o in choice_of(sample)["options"]):
            errors.append("the number of searches is asked for about")
    else:
        errors.append(f"unknown case {case}")


def level6(sample, errors):
    params = sample["params"]
    case = params["case"]
    answer = sample["answer"]
    if case not in NEEDS:
        errors.append(f"unknown case {case}")
        return
    need, said = NEEDS[case]
    if answer["kind"] != "program" or answer.get("needs") != [need]:
        errors.append(f"{case} asks for a program with {need}")
        return
    if said not in sample["problem"]:
        errors.append(f"the exercise does not name what it asks for: {said}")
    tests = [[int(x) for x in typed] for typed in params["tests"]]
    wanted = []
    for typed in tests:
        if case == "dimezzamenti":
            if len(typed) != 1 or typed[0] < 1:
                errors.append("the program reads n alone")
                return
            wanted.append(halvings(typed[0]))
            continue
        n, rest = typed[0], typed[1:]
        extra = 1 if case == "sequenziale" else 0
        if len(rest) != n + extra or not 4 <= n <= 100 or len(set(rest[:n])) != n:
            errors.append("a test types n and then n different numbers")
            return
        v = rest[:n]
        if case == "sequenziale":
            wanted.append(sequential(v, rest[n]))
        elif case == "bandierina-confronti":
            wanted.append(bubble(v, True)[0])
        elif case == "bolle-scambi":
            wanted.append(bubble(v, False)[1])
        elif case == "selezione-scambi":
            wanted.append(selection(v)[1])
        else:
            wanted.append(insertion(v)[1])
    if params["expected"] != [[str(x)] for x in wanted]:
        errors.append(f"{case} counts {wanted} on {params['tests']}, and the sample says {params['expected']}")
    if len(tests) != 3 or len(set(wanted)) != 3:
        errors.append("three tests that write three different counts")
    start = answer["start"]
    if "La lettura c’è già" not in sample["problem"] or "input()" not in start["python"] or "cin >>" not in start["cpp"]:
        errors.append("the reading is given, and the exercise says so")
    if not all("code" in o for o in choice_of(sample)["options"]):
        errors.append("the multiple choice of level 6 offers programs")
    if "vedi solo" not in sample["prompt"]:
        errors.append("the exercise does not say which part of the program the options show")
    if sample.get("solutionCode") != params["program"]:
        errors.append("the solution shows the whole program")


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    case = params.get("case")
    if not choice_of(sample) or level not in LEVELS:
        return errors + ([] if level in LEVELS else [f"unknown level {level}"]), case
    coded = level in (1, 4, 6)
    if coded != ("program" in params):
        return errors + ["levels 1, 4 and 6 have a reference program, the others have none"], case
    if not 2 <= len(sample["steps"]) <= 3:
        errors.append(f"{len(sample['steps'])} steps")
    if "\n" in sample["solution"]:
        errors.append("the solution is not one row")
    texts = [sample["prompt"], sample["problem"], sample["solution"], *sample["steps"]]
    texts += [o.get("latex", "") for o in choice_of(sample)["options"]]
    if any(re.search(r"\bO\(|\\mathcal\{O\}|O grande", t) for t in texts):
        errors.append("the big O notation is not of this lesson")
    codes = [sample.get("code"), sample.get("solutionCode"), params.get("program")]
    codes += [{"python": o["values"][0], "cpp": o["values"][1]} for o in choice_of(sample)["options"] if "code" in o]
    if sample["answer"]["kind"] == "program":
        codes.append(sample["answer"]["start"])
    if any(c and re.search(r"\bvector\b", c["cpp"]) for c in codes):
        errors.append("the C++ uses arrays, not vector")
    try:
        LEVELS[level](sample, errors)
    except (KeyError, TypeError, ValueError, IndexError, AssertionError) as e:
        errors.append(f"params cannot be read: {e!r}")
    return errors, case
