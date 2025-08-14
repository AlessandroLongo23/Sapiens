// import { supabase } from '$lib/supabase.js';
// import { content } from '$lib/content.js';

// // This function will migrate the existing content structure to the new database format
// export async function migrateContentToDatabase() {
//     try {
//         console.log('Starting content migration...');
        
//         // Helper function to flatten the content structure
//         function flattenContent(obj, parentId = null, nodeType, path = [], result = []) {
//             if (!obj) return result;
            
//             // Process each key in the object
//             for (const [key, value] of Object.entries(obj)) {
//                 if (key === 'topics' || key === 'subtopics') continue; // Skip these keys, we'll process their content separately
                
//                 // Skip if value is not an object or is null
//                 if (!value || typeof value !== 'object') continue;
                
//                 // For education levels (superiori, università)
//                 if (nodeType === 'level') {
//                     const currentPath = [...path, key];
//                     const nodeData = {
//                         parent_id: parentId,
//                         node_type: 'level',
//                         slug: key,
//                         title: key.charAt(0).toUpperCase() + key.slice(1),
//                         path: currentPath
//                     };
                    
//                     result.push(nodeData);
                    
//                     // Process subjects within this level
//                     if (value) {
//                         result = flattenContent(value, null, 'subject', currentPath, result);
//                     }
//                 }
//                 // For subjects (matematica, informatica)
//                 else if (nodeType === 'subject') {
//                     const currentPath = [...path, key];
//                     const nodeData = {
//                         parent_id: parentId,
//                         node_type: 'subject',
//                         slug: key,
//                         title: value.title || key.charAt(0).toUpperCase() + key.slice(1),
//                         path: currentPath
//                     };
                    
//                     result.push(nodeData);
                    
//                     // Process years within this subject
//                     if (value) {
//                         result = flattenContent(value, null, 'year', currentPath, result);
//                     }
//                 }
//                 // For years (1, 2, 3)
//                 else if (nodeType === 'year') {
//                     if (key !== 'title' && key !== 'description' && key !== 'icon') {
//                         const currentPath = [...path, key];
//                         const nodeData = {
//                             parent_id: parentId,
//                             node_type: 'year',
//                             slug: key,
//                             title: `Anno ${key}`,
//                             path: currentPath
//                         };
                        
//                         result.push(nodeData);
                        
//                         // Process topics within this year
//                         if (value.topics) {
//                             for (const [topicSlug, topicData] of Object.entries(value.topics)) {
//                                 const topicPath = [...currentPath, topicSlug];
//                                 const topicNode = {
//                                     parent_id: null, // Will be set after insertion
//                                     node_type: 'topic',
//                                     slug: topicSlug,
//                                     title: topicData.title || topicSlug,
//                                     description: topicData.description || '',
//                                     icon: topicData.icon || '',
//                                     path: topicPath
//                                 };
                                
//                                 result.push(topicNode);
                                
//                                 // Process subtopics
//                                 if (topicData.subtopics) {
//                                     for (const [subtopicSlug, subtopicData] of Object.entries(topicData.subtopics)) {
//                                         const subtopicPath = [...topicPath, subtopicSlug];
//                                         const subtopicNode = {
//                                             parent_id: null, // Will be set after insertion
//                                             node_type: 'subtopic',
//                                             slug: subtopicSlug,
//                                             title: subtopicData.title || subtopicSlug,
//                                             description: subtopicData.description || '',
//                                             icon: subtopicData.icon || '',
//                                             path: subtopicPath
//                                         };
                                        
//                                         result.push(subtopicNode);
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
            
//             return result;
//         }
        
//         // Start with education levels
//         const flatNodes = flattenContent(content, null, 'level');
        
//         // Clear existing content nodes (optional - remove this in production)
//         await supabase.from('content_nodes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        
//         console.log(`Generated ${flatNodes.length} nodes to insert`);
        
//         // Insert education levels first
//         const levels = flatNodes.filter(node => node.node_type === 'level');
//         const levelInsertResult = await supabase.from('content_nodes').insert(levels).select();
        
//         if (levelInsertResult.error) {
//             throw new Error(`Failed to insert levels: ${levelInsertResult.error.message}`);
//         }
        
//         const levelMap = {};
//         levelInsertResult.data.forEach(level => {
//             // Map path to id
//             const pathKey = level.path.join('/');
//             levelMap[pathKey] = level.id;
//         });
        
//         // Update and insert subjects
//         const subjects = flatNodes.filter(node => node.node_type === 'subject');
//         subjects.forEach(subject => {
//             const levelPath = subject.path.slice(0, 1).join('/');
//             subject.parent_id = levelMap[levelPath];
//         });
        
//         const subjectInsertResult = await supabase.from('content_nodes').insert(subjects).select();
        
//         if (subjectInsertResult.error) {
//             throw new Error(`Failed to insert subjects: ${subjectInsertResult.error.message}`);
//         }
        
//         const subjectMap = {};
//         subjectInsertResult.data.forEach(subject => {
//             const pathKey = subject.path.join('/');
//             subjectMap[pathKey] = subject.id;
//         });
        
//         // Update and insert years
//         const years = flatNodes.filter(node => node.node_type === 'year');
//         years.forEach(year => {
//             const subjectPath = year.path.slice(0, 2).join('/');
//             year.parent_id = subjectMap[subjectPath];
//         });
        
//         const yearInsertResult = await supabase.from('content_nodes').insert(years).select();
        
//         if (yearInsertResult.error) {
//             throw new Error(`Failed to insert years: ${yearInsertResult.error.message}`);
//         }
        
//         const yearMap = {};
//         yearInsertResult.data.forEach(year => {
//             const pathKey = year.path.join('/');
//             yearMap[pathKey] = year.id;
//         });
        
//         // Update and insert topics
//         const topics = flatNodes.filter(node => node.node_type === 'topic');
//         topics.forEach(topic => {
//             const yearPath = topic.path.slice(0, 3).join('/');
//             topic.parent_id = yearMap[yearPath];
//         });
        
//         const topicInsertResult = await supabase.from('content_nodes').insert(topics).select();
        
//         if (topicInsertResult.error) {
//             throw new Error(`Failed to insert topics: ${topicInsertResult.error.message}`);
//         }
        
//         const topicMap = {};
//         topicInsertResult.data.forEach(topic => {
//             const pathKey = topic.path.join('/');
//             topicMap[pathKey] = topic.id;
//         });
        
//         // Update and insert subtopics
//         const subtopics = flatNodes.filter(node => node.node_type === 'subtopic');
//         subtopics.forEach(subtopic => {
//             const topicPath = subtopic.path.slice(0, 4).join('/');
//             subtopic.parent_id = topicMap[topicPath];
//         });
        
//         const subtopicInsertResult = await supabase.from('content_nodes').insert(subtopics).select();
        
//         if (subtopicInsertResult.error) {
//             throw new Error(`Failed to insert subtopics: ${subtopicInsertResult.error.message}`);
//         }
        
//         console.log('Content migration completed successfully');
//         return {
//             levels: levelInsertResult.data.length,
//             subjects: subjectInsertResult.data.length,
//             years: yearInsertResult.data.length,
//             topics: topicInsertResult.data.length,
//             subtopics: subtopicInsertResult.data.length,
//             total: levelInsertResult.data.length + subjectInsertResult.data.length + 
//                     yearInsertResult.data.length + topicInsertResult.data.length + subtopicInsertResult.data.length
//         };
//     } catch (error) {
//         console.error('Error during content migration:', error);
//         throw error;
//     }
// }