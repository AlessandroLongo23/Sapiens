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
        
        if (level === 'superiori') {
            // For topics with subtopics
            if (subtopicKey && $contentStore.content[level]?.[subject]?.[year]?.topics?.[topicKey]?.subtopics?.[subtopicKey]) {
                result = {
                    ...$contentStore.content[level][subject][year].topics[topicKey].subtopics[subtopicKey],
                    parentTopic: $contentStore.content[level][subject][year].topics[topicKey],
                    level,
                    subject,
                    year,
                    key: subtopicKey
                };
            } 
            // For main topics
            else if ($contentStore.content[level]?.[subject]?.[year]?.topics?.[topicKey]) {
                result = { 
                    ...$contentStore.content[level][subject][year].topics[topicKey],
                    level,
                    subject,
                    year,
                    key: topicKey
                };
            }
        } else if (level === 'università') {
            // For university courses
            if (subtopicKey && $contentStore.content[level]?.[subject]?.subtopics?.[subtopicKey]) {
                result = {
                    ...$contentStore.content[level][subject].subtopics[subtopicKey],
                    parentTopic: $contentStore.content[level][subject],
                    level,
                    subject,
                    key: subtopicKey
                };
            } else if ($contentStore.content[level]?.[subject]) {
                result = {
                    ...$contentStore.content[level][subject],
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
    
    // If we have a subtopic, get its path from the content structure
    if (level === 'superiori') {
        if (subtopicKey && $contentStore.content[level]?.[subject]?.[year]?.topics?.[topicKey]?.subtopics?.[subtopicKey]) {
            return `/teoria/${level}/${subject}/${year}/${topicKey}/${subtopicKey}.md`;
        } 
        // Otherwise, use the topic's path
        else if ($contentStore.content[level]?.[subject]?.[year]?.topics?.[topicKey]) {
            return `/teoria/${level}/${subject}/${year}/${topicKey}.md`;
        }
    } else if (level === 'università') {
        if (subtopicKey && $contentStore.content[level]?.[subject]?.subtopics?.[subtopicKey]) {
            return `/teoria/${level}/${subject}/${subtopicKey}.md`;
        } else if ($contentStore.content[level]?.[subject]) {
            return `/teoria/${level}/${subject}.md`;
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
