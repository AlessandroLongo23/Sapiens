import { writable } from "svelte/store";

export const content = {
    "superiori": {
        "informatica": {
            "3": {
                "foglio di calcolo": {
                    "title": "Foglio di Calcolo",
                    "description": "Il foglio di calcolo è un programma che permette di creare e modificare tabelle.",
                    "icon": "",
                    "path": "/superiori/informatica/3/foglio di calcolo/foglio-di-calcolo.md"
                }
            }
        },
        "matematica": {
            "1": {
                "numeri naturali": {
                    "operazioni e proprietà": {
                        "title": "Le quattro Operazioni",
                        "description": "Somma, sottrazione, moltiplicazione e divisione, e le loro proprietà.",
                        "icon": "",
                        "path": "/superiori/matematica/1/numeri-naturali/operazioni-e-proprieta.md"
                    },
                    "potenza e proprietà": {
                        "title": "Le Potenze",
                        "description": "La potenza e le sue proprietà.",
                        "icon": "",
                        "path": "/superiori/matematica/1/numeri-naturali/potenze.md"
                    },
                    "mcm e MCD": {
                        "title": "mcm e MCD",
                        "description": "Il minimo comune multiplo e il massimo comune divisore di due o più numeri.",
                        "icon": "",
                        "path": "/superiori/matematica/1/numeri-naturali/mcm-MCD.md"
                    }
                },
                "frazioni": {
                    "confronto frazioni": {
                        "title": "Confronto frazioni",
                        "description": "Confronto frazioni.",
                        "icon": "",
                        "path": "/superiori/matematica/1/frazioni/confronto-frazioni.md"
                    },
                    "potenze esponente negativo": {
                        "title": "Potenze esponente negativo",
                        "description": "Potenze con esponente negativo.",
                        "icon": "",
                        "path": "/superiori/matematica/1/frazioni/potenze-esponente-negativo.md"
                    },
                    "conversione": {
                        "title": "Conversione",
                        "description": "Conversione di numeri dalla forma frazionaria alla forma decimale e viceversa.",
                        "icon": "",
                        "path": "/superiori/matematica/1/frazioni/conversione.md"
                    }
                },
                "insiemi": {

                },
                "monomi": {
                    
                }
            }
        }
    },
    "università": {

    }
}

export let selectedTopic = writable(null);