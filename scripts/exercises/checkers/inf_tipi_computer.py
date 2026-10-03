"""Checker for inf-tipi-computer (specs/exercises/inf-tipi-computer.md).

Written from the spec and the lesson; the tables of the spec are typed again here and the answer is rebuilt from
the pieces read in the text:
- level 1: the job named in the question is looked up in the table of jobs and families;
- level 2: every option is an embedded system or not; the question says which one is asked;
- level 3: every option is a statement of the spec, true or false;
- level 4: the object and the part are read; the part is one of the object's sensors (input), one of its actuators
  (output), or one of the two parts of the microcontroller (CPU, memory).
"""
import re

from checkers._inf_architettura import check_text_choice, common, option_text, prep, prose_and_extra

FAMILIES = ["Supercomputer", "Server", "Personal computer", "Dispositivo mobile", "Sistema embedded"]
ROLES = ["Periferica di ingresso", "Periferica di uscita", "CPU", "Memoria"]

CASE_RANGES = {
    1: {f: (0.15, 0.25) for f in FAMILIES},
    2: {"embedded": (0.40, 0.60), "non-embedded": (0.40, 0.60)},
    3: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
    4: {"Periferica di ingresso": (0.28, 0.42), "Periferica di uscita": (0.28, 0.42), "CPU": (0.10, 0.21), "Memoria": (0.10, 0.21)},
}

JOBS = {
    "Supercomputer": [
        "calcolare le previsioni del tempo di tutta l'Europa",
        "simulare il clima della Terra nei prossimi cento anni",
        "simulare la nascita di una galassia",
        "studiare la forma di migliaia di proteine alla ricerca di un farmaco",
        "simulare l'aria che scorre attorno a un aereo in progetto",
        "simulare gli effetti di un terremoto su una città intera",
        "analizzare i dati di un grande esperimento di fisica",
        "simulare le correnti di tutto l'oceano Atlantico",
        "calcolare come si deforma una diga sotto la spinta di un lago",
        "simulare il traffico di una regione intera, auto per auto",
    ],
    "Server": [
        "rispondere a migliaia di studenti che aprono il registro elettronico",
        "conservare e consegnare la posta elettronica di tutta una scuola",
        "tenere in linea un sito web visitato giorno e notte",
        "far giocare in rete migliaia di giocatori nella stessa partita",
        "distribuire i film di un servizio di streaming",
        "conservare i file condivisi da tutti i computer di un ufficio",
        "registrare le prenotazioni dei treni fatte da tutta Italia",
        "tenere le pagine di una enciclopedia in rete a disposizione di chi le cerca",
        "ricevere e smistare i messaggi di una app di messaggistica",
        "conservare le copie di sicurezza delle foto di milioni di telefoni",
    ],
    "Personal computer": [
        "scrivere una relazione lunga con tastiera e schermo grande",
        "montare il video della gita con un programma di montaggio",
        "preparare a casa una presentazione per la classe",
        "lavorare per ore a un foglio di calcolo con molte colonne",
        "scrivere e provare i tuoi primi programmi",
        "impaginare il giornalino della scuola",
        "ritoccare le foto con un programma di grafica e un mouse",
        "disegnare la pianta di una casa con un programma di disegno tecnico",
        "comporre una canzone con tastiera musicale e casse collegate",
        "scrivere la tesina e stamparla",
    ],
    "Dispositivo mobile": [
        "fare una foto e mandarla agli amici mentre sei in autobus",
        "trovare la strada a piedi in una città che non conosci",
        "pagare alla cassa avvicinando il dispositivo al lettore",
        "leggere i messaggi durante l'intervallo",
        "contare i passi durante una corsa",
        "leggere un libro in treno su uno schermo da toccare",
        "fare una videochiamata da una panchina del parco",
        "ascoltare musica mentre cammini",
        "mostrare il biglietto al controllore sul treno",
        "guardare gli orari degli autobus alla fermata",
    ],
    "Sistema embedded": [
        "regolare la temperatura dell'acqua in una lavatrice",
        "accendere e spegnere le luci di un semaforo",
        "decidere quando gonfiare l'airbag di un'auto",
        "tenere un forno alla temperatura scelta",
        "accendere la caldaia quando la casa si raffredda",
        "portare un ascensore al piano richiesto",
        "dare il resto in un distributore di merendine",
        "tenere stabile in volo un drone",
        "comandare i getti di inchiostro di una stampante",
        "alzare la sbarra di un parcheggio quando il biglietto è pagato",
        "evitare che le ruote di un'auto si blocchino in frenata",
        "spegnere un ferro da stiro dimenticato acceso",
    ],
}
FAMILY_OF = {job: fam for fam, jobs in JOBS.items() for job in jobs}


def level1(sample, prose, errs):
    m = re.fullmatch(r"Quale tipo di computer è il più adatto per (.+)\?", prose) or re.fullmatch(r"Serve un computer per (.+)\. Di quale tipo sarà\?", prose)
    if not m or m.group(1) not in FAMILY_OF:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    family = FAMILY_OF[m.group(1)]
    check_text_choice(sample, family, set(FAMILIES), errs)
    return family


EMBEDDED = {
    "Il computer di bordo di una lavatrice",
    "La centralina dei freni di un'auto",
    "Il termostato di casa",
    "La scheda di un forno a microonde",
    "Il controllo di un ascensore",
    "La centralina di un semaforo",
    "Il telecomando del televisore",
    "La scheda di un distributore automatico",
    "Il controllo di volo di un drone",
    "La scheda di una stampante",
    "La scheda di una lavastoviglie",
    "Il computer di una bilancia elettronica",
    "La scheda di un cancello automatico",
    "Il controllo di un condizionatore",
}
GENERAL = {"Un portatile", "Un computer fisso", "Uno smartphone", "Un tablet", "Un server", "Un supercomputer"}


def one_of(sample, pool, everything, errs):
    texts = [option_text(o["latex"]) for o in sample["answer"]["options"]]
    right = [x for x in texts if x in pool]
    if len(right) != 1:
        errs.append(f"{len(right)} options fit the question: {texts}")
        return
    check_text_choice(sample, right[0], everything, errs)


def level2(sample, prose, errs):
    m = re.fullmatch(r"Quale di questi (non )?è un sistema embedded\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    ask_embedded = m.group(1) is None
    one_of(sample, EMBEDDED if ask_embedded else GENERAL, EMBEDDED | GENERAL, errs)
    return "embedded" if ask_embedded else "non-embedded"


TRUE = {
    "Un microcontrollore ha CPU, memoria e interfacce in un solo chip",
    "Anche un sistema embedded esegue un programma memorizzato",
    "Un supercomputer e un telefono hanno gli stessi quattro blocchi",
    "In un sistema embedded le periferiche sono sensori e attuatori",
    "Un server offre un servizio ad altri computer attraverso la rete",
    "Su un computer di uso generale si installano programmi nuovi",
    "Un supercomputer fa lavorare insieme migliaia di processori",
    "Uno smartphone è un computer di uso generale",
    "Un sistema embedded è dedicato a un compito solo",
    "La CPU di un dispositivo mobile è progettata per consumare poco",
}
FALSE = {
    "Un sistema embedded non ha una CPU",
    "Un supercomputer non ha memoria centrale",
    "Un microcontrollore non ha memoria",
    "Uno smartphone non è un computer",
    "Un sistema embedded non ha periferiche",
    "Un server è una periferica di ingresso",
    "Su una lavatrice si installano i programmi che si vogliono",
    "Solo i computer con tastiera e schermo hanno periferiche",
    "Un server deve avere per forza tastiera e schermo",
    "Un microcontrollore è più potente di un supercomputer",
    "Uno smartphone è un sistema embedded perché è piccolo",
    "Un sistema embedded non esegue nessun programma",
}


def level3(sample, prose, errs):
    m = re.fullmatch(r"Quale di queste affermazioni sui tipi di computer è (vera|falsa)\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    one_of(sample, TRUE if m.group(1) == "vera" else FALSE, TRUE | FALSE, errs)
    return m.group(1)


# object: (sensors and controls, actuators and signals)
SYSTEMS = {
    "una lavatrice": (["il sensore di temperatura dell'acqua", "la manopola dei programmi", "il sensore del livello dell'acqua"], ["il motore del cestello", "la resistenza che scalda l'acqua", "la spia di fine lavaggio"]),
    "un semaforo": (["il pulsante per i pedoni", "il sensore che rileva le auto in attesa"], ["le lampade rossa, gialla e verde", "il segnale acustico per i pedoni"]),
    "un termostato": (["il sensore di temperatura della stanza", "i tasti per scegliere la temperatura"], ["l'interruttore che accende la caldaia", "il piccolo schermo con la temperatura"]),
    "l'impianto dei freni di un'auto": (["i sensori di velocità delle ruote", "il sensore del pedale del freno"], ["le valvole che regolano la frenata", "la spia sul cruscotto"]),
    "un forno a microonde": (["il tastierino del tempo di cottura", "il sensore dello sportello"], ["il generatore di microonde", "il motore del piatto", "il segnale acustico di fine cottura"]),
    "un ascensore": (["i pulsanti dei piani", "il sensore delle porte"], ["il motore della cabina", "il display del piano"]),
    "un distributore di merendine": (["la gettoniera che riconosce le monete", "il tastierino per scegliere il prodotto"], ["il motore che fa cadere il prodotto", "il display del credito"]),
    "un drone": (["il giroscopio che misura l'inclinazione", "il ricevitore dei comandi del radiocomando"], ["i motori delle eliche", "le luci di posizione"]),
    "un cancello automatico": (["il ricevitore del telecomando", "la fotocellula che rileva un ostacolo"], ["il motore che apre il cancello", "il lampeggiante"]),
    "una lavastoviglie": (["il sensore che misura la temperatura dell'acqua", "i tasti del programma"], ["la pompa dell'acqua", "la resistenza che asciuga i piatti"]),
    "una stampante": (["il sensore che rileva la carta", "i tasti del pannello"], ["il motore che trascina il foglio", "le testine che spruzzano l'inchiostro"]),
    "un condizionatore": (["il sensore di temperatura dell'aria", "il ricevitore del telecomando"], ["il compressore", "la ventola"]),
    "un frigorifero": (["il sensore della temperatura interna", "il sensore della porta aperta"], ["il compressore", "il segnale acustico della porta aperta"]),
    "una bilancia elettronica": (["il sensore di peso", "il tasto per azzerare"], ["il display del peso"]),
    "un robot aspirapolvere": (["i sensori di urto", "il sensore che rileva i gradini"], ["i motori delle ruote", "il motore della spazzola"]),
    "una serra automatica": (["il sensore di umidità del terreno", "il sensore di luce"], ["la pompa dell'irrigazione", "il motore che apre le finestre"]),
    "una sveglia digitale": (["i tasti per regolare l'ora"], ["il display dell'ora", "il cicalino"]),
}


def level4(sample, prose, errs):
    for where, (inputs, outputs) in SYSTEMS.items():
        head = f"Nel sistema embedded {prep('di', where)}, a quale parte dello schema di von Neumann "
        if not prose.startswith(head):
            continue
        m = re.fullmatch(r"(corrisponde|corrispondono) (.+)\?", prose[len(head):])
        if not m:
            break
        part = m.group(2)
        if part in inputs:
            role = ROLES[0]
        elif part in outputs:
            role = ROLES[1]
        elif part == "la parte del microcontrollore che esegue le istruzioni":
            role = ROLES[2]
        elif part == "la parte del microcontrollore che conserva il programma":
            role = ROLES[3]
        else:
            errs.append(f"{part!r} is not a part of {where}")
            return None
        if (part.split(" ")[0] in ("le", "i", "gli")) != (m.group(1) == "corrispondono"):
            errs.append("verb does not agree with the part")
        check_text_choice(sample, role, set(ROLES), errs)
        return role
    errs.append(f"level 4 text not recognised: {prose!r}")
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
    fn = {1: level1, 2: level2, 3: level3, 4: level4}.get(lvl)
    if fn is None:
        return [f"unknown level {lvl}"], None
    kind = fn(sample, prose, errs)
    if kind is not None and sample["params"].get("case") != kind:
        errs.append(f"params.case {sample['params'].get('case')!r} but the problem is {kind!r}")
    return errs, kind
