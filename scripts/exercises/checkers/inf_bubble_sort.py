"""Checker for inf-bubble-sort (specs/exercises/inf-bubble-sort.md), lesson 76 "L'ordinamento a bolle".

Written from the spec. Every program is run by Python (checkers/_inf_codice.py), and with INF_CPP=1 by the C++
compiler too. What is proper to each level is worked out here from the vectors in `params`:
- level 1: the vector after the first pass, and the pass is worth asking (two swaps at least, not yet in order);
- level 2: the comparisons are n(n - 1)/2, the swaps are the pairs out of order, counted here without sorting;
- level 3: the program shown writes the passes done with the flag, or the swaps;
- level 4: four inner loops shown alone; the right program writes the two vectors in the order asked for;
- level 5: the solution, on each of its three runs, writes the vector in order, the swaps or the vector after k
  passes, and the answer must have a function of its own and two nested loops.
"""
import re

from checkers._inf_codice import choice_of, common, has

CASE_RANGES = {
    1: {"cinque": (0.40, 0.60), "sei": (0.40, 0.60)},
    2: {"confronti": (0.40, 0.60), "scambi": (0.40, 0.60)},
    3: {"giri": (0.40, 0.60), "scambi": (0.40, 0.60)},
    4: {"crescente": (0.40, 0.60), "decrescente": (0.40, 0.60)},
    5: {"vettore": (0.25, 0.42), "scambi": (0.25, 0.42), "giri": (0.25, 0.42)},
}

ORDERS = ("crescente", "decrescente")


def out_of_order(a, b, order):
    """Whether two neighbours, `a` on the left, must be swapped."""
    return a > b if order == "crescente" else a < b


def one_pass(v, upto, order="crescente"):
    """One pass over the first `upto` elements, in place; the swaps it made."""
    swaps = 0
    for j in range(upto - 1):
        if out_of_order(v[j], v[j + 1], order):
            v[j], v[j + 1] = v[j + 1], v[j]
            swaps += 1
    return swaps


def after_passes(v, k, order="crescente"):
    """The vector after the first k passes, each one element shorter than the one before."""
    w = list(v)
    for i in range(k):
        one_pass(w, len(w) - i, order)
    return w


def pairs_out_of_order(v, order="crescente"):
    """The swaps of the whole sort: the pairs, near or far, whose left element must end on the right."""
    return sum(1 for i in range(len(v)) for j in range(i + 1, len(v)) if out_of_order(v[i], v[j], order))


def passes_with_flag(v):
    """The passes of the version that stops after the first pass without swaps, and after n - 1 at most."""
    w = list(v)
    done = 0
    while done < len(w) - 1:
        swaps = one_pass(w, len(w) - done)
        done += 1
        if swaps == 0:
            break
    return done


def numbers(v):
    return ", ".join(str(x) for x in v)


def arrays_only(program, errors):
    if re.search(r"\bvector\s*<|#include <vector>", program["cpp"]):
        errors.append("the C++ uses vector: the lesson has arrays")


def check_level1(sample, params, choice, errors):
    v = params["vector"]
    if len(v) not in (5, 6) or len(set(v)) != len(v):
        errors.append("a vector of 5 or 6 different numbers")
    if params["case"] != {5: "cinque", 6: "sei"}.get(len(v)):
        errors.append("the case is not the size of the vector")
    if numbers(v) not in sample["problem"] or "primo giro" not in sample["problem"]:
        errors.append("the question does not show the vector or does not ask for the first pass")
    w = list(v)
    swaps = one_pass(w, len(w))
    if swaps < 2 or w == sorted(v) or v[-1] == max(v):
        errors.append("the first pass tells little: fewer than two swaps, or the vector comes out in order")
    right = choice["options"][choice["correct"]]
    if right["values"] != [numbers(w)] or right.get("text") != numbers(w):
        errors.append(f"after the first pass the vector is {w}, and the right option says {right['values']}")
    if sample["solution"] != numbers(w):
        errors.append("the solution is not the vector after the first pass")
    for i, o in enumerate(choice["options"]):
        shown = [int(x) for x in re.findall(r"\d+", o.get("text", ""))]
        if sorted(shown) != sorted(v):
            errors.append(f"option {i} is not the same numbers in another order")


def check_level2(sample, params, choice, errors):
    v = params["vector"]
    case = params["case"]
    n = len(v)
    if len(set(v)) != n or numbers(v) not in sample["problem"]:
        errors.append("the question shows a vector of different numbers")
    if f"Quanti {case} fa" not in sample["problem"] or "tutti i giri" not in sample["problem"]:
        errors.append("the question does not ask for the count of its case in the version that does every pass")
    comparisons = n * (n - 1) // 2
    swaps = pairs_out_of_order(v)
    if case == "confronti":
        if not 5 <= n <= 8 or swaps == 0:
            errors.append("comparisons are asked on 5 to 8 numbers not yet in order")
        wanted = comparisons
    else:
        if n not in (4, 5) or not 2 <= swaps < comparisons:
            errors.append("swaps are asked on 4 or 5 numbers, neither in order nor reversed")
        wanted = swaps
    right = choice["options"][choice["correct"]]
    if right["values"] != [str(wanted)]:
        errors.append(f"the {case} are {wanted}, and the right option says {right['values']}")
    if sample["solution"] != f"{wanted} {case}":
        errors.append("the solution is not the count")
    if not all(re.fullmatch(r"\d+", o["values"][0]) for o in choice["options"]):
        errors.append("the options are numbers")


def check_level3(sample, params, choice, errors):
    v = params["vector"]
    case = params["case"]
    program = params["program"]
    n = len(v)
    if n not in (5, 6) or len(set(v)) != n:
        errors.append("a vector of 5 or 6 different numbers")
    if f"[{numbers(v)}]" not in program["python"] or f"{{{numbers(v)}}}" not in program["cpp"]:
        errors.append("the vector of params is not the one in the program")
    if sample.get("code") != program or params.get("ask") != "output" or params["tests"] != [[]]:
        errors.append("level 3 shows a whole program that reads nothing and asks what it writes")
    for language in ("python", "cpp"):
        for need in ("funzione", "vettore", "annidati", "selezione"):
            if not has(need, program[language], language):
                errors.append(f"the program in {language} has no {need}")
    if case == "giri":
        passes = passes_with_flag(v)
        if not 2 <= passes <= n - 2:
            errors.append("the flag must stop the passes early, after one that swaps")
        wanted = [f"giri fatti: {passes}"]
        if "scambiato" not in program["python"] or not has("while", program["python"], "python") or not has("while", program["cpp"], "cpp"):
            errors.append("the passes are counted by the version with the flag and the while")
    else:
        swaps = pairs_out_of_order(v)
        if not 2 <= swaps < n * (n - 1) // 2:
            errors.append("a vector neither in order nor reversed")
        wanted = [str(swaps)]
        if "scambiato" in program["python"] or "return scambi" not in program["python"]:
            errors.append("the swaps are counted by the version that does every pass")
    if params["expected"] != [wanted]:
        errors.append(f"the program of {case} writes {wanted}, and the sample says {params['expected']}")


def inner_loop_alone(options, errors):
    for i, o in enumerate(options):
        code = o.get("code")
        if not code:
            errors.append(f"option {i} is not a program")
        elif not code["python"].startswith("for j in range(") or not code["cpp"].startswith("for (int j = ") or "def " in code["python"] or "ordina" in code["cpp"]:
            errors.append(f"option {i} does not show the inner loop alone")


def check_level4(sample, params, choice, errors):
    order = params["case"]
    vectors = params["vectors"]
    if order not in ORDERS or f"ordine {order}" not in sample["problem"]:
        errors.append("the question does not name the order of its case")
    if len(vectors) != 2 or not all(5 <= len(v) <= 6 and len(set(v)) == len(v) for v in vectors):
        errors.append("the function is tried on two vectors of 5 or 6 different numbers")
    wanted = [" ".join(str(x) for x in sorted(v, reverse=order == "decrescente")) for v in vectors]
    if params["expected"] != [wanted] or params["tests"] != [[]]:
        errors.append(f"the right program writes {wanted}, and the sample says {params['expected']}")
    for v in vectors:
        if f"[{numbers(v)}]" not in params["program"]["python"]:
            errors.append("a vector of params is not in the program")
    inner_loop_alone(choice["options"], errors)
    if sample.get("solutionCode") != choice["options"][choice["correct"]].get("code"):
        errors.append("the program of the solution is not the right option")


def check_level5(sample, params, choice, errors):
    kind = params["case"]
    order = params.get("order")
    k = params.get("k")
    answer = sample["answer"]
    problem = sample["problem"]
    if answer["kind"] != "program" or answer.get("needs") != ["funzione", "annidati"]:
        errors.append("level 5 asks for a program with a function of its own and two nested loops")
        return
    if order not in ORDERS or f"ordine {order}" not in problem:
        errors.append("the exercise does not name the order")
        return
    if "cicli, uno dentro l'altro" not in problem or "ordinamento a bolle" not in problem:
        errors.append("the exercise names the bubble sort and the two nested loops it asks for")
    if "La lettura c'è già" not in problem or "input()" not in answer["start"]["python"] or "cin >>" not in answer["start"]["cpp"]:
        errors.append("the reading is given, and the exercise says so")
    if kind == "giri" and (k not in (2, 3) or f"primi {k} giri" not in problem):
        errors.append("the exercise does not name the passes to do")
    if kind == "scambi" and "numero di scambi" not in problem:
        errors.append("the exercise does not ask for the number of swaps")
    if kind != "giri" and k is not None:
        errors.append("only the case of the passes has a number of passes")
    tests = params["tests"]
    if len(tests) != 3:
        errors.append("level 5 is tried on three vectors")
    wanted = []
    vectors = []
    for typed in tests:
        n, v = int(typed[0]), [int(x) for x in typed[1:]]
        if n != len(v) or not 3 <= n <= 100:
            errors.append("a run types n and then n numbers")
        vectors.append(v)
        if kind == "vettore":
            wanted.append([str(x) for x in sorted(v, reverse=order == "decrescente")])
        elif kind == "scambi":
            wanted.append([str(pairs_out_of_order(v, order))])
            if len(set(v)) != len(v):
                errors.append("the swaps are counted on different numbers: with two equal ones > and >= would not agree")
        else:
            wanted.append([str(x) for x in after_passes(v, k, order)])
    if params["expected"] != wanted:
        errors.append(f"the solution of {kind} must write {wanted}, and the sample says {params['expected']}")
    if len({" ".join(rows) for rows in wanted}) != len(wanted):
        errors.append("two runs write the same")
    if kind == "scambi" and ["0"] not in wanted:
        errors.append("no run is on a vector already in order")
    if kind == "vettore" and not any(len(set(v)) < len(v) for v in vectors):
        errors.append("no run has a number that comes twice")
    if kind == "giri" and not any(after_passes(v, k, order) != sorted(v, reverse=order == "decrescente") for v in vectors):
        errors.append("sorting the whole vector would pass every run")
    inner_loop_alone(choice["options"], errors)
    if "ciclo interno" not in sample["prompt"]:
        errors.append("the exercise does not say what the options show")
    if sample.get("solutionCode") != params["program"]:
        errors.append("the program of the solution is not the reference")


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    case = params.get("case")
    choice = choice_of(sample)
    if not choice or not isinstance(choice.get("correct"), int) or not 0 <= choice["correct"] < len(choice["options"]):
        return errors, case
    if not 2 <= len(sample["steps"]) <= 3:
        errors.append("the steps are two or three")
    if "\n" in sample["solution"]:
        errors.append("the solution is one row")
    if re.search(r"O\(|vector<", " ".join([sample["problem"], sample["solution"], *sample["steps"]])):
        errors.append("the lesson has no big O and no vector")
    if level in (1, 2):
        if "program" in params or any("code" in o for o in choice["options"]):
            return errors + ["a level of counting has no program"], case
        (check_level1 if level == 1 else check_level2)(sample, params, choice, errors)
        return errors, case
    if "program" not in params:
        return errors + ["a level with programs has no reference program"], case
    arrays_only(params["program"], errors)
    for o in choice["options"]:
        if "code" in o and len(o["values"]) == 2:
            arrays_only({"cpp": o["values"][1]}, errors)
    {3: check_level3, 4: check_level4, 5: check_level5}[level](sample, params, choice, errors)
    return errors, case
