# Formulario: Avvio del computer e interfacce utente

## Perché serve l'avvio

- La CPU esegue solo ciò che è nella RAM, e la RAM all'accensione è vuota.
- Il sistema operativo sta nella memoria di massa: a ogni accensione va copiato nella RAM.
- Firmware: il programma in un chip non volatile della scheda madre, che parte per primo (BIOS nei computer più vecchi, UEFI nei più recenti).

## Le fasi dell'avvio

1. Accensione: la CPU esegue il firmware.
2. Autodiagnosi (POST): il firmware controlla CPU, RAM, scheda video, tastiera.
3. Ricerca del dispositivo di avvio: il firmware cerca una memoria di massa con un sistema operativo.
4. Caricamento del nucleo: il bootloader copia il nucleo nella RAM e gli passa il controllo.
5. Avvio dei servizi e dell'interfaccia: driver, programmi di servizio, schermata di accesso.

- Riavvio: si riparte dalla fase 1. Sospensione: la RAM resta alimentata, non c'è un nuovo avvio.

## Le due interfacce

- Interfaccia utente: la parte del sistema con cui la persona dà i comandi e riceve le risposte.
- Riga di comando (CLI): comandi scritti, uno per riga. Prompt: la scritta che dice "pronto". Comando: nome e argomenti (in `cd Documenti`, `cd` è il nome e `Documenti` l'argomento). Interprete dei comandi (shell): il programma che legge la riga e la esegue.
- Grafica (GUI): finestre, icone, menu, puntatore; sui telefoni, le dita.

| | Riga di comando | Grafica |
|---|---|---|
| Come dai un comando | lo scrivi | scegli un oggetto sullo schermo |
| Che cosa devi sapere | i nomi dei comandi | quasi niente |
| Operazioni ripetute | veloci | lente |
| Risorse usate | poche | di più |

```ad-warning
Il firmware non è il sistema operativo
Sta in un chip della scheda madre e resta lo stesso anche se installi un altro sistema operativo.
```

```ad-warning
Due interfacce, un solo sistema
Riga di comando e finestre agiscono sugli stessi file: non sono due sistemi operativi.
```
