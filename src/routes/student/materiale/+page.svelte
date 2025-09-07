<script>
	import { studentsStore } from '$lib/stores/students/students.js';
	import { contentStore } from '$lib/stores/content/content.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import * as ls from 'lucide-svelte';

	import TopicCard from '$lib/components/cards/TopicCard.svelte';
	import ReviewBox from '$lib/components/ReviewBox.svelte';
	import { fetchStudentReview } from '$lib/stores/reviews/reviews.svelte.js';
	import StreakWidget from '$lib/components/admin/widgets/StreakWidget.svelte';

	let { data } = $props();
	let { user } = $derived(data);
	let student = $derived($studentsStore.students.find(s => s.id === user.id));
	
	let activeTab = $state("all");
	let searchQuery = $state("");
	let sortBy = $state("default");
	let groupBy = $state("subject");

	const subjectCategories = {
		'matematica': { color: 'from-blue-500 to-blue-600', icon: ls.Calculator, name: 'Matematica' },
		'informatica': { color: 'from-purple-500 to-purple-600', icon: ls.Laptop, name: 'Informatica' },
		'fisica': { color: 'from-orange-500 to-orange-600', icon: ls.Atom, name: 'Fisica' },
		'chimica': { color: 'from-green-500 to-green-600', icon: ls.Flask, name: 'Chimica' },
		'Analisi I': { color: 'from-red-500 to-red-600', icon: ls.LineChart, name: 'Analisi I' },
	};

	let allTopics = $derived.by(() => {
		if ($contentStore.loading || !$contentStore.flatNodes || $contentStore.flatNodes.length === 0) {
			return [];
		}
		
		const collected = [];
		
		const topicNodes = $contentStore.flatNodes.filter(node => node.node_type === 'topic');

		const assignedTopics = topicNodes.filter(node => student?.assigned_topics?.includes(node.id));
		
		for (const topic of assignedTopics) {
			const pathParts = topic.path || [];
			const level = pathParts[0] || '';
			const subject = pathParts[1] || '';
			const year = pathParts[2] || '';
			const topicSlug = pathParts[3] || '';
			
			const subtopics = $contentStore.flatNodes.filter(node => 
				node.parent_id === topic.id && node.node_type === 'subtopic'
			);
			
			collected.push({
				...topic,
				title: topic.title || '',
				description: topic.description || '',
				icon: topic.icon || '',
				level: level,
				subject: subject,
				year: year,
				key: topicSlug,
				child_index: topic.child_index, 
				subtopicCount: subtopics.length,
				subtopics: subtopics.reduce((acc, subtopic) => {
					acc[subtopic.slug] = {
						title: subtopic.title,
						description: subtopic.description,
						icon: subtopic.icon
					};
					return acc;
				}, {}),
				memory: Math.floor(Math.random() * 100),
				lastAccessed: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000)
			});
		}
		
		return collected;
	});

	let continuaTopics = $derived.by(() => {
		return allTopics
			.filter(t => t.memory > 0 && t.memory < 100)
			.sort((a, b) => {
				const aIndex = typeof a.child_index === 'number' ? a.child_index : Number.POSITIVE_INFINITY;
				const bIndex = typeof b.child_index === 'number' ? b.child_index : Number.POSITIVE_INFINITY;
				
				if (aIndex !== bIndex) return aIndex - bIndex;
				return b.memory - a.memory;
			});
	});

	let filteredTopics = $derived.by(() => {
		let filtered = [...allTopics];
		
		if (activeTab !== "all") {
			filtered = filtered.filter(topic => topic.subject === activeTab);
		}
		
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(topic => 
				topic.title?.toLowerCase().includes(query) || 
				topic.description?.toLowerCase().includes(query) ||
				topic.subject?.toLowerCase().includes(query)
			);
		}
		
		switch (sortBy) {
			case "memory":
				filtered.sort((a, b) => b.memory - a.memory);
				break;
			case "recent":
				filtered.sort((a, b) => b.lastAccessed - a.lastAccessed);
				break;
			case "alphabetical":
				filtered.sort((a, b) => a.title.localeCompare(b.title));
				break;
			case "level":
				filtered.sort((a, b) => {
					if (a.level !== b.level) return a.level.localeCompare(b.level);
					if (a.subject !== b.subject) return a.subject.localeCompare(b.subject);
					if (a.year && b.year) return a.year.localeCompare(b.year);
					return 0;
				});
				break;
			case "index":
				filtered.sort((a, b) => {
					const aIndex = typeof a.child_index === 'number' ? a.child_index : Number.POSITIVE_INFINITY;
					const bIndex = typeof b.child_index === 'number' ? b.child_index : Number.POSITIVE_INFINITY;
					return aIndex - bIndex;
				});
				break;
			default:
				
				filtered.sort((a, b) => {
					const aIndex = typeof a.child_index === 'number' ? a.child_index : Number.POSITIVE_INFINITY;
					const bIndex = typeof b.child_index === 'number' ? b.child_index : Number.POSITIVE_INFINITY;
					
					if (aIndex !== bIndex) return aIndex - bIndex;
					
					
					if (a.memory > 0 && a.memory < 100 && (b.memory === 0 || b.memory === 100)) return -1;
					if (b.memory > 0 && b.memory < 100 && (a.memory === 0 || a.memory === 100)) return 1;
					return b.lastAccessed - a.lastAccessed;
				});
		}
		
		return filtered;
	});

	let groupedTopics = $derived.by(() => {
		const grouped = {};
		
		allTopics.forEach(topic => {
			const key = groupBy === 'subject' ? topic.subject : (topic.year || 'university');
			
			if (!grouped[key]) {
				grouped[key] = [];
			}
			grouped[key].push(topic);
		});
		
		Object.keys(grouped).forEach(key => {
			
			grouped[key].sort((a, b) => {
				const aIndex = typeof a.child_index === 'number' ? a.child_index : Number.POSITIVE_INFINITY;
				const bIndex = typeof b.child_index === 'number' ? b.child_index : Number.POSITIVE_INFINITY;
				
				if (aIndex !== bIndex) return aIndex - bIndex;
				return b.memory - a.memory;
			});
		});
		
		return grouped;
	});

	let streak = $state(5);
	let nextMilestone = $state(7);
	
	
	let studentReview = $state(null);
	let hasReviewed = $state(false);
	let reviewId = $state(null);
	let reviewRating = $state(0);
	let reviewText = $state('');
	let loadingReview = $state(true);

	onMount(async () => {
		try {
			loadingReview = true;
			
			if (!student?.id) {
				console.log('No student ID available, skipping review fetch');
				loadingReview = false;
				return;
			}
			
			const review = await fetchStudentReview(student.id);
			
			if (review) {
				studentReview = review;
				hasReviewed = true;
				reviewId = review.id;
				reviewRating = review.rating;
				reviewText = review.review;
			} else {
				hasReviewed = false;
				reviewId = null;
				reviewRating = 0;
				reviewText = '';
			}
		} catch (error) {
			console.error('Error fetching student review:', error);
			hasReviewed = false;
		} finally {
			loadingReview = false;
		}
	});

	function formatDate(date) {
		return new Intl.DateTimeFormat('it-IT', { 
			day: 'numeric', 
			month: 'short'
		}).format(date);
	}
</script>

<div class="bg-white dark:bg-zinc-900 min-h-screen pb-8 sm:pb-12">
	<div class="px-3 sm:px-6 lg:px-8">
		<div class="flex flex-col lg:flex-row justify-center">
			<div class="hidden lg:block w-96 flex-shrink-0 p-4">
				<div class="sticky top-24 space-y-6">
					<StreakWidget streak={streak} nextMilestone={nextMilestone} />
					
				{#if loadingReview}
					<div class="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm p-6 flex justify-center items-center h-40">
						<ls.Loader class="h-6 w-6 animate-spin text-purple-500" />
					</div>
				{:else}
					<ReviewBox 
						studentId={student?.id}
						studentName={`${student?.first_name || ''} ${student?.last_name || ''}`}
						hasReviewed={hasReviewed}
						existingRating={reviewRating}
						existingReview={reviewText}
						reviewId={reviewId}
					/>
				{/if}
				</div>
			</div>

			<div class="flex-1 max-w-4xl px-2 sm:px-4 lg:px-8 mt-4 sm:mt-6">
			<section class="mb-6 sm:mb-8 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm p-4 sm:p-6">
				<div class="flex items-center justify-between mb-4">
					<h2 class="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
						<div class="text-blue-600">
							<ls.BookOpen class="h-4 sm:h-5 w-4 sm:w-5" />
						</div>
						<span>Continua a studiare</span>
					</h2>
				</div>
			
				<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
					{#each continuaTopics.slice(0, 3) as topic}
						<button
							onclick={() => goto(`/student/materiale/${topic.level}/${topic.subject}/${topic.year}/${topic.key}/`)}
						 	class="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm hover:shadow-md transition-all p-3 sm:p-4 flex gap-3 sm:gap-4 items-center"
						>
							<div class="w-12 h-12 sm:w-16 sm:h-16 overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center rounded-lg">
								<img src={topic.icon} alt={topic.title} class="w-8 h-8 sm:w-12 sm:h-12 object-contain" />
							</div>
							
							<div class="flex-1 min-w-0">
								<div class="flex justify-between items-center">
									<h3 class="font-semibold text-zinc-900 dark:text-zinc-100 text-sm sm:text-base truncate">{topic.title}</h3>
								</div>
								
								<div class="text-xs text-zinc-500 dark:text-zinc-400 my-1 sm:my-1.5 flex items-center gap-1">
									<span class="capitalize truncate">{topic.subject.replace('-', ' ')}</span>
									<span class="inline-block flex-shrink-0 w-1 h-1 bg-zinc-400 dark:bg-zinc-500 rounded-full"></span>
									<span class="flex-shrink-0">{topic.level === 'superiori' ? `${topic.year}° anno` : 'Università'}</span>
								</div>
								
								<div class="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-1.5 sm:h-2">
									<div class="bg-gradient-to-r from-blue-500 to-indigo-600 h-1.5 sm:h-2 rounded-full" style="width: {topic.memory}%"></div>
								</div>
							</div>
						</button>
					{/each}
				</div>
			</section>

			<section class="flex flex-col gap-6 sm:gap-8 mb-8 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm p-4 sm:p-6 search-section">
				<div class="flex flex-col gap-4 w-full">
					<div class="flex items-center justify-between">
						<h2 class="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
							<div class="text-purple-600">
								<ls.Search class="h-5 w-5" />
							</div>
							<span>Cerca e filtra</span>
						</h2>
						
						<div class="flex items-center gap-2">
							<div class="flex bg-zinc-100 dark:bg-zinc-700 rounded-lg overflow-hidden">
								<button
									class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium {groupBy === 'subject' ? 'bg-blue-600 text-white' : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600'} transition-colors"
									onclick={() => groupBy = 'subject'}
								>
									Materia
								</button>
								<button
									class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium {groupBy === 'year' ? 'bg-blue-600 text-white' : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600'} transition-colors"
									onclick={() => groupBy = 'year'}
								>
									Anno
								</button>
							</div>
						</div>
					</div>
					
					<div class="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
						<div class="relative flex-1">
							<ls.Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
							<input 
								type="text" 
								placeholder="Cerca argomenti..."
								bind:value={searchQuery}
								class="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none border border-zinc-200 dark:border-zinc-600 text-sm"
							/>
						</div>
						
						<div class="relative w-full sm:w-auto">
							<select 
								bind:value={sortBy}
								class="appearance-none w-full px-4 py-2 sm:py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 pr-9 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer border border-zinc-200 dark:border-zinc-600 text-sm"
							>
								<option value="default">Consigliati</option>
								<option value="index">Ordine personalizzato</option>
								<option value="memory">Memoria</option>
								<option value="recent">Recenti</option>
								<option value="alphabetical">A-Z</option>
								<option value="level">Livello</option>
							</select>
							<ls.ChevronDown class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
						</div>
					</div>
				</div>

				<div class="flex flex-col gap-3">
					<div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
						<button 
							class="px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium {activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600'} transition-colors whitespace-nowrap"
							onclick={() => activeTab = 'all'}
						>
							Tutti
						</button>
						
						{#each Object.keys(groupedTopics) as groupKey}
							{#if groupBy === 'subject' && subjectCategories[groupKey]}
								{@const SubjectIcon = subjectCategories[groupKey].icon}
								<button 
									class="px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium {activeTab === groupKey ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600'} transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap"
									onclick={() => activeTab = groupKey}
								>
									<SubjectIcon class="h-3 w-3 sm:h-4 sm:w-4" />
									{subjectCategories[groupKey].name}
								</button>
							{:else if groupBy === 'year'}
								<button 
									class="px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium {activeTab === groupKey ? 'bg-blue-600 text-white' : 'bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-600'} transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap"
									onclick={() => activeTab = groupKey}
								>
									{#if groupKey === 'university'}
										<ls.GraduationCap class="h-3 w-3 sm:h-4 sm:w-4" />
									{:else}
										<ls.BookOpen class="h-3 w-3 sm:h-4 sm:w-4" />
									{/if}
									{groupKey === 'university' ? 'Università' : `${groupKey}° anno`}
								</button>
							{/if}
						{/each}
					</div>
				</div>
			
				{#if !searchQuery}
					<div class="flex flex-col gap-12">
						{#each Object.keys(groupedTopics).slice(0, 3) as groupKey}
							<div class="flex flex-col gap-4">
								<div class="flex items-center justify-between">
									<h2 class="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
										{#if groupBy === 'subject' && subjectCategories[groupKey]}
											{@const SubjectIcon = subjectCategories[groupKey].icon}
											<div class="h-8 w-8 rounded-lg bg-gradient-to-br {subjectCategories[groupKey].color} flex items-center justify-center text-white">
												<SubjectIcon class="h-5 w-5" />
											</div>
											<span>{subjectCategories[groupKey].name}</span>
										{:else if groupBy === 'year'}
											<div class="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white">
												{#if groupKey === 'university'}
													<ls.GraduationCap class="h-5 w-5" />
												{:else}
													<ls.BookOpen class="h-5 w-5" />
												{/if}
											</div>
											<span>{groupKey === 'university' ? 'Università' : `${groupKey}° anno`}</span>
										{/if}
									</h2>
								</div>
								
								<div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
									{#each groupedTopics[groupKey]as topic}
										<TopicCard
											title={topic.title} 
											description={topic.description} 
											icon={topic.icon} 
											path={topic.path}
											level={topic.level}
											subject={topic.subject}
											year={topic.year}
											key={topic.level === 'university' ? topic.year : topic.key}
											subtopics={topic.subtopics}
										/>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<section class="mb-8">
						<div class="bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-100 dark:border-zinc-700 p-6">
							{#if filteredTopics.length > 0}
								<div class="flex items-center justify-between mb-4">
									<h2 class="text-xl font-bold text-zinc-900 dark:text-white flex items-center gap-2">
										<div class="text-blue-600">
											<ls.Search class="h-5 w-5" />
										</div>
										<span>Risultati ricerca ({filteredTopics.length})</span>
									</h2>
								</div>
								
								<div class="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
									{#each filteredTopics as topic}
										<TopicCard
											title={topic.title} 
											description={topic.description} 
											icon={topic.icon} 
											path={topic.path}
											level={topic.level}
											subject={topic.subject}
											year={topic.year}
											key={topic.key}
											subtopics={topic.subtopics}
										/>
									{/each}
								</div>
							{:else}
								<div class="flex flex-col items-center justify-center py-16 text-center">
									<div class="bg-zinc-100 dark:bg-zinc-700 rounded-full p-4 mb-6">
										<ls.Search class="h-8 w-8 text-zinc-500 dark:text-zinc-400" />
									</div>
									<h3 class="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Nessun argomento trovato</h3>
									<p class="text-zinc-500 dark:text-zinc-400 max-w-md">
										Prova a modificare i filtri di ricerca o a selezionare un'altra categoria.
									</p>
								</div>
							{/if}
						</div>
					</section>
				{/if}
			</section>
			</div>
		</div>
	</div>
</div>