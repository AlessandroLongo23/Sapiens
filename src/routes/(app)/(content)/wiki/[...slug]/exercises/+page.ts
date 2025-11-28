import { error } from '@sveltejs/kit';
import { configs, type TopicConfig } from '$lib/exercises/config.js';
import type { Exercise } from '$lib/exercises/abstract.svelte.js';

const exerciseModulesJs = import.meta.glob('/src/lib/exercises/*.svelte.js');
const exerciseModulesTs = import.meta.glob('/src/lib/exercises/*.svelte.ts');

export async function load({ params }) {
	const { level_id, subject_id, chapter_id, topic_id } = params;
	
	let configPath = `${level_id}/${subject_id}/${chapter_id}/${topic_id}`;
	
	const modulePathJs = `/src/lib/exercises/${topic_id}.svelte.js`;
	const modulePathTs = `/src/lib/exercises/${topic_id}.svelte.ts`;

	try {
		const moduleImporterJs = exerciseModulesJs[modulePathJs];
		const moduleImporterTs = exerciseModulesTs[modulePathTs];
		if (!moduleImporterJs && !moduleImporterTs) {
			console.warn(`Exercise module not found for topic: ${topic_id}`);
			return {
				exercises: [],
				topic_id,
                level_id, 
                subject_id, 
                chapter_id
			};
		}
		const exerciseModule = moduleImporterJs ? await moduleImporterJs() : await moduleImporterTs();

		const topicConfig: TopicConfig = configs[configPath];
		if (!topicConfig) {
			console.warn(`No exercise configuration found for ${configPath}`);
			return {
				exercises: [],
				topic_id,
                level_id, 
                subject_id, 
                chapter_id
			};
		}

		let exercises: Exercise[] = [];
		for (const config of Object.values(topicConfig)) {
			const { generator, count, args } = config;
			const generatorInstance = exerciseModule[generator];

			if (!generatorInstance) {
				throw error(500, `Generator '${generator}' not found in ${topic_id}.svelte.js`);
			}

			for (let i = 0; i < count; i++) {
				const instance: Exercise = new generatorInstance(...args);
				exercises.push(instance);
			}
		}
		
		exercises.shuffle();

		return {
			exercises,
			topic_id,
            level_id, 
            subject_id, 
            chapter_id
		};
	} catch (e) {
		console.error(e);
		return {
            exercises: [],
            topic_id,
            level_id, 
            subject_id, 
            chapter_id
        };
	}
}
