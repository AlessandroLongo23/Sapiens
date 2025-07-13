// import { notificationPopup } from '$lib/stores/notificationPopup.js';
import { supabase } from '$lib/supabase.js';

export const fetchTopics = async () => {
    const { data, error } = await supabase
        .from('topics')
        .select('*');

    if (error) {
        console.error('Error fetching topics:', error);
        throw error;
    }

    return data;
};

export const addTopic = async (topicName, topicDescription, topicLevel, topicYear, topicPath) => {
    const { data, error } = await supabase
        .from('topics')
        .insert({ name: topicName, description: topicDescription, level: topicLevel, year: topicYear, path: topicPath });
        
    if (error) {
        // notificationPopup.error('Errore nell\'aggiunta dell\'argomento');
        console.error('Error adding topic:', error);
        throw error;
    }

    // notificationPopup.success('Argomento aggiunto con successo');
    return data;
};

export const deleteTopic = async (topicId) => {
    try {
        const { error: availabilityError } = await supabase
            .from('topics-availability')
            .delete()
            .eq('topic_id', topicId);

        if (availabilityError) 
            throw availabilityError;

        const { error: topicError } = await supabase
            .from('topics')
            .delete()
            .eq('id', topicId);

        if (topicError) throw topicError;
        
        // notificationPopup.success('Argomento eliminato con successo');
    } catch (error) {
        console.error('Error deleting topic:', error);
        // notificationPopup.error('Errore durante l\'eliminazione dell\'argomento');
    }
};

export const updateTopic = async (topicId, editedName, editedDescription, editedLevel, editedYear, editedPath) => {
    try {
        const { error } = await supabase
            .from('topics')
            .update({ 
                name: editedName,
                description: editedDescription,
                level: editedLevel,
                year: editedYear,
                path: editedPath
            })
            .eq('id', topicId);

        if (error) throw error;
        
        // notificationPopup.success('Argomento aggiornato con successo');
    } catch (error) {
        console.error('Error updating topic:', error);
        // notificationPopup.error('Errore durante l\'aggiornamento dell\'argomento');
    }
};