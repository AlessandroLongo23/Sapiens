"""Checker for formati-multimediali (specs/exercises/formati-multimediali.md).

Written from the spec and the lesson, not from the generator:
- level 1: the extension is read from the file name of the text, and its family from the table here;
- level 2: the first bytes of the text are compared with the signatures here, whatever the name says; or the table
  of the situations about renaming;
- level 3: each need is a condition on the properties of the formats, kept here in a table of their own: exactly one
  option must satisfy it;
- level 4: the table of the purposes;
- level 5: the table of the statements.
"""
import re

from checkers._inf_sic import check_choice, check_situation, check_statements, common, has_name

CASE_RANGES = {
    1: {"immagine": (0.24, 0.39), "audio": (0.12, 0.26), "video": (0.18, 0.32), "documento": (0.18, 0.32)},
    2: {"rinominato": (0.44, 0.61), "coerente": (0.11, 0.24)},
    5: {"vera": (0.42, 0.58), "falsa": (0.42, 0.58)},
}

FAMILIES = {"immagine": "Un'immagine", "audio": "Un suono", "video": "Un video", "documento": "Un documento di testo"}
EXTENSIONS = {
    "jpg": "immagine", "png": "immagine", "gif": "immagine", "svg": "immagine", "webp": "immagine",
    "wav": "audio", "mp3": "audio", "flac": "audio",
    "mp4": "video", "webm": "video", "mkv": "video", "avi": "video",
    "txt": "documento", "odt": "documento", "pdf": "documento", "docx": "documento",
}

# the first bytes -> (extension, label of the option)
SIGNATURES = {
    "89 50 4E 47": ("png", "Un'immagine PNG"),
    "FF D8 FF": ("jpg", "Un'immagine JPEG"),
    "47 49 46 38": ("gif", "Un'immagine GIF"),
    "25 50 44 46": ("pdf", "Un documento PDF"),
}
TABLE = "Le firme: PNG 89 50 4E 47, JPEG FF D8 FF, GIF 47 49 46 38, PDF 25 50 44 46."

RENAMES = {
    "rinomina": ("cambia il nome del file in gita.png", "Solo il nome"),
    "converti": ("vuole la stessa immagine in PNG", "esportarla in PNG"),
    "non-apre": ("fa doppio clic", "non riesce a leggerlo"),
    "ritorno": ("di nuovo in FLAC", "Ha la qualità dell'MP3"),
}

# format -> its properties, from the tables of the lesson
P = dict
FORMATS = {
    "JPEG": P(kind="immagine", compression={"con"}, alpha="no", animation=False, vector=False),
    "PNG": P(kind="immagine", compression={"senza"}, alpha="sfumata", animation=False, vector=False),
    "GIF": P(kind="immagine", compression={"senza"}, alpha="netta", animation=True, vector=False),
    "BMP": P(kind="immagine", compression=set(), alpha="no", animation=False, vector=False),
    "WebP": P(kind="immagine", compression={"con", "senza"}, alpha="sfumata", animation=True, vector=False),
    "SVG": P(kind="immagine", compression=set(), alpha="sfumata", animation=True, vector=True),
    "WAV": P(kind="audio", compression=set()),
    "FLAC": P(kind="audio", compression={"senza"}),
    "MP3": P(kind="audio", compression={"con"}),
    "AAC": P(kind="audio", compression={"con"}),
    "Opus": P(kind="audio", compression={"con"}),
    "TXT": P(kind="documento", holds="caratteri"),
    "ODT": P(kind="documento", holds="modificabile"),
    "DOCX": P(kind="documento", holds="modificabile"),
    "PDF": P(kind="documento", holds="pagine"),
    "MP4": P(kind="contenitore"), "WebM": P(kind="contenitore"), "MKV": P(kind="contenitore"),
}
image = lambda f: f["kind"] == "immagine" and not f["vector"]
# need -> (words of the text, the condition a format must satisfy)
NEEDS = {
    "perdita": ("immagine con perdita", lambda f: image(f) and f["compression"] == {"con"}),
    "sfumata": ("ogni pixel abbia il suo grado di trasparenza", lambda f: image(f) and f["compression"] == {"senza"} and f["alpha"] == "sfumata"),
    "animazione": ("contenere un'animazione", lambda f: image(f) and f["animation"]),
    "vettoriale": ("con delle forme, e non con dei pixel", lambda f: f.get("vector") is True),
    "nessuna": ("senza nessuna compressione", lambda f: image(f) and not f["compression"]),
    "tutto": ("con o senza perdita, e che abbia trasparenza e animazione", lambda f: image(f) and f["compression"] == {"con", "senza"} and f["alpha"] == "sfumata" and f["animation"]),
    "audio-senza": ("audio compresso, ma senza perdita", lambda f: f["kind"] == "audio" and f["compression"] == {"senza"}),
    "audio-non": ("audio che di solito non è compresso", lambda f: f["kind"] == "audio" and not f["compression"]),
    "pagine": ("conservi le pagine", lambda f: f.get("holds") == "pagine"),
    "caratteri": ("solo i caratteri", lambda f: f.get("holds") == "caratteri"),
    "contenitore": ("una traccia video, una traccia audio e i sottotitoli", lambda f: f["kind"] == "contenitore"),
}

PURPOSES = {
    "foto": ("venti fotografie", "JPEG: la perdita si nasconde"),
    "logo": ("logo del torneo", "SVG: è fatto di forme"),
    "schermata": ("schermata piena di testo", "PNG: senza perdita il testo resta nitido"),
    "animazione": ("breve animazione", "GIF: tiene più immagini"),
    "trasparenza": ("senza il rettangolo bianco", "PNG: ogni pixel ha il suo grado di trasparenza"),
    "consegna": ("mandarla alla professoressa", "PDF: conserva le pagine"),
    "bozza": ("devono ancora correggere", "ODT o DOCX"),
    "archivio": ("alla qualità originale", "FLAC: comprime senza perdita"),
    "vocale": ("pochi dati sul telefono", "MP3: con perdita"),
    "vent-anni": ("tra vent'anni", "Un formato aperto"),
}

STATEMENTS = {
    "t-contenitore": (True, "indica il contenitore, non le codifiche"),
    "t-codec": (True, "non riuscire ad aprirne un altro"),
    "t-tracce": (True, "tenere insieme video, audio e sottotitoli"),
    "t-aperto": (True, "chiunque può leggere le regole"),
    "t-aperto-perdita": (True, "può essere compresso con perdita"),
    "t-docx": (True, "è un archivio compresso"),
    "t-firma": (True, "dai primi byte"),
    "t-codec-nome": (True, "codifica i dati quando si salva"),
    "f-mp4": (False, "la stessa codifica video"),
    "f-gratis": (False, "sono gratuiti"),
    "f-estensione": (False, "se ne cambia il formato"),
    "f-proprietario": (False, "aprire per sempre"),
    "f-senza": (False, "sempre senza compressione"),
    "f-wav": (False, "si recupera il suono"),
    "f-codec": (False, "la parte del nome del file dopo il punto"),
    "f-una-traccia": (False, "una sola traccia"),
}


def level1(sample, errs):
    problem = sample["problem"]
    m = re.fullmatch(r"(\w+) riceve un file che si chiama (\w+)\.(\w+) e non è stato rinominato\. Che cosa contiene\?", problem)
    if not m or not has_name(problem):
        errs.append(f"level 1 text not recognised: {problem!r}")
        return None
    family = EXTENSIONS.get(m.group(3))
    if family is None:
        errs.append(f"unknown extension {m.group(3)!r}")
        return None

    def right(o):
        if FAMILIES.get(o["values"][0]) != o["latex"]:
            raise ValueError(f"option {o['latex']!r} is not the family {o['values'][0]!r}")
        return o["values"][0] == family

    check_choice(sample, right, errs)
    return family


def level2(sample, errs):
    problem, params = sample["problem"], sample["params"]
    m = re.fullmatch(rf"(\w+) riceve un file che si chiama (\w+)\.(\w+)\. I suoi primi byte, in esadecimale, sono ([0-9A-F ]+)\. {re.escape(TABLE)} Che cosa contiene il file\?", problem)
    if not m:
        return check_situation(sample, RENAMES, errs)
    if not has_name(problem):
        errs.append("no known name in the text")
    found = [v for sig, v in SIGNATURES.items() if m.group(4).startswith(sig)]
    if len(found) != 1:
        errs.append(f"the bytes {m.group(4)!r} fit {len(found)} signatures")
        return None
    ext, label = found[0]
    if (params.get("ext"), params.get("real")) != (m.group(3), ext):
        errs.append("params do not carry the extension of the name and the real format")
    labels = dict(SIGNATURES.values())

    def right(o):
        if labels.get(o["values"][0]) != o["latex"]:
            raise ValueError(f"option {o['latex']!r} is not the format {o['values'][0]!r}")
        return o["values"][0] == ext

    check_choice(sample, right, errs)
    return "coerente" if m.group(3) == ext else "rinominato"


def level3(sample, errs):
    problem = sample["problem"]
    need = sample["params"].get("case")
    if need not in NEEDS:
        errs.append(f"unknown need {need!r}")
        return None
    words, fits = NEEDS[need]
    if words not in problem or not has_name(problem) or not problem.endswith(". Quale di questi fa al caso?"):
        errs.append(f"need {need} does not say {words!r}")
    fitting = [k for k, (w, _) in NEEDS.items() if w in problem]
    if fitting != [need]:
        errs.append(f"the text fits the needs {fitting}")

    def right(o):
        if o["latex"] not in FORMATS:
            raise ValueError(f"unknown format {o['latex']!r}")
        return fits(FORMATS[o["latex"]])

    check_choice(sample, right, errs)
    return need


def check(sample):
    errs = []
    if common(sample, errs) is None or errs:
        return errs, None
    lvl = sample["level"]
    kind = None
    try:
        if lvl == 1:
            kind = level1(sample, errs)
        elif lvl == 2:
            kind = level2(sample, errs)
        elif lvl == 3:
            kind = level3(sample, errs)
        elif lvl == 4:
            kind = check_situation(sample, PURPOSES, errs)
        elif lvl == 5:
            kind = check_statements(sample, "sui formati", STATEMENTS, errs)
        else:
            errs.append(f"unknown level {lvl}")
    except ValueError as e:
        errs.append(str(e))
    if kind is not None and sample["params"].get("case") != kind:
        errs.append("wrong case in params")
    return errs, kind
