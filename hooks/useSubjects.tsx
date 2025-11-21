import { useContext } from 'react';
import { SubjectsContext } from '../contexts/SubjectsContext';

export function useSubjects() {
  const context = useContext(SubjectsContext);
  if (!context) {
    throw new Error('useSubjects must be used within SubjectsProvider');
  }
  return context;
}
