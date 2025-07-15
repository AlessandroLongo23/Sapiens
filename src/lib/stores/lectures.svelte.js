import { supabase } from '$lib/supabase.js';

class LecturesStore {
	lectures = [];
	isLoading = true;
	error = null;

	async fetchLectures() {
		this.isLoading = true;
		this.error = null;
		try {
			const { data, error } = await supabase
				.from('lectures')
				.select(`
					*,
					student:student_id(id, name, last_name),
					subject:subject_id(id, name)
				`)
				.order('date', { ascending: true });

			if (error) throw error;
			this.lectures = data;
		} catch (error) {
			this.error = error.message;
			console.error('Error fetching lectures:', error);
		} finally {
			this.isLoading = false;
		}
	}

	async addLecture(lecture) {
		try {
			const { data, error } = await supabase
				.from('lectures')
				.insert(lecture)
				.select(`
					*,
					student:student_id(id, name, last_name),
					subject:subject_id(id, name)
				`);

			if (error) throw error;
			this.lectures = [...this.lectures, data[0]];
			return data[0];
		} catch (error) {
			console.error('Error adding lecture:', error);
			return null;
		}
	}

	async updateLecture(id, updates) {
		try {
			const { data, error } = await supabase
				.from('lectures')
				.update(updates)
				.eq('id', id)
				.select(`
					*,
					student:student_id(id, name, last_name),
					subject:subject_id(id, name)
				`);

			if (error) throw error;

			this.lectures = this.lectures.map(lecture => 
				lecture.id === id ? data[0] : lecture
			);
			
			return data[0];
		} catch (error) {
			console.error('Error updating lecture:', error);
			return null;
		}
	}

	async deleteLecture(id) {
		try {
			const { error } = await supabase
				.from('lectures')
				.delete()
				.eq('id', id);

			if (error) throw error;
			this.lectures = this.lectures.filter(lecture => lecture.id !== id);
			return true;
		} catch (error) {
			console.error('Error deleting lecture:', error);
			return false;
		}
	}
}

export const lecturesStore = new LecturesStore(); 