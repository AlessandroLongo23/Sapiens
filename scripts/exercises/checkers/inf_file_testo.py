"""Checker for inf-file-testo (specs/exercises/inf-file-testo.md): reading and writing a text file.

Written from the spec. Every program is run by Python (checkers/_inf_codice.py), with the files of the sample and
never the disk, and with INF_CPP=1 by the C++ compiler too. What each level asks is worked out again here from the
data in `params`:
- level 1: what is written from the rows of the file of names, case by case;
- level 2: the sum, the count or the largest of the numbers of the file;
- level 3: what the file holds at the end, from how it is opened and what is written, and from running the program;
- level 4: four programs, of which only the right one writes what the task says on the file shown;
- level 5: the solution writes the file and reads it back, and what it prints is worked out here from the numbers
  typed.
"""
import re

from checkers._inf_codice import choice_of, common, has
from checkers._inf_file import file_errors, rows_of, run_with_files

CASE_RANGES = {
    1: {k: (0.13, 0.27) for k in ("conta", "ultima", "seconda", "numerate", "manca")},
    2: {k: (0.25, 0.42) for k in ("somma", "conta", "massimo")},
    3: {k: (0.13, 0.27) for k in ("scrive", "accoda", "attaccati", "nuovo", "due volte")},
    4: {k: (0.25, 0.42) for k in ("conta", "somma", "somma grandi")},
    5: {k: (0.13, 0.27) for k in ("tutti-somma", "grandi-somma", "grandi-quanti", "pari-somma", "pari-quanti")},
}


def file_shown(sample, errors):
    """The file under the question is the one the program finds beside it."""
    params = sample["params"]
    name = params["file"]
    if not re.fullmatch(r"[a-z]+\.txt", name):
        errors.append(f"the file has an odd name: {name}")
    if name in params["files"]:
        if sample.get("listing") != params["files"][name]:
            errors.append("the file shown is not the file of the sample")
        if name not in sample["problem"]:
            errors.append("the question does not name the file")
    elif "listing" in sample:
        errors.append("a file is shown and the program finds none")


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    case = params.get("case")
    choice = choice_of(sample)
    if not choice or "program" not in params:
        return errors + ["no multiple choice, or no reference program"], case
    options = choice["options"]
    right = options[choice["correct"]]
    program = params["program"]

    if level in (1, 2, 3, 4):
        file_shown(sample, errors)
        if params["tests"] != [[]]:
            errors.append("a program that is read reads nothing from the keyboard")
        for language, word in (("python", "open("), ("cpp", "stream file(")):
            if word not in program[language]:
                errors.append(f"the program in {language} opens no file")

    if level in (1, 2):
        if sample.get("code") != program or params.get("ask") != "output":
            errors.append("the level shows the whole program and asks what it writes")

    if level == 1:
        rows = params["rows"]
        name = params["file"]
        if not 3 <= len(rows) <= 5 or len(set(rows)) != len(rows) or params["files"] != {name: "".join(r + "\n" for r in rows)}:
            errors.append("a file of 3 to 5 different names")
        wanted = {
            "conta": [str(len(rows))],
            "ultima": [rows[-1]],
            "seconda": [rows[1]],
            "numerate": [f"{i + 1} {r}" for i, r in enumerate(rows)],
            "manca": [rows[0]] if params["opened"] == name else ["non trovato"],
        }[case]
        if params["expected"] != [wanted]:
            errors.append(f"with the rows {rows} the case {case} writes {wanted}, and the sample says {params['expected']}")
        if case != "manca" and params["opened"] != name:
            errors.append("the program opens another file")
        if f'"{params["opened"]}"' not in program["python"] or f'"{params["opened"]}"' not in program["cpp"]:
            errors.append("the program does not open the file it says")

    if level in (2, 4):
        numbers = params["numbers"]
        k = params["k"]
        if not 4 <= len(numbers) <= 5 or len(set(numbers)) != len(numbers) or params["files"] != {params["file"]: "".join(f"{x}\n" for x in numbers)}:
            errors.append("a file of 4 or 5 different numbers")
        for language, word in (("python", "int(riga)"), ("cpp", "stoi(riga)")):
            if word not in program[language]:
                errors.append(f"the program in {language} does not convert the rows")
        wanted = {
            (2, "somma"): sum(numbers),
            (2, "conta"): sum(1 for x in numbers if x >= k),
            (2, "massimo"): max(numbers),
            (4, "conta"): sum(1 for x in numbers if x > k),
            (4, "somma"): sum(numbers),
            (4, "somma grandi"): sum(x for x in numbers if x > k),
        }[(level, case)]
        if params["expected"] != [[str(wanted)]]:
            errors.append(f"with the numbers {numbers} and k = {k} the case {case} writes {wanted}, and the sample says {params['expected']}")
        if level == 2 and case == "conta" and str(k) not in program["python"]:
            errors.append("the program does not compare with k")
        if level == 4 and case != "somma" and f"maggiori di {k}" not in sample["problem"]:
            errors.append("the question does not say the number to compare with")

    if level == 3:
        name = params["file"]
        old, added, runs = params["old"], params["added"], params["runs"]
        once = ["".join(added)] if params["glued"] else list(added)
        wanted = (old + once * runs) if params["append"] else once
        if case == "nuovo" and (old or params["files"]):
            errors.append("the case of the new file has a file")
        if case != "nuovo" and params["files"] != {name: "".join(r + "\n" for r in old)}:
            errors.append("the file of the sample is not the old rows")
        if (case == "scrive" and params["append"]) or (case == "accoda" and not params["append"]) or (params["glued"] != (case == "attaccati")) or (runs != (2 if case == "due volte" else 1)):
            errors.append(f"the case {case} does not match how the file is opened and written")
        if (runs == 2) != ("due volte" in sample["problem"]):
            errors.append("the question does not say how many times the program is run")
        after, more = file_errors("the program", program, [], params["files"], runs)
        errors += more
        if after is not None:
            if set(after) != {name}:
                errors.append(f"the program leaves the files {sorted(after)}")
            elif rows_of(after[name]) != wanted:
                errors.append(f"the file holds {rows_of(after[name])} at the end, and from the data it should hold {wanted}")
        if right["values"] != ["\n".join(wanted)]:
            errors.append(f"the right option is not what the file holds: {wanted}")
        if "listing" in right and right["listing"] != "".join(r + "\n" for r in wanted):
            errors.append("the right option does not show the rows of the file")
        if any("code" in o for o in options):
            errors.append("level 3 offers what the file holds, not programs")

    if level == 4:
        if not all("code" in o for o in options):
            errors.append("level 4 offers programs")
        for i, o in enumerate(options):
            if "code" in o and ("main" in o["code"]["cpp"] or "#include" in o["code"]["cpp"]):
                errors.append(f"option {i} does not show the body of main alone")

    if level == 5:
        answer = sample["answer"]
        if answer["kind"] != "program" or answer.get("needs") != ["ciclo"]:
            errors.append("level 5 asks for a program with a loop")
            return errors, case
        keep, stat = case.split("-")
        k = params["k"]
        out = params["out"]
        kept = {"tutti": lambda x: True, "grandi": lambda x: x >= k, "pari": lambda x: x % 2 == 0}[keep]
        if len(params["tests"]) != 3:
            errors.append("level 5 is tried on three lists of numbers")
        for typed, rows in zip(params["tests"], params["expected"]):
            xs = [int(x) for x in typed[1:]]
            if int(typed[0]) != len(xs) or not 3 <= len(xs) <= 5:
                errors.append("a test does not type n and then n numbers")
            written = [x for x in xs if kept(x)]
            wanted = sum(written) if stat == "somma" else len(written)
            if rows != [str(wanted)]:
                errors.append(f"with {typed} the case {case} writes {wanted}, and the sample says {rows}")
            # the solution really leaves the numbers in the file, one per row
            _printed, after = run_with_files(answer["solution"]["python"], typed)
            if after is None or after.get(out) != "".join(f"{x}\n" for x in written):
                errors.append(f"with {typed} the solution does not leave {written} in {out}")
        if len({tuple(rows) for rows in params["expected"]}) < 2:
            errors.append("the three runs write the same")
        if keep == "grandi" and f"maggiori o uguali a {k}" not in sample["problem"]:
            errors.append("the exercise does not say the number to compare with")
        if out not in sample["problem"] or "ciclo" not in sample["problem"] or "La lettura di n c'è già" not in sample["problem"]:
            errors.append("the exercise names the file and the loop, and says that n is read")
        for language, word in (("python", "input()"), ("cpp", "cin >>")):
            if word not in answer["start"][language]:
                errors.append(f"the {language} to start from does not read n")
            if has("ciclo", answer["start"][language], language):
                errors.append(f"the {language} to start from already has a loop")
        if not all("code" in o for o in options):
            errors.append("the multiple choice of level 5 offers programs")
    return errors, case
