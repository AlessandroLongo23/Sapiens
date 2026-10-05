"""Checker for inf-servizi-internet (specs/exercises/inf-servizi-internet.md).

Written from the spec and the lesson, not from the generator. The right option is rebuilt from the pieces:
- level 1: the address is read from the question and split at the at sign here; an address is valid when it matches
  the pattern below; two addresses are the same mailbox when they are equal apart from capitals;
- level 2: the two addresses are read from the question; the table below says which of the two servers each step
  touches; the protocol comes from what the situation says happens to the messages;
- level 3: the field comes from what the situation says about the recipient;
- level 4: the three lists are read from the question and the people are counted here;
- level 5: the service comes from the words of the situation; the table says which communications are synchronous;
- level 6: the table of true and false statements.
"""
import re

from checkers._inf_web2 import NAMES, check_choice, check_solution, check_statements, common, people

CASE_RANGES = {
    1: {k: (0.14, 0.26) for k in ["utente", "dominio", "stesso", "valido", "arriva"]},
    2: {"passo": (0.57, 0.73), "protocollo": (0.27, 0.43)},
    3: {k: (0.26, 0.41) for k in ["A", "Cc", "Ccn"]},
    4: {k: (0.19, 0.31) for k in ["ricevono", "nascosto", "rispondi", "tutti"]},
    5: {"servizio": (0.52, 0.68), "sincrona": (0.13, 0.27), "asincrona": (0.13, 0.27)},
    6: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
}

ADDRESS = r"[A-Za-z0-9._]+@[A-Za-z0-9.-]*[A-Za-z0-9]"
VALID = re.compile(r"[A-Za-z0-9._]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+")


def split(address):
    if not VALID.fullmatch(address):
        raise ValueError(f"{address!r} is not an address")
    user, domain = address.split("@")
    return user, domain


def level1(sample, errs):
    text = sample["problem"]
    m = re.fullmatch(rf"Nell'indirizzo ({ADDRESS}) qual è (il nome utente, cioè la parte che indica la casella|il dominio, cioè la parte che indica il server di posta)\?", text)
    if m:
        user, domain = split(m.group(1))
        want = user if m.group(2).startswith("il nome utente") else domain
        check_choice(sample, lambda o: o["latex"] == want, errs)
        return "utente" if want == user else "dominio"
    m = re.fullmatch(rf"(\w+) ha l'indirizzo ({ADDRESS})\. Quale di questi indirizzi ha la casella sullo stesso server di posta\?", text)
    if m:
        user, domain = split(m.group(2))

        def same_server(o):
            u, d = split(o["latex"])
            if (u, d) == (user, domain):
                raise ValueError("the same address is among the options")
            return d.lower() == domain.lower()

        check_choice(sample, same_server, errs)
        return "stesso"
    if text == "Quale di questi è scritto come un indirizzo di posta elettronica?":
        check_choice(sample, lambda o: VALID.fullmatch(o["latex"]) is not None, errs)
        return "valido"
    m = re.fullmatch(rf"(\w+) vuole scrivere a ({ADDRESS}) ma come destinatario scrive ({ADDRESS}) e invia\. Che cosa succede al messaggio\?", text)
    if m:
        wanted, typed = m.group(2), m.group(3)
        split(wanted), split(typed)
        if wanted == typed:
            errs.append("the address typed is the one wanted")
        same = wanted.lower() == typed.lower()
        # what each fate says, and whether it is what happens
        fates = {
            "altra": ("un'altra casella", not same),
            "stessa": ("maiuscole e minuscole", same),
            "corregge": ("corregge", False),
            "dominio": ("conta solo il dominio", False),
            "tutte": ("tutte le caselle", False),
            "nonvalido": ("non è valido", False),
        }

        def happens(o):
            words, value = fates[o["values"][0]]
            if words not in o["latex"]:
                raise ValueError(f"fate {o['values'][0]} does not say {words!r}")
            return value

        check_choice(sample, happens, errs)
        return "arriva"
    errs.append(f"level 1 text not recognised: {text!r}")
    return None


# which server a step of the journey touches: the sender's or the recipient's
JOURNEY = [
    ("A quale computer consegna il messaggio il programma di {S}?", "sender"),
    ("Quale computer legge il dominio del destinatario per decidere a chi passare il messaggio?", "sender"),
    ("Su quale computer aspetta il messaggio finché {R} non apre la posta?", "recipient"),
    ("A quale computer si collega il programma di {R} per leggere il messaggio?", "recipient"),
]
# what the situation says happens, and the protocol that does it
PROTOCOLS = [
    ("IMAP", ["restano sul server", "lasciandoli sul server"]),
    ("POP3", ["li toglie dal server", "sul server non ci sono più"]),
    ("SMTP", ["consegna il messaggio", "passa un messaggio", "parte dal telefono"]),
]


def level2(sample, errs):
    text = sample["problem"]
    m = re.fullmatch(rf"(\w+) \(({ADDRESS})\) scrive ad? (\w+) \(({ADDRESS})\)\. (.+\?)", text)
    if m:
        S, sa, R, ra, question = m.groups()
        d1, d2 = split(sa)[1], split(ra)[1]
        if d1 == d2 or S == R or S not in NAMES or R not in NAMES:
            errs.append("the two people or the two domains are not different")
        side = [who for q, who in JOURNEY if q.format(S=S, R=R) == question]
        if len(side) != 1:
            errs.append(f"step not recognised: {question!r}")
            return None
        want = f"Il server di posta di {d1 if side[0] == 'sender' else d2}"
        allowed = {want, f"Il server di posta di {d1}", f"Il server di posta di {d2}", f"Il dispositivo di {S}", f"Il dispositivo di {R}"}
        if any(o["latex"] not in allowed for o in sample["answer"]["options"]):
            errs.append("an option is not one of the four computers")
        check_choice(sample, lambda o: o["latex"] == want, errs)
        return "passo"
    m = re.fullmatch(r"(.+) Quale protocollo viene usato\?", text)
    if m:
        found = [p for p, words in PROTOCOLS if any(w in m.group(1) for w in words)]
        if len(found) != 1:
            errs.append(f"the situation fits {len(found)} protocols")
            return None
        if {o["latex"] for o in sample["answer"]["options"]} != {"SMTP", "IMAP", "POP3", "FTP"}:
            errs.append("the options are not the four protocols")
        check_choice(sample, lambda o: o["latex"] == found[0], errs)
        return "protocollo"
    errs.append(f"level 2 text not recognised: {text!r}")
    return None


FIELDS = [
    ("A", "che deve leggere e rispondere"),
    ("Cc", "senza dover rispondere"),
    ("Ccn", "nessuno deve vedere gli indirizzi degli altri"),
]


def level3(sample, errs):
    text = sample["problem"]
    if not re.search(r"In quale campo (va l'indirizzo|vanno i \d+ indirizzi)", text):
        errs.append(f"level 3 text not recognised: {text!r}")
        return None
    found = [f for f, words in FIELDS if words in text]
    if len(found) != 1:
        errs.append(f"the situation fits {len(found)} fields")
        return None
    if {o["latex"] for o in sample["answer"]["options"]} != {"A", "Cc", "Ccn", "Oggetto"}:
        errs.append("the options are not the four fields")
    m = re.search(r"invita (\d+) persone .* In quale campo vanno i (\d+) indirizzi", text)
    if found[0] == "Ccn" and (not m or m.group(1) != m.group(2) or not 12 <= int(m.group(1)) <= 40):
        errs.append("the number of people invited is not said twice the same, between 12 and 40")
    check_choice(sample, lambda o: o["latex"] == found[0], errs)
    return found[0]


def count(o):
    m = re.fullmatch(r"(\d+) (persona|persone)", o["latex"])
    if not m or (m.group(1) == "1") != (m.group(2) == "persona") or o["values"][0] != m.group(1):
        raise ValueError(f"{o['latex']!r} is not a number of people")
    return int(m.group(1))


def level4(sample, errs):
    text = sample["problem"]
    m = re.fullmatch(r"(\w+) manda un messaggio: in A mette (.+?), in Cc mette (.+?) e in Ccn mette (.+?)\. (.+\?)", text)
    if not m:
        errs.append(f"level 4 text not recognised: {text!r}")
        return None
    sender, question = m.group(1), m.group(5)
    to, cc, ccn = people(m.group(2)), people(m.group(3)), people(m.group(4))
    everyone = [sender, *to, *cc, *ccn]
    if len(set(everyone)) != len(everyone) or any(n not in NAMES for n in everyone):
        errs.append("a name is repeated or unknown")
    if not (1 <= len(to) <= 3 and 1 <= len(cc) <= 3 and 1 <= len(ccn) <= 3 and len(to) + len(cc) >= 3):
        errs.append("the three lists are not of the sizes of the spec")
    if question == "Quante persone ricevono il messaggio?":
        check_choice(sample, lambda o: count(o) == len(to) + len(cc) + len(ccn), errs)
        return "ricevono"
    if question == "Quale di questi destinatari resta nascosto agli altri?":
        if any(o["latex"] not in to + cc + ccn for o in sample["answer"]["options"]):
            errs.append("an option is not a recipient")
        check_choice(sample, lambda o: o["latex"] in ccn, errs)
        return "nascosto"
    m = re.fullmatch(r"(\w+) preme (Rispondi|Rispondi a tutti)\. Quante persone ricevono la sua risposta\?", question)
    if m:
        if m.group(1) not in to + cc:
            errs.append("who answers is not in A or in Cc")
        # the sender, and with "a tutti" the others in A and in Cc; never those in Ccn
        want = 1 + (len(to) + len(cc) - 1 if m.group(2) == "Rispondi a tutti" else 0)
        check_choice(sample, lambda o: count(o) == want, errs)
        return "tutti" if m.group(2) == "Rispondi a tutti" else "rispondi"
    errs.append(f"level 4 question not recognised: {question!r}")
    return None


SERVICES = {
    "posta": "La posta elettronica",
    "chat": "La messaggistica istantanea",
    "video": "La videochiamata",
    "streaming": "Lo streaming",
    "download": "Lo scaricamento del file (download)",
    "ftp": "Il trasferimento di file su un server",
}
# the words of a situation that decide its service
SERVICE_WORDS = [
    ("posta", ["messaggio scritto che resti", "indirizzo con la chiocciola", "alla sua casella"]),
    ("chat", ["stessa app", "in pochi istanti"]),
    ("video", ["vede e sente", "vedendoli sullo schermo", "si vedono e si parlano"]),
    ("streaming", ["mentre i dati stanno ancora arrivando", "senza aspettare di avere tutto il file", "il video si blocca o perde qualità"]),
    ("download", ["arrivi tutto", "anche senza connessione", "arrivi per intero"]),
    ("ftp", ["al server che lo pubblica", "caricare sul server", "copia sul server"]),
]
# True: synchronous
TIMES = {
    "s1": (True, "telefonata"), "s2": (True, "videochiamata con i nonni"), "s3": (True, "in diretta"),
    "s4": (True, "colloquio in videochiamata"), "s5": (True, "chiamata vocale"), "s6": (True, "videoconferenza"),
    "a1": (False, "mail alla segreteria"), "a2": (False, "letto più tardi"), "a3": (False, "ascolta dopo"),
    "a4": (False, "spedito per posta elettronica"), "a5": (False, "commento lasciato"), "a6": (False, "il giorno dopo"),
}


def level5(sample, errs):
    text = sample["problem"]
    m = re.fullmatch(r"(.+) Di quale servizio si tratta\?", text)
    if m:
        found = [s for s, words in SERVICE_WORDS if any(w in m.group(1) for w in words)]
        if len(found) != 1:
            errs.append(f"the situation fits {len(found)} services: {found}")
            return None
        ids = [o["values"][0] for o in sample["answer"]["options"]]
        if found[0] in ("download", "ftp") and {"download", "ftp"} <= set(ids):
            errs.append("download and file transfer are both among the options, and one is the right one")

        def service(o):
            if SERVICES.get(o["values"][0]) != o["latex"]:
                raise ValueError(f"{o['latex']!r} is not the service {o['values'][0]!r}")
            return o["values"][0]

        check_choice(sample, lambda o: service(o) == found[0], errs)
        return "servizio"
    m = re.fullmatch(r"Quale di queste comunicazioni è (sincrona|asincrona)\?", text)
    if m:
        want = m.group(1) == "sincrona"

        def sync(o):
            value, words = TIMES[o["values"][0]]
            if words not in o["latex"]:
                raise ValueError(f"{o['values'][0]} does not say {words!r}")
            return value

        check_choice(sample, lambda o: sync(o) == want, errs)
        return m.group(1)
    errs.append(f"level 5 text not recognised: {text!r}")
    return None


STATEMENTS = {
    "t1": (True, "dal browser, senza installare"), "t2": (True, "la stessa casella"), "t3": (True, "aspetta nella casella"),
    "t4": (True, "può finire per errore"), "t5": (True, "si manda il link"), "t6": (True, "mentre i dati stanno ancora arrivando"),
    "t7": (True, "anche senza connessione"), "t8": (True, "non viene aspettato"), "t9": (True, "perché sono servizi diversi"),
    "t10": (True, "di qualunque servizio"), "t11": (True, "allegati compresi"), "t12": (True, "oggetto preciso"),
    "f1": (False, "due caselle diverse"), "f2": (False, "solo se il destinatario è collegato"), "f3": (False, "di sicuro pubblicità"),
    "f4": (False, "qualunque dimensione"), "f5": (False, "prima scaricare tutto"), "f6": (False, "visto in streaming resta"),
    "f7": (False, "sono la stessa cosa"), "f8": (False, "di sicuro non funziona nemmeno"), "f9": (False, "anche a chi usa un'altra app"),
    "f10": (False, "Rispondi a tutti scrive solo al mittente"), "f11": (False, "senza passare da un server"), "f12": (False, "si può lasciare vuoto"),
}

LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = common(sample)
    if errs:
        return errs, None
    level = sample["level"]
    if level in LEVELS:
        kind = LEVELS[level](sample, errs)
    elif level == 6:
        kind = check_statements(sample, "sui servizi di Internet", STATEMENTS, errs)
    else:
        errs.append(f"unknown level {level}")
        kind = None
    check_solution(sample, errs)
    if kind is not None and sample["params"]["case"] != kind:
        errs.append(f"params say case {sample['params']['case']!r}, the question is {kind!r}")
    return errs, kind
