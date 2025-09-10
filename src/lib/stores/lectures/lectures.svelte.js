// import { supabase } from '$lib/supabase.js';

// export const fetchLectures = async () => {
// 	try {
// 		const { data, error } = await supabase
// 			.from('lectures')
// 			.select('*')
// 			.order('date', { ascending: true });

// 		if (error) {
// 			console.error('Error fetching lectures:', error);
// 			throw error;
// 		}

// 		return data;
// 	} catch (error) {
// 		console.error('Error fetching lectures:', error);
// 		throw error;
// 	}
// }

// export const addLecture = async (lecture) => {
// 	try {
// 		const { data, error } = await supabase
// 			.from('lectures')
// 			.insert(lecture)

// 		if (error) {
// 			console.error('Error adding lecture:', error);
// 			throw error;
// 		}

// 		return data;
// 	} catch (error) {
// 		console.error('Error adding lecture:', error);
// 		return null;
// 	}
// }

// export const updateLecture = async (id, updates) => {
// 	try {
// 		const { data, error } = await supabase
// 			.from('lectures')
// 			.update(updates)
// 			.eq('id', id)

// 		if (error) {
// 			console.error('Error updating lecture:', error);
// 			throw error;
// 		}

// 		return data;
// 	} catch (error) {
// 		console.error('Error updating lecture:', error);
// 		return null;
// 	}
// }

// export const deleteLecture = async (id) => {
// 	try {
// 		const { data, error } = await supabase
// 			.from('lectures')
// 			.delete()
// 			.eq('id', id);

// 		if (error) {
// 			console.error('Error deleting lecture:', error);
// 			throw error;
// 		}

// 		return data;
// 	} catch (error) {
// 		console.error('Error deleting lecture:', error);
// 		return false;
// 	}
// }