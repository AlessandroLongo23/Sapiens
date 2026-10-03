"""Checker for processi-thread (specs/exercises/processi-thread.md).

Written from the spec and the lesson, not from the generator:
- level 1: the situation is classified by its words (what the process lacks: nothing, the CPU, a datum, or it is over);
- levels 2 and 3: each event is recognised by its words and applied with the transition table written here; an event
  that is not possible from the current state is an error;
- levels 4, 5 and 6: the table of the processes and the quantum are read from the text and the round robin is
  simulated here: the sequence of turns, the instant each process ends, the time in the queue (end minus CPU time).
"""
import re
from fractions import Fraction

from checkers._inf_so import check_choice, check_number, common, measure, option_text, prose_and_extra

CASE_RANGES = {
    1: {"esecuzione": (0.18, 0.32), "pronto": (0.26, 0.41), "attesa": (0.18, 0.32), "terminato": (0.11, 0.23)},
    2: {k: (0.14, 0.26) for k in ["cpu", "quanto", "richiesta", "arrivo", "fine"]},
}

STATES = {"pronto": "Pronto", "esecuzione": "In esecuzione", "attesa": "In attesa", "terminato": "Terminato"}
IN_PROSE = {"pronto": "pronto", "in esecuzione": "esecuzione", "in attesa": "attesa"}

SITUATION_WORDS = [
    ("terminato", ["ultima istruzione", "è stato chiuso"]),
    ("attesa", ["non ha ancora risposto", "finché l'utente", "non sono ancora arrivati"]),
    ("pronto", ["occupata da un altro", "tornato in coda", "primo turno", "gli manca solo la CPU"]),
    ("esecuzione", ["sta usando la CPU", "appena ricevuto la CPU", "a metà del suo quanto"]),
]

# event: (words that recognise it, state before, state after)
EVENTS = {
    "cpu": (["assegna la CPU", "riceve la CPU"], "pronto", "esecuzione"),
    "quanto": (["quanto"], "esecuzione", "pronto"),
    "richiesta": (["chiede", "si mette ad aspettare"], "esecuzione", "attesa"),
    "arrivo": (["viene completata", "arrivano"], "attesa", "pronto"),
    "fine": (["ultima istruzione"], "esecuzione", "terminato"),
}


def state_of(o):
    s = o["values"][0]
    if STATES.get(s) != option_text(o["latex"]):
        raise ValueError(f"option {o['latex']!r} is not the state {s!r}")
    return s


def event_kind(text):
    found = [k for k, (words, _, _) in EVENTS.items() if any(w in text for w in words)]
    if len(found) != 1:
        raise ValueError(f"event {text!r} fits {len(found)} kinds")
    return found[0]


def level1(sample, prose, errs):
    m = re.fullmatch(r"Il processo (?:del|della|dell'|di) ?(.+)\. In quale stato si trova\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    found = [s for s, words in SITUATION_WORDS if any(w in m.group(1) for w in words)]
    if len(found) != 1:
        errs.append(f"the situation fits {len(found)} states: {found}")
        return None
    check_choice(sample["answer"], lambda o: state_of(o) == found[0], errs)
    return found[0]


def level2(sample, prose, errs):
    m = re.fullmatch(r"Il processo (.+) è (pronto|in esecuzione|in attesa)\. Poi (.+)\. In quale stato si trova ora\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    try:
        kind = event_kind(m.group(3))
    except ValueError as e:
        errs.append(str(e))
        return None
    _, before, after = EVENTS[kind]
    if IN_PROSE[m.group(2)] != before:
        errs.append(f"event {kind} is not possible from {m.group(2)}")
    check_choice(sample["answer"], lambda o: state_of(o) == after, errs)
    return kind


def level3(sample, prose, errs):
    m = re.fullmatch(r"Il processo (.+) viene creato\. Poi, nell'ordine: (.+)\. In quale stato si trova alla fine\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    events = m.group(2).split("; ")
    if not 3 <= len(events) <= 5:
        errs.append(f"{len(events)} events, expected 3 to 5")
    state = "pronto"
    for i, text in enumerate(events):
        try:
            kind = event_kind(text)
        except ValueError as e:
            errs.append(str(e))
            return None
        _, before, after = EVENTS[kind]
        if before != state:
            errs.append(f"event {i + 1} ({kind}) is not possible from {state}")
            return None
        if kind == "fine" and i != len(events) - 1:
            errs.append("the process ends before the last event")
        state = after
    check_choice(sample["answer"], lambda o: state_of(o) == state, errs)
    return state


def round_robin(bursts, q):
    """The turns as (process, start, end) and the end of each process; all in the queue at 0, in order."""
    left = list(bursts)
    queue = list(range(len(bursts)))
    turns, ends, now = [], [0] * len(bursts), 0
    while queue:
        p = queue.pop(0)
        used = min(q, left[p])
        turns.append((p, now, now + used))
        now += used
        left[p] -= used
        if left[p] > 0:
            queue.append(p)
        else:
            ends[p] = now
    return turns, ends


def read_round_robin(prose, extra, errs):
    m = re.fullmatch(r"Tre processi sono nella coda dei pronti, nell'ordine della tabella, dall'istante \$0\$\. Lo scheduler usa il round robin con un quanto di (\$[^$]+\$)\. (.+)", prose)
    if not m or len(extra) != 1:
        errs.append(f"round robin text not recognised: {prose!r}")
        return None
    t = re.fullmatch(r"\\begin\{array\}\{c\|c\} \\text\{processo\} & \\text\{tempo di CPU\} \\\\ \\hline (.+) \\end\{array\}", extra[0])
    if not t:
        errs.append("table not recognised")
        return None
    bursts = []
    for i, row in enumerate(t.group(1).split(" \\\\ ")):
        name, value = [c.strip() for c in row.split("&")]
        if name != f"P_{i + 1}":
            errs.append(f"row {i + 1} is {name}")
        bursts.append(measure(value, "ms"))
    q = measure(m.group(1), "ms")
    if len(bursts) != 3 or any(b.denominator != 1 or not 1 <= b <= 12 for b in bursts):
        errs.append(f"bursts {bursts}: need three whole times from 1 to 12 ms")
        return None
    if q.denominator != 1 or not 2 <= q <= 5:
        errs.append(f"quantum {q} out of 2..5")
        return None
    bursts, q = [int(b) for b in bursts], int(q)
    if not any(b > q for b in bursts):
        errs.append("no process needs more than a quantum")
    turns, ends = round_robin(bursts, q)
    if not 4 <= len(turns) <= 8:
        errs.append(f"{len(turns)} turns, expected 4 to 8")
    return bursts, q, turns, ends, m.group(2)


def level4(sample, prose, extra, errs):
    data = read_round_robin(prose, extra, errs)
    if data is None:
        return None
    _, _, turns, _, question = data
    if question != "Qual è la sequenza dei turni?":
        errs.append(f"level 4 question not recognised: {question!r}")
    truth = [p + 1 for p, _, _ in turns]

    def sequence(o):
        names = o["latex"].split(",\\ ")
        seq = []
        for n in names:
            mm = re.fullmatch(r"P_([123])", n)
            if not mm:
                raise ValueError(f"not a process: {n!r}")
            seq.append(int(mm.group(1)))
        if "-".join(map(str, seq)) != o["values"][0]:
            raise ValueError("sequence value does not match its text")
        return seq

    if sample["answer"].get("kind") != "choice":
        errs.append("answer is not a choice")
        return None
    check_choice(sample["answer"], lambda o: sequence(o) == truth, errs)
    return f"{len(truth)} turni"


def level56(sample, prose, extra, errs, lvl):
    data = read_round_robin(prose, extra, errs)
    if data is None:
        return None
    bursts, _, _, ends, question = data
    pattern = r"A quale istante finisce \$P_([123])\$\?" if lvl == 5 else r"Per quanto tempo in tutto \$P_([123])\$ resta in coda, pronto, senza usare la CPU\?"
    m = re.fullmatch(pattern, question)
    if not m:
        errs.append(f"level {lvl} question not recognised: {question!r}")
        return None
    k = int(m.group(1)) - 1
    truth = ends[k] if lvl == 5 else ends[k] - bursts[k]
    if lvl == 6 and truth == 0:
        errs.append("time in the queue is zero")
    check_number(sample, Fraction(truth), "ms", errs)
    return None


def check(sample):
    errs = []
    common(sample, errs)
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    lvl = sample["level"]
    if lvl <= 3 and (extra or sample["answer"].get("kind") != "choice"):
        errs.append("levels 1 to 3 are prose with a choice")
        return errs, None
    kind = None
    if lvl == 1:
        kind = level1(sample, prose, errs)
    elif lvl == 2:
        kind = level2(sample, prose, errs)
    elif lvl == 3:
        kind = level3(sample, prose, errs)
    elif lvl == 4:
        kind = level4(sample, prose, extra, errs)
    elif lvl in (5, 6):
        kind = level56(sample, prose, extra, errs, lvl)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
