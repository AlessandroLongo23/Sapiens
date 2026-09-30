---
stato: in sviluppo
aggiornato: 2026-09-29
tag: [marketing, seo, piano]
---
# Azioni SEO

La lista delle cose da fare per farsi trovare su Google, nata dalla verifica SEO del 26 settembre 2026 ([[2026-09-26 SEO e scheda degli esercizi]]) e dall'analisi di Theoremz del 27 settembre (`reports/Analisi competitiva di Theoremz.md`). Si affrontano una alla volta, in quest'ordine; lo stato e le decisioni stanno in [[SEO]]. La lista più ampia, con contenuti e rilettura, è in [[Dieci punti dai concorrenti]].

## Da fare
1. [ ] **Dominio definitivo, e prima il nome.** In discussione dal 27 settembre 2026. `sapiens.it` è di Sapiens & Sapiens s.n.c. dal 1998 ed è in uso, `sapiens.com` è preso, `sapiens.app` è parcheggiato su Sedo (prezzo da verificare). Le varianti con una seconda parola (`sapiensscuola.it`, `studiasapiens.it`, libere il 27 settembre) non piacciono ad Alessandro: il nome deve funzionare da solo, come Theoremz. In più, nello stesso settore esistono già [Scuola Sapiens](https://scuolasapiens.com/) (diplomi online per le superiori) e [A-Sapiens](https://www.a-sapiens.it/) (formazione e-learning), oltre a Sapienza Università di Roma e al libro "Sapiens" di Harari: sulla ricerca "sapiens" Sapiens non sarebbe mai primo, e c'è un possibile conflitto di marchio nella classe dell'istruzione (da verificare su UIBM ed EUIPO). Il 27 settembre Alessandro ha deciso di cercare un nome nuovo. Prima rosa dello stesso giorno (Claude): circa 300 nomi controllati sul registro `.it` e su `.com`; le parole vere della matematica e della scuola sono quasi tutte prese. Finalisti, con `.it` libero: "Quadernone" (anche `.com`; parola comune, nessun marchio trovato nel settore, ma su Google compete con la cancelleria), "Volevasi" (anche `.com`; da "come volevasi dimostrare"), "Postulato" (anche `.com`), "Sgobbo" (`.com` preso). Scartati: "Aritmo" (esiste un'app di calcolo con quel nome e `aritmo.app`), "Teoremario" (troppo vicino a Theoremz). Alessandro preferisce una parola inventata, che si possieda su Google dal primo giorno come Theoremz: la ricerca di una parola comune ("quadernone") porta chi vuole comprare un quaderno, non uno studente. Secondo giro dello stesso giorno, nomi inventati attorno a quaderno e quadretto: "Quadret" (liberi `.it`, `.com`, `.eu` e `.io`; nessun marchio trovato; su TikTok esiste `@quadrets`), poi "Squadrino" e "Quadruccio" (liberi `.it` e `.com`). Scartato "Quadeno": è un quaderno digitale e-ink di Fujitsu. Handle social e marchi (UIBM, EUIPO) da verificare prima di comprare. Quadret non piace ad Alessandro: suona duro (Q, T, R) e non è musicale. Terzo giro, nomi morbidi con finale in vocale: liberi `.it` e `.com` Sapiela (cognome polacco diffuso), Numiola, Sofilia (usato da un'artista musicale), Imparela; interrotto da Alessandro perché non stava portando a un nome. Ricerca del nome in pausa dal 27 settembre 2026. Il 28 settembre è ripartita: candidato principale Articolo34 (`articolo34.it` e `art34.it` liberi, li compra Alessandro), da confermare con una prova a voce con studenti e genitori contro Sapiens e Volevasi. Vedi [[2026-09-28 Il nome si sceglie con una prova a voce, Articolo34 contro Sapiens e Volevasi]]. Il 29 settembre 2026 la prova non è ancora fatta e i domini non sono comprati; Alessandro valuta anche `sapiensscuola.it` e `pigreko.it`, liberi quel giorno insieme a `pigreko.com` (whois). Sullo stesso Sapiens c'è un rischio in più: in Danimarca, dove ha sede l'impresa, esiste Sapiens Denmark A/S (Nordhavn, 19 dipendenti, codice attività "Computerprogrammering", controllata da Sapiens Technologies (1982) Ltd), che scrive software con lo stesso nome (cvrapi.dk, 29 settembre 2026). Marchi di Pigreko da verificare su UIBM ed EUIPO.
2. [ ] Collegare il dominio: Vercel, `PUBLIC_SITE_URL`, redirect 301 da `sapiens-edu.vercel.app`, controllo con `scripts/check-seo.mjs`.
3. [ ] Search Console come proprietà DNS; inviare la sitemap. Da decidere se subito o dopo la rilettura del primo anno da parte di Andrea.
4. [ ] Deploy delle modifiche SEO del 26 e 27 settembre (404, nodi vuoti e flashcard in `noindex`, scheda degli esercizi).
5. [ ] Collegamenti interni: dalla lezione alla sua scheda di esercizi e al formulario, e ritorno. Theoremz non collega lezione ed esercizi.
6. [ ] Parole cercate: volumi da Google Keyword Planner per gli argomenti del primo anno, poi title e description con le parole degli studenti ("spiegazione", "esempi", "esercizi con soluzioni").
7. [ ] Calcolatori gratuiti, una pagina ciascuno (MCD e mcm, scomposizione, equazioni di secondo grado, frazioni). "mcm online" è la prima fonte di traffico di Theoremz secondo Similarweb (agosto 2026, stima).
8. [ ] Un paragrafo introduttivo per ogni capitolo e le descrizioni dei nodi: 7 capitoli hanno 106-116 parole.
9. [ ] Peso delle pagine: una lezione pesa 1,5 MB di HTML, di cui 1,15 MB di payload React. Misurare i Core Web Vitals su telefono e ridurre.
10. [ ] Chi scrive e chi rilegge: autore e revisore su ogni lezione, con una pagina su Andrea e sul metodo.
11. [ ] Crawler AI: decidere se `robots.txt` li lascia entrare (Theoremz sì, YouMath no).
12. [ ] `scripts/check-seo.mjs` prima di ogni deploy, come script npm o controllo automatico.
13. [ ] Misurare: Search Console ogni settimana, Speed Insights, e confrontare con le stime su YouMath e Theoremz.

## Fuori dalla SEO, dalla stessa analisi
Da riprendere dopo, ognuno nella sua nota:
- Una pagina d'ingresso per i genitori, separata da quella per gli studenti ([[Area genitori]]).
- Strumenti legati a un momento di scuola, come "Simula verifica" e "Simula interrogazione" ([[Esercizi]]).
- Video brevi con esercizi veri, pubblicati con continuità nei mesi di scuola ([[Social]]).
- Termini coerenti con le pagine di vendita su recesso e rimborsi ([[Tutela del consumatore]]); numeri pubblici uguali su ogni pagina.

## Fatto
- 2026-09-26: 404 corrette, nodi vuoti e flashcard fuori dalla ricerca, `scripts/check-seo.mjs`, scheda di esercizi indicizzata. Nel codice, non ancora pubblicato.
- 2026-09-27: scheda su una pagina sua (`…/esercizi/scheda`), percorso in `noindex, follow`.
