import { error } from '@sveltejs/kit';
import { configs } from '$lib/exercises/config.js';
import { getContentFromParams } from '$lib/utils/route-params.js';

const exerciseModules = import.meta.glob('/src/lib/exercises/*.svelte.js');

export async function load({ params }) {
	const { subject, year, topic: topicKey, subtopic: subtopicKey } = params;
	const level = 'superiori';
	
	let topicName;
	let topicTitle;
	let configPath;
	
	if (subtopicKey) {
		topicName = subtopicKey;
		configPath = `${level}/${subject}/${year}/${topicKey}/${subtopicKey}`;
	}
	else {
		topicName = topicKey;
		configPath = `${level}/${subject}/${year}/${topicKey}`;
	}
	
	if (!topicTitle) {
		topicTitle = topicName.replace(/-/g, ' ');
	}

	const modulePath = `/src/lib/exercises/${topicName}.svelte.js`;

	try {
		const moduleImporter = exerciseModules[modulePath];
		if (!moduleImporter) {
			throw error(404, `Exercise module not found for topic: ${topicName}`);
		}
		const exerciseModule = await moduleImporter();

		let topicConfig = configs[configPath];
		if (!topicConfig) {
			topicConfig = configs[path];
		}
		if (!topicConfig) {
			throw error(404, `No exercise configuration found for ${configPath}`);
		}

		let exercises = [];
		for (const exercise of Object.values(topicConfig)) {
			const { generator: generatorName, count, args } = exercise;
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
			title: topicTitle,
			level,
			subject,
			year,
			topicKey,
			subtopicKey
		};
	} catch (e) {
		console.error(e);
		if (e.status) {
			throw e;
		}
		throw error(500, `Failed to load exercises for ${topicName}: ${e.message}`);
	}
}
