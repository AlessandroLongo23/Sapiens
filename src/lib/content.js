import { writable } from "svelte/store";

export const content = {
    "superiori": {
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
                "numeri interi": {

                },
                "numeri razionali": {

                }
            }
        }
    },
    "università": {

    }
}

export let selectedTopic = writable(null);