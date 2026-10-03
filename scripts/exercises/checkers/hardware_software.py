"""Checker for hardware-software (specs/exercises/hardware-software.md).

Written from the spec and the lesson, not from the generator: the tables below classify every piece the spec lists
(components and programs, system and application software, faults and problems, true and false statements), and the
right answer is rebuilt from the classes of the four options and from the question. At level 3 the kind of software
is recognised from the words of the job description.
"""
import re

from checkers._inf_informazione import check_choice, common, option_text, prose_and_extra

CASE_RANGES = {
    1: {"hardware": (0.40, 0.60), "software": (0.40, 0.60)},
    2: {"di-base": (0.40, 0.60), "applicativo": (0.40, 0.60)},
    3: {k: (0.18, 0.32) for k in ["sistema-operativo", "driver", "firmware", "applicativo"]},
    4: {"hardware": (0.40, 0.60), "software": (0.40, 0.60)},
    5: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
}

# Level 1: things one can touch, and programs.
HW = """lo schermo; la tastiera; il mouse; la batteria; la memoria RAM; la CPU; la stampante; la webcam;
il disco di un videogioco; una chiavetta USB; l'altoparlante; la scheda video; il caricatore; il microfono"""
SW = """il browser; il sistema operativo; un videogioco scaricato; l'app del meteo; il programma di videoscrittura;
il foglio di calcolo; il driver della stampante; l'app della fotocamera; l'antivirus; il firmware del router;
l'app del registro elettronico; il programma per ritoccare le foto; l'app di messaggistica; il lettore musicale"""

# Level 2: every operating system and every driver is system software; the rest serves the user.
APPLICATION = """il browser; il programma di videoscrittura; il foglio di calcolo; un videogioco;
l'app del registro elettronico; il programma per ritoccare le foto; l'app di messaggistica; il lettore musicale;
l'app delle mappe; il programma per le presentazioni; l'app del meteo; il programma per montare i video"""

# Level 4: an object broken or worn out, or a program with an error or missing.
HW_PROBLEMS = """lo schermo ha una crepa; la batteria non tiene più la carica; un tasto della tastiera si è rotto;
la ventola fa rumore perché è consumata; la porta USB è piegata; il cavo del caricatore è spezzato;
l'altoparlante gracchia dopo una caduta; il vetro della fotocamera è graffiato"""
SW_PROBLEMS = """un'app si chiude da sola dopo l'aggiornamento; manca il driver della stampante nuova;
un gioco si blocca sempre al terzo livello; il browser non apre un sito finché non lo aggiorni;
il programma non apre i file del nuovo formato; il sistema operativo va aggiornato per sicurezza;
l'app del registro mostra la media sbagliata; un programma ha un errore nei calcoli"""

# Level 5: what the lesson says, and the mistakes of its warnings.
TRUE = """un programma è una sequenza di istruzioni; il firmware è software; senza software l'hardware non fa niente;
la memoria RAM è hardware; il sistema operativo è software di base; un driver è un programma;
il software si può copiare senza perderlo; il browser è software applicativo;
il freeware è gratis ma non si può modificare; il software libero si può studiare e modificare;
una foto è un dato, non un programma"""
FALSE = """la CPU è software perché non si vede; il firmware è un pezzo di hardware;
un driver è un componente della stampante; il software si consuma con gli anni;
il sistema operativo è software applicativo; ogni programma gratuito è software libero;
un videogioco è software di base; le app comandano l'hardware senza il sistema operativo;
uno schermo crepato si ripara con un aggiornamento; il software di base è fatto di programmi semplici;
il disco di un videogioco è software; una foto salvata nel telefono è un programma"""


def items(block):
    return {" ".join(x.split()) for x in block.split(";")}


HW, SW, APPLICATION, HW_PROBLEMS, SW_PROBLEMS, TRUE, FALSE = (items(b) for b in (HW, SW, APPLICATION, HW_PROBLEMS, SW_PROBLEMS, TRUE, FALSE))

KINDS = {"sistema-operativo": "Il sistema operativo", "driver": "Un driver", "firmware": "Il firmware", "applicativo": "Un programma applicativo"}


def lower_first(s):
    # "La CPU" -> "la CPU", "L'app" -> "l'app"
    return s[0].lower() + s[1:] if s else s


def piece(o):
    x = lower_first(option_text(o["latex"]))
    if o["values"] != [x]:
        raise ValueError(f"values {o['values']} do not match the text {x!r}")
    return x


def classify(x, classes):
    """The name of the only class that contains x."""
    found = [name for name, pool in classes.items() if x in pool]
    if len(found) != 1:
        raise ValueError(f"{x!r} is in {len(found)} classes")
    return found[0]


def system_or_application(x):
    if re.fullmatch(r"il sistema operativo (del|della|dello) .+", x) or re.fullmatch(r"il driver (del|della|dello) .+", x):
        return "di-base"
    if x in APPLICATION:
        return "applicativo"
    raise ValueError(f"{x!r} is neither system nor application software")


def kind_of(job):
    rules = {
        "driver": ["Permette al sistema operativo di usare", "Spiega al sistema operativo quali comandi capisce"],
        "firmware": ["in un chip"],
        "sistema-operativo": ["assegna la CPU e la memoria agli altri programmi", "Organizza i file e le cartelle"],
        "applicativo": [" lo usa per ", " lo apre quando deve "],
    }
    found = [k for k, keys in rules.items() if any(key in job for key in keys)]
    return found[0] if len(found) == 1 else None


def one_among_three(sample, wanted, class_of, errs):
    """Exactly one option of the wanted class, the other three of the other class."""
    classes = []
    for o in sample["answer"].get("options", []):
        try:
            classes.append(class_of(piece(o)))
        except ValueError as e:
            errs.append(str(e))
            return
    if classes.count(wanted) != 1 or len(set(classes)) != 2:
        errs.append(f"options of classes {classes}, wanted one {wanted!r} among three of the other class")
    check_choice(sample["answer"], lambda o: class_of(piece(o)) == wanted, errs)


def check(sample):
    errs = []
    common(sample, errs)
    if sample.get("answer", {}).get("kind") != "choice":
        errs.append("answer is not a choice")
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected non-prose lines")
    lvl = sample["level"]
    kind = None
    if lvl == 1:
        m = re.fullmatch(r"Quale di questi è (hardware|software)\?", prose)
        if m:
            kind = m.group(1)
            one_among_three(sample, kind, lambda x: classify(x, {"hardware": HW, "software": SW}), errs)
    elif lvl == 2:
        m = re.fullmatch(r"Quale di questi programmi è software (di base|applicativo)\?", prose)
        if m:
            kind = "di-base" if m.group(1) == "di base" else "applicativo"
            one_among_three(sample, kind, system_or_application, errs)
    elif lvl == 3:
        m = re.fullmatch(r"(.+) Che tipo di software è\?", prose)
        if m:
            kind = kind_of(m.group(1))
            if kind is None:
                errs.append(f"job not recognised, or of two kinds: {m.group(1)!r}")
            else:
                texts = sorted(option_text(o["latex"]) for o in sample["answer"].get("options", []))
                if texts != sorted(KINDS.values()):
                    errs.append(f"options {texts} are not the four kinds of software")
                check_choice(sample["answer"], lambda o: option_text(o["latex"]) == KINDS[kind] and o["values"] == [KINDS[kind]], errs)
    elif lvl == 4:
        if prose == "Quale di questi problemi è un guasto dell'hardware, che nessun aggiornamento ripara?":
            kind = "hardware"
        elif prose == "Quale di questi problemi è del software, e si risolve senza riparare o sostituire pezzi?":
            kind = "software"
        if kind:
            one_among_three(sample, kind, lambda x: classify(x, {"hardware": HW_PROBLEMS, "software": SW_PROBLEMS}), errs)
    elif lvl == 5:
        m = re.fullmatch(r"Quale di queste affermazioni è (vera|falsa)\?", prose)
        if m:
            kind = m.group(1)
            one_among_three(sample, kind, lambda x: classify(x, {"vera": TRUE, "falsa": FALSE}), errs)
    else:
        errs.append(f"unknown level {lvl}")
    if kind is None and not errs:
        errs.append(f"level {lvl} text not recognised: {prose!r}")
    if kind is not None and sample.get("params", {}).get("case") != kind:
        errs.append(f"params.case {sample.get('params', {}).get('case')!r} but the exercise is {kind!r}")
    return errs, kind
