import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Task, Subject } from '../constants/types';
import { storageService } from '../services/storage.service';
import { notificationService } from '../services/notification.service';

interface TasksContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>, subject: Subject) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>, subject: Subject) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  deleteTasksBySubjectId: (subjectId: string) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  clearAllTasks: () => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
}

export const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
    notificationService.requestPermissions();
  }, []);

  const loadTasks = async () => {
    const loadedTasks = await storageService.getTasks();
    setTasks(loadedTasks);
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt'>, subject: Subject) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    await storageService.saveTasks(updatedTasks);

    // Schedule notifications
    await notificationService.scheduleTaskNotifications(newTask, subject);
  };

  const updateTask = async (id: string, updates: Partial<Task>, subject: Subject) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updates } : task
    );
    setTasks(updatedTasks);
    await storageService.saveTasks(updatedTasks);

    // Cancel old notifications
    await notificationService.cancelTaskNotifications(id);

    // Reschedule if deadline or notifications changed
    if (updates.deadline || updates.notificationMinutes) {
      const updatedTask = updatedTasks.find((t) => t.id === id);
      if (updatedTask) {
        await notificationService.scheduleTaskNotifications(updatedTask, subject);
      }
    }
  };

  const deleteTask = async (id: string) => {
    console.log('Deleting task:', id);
    
    // Cancel notifications first
    await notificationService.cancelTaskNotifications(id);
    
    // Remove from state
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    
    // Save to storage
    await storageService.saveTasks(updatedTasks);
    
    console.log('Task deleted successfully');
  };

  const toggleTaskComplete = async (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    await storageService.saveTasks(updatedTasks);
  };

  const deleteTasksBySubjectId = async (subjectId: string) => {
    console.log('Deleting tasks for subject:', subjectId);
    
    // Find tasks to delete
    const tasksToDelete = tasks.filter((task) => task.subjectId === subjectId);
    
    // Cancel notifications for each task
    for (const task of tasksToDelete) {
      await notificationService.cancelTaskNotifications(task.id);
    }
    
    // Remove from state
    const updatedTasks = tasks.filter((task) => task.subjectId !== subjectId);
    setTasks(updatedTasks);
    
    // Save to storage
    await storageService.saveTasks(updatedTasks);
    
    console.log(`Deleted ${tasksToDelete.length} tasks`);
  };

  const clearAllTasks = async () => {
    console.log('Clearing all tasks');
    
    // Cancel all notifications
    await notificationService.cancelAllNotifications();
    
    // Clear state
    setTasks([]);
    
    // Clear storage
    await storageService.saveTasks([]);
    
    console.log('All tasks cleared successfully');
  };

  const getTaskById = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        deleteTasksBySubjectId,
        toggleTaskComplete,
        clearAllTasks,
        getTaskById,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
