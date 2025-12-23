import supabase from '$lib/supabase';
import { configs } from '$lib/exercises/config';

interface ContentStats {
	levels: number;
	subjects: number;
	chapters: number;
	topics: number;
	topicsWithTheory: number;
	topicsWithFormulary: number;
	topicsWithExercises: number;
	levelBreakdown: LevelBreakdown[];
}

interface LevelBreakdown {
	id: string;
	title: string;
	subjects: number;
	chapters: number;
	topics: number;
	readyTopics: number;
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

		// Get exercise config paths to check which topics have exercises
		const exercisePaths = new Set(Object.keys(configs));

		// Calculate stats
		const levels = nodes.filter(n => n.type === 'level');
		const subjects = nodes.filter(n => n.type === 'subject');
		const chapters = nodes.filter(n => n.type === 'chapter');
		const topics = nodes.filter(n => n.type === 'topic');

		const topicsWithTheory = topics.filter(t => t.theory && t.theory.trim() !== '');
		const topicsWithFormulary = topics.filter(t => t.formulary && t.formulary.trim() !== '');
		
		// Check exercises based on config paths
		const topicsWithExercises = topics.filter(topic => {
			// Build the path for this topic
			const topicPath = buildTopicPath(nodes, topic);
			return exercisePaths.has(topicPath);
		});

		// Build level breakdown
		const levelBreakdown: LevelBreakdown[] = levels.map(level => {
			const levelSubjects = subjects.filter(s => s.parent_id === level.id);
			const levelSubjectIds = new Set(levelSubjects.map(s => s.id));
			
			const levelChapters = chapters.filter(c => levelSubjectIds.has(c.parent_id));
			const levelChapterIds = new Set(levelChapters.map(c => c.id));
			
			const levelTopics = topics.filter(t => levelChapterIds.has(t.parent_id));
			
			const readyTopics = levelTopics.filter(t => {
				const hasTheory = t.theory && t.theory.trim() !== '';
				const hasFormulary = t.formulary && t.formulary.trim() !== '';
				const topicPath = buildTopicPath(nodes, t);
				const hasExercises = exercisePaths.has(topicPath);
				return hasTheory && hasFormulary && hasExercises;
			});

			return {
				id: level.id,
				title: level.title,
				subjects: levelSubjects.length,
				chapters: levelChapters.length,
				topics: levelTopics.length,
				readyTopics: readyTopics.length
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
			levelBreakdown
		};

		return { stats, session, user };
	} catch (err) {
		console.error('Error in admin dashboard load:', err);
		return { stats: null, session, user };
	}
}

function buildTopicPath(nodes: any[], topic: any): string {
	const path: string[] = [];
	let current = topic;
	
	while (current) {
		path.unshift(current.slug);
		current = nodes.find(n => n.id === current.parent_id);
	}
	
	return path.join('/');
}

