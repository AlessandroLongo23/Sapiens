import { error } from '@sveltejs/kit';
import { configs, type TopicConfig } from '$lib/exercises/config.js';
import type { Exercise } from '$lib/exercises/abstract.svelte.js';

const exerciseModulesJs = import.meta.glob('/src/lib/exercises/*.svelte.js');
const exerciseModulesTs = import.meta.glob('/src/lib/exercises/*.svelte.ts');

/**
 * `available`: this lesson has an exercise generator.
 * `locked`: it has one, but the visitor's plan does not include exercises;
 * nothing is generated and the generator module is not loaded.
 */

/** @type {import('./$types').PageLoad} */
export async function load({ parent, data }) {
	const { node, dbPath } = await parent();

	if (node.type !== 'topic') {
		throw error(404, 'Pagina non trovata.');
	}

	const topicSlug = node.slug;
	const moduleImporterJs = exerciseModulesJs[`/src/lib/exercises/${topicSlug}.svelte.js`];
	const moduleImporterTs = exerciseModulesTs[`/src/lib/exercises/${topicSlug}.svelte.ts`];
	const topicConfig: TopicConfig | undefined = configs[dbPath];
	const available = !!topicConfig && !!(moduleImporterJs || moduleImporterTs);

	if (!available) {
		return { ...data, exercises: [] as Exercise[], available: false, locked: false };
	}
	if (!data.access.exercises) {
		return { ...data, exercises: [] as Exercise[], available: true, locked: true };
	}

	try {
		const exerciseModule = (moduleImporterJs ? await moduleImporterJs() : await moduleImporterTs()) as Record<string, any>;

		const exercises: Exercise[] = [];
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

		return { ...data, exercises, available: true, locked: false };
	} catch (e) {
		console.error(e);
		return { ...data, exercises: [] as Exercise[], available: false, locked: false };
	}
}
