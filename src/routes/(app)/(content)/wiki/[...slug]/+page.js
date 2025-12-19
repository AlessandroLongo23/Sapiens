import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params, parent }) {
    // params.slug è un array: ['scuola-media', 'matematica', 'aritmetica', ...]
    const segments = params.slug;
    console.log('params slug', params.slug)
    let parentId = null;
    let currentNode = null;
    let currentType = null;

    // Itera attraverso i segmenti per trovare il nodo finale
    for (const [index, slug] of segments.entries()) {
        
        // 1. Definisci il tipo di nodo che stai cercando (livelli, soggetti, capitoli, topics)
        if (index === 0) currentType = 'level';
        else if (index === 1) currentType = 'subject';
        else if (index === 2) currentType = 'chapter';
        else if (index === 3) currentType = 'topic';
        // Puoi espandere questa logica se la tua gerarchia è più profonda

        // 2. Cerca nel DB usando slug e parentId
        const resp = await fetch(`/api/node/${params}`)
        if (dbError || !node) {
            // Se un segmento dell'URL non corrisponde a un nodo, restituisci 404
            throw error(404, `Nodo non trovato per il percorso: ${segments.slice(0, index + 1).join('/')}`);
        }
        
        // Aggiorna lo stato per il prossimo ciclo
        currentNode = node;
        parentId = node.id; // L'ID del nodo attuale diventa il parentId per il prossimo

        // Se l'URL è troppo lungo rispetto alla struttura, gestisci
        if (index > 3) break; // Limita la ricerca alla massima profondità prevista

    }

    // 3. Verifica l'output e restituisci i dati
    if (!currentNode) {
        throw error(404, 'Percorso non valido.');
    }
    
    // Recupera i children per costruire la navigazione laterale
    const { data: children } = await supabase
        .from('content_nodes')
        .select('*')
        .eq('parent_id', currentNode.id)
        .order('position', { ascending: true });

    return {
        // Dati del nodo corrente (capitolo, topic, ecc.)
        node: currentNode,
        // Dati dei figli (es. topics se il nodo è un chapter)
        children: children || [],
        // Array dei segmenti per breadcrumb o navigazione
        pathSegments: segments
    };
}