/**
 * I formati dei file multimediali. Spec: specs/exercises/formati-multimediali.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/82-formati-multimediali.md), all multiple choice
 * of texts: 1. what kind of content an extension stands for, whatever the rest of the name says; 2. name against
 * content: the signature in the first bytes, and what renaming does; 3. the format that has the properties asked
 * for; 4. the format for a purpose, with its reason; 5. statements about containers, codecs and open formats.
 */
import type { Rng } from '../types';
import { choose, makeGenerator, shuffle, textOption, type Built } from '../inf-programmi';
import { NAMES, asked, situationLevel, sortLevel, statementLevel, type Situation, type Statement } from '../inf-sic';

export const ID = 'formati-multimediali';

// ---------------------------------------------------------------------------
// Level 1: what is in the file

const FAMILIES = {
	immagine: "Un'immagine",
	audio: 'Un suono',
	video: 'Un video',
	documento: 'Un documento di testo'
} as const;
type Family = keyof typeof FAMILIES;

const EXTENSIONS: Record<Family, string[]> = {
	immagine: ['jpg', 'png', 'gif', 'svg', 'webp'],
	audio: ['wav', 'mp3', 'flac'],
	video: ['mp4', 'webm', 'mkv', 'avi'],
	documento: ['txt', 'odt', 'pdf', 'docx']
};
/** Names that say nothing, and names that point to another family: the extension decides. */
const BASES = ['gita', 'musica', 'foto', 'filmato', 'appunti', 'lezione'];
const FILES = (Object.keys(EXTENSIONS) as Family[]).flatMap((family) => EXTENSIONS[family].flatMap((ext) => BASES.map((base) => [family, (N: string) => `${N} riceve un file che si chiama ${base}.${ext} e non è stato rinominato.`] as const)));
const FAMILY_WHY: Record<Family, string> = {
	immagine: "Conta l'estensione, la parte del nome dopo l'ultimo punto: jpg, png, gif, svg e webp sono formati di immagini.",
	audio: "Conta l'estensione, la parte del nome dopo l'ultimo punto: wav, mp3 e flac sono formati audio.",
	video: "Conta l'estensione, la parte del nome dopo l'ultimo punto: mp4, webm, mkv e avi sono contenitori video.",
	documento: "Conta l'estensione, la parte del nome dopo l'ultimo punto: txt, odt, pdf e docx sono formati di documenti."
};

// ---------------------------------------------------------------------------
// Level 2: name and content

const SIGNATURES = [
	{ ext: 'png', bytes: '89 50 4E 47', label: "Un'immagine PNG", why: 'I byte 50 4E 47 sono le lettere P, N, G.' },
	{ ext: 'jpg', bytes: 'FF D8 FF E0', label: "Un'immagine JPEG", why: 'Un file JPEG comincia sempre con FF D8 FF.' },
	{ ext: 'gif', bytes: '47 49 46 38', label: "Un'immagine GIF", why: 'I byte 47 49 46 sono le lettere G, I, F.' },
	{ ext: 'pdf', bytes: '25 50 44 46', label: 'Un documento PDF', why: 'I byte 50 44 46 sono le lettere P, D, F.' }
] as const;
const TABLE = 'Le firme: PNG 89 50 4E 47, JPEG FF D8 FF, GIF 47 49 46 38, PDF 25 50 44 46.';

const RENAMES: Situation[] = [
	{
		id: 'rinomina',
		text: (N) => `${N} vuole una versione PNG di gita.jpg e cambia il nome del file in gita.png.`,
		ask: 'Che cosa è cambiato nel file?',
		right: 'Solo il nome: i byte sono ancora quelli di un JPEG',
		wrong: ['Il formato: ora i byte sono quelli di un PNG', 'La qualità: ora è senza perdita', 'La dimensione: un PNG pesa di più', "Niente: il sistema rifiuta di cambiare un'estensione"],
		why: ["L'estensione è un pezzo del nome: cambiarla non tocca i byte.", 'Per avere un PNG serve una conversione, con un programma che legga il JPEG e lo riscriva con le regole del PNG.']
	},
	{
		id: 'converti',
		text: (N) => `${N} ha una foto in JPEG e vuole la stessa immagine in PNG.`,
		ask: 'Che cosa deve fare?',
		right: 'Aprirla con un programma di grafica ed esportarla in PNG',
		wrong: ["Cambiare l'estensione del file da .jpg a .png", 'Togliere l\'estensione dal nome del file', 'Metterla in un archivio compresso', 'Copiarla in una cartella che si chiama PNG'],
		why: ['Cambiare formato vuol dire riscrivere i dati con altre regole: si chiama conversione.', 'La fa un programma, con "Esporta" o "Salva con nome". Cambiare il nome non converte niente.']
	},
	{
		id: 'non-apre',
		text: (N) => `${N} rinomina canzone.mp3 in canzone.jpg e fa doppio clic sul file.`,
		ask: 'Che cosa succede?',
		right: "Si apre il programma delle immagini, che non riesce a leggerlo",
		wrong: ["Si vede la copertina dell'album", 'Il brano parte come prima', 'Il file diventa una fotografia', 'Il sistema riconverte da solo il file in MP3'],
		why: ["Il sistema sceglie il programma guardando l'estensione, e chiama quello delle immagini.", 'Dentro il file ci sono ancora i byte di un MP3, che quel programma non sa leggere.']
	},
	{
		id: 'ritorno',
		text: (N) => `${N} converte un brano da FLAC a MP3, cancella il FLAC, e poi converte l'MP3 di nuovo in FLAC.`,
		ask: "Com'è il FLAC ottenuto alla fine?",
		right: "Ha la qualità dell'MP3: i dati buttati via non tornano",
		wrong: ['È identico al FLAC di partenza', "È più piccolo dell'MP3", 'Ha una qualità migliore del FLAC di partenza', 'Non si può aprire'],
		why: ["L'MP3 è compresso con perdita: una parte dei dati è stata eliminata per sempre.", 'Riconvertire in un formato senza perdita conserva quello che è rimasto, e nient\'altro: il file cresce, la qualità no.']
	}
];

function level2(rng: Rng): Built {
	if (rng.next() < 0.3) return situationLevel(rng, 'Distingui il nome dal contenuto.', RENAMES);
	const real = rng.pick(SIGNATURES);
	const named = rng.pick(SIGNATURES);
	const base = rng.pick(BASES), name = rng.pick(NAMES);
	const o = (s: (typeof SIGNATURES)[number]) => textOption(s.label, s.ext);
	const answer = choose(
		rng,
		o(real),
		SIGNATURES.filter((s) => s !== real).map(o)
	);
	return asked('Riconosci il formato dalla firma.', `${name} riceve un file che si chiama ${base}.${named.ext}. I suoi primi byte, in esadecimale, sono ${real.bytes}. ${TABLE} Che cosa contiene il file?`, answer, [`Conta la firma, cioè i primi byte, non il nome. ${real.why}`, named === real ? "Qui nome e contenuto vanno d'accordo." : `L'estensione ${named.ext} è solo un pezzo del nome: il file è stato rinominato, e dentro è rimasto quello che era.`], { case: named === real ? 'coerente' : 'rinominato', name, base, ext: named.ext, real: real.ext });
}

// ---------------------------------------------------------------------------
// Level 3: the format with these properties

const NEEDS: { id: string; need: string; right: string[]; wrong: string[]; why: string }[] = [
	{ id: 'perdita', need: 'cerca un formato di immagine con perdita, per far pesare poco una fotografia', right: ['JPEG'], wrong: ['PNG', 'GIF', 'BMP', 'SVG'], why: 'Tra questi solo JPEG comprime con perdita: PNG e GIF sono senza perdita, BMP non comprime, SVG è vettoriale.' },
	{ id: 'sfumata', need: 'cerca un formato di immagine senza perdita in cui ogni pixel abbia il suo grado di trasparenza', right: ['PNG'], wrong: ['JPEG', 'BMP', 'GIF'], why: 'PNG è senza perdita e ha la trasparenza sfumata. JPEG e BMP non hanno trasparenza; in un GIF un pixel è trasparente oppure no.' },
	{ id: 'animazione', need: "cerca un formato di immagine che possa contenere un'animazione", right: ['GIF'], wrong: ['JPEG', 'PNG', 'BMP'], why: 'Tra questi solo GIF può tenere più immagini in fila nello stesso file.' },
	{ id: 'vettoriale', need: 'cerca un formato che descriva il disegno con delle forme, e non con dei pixel', right: ['SVG'], wrong: ['JPEG', 'PNG', 'GIF', 'BMP', 'WebP'], why: 'SVG è un formato vettoriale: contiene le forme. Tutti gli altri sono formati bitmap.' },
	{ id: 'nessuna', need: 'cerca un formato di immagine che scriva i pixel così come sono, senza nessuna compressione', right: ['BMP'], wrong: ['JPEG', 'PNG', 'GIF', 'WebP'], why: 'BMP non comprime: per questo i suoi file sono enormi. Gli altri comprimono, con o senza perdita.' },
	{ id: 'tutto', need: 'cerca un formato di immagine che possa essere con o senza perdita, e che abbia trasparenza e animazione', right: ['WebP'], wrong: ['JPEG', 'PNG', 'GIF', 'BMP'], why: 'WebP ha le due compressioni, la trasparenza e l\'animazione. A JPEG mancano trasparenza e animazione, a PNG l\'animazione, a GIF la compressione con perdita.' },
	{ id: 'audio-senza', need: 'cerca un formato audio compresso, ma senza perdita', right: ['FLAC'], wrong: ['MP3', 'AAC', 'Opus', 'WAV'], why: 'FLAC comprime senza perdita. MP3, AAC e Opus sono con perdita; WAV di solito non è compresso.' },
	{ id: 'audio-non', need: 'cerca un formato audio che di solito non è compresso, per lavorare sul suono', right: ['WAV'], wrong: ['MP3', 'FLAC', 'AAC', 'Opus'], why: 'WAV di solito contiene i campioni così come sono. Gli altri sono tutti compressi.' },
	{ id: 'pagine', need: 'cerca un formato di documento che conservi le pagine così come vanno stampate', right: ['PDF'], wrong: ['TXT', 'ODT', 'DOCX'], why: 'PDF conserva le pagine impaginate. TXT ha solo i caratteri; ODT e DOCX sono fatti per essere modificati.' },
	{ id: 'caratteri', need: 'cerca un formato di documento che contenga solo i caratteri, senza stili né immagini', right: ['TXT'], wrong: ['PDF', 'ODT', 'DOCX'], why: 'TXT contiene solo i caratteri. Gli altri conservano anche stili, immagini e impaginazione.' },
	{ id: 'contenitore', need: 'cerca un formato che tenga insieme una traccia video, una traccia audio e i sottotitoli', right: ['MP4', 'WebM', 'MKV'], wrong: ['JPEG', 'MP3', 'FLAC', 'PNG', 'PDF', 'WAV'], why: 'Serve un contenitore video, come MP4, WebM o MKV. Gli altri formati contengono una cosa sola: un\'immagine, un suono, un documento.' }
];

function level3(rng: Rng): Built {
	const need = rng.pick(NEEDS);
	const name = rng.pick(NAMES);
	const right = rng.pick(need.right);
	const wrong = shuffle(rng, need.wrong).slice(0, 3);
	const answer = choose(
		rng,
		textOption(right),
		wrong.map((w) => textOption(w))
	);
	return asked('Trova il formato con le proprietà richieste.', `${name} ${need.need}. Quale di questi fa al caso?`, answer, [need.why], { case: need.id, name, options: [right, ...wrong].sort() });
}

// ---------------------------------------------------------------------------
// Level 4: the format for a purpose

const PURPOSES: Situation[] = [
	{
		id: 'foto',
		text: (N) => `${N} deve mettere sul sito della scuola venti fotografie della gita, che si carichino in fretta.`,
		ask: 'Quale formato conviene, e perché?',
		right: 'JPEG: la perdita si nasconde nelle sfumature e i file pesano poco',
		wrong: ['PNG: senza perdita i file di una foto sono più piccoli', 'GIF: 256 colori bastano per una fotografia', 'SVG: una foto in vettoriale resta sempre netta', 'BMP: senza compressione si carica prima'],
		why: ['Una fotografia ha milioni di colori e sfumature, dove la compressione con perdita non si nota.', 'JPEG la riduce a una frazione del peso; in PNG o in BMP la stessa foto peserebbe molte volte di più.']
	},
	{
		id: 'logo',
		text: (N) => `${N} ha disegnato il logo del torneo, fatto di poche forme a colori piatti, che servirà sulle magliette e sul sito.`,
		ask: 'Quale formato conviene, e perché?',
		right: 'SVG: è fatto di forme e resta netto a ogni dimensione',
		wrong: ['JPEG: è il formato con più colori', 'JPEG: attorno ai bordi netti non lascia aloni', 'GIF: si può ingrandire senza sgranare', 'BMP: senza compressione non perde niente quando si ingrandisce'],
		why: ['Un logo è un disegno di forme e deve servire a molte dimensioni.', 'In SVG resta netto sulla maglietta come sul sito; JPEG lascerebbe aloni attorno ai bordi, e ogni bitmap ingrandita si sgrana.']
	},
	{
		id: 'schermata',
		text: (N) => `${N} deve mettere nella relazione una schermata piena di testo piccolo.`,
		ask: 'Quale formato conviene, e perché?',
		right: 'PNG: senza perdita il testo resta nitido',
		wrong: ['JPEG: è fatto apposta per il testo', 'JPEG: con la perdita il testo diventa più leggibile', 'SVG: una schermata è un disegno di forme', 'GIF: ha più colori di PNG'],
		why: ['Una schermata ha bordi netti e grandi zone di un colore solo.', 'Senza perdita il testo resta nitido e le zone uniformi si comprimono bene; JPEG lascerebbe aloni attorno alle lettere.']
	},
	{
		id: 'animazione',
		text: (N) => `${N} vuole mandare in chat una breve animazione di pochi fotogrammi, senza audio, che si apra su qualunque dispositivo.`,
		ask: 'Quale formato conviene, e perché?',
		right: 'GIF: tiene più immagini in fila e si apre ovunque',
		wrong: ['JPEG: contiene tutte le immagini che servono', 'PNG: senza perdita le animazioni sono più fluide', 'BMP: senza compressione i fotogrammi scorrono prima', 'TXT: pesa pochissimo'],
		why: ['Serve un formato di immagine che possa contenere più immagini in sequenza.', 'GIF lo fa, e lo aprono tutti i programmi; JPEG, PNG e BMP contengono un\'immagine sola.']
	},
	{
		id: 'trasparenza',
		text: (N) => `${N} deve appoggiare lo stemma della classe su una locandina colorata, senza il rettangolo bianco attorno.`,
		ask: 'Quale formato conviene, e perché?',
		right: 'PNG: ogni pixel ha il suo grado di trasparenza',
		wrong: ['JPEG: il bianco diventa trasparente da solo', 'JPEG: ha la trasparenza e pesa meno', 'BMP: senza compressione lo sfondo sparisce', 'JPEG ad alta qualità: il rettangolo non si nota'],
		why: ['Serve un formato con la trasparenza, che dica per ogni pixel quanto lascia vedere lo sfondo.', 'PNG ce l\'ha; JPEG e BMP no, e riempiono il vuoto con un colore.']
	},
	{
		id: 'consegna',
		text: (N) => `${N} ha finito la relazione di scienze e deve mandarla alla professoressa, che la leggerà dal telefono.`,
		ask: 'Quale formato conviene, e perché?',
		right: 'PDF: conserva le pagine e si apre allo stesso modo ovunque',
		wrong: ['TXT: conserva anche le immagini e i titoli', 'DOCX: non si può modificare per sbaglio', 'JPEG: una pagina è un\'immagine', 'ODT: è il formato dei documenti finiti'],
		why: ['Un documento finito, da leggere così come è stato impaginato, si consegna in PDF.', 'Il file modificabile, ODT o DOCX, lo tieni per te: servirà per le correzioni.']
	},
	{
		id: 'bozza',
		text: (N) => `${N} sta scrivendo il giornalino con due compagni, che devono ancora correggere e aggiungere articoli.`,
		ask: 'In quale formato conviene passarsi il file?',
		right: 'ODT o DOCX: sono fatti per continuare a modificare',
		wrong: ['PDF: è il formato più comodo da correggere', 'JPEG: così nessuno rovina l\'impaginazione', 'TXT: conserva stili e immagini', 'MP4: è un contenitore'],
		why: ['Finché il documento è in lavorazione serve un formato modificabile.', 'ODT e DOCX conservano testo, stili e immagini in una forma che si può cambiare; il PDF è per il documento finito.']
	},
	{
		id: 'archivio',
		text: (N) => `${N} registra il concerto della scuola e vuole conservare l'audio alla qualità originale, occupando meno spazio possibile.`,
		ask: 'Quale formato conviene, e perché?',
		right: 'FLAC: comprime senza perdita',
		wrong: ['MP3: è senza perdita e pesa poco', 'WAV: è il più compresso', 'MP3 alla qualità più alta: non perde niente', 'AAC: restituisce i campioni esatti'],
		why: ['Per conservare la qualità originale serve una compressione senza perdita.', 'FLAC la applica e dimezza circa lo spazio; MP3 e AAC buttano via una parte del suono, WAV non comprime.']
	},
	{
		id: 'vocale',
		text: (N) => `${N} deve mandare la registrazione di un'intervista di mezz'ora a un compagno che ha pochi dati sul telefono.`,
		ask: 'Quale formato conviene, e perché?',
		right: 'MP3: con perdita, pesa circa un decimo',
		wrong: ['WAV: non essendo compresso, pesa meno', 'FLAC: è il più leggero di tutti', 'BMP: è senza compressione', 'WAV: è con perdita'],
		why: ['Qui conta il peso, e la voce di un\'intervista sopporta bene la compressione con perdita.', 'Un formato con perdita come MP3 porta il file a circa un decimo; WAV e FLAC peserebbero molto di più.']
	},
	{
		id: 'vent-anni',
		text: (N) => `${N} vuole conservare i temi del liceo in modo da poterli aprire anche tra vent'anni, con qualunque programma.`,
		ask: 'Che tipo di formato conviene?',
		right: 'Un formato aperto: chiunque può scrivere un programma che lo legge',
		wrong: ['Il formato proprietario del programma più recente', 'Un formato qualunque, purché compresso con perdita', 'Un formato proprietario: è garantito dall\'azienda', 'Un formato senza estensione'],
		why: ['Un formato aperto ha regole pubbliche: non dipende da un programma solo.', 'Un formato proprietario si apre finché l\'azienda mantiene il suo programma.']
	}
];

// ---------------------------------------------------------------------------
// Level 5: statements

const TRUE: Statement[] = [
	{ id: 't-contenitore', text: "L'estensione di un video indica il contenitore, non le codifiche delle tracce", why: 'È vero: due file con la stessa estensione possono avere dentro codifiche diverse.' },
	{ id: 't-codec', text: 'Un lettore può aprire un file MP4 e non riuscire ad aprirne un altro', why: 'È vero: dipende dalle codifiche delle tracce, che il lettore deve conoscere.' },
	{ id: 't-tracce', text: 'Un contenitore può tenere insieme video, audio e sottotitoli', why: 'È vero: è un formato che impacchetta più tracce e le tiene sincronizzate.' },
	{ id: 't-aperto', text: 'Di un formato aperto chiunque può leggere le regole e scrivere un programma che lo apre', why: 'È vero: le regole di un formato aperto sono pubbliche.' },
	{ id: 't-aperto-perdita', text: 'Un formato aperto può essere compresso con perdita', why: 'È vero: "aperto" riguarda le regole del formato, non la qualità dei dati.' },
	{ id: 't-docx', text: 'Un file DOCX o ODT è un archivio compresso con dentro il testo e le immagini', why: 'È vero: per questo i suoi primi byte sono quelli di un archivio ZIP.' },
	{ id: 't-firma', text: 'Molti formati si riconoscono dai primi byte del file, qualunque sia il nome', why: 'È vero: quei byte sono la firma del formato.' },
	{ id: 't-codec-nome', text: 'Il codec codifica i dati quando si salva e li decodifica quando si riproduce', why: 'È vero: il nome viene da codificatore e decodificatore.' }
];
const FALSE: Statement[] = [
	{ id: 'f-mp4', text: 'Tutti i file con estensione mp4 hanno dentro la stessa codifica video', why: "L'estensione indica il contenitore: le codifiche dentro possono essere diverse." },
	{ id: 'f-gratis', text: 'Formato aperto vuol dire che i programmi che lo usano sono gratuiti', why: '"Aperto" riguarda le regole del formato, non il prezzo dei programmi.' },
	{ id: 'f-estensione', text: "Cambiando l'estensione di un file se ne cambia il formato", why: "L'estensione è un pezzo del nome: i byte restano quelli di prima." },
	{ id: 'f-proprietario', text: 'Un formato proprietario si potrà aprire per sempre, perché appartiene a un\'azienda', why: "Un formato proprietario dipende da un programma solo: se l'azienda lo abbandona, il file rischia di restare chiuso." },
	{ id: 'f-senza', text: 'Un formato aperto è sempre senza compressione', why: 'Esistono formati aperti senza compressione, senza perdita e con perdita.' },
	{ id: 'f-wav', text: 'Convertendo un MP3 in WAV si recupera il suono che era stato eliminato', why: 'I dati eliminati dalla compressione con perdita non ci sono più.' },
	{ id: 'f-codec', text: 'Il codec è la parte del nome del file dopo il punto', why: "Quella è l'estensione. Il codec è il programma che codifica e decodifica i dati di una traccia." },
	{ id: 'f-una-traccia', text: 'Un contenitore video contiene una sola traccia', why: 'Un contenitore tiene insieme più tracce: video, audio, sottotitoli.' }
];

export default makeGenerator(ID, 'I formati dei file multimediali', {
	1: { label: 'Che cosa c\'è nel file', constraints: ['a file name of a base and an extension; options: an image, a sound, a video, a text document', 'the base may point to another family: the extension decides'], build: (rng) => sortLevel(rng, "Riconosci il contenuto dall'estensione.", 'Che cosa contiene?', FAMILIES, FILES, FAMILY_WHY) },
	2: { label: 'Il nome o il contenuto', constraints: ['7 in 10: a file name and its first bytes, with the table of the four signatures in the text; the answer follows the bytes', '3 in 10: a situation about renaming and converting'], build: level2 },
	3: { label: 'Il formato con queste proprietà', constraints: ['a need written with the properties of the table of the lesson; one format that has them and three that do not'], build: level3 },
	4: { label: 'Il formato per lo scopo', constraints: ['a situation with a name, the right format with its reason and three of the wrong ones'], build: (rng) => situationLevel(rng, 'Scegli il formato adatto.', PURPOSES) },
	5: { label: 'Contenitori, codec, formati aperti', constraints: ['one true statement among three false ones, or one false among three true'], build: (rng) => statementLevel(rng, 'Ragiona su contenitori, codifiche e formati aperti.', 'sui formati', TRUE, FALSE) }
});
