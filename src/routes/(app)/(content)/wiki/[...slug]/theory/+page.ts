import { renderMarkdown, extractTableOfContents, structureTableOfContents, type ContentSection } from '$lib/utils/markdown.svelte.js';

interface ReturnValue {
    content: string | null;
    sections: ContentSection[];
    error?: Error;
}

export async function load({ parent }): Promise<ReturnValue> {
    const { node } = await parent();
    const markdownContent: string | null = node?.theory;

    if (!markdownContent || markdownContent.trim() === '') {
        return {
            content: null,
            sections: [],
            error: new Error('Contenuto non disponibile'),
        };
    }

    const flatToc = extractTableOfContents(markdownContent);
    const sections = structureTableOfContents(flatToc);
    const content = renderMarkdown(markdownContent);

    return {
        content,
        sections,
    };
}
