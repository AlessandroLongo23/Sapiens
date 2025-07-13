import { renderMarkdown, extractTableOfContents, structureTableOfContents } from '$lib/utils/markdown.js';

export async function load({ params, fetch }) {
    const path = `/teoria/${params.topicPath}.md`;
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Failed to load content from ${path} (${response.status})`);
        }
        const markdownContent = await response.text();
        if (!markdownContent || markdownContent.trim() === '') {
            throw new Error('Loaded content is empty');
        }
        const flatToc = extractTableOfContents(markdownContent);
        const sections = structureTableOfContents(flatToc);
        const content = renderMarkdown(markdownContent);

        return {
            content,
            sections,
            title: params.topicPath.split('/').pop().replace(/-/g, ' ')
        };
    } catch (error) {
        console.error('Error loading content:', error);
        return {
            status: 500,
            error: error.message,
            content: null,
            sections: []
        };
    }
} 