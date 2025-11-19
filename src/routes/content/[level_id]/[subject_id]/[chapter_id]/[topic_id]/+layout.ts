import { getTopicNode, type RouteParams } from '$lib/utils/route-params.svelte.js';
import type { TopicNode } from '$lib/data/content-tree.js';

export async function load({ params }) {
    const { level_id, subject_id, chapter_id, topic_id }: RouteParams = params;
    const topicNode: TopicNode | null = getTopicNode(level_id, subject_id, chapter_id, topic_id);
    
    return {
        title: topicNode?.name || 'Topic',
        level_id,
        subject_id,
        chapter_id,
        topic_id
    };
}

