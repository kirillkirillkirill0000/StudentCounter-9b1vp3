import AsyncStorage from '@react-native-async-storage/async-storage';
import { Subject, Task } from '../constants/types';

const SUBJECTS_KEY = 'student_counter_subjects';
const TASKS_KEY = 'student_counter_tasks';

export const storageService = {
  // Subjects
  async getSubjects(): Promise<Subject[]> {
    try {
      const data = await AsyncStorage.getItem(SUBJECTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading subjects:', error);
      return [];
    }
  },

  async saveSubjects(subjects: Subject[]): Promise<void> {
    try {
      await AsyncStorage.setItem(SUBJECTS_KEY, JSON.stringify(subjects));
    } catch (error) {
      console.error('Error saving subjects:', error);
      throw error;
    }
  },

  // Tasks
  async getTasks(): Promise<Task[]> {
    try {
      const data = await AsyncStorage.getItem(TASKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw error;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([SUBJECTS_KEY, TASKS_KEY]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};
