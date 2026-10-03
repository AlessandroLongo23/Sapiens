"""Checker for inf-informazione-dati (specs/exercises/inf-informazione-dati.md).

Written from the spec and the lesson, not from the generator. Everything is read back from the text:
- level 1: an option is a datum when it is a bare value between “ ”, an information when it is a sentence; in the
  stories about an operation the question quotes the input, the output or the operation, and the role follows;
- levels 2 and 3: the code table is parsed, the word is encoded (or the sequence split in groups and decoded);
- level 4: 2^n, the free sequences 2^n - k, or the sequences after adding bits;
- level 5: the smallest n with 2^n >= N;
- level 6: each object is looked up in the two lists of the spec, analog and digital.
"""
import re

from checkers._inf_informazione import check_choice, check_number, common, option_text, prose_and_extra, the_choice

CASE_RANGES = {
    1: {"trova-informazione": (0.22, 0.38), "trova-dato": (0.22, 0.38), "ruolo": (0.32, 0.48)},
    4: {"sequenze": (0.22, 0.38), "libere": (0.32, 0.48), "bit-in-piu": (0.22, 0.38)},
    5: {"potenza": (0.18, 0.32), "potenza-piu-uno": (0.09, 0.21), "generico": (0.50, 0.70)},
    6: {"analogica": (0.40, 0.60), "digitale": (0.40, 0.60)},
}

ROLES = ["I dati in ingresso", "L'elaborazione", "L'informazione ottenuta", "Il codice"]
OPERATIONS = ("il calcolo", "la somma", "la ricerca", "il conteggio")

ANALOG = {
    "un termometro a mercurio",
    "un orologio a lancette",
    "un disco in vinile",
    "una bilancia con l'ago",
    "un tachimetro a lancetta",
    "una musicassetta",
    "una meridiana",
    "una fotografia su pellicola",
    "l'indicatore del carburante a lancetta",
}
DIGITAL = {
    "un termometro con il display a cifre",
    "un orologio che mostra le ore con i numeri",
    "un file musicale",
    "una bilancia che scrive il peso in cifre",
    "un contapassi",
    "una foto scattata con il telefono",
    "un interruttore della luce",
    "un pallottoliere",
    "un contachilometri a cifre",
}


def lower_first(s):
    return s[0].lower() + s[1:] if s else s


def shape(o):
    """'dato' for a bare value between “ ”, 'info' for a sentence; the option's value must say the same."""
    text = option_text(o["latex"])
    if re.fullmatch(r"“[^“”\s]+”", text):
        kind = "dato"
    elif "“" not in text and "”" not in text and len(text.split()) >= 3 and text[0].isupper():
        kind = "info"
    else:
        raise ValueError(f"neither a bare value nor a sentence: {text!r}")
    if len(o["values"]) != 1 or not re.fullmatch(kind + r":[a-z]+", o["values"][0]):
        raise ValueError(f"values {o['values']} do not say {kind}")
    return kind


def level1(sample, prose, errs):
    ch = sample["answer"]
    if prose == "Quale di queste è un'informazione, e non soltanto un dato?":
        check_choice(ch, lambda o: shape(o) == "info", errs)
        return "trova-informazione"
    if prose == "Quale di questi è soltanto un dato, e non un'informazione?":
        check_choice(ch, lambda o: shape(o) == "dato", errs)
        return "trova-dato"
    m = re.fullmatch(r"(.+?) prende (.+?), (.+) e mostra (.+?)\. (?:Che cosa sono (.+?) per questa operazione|Che cos'è (.+?))\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    given, out = m.group(2), m.group(4)
    asked = m.group(5) or m.group(6)
    if asked == given:
        right = "I dati in ingresso"
    elif asked == out:
        right = "L'informazione ottenuta"
    elif asked.startswith(OPERATIONS):
        right = "L'elaborazione"
    else:
        errs.append(f"the question asks about {asked!r}, which is not in the story")
        return None
    if m.group(5) and right != "I dati in ingresso":
        errs.append("'per questa operazione' is the question about the input")
    texts = sorted(option_text(o["latex"]) for o in ch.get("options", []))
    if texts != sorted(ROLES):
        errs.append(f"options {texts} are not the four roles")
    check_choice(ch, lambda o: option_text(o["latex"]) == right and o["values"] == [right], errs)
    return "ruolo"


def parse_table(tex, n_letters, n_bits, errs):
    m = re.fullmatch(r"\\begin\{array\}\{([c|]+)\} (.+?) \\\\ \\hline (.+?) \\end\{array\}", tex)
    if not m:
        errs.append("table not recognised")
        return None
    letters = []
    for c in m.group(2).split(" & "):
        mm = re.fullmatch(r"\\text\{([A-Z])\}", c)
        if not mm:
            errs.append(f"table header {c!r} is not a letter")
            return None
        letters.append(mm.group(1))
    words = m.group(3).split(" & ")
    if len(letters) != n_letters or len(words) != n_letters or m.group(1).count("c") != n_letters:
        errs.append(f"the table must have {n_letters} letters")
        return None
    if letters != sorted(set(letters)):
        errs.append("letters repeated or not in alphabetical order")
    if any(not re.fullmatch(f"[01]{{{n_bits}}}", w) for w in words):
        errs.append(f"code words must have {n_bits} bits: {words}")
        return None
    if len(set(words)) != len(words):
        errs.append("two letters with the same code word")
        return None
    return dict(zip(letters, words))


def level2(sample, prose, extra, errs):
    m = re.fullmatch(r"Un codice binario associa a ogni lettera una sequenza di 2 bit, come nella tabella\. Qual è la codifica della parola ([A-Z]+)\?", prose)
    if not m or len(extra) != 1:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    code = parse_table(extra[0], 4, 2, errs)
    if code is None:
        return None
    word = m.group(1)
    if not 3 <= len(word) <= 5:
        errs.append(f"word of {len(word)} letters")
    if any(l not in code for l in word):
        errs.append(f"a letter of {word} is not in the table")
        return None
    truth = "".join(code[l] for l in word)

    def seq(o):
        if not re.fullmatch(r"[01]+", o["latex"]) or o["values"] != [o["latex"]] or len(o["latex"]) != len(truth):
            raise ValueError("not a bit sequence of the right length")
        return o["latex"]

    check_choice(sample["answer"], lambda o: seq(o) == truth, errs)
    return "codifica"


def level3(sample, prose, extra, errs):
    m = re.fullmatch(r"Un codice binario associa a ogni lettera una sequenza di 3 bit, come nella tabella\. Quale parola è scritta nella sequenza \$([01]+)\$\?", prose)
    if not m or len(extra) != 1:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    code = parse_table(extra[0], 6, 3, errs)
    if code is None:
        return None
    seq = m.group(1)
    if len(seq) % 3 or not 4 <= len(seq) // 3 <= 5:
        errs.append(f"sequence of {len(seq)} bits")
        return None
    back = {w: l for l, w in code.items()}
    groups = [seq[i : i + 3] for i in range(0, len(seq), 3)]
    if any(g not in back for g in groups):
        errs.append("a group of the sequence is not a code word")
        return None
    truth = "".join(back[g] for g in groups)

    def word(o):
        w = option_text(o["latex"])
        if not re.fullmatch(r"[A-Z]+", w) or o["values"] != [w] or len(w) != len(truth) or any(l not in code for l in w):
            raise ValueError("not a word of the same length written with the letters of the table")
        return w

    check_choice(sample["answer"], lambda o: word(o) == truth, errs)
    return "decodifica"


def level4(sample, prose, errs):
    m = re.fullmatch(r"Quante sequenze diverse si possono scrivere con (\d+) bit\?", prose) or re.fullmatch(r"Un codice binario ha parole di (\d+) bit\. Quante cose diverse può rappresentare al massimo\?", prose)
    if m:
        n = int(m.group(1))
        if not 2 <= n <= 12:
            errs.append(f"n = {n} out of 2..12")
        check_number(sample, 2**n, errs)
        return "sequenze"
    m = re.fullmatch(r"Un codice binario con parole di (\d+) bit è usato per rappresentare (\d+) (\w+)\. Quante sequenze restano senza significato\?", prose)
    if m:
        n, k = int(m.group(1)), int(m.group(2))
        if not 3 <= n <= 7:
            errs.append(f"n = {n} out of 3..7")
        if not 2 ** (n - 1) < k < 2**n:
            errs.append(f"{k} things do not need exactly {n} bits, or leave no free sequence")
            return None
        check_number(sample, 2**n - k, errs)
        return "libere"
    m = re.fullmatch(r"Con (\d+) bit si scrivono (\d+) sequenze diverse\. Quante se ne scrivono con (\d+) bit\?", prose)
    if m:
        n, x, n2 = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if x != 2**n:
            errs.append(f"with {n} bits the sequences are not {x}")
        if not 2 <= n <= 9 or not 1 <= n2 - n <= 3:
            errs.append(f"from {n} to {n2} bits is out of the spec")
        check_number(sample, 2**n2, errs)
        return "bit-in-piu"
    errs.append(f"level 4 text not recognised: {prose!r}")
    return None


def level5(sample, prose, errs):
    m = re.fullmatch(r"Un codice binario deve distinguere (\d+) (.+?), con parole tutte della stessa lunghezza\. Quanti bit servono, come minimo, per ogni parola\?", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    N = int(m.group(1))
    if not 4 <= N <= 1024:
        errs.append(f"N = {N} out of 4..1024")
    n = 0
    while 2**n < N:
        n += 1
    check_number(sample, n, errs)
    exact = 2**n == N
    kind = "potenza" if exact else "potenza-piu-uno" if 2 ** (n - 1) + 1 == N else "generico"
    # the mistake of the lesson must be among the options: one bit too many for a power of two, the power before otherwise
    wanted = str(n + 1 if exact else n - 1)
    ch = sample.get("choice") or {}
    if wanted not in [o["values"][0] for o in ch.get("options", [])]:
        errs.append(f"the choice has no option {wanted}")
    return kind


def level6(sample, prose, errs):
    m = re.fullmatch(r"Quale di questi oggetti rappresenta l'informazione in modo (analogico|digitale)\?", prose)
    if not m:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    wanted = ANALOG if m.group(1) == "analogico" else DIGITAL

    def name(o):
        x = lower_first(option_text(o["latex"]))
        if x not in ANALOG | DIGITAL or o["values"] != [x]:
            raise ValueError(f"unknown object {x!r}")
        return x

    check_choice(sample["answer"], lambda o: name(o) in wanted, errs)
    return "analogica" if m.group(1) == "analogico" else "digitale"


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample["level"]
    kind_wanted = "number" if lvl in (4, 5) else "choice"
    if sample.get("answer", {}).get("kind") != kind_wanted:
        errs.append(f"answer.kind must be {kind_wanted}")
    if the_choice(sample) is None:
        errs.append("no multiple choice")
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    if lvl not in (2, 3) and extra:
        errs.append("unexpected non-prose lines")
    if lvl == 1:
        kind = level1(sample, prose, errs)
    elif lvl == 2:
        kind = level2(sample, prose, extra, errs)
    elif lvl == 3:
        kind = level3(sample, prose, extra, errs)
    elif lvl == 4:
        kind = level4(sample, prose, errs)
    elif lvl == 5:
        kind = level5(sample, prose, errs)
    elif lvl == 6:
        kind = level6(sample, prose, errs)
    else:
        errs.append(f"unknown level {lvl}")
        kind = None
    if kind is not None and sample.get("params", {}).get("case") != kind:
        errs.append(f"params.case {sample.get('params', {}).get('case')!r} but the exercise is {kind!r}")
    return errs, kind
