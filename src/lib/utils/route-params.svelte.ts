import { contentTree, EducationalLevel } from '$lib/data/content-tree.js';
import { writable } from 'svelte/store';
import type { TopicNode } from '$lib/data/content-tree.js';

export interface RouteParams {
    level_id: string;
    subject_id: string;
    chapter_id: string;
    topic_id: string;
}

export function extractRouteParams(pathname: string): RouteParams | null {
    const segments = pathname.split('/').filter(Boolean);
    
    const levelIndex = segments.findIndex(segment => 
        segment === EducationalLevel.HIGH_SCHOOL || segment === EducationalLevel.UNIVERSITY
    );
    
    if (levelIndex === -1) {
        return null;
    }

    const level_id: string = segments[levelIndex];
    const subject_id: string = segments[levelIndex + 1];
    const chapter_id: string = segments[levelIndex + 2];
    const topic_id: string = segments[levelIndex + 3];

    return {
        level_id,  
        subject_id,
        chapter_id,
        topic_id,
    };
}

export function getTopicNode(level_id: string, subject_id: string, chapter_id: string, topic_id: string): TopicNode | null {
    return contentTree
        ?.find(level => level.id === level_id)
        ?.subjects.find(subject => subject.id === subject_id)
        ?.chapters.find(chapter => chapter.id === chapter_id)
        ?.topics.find(topic => topic.id === topic_id);
}

export function getMarkdownPath(params: RouteParams, type: string = 'theory'): string | null {
    const { level_id, subject_id, chapter_id, topic_id } = params;

    const topicNode = getTopicNode(level_id, subject_id, chapter_id, topic_id);
    
    if (topicNode) {
        return `/content/${level_id}/${subject_id}/${chapter_id}/${topic_id}${type == "formulary" ? `-formulary` : ''}.md`;
    }

    return null;
}

export const currentContent = writable(null);