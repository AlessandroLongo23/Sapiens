import { content } from "$lib/content.js";

function flattenTopics(node, path = '', allTopics = {}) {
    if (!node) {
        return;
    }

    for (const key in node) {
        if (Object.prototype.hasOwnProperty.call(node, key)) {
            const newPath = path ? `${path}/${key}` : key;
            const topic = node[key];

            if (topic.path) { // It's a leaf node
                allTopics[newPath] = {
                    id: newPath,
                    title: topic.title,
                    description: topic.description,
                    path: topic.path,
                };
            } else { // It's a branch
                flattenTopics(topic, newPath, allTopics);
            }
        }
    }
    return allTopics;
}

function buildTopicTree(assignedTopicIds) {
    const filteredContent = {};

    for (const id of assignedTopicIds) {
        const pathParts = id.split('/');
        let currentLevel = filteredContent;
        let contentLevel = content;

        for (let i = 0; i < pathParts.length; i++) {
            const part = pathParts[i];
            contentLevel = contentLevel[part];

            if (!currentLevel[part]) {
                // If it's the leaf node, copy the whole topic object
                if (i === pathParts.length - 1) {
                    currentLevel[part] = contentLevel;
                } else {
                    // Otherwise, just create an empty object to traverse
                    currentLevel[part] = {};
                }
            }
            currentLevel = currentLevel[part];
        }
    }

    // Now we need to fill in the non-leaf node data (like titles, descriptions if they exist)
    function addBranchData(filtered, original, path = []) {
        for (const key in filtered) {
            const currentPath = [...path, key];
            const originalNode = currentPath.reduce((o, k) => o[k], content);
            
            if (originalNode && !originalNode.path) { // It's a branch
                // Copy all properties except children
                Object.keys(originalNode).forEach(propKey => {
                    if (typeof originalNode[propKey] !== 'object') {
                        filtered[key][propKey] = originalNode[propKey];
                    }
                });
                addBranchData(filtered[key], originalNode, currentPath);
            }
        }
    }

    addBranchData(filteredContent, content);
    
    return filteredContent;
}

export const allTopics = flattenTopics(content);

export const getTopicsForStudent = (assignedIds) => {
    if (!assignedIds) return {};
    return buildTopicTree(assignedIds);
};
