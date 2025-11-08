import { renderMarkdown, extractTableOfContents, structureTableOfContents } from '$lib/utils/markdown.js';
import { getMarkdownPath, getTopicNode } from '$lib/utils/route-params.js';

export async function load({ params, fetch }) {
    const { 
        level_id,
        subject_id,
        chapter_id, 
        topic_id,
    } = params;

    const markdownPath = getMarkdownPath({ level_id, subject_id, chapter_id, topic_id });
    console.log(markdownPath);
    
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

        console.log('content', content);
        console.log('sections', sections);
        console.log('flatToc', flatToc);
        console.log('markdownPath', markdownPath);
        
        const topicNode = getTopicNode(level_id, subject_id, chapter_id, topic_id);
        const title = topicNode.name;

        return {
            content,
            sections,
            title,
            level_id,
            subject_id,
            chapter_id,
            topic_id,
            markdownPath
        };
    } catch (error) {
        console.error('Error loading content:', error);
        return {
            status: 500,
            error: error.message,
            content: null,
            sections: [],
            level_id,
            subject_id,
            chapter_id,
            topic_id,
        };
    }
}
