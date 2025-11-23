import { contentTree, type LevelNode, type SubjectNode, type ChapterNode, type TopicNode } from '$lib/data/content-tree';

export interface NavigationLink {
    label: string;
    url: string;
    subLabel?: string;
}

export interface NavigationResult {
    prev: NavigationLink | null;
    next: NavigationLink | null;
    parent: NavigationLink | null;
}

export function getTopicNavigation(
    levelId: string,
    subjectId: string,
    chapterId: string,
    topicId: string
): NavigationResult {
    const level = contentTree.find(l => l.id === levelId);
    if (!level) return { prev: null, next: null, parent: null };

    const subject = level.subjects.find(s => s.id === subjectId);
    if (!subject) return { prev: null, next: null, parent: null };

    const chapterIndex = subject.chapters.findIndex(c => c.id === chapterId);
    if (chapterIndex === -1) return { prev: null, next: null, parent: null };
    
    const chapter = subject.chapters[chapterIndex];
    const topicIndex = chapter.topics.findIndex(t => t.id === topicId);
    
    if (topicIndex === -1) return { prev: null, next: null, parent: null };

    const result: NavigationResult = {
        prev: null,
        next: null,
        parent: {
            label: chapter.name,
            subLabel: 'Capitolo',
            url: `/content/${levelId}/${subjectId}/${chapterId}`
        }
    };

    // Previous Topic
    if (topicIndex > 0) {
        const prevTopic = chapter.topics[topicIndex - 1];
        result.prev = {
            label: prevTopic.name,
            url: `/content/${levelId}/${subjectId}/${chapterId}/${prevTopic.id}/theory`
        };
    } else if (chapterIndex > 0) {
        // Previous Chapter (last topic)
        const prevChapter = subject.chapters[chapterIndex - 1];
        if (prevChapter.topics.length > 0) {
            const prevTopic = prevChapter.topics[prevChapter.topics.length - 1];
            result.prev = {
                label: prevTopic.name,
                subLabel: prevChapter.name,
                url: `/content/${levelId}/${subjectId}/${prevChapter.id}/${prevTopic.id}/theory`
            };
        }
    }

    // Next Topic
    if (topicIndex < chapter.topics.length - 1) {
        const nextTopic = chapter.topics[topicIndex + 1];
        result.next = {
            label: nextTopic.name,
            url: `/content/${levelId}/${subjectId}/${chapterId}/${nextTopic.id}/theory`
        };
    } else if (chapterIndex < subject.chapters.length - 1) {
        // Next Chapter (first topic)
        const nextChapter = subject.chapters[chapterIndex + 1];
        if (nextChapter.topics.length > 0) {
            const nextTopic = nextChapter.topics[0];
            result.next = {
                label: nextTopic.name,
                subLabel: nextChapter.name,
                url: `/content/${levelId}/${subjectId}/${nextChapter.id}/${nextTopic.id}/theory`
            };
        }
    }

    return result;
}

export function getChapterNavigation(
    levelId: string,
    subjectId: string,
    chapterId: string
): NavigationResult {
    const level = contentTree.find(l => l.id === levelId);
    if (!level) return { prev: null, next: null, parent: null };

    const subject = level.subjects.find(s => s.id === subjectId);
    if (!subject) return { prev: null, next: null, parent: null };

    const chapterIndex = subject.chapters.findIndex(c => c.id === chapterId);
    if (chapterIndex === -1) return { prev: null, next: null, parent: null };

    const result: NavigationResult = {
        prev: null,
        next: null,
        parent: {
            label: subject.name,
            subLabel: 'Materia',
            url: `/content/${levelId}/${subjectId}`
        }
    };

    if (chapterIndex > 0) {
        const prevChapter = subject.chapters[chapterIndex - 1];
        result.prev = {
            label: prevChapter.name,
            url: `/content/${levelId}/${subjectId}/${prevChapter.id}`
        };
    }

    if (chapterIndex < subject.chapters.length - 1) {
        const nextChapter = subject.chapters[chapterIndex + 1];
        result.next = {
            label: nextChapter.name,
            url: `/content/${levelId}/${subjectId}/${nextChapter.id}`
        };
    }

    return result;
}

export function getSubjectNavigation(
    levelId: string,
    subjectId: string
): NavigationResult {
    const level = contentTree.find(l => l.id === levelId);
    if (!level) return { prev: null, next: null, parent: null };

    const subjectIndex = level.subjects.findIndex(s => s.id === subjectId);
    if (subjectIndex === -1) return { prev: null, next: null, parent: null };

    const result: NavigationResult = {
        prev: null,
        next: null,
        parent: {
            label: level.name,
            subLabel: 'Livello',
            url: `/content/${levelId}`
        }
    };

    if (subjectIndex > 0) {
        const prevSubject = level.subjects[subjectIndex - 1];
        result.prev = {
            label: prevSubject.name,
            url: `/content/${levelId}/${prevSubject.id}`
        };
    }

    if (subjectIndex < level.subjects.length - 1) {
        const nextSubject = level.subjects[subjectIndex + 1];
        result.next = {
            label: nextSubject.name,
            url: `/content/${levelId}/${nextSubject.id}`
        };
    }

    return result;
}

