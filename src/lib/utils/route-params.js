import { contentStore } from '$lib/stores/content.js';
import { writable } from 'svelte/store';

export function extractRouteParams(pathname) {
    const segments = pathname.split('/').filter(Boolean);
    
    const levelIndex = segments.findIndex(segment => 
        segment === 'superiori' || segment === 'universita'
    );
    
    if (levelIndex === -1) {
        return null;
    }

    const level = segments[levelIndex];
    let subject, year, topic, subtopic;
    
    if (level === 'superiori') {
        subject = segments[levelIndex + 1];
        year = segments[levelIndex + 2];
        topic = segments[levelIndex + 3];
        subtopic = segments[levelIndex + 4];
    } else if (level === 'universita') {
        subject = segments[levelIndex + 1];
        topic = segments[levelIndex + 2];
        subtopic = segments[levelIndex + 3];
    }

    return {
        level,
        subject,
        year,
        topic,
        subtopic
    };
}

export function getContentFromParams(params) {
    const { level, subject, year, topic: topicKey, subtopic: subtopicKey } = params;
    
    let content = null;
    contentStore.subscribe((c) => {
        content = c;
    })

    try {
        let result = {};
        
        if (!content.flatNodes || content.flatNodes.length === 0) {
            return null;
        }
        
        if (level === 'superiori') {
            const topicPath = [level, subject, year, topicKey];
            
            const topicNode = content.flatNodes.find(node => 
                node.node_type === 'topic' && 
                node.path?.length === topicPath.length &&
                node.path.every((segment, i) => segment === topicPath[i])
            );
            
            if (subtopicKey && topicNode) {
                const subtopicNode = content.flatNodes.find(node => 
                    node.node_type === 'subtopic' && 
                    node.parent_id === topicNode.id && 
                    node.slug === subtopicKey
                );
                
                if (subtopicNode) {
                    result = {
                        ...subtopicNode,
                        parentTopic: topicNode,
                        level,
                        subject,
                        year,
                        key: subtopicKey
                    };
                }
            } 
            else if (topicNode) {
                result = { 
                    ...topicNode,
                    level,
                    subject,
                    year,
                    key: topicKey
                };
            }
        } else if (level === 'universita') {
            const coursePath = [level, subject];
            
            const courseNode = content.flatNodes.find(node => 
                node.node_type === 'subject' && 
                node.path?.length === coursePath.length &&
                node.path.every((segment, i) => segment === coursePath[i])
            );
            
            if (topicKey && courseNode) {
                const topicPath = [...coursePath, topicKey];
                const topicNode = content.flatNodes.find(node => 
                    node.node_type === 'topic' && 
                    node.parent_id === courseNode.id && 
                    node.slug === topicKey
                );
                
                if (subtopicKey && topicNode) {
                    const subtopicNode = content.flatNodes.find(node => 
                        node.node_type === 'subtopic' && 
                        node.parent_id === topicNode.id && 
                        node.slug === subtopicKey
                    );
                    
                    if (subtopicNode) {
                        result = {
                            ...subtopicNode,
                            parentTopic: topicNode,
                            level,
                            subject,
                            topic: topicKey,
                            key: subtopicKey
                        };
                    }
                } else if (topicNode) {
                    result = {
                        ...topicNode,
                        level,
                        subject,
                        key: topicKey
                    };
                }
            } else if (courseNode) {
                result = {
                    ...courseNode,
                    level,
                    subject,
                    key: subject
                };
            }
        }
        
        return result;
    } catch (error) {
        console.error('Error getting content from params:', error);
        return null;
    }
}

export function getMarkdownPath(params) {
    const { level, subject, year, topic: topicKey, subtopic: subtopicKey } = params;

    let content = null;
    contentStore.subscribe((c) => {
        content = c;
    })
    
    if (!content.flatNodes || content.flatNodes.length === 0) {
        return null;
    }
    
    let node = null;
    
    if (level === 'superiori') {
        if (subtopicKey) {
            const topicPath = [level, subject, year, topicKey];
            const topicNode = content.flatNodes.find(node => 
                node.node_type === 'topic' && 
                node.path?.length === topicPath.length &&
                node.path.every((segment, i) => segment === topicPath[i])
            );
            
            if (topicNode) {
                node = content.flatNodes.find(node => 
                    node.node_type === 'subtopic' && 
                    node.parent_id === topicNode.id && 
                    node.slug === subtopicKey
                );
            }
            
            if (node) {
                return `/teoria/${level}/${subject}/${year}/${topicKey}/${subtopicKey}.md`;
            }
        } 
        else {
            const topicPath = [level, subject, year, topicKey];
            node = content.flatNodes.find(node => 
                node.node_type === 'topic' && 
                node.path?.length === topicPath.length &&
                node.path.every((segment, i) => segment === topicPath[i])
            );
            
            if (node) {
                return `/teoria/${level}/${subject}/${year}/${topicKey}.md`;
            }
        }
    } 
    else if (level === 'universita') {
        if (subtopicKey) {
            const coursePath = [level, subject];
            const courseNode = content.flatNodes.find(node => 
                node.node_type === 'subject' && 
                node.path?.length === coursePath.length &&
                node.path.every((segment, i) => segment === coursePath[i])
            );
            
            if (courseNode && topicKey) {
                const topicNode = content.flatNodes.find(node => 
                    node.node_type === 'topic' && 
                    node.parent_id === courseNode.id && 
                    node.slug === topicKey
                );
                
                if (topicNode) {
                    node = content.flatNodes.find(node => 
                        node.node_type === 'subtopic' && 
                        node.parent_id === topicNode.id && 
                        node.slug === subtopicKey
                    );
                }
            }
            
            if (node) {
                return `/teoria/${level}/${subject}/${topicKey}/${subtopicKey}.md`;
            }
        }
        else if (topicKey) {
            const coursePath = [level, subject];
            const courseNode = content.flatNodes.find(node => 
                node.node_type === 'subject' && 
                node.path?.length === coursePath.length &&
                node.path.every((segment, i) => segment === coursePath[i])
            );
            
            if (courseNode) {
                node = content.flatNodes.find(node => 
                    node.node_type === 'topic' && 
                    node.parent_id === courseNode.id && 
                    node.slug === topicKey
                );
            }
            
            if (node) {
                return `/teoria/${level}/${subject}/${topicKey}.md`;
            }
        }
        else {
            const coursePath = [level, subject];
            node = content.flatNodes.find(node => 
                node.node_type === 'subject' && 
                node.path?.length === coursePath.length &&
                node.path.every((segment, i) => segment === coursePath[i])
            );
            
            if (node) {
                return `/teoria/${level}/${subject}.md`;
            }
        }
    }
    
    if (level && subject) {
        if (level === 'superiori' && year && topicKey) {
            return subtopicKey 
                ? `/teoria/${level}/${subject}/${year}/${topicKey}/${subtopicKey}.md`
                : `/teoria/${level}/${subject}/${year}/${topicKey}.md`;
        } else if (level === 'universita') {
            if (subtopicKey && topicKey) {
                return `/teoria/${level}/${subject}/${topicKey}/${subtopicKey}.md`;
            } else if (topicKey) {
                return `/teoria/${level}/${subject}/${topicKey}.md`;
            } else {
                return `/teoria/${level}/${subject}.md`;
            }
        }
    }
    
    return null;
}

export const currentContent = writable(null);