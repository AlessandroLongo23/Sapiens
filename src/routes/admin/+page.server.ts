import supabase from '$lib/supabase';
import { configs } from '$lib/exercises/config';

export interface TopicStatus {
	id: string;
	title: string;
	path: string;
	hasTheory: boolean;
	hasFormulary: boolean;
	hasExercises: boolean;
	hasFlashcards: boolean;
	missingCount: number;
}

export interface ContentStats {
	levels: number;
	subjects: number;
	chapters: number;
	topics: number;
	topicsWithTheory: number;
	topicsWithFormulary: number;
	topicsWithExercises: number;
	topicsWithFlashcards: number;
	fullyComplete: number;
	levelBreakdown: LevelBreakdown[];
	topicsNeedingWork: TopicStatus[];
	contentGaps: ContentGaps;
}

export interface ContentGaps {
	missingTheory: number;
	missingFormulary: number;
	missingExercises: number;
	missingFlashcards: number;
}

export interface LevelBreakdown {
	id: string;
	title: string;
	slug: string;
	subjects: number;
	chapters: number;
	topics: number;
	readyTopics: number;
	theoryCount: number;
	formularyCount: number;
	exercisesCount: number;
	flashcardsCount: number;
}

export async function load({ locals }) {
	const { session, user } = locals;

	try {
		// Fetch all content nodes
		const { data: nodes, error } = await supabase
			.from('content_nodes')
			.select('*')
			.order('position', { ascending: true });

		if (error) {
			console.error('Error fetching content nodes:', error);
			return { stats: null, session, user };
		}

		if (!nodes || nodes.length === 0) {
			return { stats: null, session, user };
		}

		// Get exercise config paths to check which topics have exercises
		const exercisePaths = new Set(Object.keys(configs));

		// Create a lookup map for nodes by ID
		const nodeMap = new Map(nodes.map(n => [n.id, n]));

		// Calculate stats
		const levels = nodes.filter(n => n.type === 'level');
		const subjects = nodes.filter(n => n.type === 'subject');
		const chapters = nodes.filter(n => n.type === 'chapter');
		const topics = nodes.filter(n => n.type === 'topic');

		// Helper to build full path for a topic
		function buildTopicPath(topic: any): string {
			const path: string[] = [];
			let current = topic;
			
			while (current) {
				path.unshift(current.slug);
				current = nodeMap.get(current.parent_id);
			}
			
			return path.join('/');
		}

		// Helper to build readable path for display
		function buildDisplayPath(topic: any): string {
			const titles: string[] = [];
			let current = topic;
			
			while (current && current.type !== 'level') {
				titles.unshift(current.title);
				current = nodeMap.get(current.parent_id);
			}
			
			return titles.slice(0, -1).join(' › '); // Exclude topic title itself
		}

		// Helper to check if content is not empty
		function hasContent(value: any): boolean {
			return value && typeof value === 'string' && value.trim().length > 0;
		}

		// Build topic status for all topics
		const topicStatuses: TopicStatus[] = topics.map(topic => {
			const topicPath = buildTopicPath(topic);
			const hasTheory = hasContent(topic.theory);
			const hasFormulary = hasContent(topic.formulary);
			const hasExercises = exercisePaths.has(topicPath);
			const hasFlashcards = hasContent(topic.flashcards);
			
			let missingCount = 0;
			if (!hasTheory) missingCount++;
			if (!hasFormulary) missingCount++;
			if (!hasExercises) missingCount++;
			// Don't count flashcards as missing since they're not implemented yet
			
			return {
				id: topic.id,
				title: topic.title,
				path: buildDisplayPath(topic),
				hasTheory,
				hasFormulary,
				hasExercises,
				hasFlashcards,
				missingCount
			};
		});

		// Topics needing work (sorted by most missing content, limit to 8)
		const topicsNeedingWork = topicStatuses
			.filter(t => t.missingCount > 0)
			.sort((a, b) => b.missingCount - a.missingCount)
			.slice(0, 8);

		// Calculate content gaps
		const contentGaps: ContentGaps = {
			missingTheory: topics.length - topicStatuses.filter(t => t.hasTheory).length,
			missingFormulary: topics.length - topicStatuses.filter(t => t.hasFormulary).length,
			missingExercises: topics.length - topicStatuses.filter(t => t.hasExercises).length,
			missingFlashcards: topics.length - topicStatuses.filter(t => t.hasFlashcards).length
		};

		// Calculate topic-level stats
		const topicsWithTheory = topicStatuses.filter(t => t.hasTheory);
		const topicsWithFormulary = topicStatuses.filter(t => t.hasFormulary);
		const topicsWithExercises = topicStatuses.filter(t => t.hasExercises);
		const topicsWithFlashcards = topicStatuses.filter(t => t.hasFlashcards);

		// Fully complete = has theory + formulary + exercises
		const fullyComplete = topicStatuses.filter(t => 
			t.hasTheory && t.hasFormulary && t.hasExercises
		);

		// Build level breakdown with detailed stats
		const levelBreakdown: LevelBreakdown[] = levels.map(level => {
			const levelSubjects = subjects.filter(s => s.parent_id === level.id);
			const levelSubjectIds = new Set(levelSubjects.map(s => s.id));
			
			const levelChapters = chapters.filter(c => levelSubjectIds.has(c.parent_id));
			const levelChapterIds = new Set(levelChapters.map(c => c.id));
			
			const levelTopicIds = new Set(topics.filter(t => levelChapterIds.has(t.parent_id)).map(t => t.id));
			const levelTopicStatuses = topicStatuses.filter(t => levelTopicIds.has(t.id));
			
			return {
				id: level.id,
				title: level.title,
				slug: level.slug,
				subjects: levelSubjects.length,
				chapters: levelChapters.length,
				topics: levelTopicStatuses.length,
				readyTopics: levelTopicStatuses.filter(t => t.hasTheory && t.hasFormulary && t.hasExercises).length,
				theoryCount: levelTopicStatuses.filter(t => t.hasTheory).length,
				formularyCount: levelTopicStatuses.filter(t => t.hasFormulary).length,
				exercisesCount: levelTopicStatuses.filter(t => t.hasExercises).length,
				flashcardsCount: levelTopicStatuses.filter(t => t.hasFlashcards).length
			};
		});

		const stats: ContentStats = {
			levels: levels.length,
			subjects: subjects.length,
			chapters: chapters.length,
			topics: topics.length,
			topicsWithTheory: topicsWithTheory.length,
			topicsWithFormulary: topicsWithFormulary.length,
			topicsWithExercises: topicsWithExercises.length,
			topicsWithFlashcards: topicsWithFlashcards.length,
			fullyComplete: fullyComplete.length,
			levelBreakdown,
			topicsNeedingWork,
			contentGaps
		};

		return { stats, session, user };
	} catch (err) {
		console.error('Error in admin dashboard load:', err);
		return { stats: null, session, user };
	}
}
