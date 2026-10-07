"""Checker for inf-matrici (specs/exercises/inf-matrici.md): the lesson "Le matrici".

Written from the spec. Every program is run by Python (checkers/_inf_codice.py), and with INF_CPP=1 by the C++
compiler too. What is proper to each level is worked out here again from the matrix in `params`:
- level 1: the element m[a][b], or the value m[c][d] + k written into it;
- level 2: the sum of one row or of one column;
- levels 3 and 4: the sums by rows, the sums by columns, the counts by rows of the elements >= k;
- level 5: the sum of the main or of the other diagonal of a square matrix;
- level 6: on each matrix typed at the keyboard, the sums by rows or by columns, the counts by rows, or the sum of
  a diagonal.
"""
from checkers._inf_codice import choice_of, common, has

HALF = (0.40, 0.60)
THIRD = (0.25, 0.42)
QUARTER = (0.19, 0.31)
EIGHTH = (0.08, 0.17)
CASE_RANGES = {
    1: {"legge": HALF, "scrive": HALF},
    2: {"riga": HALF, "colonna": HALF},
    3: {"righe": THIRD, "colonne": THIRD, "conta": THIRD},
    4: {"righe": THIRD, "colonne": THIRD, "conta": THIRD},
    5: {"principale": HALF, "secondaria": HALF},
    6: {"righe": QUARTER, "colonne": QUARTER, "conta": QUARTER, "principale": EIGHTH, "secondaria": EIGHTH},
}


def by_rows(m):
    return [sum(row) for row in m]


def by_columns(m):
    return [sum(row[j] for row in m) for j in range(len(m[0]))]


def main_diagonal(m):
    return sum(m[i][i] for i in range(len(m)))


def other_diagonal(m):
    return sum(m[i][len(m) - 1 - i] for i in range(len(m)))


def lines(numbers):
    return [str(x) for x in numbers]


TESTS = {">=": lambda x, k: x >= k, ">": lambda x, k: x > k, "<": lambda x, k: x < k}
SAID = {">=": "maggiori o uguali a", ">": "maggiori di", "<": "minori di"}


def nested(case, m, k, op=">="):
    if case == "righe":
        return lines(by_rows(m))
    if case == "colonne":
        return lines(by_columns(m))
    return lines(sum(1 for x in row if TESTS[op](x, k)) for row in m)


def is_matrix(m, square=None):
    if not isinstance(m, list) or len(m) < 2 or any(not isinstance(row, list) or len(row) != len(m[0]) for row in m):
        return False
    if len(m[0]) < 2 or len(m) > 4 or len(m[0]) > 4:
        return False
    return square is None or (len(m) == len(m[0])) == square


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    case = params.get("case")
    choice = choice_of(sample)
    if not choice or "program" not in params:
        return errors + ["no multiple choice, or no reference program"], case
    options = choice["options"]
    program = params["program"]
    expected = params.get("expected")

    if level <= 5:
        m = params.get("matrix")
        if not is_matrix(m, square=(level == 5)):
            return errors + ["the matrix of the sample is not one of the level"], case
        if params["tests"] != [[]]:
            errors.append("a program that is read reads nothing")
        # the matrix of params is the one written in the program, row by row
        for row in m:
            if "[" + ", ".join(map(str, row)) + "]" not in program["python"] or "{" + ", ".join(map(str, row)) + "}" not in program["cpp"]:
                errors.append(f"the row {row} is not in the program")
    if level in (1, 2, 3, 5):
        if params.get("ask") != "output" or sample.get("code") != program:
            errors.append("the level shows the whole program and asks what it writes")

    if level == 1:
        a, b = params["a"], params["b"]
        flat = [x for row in m for x in row]
        if len(set(flat)) != len(flat):
            errors.append("the elements are not all different")
        if case == "legge":
            want = m[a][b]
            if f"m[{a}][{b}]" not in program["python"]:
                errors.append("the program does not read m[a][b]")
        else:
            c, d, k = params["c"], params["d"], params["k"]
            want = m[c][d] + k
            if f"m[{a}][{b}] = m[{c}][{d}] + {k}" not in program["python"]:
                errors.append("the program does not write m[a][b] from m[c][d]")
        if expected != [[str(want)]]:
            errors.append(f"the element is {want}, and the sample says {expected}")
    elif level == 2:
        index = params["index"]
        want = sum(m[index]) if case == "riga" else sum(row[index] for row in m)
        if expected != [[str(want)]]:
            errors.append(f"the sum of the {case} {index} is {want}, and the sample says {expected}")
        for language in ("python", "cpp"):
            if not has("ciclo", program[language], language) or has("annidati", program[language], language):
                errors.append(f"level 2 has one loop, in {language}")
    elif level in (3, 4):
        op = params.get("op", ">=") if level == 4 else ">="
        want = nested(case, m, params["k"], op)
        if expected != [want]:
            errors.append(f"the loops of {case} write {want}, and the sample says {expected}")
        for language in ("python", "cpp"):
            if not has("annidati", program[language], language):
                errors.append(f"no nested loops in {language}")
        if level == 4:
            if not all("code" in o for o in options):
                errors.append("level 4 offers programs")
            for i, o in enumerate(options):
                if "code" in o and ("m = [" in o["code"]["python"] or "main" in o["code"]["cpp"] or not o["code"]["python"].lstrip().startswith(("for", "s", "tot", "conta"))):
                    errors.append(f"option {i} does not show the loops alone")
            if "R righe e C colonne" not in sample["problem"]:
                errors.append("the question does not say what R and C are")
            asked = {"righe": "la somma di ogni riga", "colonne": "la somma di ogni colonna", "conta": f"{SAID[op]} {params['k']}"}[case]
            if asked not in sample["problem"]:
                errors.append("the question does not ask for what the right loops do")
    elif level == 5:
        want = main_diagonal(m) if case == "principale" else other_diagonal(m)
        if expected != [[str(want)]]:
            errors.append(f"the diagonal {case} adds up to {want}, and the sample says {expected}")
    elif level == 6:
        answer = sample["answer"]
        R, C = params["rows"], params["columns"]
        if answer["kind"] != "program":
            errors.append("level 6 asks for a program")
        elif len(params["tests"]) != 3 or not all(len(t) == R * C for t in params["tests"]):
            errors.append("level 6 is tried on three matrices typed one number per line")
        else:
            wanted = []
            for typed in params["tests"]:
                numbers = [int(x) for x in typed]
                m = [numbers[i * C : (i + 1) * C] for i in range(R)]
                if case in ("righe", "colonne", "conta"):
                    wanted.append(nested(case, m, params.get("k")))
                else:
                    wanted.append(lines([main_diagonal(m) if case == "principale" else other_diagonal(m)]))
            if wanted != expected:
                errors.append(f"on the matrices typed the answer is {wanted}, and the sample says {expected}")
            if len({tuple(rows) for rows in expected}) != 3:
                errors.append("the three runs do not write three different things")
            if "La lettura c'è già" not in sample["problem"] or "input()" not in answer["start"]["python"] or "cin >>" not in answer["start"]["cpp"]:
                errors.append("the reading is given, and the exercise says so")
            if f"{R} righe e {C} colonne" not in sample["problem"]:
                errors.append("the exercise does not say the size of the matrix")
            asked = {"righe": "la somma di ogni riga", "colonne": "la somma di ogni colonna", "conta": f"maggiori o uguali a {params.get('k')}", "principale": "diagonale principale", "secondaria": "diagonale secondaria"}[case]
            if asked not in sample["problem"]:
                errors.append("the exercise does not ask for what the solution does")
            if case in ("principale", "secondaria") and R != C:
                errors.append("a diagonal needs a square matrix")
        if not all("code" in o for o in options):
            errors.append("the multiple choice of level 6 offers programs")
        for i, o in enumerate(options):
            if "code" in o and ("input" in o["code"]["python"] or "cin" in o["code"]["cpp"]):
                errors.append(f"option {i} shows the reading too")
    return errors, case
