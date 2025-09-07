import { renderMarkdown, extractTableOfContents, structureTableOfContents } from '$lib/utils/markdown.js';
import { getMarkdownPath, getContentFromParams } from '$lib/utils/route-params.js';

export async function load({ params, fetch }) {
    const { course, topic: topicKey, subtopic: subtopicKey } = params;
    const level = 'universita';
    const subject = course;
    
    
    const markdownPath = getMarkdownPath({ level, subject, topic: topicKey, subtopic: subtopicKey });
    
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
        
        
        const contentData = getContentFromParams({ level, subject, topic: topicKey, subtopic: subtopicKey });
        
        
        let title = contentData?.title || subtopicKey?.replace(/-/g, ' ') || subject?.replace(/-/g, ' ');

        return {
            content,
            sections,
            title,
            level,
            subject,
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
            topicKey,
            subtopicKey
        };
    }
}
