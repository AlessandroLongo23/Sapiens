import type { ContentNode } from '$lib/utils/tree';
import { nodePath } from '$lib/seo/slug';

export interface NavigationLink {
	label: string;
	url: string;
	subLabel?: string;
}

export interface LessonNavigation {
	prev: NavigationLink | null;
	next: NavigationLink | null;
	parent: NavigationLink | null;
}

/**
 * Previous / next lesson links for a topic, crossing chapter boundaries within
 * the same subject. Works on the database tree, so new lessons are picked up
 * automatically.
 */
export function lessonNavigation(ancestors: ContentNode[]): LessonNavigation {
	const empty: LessonNavigation = { prev: null, next: null, parent: null };
	if (ancestors.length < 4) return empty;

	const [level, subject, chapter, topic] = ancestors;
	const chapters = subject.children;
	const chapterIndex = chapters.findIndex((c) => c.id === chapter.id);
	const topicIndex = chapter.children.findIndex((t) => t.id === topic.id);
	if (chapterIndex === -1 || topicIndex === -1) return empty;

	const result: LessonNavigation = {
		prev: null,
		next: null,
		parent: {
			label: chapter.title,
			subLabel: 'Capitolo',
			url: nodePath([level, subject, chapter])
		}
	};

	if (topicIndex > 0) {
		const prev = chapter.children[topicIndex - 1];
		result.prev = { label: prev.title, url: nodePath([level, subject, chapter, prev]) };
	} else {
		for (let i = chapterIndex - 1; i >= 0; i--) {
			const prevChapter = chapters[i];
			if (prevChapter.children.length > 0) {
				const prev = prevChapter.children[prevChapter.children.length - 1];
				result.prev = {
					label: prev.title,
					subLabel: prevChapter.title,
					url: nodePath([level, subject, prevChapter, prev])
				};
				break;
			}
		}
	}

	if (topicIndex < chapter.children.length - 1) {
		const next = chapter.children[topicIndex + 1];
		result.next = { label: next.title, url: nodePath([level, subject, chapter, next]) };
	} else {
		for (let i = chapterIndex + 1; i < chapters.length; i++) {
			const nextChapter = chapters[i];
			if (nextChapter.children.length > 0) {
				const next = nextChapter.children[0];
				result.next = {
					label: next.title,
					subLabel: nextChapter.title,
					url: nodePath([level, subject, nextChapter, next])
				};
				break;
			}
		}
	}

	return result;
}
