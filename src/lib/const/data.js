import * as ls from 'lucide-svelte';
import { writable } from 'svelte/store';

export const levelOptions = writable([
    {
        value: 'middle_school',
        title: 'Scuola Media',
        subtitle: 'Aiuto compiti e preparazione verifiche',
        price: '12€/ora',
        icon: ls.PenLine
    },
    {
        value: 'high_school',
        title: 'Scuola Superiore',
        subtitle: 'Preparazione verifiche e interrogazioni, Recupero debiti formativi',
        price: '15€/ora',
        icon: ls.BookOpen
    },
    {
        value: 'university',
        title: 'Università',
        subtitle: 'Corsi universitari e preparazione esami',
        price: '20€/ora',
        icon: ls.GraduationCap
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
    { number: 1, title: "Livello", description: "Scegli il tuo livello di studio" },
    { number: 2, title: "Materie", description: "Seleziona le materie di interesse" },
    { number: 3, title: "Frequenza", description: "Scegli la frequenza delle lezioni" },
    { number: 4, title: "Contatti", description: "I tuoi dati per essere contattato" }
]);

export const frequencyOptions = writable([
    { value: 'singola', title: 'Lezione Singola', subtitle: 'Una sola lezione (no svolgimento esami)' },
    { value: 'breve', title: '2-5 Lezioni', subtitle: 'Aiuto a breve termine' },
    { value: 'lungo', title: 'Supporto Continuativo', subtitle: 'Percorso personalizzato' }
]);

export const methodCards = writable([
    { 
        title: 'Materiale Completo',
        color: 'bg-gradient-to-br from-green-500 to-emerald-600',
        icon: ls.BookText, 
        description: 'Fornisco appunti dettagliati e materiale didattico personalizzato su tutti gli argomenti, permettendoti di concentrarti sulla comprensione anziché sulla trascrizione.'
    },
    { 
        title: 'Esercizi Illimitati', 
        color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
        icon: ls.Bot, 
        description: 'Un\'IA dedicata genera esercizi illimitati con diversi livelli di difficoltà, permettendoti di raggiungere la completa padronanza.'
    },
    { 
        title: 'Ritmo Personalizzato', 
        color: 'bg-gradient-to-br from-purple-500 to-pink-600',
        icon: ls.Clock, 
        description: 'Adatto il ritmo delle lezioni alle tue esigenze, assicurandomi che ogni concetto sia pienamente compreso prima di passare al successivo.'
    },
    { 
        title: 'Obiettivi Chiari', 
        color: 'bg-gradient-to-br from-orange-500 to-red-600',
        icon: ls.Target, 
        description: 'Stabiliamo insieme obiettivi concreti e misurabili, con un percorso personalizzato per raggiungerli nel modo più efficace.'
    },
    { 
        title: 'Metodo di Studio', 
        color: 'bg-gradient-to-br from-yellow-500 to-amber-600',
        icon: ls.Puzzle, 
        description: 'Ti insegno strategie efficaci di apprendimento che potrai applicare autonomamente anche dopo il nostro percorso insieme.'
    },
    { 
        title: 'Supporto Continuo', 
        color: 'bg-gradient-to-br from-pink-500 to-rose-600',
        icon: ls.HeartHandshake, 
        description: 'Rimango disponibile anche fuori dalle lezioni per rispondere ai tuoi dubbi e aiutarti a superare gli ostacoli nel percorso di apprendimento.' 
    }
]);