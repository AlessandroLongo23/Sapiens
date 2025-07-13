import { fetchTopics } from '$lib/utils/topics.svelte.js';
import { supabase } from '$lib/supabase';
import { writable } from 'svelte/store';

export const selectedTopicStore = writable(null);
export const hoveredTopicId = writable(null);

const createTopicsStore = () => {
    const { subscribe, set, update } = writable({
        topics: [],
        loading: true,
        error: null
    });

    if (typeof window !== 'undefined') {
        const subscription = supabase
            .channel('topics_changes')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'topics'
                },
                async (payload) => {
                    const { data } = await supabase
                        .from('topics')
                        .select('*');
                    
                    if (data) {
                        set({
                            topics: data,
                            loading: false,
                            error: null
                        });
                    }
                }
            )
            .subscribe();
    }

    return {
        subscribe,
        fetchTopics: async () => {
            update(state => ({ ...state, loading: true }));
            try {
                const data = await fetchTopics();
                set({
                    topics: data,
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error('Error fetching topics:', error);
                set({
                    topics: [],
                    loading: false,
                    error: error.message
                });
            }
        },
        addTopic: (topic) => {
            update(state => ({
                ...state,
                topics: [...state.topics, topic]
            }));
        },
        deleteTopic: (topicId) => {
            selectedTopicStore.update(selectedTopic => 
                selectedTopic?.id === topicId ? null : selectedTopic
            );
            
            update(state => ({
                ...state,
                topics: state.topics.filter(topic => topic.id !== topicId)
            }));
        },
        updateTopic: (topicId, updatedTopic) => {
            selectedTopicStore.update(selectedTopic => 
                selectedTopic?.id === topicId ? updatedTopic : selectedTopic
            );
            
            update(state => ({
                ...state,
                topics: state.topics.map(topic => 
                    topic.id === topicId ? updatedTopic : topic
                )
            }));
        },
        selectTopic: (topicId) => {
            selectedTopicStore.update(currentSelectedTopic => {
                if (currentSelectedTopic?.id === topicId) {
                    return null;
                }

                return topicId ? { id: topicId } : null;
            });
        }
    };
};

export const topicsStore = createTopicsStore();

if (typeof window !== 'undefined') {
    topicsStore.fetchTopics();
} 