import { writable } from 'svelte/store';

export const motivational_messages = writable([
    'Riprendiamo?',
    'Dove eravamo rimasti?',
    'Ancora un altro esercizio?',
    'Pronto a imparare qualcosa di nuovo?',
]);

export const exercise_messages = writable([
    ["Torniamo alla teoria...", "C'è da studiare!"],
    ["Puoi fare di meglio!", "Prova ancora!"],
    ["Ancora qualche esercizio!", "Non mollare!"],
    ["Ci sei quasi!", "Continua così!"],
    ["Perfetto!", "Neanche un errore!", "Bravissimo!"],
])