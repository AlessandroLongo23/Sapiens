"""Checker for inf-top-down (specs/exercises/inf-top-down.md), the exercises of lesson 69 on top-down design.

Written from the spec. The programs are run by Python (checkers/_inf_codice.py), and with INF_CPP=1 by the C++
compiler too. What is checked here, worked out again from the data in `params`:
- level 1: the right piece against a table of the problems kept here (a piece of another problem, two pieces of the
  problem joined by "e", the main program with its two functions still empty);
- level 2: what the function receives and gives back, from a table kept here, and the row of the call;
- level 3: what the program writes while a function gives back a fixed value;
- level 4: what two functions, one calling the other, write on the two pairs;
- level 5: the rule in three bands, on the values around its two boundaries;
- level 6: the function asked for, on every run, and the answer must have a function of its own.
"""
import re

from checkers._inf_codice import choice_of, common, has

CASE_RANGES = {
    1: {"estraneo": (0.25, 0.42), "due-cose": (0.25, 0.42), "ordine": (0.25, 0.42)},
    2: {"riceve": (0.40, 0.60), "chiamata": (0.40, 0.60)},
    3: {"somma": (0.25, 0.42), "conta": (0.25, 0.42), "riga": (0.25, 0.42)},
    4: {"cinema": (0.18, 0.32), "palestra": (0.18, 0.32), "spedizione": (0.18, 0.32), "sosta": (0.18, 0.32)},
    5: {"cinema": (0.14, 0.26), "palestra": (0.14, 0.26), "biblioteca": (0.14, 0.26), "spedizione": (0.14, 0.26), "sosta": (0.14, 0.26)},
    6: {"fasce": (0.25, 0.42), "migliore": (0.25, 0.42), "sconto": (0.25, 0.42)},
}

# the subproblems of each problem and the two functions its main program calls
PROBLEMS = {
    "cinema": (["leggere un'età valida", "decidere il prezzo del biglietto dall'età", "sommare i prezzi dei biglietti", "scrivere il totale del gruppo"], ("leggi_eta", "prezzo")),
    "gara": (["leggere un tempo valido", "trovare il migliore di due tempi", "decidere se un tempo vale la qualificazione", "scrivere la riga di un atleta"], ("migliore", "qualificato")),
    "gita": (["calcolare il costo del pullman", "calcolare il costo dell'albergo", "dividere la spesa tra gli studenti", "scrivere il riepilogo delle spese"], ("costo_pullman", "quota")),
    "torneo": (["leggere i risultati di una squadra", "calcolare i punti di una squadra", "scrivere la riga della classifica", "confrontare i punti con il massimo trovato finora"], ("punti", "stampa_riga")),
    "pizzeria": (["leggere il prezzo di un'ordinazione", "aggiungere il coperto per ogni persona", "dividere il conto tra le persone", "scrivere lo scontrino"], ("coperto", "quota")),
    "assenze": (["leggere le ore di assenza di un giorno", "sommare le assenze della settimana", "decidere se il limite è superato", "scrivere l'avviso per uno studente"], ("assenze_settimana", "oltre_limite")),
    "biblioteca": (["leggere i giorni di ritardo di un libro", "calcolare la multa di un libro", "scrivere la ricevuta di un libro", "sommare le multe della giornata"], ("multa", "stampa_ricevuta")),
    "palestra": (["leggere i dati di un iscritto", "decidere la tariffa mensile dall'età", "applicare lo sconto per gli abbonamenti lunghi", "scrivere la quota di un iscritto"], ("tariffa", "sconto")),
}

# what each function receives, what it gives back, and how many arguments it takes
SIGNATURES = {
    "prezzo": ("l'età di una persona", "il prezzo del biglietto", 1),
    "multa": ("i giorni di ritardo", "la multa", 1),
    "migliore": ("i due tempi", "il tempo migliore", 2),
    "punti": ("le partite vinte e i pareggi", "i punti della squadra", 2),
    "quota": ("la spesa e il numero di persone", "la quota di ciascuno", 2),
    "qualificato": ("il tempo di un atleta", "vero o falso", 1),
    "tariffa": ("l'età dell'iscritto", "la tariffa mensile", 1),
    "coperto": ("il numero di persone", "il coperto del tavolo", 1),
    "sconto": ("il totale della spesa", "lo sconto", 1),
    "oltre_limite": ("le ore di assenza", "vero o falso", 1),
    "costo_pullman": ("il numero di studenti", "il costo del pullman", 1),
    "esito": ("i punti ottenuti", "l'esito della prova", 1),
}


def labels(choice):
    return [o.get("listing", o.get("latex", "")).strip() for o in choice["options"]]


def check_pieces(sample, errors):
    params = sample["params"]
    choice = choice_of(sample)
    texts = labels(choice)
    right = texts[choice["correct"]]
    wrong = [t for i, t in enumerate(texts) if i != choice["correct"]]
    if params["problem"] not in PROBLEMS:
        errors.append(f"an unknown problem: {params['problem']}")
        return
    subs, functions = PROBLEMS[params["problem"]]
    if any(" e " in s for s in subs):
        errors.append("a subproblem that does one thing has an 'e' in it")
    case = params["case"]
    if case == "estraneo":
        if right in subs:
            errors.append("the piece given as foreign is a subproblem of the problem")
        if not any(right in other for name, (other, _f) in PROBLEMS.items() if name != params["problem"]):
            errors.append("the foreign piece is of no other problem")
        if not all(w in subs for w in wrong):
            errors.append("a wrong option is not a subproblem of the problem")
    elif case == "due-cose":
        parts = right.split(" e ")
        if len(parts) != 2 or not all(p in subs for p in parts) or parts[0] == parts[1]:
            errors.append(f"the right piece is not two subproblems of the problem joined: {right}")
        if not all(w in subs for w in wrong):
            errors.append("a wrong option is not a single subproblem of the problem")
    elif case == "ordine":
        f, g = functions
        if right != f"dal programma principale, con {f} e {g} ancora vuote":
            errors.append(f"the right order is not the main program first, with empty functions: {right}")
        if any(w.startswith("dal programma principale, con") for w in wrong):
            errors.append("a wrong option starts from the main program with empty functions")
        if f not in sample["problem"] or g not in sample["problem"]:
            errors.append("the question does not name the two functions")
    else:
        errors.append(f"an unknown case: {case}")
    if any("code" in o for o in choice["options"]) or "program" in params:
        errors.append("level 1 has no program")


def check_signature(sample, errors):
    params = sample["params"]
    choice = choice_of(sample)
    texts = labels(choice)
    right = texts[choice["correct"]]
    name = params["function"]
    if name not in SIGNATURES:
        errors.append(f"an unknown function: {name}")
        return
    receives, gives, arity = SIGNATURES[name]
    if name not in sample["problem"]:
        errors.append("the question does not name the function")
    if params["case"] == "riceve":
        good = [t == f"riceve {receives} e restituisce {gives}" for t in texts]
    elif params["case"] == "chiamata":
        args, result = params["args"], params["result"]
        if len(args) != arity or result in args:
            errors.append("the arguments of the call are not those of the function")
        call = re.compile(r"(\w+) = (\w+)\(([\w, ]*)\)")
        good = []
        for t in texts:
            m = call.fullmatch(t)
            good.append(bool(m) and m.group(1) == result and m.group(2) == name and [a.strip() for a in m.group(3).split(",")] == args)
        if not all("listing" in o for o in choice["options"]):
            errors.append("the calls are rows of code")
        if sample.get("solutionListing", "").strip() != right:
            errors.append("the row of the solution is not the right option")
    else:
        errors.append(f"an unknown case: {params['case']}")
        return
    if good != [i == choice["correct"] for i in range(len(texts))]:
        errors.append(f"the right option is not the only right one: {good}")
    if "program" in params:
        errors.append("level 2 has no program")


def check_empty(sample, errors):
    params = sample["params"]
    case = params["case"]
    if case == "somma":
        rows = [str(3 * params["fixed"])]
        if len(params["args"]) != 3:
            errors.append("the empty function is called three times")
    elif case == "conta":
        rows = [str(params["n"] if params["fixed"] else 0)]
    elif case == "riga":
        rows = [f"{k} {params['word']}" for k in range(1, params["n"] + 1)]
    else:
        errors.append(f"an unknown case: {case}")
        return
    if params["expected"] != [rows]:
        errors.append(f"with its empty function the program writes {rows}, and the sample says {params['expected']}")
    if "ancora vuota" not in sample["problem"]:
        errors.append("the question does not say that the function is still empty")


def check_pair(sample, errors):
    params = sample["params"]
    cut, low, high = params["cut"], params["low"], params["high"]
    inner = lambda x: low if x < cut else high
    rows = [str(inner(a) + inner(b)) for a, b in params["calls"]]
    if params["expected"] != [rows]:
        errors.append(f"the two functions write {rows}, and the sample says {params['expected']}")
    if not any(cut in pair for pair in params["calls"]):
        errors.append("no value is exactly on the boundary")
    if low == high:
        errors.append("the two branches give back the same value")


def band(strict, a, b, values, x):
    p, q, r = values
    if x < a or (not strict and x == a):
        return p
    if x > b:
        return q
    return r


def check_bands(sample, errors):
    params = sample["params"]
    a, b, values = params["a"], params["b"], params["values"]
    if len(set(values)) != 3 or not a + 1 < b:
        errors.append("a rule in three bands has three different values and two boundaries apart")
    rows = [str(band(params["strict"], a, b, values, x)) for x in params["tried"]]
    if params["expected"] != [rows]:
        errors.append(f"the rule gives {rows} on {params['tried']}, and the sample says {params['expected']}")
    if not {a - 1, a, a + 1, b, b + 1} <= set(params["tried"]):
        errors.append("the function is not tried around its two boundaries")
    numbers = [int(n) for n in re.findall(r"\d+", sample["problem"])]
    if numbers != [a, values[0], b, values[1], values[2]]:
        errors.append(f"the rule in words does not have the numbers of the function: {numbers}")
    choice = choice_of(sample)
    for i, o in enumerate(choice["options"]):
        if "code" not in o:
            errors.append(f"option {i} is not a program")
        elif "print" in o["code"]["python"] or "main" in o["code"]["cpp"]:
            errors.append(f"option {i} does not show the function alone")


def check_missing(sample, errors):
    params = sample["params"]
    answer = sample["answer"]
    case = params["case"]
    if answer["kind"] != "program" or answer.get("needs") != ["funzione"]:
        errors.append("level 6 asks for a program with a function of its own")
        return
    tests = [[int(x) for x in t] for t in params["tests"]]
    if case == "fasce":
        rows = [[str(band(params["strict"], params["a"], params["b"], params["values"], x))] for (x,) in tests]
    elif case == "migliore":
        rows = [[str(min(a, b) if params["lower"] else max(a, b))] for a, b in tests]
    elif case == "sconto":
        rows = [[str(p * n - (params["off"] if n >= params["least"] else 0))] for p, n in tests]
        if not {params["least"] - 1, params["least"]} <= {n for _p, n in tests}:
            errors.append("the discount is not tried on both sides of its boundary")
    else:
        errors.append(f"an unknown case: {case}")
        return
    if params["expected"] != rows:
        errors.append(f"the function asked for gives {rows} on {tests}, and the sample says {params['expected']}")
    if len({r[0] for r in rows}) < 2:
        errors.append("every run writes the same")
    if "La lettura c'è già" not in sample["problem"] or "input()" not in answer["start"]["python"] or "cin >>" not in answer["start"]["cpp"]:
        errors.append("the reading is given, and the exercise says so")
    for language in ("python", "cpp"):
        if has("funzione", answer["start"][language], language):
            errors.append(f"the {language} to start from already has a function")
    choice = choice_of(sample)
    if not all("code" in o for o in choice["options"]):
        errors.append("the multiple choice of level 6 offers programs")


def check(sample):
    errors = common(sample)
    params = sample["params"]
    level = sample["level"]
    case = params.get("case")
    choice = choice_of(sample)
    if not choice:
        return errors, case
    if level >= 3 and "program" not in params:
        return errors + ["a level with programs has no reference program"], case
    if level == 1:
        check_pieces(sample, errors)
    elif level == 2:
        check_signature(sample, errors)
    elif level in (3, 4):
        if "code" not in sample or params.get("ask") != "output" or sample.get("code") != params["program"]:
            errors.append("the level shows the whole program and asks what it writes")
        if params["tests"] != [[]]:
            errors.append("a program that is read reads nothing")
        for language in ("python", "cpp"):
            if not has("funzione", params["program"][language], language):
                errors.append(f"the program in {language} has no function")
        (check_empty if level == 3 else check_pair)(sample, errors)
    elif level == 5:
        check_bands(sample, errors)
    elif level == 6:
        check_missing(sample, errors)
    return errors, case
