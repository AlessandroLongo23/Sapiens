import { writable } from 'svelte/store';

export const motivational_messages = writable([
    'Bentornato',
    'Come stai oggi?',
    'Riprendiamo?',
    'Continuiamo da dove avevi lasciato?',
    'Sei pronto per il prossimo esercizio?',
    'Pronto a imparare qualcosa di nuovo?',
]);

export const exercise_messages = writable([
    ["Ripassa la teoria", "Rileggi i concetti chiave"],
    ["Ci sei quasi", "Riprova con calma"],
    ["Continua ad allenarti", "Stai migliorando"],
    ["Ottimo lavoro", "Vai avanti così"],
    ["Perfetto", "Eccellente", "Tutto corretto"],
])