import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { contentTree } from "$lib/data/content-tree"

// Load environment variables (.env)
dotenv.config();

// 1. SETUP SUPABASE
const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use Service Role Key to bypass RLS if needed

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. YOUR DATA (Paste contentTree here or import it)
// NOTE: I have sanitized the icons here to be strings or null to avoid runtime errors with Svelte components.

// Helper to insert a single node
async function insertNode({ parentId, type, title, slug, position, description = null }) {
  const { data, error } = await supabase
    .from('content_nodes')
    .insert({
      parent_id: parentId,
      type: type,
      title: title,
      slug: slug,
      position: position,
      description: description,
      metadata: {} // You can add extra data here if needed
    })
    .select('id')
    .single();

  if (error) {
    console.error(`Error inserting ${type} "${title}":`, error.message);
    return null;
  }
  
  return data.id;
}

// 3. THE RECURSIVE MIGRATION FUNCTION
export async function migrateContent() {
  console.log('Starting migration...');

  // 1. Iterate Levels (Root nodes)
  for (const [levelIndex, level] of contentTree.entries()) {
    console.log(`Processing Level: ${level.name}`);
    
    const levelId = await insertNode({
      parentId: null, // Root has no parent
      type: 'level',
      title: level.name, //
      slug: level.id,    //
      position: levelIndex
    });

    if (!levelId) continue;

    // 2. Iterate Subjects
    if (level.subjects) {
      for (const [subjIndex, subject] of level.subjects.entries()) {
        const subjectId = await insertNode({
          parentId: levelId,
          type: 'subject',
          title: subject.name,
          slug: subject.id,
          position: subjIndex
        });

        if (!subjectId) continue;

        // 3. Iterate Chapters
        if (subject.chapters) {
          for (const [chapIndex, chapter] of subject.chapters.entries()) {
            const chapterId = await insertNode({
              parentId: subjectId,
              type: 'chapter',
              title: chapter.name,
              slug: chapter.id,
              position: chapIndex
            });

            if (!chapterId) continue;

            // 4. Iterate Topics
            if (chapter.topics) {
              for (const [topicIndex, topic] of chapter.topics.entries()) {
                await insertNode({
                  parentId: chapterId,
                  type: 'topic',
                  title: topic.name,
                  slug: topic.id,
                  position: topicIndex
                });
              }
            }
          }
        }
      }
    }
  }

  console.log('Migration complete!');
}