import { renderMarkdown, extractTableOfContents, structureTableOfContents } from '$lib/utils/markdown.js';
import { getMarkdownPath, getContentFromParams } from '$lib/utils/route-params.js';

export async function load({ params, fetch }) {
    const { course, subtopic: subtopicKey } = params;
    const level = 'università';
    const subject = course;
    
    // Get the markdown path from our utility function
    const markdownPath = getMarkdownPath({ level, subject, subtopic: subtopicKey });
    
    try {
        const response = await fetch(markdownPath);
        if (!response.ok) {
            throw new Error(`Failed to load content from ${markdownPath} (${response.status})`);
        }
        
        const markdownContent = await response.text();
        if (!markdownContent || markdownContent.trim() === '') {
            throw new Error('Loaded content is empty');
        }
        
        const flatToc = extractTableOfContents(markdownContent);
        const sections = structureTableOfContents(flatToc);
        const content = renderMarkdown(markdownContent);
        
        // Get content data from our utility function
        const contentData = getContentFromParams({ level, subject, subtopic: subtopicKey });
        
        // Get the title from the content data or use a fallback
        let title = contentData?.title || subtopicKey?.replace(/-/g, ' ') || subject?.replace(/-/g, ' ');

        return {
            content,
            sections,
            title,
            level,
            subject,
            subtopicKey,
            markdownPath
        };
    } catch (error) {
        console.error('Error loading content:', error);
        return {
            status: 500,
            error: error.message,
            content: null,
            sections: [],
            level,
            subject,
            subtopicKey
        };
    }
}
