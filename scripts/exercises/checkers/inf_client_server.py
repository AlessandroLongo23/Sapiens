"""Checker for inf-client-server (specs/exercises/inf-client-server.md).

Written from the spec and the lesson. The answer is rebuilt from the pieces:
- level 1: the service is recognised from the text; of the four actors, the client is the app and the server the
  program of the service, never the person or the technician;
- level 2: a message is read from its option (who sends it, what it carries): the request goes from the app to the
  server and carries what is asked, the response comes back with the data; the four steps are in the order below;
- level 3: the table of the tasks of the server and of the client;
- level 4: a chat message always goes through the server, waits there, and reaches the other phone when its client
  asks;
- level 5: the table of the client-server and peer-to-peer situations;
- level 6: the table of true and false statements.
"""
import re

from checkers._inf_web1 import NAMES, check_statements, kind_of, one_right, same_case, start

CASE_RANGES = {
    1: {"client": (0.40, 0.60), "server": (0.40, 0.60)},
    2: {"richiesta": (0.22, 0.38), "risposta": (0.22, 0.38), "passo": (0.32, 0.48)},
    3: {"client": (0.40, 0.60), "server": (0.40, 0.60)},
    4: {"percorso": (0.32, 0.48), "spento": (0.22, 0.38), "chiede": (0.22, 0.38)},
    5: {"client-server": (0.40, 0.60), "peer-to-peer": (0.40, 0.60)},
    6: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
}

# id: (words of the story, the app, whose computer the server is on, what is asked, what comes back)
SERVICES = {
    "registro": ("registro elettronico", "l'app del registro", "della società del registro", "i voti di uno studente", "l'elenco dei voti"),
    "treni": ("cerca un treno", "l'app delle ferrovie", "delle ferrovie", "l'orario dei treni per una città", "l'elenco dei treni con gli orari"),
    "meteo": ("app del meteo", "l'app del meteo", "del servizio meteo", "le previsioni per una città", "le previsioni dei prossimi giorni"),
    "posta": ("app della posta", "l'app della posta", "del servizio di posta", "i messaggi arrivati", "l'elenco dei messaggi nuovi"),
    "biblioteca": ("cerca un libro", "l'app della biblioteca", "della biblioteca", "la disponibilità di un libro", "le copie libere di quel libro"),
    "musica": ("sceglie una canzone", "l'app della musica", "del servizio di musica", "una canzone", "il file della canzone"),
    "negozio": ("app di un negozio", "l'app del negozio", "del negozio", "le offerte del giorno", "l'elenco delle offerte"),
    "mappe": ("cerca una via", "l'app delle mappe", "del servizio di mappe", "la cartina di una zona", "l'immagine della cartina"),
    "cinema": ("app del cinema", "l'app del cinema", "del cinema", "i film in programma", "l'elenco dei film con gli orari"),
    "mensa": ("app della mensa", "l'app della mensa", "della mensa", "il menu della settimana", "i piatti di ogni giorno"),
}

STEPS = [
    "Il client manda la richiesta al server",
    "Il server riceve la richiesta e la esegue",
    "Il server manda la risposta al client",
    "Il client riceve la risposta e la mostra sullo schermo",
]

# True: a task of the server. False: a task of the client.
TASKS = {
    "s1": (True, "di tutti gli utenti"), "s2": (True, "permesso"), "s3": (True, "classifica"), "s4": (True, "chi ha vinto"),
    "s5": (True, "giorno e notte"), "s6": (True, "migliaia di utenti"), "s7": (True, "tutta la scuola"), "s8": (True, "finché il destinatario"),
    "c1": (False, "disegnare"), "c2": (False, "tasti"), "c3": (False, "mostrare la risposta"), "c4": (False, "modulo"),
    "c5": (False, "mandare la richiesta"), "c6": (False, "cominciare"), "c7": (False, "disporre"), "c8": (False, "ingrandire"),
}

# True: peer-to-peer. False: client-server.
MODELS = {
    "k1": (False, "orario dei treni"), "k2": (False, "chiede i voti"), "k3": (False, "browser"), "k4": (False, "posta"),
    "k5": (False, "streaming"), "k6": (False, "meteo"), "k7": (False, "computer centrale tiene"), "k8": (False, "chat"),
    "p1": (True, "ognuno passa agli altri"), "p2": (True, "ognuno chiede file all'altro"), "p3": (True, "senza un computer centrale"),
    "p4": (True, "ne offre intanto"), "p5": (True, "alla pari"), "p6": (True, "senza un centro"),
}

STATEMENTS = {
    "t1": (True, "non la persona"), "t2": (True, "sempre il client"), "t3": (True, "da client in uno scambio e da server in un altro"),
    "t4": (True, "porta avanti insieme"), "t5": (True, "si ferma per tutti"), "t6": (True, "ritrovi i tuoi dati"),
    "t7": (True, "È il server a decidere"), "t8": (True, "sia da client sia da server"), "t9": (True, "continua a funzionare"),
    "t10": (True, "Puoi scrivere in chat"), "t11": (True, "risponde lentamente"), "t12": (True, "Senza rete"),
    "f1": (False, "Il client è la persona"), "f2": (False, "di sua iniziativa"), "f3": (False, "per forza una macchina"),
    "f4": (False, "un client alla volta"), "f5": (False, "conservati sul tuo telefono"), "f6": (False, "senza passare da altri computer"),
    "f7": (False, "senza il server"), "f8": (False, "un server centrale conserva"), "f9": (False, "non può mai"),
    "f10": (False, "continuano a ricevere"), "f11": (False, "Il server è il tecnico"), "f12": (False, "qualcuno garantisce"),
}


def cap(s):
    return s[0].upper() + s[1:]


def service_of(story, errors):
    found = [k for k, v in SERVICES.items() if v[0] in story]
    if len(found) != 1:
        errors.append(f"the story fits {len(found)} services")
        return None
    return found[0]


def labelled(labels):
    """The value of an option, after checking that it reads as `labels` says."""

    def value(o):
        if labels.get(o["values"][0]) != o["latex"]:
            raise ValueError(f"option {o['latex']!r} is not {o['values'][0]!r}")
        return o["values"][0]

    return value


def level1(sample, errors):
    m = re.fullmatch(r"(\w+) (.+)\. In questo scambio, chi è il (client|server)\?", sample["problem"])
    if not m or m.group(1) not in NAMES:
        errors.append(f"level 1 text not recognised: {sample['problem']!r}")
        return None
    name, role = m.group(1), m.group(3)
    service = service_of(m.group(2), errors)
    if not service:
        return None
    _, app, owner, _, _ = SERVICES[service]
    value = labelled({
        "client": f"{cap(app)} sul telefono di {name}",  # the program that asks
        "server": f"Il programma che gira su un computer {owner}",  # the program that answers
        "utente": f"{name}, che tocca lo schermo",  # a person: neither
        "tecnico": f"Il tecnico che controlla i computer {owner}",  # a person: neither
    })
    one_right(sample, lambda o: value(o) == role, errors)
    return same_case(sample, role, errors)


def level2(sample, errors):
    text = sample["problem"]
    m = re.fullmatch(r"(\w+) (.+)\. Quale passo viene subito (dopo|prima di) questo: «(.+)»\?", text)
    if m:
        if m.group(1) not in NAMES or not service_of(m.group(2), errors) or m.group(4) not in STEPS:
            errors.append("unknown name, service or step")
            return None
        want = STEPS.index(m.group(4)) + (1 if m.group(3) == "dopo" else -1)
        if not 0 <= want <= 3:
            errors.append("no step there")
            return None
        value = labelled({str(i + 1): s for i, s in enumerate(STEPS)})
        one_right(sample, lambda o: int(value(o)) == want + 1, errors)
        return same_case(sample, "passo", errors)
    m = re.fullmatch(r"(\w+) (.+)\. Qual è la (richiesta|risposta)\?", text)
    if not m or m.group(1) not in NAMES:
        errors.append(f"level 2 text not recognised: {text!r}")
        return None
    service = service_of(m.group(2), errors)
    if not service:
        return None
    _, app, _, request, response = SERVICES[service]

    def message(o):
        """(who sends it, what it carries), read from the text of the option."""
        t = o["latex"]
        for sender, opening in (("client", f"{cap(app)} chiede al server "), ("client", f"{cap(app)} manda al server "), ("server", "Il server manda all'app "), ("server", "Il server chiede all'app ")):
            if t.startswith(opening):
                carried = t[len(opening):]
                if carried not in (request, response):
                    raise ValueError(f"option {t!r} carries something unknown")
                return sender, "richiesta" if carried == request else "risposta"
        raise ValueError(f"option {t!r} is not a message")

    # the request leaves the client and carries what is asked; the response leaves the server and carries the data
    want = ("client", "richiesta") if m.group(3) == "richiesta" else ("server", "risposta")
    one_right(sample, lambda o: message(o) == want, errors)
    return same_case(sample, m.group(3), errors)


def level3(sample, errors):
    m = re.fullmatch(r"Quale di questi compiti tocca al (server|client)\?", sample["problem"])
    if not m:
        errors.append(f"level 3 text not recognised: {sample['problem']!r}")
        return None
    kind = kind_of(TASKS)
    one_right(sample, lambda o: kind(o) == (m.group(1) == "server"), errors)
    return same_case(sample, m.group(1), errors)


def people(a, b, prep, errors):
    if a not in NAMES or b not in NAMES or a == b:
        errors.append(f"wrong names {a!r}, {b!r}")
    if prep != ("ad" if b[0] in "AEIOU" else "a"):
        errors.append(f"wrong preposition before {b}")


def level4(sample, errors):
    text = sample["problem"]
    m = re.fullmatch(r"(\w+) scrive in una chat (a|ad) (\w+), che ha il telefono spento\. Dove resta il messaggio finché (\w+) non lo riaccende\?", text)
    if m:
        a, b = m.group(1), m.group(3)
        people(a, b, m.group(2), errors)
        if m.group(4) != b:
            errors.append("the phone that is off is not the receiver's")
        value = labelled({"server": "Sul server della chat", "destinatario": f"Sul telefono di {b}", "router": f"Sul router di casa di {a}", "perso": "Da nessuna parte: va perso"})
        one_right(sample, lambda o: value(o) == "server", errors)
        return same_case(sample, "spento", errors)
    m = re.fullmatch(r"(\w+) scrive in una chat (a|ad) (\w+)(, che [^.]+)?\. Che strada fa il messaggio\?", text)
    if m:
        a, b = m.group(1), m.group(3)
        people(a, b, m.group(2), errors)
        value = labelled({
            "A-server-B": f"Dal telefono di {a} al server della chat, e da lì al telefono di {b}",
            "A-B": f"Dal telefono di {a} direttamente al telefono di {b}",
            "A-B-server": f"Dal telefono di {a} al telefono di {b}, che lo passa al server della chat",
            "server-A-B": f"Dal server della chat al telefono di {a}, e da lì al telefono di {b}",
        })
        one_right(sample, lambda o: value(o) == "A-server-B", errors)
        return same_case(sample, "percorso", errors)
    m = re.fullmatch(r"Il messaggio che (\w+) ha scritto (a|ad) (\w+) è arrivato al server della chat\. Come arriva al telefono di (\w+)\?", text)
    if m:
        a, b = m.group(1), m.group(3)
        people(a, b, m.group(2), errors)
        if m.group(4) != b:
            errors.append("the phone asked about is not the receiver's")
        value = labelled({
            "B chiede al server": f"Il client di {b} chiede al server se ci sono messaggi, e il server risponde con il messaggio",
            "server da solo": f"Il server lo manda al client di {b} senza che nessuno abbia chiesto niente",
            "A consegna": f"Il client di {a} lo consegna al client di {b}",
            "B chiede ad A": f"Il client di {b} lo chiede al client di {a}",
        })
        one_right(sample, lambda o: value(o) == "B chiede al server", errors)
        return same_case(sample, "chiede", errors)
    errors.append(f"level 4 text not recognised: {text!r}")
    return None


def level5(sample, errors):
    m = re.fullmatch(r"In quale di queste situazioni il modello è (peer-to-peer|client-server)\?", sample["problem"])
    if not m:
        errors.append(f"level 5 text not recognised: {sample['problem']!r}")
        return None
    kind = kind_of(MODELS)
    one_right(sample, lambda o: kind(o) == (m.group(1) == "peer-to-peer"), errors)
    return same_case(sample, m.group(1), errors)


def check(sample):
    errors = start(sample)
    if errors:
        return errors, None
    level = sample["level"]
    if level == 1:
        case = level1(sample, errors)
    elif level == 2:
        case = level2(sample, errors)
    elif level == 3:
        case = level3(sample, errors)
    elif level == 4:
        case = level4(sample, errors)
    elif level == 5:
        case = level5(sample, errors)
    elif level == 6:
        case = check_statements(sample, "sul modello client-server", STATEMENTS, errors)
    else:
        errors.append(f"unknown level {level}")
        case = None
    return errors, case
