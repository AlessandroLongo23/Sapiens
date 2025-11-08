import { contentTree, EducationalLevel } from '$lib/data/content-tree.js';
import { writable } from 'svelte/store';

export function extractRouteParams(pathname) {
    const segments = pathname.split('/').filter(Boolean);
    
    const levelIndex = segments.findIndex(segment => 
        segment === EducationalLevel.HIGH_SCHOOL || segment === EducationalLevel.UNIVERSITY
    );
    
    if (levelIndex === -1) {
        return null;
    }

    const level_id = segments[levelIndex];
    let subject_id, chapter_id, topic_id;
    
    subject_id = segments[levelIndex + 1];
    chapter_id = segments[levelIndex + 2];
    topic_id = segments[levelIndex + 3];

    return {
        level_id,  
        subject_id,
        chapter_id,
        topic_id,
    };
}

export function getTopicNode(level_id, subject_id, chapter_id, topic_id) {
    return contentTree
        ?.find(level => level.id === level_id)
        ?.subjects.find(subject => subject.id === subject_id)
        ?.chapters.find(chapter => chapter.id === chapter_id)
        ?.topics.find(topic => topic.id === topic_id);
}

export function getContentFromParams(params) {
    const { level_id, subject_id, chapter_id, topic_id } = params;
    
    try {
        const topicPath = [level_id, subject_id, chapter_id, topic_id];
        
        const topicNode = currentContent.flatNodes.find(node => 
            node.path?.length === topicPath.length &&
            node.path.every((segment, i) => segment === topicPath[i])
        );
                
        return topicNode;
    } catch (error) {
        console.error('Error getting content from params:', error);
        return null;
    }
}

export function getMarkdownPath(params) {
    const { level_id, subject_id, chapter_id, topic_id } = params;

    console.log(level_id, subject_id, chapter_id, topic_id);
    const topicNode = getTopicNode(level_id, subject_id, chapter_id, topic_id);
    
    if (topicNode) {
        return `/content/${level_id}/${subject_id}/${chapter_id}/${topic_id}.md`;
    }

    return null;
}

export const currentContent = writable(null);