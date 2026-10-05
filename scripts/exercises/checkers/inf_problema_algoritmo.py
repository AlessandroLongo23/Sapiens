"""Checker for inf-problema-algoritmo (specs/exercises/inf-problema-algoritmo.md).

Written from the spec and the lesson. What an algorithm must write comes from the table of the families in
checkers/_inf_alg.py; the charts are run by Python:
- level 1: the table of the problems below says which data are inputs, which is the output, which value is worked
  out on the way and which is the constraint; the answer is rebuilt from it;
- level 2: the right option is what the family writes on the inputs of the question (no chart is shown);
- level 3: the chart shown has a mistake; of the four inputs offered, only the right one makes it write something
  else than the family must;
- levels 4 and 5: of the four charts only the right one writes what the family must, on every test;
- level 6: the chart of the solution passes its tests; the multiple choice as in level 4.
"""
import re

from checkers._inf_alg import base, expected, right_of, structure_of
from checkers._inf_programmi import choice_of, run_chart

L2 = ["gita", "quota", "spedizione", "sconto", "tetto", "risparmio"]
L3 = ["soglia", "sconto", "spedizione", "risparmio"]
L4 = ["gita", "quota", "spedizione", "sconto", "tetto"]
L5 = ["risparmio", "somma", "multipli", "addizioni"]
L6 = L4 + ["risparmio"]
CASE_RANGES = {
    1: {"ruolo": (0.26, 0.41), "ingresso": (0.26, 0.41), "uscita": (0.11, 0.23), "vincolo": (0.11, 0.23)},
    2: {k: (0.11, 0.23) for k in L2},
    3: {k: (0.18, 0.32) for k in L3},
    4: {k: (0.14, 0.26) for k in L4},
    5: {k: (0.18, 0.32) for k in L5},
    6: {k: (0.11, 0.23) for k in L6},
}

# ins, out, mid, constraint
PROBLEMS = {
    "gita": (["il costo del pullman", "il prezzo del biglietto", "il numero di studenti"], "la quota a testa", "la parte del pullman che tocca a ognuno", "il numero di studenti deve essere maggiore di zero"),
    "cuffie": (["il prezzo delle cuffie", "la somma messa da parte ogni settimana"], "il numero di settimane", "i risparmi accumulati fino a quel momento", "la somma messa da parte ogni settimana deve essere maggiore di zero"),
    "velocita": (["la distanza percorsa", "il tempo impiegato"], "la velocità media", "il tempo trasformato in ore", "il tempo impiegato deve essere maggiore di zero"),
    "saldo": (["il prezzo pieno", "la percentuale di sconto"], "il prezzo finale", "il risparmio in euro", "la percentuale di sconto deve essere compresa tra 0 e 100"),
    "pizza": (["il conto della pizzeria", "il numero di amici"], "la parte di ognuno", "il conto con la mancia aggiunta", "il numero di amici deve essere maggiore di zero"),
    "palestra": (["il numero di ingressi previsti", "il prezzo di un ingresso", "il prezzo dell'abbonamento"], "la scelta più conveniente", "il costo degli ingressi singoli", "il numero di ingressi previsti non può essere negativo"),
    "benzina": (["i chilometri della sola andata", "i chilometri che l'auto fa con un litro"], "i litri di benzina necessari", "i chilometri di andata e ritorno", "i chilometri che l'auto fa con un litro devono essere maggiori di zero"),
    "media": (["il primo voto", "il secondo voto", "il terzo voto"], "la media", "la somma dei tre voti", "i voti devono essere compresi tra 1 e 10"),
    "vernice": (["la base della parete", "l'altezza della parete", "i metri quadrati che copre un barattolo"], "il numero di barattoli", "l'area della parete", "i metri quadrati che copre un barattolo devono essere maggiori di zero"),
    "ricetta": (["la farina della ricetta", "le persone previste dalla ricetta", "le persone a tavola"], "la farina da usare", "la farina per una persona sola", "le persone previste dalla ricetta devono essere più di zero"),
    "fotocopie": (["le pagine del fascicolo", "il numero di copie", "il prezzo di una pagina"], "la spesa totale", "il numero totale di pagine da stampare", "il numero di copie non può essere negativo"),
    "treno": (["l'ora di partenza del treno", "i minuti che servono per arrivare in stazione"], "l'ora in cui uscire di casa", "i minuti totali di anticipo", "i minuti che servono per arrivare in stazione non possono essere negativi"),
}
# Words of the text of each problem, to tie the id to what the student reads.
WORDS = {"gita": "gita", "cuffie": "cuffie", "velocita": "bicicletta", "saldo": "saldi", "pizza": "pizzeria", "palestra": "palestra", "benzina": "benzina",
         "media": "tre voti", "vernice": "vernice", "ricetta": "ricetta", "fotocopie": "fotocopi", "treno": "treno"}
ROLES = {"ingresso": "Tra i dati di ingresso", "uscita": "Tra i dati di uscita", "intermedio": "Tra i valori intermedi", "vincolo": "Tra i vincoli"}


def cap(s):
    return s[0].upper() + s[1:]


def said(xs):
    return xs[0] if len(xs) == 1 else ", ".join(xs[:-1]) + " e " + xs[-1]


def level1(sample, errors):
    params = sample["params"]
    ins, out, mid, con = PROBLEMS[params["problem"]]
    if WORDS[params["problem"]] not in sample["problem"]:
        errors.append("the text is not the one of the problem")
    choice = choice_of(sample)
    right = right_of(sample)
    texts = [o["latex"] for o in choice["options"]]
    case = params["case"]
    if case == "ruolo":
        piece = re.search(r"«(.+)»", sample["problem"]).group(1)
        role = "ingresso" if piece in ins else "uscita" if piece == out else "intermedio" if piece == mid else "vincolo" if piece == con else None
        if role is None or right["latex"] != ROLES[role] or right["values"][0] != role:
            errors.append(f"«{piece}» goes {role}")
        if sorted(texts) != sorted(ROLES.values()):
            errors.append("the options are not the four places of the analysis")
    elif case == "ingresso":
        if "dati di ingresso" not in sample["problem"] or right["latex"] != cap(said(ins)):
            errors.append("the inputs are " + said(ins))
        for i, t in enumerate(texts):
            if i != choice["correct"] and all(x in t.lower() or x in t for x in ins) and out not in t and mid not in t:
                errors.append("a wrong option lists the inputs and nothing else")
    elif case == "uscita":
        if "dato di uscita" not in sample["problem"] or right["latex"] != cap(out):
            errors.append("the output is " + out)
    elif case == "vincolo":
        if "vincolo" not in sample["problem"] or right["latex"] != cap(con):
            errors.append("the constraint is " + con)
    else:
        errors.append("unknown case")


def check(sample):
    level = sample["level"]
    params = sample["params"]
    errors = base(sample, reference=level != 3)
    if level == 1:
        level1(sample, errors)
        return errors, params["case"]
    family, k = params["family"], params["k"]
    if family not in {2: L2, 3: L3, 4: L4, 5: L5, 6: L6}[level]:
        errors.append(f"the family {family} is not of this level")
    choice = choice_of(sample)
    if level == 2:
        inputs = params["inputs"]
        if "chart" in sample:
            errors.append("level 2 shows no chart")
        if right_of(sample)["values"][0] != "\n".join(expected(family, k, inputs)):
            errors.append(f"on {inputs} the expected result is {expected(family, k, inputs)}")
        if any(o["values"][0] == "" for o in choice["options"]):
            errors.append("an expected result that is nothing")
        for x in inputs:
            if not re.search(rf"(?<!\d){x}(?!\d)", sample["problem"].split("caso di prova")[1]):
                errors.append(f"the question does not say the input {x}")
    elif level == 3:
        if "chart" not in sample:
            errors.append("the chart is not shown")
        for i, o in enumerate(choice["options"]):
            x = [int(o["values"][0])]
            if x not in params["tests"]:
                errors.append("an option is not among the tests")
            shows = run_chart(sample["chart"], x) != expected(family, k, x)
            if shows != (i == choice["correct"]):
                errors.append(f"with {x[0]} the mistake {'does not show' if i == choice['correct'] else 'shows too'}")
    else:
        if not all("chart" in o for o in choice["options"]):
            errors.append("the options are not charts")
        if (sample["answer"]["kind"] == "chart") != (level == 6):
            errors.append("only level 6 asks for a chart")
        if (structure_of(params["source"]) == "iterazione") != (level == 5 or (level == 6 and family == "risparmio")):
            errors.append("a loop only at level 5 and in the savings of level 6")
    return errors, params["case"]
