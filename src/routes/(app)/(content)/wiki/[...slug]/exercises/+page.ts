import { error } from '@sveltejs/kit';
import { configs, type TopicConfig } from '$lib/exercises/config.js';
import type { Exercise } from '$lib/exercises/abstract.svelte.js';

const exerciseModulesJs = import.meta.glob('/src/lib/exercises/*.svelte.js');
const exerciseModulesTs = import.meta.glob('/src/lib/exercises/*.svelte.ts');

export async function load({ parent }) {
	const { node, pathSegments } = await parent();
	
	const configPath = pathSegments.map((n: { slug: string }) => n.slug).join('/');
	const topicSlug = node.slug;

	const modulePathJs = `/src/lib/exercises/${topicSlug}.svelte.js`;
	const modulePathTs = `/src/lib/exercises/${topicSlug}.svelte.ts`;

	try {
		const moduleImporterJs = exerciseModulesJs[modulePathJs];
		const moduleImporterTs = exerciseModulesTs[modulePathTs];
		
		if (!moduleImporterJs && !moduleImporterTs) {
			console.warn(`Exercise module not found for topic: ${topicSlug}`);
			return { exercises: [] };
		}
		
		const exerciseModule = moduleImporterJs ? await moduleImporterJs() : await moduleImporterTs();

		const topicConfig: TopicConfig = configs[configPath];
		if (!topicConfig) {
			console.warn(`No exercise configuration found for ${configPath}`);
			return { exercises: [] };
		}

		let exercises: Exercise[] = [];
		for (const config of Object.values(topicConfig)) {
			const { generator, count, args } = config;
			const generatorInstance = exerciseModule[generator];

			if (!generatorInstance) {
				throw error(500, `Generator '${generator}' not found in ${topicSlug}.svelte.js`);
			}

			for (let i = 0; i < count; i++) {
				const instance: Exercise = new generatorInstance(...args);
				exercises.push(instance);
			}
		}
		
		exercises.shuffle();

		return { exercises };
	} catch (e) {
		console.error(e);
		return { exercises: [] };
	}
}
