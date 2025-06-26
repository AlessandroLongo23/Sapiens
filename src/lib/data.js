import * as ls from 'lucide-svelte';
import { writable } from 'svelte/store';

export const levelOptions = writable([
    {
        value: 'media',
        title: 'Scuola Media',
        subtitle: 'Aiuto compiti e preparazione verifiche',
        price: '12€/ora',
        icon: ls.PenLine
    },
    {
        value: 'superiore',
        title: 'Scuola Superiore',
        subtitle: 'Preparazione verifiche e interrogazioni, Recupero debiti formativi',
        price: '15€/ora',
        icon: ls.BookOpen
    },
    {
        value: 'università',
        title: 'Università',
        subtitle: 'Corsi universitari e preparazione esami',
        price: '20€/ora',
        icon: ls.GraduationCap
    }
]);

export const subjectOptionsByLevel = writable({
    media: [
        { value: 'matematica', title: 'Matematica' },
        { value: 'fisica', title: 'Fisica' },
        { value: 'informatica', title: 'Informatica' },
        { value: 'chimica', title: 'Chimica' },
        { value: 'altro', title: 'Altro', editable: true }
    ],
    superiore: [
        { value: 'matematica', title: 'Matematica' },
        { value: 'fisica', title: 'Fisica' },
        { value: 'informatica', title: 'Informatica' },
        { value: 'chimica', title: 'Chimica' },
        { value: 'altro', title: 'Altro', editable: true }
    ],
    università: [
        { value: 'analisi1', title: 'Analisi I' },
        { value: 'analisi2', title: 'Analisi II' },
        { value: 'fisica1', title: 'Fisica I' },
        { value: 'fisica2', title: 'Fisica II' },
        { value: 'fondamenti_informatica', title: 'Fondamenti di Informatica' },
        { value: 'teoria_segnali', title: 'Teoria dei Segnali' },
        { value: 'database', title: 'Database' },
        { value: 'programmazione', title: 'Programmazione' },
        { value: 'sistemi_operativi', title: 'Sistemi Operativi' },
        { value: 'reti_di_calcolatori', title: 'Reti di Calcolatori' },
        { value: 'altro', title: 'Altro', editable: true }
    ]
});

export const morgagniImages = writable([
    '/morgagni/1.jpg',
    '/morgagni/2.jpg'
]);

export const dtuImages = writable([
    '/DTU/1.jpg',
    '/DTU/2.jpg',
    '/DTU/3.jpg',
    '/DTU/4.jpg',
    '/DTU/5.jpg'
]);

export const stats = writable({
    hours: {
        value: "130+",
        label: "Ore di Lezione",
        iconName: "clock",
        color: "text-blue-500"
    },
    subjects: {
        value: "15+",
        label: "Materie Trattate",
        iconName: "book-open",
        color: "text-emerald-500"
    },
    students: {
        value: "25+",
        label: "Studenti Seguiti",
        iconName: "users",
        color: "text-purple-500"
    }
});

export const testimonials = writable([
    {
        name: "Matteo R.",
        comment: "Molto preparato e pronto a spiegare in modo chiaro e semplice tutti i concetti di cui lo studente necessiti per superare un esame o approfondire/esercitarsi su un argomento",
        rating: 5,
        subject: "Database - Università"
    },
    {
        name: "Gianluca F.",
        comment: "Alessandro è stato fantastico! Ha saputo adattare le lezioni alle mie esigenze specifiche e mi ha aiutato a superare le mie difficoltà con la materia. La sua chiarezza e pazienza sono state fondamentali per il mio miglioramento. Lo consiglio vivamente a chiunque cerchi un tutor di matematica competente e affidabile!",
        rating: 5,
        subject: "Fisica - Università"
    },
    {
        name: "Sindi B.",
        comment: "Spiegazioni chiare, pazienza e disponibilità, finalmente sono riuscita a capire argomenti che mi sembravano impossibili.",
        rating: 5,
        subject: "Matematica e Fisica - Scuola Superiore"
    },
    {
        name: "Davide F.",
        comment: "Tutor estremamente preparato, chiaro nelle spiegazioni e sempre disponibile per chiarimenti dettagliati passo passo. Senza di lui sarei ancora bloccato sull'esame di Teoria dei segnali. Inoltre sul piano umano, diversamente dal classico docente serioso, ti mette a tuo agio ed è alla mano e preciso.",
        rating: 5,
        subject: "Teoria dei Segnali - Università"
    },
    {
        name: "Giulio Z.",
        comment: "Mi sono trovato davvero molto bene, Alessandro è molto preparato e abile nel capire i bisogni dello studente e come sia necessario lavorare in base alla tipologia d'esame. Super consigliato!",
        rating: 5,
        subject: "Ricerca operativa - Università"
    },
    {
        name: "Sara L.",
        comment: "Mi sono trovata davvero bene, abbiamo affrontato il programma in tempi molto rapidi, con spiegazioni sempre chiare e con un linguaggio semplice, facile da capire. È sempre stato disponibile con gli orari, molto preciso e attento, e non ha mai avuto problemi a rispiegarmi le cose anche più volte quando ne avevo bisogno. Grazie al suo aiuto ho superato l'esame e sono davvero soddisfatta. Lo consiglio assolutamente!",
        rating: 5,
        subject: "Informatica - Università"
    },
    {
        name: "Leonardo D.",
        comment: "Alessandro è estremamente preparato, paziente e capace di spiegare anche i concetti più complessi in modo chiaro e semplice.Grazie a lui, sto finalmente riuscendo a comprendere materie che prima trovavo davvero difficili. ",
        rating: 5,
        subject: "Matematica - Scuola Superiore"
    }
]);

export const steps = writable([
    { number: 1, title: "Livello", description: "Scegli il tuo livello di studio" },
    { number: 2, title: "Materie", description: "Seleziona le materie di interesse" },
    { number: 3, title: "Frequenza", description: "Scegli la frequenza delle lezioni" },
    { number: 4, title: "Contatti", description: "I tuoi dati per essere contattato" }
]);

export const frequencyOptions = writable([
    { value: 'singola', title: 'Lezione Singola', subtitle: 'Una sola lezione' },
    { value: 'breve', title: '2-5 Lezioni', subtitle: 'Aiuto a breve termine' },
    { value: 'lungo', title: 'Supporto Continuativo', subtitle: 'Percorso personalizzato' }
]);