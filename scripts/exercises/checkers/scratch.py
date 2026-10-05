"""Checker for scratch (specs/exercises/scratch.md).

Written from the spec and the lesson. Charts are run by Python, and what a family must write comes from
checkers/_inf_alg.py:
- level 1: the tables below say which statements are true and which kind of mistake each situation is;
- level 2: the chart is run here and its lines are counted: the turns, all the lines, the N of "ripeti N volte";
- level 3: the chart shown has a mistake; the right option is what it writes on the inputs of the question, which
  is not what the family must write, and what the family must write is among the wrong options;
- levels 4 and 5: the program made of blocks of the question is run here by a small interpreter of its words
  ("chiedi", "porta", "cambia", "dì", "ripeti … volte", "ripeti fino a quando", "se … allora") and on every test it
  must write what the chart of the solution writes; of the four charts only the right one does.
"""
import re

from checkers._inf_alg import base, check_ids, check_statements, check_written, expected, right_of
from checkers._inf_programmi import choice_of, run_chart

L3 = ["rovescia", "traguardo", "quiz", "multipli", "somma", "risparmio"]
L4 = ["ripeti", "traguardo", "quiz", "sblocco", "risparmio", "somma in giù"]
CASE_RANGES = {
    1: {"vera": (0.20, 0.35), "falsa": (0.20, 0.35), "errore logico": (0.23, 0.37), "errore di sintassi": (0.10, 0.20)},
    3: {"rovescia": (0.08, 0.17), "traguardo": (0.19, 0.31), "quiz": (0.19, 0.31), "multipli": (0.08, 0.17), "somma": (0.08, 0.17), "risparmio": (0.08, 0.17)},
    4: {k: (0.11, 0.23) for k in L4},
    5: {k: (0.11, 0.23) for k in L4},
}

STATEMENTS = {
    "t1": (True, "pezzi già pronti"), "t2": (True, "non possono esserci errori di sintassi"), "t3": (True, "può contenere errori logici"),
    "t4": (True, "dove il blocco può stare"), "t5": (True, "forma di C"), "t6": (True, "della stessa forma"), "t7": (True, "dall'alto in basso"),
    "t8": (True, "più pile"), "t9": (True, "è una sequenza"), "t10": (True, "conta i giri da solo"), "t11": (True, "più scomodi"),
    "t12": (True, "un passo alla volta"),
    "x1": (False, "di sicuro un programma giusto"), "x2": (False, "impediscono gli errori di ragionamento"), "x3": (False, "lettera per lettera"),
    "x4": (False, "nel foro di una condizione"), "x5": (False, "solo nei linguaggi testuali"), "x6": (False, "una sola pila"),
    "x7": (False, "in fondo alla pila"), "x8": (False, "nel ragionamento"), "x9": (False, "quando si resta nel giro"),
    "x10": (False, "quasi tutti con i blocchi"), "x11": (False, "da capo"), "x12": (False, "per forza"),
}
# The kind of mistake of each situation, and words of its text.
SITUATIONS = {
    "l1": ("logico", "gradi al posto di 90"), "l2": ("logico", "dentro la C"), "l3": ("logico", "prima del blocco che lo dice"),
    "l4": ("logico", 'al posto di "ripeti 4 volte"'), "l5": ("logico", "allora"), "l6": ("logico", "invece che al suo interno"),
    "s1": ("sintassi", "parentesi"), "s2": ("sintassi", "al posto del nome"), "s3": ("sintassi", "virgolette"),
    "s4": ("sintassi", "un solo uguale"), "s5": ("sintassi", "non scrivi niente"),
}
OUTCOMES = {"logico": "errore logico", "sintassi": "di sintassi", "niente": "Niente", "incastro": "si corregge da solo"}


def split(text, sep):
    """The pieces of `text` at the separators that are outside parentheses and quotes."""
    out, depth, quoted, start = [], 0, False, 0
    for i, c in enumerate(text):
        if c == '"':
            quoted = not quoted
        elif not quoted and c == "(":
            depth += 1
        elif not quoted and c == ")":
            depth -= 1
        elif not quoted and depth == 0 and c == sep:
            out.append(text[start:i].strip())
            start = i + 1
    out.append(text[start:].strip())
    return [x for x in out if x]


class Stop(Exception):
    pass


def run_blocks(text, inputs, limit=5000):
    """What a program made of blocks, said in the words of the lesson, makes its character say."""
    env, out, pending, steps = {}, [], [int(x) for x in inputs], [0]

    def val(tok):
        tok = tok.replace("−", "-")
        return int(tok) if re.fullmatch(r"-?\d+", tok) else env[tok]

    def cond(a, op, b):
        return val(a) >= val(b) if op == "≥" else val(a) == val(b)

    def run(stmts, sep):
        for s in split(stmts, sep):
            steps[0] += 1
            if steps[0] > limit:
                raise Stop
            if m := re.fullmatch(r"chiedi .* e mettil[oa] in (\w+)", s):
                if not pending:
                    raise Stop
                env[m.group(1)] = pending.pop(0)
            elif m := re.fullmatch(r"porta (\w+) a (\d+)", s):
                env[m.group(1)] = int(m.group(2))
            elif m := re.fullmatch(r"cambia (\w+) di (\S+)", s):
                env[m.group(1)] += val(m.group(2))
            elif m := re.fullmatch(r'dì "([^"]*)"', s):
                out.append(m.group(1))
            elif m := re.fullmatch(r"dì (\w+)", s):
                out.append(str(env[m.group(1)]))
            elif m := re.fullmatch(r"ripeti (\w+) volte \((.*)\)", s):
                for _ in range(val(m.group(1))):
                    run(m.group(2), ",")
            elif m := re.fullmatch(r"ripeti fino a quando (\w+) (≥|=) (\w+) \((.*)\)", s):
                while not cond(m.group(1), m.group(2), m.group(3)):
                    run(m.group(4), ",")
            elif m := re.fullmatch(r"se (\w+) (=) (\w+) allora \((.*)\)", s):
                if cond(m.group(1), m.group(2), m.group(3)):
                    run(m.group(4), ",")
            else:
                raise ValueError(f"a block that is not understood: {s}")

    try:
        run(text, ";")
    except Stop:
        return None
    return out


def level1(sample, errors):
    params = sample["params"]
    if params["case"] in ("vera", "falsa"):
        check_statements(sample, errors, STATEMENTS)
        return
    fault, words = SITUATIONS[params["situation"]]
    if words not in sample["problem"] or params["text"] not in sample["problem"]:
        errors.append("the question does not say the situation")
    if params["case"] != {"logico": "errore logico", "sintassi": "errore di sintassi"}[fault]:
        errors.append(f"the mistake is: {fault}")
    check_ids(sample, errors, {k: (k, v) for k, v in OUTCOMES.items()}, fault)


def level2(sample, errors):
    params = sample["params"]
    if params["family"] != "ripeti" or "chart" not in sample:
        errors.append("level 2 shows a loop with a counter")
    written = run_chart(params["source"], [])
    turns = written.count(written[0])
    if not 3 <= turns <= 9 or turns != params["k"]["n"]:
        errors.append(f"a loop of {turns} turns")
    ask = params["ask"]
    value = {"mossa": turns, "righe": len(written), "blocco": turns}.get(ask)
    said = {"mossa": f'Quante volte scrive "{written[0]}"', "righe": "Quante righe scrive in tutto", "blocco": 'Quale blocco "ripeti"'}.get(ask)
    if said is None or said not in sample["problem"]:
        errors.append("the question does not ask what params says")
    right = right_of(sample)
    if right["values"][0] != str(value) or not re.search(rf"(?<!\d){value}(?!\d)", right["latex"]):
        errors.append(f"the answer is {value}")
    for o in choice_of(sample)["options"]:
        if not re.search(rf"(?<!\d){o['values'][0]}(?!\d)", o["latex"]):
            errors.append("an option says another number than its value")


def level3(sample, errors):
    params = sample["params"]
    if params["family"] not in L3:
        errors.append(f"the family {params['family']} is not of this level")
    check_written(sample, errors)
    inputs = params["inputs"]
    meant = expected(params["family"], params["k"], inputs)
    if run_chart(params["source"], inputs) == meant:
        errors.append("on these inputs the mistake does not show")
    choice = choice_of(sample)
    if "\n".join(meant) not in [o["values"][0] for i, o in enumerate(choice["options"]) if i != choice["correct"]]:
        errors.append("what the chart was meant to write is not among the wrong options")
    if "errore logico" not in sample["problem"]:
        errors.append("the question does not say there is a mistake")


def check(sample):
    level = sample["level"]
    params = sample["params"]
    errors = base(sample, reference=level != 3)
    if level == 1:
        level1(sample, errors)
    elif level == 2:
        level2(sample, errors)
    elif level == 3:
        level3(sample, errors)
    else:
        choice = choice_of(sample)
        if params["family"] not in L4:
            errors.append(f"the family {params['family']} is not of this level")
        if params["blocks"] not in sample["problem"]:
            errors.append("the question does not carry the program made of blocks")
        for t in params["tests"]:
            if run_blocks(params["blocks"], t) != run_chart(params["source"], t):
                errors.append(f"on {t} the blocks and the chart write different things")
        if not all("chart" in o for o in choice["options"]):
            errors.append("the options are not charts")
        if (sample["answer"]["kind"] == "chart") != (level == 5):
            errors.append("only level 5 asks for a chart")
        if level == 5 and not all(params["tests"]):
            errors.append("a chart to build reads something")
    return errors, params["case"]
