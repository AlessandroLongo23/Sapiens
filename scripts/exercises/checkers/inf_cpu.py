"""Checker for inf-cpu (specs/exercises/inf-cpu.md).

Written from the spec and the lesson. The machine of the lesson (an accumulator, a program counter, an instruction
register; CARICA, SOMMA, SOTTRAI, SALVA, FERMA) is implemented again here, and every program is read back from the
table in the problem and run:
- level 1: the question is recognised and gives the part of the CPU;
- level 2: the program is run to FERMA and the accumulator is the answer;
- level 3: the program counter after k cycles or while an instruction runs, or the instruction register after k cycles;
- level 4: the program is run and the asked cell is read; the program must write a cell and read it again;
- levels 5 and 6: the numbers are read from the text and the count is done with whole numbers.
"""
import re

from checkers._inf_architettura import NUM, check_number, check_text_choice, common, parse_int, prose_and_extra

PARTS = ["Unità di controllo", "ALU", "Contatore di programma", "Registro istruzioni", "Accumulatore"]

CASE_RANGES = {
    1: {p: (0.14, 0.26) for p in PARTS},
    4: {k: (0.10, 0.36) for k in ["raddoppia", "scambia", "copia", "differenza"]},
    3: {k: (0.26, 0.41) for k in ["pc-dopo", "pc-durante", "ir"]},
    5: {k: (0.26, 0.41) for k in ["kHz", "MHz", "GHz"]},
    6: {"tempo": (0.40, 0.60), "core": (0.40, 0.60)},
}

OPS = ("CARICA", "SOMMA", "SOTTRAI", "SALVA")
INSTR = r"(CARICA|SOMMA|SOTTRAI|SALVA) (\d+)"


def read_table(extra, errs):
    """The memory: {address: ("FERMA",) | (op, address) | number}, the program start and its length."""
    if len(extra) != 1:
        errs.append("expected one table")
        return None
    m = re.fullmatch(r"\\begin\{array\}\{c\|l\} \\text\{cella\} & \\text\{contenuto\} \\\\ \\hline (.+) \\end\{array\}", extra[0])
    if not m:
        errs.append("table not recognised")
        return None
    mem = {}
    order = []
    for row in m.group(1).split(" \\\\ "):
        row = row.replace("\\hline ", "")
        a, _, c = row.partition(" & ")
        a = int(a)
        t = re.fullmatch(r"\\text\{(.+)\}", c)
        if t:
            if t.group(1) == "FERMA":
                mem[a] = ("FERMA",)
            else:
                i = re.fullmatch(INSTR, t.group(1))
                if not i:
                    errs.append(f"unknown instruction {t.group(1)!r}")
                    return None
                mem[a] = (i.group(1), int(i.group(2)))
        else:
            mem[a] = parse_int(c)
        order.append(a)
    if order != sorted(order) or len(set(order)) != len(order):
        errs.append("cells not in the order of their addresses")
    prog = sorted(a for a, v in mem.items() if isinstance(v, tuple))
    if not prog or prog != list(range(prog[0], prog[0] + len(prog))) or mem[prog[-1]] != ("FERMA",):
        errs.append("the program is not a run of cells ending with FERMA")
        return None
    if sum(1 for a in prog if mem[a] == ("FERMA",)) != 1 or mem[prog[0]][0] != "CARICA":
        errs.append("the program must start with CARICA and have one FERMA")
    for a in prog[:-1]:
        target = mem[a][1]
        if target not in mem or isinstance(mem[target], tuple):
            errs.append(f"instruction at {a} works on cell {target}, which is not a data cell")
            return None
    return mem, prog[0], len(prog)


def run(mem, start, cycles=None):
    """Runs from `start`; returns (acc, pc, ir, memory, accumulator after each cycle). Negative values are an error."""
    mem = dict(mem)
    acc, pc, ir, trace = 0, start, None, []
    while cycles is None or len(trace) < cycles:
        ir = mem[pc]
        pc += 1
        if ir[0] == "CARICA":
            acc = mem[ir[1]]
        elif ir[0] == "SOMMA":
            acc += mem[ir[1]]
        elif ir[0] == "SOTTRAI":
            acc -= mem[ir[1]]
        elif ir[0] == "SALVA":
            mem[ir[1]] = acc
        if acc < 0:
            raise ValueError("negative accumulator")
        trace.append(acc)
        if ir[0] == "FERMA":
            break
    return acc, pc, ir, mem, trace


def show(i):
    return "FERMA" if i[0] == "FERMA" else f"{i[0]} {i[1]}"


def level1(sample, prose, errs):
    patterns = [
        (rf"La CPU esegue l'istruzione (SOMMA|SOTTRAI) \d+\. Quale parte della CPU calcola la (somma|differenza)\?", "ALU"),
        (rf"Quale parte della CPU contiene l'istruzione {INSTR} mentre la CPU la esegue\?", "Registro istruzioni"),
        (rf"La CPU ha appena prelevato dalla memoria l'istruzione {INSTR}\. In quale parte della CPU è stata copiata\?", "Registro istruzioni"),
        (rf"L'istruzione {INSTR} si trova nella cella \$(\d+)\$\. Quale parte della CPU contiene il numero \$(\d+)\$ mentre la CPU la esegue\?", "Contatore di programma"),
        (rf"La CPU esegue l'istruzione {INSTR}\. Quale parte della CPU contiene l'indirizzo dell'istruzione da prelevare subito dopo\?", "Contatore di programma"),
        (r"La CPU ha appena eseguito l'istruzione CARICA (\d+)\. Quale parte della CPU contiene ora una copia del numero della cella \$(\d+)\$\?", "Accumulatore"),
        (r"La CPU esegue l'istruzione SALVA (\d+)\. Da quale parte della CPU viene il numero che finisce nella cella \$(\d+)\$\?", "Accumulatore"),
        (r"La CPU ha appena eseguito l'istruzione (SOMMA|SOTTRAI) \d+\. Quale parte della CPU contiene ora il risultato del calcolo\?", "Accumulatore"),
        (rf"L'istruzione {INSTR} è nel registro istruzioni\. Quale parte della CPU la esamina per riconoscere l'operazione e l'indirizzo\?", "Unità di controllo"),
        (rf"La CPU esegue l'istruzione {INSTR}\. Quale parte della CPU manda i comandi alle altre parti\?", "Unità di controllo"),
        (rf"La CPU ha finito di eseguire l'istruzione {INSTR}\. Quale parte della CPU fa partire il prelievo dell'istruzione successiva\?", "Unità di controllo"),
    ]
    for k, (rx, part) in enumerate(patterns):
        m = re.fullmatch(rx, prose)
        if not m:
            continue
        g = m.groups()
        if k == 0 and (g[0] == "SOMMA") != (g[1] == "somma"):
            errs.append("operation and its name do not agree")
        if k == 3 and int(g[3]) != int(g[2]) + 1:
            errs.append("the program counter must hold the address after the instruction's")
        if k in (5, 6) and g[0] != g[1]:
            errs.append("two different cells in the question")
        check_text_choice(sample, part, set(PARTS), errs)
        return part
    errs.append(f"level 1 text not recognised: {prose!r}")
    return None


INTRO = r"La memoria contiene questo programma, che parte dalla cella \$(\d+)\$, e i suoi dati\. "


def level2(sample, prose, extra, errs):
    m = re.fullmatch(INTRO + r"Quale numero c'è nell'accumulatore quando il programma si ferma\?", prose)
    table = read_table(extra, errs)
    if not m or table is None:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    mem, start, n = table
    if start != 0 or int(m.group(1)) != 0:
        errs.append("the program must start at cell 0")
    ops = [mem[start + k][0] for k in range(n)]
    shape = "-".join(o.lower() for o in ops[1:-2])
    if ops[0] != "CARICA" or ops[-2:] != ["SALVA", "FERMA"] or shape not in ("somma", "sottrai", "somma-somma", "somma-sottrai", "sottrai-somma"):
        errs.append(f"program shape {ops} not in the spec")
        return None
    read = [mem[start + k][1] for k in range(n - 2)]
    if len(set(read)) != len(read) or mem[start + n - 2][1] in read:
        errs.append("each data cell must be used once, and the result saved in another cell")
    values = [mem[a] for a in read]
    if any(not 2 <= v <= 60 for v in values) or mem[mem[start + n - 2][1]] != 0:
        errs.append("data out of 2..60, or result cell not 0")
    try:
        acc, _, _, _, trace = run(mem, start)
    except ValueError as e:
        errs.append(str(e))
        return shape
    # the mistakes of the spec: SALVA empties the accumulator, the last calculation forgotten, only the first
    # number, everything added
    check_number(sample, acc, errs, mistakes=[0, trace[len(read) - 2], values[0], sum(values)])
    return shape


def level3(sample, prose, extra, errs):
    table = read_table(extra, errs)
    if table is None:
        return None
    mem, start, n = table
    if n != 5 or start not in (0, 4, 8, 20, 100):
        errs.append(f"program of {n} instructions from cell {start}")
    m = re.fullmatch(INTRO + r"(.+)", prose)
    if not m or int(m.group(1)) != start:
        errs.append(f"level 3 text not recognised, or wrong start: {prose!r}")
        return None
    q = m.group(2)
    after = re.fullmatch(r"La CPU ha completato (il primo ciclo|i primi \$(\d)\$ cicli) di esecuzione\. Quale (numero c'è nel contatore di programma|istruzione c'è nel registro istruzioni)\?", q)
    during = re.fullmatch(r"La CPU sta eseguendo l'istruzione della cella \$(\d+)\$\. Quale numero c'è nel contatore di programma\?", q)
    if after:
        k = int(after.group(2)) if after.group(2) else 1
        if not 1 <= k <= n - 1:
            errs.append(f"{k} cycles out of range")
            return None
        _, pc, ir, _, _ = run(mem, start, k)
        if "contatore" in after.group(3):
            check_number(sample, pc, errs, mistakes=[pc - 1, pc + 1, k])
            return "pc-dopo"
        allowed = {show(mem[start + j]) for j in range(n)}
        check_text_choice(sample, show(ir), allowed, errs)
        return "ir"
    if during:
        p = int(during.group(1))
        if not start <= p <= start + n - 2:
            errs.append(f"cell {p} is not an instruction before FERMA")
            return None
        check_number(sample, p + 1, errs, mistakes=[p])
        if "distractors" in sample["params"] and str(p) not in sample["params"]["distractors"]:
            errs.append("the instruction's own address must be a distractor")
        return "pc-durante"
    errs.append(f"level 3 question not recognised: {q!r}")
    return None


def level4(sample, prose, extra, errs):
    m = re.fullmatch(INTRO + r"Quale numero c'è nella cella \$(\d+)\$ quando il programma si ferma\?", prose)
    table = read_table(extra, errs)
    if not m or table is None:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    mem, start, n = table
    cell = int(m.group(2))
    if start != 0 or int(m.group(1)) != 0:
        errs.append("the program must start at cell 0")
    written, reread = set(), False
    for k in range(n - 1):
        op, a = mem[start + k]
        if op == "SALVA":
            written.add(a)
        elif a in written:
            reread = True
    if not reread:
        errs.append("no cell is read after being written")
    if cell not in written:
        errs.append(f"cell {cell} is never written by the program")
    try:
        _, _, _, end, _ = run(mem, start)
    except ValueError as e:
        errs.append(str(e))
        return None
    check_number(sample, end[cell], errs)
    # the four shapes of the spec, on the data cells X, Y and the result cell Z
    data = sorted(a for a, v in mem.items() if not isinstance(v, tuple))
    if len(data) != 3 or mem[data[2]] != 0 or not all(2 <= mem[a] <= 40 for a in data[:2]):
        errs.append("level 4 needs two data cells from 2 to 40 and a result cell with 0")
        return None
    names = {data[0]: "X", data[1]: "Y", data[2]: "Z"}
    shape = " ".join(f"{mem[start + k][0]} {names[mem[start + k][1]]}" for k in range(n - 1))
    shapes = {
        "CARICA X SOMMA Y SALVA X SOMMA X SALVA Z": "raddoppia",
        "CARICA X SOMMA Y SALVA Y SOMMA Y SOTTRAI X SALVA Z": "scambia",
        "CARICA X SALVA Y SOMMA Y SALVA Z": "copia",
        "CARICA X SOTTRAI Y SALVA X CARICA Y SOMMA X SALVA Z": "differenza",
    }
    if shape not in shapes:
        errs.append(f"program shape not in the spec: {shape}")
        return None
    return shapes[shape]


HZ = {"kHz": 10**3, "MHz": 10**6, "GHz": 10**9}


def level5(sample, prose, errs):
    m = re.fullmatch(
        rf"Una CPU ha un clock di \$(\d+)\\,\\text\{{(kHz|MHz|GHz)\}}\$ e impiega \$(\d+)\$ impulsi di clock per ogni istruzione\. Quante istruzioni esegue in un secondo\? Ricorda che \$1\\,\\text\{{(kHz|MHz|GHz)\}} = ({NUM})\\,\\text\{{Hz\}}\$\.",
        prose,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    v, unit, c = int(m.group(1)), m.group(2), int(m.group(3))
    if m.group(4) != unit or parse_int(m.group(5)) != HZ[unit]:
        errs.append("the factor in the text is not the unit's")
    if c not in (2, 4, 5, 8, 10):
        errs.append(f"{c} pulses per instruction")
    f = v * HZ[unit]
    if f % c:
        errs.append("instructions per second not whole")
        return unit
    check_number(sample, f // c, errs, mistakes=[f, f // c * 10] + ([f // c // 1000] if (f // c) % 1000 == 0 else []))
    return unit


def level6(sample, prose, errs):
    m = re.fullmatch(rf"Una CPU esegue \$({NUM})\$ istruzioni al secondo\. Quanti secondi impiega per eseguire \$({NUM})\$ istruzioni\?", prose)
    if m:
        rate, total = parse_int(m.group(1)), parse_int(m.group(2))
        if total % rate:
            errs.append("time not a whole number of seconds")
            return "tempo"
        s = total // rate
        if not 2 <= s <= 60:
            errs.append(f"{s} seconds out of range")
        check_number(sample, s, errs)
        return "tempo"
    m = re.fullmatch(rf"Una CPU ha \$(\d)\$ core, e ogni core esegue \$({NUM})\$ istruzioni al secondo\. Quante istruzioni può eseguire al massimo la CPU in (un secondo|\$(\d+)\$ secondi)\?", prose)
    if m:
        cores, rate = int(m.group(1)), parse_int(m.group(2))
        s = int(m.group(4)) if m.group(4) else 1
        if cores not in (2, 4, 6, 8):
            errs.append(f"{cores} cores")
        check_number(sample, cores * rate * s, errs, mistakes=[rate * s])
        return "core"
    errs.append(f"level 6 text not recognised: {prose!r}")
    return None


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    lvl = sample["level"]
    if lvl in (1, 5, 6) and extra:
        errs.append("unexpected non-prose lines")
    if lvl == 1:
        kind = level1(sample, prose, errs)
    elif lvl == 2:
        kind = level2(sample, prose, extra, errs)
    elif lvl == 3:
        kind = level3(sample, prose, extra, errs)
    elif lvl == 4:
        kind = level4(sample, prose, extra, errs)
    elif lvl == 5:
        kind = level5(sample, prose, errs)
    elif lvl == 6:
        kind = level6(sample, prose, errs)
    else:
        return [f"unknown level {lvl}"], None
    if kind is not None and sample["params"].get("case") != kind:
        errs.append(f"params.case {sample['params'].get('case')!r} but the problem is {kind!r}")
    return errs, kind
