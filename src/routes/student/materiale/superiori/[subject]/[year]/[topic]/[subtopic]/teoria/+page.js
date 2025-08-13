import { renderMarkdown, extractTableOfContents, structureTableOfContents } from '$lib/utils/markdown.js';
import { getMarkdownPath } from '$lib/utils/route-params.js';

export async function load({ params, fetch }) {
    const { subject, year, topic: topicKey, subtopic: subtopicKey } = params;
    const level = 'superiori';
    
    // Get the markdown path from our utility function
    const markdownPath = getMarkdownPath({ level, subject, year, topic: topicKey, subtopic: subtopicKey });
    
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
        
        let title;
        if (subtopicKey && content[level]?.[subject]?.[year]?.topics?.[topicKey]?.subtopics?.[subtopicKey]) {
            title = content[level][subject][year].topics[topicKey].subtopics[subtopicKey].title;
        } else if (content[level]?.[subject]?.[year]?.topics?.[topicKey]) {
            title = content[level][subject][year].topics[topicKey].title;
        } else {
            title = subtopicKey.replace(/-/g, ' ');
        }

        return {
            content,
            sections,
            title,
            level,
            subject,
            year,
            topicKey,
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
            year,
            topicKey,
            subtopicKey
        };
    }
}
