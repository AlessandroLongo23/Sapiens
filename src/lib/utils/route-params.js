/**
 * Utility functions for route parameter handling in the application
 */

import { contentStore } from '$lib/stores/content/content.js';
import { writable } from 'svelte/store';

/**
 * Extracts level, subject, year, topic, and subtopic (if available) from a URL pathname
 * 
 * @param {string} pathname - The URL pathname
 * @returns {Object} An object containing the extracted parameters
 */
export function extractRouteParams(pathname) {
    const segments = pathname.split('/').filter(Boolean);
    
    // Find the level index (superiori or università)
    const levelIndex = segments.findIndex(segment => 
        segment === 'superiori' || segment === 'università'
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
    } else if (level === 'università') {
        subject = segments[levelIndex + 1];
        topic = segments[levelIndex + 2];
    }

    return {
        level,
        subject,
        year,
        topic,
        subtopic
    };
}

/**
 * Get content data for the current route
 * 
 * @param {Object} params - The route parameters object
 * @returns {Object} The content data for the current route
 */
export function getContentFromParams(params) {
    const { level, subject, year, topic: topicKey, subtopic: subtopicKey } = params;
    
    try {
        let result = {};
        
        if (!$contentStore.flatNodes || $contentStore.flatNodes.length === 0) {
            return null;
        }
        
        if (level === 'superiori') {
            // Construct path to find the topic
            const topicPath = [level, subject, year, topicKey];
            
            // Find topic node
            const topicNode = $contentStore.flatNodes.find(node => 
                node.node_type === 'topic' && 
                node.path?.length === topicPath.length &&
                node.path.every((segment, i) => segment === topicPath[i])
            );
            
            // For topics with subtopics
            if (subtopicKey && topicNode) {
                // Find subtopic node
                const subtopicNode = $contentStore.flatNodes.find(node => 
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
            // For main topics
            else if (topicNode) {
                result = { 
                    ...topicNode,
                    level,
                    subject,
                    year,
                    key: topicKey
                };
            }
        } else if (level === 'università') {
            // Construct path to find the university course
            const coursePath = [level, subject];
            
            // Find course node
            const courseNode = $contentStore.flatNodes.find(node => 
                (node.node_type === 'subject' || node.node_type === 'topic') && 
                node.path?.length === coursePath.length &&
                node.path.every((segment, i) => segment === coursePath[i])
            );
            
            // For university subtopics
            if (subtopicKey && courseNode) {
                // Find subtopic node
                const subtopicNode = $contentStore.flatNodes.find(node => 
                    node.node_type === 'subtopic' && 
                    node.parent_id === courseNode.id && 
                    node.slug === subtopicKey
                );
                
                if (subtopicNode) {
                    result = {
                        ...subtopicNode,
                        parentTopic: courseNode,
                        level,
                        subject,
                        key: subtopicKey
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

/**
 * Get the markdown file path for a topic or subtopic
 * 
 * @param {Object} params - The route parameters object
 * @returns {string} The path to the markdown file
 */
export function getMarkdownPath(params) {
    const { level, subject, year, topic: topicKey, subtopic: subtopicKey } = params;
    
    if (!$contentStore.flatNodes || $contentStore.flatNodes.length === 0) {
        return null;
    }
    
    // Find the appropriate node based on path
    let node = null;
    
    if (level === 'superiori') {
        // With subtopic
        if (subtopicKey) {
            // Find topic node first
            const topicPath = [level, subject, year, topicKey];
            const topicNode = $contentStore.flatNodes.find(node => 
                node.node_type === 'topic' && 
                node.path?.length === topicPath.length &&
                node.path.every((segment, i) => segment === topicPath[i])
            );
            
            if (topicNode) {
                // Find subtopic
                node = $contentStore.flatNodes.find(node => 
                    node.node_type === 'subtopic' && 
                    node.parent_id === topicNode.id && 
                    node.slug === subtopicKey
                );
            }
            
            if (node) {
                return `/teoria/${level}/${subject}/${year}/${topicKey}/${subtopicKey}.md`;
            }
        } 
        // Main topic
        else {
            const topicPath = [level, subject, year, topicKey];
            node = $contentStore.flatNodes.find(node => 
                node.node_type === 'topic' && 
                node.path?.length === topicPath.length &&
                node.path.every((segment, i) => segment === topicPath[i])
            );
            
            if (node) {
                return `/teoria/${level}/${subject}/${year}/${topicKey}.md`;
            }
        }
    } 
    else if (level === 'università') {
        // With subtopic
        if (subtopicKey) {
            const coursePath = [level, subject];
            const courseNode = $contentStore.flatNodes.find(node => 
                (node.node_type === 'subject' || node.node_type === 'topic') && 
                node.path?.length === coursePath.length &&
                node.path.every((segment, i) => segment === coursePath[i])
            );
            
            if (courseNode) {
                node = $contentStore.flatNodes.find(node => 
                    node.node_type === 'subtopic' && 
                    node.parent_id === courseNode.id && 
                    node.slug === subtopicKey
                );
            }
            
            if (node) {
                return `/teoria/${level}/${subject}/${subtopicKey}.md`;
            }
        }
        // Main course
        else {
            const coursePath = [level, subject];
            node = $contentStore.flatNodes.find(node => 
                (node.node_type === 'subject' || node.node_type === 'topic') && 
                node.path?.length === coursePath.length &&
                node.path.every((segment, i) => segment === coursePath[i])
            );
            
            if (node) {
                return `/teoria/${level}/${subject}.md`;
            }
        }
    }
    
    // Fallback to constructed path based on parameters
    if (level && subject) {
        if (level === 'superiori' && year && topicKey) {
            return subtopicKey 
                ? `/teoria/${level}/${subject}/${year}/${topicKey}/${subtopicKey}.md`
                : `/teoria/${level}/${subject}/${year}/${topicKey}.md`;
        } else if (level === 'università') {
            return subtopicKey
                ? `/teoria/${level}/${subject}/${subtopicKey}.md`
                : `/teoria/${level}/${subject}.md`;
        }
    }
    
    return null;
}

// Store for the current content
export const currentContent = writable(null);