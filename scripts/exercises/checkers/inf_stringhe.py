"""Checker for inf-stringhe (specs/exercises/inf-stringhe.md): the lesson "Le stringhe".

Written from the spec. Every program is run by Python (checkers/_inf_codice.py), and with INF_CPP=1 by the C++
compiler too. What is proper to each level is worked out here again from the words in `params`, with Python's own
operations on strings and not with the loops of the generator:
- level 1: the length of the word, the character of an index, the character counted from the end;
- level 2: how many times a letter is in the word, how many letters come before one, how many double letters;
- level 3: the word backwards, one character every two, a letter replaced by an asterisk, every character twice;
- level 4: the smaller of two strings and whether a third is equal to the first;
- level 5: the function of the family on the two words; level 6: the same on each word typed.
"""
from checkers._inf_codice import choice_of, common, has

THIRD = (0.25, 0.42)
FIFTH = (0.14, 0.27)
QUARTER = (0.19, 0.31)
CASE_RANGES = {
    1: {"lunghezza": THIRD, "carattere": THIRD, "dalla-fine": THIRD},
    2: {"lettera": THIRD, "prima": THIRD, "doppie": THIRD},
    3: {"rovescia": FIFTH, "davanti": FIFTH, "salta": FIFTH, "sostituisce": FIFTH, "raddoppia": FIFTH},
    4: {"ordine": THIRD, "prefisso": THIRD, "maiuscola": THIRD},
    5: {"conta": QUARTER, "rovescia": QUARTER, "senza": QUARTER, "raddoppia": QUARTER},
    6: {"conta": THIRD, "rovescia": THIRD, "sostituisce": THIRD},
}

BUILDS = {
    "rovescia": lambda w, x: w[::-1],
    "davanti": lambda w, x: w[::-1],
    "salta": lambda w, x: w[::2],
    "sostituisce": lambda w, x: w.replace(x, "*"),
    "raddoppia": lambda w, x: "".join(c + c for c in w),
}
COUNTS = {
    "lettera": lambda w, x: w.count(x),
    "prima": lambda w, x: sum(1 for c in w if c < x),
    "doppie": lambda w, x: sum(1 for a, b in zip(w, w[1:]) if a == b),
}
FUNCTIONS = {
    "conta": lambda w, x: str(w.count(x)),
    "rovescia": lambda w, x: w[::-1],
    "senza": lambda w, x: w.replace(x, ""),
    "sostituisce": lambda w, x: w.replace(x, "*"),
    "salta": lambda w, x: w[::2],
    "raddoppia": lambda w, x: "".join(c + c for c in w),
}


def plain(word):
    return isinstance(word, str) and word.isascii() and word.isalpha() and word.islower() and 3 <= len(word) <= 10


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
    for language in ("python", "cpp"):
        if "string" not in program["cpp"] or "char " in program["cpp"].replace("char c)", "") or "#include <string>" not in program["cpp"]:
            errors.append("the C++ uses string, with its include, and no array of char")
            break

    if level <= 5 and params["tests"] != [[]]:
        errors.append("a program that is read reads nothing")
    if level <= 4 and (params.get("ask") != "output" or sample.get("code") != program):
        errors.append("the level shows the whole program and asks what it writes")
    if level <= 3:
        word = params.get("word")
        if not plain(word) or f'"{word}"' not in program["python"] or f'"{word}"' not in program["cpp"]:
            return errors + ["the word of the sample is not in the program"], case

    if level == 1:
        if len(set(word)) != len(word):
            errors.append("the letters of the word are not all different")
        want = str(len(word)) if case == "lunghezza" else word[params["k"]] if case == "carattere" else word[len(word) - params["back"]]
        if expected != [[want]]:
            errors.append(f"the program writes {want}, and the sample says {expected}")
        if has("ciclo", program["python"], "python"):
            errors.append("level 1 has no loop")
    elif level == 2:
        want = str(COUNTS[case](word, params.get("letter")))
        if expected != [[want]]:
            errors.append(f"the count of {case} is {want}, and the sample says {expected}")
        for language in ("python", "cpp"):
            if not has("ciclo", program[language], language) or not has("selezione", program[language], language):
                errors.append(f"level 2 has a loop with a selection, in {language}")
    elif level == 3:
        want = BUILDS[case](word, params.get("letter"))
        if expected != [[want]]:
            errors.append(f"the new string of {case} is {want}, and the sample says {expected}")
        if '= ""' not in program["python"] or not has("ciclo", program["python"], "python"):
            errors.append("level 3 builds a string from the empty one with a loop")
    elif level == 4:
        a, b, c = params["a"], params["b"], params["c"]
        want = [min(a, b), "uguali" if a == c else "diverse"]
        if expected != [want]:
            errors.append(f"the program writes {want}, and the sample says {expected}")
        if a == b:
            errors.append("the two strings compared with < are the same")
        if case == "prefisso" and not (a.startswith(b) or b.startswith(a)):
            errors.append("neither string is the beginning of the other")
        if case == "maiuscola" and not (min(a, b)[0].isupper() and max(a, b)[0].islower() and min(a, b).lower() > max(a, b)):
            errors.append("the capital does not turn the order of the dictionary round")
        if case == "ordine" and not (a.islower() and b.islower() and a[0] != b[0] or not (a.startswith(b) or b.startswith(a))):
            errors.append("two small-letter words that are not one the beginning of the other")
        other = max(a, b)
        both = {f"{w}\n{e}" for w in (a, b) for e in ("uguali", "diverse")}
        if {o["values"][0] for o in options} != both:
            errors.append(f"the options are not the four pairs of answers (the other word is {other})")
    elif level == 5:
        words, letter = params["words"], params["letter"]
        if len(words) != 2 or not all(plain(w) for w in words) or words[0] == words[1]:
            errors.append("the function is tried on two different words")
        want = [FUNCTIONS[case](w, letter) for w in words]
        if expected != [want]:
            errors.append(f"the function of {case} gives {want}, and the sample says {expected}")
        if case in ("conta", "senza") and not all(letter in w for w in words):
            errors.append("a word does not have the letter")
        if not all("code" in o for o in options):
            errors.append("level 5 offers programs")
        for i, o in enumerate(options):
            if "code" in o and (not o["code"]["python"].startswith(f"def {case}(") or "print" in o["code"]["python"] or "main" in o["code"]["cpp"]):
                errors.append(f"option {i} does not show the function alone")
        for language in ("python", "cpp"):
            if not has("funzione", program[language], language):
                errors.append(f"the program has no function of its own in {language}")
    elif level == 6:
        answer = sample["answer"]
        letter = params["letter"]
        if answer["kind"] != "program" or answer.get("needs") != ["ciclo"]:
            errors.append("level 6 asks for a program with a loop")
        elif len(params["tests"]) != 3 or not all(len(t) == 1 and plain(t[0]) for t in params["tests"]):
            errors.append("level 6 is tried on three words")
        else:
            want = [[FUNCTIONS[case](t[0], letter)] for t in params["tests"]]
            if want != expected:
                errors.append(f"on the words typed the answer is {want}, and the sample says {expected}")
            if len({t[0] for t in params["tests"]}) != 3:
                errors.append("the three words are not different")
            if case != "rovescia" and not all(letter in t[0] for t in params["tests"]):
                errors.append("a word typed does not have the letter")
            problem = sample["problem"]
            if "La lettura c'è già" not in problem or "Usa un ciclo" not in problem or "input()" not in answer["start"]["python"] or "cin >>" not in answer["start"]["cpp"]:
                errors.append("the reading is given and a loop is asked for, and the exercise says so")
            if case != "rovescia" and f"lettera {letter}" not in problem:
                errors.append("the exercise does not name the letter")
            if f"con {params['tests'][0][0]} scrive {expected[0][0]}" not in problem:
                errors.append("the example of the exercise is not the first test")
        if not all("code" in o for o in options):
            errors.append("the multiple choice of level 6 offers programs")
        for i, o in enumerate(options):
            if "code" in o and ("input" in o["code"]["python"] or "cin" in o["code"]["cpp"]):
                errors.append(f"option {i} shows the reading too")
    return errors, case
