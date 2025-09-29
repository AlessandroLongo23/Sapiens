import { error } from '@sveltejs/kit';
import { configs } from '$lib/exercises/config.js';
import { contentStore } from '$lib/stores/content.js';

const exerciseModules = import.meta.glob('/src/lib/exercises/*.svelte.js');

export async function load({ params }) {
	const { course, topic: topicKey, subtopic: subtopicKey } = params;
	const level = 'universita';
	const subject = course;
	
	let topicName;
	let topicTitle;
	let configPath;
	
	if (subtopicKey) {
		topicName = subtopicKey;
		configPath = `${level}/${subject}/${topicKey}/${subtopicKey}`;
		
		const coursePath = [level, subject];
		const courseNode = $contentStore.flatNodes.find(node => 
			node.node_type === 'subject' && 
			node.path?.length === coursePath.length &&
			node.path.every((segment, i) => segment === coursePath[i])
		);
		
		if (courseNode) {
			const topicNode = $contentStore.flatNodes.find(node => 
				node.node_type === 'topic' && 
				node.parent_id === courseNode.id && 
				node.slug === topicKey
			);
			
			if (topicNode) {
				const subtopicNode = $contentStore.flatNodes.find(node => 
					node.node_type === 'subtopic' && 
					node.parent_id === topicNode.id && 
					node.slug === subtopicKey
				);
				
				if (subtopicNode) {
					topicTitle = subtopicNode.title;
				}
			}
		}
	}
	
	else {
		topicName = topicKey;
		configPath = `${level}/${subject}/${topicKey}`;
		
		const coursePath = [level, subject];
		const courseNode = $contentStore.flatNodes.find(node => 
			node.node_type === 'subject' && 
			node.path?.length === coursePath.length &&
			node.path.every((segment, i) => segment === coursePath[i])
		);
		
		if (courseNode) {
			const topicNode = $contentStore.flatNodes.find(node => 
				node.node_type === 'topic' && 
				node.parent_id === courseNode.id && 
				node.slug === topicKey
			);
			
			if (topicNode) {
				topicTitle = topicNode.title;
			}
		}
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
