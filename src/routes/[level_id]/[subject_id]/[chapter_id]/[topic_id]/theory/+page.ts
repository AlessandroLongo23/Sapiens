import { renderMarkdown, extractTableOfContents, structureTableOfContents, type ContentSection } from '$lib/utils/markdown.js';
import { getMarkdownPath, getTopicNode, type RouteParams } from '$lib/utils/route-params.js';
import type { TopicNode } from '$lib/data/content-tree.js';

interface ReturnValue {
    content: string;
    sections: ContentSection[];
    title: string;
    level_id: string;
    subject_id: string;
    chapter_id: string;
    topic_id: string;
    markdownPath: string;
    error?: Error;
}

export async function load({ params, fetch }): Promise<ReturnValue> {
    const { 
        level_id,
        subject_id,
        chapter_id, 
        topic_id,
    }: RouteParams = params;

    const markdownPath: string | null = getMarkdownPath({ level_id, subject_id, chapter_id, topic_id });
    
    try {
        const response: Response = await fetch(markdownPath!);
        if (!response.ok) {
            throw new Error(`Failed to load content from ${markdownPath} (${response.status})`);
        }
        
        const markdownContent: string = await response.text();
        if (!markdownContent || markdownContent.trim() === '') {
            throw new Error('Loaded content is empty');
        }
        
        const flatToc: ContentSection[] = extractTableOfContents(markdownContent);
        const sections: ContentSection[] = structureTableOfContents(flatToc);
        const content = renderMarkdown(markdownContent);

        const topicNode: TopicNode | null = getTopicNode(level_id, subject_id, chapter_id, topic_id);
        const title: string = topicNode?.name || '';

        return {
            content,
            sections,
            title,
            level_id,
            subject_id,
            chapter_id,
            topic_id,
            markdownPath,
        };
    } catch (error) {
        console.error('Error loading content:', error);
        return {
            content: null,
            sections: [],
            title: '',
            level_id,
            subject_id,
            chapter_id,
            topic_id,
            markdownPath: '',
            error: error,
        };
    }
}
