import { error } from '@sveltejs/kit';
import { configs } from '$lib/exercises/config.js';

const exerciseModules = import.meta.glob('/src/lib/exercises/*.svelte.js');

export async function load({ params }) {
	const { topicPath } = params;
	const topicName = topicPath.split('/').pop();
	const modulePath = `/src/lib/exercises/${topicName}.svelte.js`;

	try {
		const moduleImporter = exerciseModules[modulePath];
		if (!moduleImporter) {
			throw error(404, `Exercise module not found for topic: ${topicName}`);
		}
		const exerciseModule = await moduleImporter();

		const topicConfig = configs[topicPath];
		if (!topicConfig) {
			throw error(404, `No exercise configuration found for ${topicPath}`);
		}

		let exercises = [];
		for (const exercise of Object.values(topicConfig)) {
			const { generator: generatorName, count, args } = exercise;
			console.log(generatorName, count, args);
			const generator = exerciseModule[generatorName];

			if (!generator) {
				throw error(500, `Generator '${generatorName}' not found in ${topicName}.svelte.js`);
			}

			for (let i = 0; i < count; i++) {
				const instance = new generator(...args);
				exercises.push({
					question: instance.question,
					answers: instance.answers,
					correctAnswer: instance.correctAnswer
				});
			}
		}
		exercises.shuffle();

		return {
			exercises: exercises,
			title: topicPath.split('/').pop().replace(/-/g, ' ')
		};
	} catch (e) {
		console.error(e);
		if (e.status) {
			throw e;
		}
		throw error(500, `Failed to load exercises for ${topicName}: ${e.message}`);
	}
} 