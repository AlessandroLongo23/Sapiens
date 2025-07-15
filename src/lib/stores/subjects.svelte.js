import { supabase } from '$lib/supabase.js';

// Subjects store
class SubjectsStore {
  subjects = $state([]);
  isLoading = $state(true);
  error = $state(null);

  async fetchSubjects() {
    this.isLoading = true;
    this.error = null;
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) throw error;
      this.subjects = data;
    } catch (error) {
      this.error = error.message;
      console.error('Error fetching subjects:', error);
    } finally {
      this.isLoading = false;
    }
  }

  async addSubject(subject) {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert(subject)
        .select();

      if (error) throw error;
      this.subjects = [...this.subjects, data[0]];
      return data[0];
    } catch (error) {
      console.error('Error adding subject:', error);
      return null;
    }
  }

  async updateSubject(id, updates) {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      this.subjects = this.subjects.map(subject => 
        subject.id === id ? data[0] : subject
      );
      
      return data[0];
    } catch (error) {
      console.error('Error updating subject:', error);
      return null;
    }
  }

  async deleteSubject(id) {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      this.subjects = this.subjects.filter(subject => subject.id !== id);
      return true;
    } catch (error) {
      console.error('Error deleting subject:', error);
      return false;
    }
  }
}

export const subjectsStore = new SubjectsStore(); 