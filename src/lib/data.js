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
        name: "Sofia Bianchi",
        comment: "Il miglior tutor di fisica che abbia mai avuto! Mi ha aiutato a superare gli esami universitari con ottimi voti. Molto paziente, preparato e motivante.",
        rating: 5,
        subject: "Fisica - Università"
    },
    {
        name: "Luca Verdi",
        comment: "Le lezioni di informatica con Alessandro sono state fantastiche. Ha una grande capacità di adattarsi al livello dello studente e di rendere interessanti anche gli argomenti più complessi.",
        rating: 5,
        subject: "Informatica - Università"
    },
    {
        name: "Sindi B.",
        comment: "Spiegazioni chiare, pazienza e disponibilità, finalmente sono riuscita a capire argomenti che mi sembravano impossibili.",
        rating: 5,
        subject: "Matematica e Fisica - Scuola Media"
    },
    {
        name: "Jane Doe",
        comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
        rating: 5,
        subject: "Fisica - Università"
    },
    {
        name: "John Doe",
        comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
        rating: 5,
        subject: "Informatica - Università"
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