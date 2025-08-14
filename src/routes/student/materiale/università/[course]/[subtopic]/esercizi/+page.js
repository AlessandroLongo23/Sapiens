import { error } from '@sveltejs/kit';
import { configs } from '$lib/exercises/config.js';
import { contentStore } from '$lib/stores/content/content.js';

const exerciseModules = import.meta.glob('/src/lib/exercises/*.svelte.js');

export async function load({ params }) {
	const { path } = params;
	const [level, subject, year, topicKey, subtopicKey] = path.split('/');
	
	// Determine the appropriate topic name for loading exercises
	let topicName;
	let topicTitle;
	let configPath;
	
	// If we have a subtopic, use it as the topic name
	if (subtopicKey) {
		topicName = subtopicKey;
		configPath = `${level}/${subject}/${year}/${topicKey}/${subtopicKey}`;
		
		if ($contentStore.content[level]?.[subject]?.[year]?.topics?.[topicKey]?.subtopics?.[subtopicKey]) {
			topicTitle = $contentStore.content[level][subject][year].topics[topicKey].subtopics[subtopicKey].title;
		}
	}
	// Otherwise use the main topic
	else {
		topicName = topicKey;
		configPath = `${level}/${subject}/${year}/${topicKey}`;
		
		if ($contentStore.content[level]?.[subject]?.[year]?.topics?.[topicKey]) {
			topicTitle = $contentStore.content[level][subject][year].topics[topicKey].title;
		}
	}
	
	// Fallback to the last part of the path for title
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

		// First try the new path format
		let topicConfig = configs[configPath];
		// Fallback to old path format if not found
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
		
		// Add array shuffle method if not exists
		if (!Array.prototype.shuffle) {
			Array.prototype.shuffle = function() {
				for (let i = this.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));
					[this[i], this[j]] = [this[j], this[i]];
				}
				return this;
			};
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
