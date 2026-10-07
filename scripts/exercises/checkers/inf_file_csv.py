"""Checker for inf-file-csv (specs/exercises/inf-file-csv.md): data files in CSV format.

Written from the spec. The rows and the files are cut here again, with Python's own `split`; every program is run
by Python (checkers/_inf_codice.py) with the files of the sample, and with INF_CPP=1 by the C++ compiler too.
- level 1: the fields of the row shown, cut at the separator the question names;
- level 2: the table read from the file shown (header, rows, columns);
- level 3: what the program writes, worked out from the table case by case;
- level 4: four programs, of which only the right one writes what the task says;
- level 5: what the file holds at the end, from the two vectors and from running the program;
- level 6: what the solution prints, worked out from the rows typed.
"""
import re

from checkers._inf_codice import choice_of, common, has
from checkers._inf_file import file_errors, rows_of

CASE_RANGES = {
    1: {k: (0.25, 0.42) for k in ("quanti", "quale", "separatore")},
    2: {k: (0.25, 0.42) for k in ("valore", "righe", "campo")},
    3: {k: (0.18, 0.32) for k in ("somma", "conta", "somma filtrata", "intestazione")},
    4: {k: (0.25, 0.42) for k in ("somma", "conta", "somma filtrata")},
    5: {k: (0.18, 0.32) for k in ("giusto", "senza intestazione", "attaccate", "senza separatore")},
    6: {k: (0.25, 0.42) for k in ("somma", "conta", "filtro")},
}

SEPARATOR = {",": "virgola", ";": "punto e virgola"}


def table_of(text):
    """The header and the rows of a CSV file with three columns: a name, a label, a whole number."""
    header, *rows = [row.split(",") for row in rows_of(text)]
    return header, [(a, b, int(c)) for a, b, c in rows]


def table_errors(text):
    errors = []
    header, rows = table_of(text)
    if len(header) != 3 or not 4 <= len(rows) <= 5:
        errors.append("a table of three columns and 4 or 5 rows")
    if len({r[0] for r in rows}) != len(rows) or len({r[2] for r in rows}) != len(rows):
        errors.append("the names and the numbers of the table are all different")
    return errors


def right_value(sample, wanted, errors):
    choice = choice_of(sample)
    right = choice["options"][choice["correct"]]
    if right["values"] != [str(wanted)]:
        errors.append(f"the right option is {right['values']}, and from the data it is {wanted}")


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    case = params.get("case")
    choice = choice_of(sample)
    if not choice:
        return errors, case
    options = choice["options"]
    problem = sample["problem"]

    if level == 1:
        row, separator = params["row"], params["separator"]
        if "program" in params or sample.get("listing") != row + "\n":
            errors.append("level 1 shows one row and no program")
        if f"a ogni {SEPARATOR[separator]}" not in problem:
            errors.append("the question does not name the separator")
        if separator == "," and "a ogni punto e virgola" in problem:
            errors.append("the question names the other separator")
        fields = row.split(separator)
        if case == "quale":
            at = params["at"]
            if not 1 <= at < len(fields) or f"il campo {at}, contando da 0" not in problem:
                errors.append("the question asks for a field from 1 on, counted from 0")
            else:
                right_value(sample, fields[at], errors)
            if len(set(fields)) != len(fields):
                errors.append("two fields are the same")
        else:
            right_value(sample, len(fields), errors)
            if case == "quanti" and not 3 <= len(fields) <= 5:
                errors.append("a row of 3 to 5 fields")
            if case == "separatore":
                other = ";" if separator == "," else ","
                if other not in row or len(fields) > 2:
                    errors.append("the row is written with the other separator")

    if level == 2:
        text = params["file"]
        if "program" in params or sample.get("listing") != text:
            errors.append("level 2 shows the file and no program")
        errors += table_errors(text)
        header, rows = table_of(text)
        if case == "righe":
            right_value(sample, len(rows), errors)
            if "senza contare l'intestazione" not in problem:
                errors.append("the question does not say that the header is left out")
        elif case == "campo":
            right_value(sample, header.index(params["column"]), errors)
            if "contando da 0" not in problem or params["column"] not in problem:
                errors.append("the question names the column and counts from 0")
        else:
            row = next(r for r in rows if r[0] == params["name"])
            right_value(sample, row[header.index(params["column"])], errors)
            if params["name"] not in problem or params["column"] not in problem:
                errors.append("the question names the row and the column")

    if level in (3, 4):
        name = params["file"]
        text = params["files"].get(name, "")
        if list(params["files"]) != [name] or sample.get("listing") != text or name not in problem:
            errors.append("the file shown is the one file the program finds, and the question names it")
        errors += table_errors(text)
        header, rows = table_of(text)
        label = params["label"]
        with_label = [r for r in rows if r[1] == label]
        if not 2 <= len(with_label) < len(rows):
            errors.append("the label is on at least two rows and not on all")
        wanted = {
            "somma": sum(r[2] for r in rows),
            "conta": len(with_label),
            "somma filtrata": sum(r[2] for r in with_label),
            "intestazione": len(rows) + 1,
        }[case]
        if params["expected"] != [[str(wanted)]]:
            errors.append(f"the case {case} writes {wanted} on this table, and the sample says {params['expected']}")
        program = params["program"]
        if "split(" not in program["python"] or "getline(file, " + header[0] + ", ',')" not in program["cpp"]:
            errors.append("the program does not cut the rows as the lesson does")
        skips = "file.readline()" in program["python"]
        if skips != (case != "intestazione") or skips != ("getline(file, riga);" in program["cpp"]):
            errors.append("the header is skipped in every case but one, in the two languages alike")
        if level == 3 and (sample.get("code") != program or params.get("ask") != "output"):
            errors.append("level 3 shows the whole program and asks what it writes")
        if level == 4:
            if case == "intestazione" or not all("code" in o for o in options):
                errors.append("level 4 offers programs for the three tasks")
            if case != "somma" and label not in problem:
                errors.append("the question does not name the label")
            for i, o in enumerate(options):
                if "code" in o and ("main" in o["code"]["cpp"] or "#include" in o["code"]["cpp"]):
                    errors.append(f"option {i} does not show the body of main alone")

    if level == 5:
        name, column, names, values = params["file"], params["column"], params["names"], params["values"]
        if len(names) != 3 or len(values) != 3 or len(set(names)) != 3 or name not in problem:
            errors.append("three names and three numbers, and the question names the file")
        header = [] if case == "senza intestazione" else [f"nome,{column}"]
        pairs = [f"{n}{'' if case == 'senza separatore' else ','}{v}" for n, v in zip(names, values)]
        wanted = header + (["".join(pairs)] if case == "attaccate" else pairs)
        after, more = file_errors("the program", params["program"], [], {})
        errors += more
        if after is not None and (set(after) != {name} or rows_of(after[name]) != wanted):
            errors.append(f"the program leaves {after}, and from the data the file should hold {wanted}")
        right = options[choice["correct"]]
        if right["values"] != ["\n".join(wanted)] or right.get("listing") != "".join(r + "\n" for r in wanted):
            errors.append(f"the right option is not what the file holds: {wanted}")
        if sample.get("code") != params["program"] or params["expected"] != [[]]:
            errors.append("level 5 shows the whole program, which prints nothing")

    if level == 6:
        answer = sample["answer"]
        if answer["kind"] != "program" or answer.get("needs") != ["ciclo"]:
            errors.append("level 6 asks for a program with a loop")
            return errors, case
        k, sport = params["k"], params["sport"]
        fields = 3 if case == "filtro" else 2
        if len(params["tests"]) != 3:
            errors.append("level 6 is tried on three lists of rows")
        for typed, rows in zip(params["tests"], params["expected"]):
            cut = [row.split(",") for row in typed[1:]]
            if int(typed[0]) != len(cut) or not 3 <= len(cut) <= 4 or any(len(c) != fields for c in cut):
                errors.append("a test does not type n and then n rows of fields")
                continue
            wanted = {
                "somma": sum(int(c[-1]) for c in cut),
                "conta": sum(1 for c in cut if int(c[-1]) >= k),
                "filtro": sum(int(c[-1]) for c in cut if c[1] == sport),
            }[case]
            if rows != [str(wanted)]:
                errors.append(f"with {typed} the case {case} writes {wanted}, and the sample says {rows}")
        if len({tuple(rows) for rows in params["expected"]}) < 2:
            errors.append("the three runs write the same")
        shape = "nome,sport,punti" if case == "filtro" else "nome,punti"
        if f"nella forma {shape} " not in problem or params["tests"][0][1] not in problem or "ciclo" not in problem or "La lettura di n c'è già" not in problem:
            errors.append("the exercise says the shape of the rows with an example, names the loop and says that n is read")
        if (case == "conta" and f"almeno {k} punti" not in problem) or (case == "filtro" and sport not in problem):
            errors.append("the exercise does not say what the rows are compared with")
        for language, word in (("python", "split("), ("cpp", "getline(cin, nome, ',')")):
            if word not in answer["solution"][language]:
                errors.append(f"the solution in {language} does not cut the rows")
            if has("ciclo", answer["start"][language], language):
                errors.append(f"the {language} to start from already has a loop")
        if not all("code" in o for o in options):
            errors.append("the multiple choice of level 6 offers programs")
    return errors, case
