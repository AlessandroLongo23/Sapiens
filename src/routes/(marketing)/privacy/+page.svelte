<script lang="ts">
	import { SITE_NAME } from '$lib/config/site';
	import { LEGAL, LEGAL_VERSIONS, PROCESSORS } from '$lib/config/legal';
	import { TRIAL_DAYS } from '$lib/stripe/config';

	import Seo from '$lib/components/seo/Seo.svelte';

	const description =
		'Informativa sulla privacy di Sapiens: quali dati raccogliamo (account, abbonamento, richieste di contatto, chat), perché, per quanto tempo, chi li tratta, cosa cambia per gli studenti minorenni e quali sono i tuoi diritti.';

	const processing = [
		{
			data: 'Navigazione: indirizzo IP, browser, pagine richieste (log tecnici del server)',
			purpose: 'Far funzionare il sito, difenderlo da abusi, risolvere errori',
			basis: 'Legittimo interesse (art. 6.1.f GDPR)',
			retention: 'Il tempo necessario alla sicurezza del servizio, comunque non oltre 12 mesi'
		},
		{
			data: 'Preferenze: tema chiaro o scuro, scelta sui cookie',
			purpose: 'Ricordare le tue impostazioni',
			basis: 'Cookie e archiviazione tecnici (art. 122 Codice privacy)',
			retention: 'Nel tuo browser: 6 mesi per la scelta sui cookie, il tema finché non lo cambi'
		},
		{
			data: 'Account: email, password (conservata solo cifrata), nome e cognome, data e versione dei termini accettati, dichiarazione di età',
			purpose: 'Farti accedere, riconoscere il tuo piano, provare cosa hai accettato e quando',
			basis: 'Esecuzione del contratto (art. 6.1.b GDPR)',
			retention: 'Finché l’account esiste; cancellato entro 30 giorni dalla richiesta di chiusura'
		},
		{
			data: 'Abbonamento: piano, stato, identificativo cliente e abbonamento presso Stripe',
			purpose: 'Sbloccare i contenuti Premium, gestire rinnovi, disdette e prova gratuita',
			basis: 'Esecuzione del contratto (art. 6.1.b GDPR)',
			retention: 'Durata dell’abbonamento; i documenti contabili sono conservati da Stripe per 10 anni (art. 2220 c.c.)'
		},
		{
			data: 'Pagamento: dati della carta',
			purpose: 'Addebitare l’abbonamento',
			basis: 'Esecuzione del contratto (art. 6.1.b GDPR)',
			retention: 'Trattati esclusivamente da Stripe: Sapiens non li riceve e non li conserva'
		},
		{
			data: 'Richieste di contatto: nome, cognome, email, livello scolastico, materie, frequenza desiderata',
			purpose: 'Risponderti e organizzare quanto richiesto',
			basis: 'Misure precontrattuali su tua richiesta (art. 6.1.b GDPR)',
			retention: 'Fino alla risposta e comunque non oltre 12 mesi'
		},
		{
			data: 'Chat con Sapiens AI: i messaggi che scrivi e il testo della lezione che selezioni',
			purpose: 'Generare la risposta',
			basis: 'Esecuzione del contratto (art. 6.1.b GDPR)',
			retention: 'Sapiens non li salva: restano nel tuo browser finché chiudi la pagina. OpenAI può conservarli fino a 30 giorni per controlli antiabuso'
		},
		{
			data: 'Statistiche di visita: pagine viste e tempi di caricamento, senza cookie e con un identificatore che cambia ogni giorno',
			purpose: 'Capire quali lezioni sono utili e quanto è veloce il sito',
			basis: 'Consenso (art. 6.1.a GDPR), revocabile dal link "Gestisci cookie"',
			retention: 'Solo dati aggregati; nessun profilo individuale'
		}
	];
</script>

<Seo title="Informativa sulla privacy | {SITE_NAME}" {description} path="/privacy" />

<div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 prose prose-zinc dark:prose-invert max-w-none">
	<h1>Informativa sulla privacy</h1>
	<p><em>Versione {LEGAL_VERSIONS.privacy}.</em></p>
	<p>
		Questa informativa spiega, ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 (GDPR) e del D.lgs.
		196/2003 (Codice privacy), quali dati personali {SITE_NAME} tratta, perché, per quanto tempo e con chi. È scritta
		per essere letta anche da uno studente: se qualcosa non è chiaro, scrivici.
	</p>

	<h2>1. Chi tratta i tuoi dati</h2>
	<p>
		Il titolare del trattamento è <strong>{LEGAL.legalName}</strong>{#if LEGAL.address}, {LEGAL.address}{/if}{#if LEGAL.vatNumber}, {LEGAL.vatNumber}{/if}, con sede in {LEGAL.establishment}.
		Per qualsiasi richiesta sui dati personali
		{#if LEGAL.privacyEmail}
			scrivi a <a href="mailto:{LEGAL.privacyEmail}">{LEGAL.privacyEmail}</a>
		{:else}
			usa la pagina <a href="/contacts">Contatti</a>
		{/if}.
	</p>

	<h2>2. Responsabile della protezione dei dati</h2>
	<p>
		Non è stato nominato un responsabile della protezione dei dati (DPO): {SITE_NAME} non è un ente pubblico, non
		monitora le persone in modo sistematico e su larga scala e non tratta su larga scala categorie particolari di
		dati (art. 37 GDPR). Le richieste sono gestite direttamente dal titolare, ai contatti indicati sopra.
	</p>

	<h2>3. Quali dati, perché, per quanto tempo</h2>
	<p>
		Leggere la teoria e i formulari non richiede registrazione e non comporta la raccolta di dati personali oltre ai
		log tecnici del server. Tutto il resto dipende da cosa scegli di fare sul sito.
	</p>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Dati</th>
					<th>Perché</th>
					<th>Base giuridica</th>
					<th>Per quanto tempo</th>
				</tr>
			</thead>
			<tbody>
				{#each processing as row (row.data)}
					<tr>
						<td>{row.data}</td>
						<td>{row.purpose}</td>
						<td>{row.basis}</td>
						<td>{row.retention}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p>
		Fornire i dati dell'account è necessario solo per attivare un piano Premium; senza, puoi comunque usare tutti i
		contenuti gratuiti. Non usiamo i tuoi dati per pubblicità, non li vendiamo e non li cediamo a terzi per finalità
		loro.
	</p>

	<h2>4. Studenti minorenni</h2>
	<p>
		{SITE_NAME} è pensato anche per studenti delle scuole medie e superiori. In Italia una persona può dare da sola il
		consenso ai servizi online a partire dai {LEGAL.digitalConsentAge} anni (art. 2-quinquies del Codice privacy);
		sotto questa età serve chi esercita la responsabilità genitoriale. Per questo:
	</p>
	<ul>
		<li>la teoria e i formulari sono consultabili da chiunque, senza account e senza raccolta di dati;</li>
		<li>
			un account può essere creato da chi ha almeno {LEGAL.digitalConsentAge} anni, oppure da un genitore (o da chi ne
			fa le veci) per uno studente più giovane: in quel caso il genitore è il titolare dell'account e dell'abbonamento;
		</li>
		<li>al momento della registrazione chiediamo di confermare questa condizione, e ne conserviamo traccia;</li>
		<li>
			se vieni a sapere che un minore di {LEGAL.digitalConsentAge} anni ha creato un account senza autorizzazione,
			segnalacelo: lo chiudiamo e cancelliamo i dati.
		</li>
	</ul>
	<p>
		I genitori possono esercitare per conto del figlio tutti i diritti descritti al punto 8.
	</p>

	<h2>5. Chi tratta i dati per nostro conto</h2>
	<p>
		Per far funzionare il servizio ci affidiamo a fornitori che trattano i dati solo secondo le nostre istruzioni
		(responsabili del trattamento, art. 28 GDPR):
	</p>
	<div class="overflow-x-auto">
		<table>
			<thead>
				<tr>
					<th>Fornitore</th>
					<th>Cosa fa</th>
					<th>Dove ha sede</th>
					<th>Garanzie per i trasferimenti</th>
				</tr>
			</thead>
			<tbody>
				{#each PROCESSORS as p (p.name)}
					<tr>
						<td><a href={p.privacyUrl} rel="noopener">{p.name}</a></td>
						<td>{p.purpose}</td>
						<td>{p.location}</td>
						<td>{p.transfer}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<p>
		Nessun altro riceve i tuoi dati, salvo obblighi di legge o richieste dell'autorità.
	</p>

	<h2>6. Trasferimenti fuori dall'Unione Europea</h2>
	<p>
		Alcuni fornitori hanno sede negli Stati Uniti. I trasferimenti avvengono sulla base delle clausole contrattuali
		standard approvate dalla Commissione europea (decisione di esecuzione (UE) 2021/914) e, dove il fornitore vi
		aderisce, del Data Privacy Framework UE-USA, con cifratura dei dati in transito e a riposo.
	</p>

	<h2>7. Come proteggiamo i dati</h2>
	<p>
		Le connessioni sono cifrate (HTTPS). Le password sono conservate solo in forma cifrata e non sono leggibili da
		nessuno, nemmeno da noi. L'accesso ai sistemi è limitato al titolare e protetto da credenziali dedicate. Le
		informazioni sull'abbonamento sono scritte esclusivamente dal sistema di pagamento e non sono modificabili
		dall'utente. In caso di violazione dei dati che comporti un rischio per te, ti avvisiamo senza ingiustificato
		ritardo (art. 34 GDPR).
	</p>

	<h2>8. I tuoi diritti</h2>
	<p>In qualsiasi momento puoi chiederci di:</p>
	<ul>
		<li>sapere quali dati abbiamo su di te e riceverne una copia (accesso, art. 15);</li>
		<li>correggerli (rettifica, art. 16);</li>
		<li>cancellarli e chiudere l'account (cancellazione, art. 17);</li>
		<li>limitarne l'uso (limitazione, art. 18);</li>
		<li>riceverli in un formato leggibile da una macchina (portabilità, art. 20);</li>
		<li>opporti ai trattamenti basati sul legittimo interesse (opposizione, art. 21);</li>
		<li>revocare il consenso alle statistiche, dal link "Gestisci cookie" in fondo a ogni pagina.</li>
	</ul>
	<p>
		Rispondiamo entro un mese (art. 12.3 GDPR). Se ritieni che il trattamento violi la legge, puoi rivolgerti
		all'autorità di controllo del paese in cui abiti, per l'Italia il
		<a href={LEGAL.localAuthority.url} rel="noopener">{LEGAL.localAuthority.name}</a>, oppure all'autorità capofila
		del paese in cui {SITE_NAME} ha sede, <a href={LEGAL.supervisoryAuthority.url} rel="noopener">{LEGAL.supervisoryAuthority.name}</a>:
		le due collaborano (artt. 56 e 60-66 GDPR).
	</p>

	<h2>9. Decisioni automatizzate</h2>
	<p>
		Non prendiamo decisioni automatizzate che producano effetti giuridici su di te e non facciamo profilazione. La
		correzione automatica degli esercizi valuta la risposta, non la persona, e non viene conservata.
	</p>

	<h2>10. Modifiche</h2>
	<p>
		La versione di questa informativa è indicata in alto. Se cambia in modo sostanziale, lo segnaliamo sul sito e, a
		chi ha un account, anche via email. La prova gratuita di {TRIAL_DAYS} giorni, i prezzi e le condizioni dei piani
		sono descritti nei <a href="/terms">Termini e condizioni</a>; i cookie nella <a href="/cookie">Cookie policy</a>.
	</p>

	<h2>11. Contatti</h2>
	<p>
		Per esercitare i tuoi diritti o per qualsiasi domanda
		{#if LEGAL.privacyEmail}
			scrivi a <a href="mailto:{LEGAL.privacyEmail}">{LEGAL.privacyEmail}</a>
		{:else}
			usa la pagina <a href="/contacts">Contatti</a>
		{/if}.
	</p>
</div>
