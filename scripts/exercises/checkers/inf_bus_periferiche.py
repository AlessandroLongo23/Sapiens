"""Checker for inf-bus-periferiche (specs/exercises/inf-bus-periferiche.md).

Written from the spec and the lesson; the answer is rebuilt from the pieces read in the text:
- level 1: the device named in the question is looked up in the table of the spec (input, output, both, not a
  peripheral);
- level 2: the operation (read or write), the address and the content are read; the number asked about is the
  address (address bus, from the CPU), the content (data bus, towards the CPU in a read, from it in a write) or the
  command (control bus);
- levels 3 and 4: powers of two with whole numbers;
- level 5: 2^n bytes written with the largest binary unit, or the lines for a memory given with its unit.
"""
import re

from checkers._inf_architettura import NUM, check_choice, check_number, check_text_choice, common, parse_int, prose_and_extra

KINDS = ["Di ingresso", "Di uscita", "Di ingresso e di uscita", "Non è una periferica"]
IN, OUT, BOTH, NONE = KINDS

CASE_RANGES = {
    1: {k: (0.19, 0.31) for k in KINDS},
    2: {k: (0.19, 0.31) for k in ["dati-in", "dati-out", "indirizzi", "controllo"]},
    3: {k: (0.26, 0.41) for k in ["celle", "ultimo", "aggiunta"]},
    4: {"potenza": (0.32, 0.48), "non-potenza": (0.52, 0.68)},
    5: {"memoria": (0.40, 0.60), "linee": (0.40, 0.60)},
}

DEVICES = {
    "la tastiera": IN,
    "il mouse": IN,
    "il microfono": IN,
    "la webcam": IN,
    "lo scanner": IN,
    "il lettore di codici a barre": IN,
    "il sensore di impronte": IN,
    "la tavoletta grafica": IN,
    "il touchpad": IN,
    "il ricevitore GPS": IN,
    "la fotocamera del telefono": IN,
    "il sensore di temperatura": IN,
    "il monitor": OUT,
    "la stampante": OUT,
    "gli altoparlanti": OUT,
    "le cuffie": OUT,
    "il proiettore": OUT,
    "il motorino della vibrazione": OUT,
    "la stampante 3D": OUT,
    "le spie luminose": OUT,
    "lo schermo tattile": BOTH,
    "la chiavetta USB": BOTH,
    "il disco esterno": BOTH,
    "la scheda di rete": BOTH,
    "le cuffie con microfono": BOTH,
    "la stampante multifunzione": BOTH,
    "la scheda di memoria": BOTH,
    "il visore per la realtà virtuale": BOTH,
    "il processore": NONE,
    "la RAM": NONE,
    "la cache": NONE,
    "il bus dati": NONE,
}


def level1(sample, prose, errs):
    m = re.fullmatch(r"(?:Usi (.+?) per .+|Mentre lavori al computer, (.+?) .+)\. Che tipo di periferica (è|sono) (.+)\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    asked = m.group(4)
    if asked not in DEVICES:
        errs.append(f"unknown device {asked!r}")
        return None
    kind = DEVICES[asked]
    # the device of the first sentence is the one asked about
    if not (prose.startswith(f"Usi {asked} per ") or prose.startswith(f"Mentre lavori al computer, {asked} ")):
        errs.append("the question asks about a device that the first sentence does not name")
    if (kind == NONE) != prose.startswith("Mentre lavori"):
        errs.append("a peripheral must be introduced by its use, the rest by what it does")
    if (asked.split(" ")[0] in ("le", "gli", "i")) != (m.group(3) == "sono"):
        errs.append("verb does not agree with the device")
    check_text_choice(sample, kind, set(KINDS), errs)
    return kind


ROUTES = {"dati-in": "Bus dati, verso la CPU", "dati-out": "Bus dati, dalla CPU", "indirizzi": "Bus indirizzi, dalla CPU", "controllo": "Bus di controllo, dalla CPU"}
INPUTS = ["dalla tastiera il codice del tasto premuto", "dal mouse il numero che misura lo spostamento", "dal microfono il valore di un campione del suono", "dal sensore di temperatura il valore della temperatura"]
OUTPUTS = ["alla stampante il codice di un carattere da stampare", "allo schermo il valore del colore di un pixel", "all'altoparlante il valore di un campione del suono"]


def level2(sample, prose, errs):
    case = None
    num_q = r"Su quale bus viaggia il numero \$(\d+)\$, e in quale verso\?"
    m = re.fullmatch(rf"La CPU (?:legge la cella di indirizzo \$(\d+)\$, che contiene il numero \$(\d+)\$|scrive il numero \$(\d+)\$ nella cella di indirizzo \$(\d+)\$)\. (.+)", prose)
    if m:
        read = m.group(1) is not None
        addr, value = (int(m.group(1)), int(m.group(2))) if read else (int(m.group(4)), int(m.group(3)))
        if addr == value:
            errs.append("address and content are the same number")
        q = m.group(5)
        n = re.fullmatch(num_q, q)
        c = re.fullmatch(r"Su quale bus viaggia il segnale che dice che è una (lettura|scrittura), e in quale verso\?", q)
        if n:
            asked = int(n.group(1))
            if asked == addr:
                case = "indirizzi"
            elif asked == value:
                case = "dati-in" if read else "dati-out"
            else:
                errs.append(f"the number {asked} is neither the address nor the content")
        elif c:
            if (c.group(1) == "lettura") != read:
                errs.append("the command named does not fit the operation")
            case = "controllo"
    else:
        m = re.fullmatch(rf"La CPU legge (.+), che è \$(\d+)\$\. {num_q}", prose)
        if m and m.group(1) in INPUTS and m.group(2) == m.group(3):
            case = "dati-in"
        m = re.fullmatch(rf"La CPU manda (.+), che è \$(\d+)\$\. {num_q}", prose)
        if m and m.group(1) in OUTPUTS and m.group(2) == m.group(3):
            case = "dati-out"
    if case is None:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    check_text_choice(sample, ROUTES[case], set(ROUTES.values()), errs)
    return case


def level3(sample, prose, errs):
    m = re.fullmatch(r"Un bus indirizzi ha \$(\d+)\$ linee\. (Quante celle di memoria può indirizzare al massimo|Qual è l'indirizzo più grande che può trasportare)\?", prose)
    if m:
        n = int(m.group(1))
        if not 2 <= n <= 20:
            errs.append(f"{n} lines out of range")
        if m.group(2).startswith("Quante"):
            check_number(sample, 2**n, errs, mistakes=[2 * n, n * n, 2**n - 1])
            return "celle"
        check_number(sample, 2**n - 1, errs, mistakes=[2**n])
        if str(2**n) not in sample["params"].get("distractors", []):
            errs.append("the number of cells must be a distractor")
        return "ultimo"
    m = re.fullmatch(rf"Un bus indirizzi con \$(\d+)\$ linee può indirizzare \$({NUM})\$ celle\. Quante celle può indirizzare se gli si (aggiunge \$1\$ linea|aggiungono \$2\$ linee)\?", prose)
    if m:
        n, cells = int(m.group(1)), parse_int(m.group(2))
        d = 1 if "aggiunge " in m.group(3) else 2
        if cells != 2**n:
            errs.append(f"{n} lines do not reach {cells} cells")
        check_number(sample, 2 ** (n + d), errs, mistakes=[cells + d, cells + 2**d])
        return "aggiunta"
    errs.append(f"level 3 text not recognised: {prose!r}")
    return None


def level4(sample, prose, errs):
    m = re.fullmatch(rf"Una memoria ha \$({NUM})\$ celle\. Quante linee deve avere, come minimo, il bus indirizzi per indirizzarle tutte\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    cells = parse_int(m.group(1))
    n = (cells - 1).bit_length()  # the least n with 2^n >= cells
    if not (2**n >= cells and (n == 0 or 2 ** (n - 1) < cells)):
        errs.append("internal: wrong number of lines")
    exact = 2**n == cells
    check_number(sample, n, errs, mistakes=[n - 1])
    if str(n - 1) not in sample["params"].get("distractors", []):
        errs.append("one line too few must be a distractor")
    return "potenza" if exact else "non-potenza"


UNITS = {"KiB": 10, "MiB": 20, "GiB": 30}
FACTORS = r"Ricorda che \$2\^\{10\}\\,\\text\{B\} = 1\\,\\text\{KiB\}\$, \$2\^\{20\}\\,\\text\{B\} = 1\\,\\text\{MiB\}\$, \$2\^\{30\}\\,\\text\{B\} = 1\\,\\text\{GiB\}\$\."


def size_bytes(latex):
    m = re.fullmatch(r"(\d+)\\,\\text\{(KiB|MiB|GiB)\}", latex)
    if not m:
        raise ValueError(f"not a size: {latex!r}")
    return int(m.group(1)) * 2 ** UNITS[m.group(2)], f"{m.group(1)} {m.group(2)}"


def level5(sample, prose, errs):
    m = re.fullmatch(rf"Un bus indirizzi ha \$(\d+)\$ linee, e le celle sono da \$1\$ byte\. Quanta memoria può indirizzare al massimo\? {FACTORS}", prose)
    if m:
        n = int(m.group(1))
        if not 10 <= n <= 39:
            errs.append(f"{n} lines out of range")
        ans = sample["answer"]
        if ans.get("kind") != "choice":
            errs.append("answer is not a choice")
            return "memoria"
        for o in ans["options"]:
            try:
                _, label = size_bytes(o["latex"])
                if o["values"] != [label]:
                    errs.append(f"option {o['latex']!r} with values {o['values']}")
            except ValueError as e:
                errs.append(str(e))
        check_choice(ans, lambda o: size_bytes(o["latex"])[0] == 2**n, errs)
        # the right option uses the largest unit: its number is below 1024
        right = ans["options"][ans["correct"]]["latex"]
        if int(re.match(r"\d+", right).group()) >= 1024:
            errs.append("the answer is not written with the largest unit")
        return "memoria"
    m = re.fullmatch(rf"Una memoria da \$(\d+)\\,\\text\{{(KiB|MiB|GiB)\}}\$ ha celle da \$1\$ byte\. Quante linee deve avere il bus indirizzi per indirizzarle tutte\? {FACTORS}", prose)
    if m:
        k, unit = int(m.group(1)), m.group(2)
        cells = k * 2 ** UNITS[unit]
        if k & (k - 1) or not 1 <= k <= 512:
            errs.append(f"{k} is not a power of two up to 512")
        check_number(sample, cells.bit_length() - 1, errs)
        return "linee"
    errs.append(f"level 5 text not recognised: {prose!r}")
    return None


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected non-prose lines")
    lvl = sample["level"]
    fn = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}.get(lvl)
    if fn is None:
        return [f"unknown level {lvl}"], None
    kind = fn(sample, prose, errs)
    if kind is not None and sample["params"].get("case") != kind:
        errs.append(f"params.case {sample['params'].get('case')!r} but the problem is {kind!r}")
    return errs, kind
