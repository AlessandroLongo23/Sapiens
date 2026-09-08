import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/config/site';
import { LEGAL, LEGAL_VERSIONS } from '@/lib/config/legal';
import { Features, FeaturesDetails, SEMESTER_MONTHS_CHARGED, SUBSCRIPTION_PLANS, TRIAL_DAYS, formatPrice } from '@/lib/stripe/config';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { Prose } from '@/components/content/Prose';
import { LegalIdentity, PrivacyEmailLine } from '@/components/content/Legal';

export const metadata: Metadata = pageMetadata({
	title: `Termini e condizioni | ${SITE_NAME}`,
	description: "Termini e condizioni d'uso di Sapiens: chi può registrarsi, cosa è gratuito, piani Premium, prova gratuita, pagamenti, diritto di ripensamento, disdetta e uso dei contenuti.",
	path: '/terms'
});

const PLANS = [SUBSCRIPTION_PLANS.LITE, SUBSCRIPTION_PLANS.BASE, SUBSCRIPTION_PLANS.PRO];
const PREMIUM = (Object.values(Features) as Features[]).filter((f) => !SUBSCRIPTION_PLANS.FREE.access[f]);
const semester = PLANS.some((p) => p.stripePriceIdSemester);

export default function TermsPage() {
	const hours = SUBSCRIPTION_PLANS.PRO.tutoring_hours;
	return (
		<Prose>
			<h1>Termini e condizioni</h1>
			<p><em>Versione {LEGAL_VERSIONS.terms}.</em></p>
			<p>Queste condizioni regolano l&apos;uso del sito {SITE_NAME} e dei piani Premium. Usando il sito le accetti; creando un account le accetti espressamente. Sono scritte in modo che anche uno studente possa capirle.</p>

			<h2>1. Chi offre il servizio</h2>
			<p>{SITE_NAME} è offerto da <LegalIdentity />, con sede in {LEGAL.establishment} (&quot;noi&quot;). Per contattarci usa la pagina <a href="/contacts">Contatti</a><PrivacyEmailLine />.</p>

			<h2>2. Cosa offre {SITE_NAME}</h2>
			<p>{SITE_NAME} pubblica materiale didattico per la scuola media, la scuola superiore e l&apos;università: teoria, formulari, esercizi interattivi con correzione automatica, flashcard, un assistente di studio basato sull&apos;intelligenza artificiale (Sapiens AI) e, nel piano Pro, ripetizioni individuali. Il catalogo cresce nel tempo: le lezioni non ancora scritte sono indicate come &quot;in arrivo&quot;.</p>

			<h2>3. Contenuti gratuiti</h2>
			<p>La teoria e i formulari sono consultabili gratuitamente, senza registrazione e senza limiti di tempo. Non serve un account per studiare.</p>

			<h2>4. Età e account</h2>
			<ul>
				<li>Puoi creare un account da solo se hai almeno {LEGAL.digitalConsentAge} anni.</li>
				<li>Se hai meno di {LEGAL.digitalConsentAge} anni, l&apos;account deve essere creato da un genitore o da chi esercita la responsabilità genitoriale, che ne è titolare e risponde del suo uso e dell&apos;eventuale abbonamento.</li>
				<li>Al momento della registrazione chiediamo di confermare questa condizione. Se scopriamo un account creato in violazione di questa regola, lo chiudiamo.</li>
				<li>Sei responsabile della custodia della password e di quello che viene fatto con il tuo account. Un account è personale e non può essere condiviso.</li>
				<li>Puoi chiudere l&apos;account in qualsiasi momento scrivendoci: i dati vengono cancellati come descritto nell&apos;<a href="/privacy">informativa sulla privacy</a>.</li>
			</ul>

			<h2>5. Piani Premium, prezzi e prova gratuita</h2>
			<p>I piani a pagamento e i loro prezzi mensili sono prezzi finali, senza costi aggiuntivi:</p>
			<ul>
				{PLANS.map((plan) => (
					<li key={plan.id}>{plan.name}: {formatPrice(plan.price, plan.currency)} al mese</li>
				))}
			</ul>
			<p>Sono riservati ai piani a pagamento:</p>
			<ul>
				{PREMIUM.map((f) => (
					<li key={f}>{FeaturesDetails[f].name}</li>
				))}
			</ul>
			<p>
				Il dettaglio di cosa include ogni piano è nella pagina <a href="/pricing">Prezzi</a>, che fa parte di queste condizioni.
				{semester && <> L&apos;abbonamento semestrale costa quanto {SEMESTER_MONTHS_CHARGED} mensilità e copre sei mesi.</>}
			</p>
			<p><strong>Prova gratuita.</strong> Il primo abbonamento a un piano Premium inizia con {TRIAL_DAYS} giorni di prova gratuita, senza inserire una carta. Se alla fine della prova non hai aggiunto un metodo di pagamento, l&apos;abbonamento termina da solo e non ti viene addebitato nulla. La prova è disponibile una sola volta per account.</p>
			<p><strong>Rinnovo.</strong> Se hai aggiunto un metodo di pagamento, l&apos;abbonamento si rinnova automaticamente alla fine di ogni periodo (mese o semestre) allo stesso prezzo, finché non lo disdici. Se un prezzo cambia, te lo comunichiamo via email almeno 30 giorni prima: il nuovo prezzo vale dal rinnovo successivo e puoi disdire prima.</p>

			<h2>6. Pagamenti</h2>
			<p>I pagamenti sono gestiti da Stripe Payments Europe, Ltd., sulle sue pagine sicure: {SITE_NAME} non vede e non conserva i dati della carta. Le ricevute sono inviate da Stripe all&apos;email dell&apos;account e sono sempre disponibili dalla pagina <a href="/subscription">Il tuo abbonamento</a>. Se un addebito non va a buon fine, Stripe ritenta per alcuni giorni; nel frattempo, e se il pagamento non riesce, l&apos;accesso ai contenuti Premium è sospeso e l&apos;account torna al piano gratuito.</p>

			<h2>7. Diritto di ripensamento</h2>
			<p>Se sei un consumatore, hai 14 giorni dal primo addebito per ripensarci (art. 52 del Codice del consumo, D.lgs. 206/2005): scrivici dalla pagina <a href="/contacts">Contatti</a> e ti rimborsiamo per intero l&apos;importo di quel periodo. Non serve indicare un motivo. Per i rinnovi successivi vale la disdetta descritta al punto 8.</p>

			<h2>8. Disdetta</h2>
			<p>Puoi disdire in qualsiasi momento dalla pagina <a href="/subscription">Il tuo abbonamento</a> (&quot;Gestisci abbonamento&quot;). Il piano resta attivo fino alla fine del periodo già pagato e non si rinnova; il periodo in corso non viene rimborsato, salvo il diritto di ripensamento del punto 7. Puoi riattivare un piano quando vuoi.</p>

			<h2>9. Uso dei contenuti</h2>
			<p>Testi, esercizi, formulari, immagini e codice di {SITE_NAME} sono protetti dal diritto d&apos;autore. Puoi usarli per lo studio personale, stamparli e prendere appunti; non puoi copiarli in massa, ripubblicarli, rivenderli o usarli per addestrare sistemi automatici senza il nostro permesso scritto. Non puoi tentare di aggirare le limitazioni dei piani o di accedere a parti del sito non destinate a te.</p>

			<h2>10. Sapiens AI</h2>
			<p>Le risposte di Sapiens AI sono generate automaticamente: possono contenere errori e non sostituiscono un insegnante. Verifica sempre con la teoria della lezione. Non inserire nella chat dati personali tuoi o di altri.</p>

			<h2>11. Ripetizioni (piano Pro)</h2>
			<p>Il piano Pro include {hours} {hours === 1 ? 'ora' : 'ore'} di ripetizioni individuali a settimana, online, in orari da concordare tramite la pagina <a href="/contacts">Contatti</a>. Le ore non usate in una settimana non si accumulano.</p>

			<h2>12. Disponibilità del servizio e correttezza dei contenuti</h2>
			<p>Facciamo il possibile perché il sito sia sempre raggiungibile, ma non garantiamo un livello di servizio minimo: possono esserci interruzioni per manutenzione o per cause fuori dal nostro controllo. Il materiale è curato con attenzione ma può contenere errori: se ne trovi uno, segnalacelo. Possiamo aggiungere, modificare o ritirare contenuti e funzionalità; se una funzionalità inclusa nel tuo piano viene ritirata, puoi disdire e ottenere il rimborso della parte di periodo non goduta.</p>

			<h2>13. Responsabilità</h2>
			<p>{SITE_NAME} è uno strumento di studio: i risultati scolastici dipendono da molti fattori e non possiamo garantirli. Rispondiamo dei danni causati da dolo o colpa grave (art. 1229 c.c.) e, verso i consumatori, di tutto ciò che la legge non consente di escludere. Non rispondiamo dei danni indiretti o dovuti a un uso del sito contrario a queste condizioni.</p>

			<h2>14. Chiusura dell&apos;account da parte nostra</h2>
			<p>Possiamo sospendere o chiudere un account in caso di violazione di queste condizioni, uso fraudolento o richiesta dell&apos;autorità, dopo averti avvisato via email quando possibile. In caso di chiusura per nostra iniziativa senza tua violazione, rimborsiamo la parte di abbonamento non goduta.</p>

			<h2>15. Legge applicabile e foro</h2>
			<p>Queste condizioni sono regolate dalla legge italiana, ferme restando le norme inderogabili a tutela dei consumatori del paese in cui abiti (art. 6 del Regolamento (CE) 593/2008). Per le controversie con i consumatori è competente il giudice del luogo di residenza o domicilio del consumatore. Prima di qualsiasi causa, proviamo a risolvere il problema insieme: scrivici.</p>

			<h2>16. Modifiche a queste condizioni</h2>
			<p>La versione in vigore è indicata in alto. Le modifiche sostanziali sono comunicate via email a chi ha un account almeno 30 giorni prima che entrino in vigore; se non le accetti, puoi disdire senza costi entro quella data. Continuando a usare il sito dopo la data indicata, le accetti.</p>

			<h2>17. Contatti</h2>
			<p>Per domande su queste condizioni usa la pagina <a href="/contacts">Contatti</a><PrivacyEmailLine />.</p>
		</Prose>
	);
}
