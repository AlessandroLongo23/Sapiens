import { PenLine, BookOpen, GraduationCap } from 'lucide-svelte';
import { BookText, Bot, Clock, Target, Puzzle, HeartHandshake } from 'lucide-svelte';
import { writable } from 'svelte/store';

export const levelOptions = writable([
    {
        value: 'middle_school',
        title: 'Scuola media',
        subtitle: 'Supporto compiti e preparazione verifiche',
        price: '12€/ora',
        icon: PenLine
    },
    {
        value: 'high_school',
        title: 'Scuola superiore',
        subtitle: 'Preparazione verifiche, interrogazioni e recupero debiti',
        price: '15€/ora',
        icon: BookOpen
    },
    {
        value: 'university',
        title: 'Università',
        subtitle: 'Preparazione esami universitari',
        price: '20€/ora',
        icon: GraduationCap
    }
]);

export const subjectOptionsByLevel = writable({
    middle_school: [
        { value: 'matematica', title: 'Matematica' },
        { value: 'fisica', title: 'Fisica' },
        { value: 'informatica', title: 'Informatica' },
        { value: 'chimica', title: 'Chimica' },
        { value: 'altro', title: 'Altro', editable: true }
    ],
    high_school: [
        { value: 'matematica', title: 'Matematica' },
        { value: 'fisica', title: 'Fisica' },
        { value: 'informatica', title: 'Informatica' },
        { value: 'chimica', title: 'Chimica' },
        { value: 'altro', title: 'Altro', editable: true }
    ],
    university: [
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

export const steps = writable([
    { number: 1, title: "Livello", description: "Indica il tuo livello di studio" },
    { number: 2, title: "Materie", description: "Seleziona le materie" },
    { number: 3, title: "Frequenza", description: "Indica la frequenza delle lezioni" },
    { number: 4, title: "Contatti", description: "I tuoi dati" }
]);

export const frequencyOptions = writable([
    { value: 'singola', title: 'Lezione singola', subtitle: 'Una sola lezione' },
    { value: 'breve', title: '2-5 lezioni', subtitle: 'Supporto a breve termine' },
    { value: 'lungo', title: 'Supporto continuativo', subtitle: 'Percorso personalizzato' }
]);

export const methodCards = writable([
    { 
        title: 'Materiale completo',
        color: 'bg-gradient-to-br from-green-500 to-emerald-600',
        icon: BookText, 
        description: 'Teoria dettagliata e formulari su tutti gli argomenti. Ti concentri sulla comprensione, non sulla trascrizione.'
    },
    { 
        title: 'Esercizi illimitati', 
        color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
        icon: Bot, 
        description: 'Esercizi generati automaticamente con diversi livelli di difficoltà. Ti alleni fino a raggiungere la completa padronanza.'
    },
    { 
        title: 'Ritmo personalizzato', 
        color: 'bg-gradient-to-br from-purple-500 to-pink-600',
        icon: Clock, 
        description: 'Studi al tuo ritmo. Ogni concetto è spiegato chiaramente prima di passare al successivo.'
    },
    { 
        title: 'Obiettivi chiari', 
        color: 'bg-gradient-to-br from-orange-500 to-red-600',
        icon: Target, 
        description: 'Definisci obiettivi concreti e misurabili. Segui un percorso strutturato per raggiungerli con efficacia.'
    },
    { 
        title: 'Metodo di studio', 
        color: 'bg-gradient-to-br from-yellow-500 to-amber-600',
        icon: Puzzle, 
        description: 'Impari strategie efficaci di apprendimento che puoi applicare in autonomia per qualsiasi materia.'
    },
    { 
        title: 'Supporto continuo', 
        color: 'bg-gradient-to-br from-pink-500 to-rose-600',
        icon: HeartHandshake, 
        description: 'Con Premium hai supporto disponibile anche fuori dalle lezioni per rispondere ai tuoi dubbi.' 
    }
]);