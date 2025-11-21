import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { Subject } from '../constants/types';
import { storageService } from '../services/storage.service';

interface SubjectsContextType {
  subjects: Subject[];
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => Promise<Subject>;
  deleteSubject: (id: string) => Promise<void>;
  getSubjectById: (id: string) => Subject | undefined;
}

export const SubjectsContext = createContext<SubjectsContextType | undefined>(undefined);

export function SubjectsProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    const loadedSubjects = await storageService.getSubjects();
    setSubjects(loadedSubjects);
  };

  const addSubject = async (subjectData: Omit<Subject, 'id' | 'createdAt'>) => {
    const newSubject: Subject = {
      ...subjectData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    const updatedSubjects = [...subjects, newSubject];
    setSubjects(updatedSubjects);
    await storageService.saveSubjects(updatedSubjects);

    return newSubject;
  };

  const deleteSubject = async (id: string) => {
    console.log('Deleting subject:', id);
    
    // Delete subject from state and storage
    const updatedSubjects = subjects.filter((subject) => subject.id !== id);
    setSubjects(updatedSubjects);
    await storageService.saveSubjects(updatedSubjects);
    
    console.log('Subject deleted successfully');
    // Note: Tasks will be deleted by the caller using TasksContext.deleteTasksBySubjectId
  };

  const getSubjectById = (id: string) => {
    return subjects.find((subject) => subject.id === id);
  };

  return (
    <SubjectsContext.Provider
      value={{
        subjects,
        addSubject,
        deleteSubject,
        getSubjectById,
      }}
    >
      {children}
    </SubjectsContext.Provider>
  );
}
